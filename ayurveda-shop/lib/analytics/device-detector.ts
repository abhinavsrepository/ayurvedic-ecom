/**
 * Device Detector
 *
 * Detects device type, OS, browser, and hardware information.
 */

export interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  browserVersion: string;
  deviceRam?: string;
  cpuCores?: number;
  networkType?: string;
  isOnline: boolean;
  screenWidth: number;
  screenHeight: number;
  colorScheme: 'light' | 'dark';
  hasTouch: boolean;
  userAgent: string;
}

export class DeviceDetector {
  /**
   * Get complete device information
   */
  static detect(): DeviceInfo {
    const userAgent = navigator.userAgent;

    return {
      deviceType: this.getDeviceType(),
      os: this.getOS(),
      browser: this.getBrowser(),
      browserVersion: this.getBrowserVersion(),
      deviceRam: this.getDeviceRAM(),
      cpuCores: this.getCPUCores(),
      networkType: this.getNetworkType(),
      isOnline: navigator.onLine,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      colorScheme: this.getColorScheme(),
      hasTouch: this.hasTouchCapability(),
      userAgent,
    };
  }

  /**
   * Detect device type (mobile/tablet/desktop)
   */
  private static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const ua = navigator.userAgent;

    // Check for tablet first
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }

    // Check for mobile
    if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua,
      )
    ) {
      return 'mobile';
    }

    return 'desktop';
  }

  /**
   * Detect operating system
   */
  private static getOS(): string {
    const ua = navigator.userAgent;

    if (/Windows NT 10.0/.test(ua)) return 'Windows 10';
    if (/Windows NT 6.3/.test(ua)) return 'Windows 8.1';
    if (/Windows NT 6.2/.test(ua)) return 'Windows 8';
    if (/Windows NT 6.1/.test(ua)) return 'Windows 7';
    if (/Windows NT 6.0/.test(ua)) return 'Windows Vista';
    if (/Windows NT 5.1/.test(ua)) return 'Windows XP';
    if (/Windows/.test(ua)) return 'Windows';

    if (/Mac OS X 10[._]15/.test(ua)) return 'macOS Catalina';
    if (/Mac OS X 10[._]14/.test(ua)) return 'macOS Mojave';
    if (/Mac OS X/.test(ua)) return 'macOS';

    if (/Android ([0-9.]+)/.test(ua)) {
      const version = ua.match(/Android ([0-9.]+)/)?.[1];
      return `Android ${version}`;
    }

    if (/iPhone OS ([0-9_]+)/.test(ua)) {
      const version = ua.match(/iPhone OS ([0-9_]+)/)?.[1]?.replace(/_/g, '.');
      return `iOS ${version}`;
    }

    if (/iPad/.test(ua)) return 'iPadOS';
    if (/Linux/.test(ua)) return 'Linux';
    if (/CrOS/.test(ua)) return 'Chrome OS';

    return 'Unknown';
  }

  /**
   * Detect browser name
   */
  private static getBrowser(): string {
    const ua = navigator.userAgent;

    if (/Edg\//.test(ua)) return 'Edge';
    if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return 'Chrome';
    if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari';
    if (/Firefox\//.test(ua)) return 'Firefox';
    if (/MSIE |Trident\//.test(ua)) return 'Internet Explorer';
    if (/Opera|OPR\//.test(ua)) return 'Opera';

    return 'Unknown';
  }

  /**
   * Detect browser version
   */
  private static getBrowserVersion(): string {
    const ua = navigator.userAgent;
    const browser = this.getBrowser();

    let match: RegExpMatchArray | null = null;

    switch (browser) {
      case 'Chrome':
        match = ua.match(/Chrome\/([0-9.]+)/);
        break;
      case 'Safari':
        match = ua.match(/Version\/([0-9.]+)/);
        break;
      case 'Firefox':
        match = ua.match(/Firefox\/([0-9.]+)/);
        break;
      case 'Edge':
        match = ua.match(/Edg\/([0-9.]+)/);
        break;
      case 'Opera':
        match = ua.match(/(?:Opera|OPR)\/([0-9.]+)/);
        break;
      default:
        return 'Unknown';
    }

    return match ? match[1] : 'Unknown';
  }

  /**
   * Get device RAM (approximate)
   */
  private static getDeviceRAM(): string | undefined {
    // @ts-ignore - Device Memory API
    const memory = navigator.deviceMemory;
    return memory ? `${memory}GB` : undefined;
  }

  /**
   * Get CPU cores
   */
  private static getCPUCores(): number | undefined {
    return navigator.hardwareConcurrency;
  }

  /**
   * Get network type
   */
  private static getNetworkType(): string | undefined {
    // @ts-ignore - Network Information API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection?.effectiveType || connection?.type;
  }

  /**
   * Get color scheme preference
   */
  private static getColorScheme(): 'light' | 'dark' {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Check for touch capability
   */
  private static hasTouchCapability(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
}
