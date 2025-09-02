import { BaseManager, AppiumResponse } from './types.js';

/**
 * iOS Manager - Handles iOS-specific operations and simulator management
 */
export class IOSManager implements BaseManager {
    private driver: WebdriverIO.Browser | null = null;

    setDriver(driver: WebdriverIO.Browser | null): void {
        this.driver = driver;
    }

    /**
     * Get list of available iOS simulators
     */
    async getSimulatorList(runtime?: string): Promise<AppiumResponse<any[]>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            // Use xcrun simctl to list simulators
            const { execSync } = await import('child_process');
            let command = 'xcrun simctl list devices --json';

            if (runtime) {
                command = `xcrun simctl list devices --json | jq '.devices."${runtime}"'`;
            }

            const result = execSync(command, { encoding: 'utf8' });
            const simulators = JSON.parse(result);

            return {
                success: true,
                message: `Found ${Object.keys(simulators).length} simulator configurations`,
                data: simulators
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to get simulator list: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Create a new iOS simulator
     */
    async createSimulator(config: {
        name: string;
        deviceType: string;
        runtime: string;
    }): Promise<AppiumResponse<string>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Create simulator
            const createCommand = `xcrun simctl create "${config.name}" "${config.deviceType}" "${config.runtime}"`;
            const udid = execSync(createCommand, { encoding: 'utf8' }).trim();

            return {
                success: true,
                message: `Simulator "${config.name}" created successfully`,
                data: udid
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to create simulator: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Delete an iOS simulator
     */
    async deleteSimulator(udid: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Delete simulator
            const deleteCommand = `xcrun simctl delete ${udid}`;
            execSync(deleteCommand);

            return {
                success: true,
                message: `Simulator ${udid} deleted successfully`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to delete simulator: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Get iOS device logs
     */
    async getDeviceLogs(): Promise<AppiumResponse<string[]>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            // Get logs from the current session
            const logs = await this.driver.getLogs('syslog');
            const logMessages = logs.map((log: any) => log.message);

            return {
                success: true,
                message: `Retrieved ${logMessages.length} log entries`,
                data: logMessages
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to get device logs: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Install an iOS app (.ipa file)
     */
    async installApp(appPath: string, bundleId?: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            // Install app using Appium's mobile:installApp
            await this.driver.execute('mobile:installApp', {
                appPath: appPath,
                bundleId: bundleId
            });

            return {
                success: true,
                message: `App installed successfully from ${appPath}`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to install app: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Uninstall an iOS app
     */
    async uninstallApp(bundleId: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            // Terminate app first if running
            try {
                await this.driver.terminateApp(bundleId, {});
            } catch (terminateError) {
                // App might not be running, continue with uninstall
            }

            // Uninstall app using Appium's mobile:removeApp
            await this.driver.execute('mobile:removeApp', {
                bundleId: bundleId
            });

            return {
                success: true,
                message: `App ${bundleId} uninstalled successfully`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to uninstall app: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Handle iOS system alerts
     */
    async handleSystemAlert(action: 'accept' | 'dismiss'): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            if (action === 'accept') {
                await this.driver.acceptAlert();
            } else {
                await this.driver.dismissAlert();
            }

            return {
                success: true,
                message: `System alert ${action}ed successfully`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to ${action} system alert: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Get iOS-specific device information
     */
    async getIOSDeviceInfo(): Promise<AppiumResponse<any>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            // Get iOS-specific capabilities and info
            const capabilities = this.driver.capabilities as any;

            const iosInfo = {
                platformName: capabilities.platformName,
                platformVersion: capabilities.platformVersion,
                deviceName: capabilities.deviceName,
                udid: capabilities.udid,
                bundleId: capabilities.bundleId,
                isRealDevice: capabilities.isRealDevice || false,
                xcodeVersion: capabilities.xcodeVersion,
                iosVersion: capabilities.platformVersion
            };

            return {
                success: true,
                message: 'iOS device information retrieved successfully',
                data: iosInfo
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to get iOS device info: ${errorMessage}`,
                error: errorMessage
            };
        }
    }
}
