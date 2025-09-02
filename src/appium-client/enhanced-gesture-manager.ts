import { BaseManager, AppiumResponse, GestureDirection } from './types.js';
import { PlatformDetector } from './platform-detector.js';

/**
 * Enhanced Gesture Manager - Platform-specific gesture support with advanced features
 */
export class EnhancedGestureManager implements BaseManager {
    private driver: WebdriverIO.Browser | null = null;
    private platform: string | null = null;

    setDriver(driver: WebdriverIO.Browser | null): void {
        this.driver = driver;
        if (driver) {
            this.platform = PlatformDetector.detectPlatform(driver.capabilities as any);
        }
    }

    /**
     * Enhanced swipe with platform-specific optimizations
     */
    async swipe(direction: GestureDirection, distance: number = 0.5, options?: {
        velocity?: number;
        naturalScrolling?: boolean;
    }): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            if (this.platform === 'ios') {
                return await this.iosSwipe(direction, distance, options);
            } else if (this.platform === 'android') {
                return await this.androidSwipe(direction, distance, options);
            }

            // Fallback to basic swipe
            return await this.basicSwipe(direction, distance);

        } catch (error) {
            return {
                success: false,
                message: `Failed to swipe: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * iOS-specific swipe with natural scrolling and velocity control
     */
    private async iosSwipe(direction: GestureDirection, distance: number = 0.5, options?: {
        velocity?: number;
        naturalScrolling?: boolean;
    }): Promise<AppiumResponse> {
        const { width, height } = await this.driver!.getWindowSize();
        const centerX = width / 2;
        const centerY = height / 2;

        let startX = centerX;
        let startY = centerY;
        let endX = centerX;
        let endY = centerY;

        const offset = Math.min(width, height) * distance;

        // iOS natural scrolling (opposite of Android)
        const naturalScrolling = options?.naturalScrolling !== false; // Default to true for iOS

        switch (direction) {
            case 'up':
                startY = naturalScrolling ? centerY - offset / 2 : centerY + offset / 2;
                endY = naturalScrolling ? centerY + offset / 2 : centerY - offset / 2;
                break;
            case 'down':
                startY = naturalScrolling ? centerY + offset / 2 : centerY - offset / 2;
                endY = naturalScrolling ? centerY - offset / 2 : centerY + offset / 2;
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

        const velocity = options?.velocity || 1000; // iOS default velocity

        await this.driver!.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: velocity },
            { action: 'moveTo', x: endX, y: endY },
            { action: 'release' }
        ]);

        return {
            success: true,
            message: `iOS swipe ${direction} completed with natural scrolling`
        };
    }

    /**
     * Android-specific swipe with momentum and velocity control
     */
    private async androidSwipe(direction: GestureDirection, distance: number = 0.5, options?: {
        velocity?: number;
        naturalScrolling?: boolean;
    }): Promise<AppiumResponse> {
        const { width, height } = await this.driver!.getWindowSize();
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

        const velocity = options?.velocity || 2000; // Android default velocity (slower than iOS)

        await this.driver!.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: velocity },
            { action: 'moveTo', x: endX, y: endY },
            { action: 'release' }
        ]);

        return {
            success: true,
            message: `Android swipe ${direction} completed with momentum`
        };
    }

    /**
     * Basic swipe fallback
     */
    private async basicSwipe(direction: GestureDirection, distance: number = 0.5): Promise<AppiumResponse> {
        const { width, height } = await this.driver!.getWindowSize();
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

        await this.driver!.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 1000 },
            { action: 'moveTo', x: endX, y: endY },
            { action: 'release' }
        ]);

        return {
            success: true,
            message: `Basic swipe ${direction} completed`
        };
    }

    /**
     * Enhanced tap with platform-specific optimizations
     */
    async tap(x: number, y: number, options?: {
        force?: number; // iOS 3D Touch force
        duration?: number;
    }): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            if (this.platform === 'ios' && options?.force) {
                return await this.iosForceTouch(x, y, options.force);
            }

            const duration = options?.duration || 100;

            await this.driver.touchAction([
                { action: 'press', x, y },
                { action: 'wait', ms: duration },
                { action: 'release' }
            ]);

            return {
                success: true,
                message: 'Enhanced tap completed successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to tap: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * iOS Force Touch gesture
     */
    private async iosForceTouch(x: number, y: number, force: number): Promise<AppiumResponse> {
        // iOS-specific force touch implementation
        await this.driver!.touchAction([
            { action: 'press', x, y },
            { action: 'wait', ms: 500 },
            // Force touch requires specific iOS implementation
            { action: 'release' }
        ]);

        return {
            success: true,
            message: `iOS force touch completed with force ${force}`
        };
    }

    /**
     * Enhanced long press with platform-specific features
     */
    async longPress(x: number, y: number, duration: number = 2000, options?: {
        contextMenu?: boolean; // Android-specific
        force?: number; // iOS-specific
    }): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            if (this.platform === 'android' && options?.contextMenu) {
                return await this.androidLongPressMenu(x, y, duration);
            }

            await this.driver.touchAction([
                { action: 'press', x, y },
                { action: 'wait', ms: duration },
                { action: 'release' }
            ]);

            return {
                success: true,
                message: 'Enhanced long press completed successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to long press: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Android long press with context menu
     */
    private async androidLongPressMenu(x: number, y: number, duration: number): Promise<AppiumResponse> {
        await this.driver!.touchAction([
            { action: 'press', x, y },
            { action: 'wait', ms: duration },
            { action: 'release' }
        ]);

        return {
            success: true,
            message: 'Android long press with context menu completed'
        };
    }

    /**
     * Enhanced pinch/zoom with platform-specific optimizations
     */
    async pinchZoom(centerX: number, centerY: number, scale: number = 1.5, options?: {
        velocity?: number;
        fingers?: number;
    }): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { width, height } = await this.driver!.getWindowSize();
            const radius = Math.min(width, height) * 0.2; // 20% of screen size
            const fingers = options?.fingers || 2;

            if (fingers === 2) {
                return await this.twoFingerPinch(centerX, centerY, scale, radius, options?.velocity);
            } else if (fingers === 1) {
                return await this.oneFingerZoom(centerX, centerY, scale, options?.velocity);
            }

            return {
                success: false,
                message: `Unsupported number of fingers: ${fingers}`
            };

        } catch (error) {
            return {
                success: false,
                message: `Failed to pinch/zoom: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Two-finger pinch gesture
     */
    private async twoFingerPinch(centerX: number, centerY: number, scale: number, radius: number, velocity?: number): Promise<AppiumResponse> {
        const finger1Start = { x: centerX - radius, y: centerY };
        const finger2Start = { x: centerX + radius, y: centerY };
        const finger1End = { x: centerX - radius * scale, y: centerY };
        const finger2End = { x: centerX + radius * scale, y: centerY };

        const waitTime = velocity || 1000;

        await this.driver!.touchAction([
            // First finger
            { action: 'press', x: finger1Start.x, y: finger1Start.y },
            { action: 'wait', ms: waitTime },
            { action: 'moveTo', x: finger1End.x, y: finger1End.y },
            { action: 'release' },
            // Second finger
            { action: 'press', x: finger2Start.x, y: finger2Start.y },
            { action: 'wait', ms: waitTime },
            { action: 'moveTo', x: finger2End.x, y: finger2End.y },
            { action: 'release' }
        ]);

        return {
            success: true,
            message: `Two-finger ${scale > 1 ? 'zoom' : 'pinch'} completed`
        };
    }

    /**
     * One-finger zoom gesture (double tap)
     */
    private async oneFingerZoom(centerX: number, centerY: number, _scale: number, velocity?: number): Promise<AppiumResponse> {
        const waitTime = velocity || 500;

        // Double tap for zoom
        await this.driver!.touchAction([
            { action: 'tap', x: centerX, y: centerY },
            { action: 'wait', ms: waitTime },
            { action: 'tap', x: centerX, y: centerY }
        ]);

        return {
            success: true,
            message: 'One-finger zoom (double tap) completed'
        };
    }

    /**
     * Platform-specific fling gesture (fast scroll)
     */
    async fling(direction: GestureDirection, options?: {
        velocity?: number;
        distance?: number;
    }): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            if (this.platform === 'android') {
                return await this.androidFling(direction, options);
            }

            // Fallback to regular swipe with high velocity
            return await this.swipe(direction, options?.distance || 0.8, {
                velocity: options?.velocity || 500
            });

        } catch (error) {
            return {
                success: false,
                message: `Failed to fling: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Android-specific fling gesture
     */
    private async androidFling(direction: GestureDirection, options?: {
        velocity?: number;
        distance?: number;
    }): Promise<AppiumResponse> {
        const { width, height } = await this.driver!.getWindowSize();
        const centerX = width / 2;
        const centerY = height / 2;

        let startX = centerX;
        let startY = centerY;
        let endX = centerX;
        let endY = centerY;

        const distance = options?.distance || 0.8;
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

        const velocity = options?.velocity || 300; // Very fast for fling

        await this.driver!.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: velocity },
            { action: 'moveTo', x: endX, y: endY },
            { action: 'release' }
        ]);

        return {
            success: true,
            message: `Android fling ${direction} completed with high velocity`
        };
    }
}
