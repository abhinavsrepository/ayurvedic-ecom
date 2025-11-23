/**
 * Network Status Hook
 *
 * Detects network connectivity changes and provides network status.
 * Uses @react-native-community/netinfo for real-time network detection.
 * Automatically updates syncStore when network status changes.
 */

import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useSyncStore } from '../store/syncStore';

/**
 * Network status interface
 */
export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  details: any;
}

/**
 * Hook for monitoring network connectivity status
 *
 * Provides real-time network status and automatically triggers
 * sync when connection is restored.
 *
 * @example
 * ```tsx
 * const { isConnected, isInternetReachable, type } = useNetworkStatus();
 *
 * if (!isConnected) {
 *   return <OfflineMessage />;
 * }
 * ```
 */
export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: null,
    type: null,
    details: null,
  });

  const { sync, getPendingCount } = useSyncStore();

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const newStatus: NetworkStatus = {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        details: state.details,
      };

      // Check if we just came back online
      const wasOffline = !networkStatus.isConnected;
      const nowOnline = newStatus.isConnected && newStatus.isInternetReachable;

      setNetworkStatus(newStatus);

      // Auto-sync when coming back online
      if (wasOffline && nowOnline) {
        const pendingCount = getPendingCount();
        if (pendingCount > 0) {
          console.log(`Network restored. Syncing ${pendingCount} pending operations...`);
          sync().catch((error) => {
            console.error('Auto-sync failed:', error);
          });
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [networkStatus.isConnected]);

  /**
   * Manually refresh network status
   */
  const refresh = async () => {
    const state = await NetInfo.fetch();
    setNetworkStatus({
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
      details: state.details,
    });
  };

  return {
    ...networkStatus,
    refresh,
  };
};

/**
 * Hook for checking if device is online
 * Simplified version that only returns boolean
 *
 * @example
 * ```tsx
 * const isOnline = useIsOnline();
 * ```
 */
export const useIsOnline = () => {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  return isConnected && (isInternetReachable ?? true);
};

/**
 * Hook for executing callback when network status changes
 *
 * @param callback - Function to call when network status changes
 * @example
 * ```tsx
 * useNetworkStatusChange((status) => {
 *   if (status.isConnected) {
 *     console.log('Back online!');
 *   } else {
 *     console.log('Went offline');
 *   }
 * });
 * ```
 */
export const useNetworkStatusChange = (
  callback: (status: NetworkStatus) => void
) => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      callback({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        details: state.details,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [callback]);
};

export default useNetworkStatus;
