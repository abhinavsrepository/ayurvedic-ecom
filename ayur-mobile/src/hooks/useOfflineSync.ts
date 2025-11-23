/**
 * Offline Sync Hook
 *
 * Manages offline data synchronization including:
 * - Sync queue management
 * - Manual and automatic sync triggers
 * - Network-aware sync operations
 *
 * Automatically syncs pending operations when network is restored.
 */

import { useEffect, useCallback } from 'react';
import { useSyncStore } from '../store/syncStore';
import { useNetworkStatus } from './useNetworkStatus';

/**
 * Hook for managing offline sync queue and operations
 *
 * Provides access to sync queue, manual sync triggers, and auto-sync
 * when network connection is restored.
 *
 * @example
 * ```tsx
 * const {
 *   syncQueue,
 *   isSyncing,
 *   sync,
 *   pendingCount,
 *   failedCount
 * } = useOfflineSync();
 *
 * // Manually trigger sync
 * await sync();
 * ```
 */
export const useOfflineSync = () => {
  const {
    syncQueue,
    isSyncing,
    sync,
    retryFailed,
    getPendingCount,
    getFailedCount,
    lastSyncTime,
    syncProgress,
    syncResult,
  } = useSyncStore();

  const { isConnected, isInternetReachable } = useNetworkStatus();

  const isOnline = isConnected && (isInternetReachable ?? true);

  /**
   * Manually trigger sync
   * Only syncs if online
   */
  const manualSync = useCallback(async () => {
    if (!isOnline) {
      console.warn('Cannot sync while offline');
      return {
        success: 0,
        failed: 0,
        total: 0,
        errors: [{ itemId: 'network', error: 'No network connection' }],
      };
    }

    return await sync();
  }, [isOnline, sync]);

  /**
   * Retry all failed sync operations
   */
  const retryFailedSync = useCallback(async () => {
    if (!isOnline) {
      console.warn('Cannot retry sync while offline');
      return {
        success: 0,
        failed: 0,
        total: 0,
        errors: [{ itemId: 'network', error: 'No network connection' }],
      };
    }

    return await retryFailed();
  }, [isOnline, retryFailed]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && getPendingCount() > 0 && !isSyncing) {
      console.log('Network restored. Auto-syncing pending operations...');
      sync().catch((error) => {
        console.error('Auto-sync failed:', error);
      });
    }
  }, [isOnline]);

  return {
    // Queue state
    syncQueue,
    pendingCount: getPendingCount(),
    failedCount: getFailedCount(),

    // Sync state
    isSyncing,
    lastSyncTime,
    syncProgress,
    syncResult,

    // Network state
    isOnline,

    // Actions
    sync: manualSync,
    retryFailed: retryFailedSync,
  };
};

/**
 * Hook for getting sync queue status
 * Simplified version that only returns counts
 *
 * @example
 * ```tsx
 * const { pendingCount, failedCount, isSyncing } = useSyncQueueStatus();
 * ```
 */
export const useSyncQueueStatus = () => {
  const { isSyncing, getPendingCount, getFailedCount } = useSyncStore();

  return {
    pendingCount: getPendingCount(),
    failedCount: getFailedCount(),
    isSyncing,
  };
};

/**
 * Hook for adding operation to sync queue
 * Automatically queues operations when offline
 *
 * @example
 * ```tsx
 * const { addToSyncQueue } = useAddToSyncQueue();
 *
 * addToSyncQueue({
 *   type: 'CART',
 *   endpoint: '/api/cart',
 *   method: 'POST',
 *   data: { productId: '123', quantity: 1 },
 *   maxRetries: 3
 * });
 * ```
 */
export const useAddToSyncQueue = () => {
  const { addToQueue } = useSyncStore();
  const { isOnline } = useNetworkStatus();

  const addToSyncQueue = useCallback(
    (item: Parameters<typeof addToQueue>[0]) => {
      if (!isOnline) {
        console.log('Offline: Adding operation to sync queue');
      }
      return addToQueue(item);
    },
    [addToQueue, isOnline]
  );

  return {
    addToSyncQueue,
    isOnline,
  };
};

/**
 * Hook that executes callback when sync completes
 *
 * @param callback - Function to call when sync completes
 * @example
 * ```tsx
 * useOnSyncComplete((result) => {
 *   console.log(`Synced ${result.success} items`);
 *   if (result.failed > 0) {
 *     showNotification('Some items failed to sync');
 *   }
 * });
 * ```
 */
export const useOnSyncComplete = (
  callback: (result: NonNullable<ReturnType<typeof useSyncStore>['syncResult']>) => void
) => {
  const { syncResult, isSyncing } = useSyncStore();
  const prevIsSyncing = useRef(isSyncing);

  useEffect(() => {
    // Detect when sync just completed
    if (prevIsSyncing.current && !isSyncing && syncResult) {
      callback(syncResult);
    }
    prevIsSyncing.current = isSyncing;
  }, [isSyncing, syncResult, callback]);
};

// Import useRef for tracking previous sync state
import { useRef } from 'react';

export default useOfflineSync;
