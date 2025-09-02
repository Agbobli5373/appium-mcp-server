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

    async pinchZoom(centerX: number, centerY: number, scale: number = 1.5): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { width, height } = await this.driver.getWindowSize();
            const radius = Math.min(width, height) * 0.2; // 20% of screen size

            // Calculate finger positions
            const finger1Start = { x: centerX - radius, y: centerY };
            const finger2Start = { x: centerX + radius, y: centerY };
            const finger1End = { x: centerX - radius * scale, y: centerY };
            const finger2End = { x: centerX + radius * scale, y: centerY };

            await this.driver.touchAction([
                // First finger
                { action: 'press', x: finger1Start.x, y: finger1Start.y },
                { action: 'wait', ms: 500 },
                { action: 'moveTo', x: finger1End.x, y: finger1End.y },
                { action: 'release' },
                // Second finger
                { action: 'press', x: finger2Start.x, y: finger2Start.y },
                { action: 'wait', ms: 500 },
                { action: 'moveTo', x: finger2End.x, y: finger2End.y },
                { action: 'release' }
            ]);

            return {
                success: true,
                message: `Pinch zoom with scale ${scale} completed successfully`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to perform pinch zoom: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async multiTouch(points: Array<{ x: number; y: number; action: 'tap' | 'press' | 'release' }>): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const actions = points.map(point => ({
                action: point.action,
                x: point.x,
                y: point.y
            }));

            await this.driver.touchAction(actions);

            return {
                success: true,
                message: 'Multi-touch gesture completed successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to perform multi-touch: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async scroll(direction: 'up' | 'down' | 'left' | 'right', distance: number = 0.8): Promise<AppiumResponse> {
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

            const scrollDistance = Math.min(width, height) * distance;

            switch (direction) {
                case 'up':
                    startY = centerY + scrollDistance / 2;
                    endY = centerY - scrollDistance / 2;
                    break;
                case 'down':
                    startY = centerY - scrollDistance / 2;
                    endY = centerY + scrollDistance / 2;
                    break;
                case 'left':
                    startX = centerX + scrollDistance / 2;
                    endX = centerX - scrollDistance / 2;
                    break;
                case 'right':
                    startX = centerX - scrollDistance / 2;
                    endX = centerX + scrollDistance / 2;
                    break;
            }

            await this.driver.touchAction([
                { action: 'press', x: startX, y: startY },
                { action: 'wait', ms: 100 },
                { action: 'moveTo', x: endX, y: endY },
                { action: 'release' }
            ]);

            return {
                success: true,
                message: `Scroll ${direction} completed successfully`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to scroll: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    async doubleTap(x: number, y: number): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            // Perform two quick taps
            await this.driver.touchAction([
                { action: 'tap', x, y },
                { action: 'wait', ms: 100 },
                { action: 'tap', x, y }
            ]);

            return {
                success: true,
                message: 'Double tap completed successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to double tap: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
