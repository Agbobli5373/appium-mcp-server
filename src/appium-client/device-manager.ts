import { BaseManager, AppiumResponse, DeviceInfo } from './types.js';

/**
 * Device Manager - Handles device-specific operations
 */
export class DeviceManager implements BaseManager {
    private driver: WebdriverIO.Browser | null = null;

    setDriver(driver: WebdriverIO.Browser | null): void {
        this.driver = driver;
    }

    async getDeviceInfo(): Promise<AppiumResponse<DeviceInfo>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            // Get basic device capabilities
            const capabilities = this.driver.capabilities as any;

            // Get screen size using getWindowSize for more accurate dimensions
            let screenSize = { width: 0, height: 0 };
            try {
                screenSize = await this.driver.getWindowSize();
            } catch (screenError) {
                // Fallback to capabilities if getWindowSize fails
                screenSize = {
                    width: capabilities.deviceScreenSize?.width || 0,
                    height: capabilities.deviceScreenSize?.height || 0
                };
            }

            // Get current orientation
            let orientation: 'PORTRAIT' | 'LANDSCAPE' = 'PORTRAIT';
            try {
                const currentOrientation = await this.driver.getOrientation();
                orientation = currentOrientation as 'PORTRAIT' | 'LANDSCAPE';
            } catch (orientationError) {
                // Fallback to capabilities
                orientation = (capabilities.deviceScreenOrientation || 'PORTRAIT') as 'PORTRAIT' | 'LANDSCAPE';
            }

            // Get battery level if available
            let batteryLevel: number | undefined;
            try {
                if (capabilities.platformName === 'Android') {
                    // For Android, try to get battery info
                    const batteryInfo = await this.driver.execute('mobile: batteryInfo') as any;
                    batteryLevel = batteryInfo?.level;
                }
            } catch (batteryError) {
                // Battery info not available or not supported
            }

            const deviceInfo: DeviceInfo = {
                platformName: capabilities.platformName,
                platformVersion: capabilities.platformVersion,
                deviceName: capabilities.deviceName,
                udid: capabilities.udid,
                screenSize,
                orientation,
                ...(batteryLevel !== undefined && { batteryLevel }),
                isRealDevice: capabilities.realDevice || false
            };

            return {
                success: true,
                message: 'Device information retrieved successfully',
                data: deviceInfo
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get device info: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async rotateDevice(orientation: 'PORTRAIT' | 'LANDSCAPE'): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            await this.driver.setOrientation(orientation);
            return {
                success: true,
                message: `Device rotated to ${orientation}`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to rotate device: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async getScreenSize(): Promise<AppiumResponse<{ width: number; height: number }>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const size = await this.driver.getWindowSize();
            return {
                success: true,
                message: 'Screen size retrieved successfully',
                data: size
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get screen size: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
