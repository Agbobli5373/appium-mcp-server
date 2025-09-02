// Main Appium client
export { AppiumClient } from './appium-client.js';

// Individual managers for advanced usage
export { DeviceManager } from './device-manager.js';
export { ElementManager } from './element-manager.js';
export { GestureManager } from './gesture-manager.js';
export { EnhancedGestureManager } from './enhanced-gesture-manager.js';
export { LocatorManager } from './locator-manager.js';
export { ContextManager } from './context-manager.js';
export { AppManager } from './app-manager.js';
export { IOSManager } from './ios-manager.js';
export { AndroidManager } from './android-manager.js';

// Types and interfaces
export type {
    AppiumCapabilities,
    AndroidCapabilities,
    IOSCapabilities,
    DeviceCapabilities,
    MobileLocatorStrategy,
    AppiumResponse,
    DeviceInfo,
    MobileElementInfo,
    GestureDirection,
    GestureOptions,
    AppContext,
    SessionInfo,
    BaseManager,
    ToolContext
} from './types.js';

// Export AppiumError for error handling
export { AppiumError } from './types.js';
