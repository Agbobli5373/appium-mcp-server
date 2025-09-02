import { BaseManager, AppiumResponse, MobileLocatorStrategy } from './types.js';
import { PlatformDetector } from './platform-detector.js';

/**
 * Platform-Specific Locator Manager - Advanced element location strategies
 * Opt                case 'class':
                    selector = `.${locator}`;
                    break;
                case 'class-name':
                    selector = `.${locator}`;
                    break;zed for iOS and Android platform differences
 */
export class LocatorManager implements BaseManager {
    private driver: WebdriverIO.Browser | null = null;
    private platform: string | null = null;

    setDriver(driver: WebdriverIO.Browser | null): void {
        this.driver = driver;
        if (driver) {
            this.platform = PlatformDetector.detectPlatform(driver.capabilities as any);
        }
    }

    /**
     * Smart locator that automatically chooses the best strategy for the platform
     */
    async smartLocate(strategy: MobileLocatorStrategy, locator: string, options?: {
        timeout?: number;
        multiple?: boolean;
        context?: string;
    }): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            if (this.platform === 'ios') {
                return await this.iosSmartLocate(strategy, locator, options);
            } else if (this.platform === 'android') {
                return await this.androidSmartLocate(strategy, locator, options);
            }

            // Fallback to basic strategy
            return await this.basicLocate(strategy, locator, options);

        } catch (error) {
            return {
                success: false,
                message: `Smart locate failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * iOS-specific smart locator with XCUITest optimizations
     */
    private async iosSmartLocate(strategy: MobileLocatorStrategy, locator: string, options?: {
        timeout?: number;
        multiple?: boolean;
        context?: string;
    }): Promise<AppiumResponse> {
        const timeout = options?.timeout || 10000;

        try {
            let element;

            switch (strategy) {
                case 'accessibility-id':
                    // iOS prefers accessibility-id for best performance
                    element = await this.driver!.$(`~${locator}`);
                    break;

                case 'id':
                    // iOS id strategy (uses accessibility identifier)
                    element = await this.driver!.$(`#${locator}`);
                    break;

                case 'xpath':
                    // iOS xpath with iOS-specific optimizations
                    element = await this.iosOptimizedXpath(locator, timeout);
                    break;

                case 'class-name':
                    // iOS class name (XCUIElementType)
                    element = await this.driver!.$(`.${locator}`);
                    break;

                case 'name':
                    // iOS name attribute
                    element = await this.driver!.$(`[name="${locator}"]`);
                    break;

                case 'predicate':
                    // iOS NSPredicate (most powerful for iOS)
                    element = await this.driver!.$('-ios predicate string:' + locator);
                    break;

                case 'class-chain':
                    // iOS Class Chain (fastest for complex hierarchies)
                    element = await this.driver!.$('-ios class chain:' + locator);
                    break;

                default:
                    element = await this.driver!.$(locator);
            }

            if (options?.multiple) {
                const elements = await this.driver!.$$(this.convertToMultipleSelector(strategy, locator));
                return {
                    success: true,
                    message: `iOS smart locate found ${elements.length} elements`,
                    data: elements
                };
            }

            const isDisplayed = await element.isDisplayed();
            return {
                success: true,
                message: 'iOS smart locate successful',
                data: {
                    element,
                    isDisplayed,
                    platform: 'ios',
                    strategy: strategy
                }
            };

        } catch (error) {
            return {
                success: false,
                message: `iOS smart locate failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Android-specific smart locator with UiAutomator2 optimizations
     */
    private async androidSmartLocate(strategy: MobileLocatorStrategy, locator: string, options?: {
        timeout?: number;
        multiple?: boolean;
        context?: string;
    }): Promise<AppiumResponse> {
        const timeout = options?.timeout || 10000;

        try {
            let element;

            switch (strategy) {
                case 'accessibility-id':
                    // Android accessibility-id (content-desc)
                    element = await this.driver!.$(`~${locator}`);
                    break;

                case 'id':
                    // Android resource-id
                    element = await this.driver!.$(`${locator}`);
                    break;

                case 'xpath':
                    // Android xpath with UiAutomator optimizations
                    element = await this.androidOptimizedXpath(locator, timeout);
                    break;

                case 'class-name':
                    // Android class name
                    element = await this.driver!.$(`.${locator}`);
                    break;

                case 'text':
                    // Android text content
                    element = await this.driver!.$('//*[@text="' + locator + '"]');
                    break;

                case 'uiautomator':
                    // Android UiAutomator selector (most powerful)
                    element = await this.driver!.$('-android uiautomator:' + locator);
                    break;

                case 'datamatcher':
                    // Android DataMatcher (for complex data-driven apps)
                    element = await this.driver!.$('-android datamatcher:' + locator);
                    break;

                default:
                    element = await this.driver!.$(locator);
            }

            if (options?.multiple) {
                const elements = await this.driver!.$$(this.convertToMultipleSelector(strategy, locator));
                return {
                    success: true,
                    message: `Android smart locate found ${elements.length} elements`,
                    data: elements
                };
            }

            const isDisplayed = await element.isDisplayed();
            return {
                success: true,
                message: 'Android smart locate successful',
                data: {
                    element,
                    isDisplayed,
                    platform: 'android',
                    strategy: strategy
                }
            };

        } catch (error) {
            return {
                success: false,
                message: `Android smart locate failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Basic locator fallback
     */
    private async basicLocate(strategy: MobileLocatorStrategy, locator: string, options?: {
        timeout?: number;
        multiple?: boolean;
    }): Promise<AppiumResponse> {
        try {
            let selector: string;

            switch (strategy) {
                case 'id':
                    selector = `#${locator}`;
                    break;
                case 'class-name':
                    selector = `.${locator}`;
                    break;
                case 'name':
                    selector = `[name="${locator}"]`;
                    break;
                case 'xpath':
                    selector = locator;
                    break;
                case 'accessibility-id':
                    selector = `~${locator}`;
                    break;
                case 'predicate':
                    selector = '-ios predicate string:' + locator;
                    break;
                case 'class-chain':
                    selector = '-ios class chain:' + locator;
                    break;
                case 'uiautomator':
                    selector = '-android uiautomator:' + locator;
                    break;
                case 'datamatcher':
                    selector = '-android datamatcher:' + locator;
                    break;
                case 'text':
                    selector = '//*[@text="' + locator + '"]';
                    break;
                default:
                    selector = locator;
            }

            if (options?.multiple) {
                const elements = await this.driver!.$$(selector);
                return {
                    success: true,
                    message: `Basic locate found ${elements.length} elements`,
                    data: elements
                };
            }

            const element = await this.driver!.$(selector);
            const isDisplayed = await element.isDisplayed();

            return {
                success: true,
                message: 'Basic locate successful',
                data: {
                    element,
                    isDisplayed,
                    strategy: strategy
                }
            };

        } catch (error) {
            return {
                success: false,
                message: `Basic locate failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * iOS-optimized XPath with performance enhancements
     */
    private async iosOptimizedXpath(xpath: string, _timeout: number): Promise<WebdriverIO.Element> {
        // iOS-specific XPath optimizations
        const optimizedXpath = xpath
            .replace(/\/\/\*\[@class=/g, '//*[contains(@type,')  // Optimize class selectors
            .replace(/@text=/g, 'contains(@label,')             // Use label instead of text
            .replace(/@value=/g, 'contains(@value,');

        return await this.driver!.$(optimizedXpath);
    }

    /**
     * Android-optimized XPath with UiAutomator hints
     */
    private async androidOptimizedXpath(xpath: string, _timeout: number): Promise<WebdriverIO.Element> {
        // Android-specific XPath optimizations
        const optimizedXpath = xpath
            .replace(/\/\/\*\[@class=/g, '//*[contains(@class,')  // Optimize class selectors
            .replace(/@text=/g, 'contains(@text,')               // Use text content
            .replace(/@content-desc=/g, 'contains(@content-desc,');

        return await this.driver!.$(optimizedXpath);
    }

    /**
     * Convert single selector to multiple selector
     */
    private convertToMultipleSelector(strategy: MobileLocatorStrategy, locator: string): string {
        switch (strategy) {
            case 'id':
                return `$${locator}`;
            case 'class-name':
                return `$${locator}`;
            case 'name':
                return `$$[name="${locator}"]`;
            case 'xpath':
                return `$${locator}`;
            case 'accessibility-id':
                return `$${locator}`;
            case 'text':
                return `$$//*[@text="${locator}"]`;
            default:
                return locator;
        }
    }

    /**
     * Advanced element waiting with platform-specific strategies
     */
    async waitForElement(strategy: MobileLocatorStrategy, locator: string, options?: {
        timeout?: number;
        visible?: boolean;
        clickable?: boolean;
        context?: string;
    }): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        const timeout = options?.timeout || 10000;
        const startTime = Date.now();

        try {
            while (Date.now() - startTime < timeout) {
                const result = await this.smartLocate(strategy, locator, { timeout: 1000 });

                if (result.success && result.data) {
                    const element = result.data.element;

                    // Check visibility if required
                    if (options?.visible) {
                        const isDisplayed = await element.isDisplayed();
                        if (!isDisplayed) continue;
                    }

                    // Check clickability if required
                    if (options?.clickable) {
                        const isEnabled = await element.isEnabled();
                        if (!isEnabled) continue;
                    }

                    return {
                        success: true,
                        message: 'Element found and meets conditions',
                        data: {
                            element,
                            waitTime: Date.now() - startTime,
                            platform: this.platform
                        }
                    };
                }

                // Wait before retry
                await this.driver!.pause(500);
            }

            return {
                success: false,
                message: `Element not found within ${timeout}ms`,
                error: 'Timeout'
            };

        } catch (error) {
            return {
                success: false,
                message: `Wait for element failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Platform-specific element validation
     */
    async validateElement(element: WebdriverIO.Element, validations?: {
        visible?: boolean;
        enabled?: boolean;
        clickable?: boolean;
        text?: string;
        attributes?: Record<string, string>;
    }): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const results: Record<string, any> = {};

            if (validations?.visible !== undefined) {
                results.visible = await element.isDisplayed();
                if (results.visible !== validations.visible) {
                    return {
                        success: false,
                        message: `Visibility validation failed: expected ${validations.visible}, got ${results.visible}`,
                        data: results
                    };
                }
            }

            if (validations?.enabled !== undefined) {
                results.enabled = await element.isEnabled();
                if (results.enabled !== validations.enabled) {
                    return {
                        success: false,
                        message: `Enabled validation failed: expected ${validations.enabled}, got ${results.enabled}`,
                        data: results
                    };
                }
            }

            if (validations?.clickable !== undefined) {
                results.clickable = await element.isClickable();
                if (results.clickable !== validations.clickable) {
                    return {
                        success: false,
                        message: `Clickable validation failed: expected ${validations.clickable}, got ${results.clickable}`,
                        data: results
                    };
                }
            }

            if (validations?.text) {
                results.text = await element.getText();
                if (results.text !== validations.text) {
                    return {
                        success: false,
                        message: `Text validation failed: expected "${validations.text}", got "${results.text}"`,
                        data: results
                    };
                }
            }

            if (validations?.attributes) {
                results.attributes = {};
                for (const [attr, expectedValue] of Object.entries(validations.attributes)) {
                    const actualValue = await element.getAttribute(attr);
                    results.attributes[attr] = actualValue;
                    if (actualValue !== expectedValue) {
                        return {
                            success: false,
                            message: `Attribute validation failed for ${attr}: expected "${expectedValue}", got "${actualValue}"`,
                            data: results
                        };
                    }
                }
            }

            return {
                success: true,
                message: 'All element validations passed',
                data: results
            };

        } catch (error) {
            return {
                success: false,
                message: `Element validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Get platform-specific locator suggestions
     */
    getLocatorSuggestions(platform?: string): string[] {
        const targetPlatform = platform || this.platform;

        if (targetPlatform === 'ios') {
            return [
                'accessibility-id (recommended for iOS)',
                'predicate (powerful iOS queries)',
                'class-chain (fast hierarchy traversal)',
                'xpath (with iOS optimizations)',
                'id (accessibility identifier)',
                'name (element name attribute)'
            ];
        } else if (targetPlatform === 'android') {
            return [
                'accessibility-id (content-desc)',
                'id (resource-id)',
                'uiautomator (powerful Android queries)',
                'xpath (with Android optimizations)',
                'text (element text content)',
                'datamatcher (data-driven apps)'
            ];
        }

        return [
            'accessibility-id (cross-platform)',
            'id (platform-specific)',
            'xpath (universal)',
            'class-name (basic)',
            'name (basic)'
        ];
    }
}
