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

    async getContextDetails(): Promise<AppiumResponse<Array<{ name: string; type: string; url?: string }>>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const contexts = await this.driver.getContexts() as string[];

            const contextDetails = contexts.map(context => {
                let type = 'unknown';
                let url: string | undefined;

                if (context === 'NATIVE_APP') {
                    type = 'native';
                } else if (context.startsWith('WEBVIEW_')) {
                    type = 'webview';
                    // Try to get URL for webview contexts
                    try {
                        // This would require switching context temporarily
                        // For now, we'll mark it as webview
                    } catch (urlError) {
                        // URL not available
                    }
                }

                const detail: { name: string; type: string; url?: string } = {
                    name: context,
                    type
                };

                if (url !== undefined) {
                    detail.url = url;
                }

                return detail;
            });

            return {
                success: true,
                message: 'Context details retrieved successfully',
                data: contextDetails
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get context details: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async switchToWebView(webViewIndex: number = 0): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const contexts = await this.driver.getContexts() as string[];
            const webViews = contexts.filter(ctx => ctx.startsWith('WEBVIEW_'));

            if (webViews.length === 0) {
                return {
                    success: false,
                    message: 'No webview contexts available'
                };
            }

            if (webViewIndex >= webViews.length) {
                return {
                    success: false,
                    message: `Webview index ${webViewIndex} is out of range. Available webviews: ${webViews.length}`
                };
            }

            const targetWebView = webViews[webViewIndex];
            await this.driver.switchContext(targetWebView);

            return {
                success: true,
                message: `Switched to webview: ${targetWebView}`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to switch to webview: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async switchToNative(): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            await this.driver.switchContext('NATIVE_APP');
            return {
                success: true,
                message: 'Switched to native context successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to switch to native context: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async isWebViewAvailable(): Promise<AppiumResponse<boolean>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const contexts = await this.driver.getContexts() as string[];
            const hasWebView = contexts.some(ctx => ctx.startsWith('WEBVIEW_'));

            return {
                success: true,
                message: 'Webview availability checked successfully',
                data: hasWebView
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to check webview availability: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async getWebViewCount(): Promise<AppiumResponse<number>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const contexts = await this.driver.getContexts() as string[];
            const webViewCount = contexts.filter(ctx => ctx.startsWith('WEBVIEW_')).length;

            return {
                success: true,
                message: 'Webview count retrieved successfully',
                data: webViewCount
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get webview count: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
