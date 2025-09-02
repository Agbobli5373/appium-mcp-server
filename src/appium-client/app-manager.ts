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
}
