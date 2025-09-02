import { BaseManager, AppiumResponse } from './types.js';

/**
 * App Manager - Handles app lifecycle and management operations
 */
export class AppManager implements BaseManager {
    private driver: WebdriverIO.Browser | null = null;

    setDriver(driver: WebdriverIO.Browser | null): void {
        this.driver = driver;
    }

    async launchApp(appId?: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            if (appId) {
                await this.driver.activateApp(appId);
            } else {
                await this.driver.launchApp();
            }

            return {
                success: true,
                message: `App launched successfully${appId ? `: ${appId}` : ''}`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to launch app: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async terminateApp(appId?: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            if (appId) {
                await this.driver.terminateApp(appId, {});
            } else {
                await this.driver.closeApp();
            }

            return {
                success: true,
                message: `App terminated successfully${appId ? `: ${appId}` : ''}`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to terminate app: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async getAppState(appId: string): Promise<AppiumResponse<number>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const state = await this.driver.queryAppState(appId);
            return {
                success: true,
                message: 'App state retrieved successfully',
                data: state
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get app state: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async backgroundApp(seconds: number = 0): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            await this.driver.background(seconds);
            return {
                success: true,
                message: `App backgrounded for ${seconds} seconds`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to background app: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async resetApp(): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            await (this.driver as any).reset();
            return {
                success: true,
                message: 'App reset successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to reset app: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async isAppInstalled(bundleId: string): Promise<AppiumResponse<boolean>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const isInstalled = await this.driver.isAppInstalled(bundleId);
            return {
                success: true,
                message: `App installation status checked for: ${bundleId}`,
                data: isInstalled
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to check app installation: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async installApp(appPath: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            await this.driver.installApp(appPath);
            return {
                success: true,
                message: `App installed successfully from: ${appPath}`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to install app: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async removeApp(bundleId: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            await this.driver.removeApp(bundleId);
            return {
                success: true,
                message: `App removed successfully: ${bundleId}`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to remove app: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async getAppStrings(language?: string, stringFile?: string): Promise<AppiumResponse<Record<string, string>>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const strings = await this.driver.getStrings(language, stringFile);
            return {
                success: true,
                message: 'App strings retrieved successfully',
                data: strings
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get app strings: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async startActivity(appPackage: string, appActivity: string, appWaitPackage?: string, appWaitActivity?: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            await this.driver.startActivity(appPackage, appActivity, appWaitPackage, appWaitActivity);
            return {
                success: true,
                message: `Activity started: ${appPackage}/${appActivity}`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to start activity: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async getCurrentActivity(): Promise<AppiumResponse<string>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const activity = await this.driver.getCurrentActivity();
            return {
                success: true,
                message: 'Current activity retrieved successfully',
                data: activity
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get current activity: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async getCurrentPackage(): Promise<AppiumResponse<string>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const packageName = await this.driver.getCurrentPackage();
            return {
                success: true,
                message: 'Current package retrieved successfully',
                data: packageName
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get current package: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
