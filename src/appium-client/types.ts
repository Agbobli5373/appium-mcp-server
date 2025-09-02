

/**
 * Core types and interfaces for the Appium MCP client
 */

// Device capabilities for Appium sessions
export interface DeviceCapabilities {
    platformName: 'Android' | 'iOS';
    platformVersion: string;
    deviceName: string;
    automationName: 'UiAutomator2' | 'XCUITest';
    app?: string;
    appPackage?: string;
    appActivity?: string;
    bundleId?: string;
    udid?: string;
    noReset?: boolean;
    fullReset?: boolean;
    newCommandTimeout?: number;
    appiumVersion?: string;
    [key: string]: any;
}

// Mobile element locator strategies
export type MobileLocatorStrategy =
    | 'accessibility-id'
    | 'id'
    | 'xpath'
    | 'class'
    | 'name'
    | 'css'
    | 'tag'
    | 'link'
    | 'partial-link'
    | 'predicate'      // iOS NSPredicate
    | 'class-chain'    // iOS Class Chain
    | 'uiautomator'    // Android UiAutomator
    | 'datamatcher'    // Android DataMatcher
    | 'text'           // Android text content
    | 'class-name';    // Alternative class name

// Response types for operations
export interface AppiumResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

// Device information
export interface DeviceInfo {
    platformName: string;
    platformVersion: string;
    deviceName: string;
    udid?: string;
    screenSize: {
        width: number;
        height: number;
    };
    orientation: 'PORTRAIT' | 'LANDSCAPE';
    batteryLevel?: number;
    isRealDevice: boolean;
}

// Mobile element information
export interface MobileElementInfo {
    elementId: string;
    locator: string;
    strategy: MobileLocatorStrategy;
    text?: string;
    bounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    attributes?: Record<string, any>;
    isDisplayed: boolean;
    isEnabled: boolean;
    isSelected?: boolean;
}

// Gesture types
export type GestureDirection = 'up' | 'down' | 'left' | 'right';
export type GestureType = 'swipe' | 'pinch' | 'zoom' | 'rotate' | 'tap' | 'long-press';

export interface GestureOptions {
    direction?: GestureDirection;
    distance?: number;
    duration?: number;
    startPoint?: { x: number; y: number };
    endPoint?: { x: number; y: number };
    elementId?: string;
}

// App context information
export interface AppContext {
    context: string;
    name?: string;
    url?: string;
    title?: string;
}

// Session information
export interface SessionInfo {
    sessionId: string;
    capabilities: DeviceCapabilities;
    startTime: Date;
    lastActivity: Date;
}

// Base manager interface
export interface BaseManager {
    setDriver(driver: WebdriverIO.Browser | null): void;
}

// Error types
export class AppiumError extends Error {
    constructor(
        message: string,
        public code: string,
        public details?: any
    ) {
        super(message);
        this.name = 'AppiumError';
    }
}

// Platform-specific types
export type PlatformType = 'ios' | 'android';
export type AndroidCapabilities = DeviceCapabilities & {
    platformName: 'Android';
    automationName: 'UiAutomator2';
    appPackage?: string;
    appActivity?: string;
    avd?: string;
};

export type IOSCapabilities = DeviceCapabilities & {
    platformName: 'iOS';
    automationName: 'XCUITest';
    bundleId?: string;
    xcodeOrgId?: string;
    xcodeSigningId?: string;
};

// Union type for all capabilities
export type AppiumCapabilities = AndroidCapabilities | IOSCapabilities;

// Tool execution context
export interface ToolContext {
    sessionId?: string;
    driver?: WebdriverIO.Browser;
    capabilities?: AppiumCapabilities;
}

// WebdriverIO types are available globally when importing from 'webdriverio'
