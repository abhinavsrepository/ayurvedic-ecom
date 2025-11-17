import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

/**
 * MMKV storage instance for sync queue persistence
 */
const mmkvStorage = new MMKV({
  id: 'sync-storage',
});

/**
 * Sync operation types
 */
export type SyncOperationType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'FAVORITE'
  | 'CART'
  | 'ORDER'
  | 'REVIEW';

/**
 * Sync status types
 */
export type SyncStatus = 'pending' | 'syncing' | 'success' | 'failed';

/**
 * Sync queue item interface
 */
export interface SyncQueueItem {
  id: string;
  type: SyncOperationType;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  headers?: Record<string, string>;
  status: SyncStatus;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  lastAttemptAt?: string;
  errorMessage?: string;
}

/**
 * Sync result interface
 */
export interface SyncResult {
  success: number;
  failed: number;
  total: number;
  errors: Array<{
    itemId: string;
    error: string;
  }>;
}

/**
 * Sync store state interface
 */
interface SyncState {
  syncQueue: SyncQueueItem[];
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncProgress: {
    current: number;
    total: number;
  };
  syncResult: SyncResult | null;
}

/**
 * Sync store actions interface
 */
interface SyncActions {
  addToQueue: (
    item: Omit<
      SyncQueueItem,
      'id' | 'status' | 'retryCount' | 'createdAt'
    >
  ) => string;
  removeFromQueue: (id: string) => void;
  updateQueueItem: (id: string, updates: Partial<SyncQueueItem>) => void;
  clearQueue: () => void;
  clearFailedItems: () => void;
  sync: () => Promise<SyncResult>;
  retryFailed: () => Promise<SyncResult>;
  getPendingCount: () => number;
  getFailedCount: () => number;
}

/**
 * Complete sync store type
 */
export type SyncStore = SyncState & SyncActions;

/**
 * MMKV storage adapter for Zustand
 */
const mmkvStorageAdapter = {
  getItem: (name: string): string | null => {
    const value = mmkvStorage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    mmkvStorage.set(name, value);
  },
  removeItem: (name: string): void => {
    mmkvStorage.delete(name);
  },
};

/**
 * Execute sync request
 * @param item - Queue item to sync
 * @returns Success status
 */
const executeSyncRequest = async (item: SyncQueueItem): Promise<boolean> => {
  try {
    // This is a placeholder implementation
    // In production, replace with your actual API client
    const response = await fetch(item.endpoint, {
      method: item.method,
      headers: {
        'Content-Type': 'application/json',
        ...item.headers,
      },
      body: item.data ? JSON.stringify(item.data) : undefined,
    });

    return response.ok;
  } catch (error) {
    console.error('Sync request failed:', error);
    return false;
  }
};

/**
 * Sync Store
 *
 * Manages offline sync queue for operations performed while offline.
 * Automatically queues operations and syncs when connection is restored.
 * Includes retry logic and error handling.
 *
 * @example
 * ```tsx
 * const { addToQueue, sync, syncQueue, isSyncing } = useSyncStore();
 *
 * // Add operation to queue
 * addToQueue({
 *   type: 'CART',
 *   endpoint: '/api/cart',
 *   method: 'POST',
 *   data: { productId: '123', quantity: 1 },
 *   maxRetries: 3
 * });
 *
 * // Sync all pending operations
 * const result = await sync();
 * console.log(`Synced ${result.success} items`);
 * ```
 */
export const useSyncStore = create<SyncStore>()(
  persist(
    (set, get) => ({
      // Initial State
      syncQueue: [],
      isSyncing: false,
      lastSyncTime: null,
      syncProgress: {
        current: 0,
        total: 0,
      },
      syncResult: null,

      // Actions

      /**
       * Add operation to sync queue
       * @param item - Queue item without ID, status, and timestamps
       * @returns Generated queue item ID
       */
      addToQueue: (item) => {
        const id = `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const queueItem: SyncQueueItem = {
          ...item,
          id,
          status: 'pending',
          retryCount: 0,
          createdAt: new Date().toISOString(),
        };

        const { syncQueue } = get();
        set({ syncQueue: [...syncQueue, queueItem] });
        return id;
      },

      /**
       * Remove item from sync queue
       * @param id - Queue item ID to remove
       */
      removeFromQueue: (id) => {
        const { syncQueue } = get();
        set({ syncQueue: syncQueue.filter((item) => item.id !== id) });
      },

      /**
       * Update queue item
       * @param id - Queue item ID
       * @param updates - Partial updates to apply
       */
      updateQueueItem: (id, updates) => {
        const { syncQueue } = get();
        set({
          syncQueue: syncQueue.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        });
      },

      /**
       * Clear all items from queue
       */
      clearQueue: () => {
        set({ syncQueue: [] });
      },

      /**
       * Clear only failed items from queue
       */
      clearFailedItems: () => {
        const { syncQueue } = get();
        set({
          syncQueue: syncQueue.filter((item) => item.status !== 'failed'),
        });
      },

      /**
       * Sync all pending items in queue
       * @returns Sync result summary
       */
      sync: async () => {
        const { syncQueue } = get();
        const pendingItems = syncQueue.filter(
          (item) => item.status === 'pending'
        );

        if (pendingItems.length === 0) {
          return {
            success: 0,
            failed: 0,
            total: 0,
            errors: [],
          };
        }

        set({
          isSyncing: true,
          syncProgress: {
            current: 0,
            total: pendingItems.length,
          },
        });

        let success = 0;
        let failed = 0;
        const errors: SyncResult['errors'] = [];

        for (let i = 0; i < pendingItems.length; i++) {
          const item = pendingItems[i];

          // Update status to syncing
          get().updateQueueItem(item.id, {
            status: 'syncing',
            lastAttemptAt: new Date().toISOString(),
          });

          try {
            const isSuccess = await executeSyncRequest(item);

            if (isSuccess) {
              success++;
              get().removeFromQueue(item.id);
            } else {
              failed++;
              const newRetryCount = item.retryCount + 1;
              const shouldRetry = newRetryCount < item.maxRetries;

              get().updateQueueItem(item.id, {
                status: shouldRetry ? 'pending' : 'failed',
                retryCount: newRetryCount,
                errorMessage: 'Request failed',
              });

              if (!shouldRetry) {
                errors.push({
                  itemId: item.id,
                  error: 'Max retries reached',
                });
              }
            }
          } catch (error) {
            failed++;
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            const newRetryCount = item.retryCount + 1;
            const shouldRetry = newRetryCount < item.maxRetries;

            get().updateQueueItem(item.id, {
              status: shouldRetry ? 'pending' : 'failed',
              retryCount: newRetryCount,
              errorMessage,
            });

            if (!shouldRetry) {
              errors.push({
                itemId: item.id,
                error: errorMessage,
              });
            }
          }

          // Update progress
          set({
            syncProgress: {
              current: i + 1,
              total: pendingItems.length,
            },
          });
        }

        const result: SyncResult = {
          success,
          failed,
          total: pendingItems.length,
          errors,
        };

        set({
          isSyncing: false,
          lastSyncTime: new Date().toISOString(),
          syncResult: result,
          syncProgress: {
            current: 0,
            total: 0,
          },
        });

        return result;
      },

      /**
       * Retry all failed items
       * @returns Sync result summary
       */
      retryFailed: async () => {
        const { syncQueue } = get();

        // Reset failed items to pending
        const updatedQueue = syncQueue.map((item) =>
          item.status === 'failed'
            ? {
                ...item,
                status: 'pending' as SyncStatus,
                retryCount: 0,
                errorMessage: undefined,
              }
            : item
        );

        set({ syncQueue: updatedQueue });

        // Trigger sync
        return get().sync();
      },

      /**
       * Get count of pending items
       * @returns Number of pending items
       */
      getPendingCount: () => {
        const { syncQueue } = get();
        return syncQueue.filter((item) => item.status === 'pending').length;
      },

      /**
       * Get count of failed items
       * @returns Number of failed items
       */
      getFailedCount: () => {
        const { syncQueue } = get();
        return syncQueue.filter((item) => item.status === 'failed').length;
      },
    }),
    {
      name: 'sync-storage',
      storage: createJSONStorage(() => mmkvStorageAdapter),
      // Persist queue and last sync time
      partialize: (state) => ({
        syncQueue: state.syncQueue,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useSyncQueue = () => useSyncStore((state) => state.syncQueue);
export const useIsSyncing = () => useSyncStore((state) => state.isSyncing);
export const useSyncProgress = () => useSyncStore((state) => state.syncProgress);
export const useLastSyncTime = () => useSyncStore((state) => state.lastSyncTime);
export const usePendingCount = () =>
  useSyncStore((state) => state.getPendingCount());
export const useFailedCount = () =>
  useSyncStore((state) => state.getFailedCount());
