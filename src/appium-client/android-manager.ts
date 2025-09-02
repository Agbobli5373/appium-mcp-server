import { BaseManager, AppiumResponse } from './types.js';

/**
 * Android Manager - Handles Android-specific operations and emulator management
 */
export class AndroidManager implements BaseManager {
    private driver: WebdriverIO.Browser | null = null;

    setDriver(driver: WebdriverIO.Browser | null): void {
        this.driver = driver;
    }

    /**
     * Get list of available Android emulators
     */
    async getEmulatorList(apiLevel?: string): Promise<AppiumResponse<any[]>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            // Use Android SDK tools to list emulators
            const { execSync } = await import('child_process');
            let command = 'emulator -list-avds';

            if (apiLevel) {
                // Filter by API level if specified
                command = `avdmanager list target | grep "API level ${apiLevel}" -A 5 -B 5`;
            }

            const result = execSync(command, { encoding: 'utf8' });
            const emulators = result.trim().split('\n').filter(line => line.trim() !== '');

            return {
                success: true,
                message: `Found ${emulators.length} emulator configurations`,
                data: emulators
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to get emulator list: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Create a new Android emulator
     */
    async createEmulator(config: {
        name: string;
        device: string;
        apiLevel: string;
        target: string;
    }): Promise<AppiumResponse<string>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Create emulator using avdmanager
            const createCommand = `avdmanager create avd -n "${config.name}" -k "${config.target}" -d "${config.device}" --force`;
            execSync(createCommand, { input: 'no\n' }); // Answer 'no' to the interactive prompt

            return {
                success: true,
                message: `Emulator "${config.name}" created successfully`,
                data: config.name
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to create emulator: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Delete an Android emulator
     */
    async deleteEmulator(name: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Delete emulator
            const deleteCommand = `avdmanager delete avd -n "${name}"`;
            execSync(deleteCommand);

            return {
                success: true,
                message: `Emulator "${name}" deleted successfully`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to delete emulator: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Get Android device logs (logcat)
     */
    async getDeviceLogs(): Promise<AppiumResponse<string[]>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            // Get logs using adb logcat
            const { execSync } = await import('child_process');
            const logCommand = 'adb logcat -d -v brief | head -50'; // Get last 50 lines
            const result = execSync(logCommand, { encoding: 'utf8' });
            const logLines = result.trim().split('\n').filter(line => line.trim() !== '');

            return {
                success: true,
                message: `Retrieved ${logLines.length} log entries`,
                data: logLines
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
     * Install an Android app (.apk file)
     */
    async installApp(apkPath: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            // Install app using adb
            const { execSync } = await import('child_process');
            const installCommand = `adb install "${apkPath}"`;
            execSync(installCommand);

            return {
                success: true,
                message: `App installed successfully from ${apkPath}`
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
     * Uninstall an Android app
     */
    async uninstallApp(packageName: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            // Uninstall app using adb
            const { execSync } = await import('child_process');
            const uninstallCommand = `adb uninstall ${packageName}`;
            execSync(uninstallCommand);

            return {
                success: true,
                message: `App ${packageName} uninstalled successfully`
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
     * Grant runtime permissions to Android app
     */
    async grantPermissions(packageName: string, permissions: string[]): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');
            const grantedPermissions: string[] = [];

            for (const permission of permissions) {
                try {
                    const grantCommand = `adb shell pm grant ${packageName} ${permission}`;
                    execSync(grantCommand);
                    grantedPermissions.push(permission);
                } catch (error) {
                    // Permission might not be available or already granted
                    continue;
                }
            }

            return {
                success: true,
                message: `Granted ${grantedPermissions.length} permissions to ${packageName}`,
                data: grantedPermissions
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to grant permissions: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Revoke permissions from Android app
     */
    async revokePermissions(packageName: string, permissions: string[]): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');
            const revokedPermissions: string[] = [];

            for (const permission of permissions) {
                try {
                    const revokeCommand = `adb shell pm revoke ${packageName} ${permission}`;
                    execSync(revokeCommand);
                    revokedPermissions.push(permission);
                } catch (error) {
                    // Permission might not be granted
                    continue;
                }
            }

            return {
                success: true,
                message: `Revoked ${revokedPermissions.length} permissions from ${packageName}`,
                data: revokedPermissions
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to revoke permissions: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Toggle network connectivity
     */
    async toggleNetwork(enabled: boolean): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            if (enabled) {
                execSync('adb shell svc data enable');
                execSync('adb shell svc wifi enable');
            } else {
                execSync('adb shell svc data disable');
                execSync('adb shell svc wifi disable');
            }

            return {
                success: true,
                message: `Network ${enabled ? 'enabled' : 'disabled'} successfully`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to toggle network: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Get Android-specific device information
     */
    async getAndroidDeviceInfo(): Promise<AppiumResponse<any>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            // Get Android-specific capabilities and info
            const capabilities = this.driver.capabilities as any;

            const androidInfo = {
                platformName: capabilities.platformName,
                platformVersion: capabilities.platformVersion,
                deviceName: capabilities.deviceName,
                udid: capabilities.udid,
                deviceModel: capabilities.deviceModel,
                deviceManufacturer: capabilities.deviceManufacturer,
                isRealDevice: capabilities.isRealDevice || false,
                apiVersion: capabilities.apiVersion,
                androidVersion: capabilities.platformVersion
            };

            return {
                success: true,
                message: 'Android device information retrieved successfully',
                data: androidInfo
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to get Android device info: ${errorMessage}`,
                error: errorMessage
            };
        }
    }
}
