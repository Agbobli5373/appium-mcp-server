import { AppiumCapabilities } from './types.js';

/**
 * Platform Type definitions
 */
export type PlatformType = 'ios' | 'android';

/**
 * Platform Detector - Automatically detects device platform and provides platform-specific utilities
 */
export class PlatformDetector {
    /**
     * Detect platform from capabilities
     */
    static detectPlatform(capabilities: AppiumCapabilities): PlatformType {
        const caps = capabilities as any; // Type assertion for union type handling
        if (caps.platformName === 'iOS') {
            return 'ios';
        } else if (caps.platformName === 'Android') {
            return 'android';
        }
        throw new Error(`Unsupported platform: ${caps.platformName}`);
    }

    /**
     * Get platform-specific default capabilities
     */
    static getPlatformDefaults(platform: PlatformType): Partial<AppiumCapabilities> {
        const defaults: Record<PlatformType, Partial<AppiumCapabilities>> = {
            ios: {
                automationName: 'XCUITest',
                platformVersion: '16.0',
                deviceName: 'iPhone Simulator',
                noReset: true,
                newCommandTimeout: 300
            },
            android: {
                automationName: 'UiAutomator2',
                platformVersion: '12.0',
                deviceName: 'Android Emulator',
                noReset: true,
                newCommandTimeout: 300,
                appWaitTimeout: 30000
            }
        };
        return defaults[platform];
    }

    /**
     * Validate platform-specific capabilities
     */
    static validateCapabilities(capabilities: AppiumCapabilities): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        const platform = this.detectPlatform(capabilities);

        if (platform === 'ios') {
            // iOS-specific validations
            if (!capabilities.bundleId && !capabilities.app) {
                errors.push('iOS requires either bundleId or app path');
            }
            if (capabilities.automationName !== 'XCUITest') {
                errors.push('iOS requires XCUITest automation');
            }
        } else if (platform === 'android') {
            // Android-specific validations
            if (!capabilities.appPackage && !capabilities.app) {
                errors.push('Android requires either appPackage or app path');
            }
            if (capabilities.automationName !== 'UiAutomator2') {
                errors.push('Android requires UiAutomator2 automation');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Get platform-specific locator strategies
     */
    static getLocatorStrategies(platform: PlatformType): string[] {
        const strategies: Record<PlatformType, string[]> = {
            ios: [
                'accessibility-id',
                'id',
                'xpath',
                'name',
                'class',
                'predicate',
                'class-chain'
            ],
            android: [
                'accessibility-id',
                'id',
                'xpath',
                'class',
                'uiautomator',
                'text',
                'partial-text'
            ]
        };
        return strategies[platform];
    }

    /**
     * Check if platform supports a specific feature
     */
    static supportsFeature(platform: PlatformType, feature: string): boolean {
        const featureSupport: Record<PlatformType, Record<string, boolean>> = {
            ios: {
                'multi-touch': true,
                'face-id': true,
                'system-alerts': true,
                'simulator-management': true,
                'gesture-recognition': true,
                'network-toggle': false,
                'permission-management': false
            },
            android: {
                'multi-touch': true,
                'face-id': false,
                'system-alerts': true,
                'simulator-management': true,
                'gesture-recognition': true,
                'network-toggle': true,
                'permission-management': true
            }
        };

        return featureSupport[platform]?.[feature] || false;
    }

    /**
     * Get platform-specific gesture mappings
     */
    static getGestureMapping(platform: PlatformType, gesture: string): any {
        const gestureMappings: Record<PlatformType, Record<string, any>> = {
            ios: {
                'swipe': { type: 'pointer', pointerType: 'touch' },
                'pinch': { type: 'pointer', pointerType: 'touch', pointers: 2 },
                'long-press': { type: 'pointer', pointerType: 'touch', duration: 1000 }
            },
            android: {
                'swipe': { type: 'pointer', pointerType: 'touch' },
                'pinch': { type: 'pointer', pointerType: 'touch', pointers: 2 },
                'long-press': { type: 'pointer', pointerType: 'touch', duration: 1000 }
            }
        };

        return gestureMappings[platform]?.[gesture];
    }

    /**
     * Get platform-specific device information keys
     */
    static getDeviceInfoKeys(platform: PlatformType): string[] {
        const infoKeys: Record<PlatformType, string[]> = {
            ios: [
                'platformName',
                'platformVersion',
                'deviceName',
                'udid',
                'bundleId',
                'isRealDevice',
                'xcodeVersion',
                'iosVersion'
            ],
            android: [
                'platformName',
                'platformVersion',
                'deviceName',
                'udid',
                'deviceModel',
                'deviceManufacturer',
                'isRealDevice',
                'apiVersion',
                'androidVersion'
            ]
        };
        return infoKeys[platform];
    }

    /**
     * Normalize capabilities across platforms
     */
    static normalizeCapabilities(capabilities: AppiumCapabilities): AppiumCapabilities {
        const platform = this.detectPlatform(capabilities);
        const defaults = this.getPlatformDefaults(platform);

        return {
            ...defaults,
            ...capabilities
        };
    }

    /**
     * Get platform-specific error messages
     */
    static getPlatformError(platform: PlatformType, errorCode: string): string {
        const errorMessages: Record<PlatformType, Record<string, string>> = {
            ios: {
                'device_not_found': 'iOS device or simulator not found. Check UDID or ensure simulator is booted.',
                'app_not_installed': 'iOS app not installed. Install the .ipa file first.',
                'permission_denied': 'iOS permission denied. Check app capabilities and provisioning profile.',
                'gesture_failed': 'iOS gesture failed. Verify gesture coordinates and device orientation.'
            },
            android: {
                'device_not_found': 'Android device or emulator not found. Check UDID or ensure emulator is running.',
                'app_not_installed': 'Android app not installed. Install the .apk file first.',
                'permission_denied': 'Android permission denied. Grant permissions using android_grant_permissions tool.',
                'gesture_failed': 'Android gesture failed. Verify gesture coordinates and device orientation.'
            }
        };

        return errorMessages[platform]?.[errorCode] || 'Unknown platform error';
    }
}
