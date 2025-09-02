import { AppiumClient } from '../appium-client/index.js';
import { AppiumResponse, GestureDirection } from '../appium-client/types.js';
import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Enhanced Gesture Tools - Platform-specific gesture operations for MCP
 */
export class EnhancedGestureTools {
    private client: AppiumClient;

    constructor(client: AppiumClient) {
        this.client = client;
    }

    /**
     * Enhanced swipe with platform-specific optimizations
     */
    async swipe(args: {
        direction: GestureDirection;
        distance?: number;
        velocity?: number;
        naturalScrolling?: boolean;
    }): Promise<AppiumResponse> {
        const options: { velocity?: number; naturalScrolling?: boolean } = {};
        if (args.velocity !== undefined) options.velocity = args.velocity;
        if (args.naturalScrolling !== undefined) options.naturalScrolling = args.naturalScrolling;

        return await this.client.getEnhancedGestureManager().swipe(
            args.direction,
            args.distance,
            options
        );
    }

    /**
     * Enhanced tap with platform-specific features
     */
    async tap(args: {
        x: number;
        y: number;
        force?: number;
        duration?: number;
    }): Promise<AppiumResponse> {
        const options: { force?: number; duration?: number } = {};
        if (args.force !== undefined) options.force = args.force;
        if (args.duration !== undefined) options.duration = args.duration;

        return await this.client.getEnhancedGestureManager().tap(
            args.x,
            args.y,
            options
        );
    }

    /**
     * Enhanced long press with platform-specific features
     */
    async longPress(args: {
        x: number;
        y: number;
        duration?: number;
        contextMenu?: boolean;
        force?: number;
    }): Promise<AppiumResponse> {
        const options: { contextMenu?: boolean; force?: number } = {};
        if (args.contextMenu !== undefined) options.contextMenu = args.contextMenu;
        if (args.force !== undefined) options.force = args.force;

        return await this.client.getEnhancedGestureManager().longPress(
            args.x,
            args.y,
            args.duration,
            options
        );
    }

    /**
     * Enhanced pinch/zoom gesture
     */
    async pinchZoom(args: {
        centerX: number;
        centerY: number;
        scale?: number;
        velocity?: number;
        fingers?: number;
    }): Promise<AppiumResponse> {
        const options: { velocity?: number; fingers?: number } = {};
        if (args.velocity !== undefined) options.velocity = args.velocity;
        if (args.fingers !== undefined) options.fingers = args.fingers;

        return await this.client.getEnhancedGestureManager().pinchZoom(
            args.centerX,
            args.centerY,
            args.scale,
            options
        );
    }

    /**
     * Platform-specific fling gesture (fast scroll)
     */
    async fling(args: {
        direction: GestureDirection;
        velocity?: number;
        distance?: number;
    }): Promise<AppiumResponse> {
        const options: { velocity?: number; distance?: number } = {};
        if (args.velocity !== undefined) options.velocity = args.velocity;
        if (args.distance !== undefined) options.distance = args.distance;

        return await this.client.getEnhancedGestureManager().fling(
            args.direction,
            options
        );
    }

    /**
     * iOS-specific natural scroll gesture
     */
    async iosNaturalScroll(args: {
        direction: GestureDirection;
        distance?: number;
        velocity?: number;
    }): Promise<AppiumResponse> {
        const options: { velocity?: number; naturalScrolling?: boolean } = { naturalScrolling: true };
        if (args.velocity !== undefined) options.velocity = args.velocity;

        return await this.client.getEnhancedGestureManager().swipe(
            args.direction,
            args.distance,
            options
        );
    }

    /**
     * iOS-specific force touch gesture
     */
    async iosForceTouch(args: {
        x: number;
        y: number;
        force: number;
    }): Promise<AppiumResponse> {
        return await this.client.getEnhancedGestureManager().tap(
            args.x,
            args.y,
            {
                force: args.force,
                duration: 500
            }
        );
    }

    /**
     * Android-specific fling gesture
     */
    async androidFling(args: {
        direction: GestureDirection;
        velocity?: number;
        distance?: number;
    }): Promise<AppiumResponse> {
        const options: { velocity?: number; distance?: number } = {};
        if (args.velocity !== undefined) options.velocity = args.velocity;
        if (args.distance !== undefined) options.distance = args.distance;

        return await this.client.getEnhancedGestureManager().fling(
            args.direction,
            options
        );
    }

    /**
     * Android-specific long press with context menu
     */
    async androidLongPressMenu(args: {
        x: number;
        y: number;
        duration?: number;
    }): Promise<AppiumResponse> {
        return await this.client.getEnhancedGestureManager().longPress(
            args.x,
            args.y,
            args.duration,
            {
                contextMenu: true
            }
        );
    }
}

/**
 * MCP Tool definitions for enhanced gesture operations
 */
export const enhancedGestureTools: Tool[] = [
    {
        name: "enhanced_swipe",
        description: "Enhanced swipe with platform-specific optimizations (iOS natural scrolling, Android momentum)",
        inputSchema: {
            type: "object",
            properties: {
                direction: {
                    type: "string",
                    enum: ["up", "down", "left", "right"],
                    description: "Direction to swipe"
                },
                distance: {
                    type: "number",
                    description: "Distance to swipe (0.1 to 1.0, default 0.5)",
                    minimum: 0.1,
                    maximum: 1.0
                },
                velocity: {
                    type: "number",
                    description: "Swipe velocity in milliseconds (default platform-specific)"
                },
                naturalScrolling: {
                    type: "boolean",
                    description: "Use natural scrolling (iOS default: true, Android: false)"
                }
            },
            required: ["direction"],
            additionalProperties: false
        }
    },
    {
        name: "enhanced_tap",
        description: "Enhanced tap with platform-specific features (iOS force touch)",
        inputSchema: {
            type: "object",
            properties: {
                x: { type: "number", description: "X coordinate to tap" },
                y: { type: "number", description: "Y coordinate to tap" },
                force: { type: "number", description: "Force for 3D touch (iOS only)" },
                duration: { type: "number", description: "Tap duration in milliseconds" }
            },
            required: ["x", "y"],
            additionalProperties: false
        }
    },
    {
        name: "enhanced_long_press",
        description: "Enhanced long press with platform-specific features",
        inputSchema: {
            type: "object",
            properties: {
                x: { type: "number", description: "X coordinate to long press" },
                y: { type: "number", description: "Y coordinate to long press" },
                duration: { type: "number", description: "Press duration in milliseconds (default 2000)" },
                contextMenu: { type: "boolean", description: "Show context menu on release (Android)" },
                force: { type: "number", description: "Force for 3D touch (iOS)" }
            },
            required: ["x", "y"],
            additionalProperties: false
        }
    },
    {
        name: "enhanced_pinch_zoom",
        description: "Enhanced pinch/zoom with multi-finger support",
        inputSchema: {
            type: "object",
            properties: {
                centerX: { type: "number", description: "Center X coordinate" },
                centerY: { type: "number", description: "Center Y coordinate" },
                scale: { type: "number", description: "Scale factor (>1 zoom in, <1 zoom out, default 1.5)" },
                velocity: { type: "number", description: "Gesture velocity" },
                fingers: { type: "number", description: "Number of fingers (1 or 2, default 2)" }
            },
            required: ["centerX", "centerY"],
            additionalProperties: false
        }
    },
    {
        name: "fling_gesture",
        description: "Platform-specific fling gesture (fast scroll with momentum)",
        inputSchema: {
            type: "object",
            properties: {
                direction: {
                    type: "string",
                    enum: ["up", "down", "left", "right"],
                    description: "Direction to fling"
                },
                velocity: { type: "number", description: "Fling velocity (higher = faster)" },
                distance: { type: "number", description: "Fling distance (0.1 to 1.0, default 0.8)" }
            },
            required: ["direction"],
            additionalProperties: false
        }
    },
    {
        name: "ios_natural_scroll",
        description: "iOS natural scrolling gesture (opposite of Android)",
        inputSchema: {
            type: "object",
            properties: {
                direction: {
                    type: "string",
                    enum: ["up", "down", "left", "right"],
                    description: "Direction to scroll naturally"
                },
                distance: { type: "number", description: "Scroll distance (default 0.5)" },
                velocity: { type: "number", description: "Scroll velocity" }
            },
            required: ["direction"],
            additionalProperties: false
        }
    },
    {
        name: "ios_force_touch",
        description: "iOS 3D Touch gesture with force sensitivity",
        inputSchema: {
            type: "object",
            properties: {
                x: { type: "number", description: "X coordinate to force touch" },
                y: { type: "number", description: "Y coordinate to force touch" },
                force: { type: "number", description: "Force level (1-6, higher = more force)" }
            },
            required: ["x", "y", "force"],
            additionalProperties: false
        }
    },
    {
        name: "android_fling",
        description: "Android-specific fling gesture with momentum",
        inputSchema: {
            type: "object",
            properties: {
                direction: {
                    type: "string",
                    enum: ["up", "down", "left", "right"],
                    description: "Direction to fling"
                },
                velocity: { type: "number", description: "Fling velocity" },
                distance: { type: "number", description: "Fling distance" }
            },
            required: ["direction"],
            additionalProperties: false
        }
    },
    {
        name: "android_long_press_menu",
        description: "Android long press with context menu",
        inputSchema: {
            type: "object",
            properties: {
                x: { type: "number", description: "X coordinate to long press" },
                y: { type: "number", description: "Y coordinate to long press" },
                duration: { type: "number", description: "Press duration in milliseconds" }
            },
            required: ["x", "y"],
            additionalProperties: false
        }
    }
];
