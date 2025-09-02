import { BaseManager, AppiumResponse, MobileLocatorStrategy, MobileElementInfo } from './types.js';

/**
 * Element Manager - Handles mobile element location and interaction
 */
export class ElementManager implements BaseManager {
    private driver: WebdriverIO.Browser | null = null;

    setDriver(driver: WebdriverIO.Browser | null): void {
        this.driver = driver;
    }

    async findElement(strategy: MobileLocatorStrategy, value: string): Promise<AppiumResponse<MobileElementInfo>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const element = await this.driver.$(this.buildSelector(strategy, value));
            const elementId = await element.getAttribute('id') || 'unknown';

            const elementInfo: MobileElementInfo = {
                elementId,
                locator: value,
                strategy,
                text: await element.getText(),
                isDisplayed: await element.isDisplayed(),
                isEnabled: await element.isEnabled()
            };

            return {
                success: true,
                message: 'Element found successfully',
                data: elementInfo
            };
        } catch (error) {
            return {
                success: false,
                message: `Element not found: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async tapElement(strategy: MobileLocatorStrategy, value: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const element = await this.driver.$(this.buildSelector(strategy, value));
            await element.click();

            return {
                success: true,
                message: 'Element tapped successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to tap element: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async sendKeys(strategy: MobileLocatorStrategy, value: string, text: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const element = await this.driver.$(this.buildSelector(strategy, value));
            await element.setValue(text);

            return {
                success: true,
                message: 'Keys sent successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to send keys: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    private buildSelector(strategy: MobileLocatorStrategy, value: string): string {
        switch (strategy) {
            case 'accessibility-id':
                return `~${value}`;
            case 'id':
                return `#${value}`;
            case 'xpath':
                return value;
            case 'class':
                return `.${value}`;
            case 'name':
                return `[name="${value}"]`;
            case 'css':
                return value;
            default:
                return value;
        }
    }
}
