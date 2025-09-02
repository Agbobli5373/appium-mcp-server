import { BaseManager, AppiumResponse } from './types.js';

/**
 * Context Manager - Handles switching between native/hybrid/web contexts
 */
export class ContextManager implements BaseManager {
    private driver: WebdriverIO.Browser | null = null;

    setDriver(driver: WebdriverIO.Browser | null): void {
        this.driver = driver;
    }

    async getAvailableContexts(): Promise<AppiumResponse<string[]>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const contexts = await this.driver.getContexts() as string[];
            return {
                success: true,
                message: 'Available contexts retrieved successfully',
                data: contexts
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get contexts: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async switchToContext(context: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            await this.driver.switchContext(context);
            return {
                success: true,
                message: `Switched to context: ${context}`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to switch context: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async getCurrentContext(): Promise<AppiumResponse<string>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const context = await this.driver.getContext() as string;
            return {
                success: true,
                message: 'Current context retrieved successfully',
                data: context
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get current context: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
