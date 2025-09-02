import { BaseManager, AppiumResponse, GestureDirection } from './types.js';

/**
 * Gesture Manager - Handles touch gestures and mobile interactions
 */
export class GestureManager implements BaseManager {
    private driver: WebdriverIO.Browser | null = null;

    setDriver(driver: WebdriverIO.Browser | null): void {
        this.driver = driver;
    }

    async swipe(direction: GestureDirection, distance: number = 0.5): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { width, height } = await this.driver.getWindowSize();
            const centerX = width / 2;
            const centerY = height / 2;

            let startX = centerX;
            let startY = centerY;
            let endX = centerX;
            let endY = centerY;

            const offset = Math.min(width, height) * distance;

            switch (direction) {
                case 'up':
                    startY = centerY + offset / 2;
                    endY = centerY - offset / 2;
                    break;
                case 'down':
                    startY = centerY - offset / 2;
                    endY = centerY + offset / 2;
                    break;
                case 'left':
                    startX = centerX + offset / 2;
                    endX = centerX - offset / 2;
                    break;
                case 'right':
                    startX = centerX - offset / 2;
                    endX = centerX + offset / 2;
                    break;
            }

            await this.driver.touchAction([
                { action: 'press', x: startX, y: startY },
                { action: 'wait', ms: 1000 },
                { action: 'moveTo', x: endX, y: endY },
                { action: 'release' }
            ]);

            return {
                success: true,
                message: `Swipe ${direction} completed successfully`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to swipe: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async tap(x: number, y: number): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            await this.driver.touchAction([
                { action: 'tap', x, y }
            ]);

            return {
                success: true,
                message: 'Tap completed successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to tap: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async longPress(x: number, y: number, duration: number = 2000): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            await this.driver.touchAction([
                { action: 'press', x, y },
                { action: 'wait', ms: duration },
                { action: 'release' }
            ]);

            return {
                success: true,
                message: 'Long press completed successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to long press: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
