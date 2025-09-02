import { AppiumClient } from '../appium-client/index.js';

/**
 * Execute tool method by routing to appropriate AppiumClient methods
 * This is a basic implementation that will be expanded in Phase 3
 */
export async function executeToolMethod(
    appiumClient: AppiumClient,
    toolName: string,
    args: Record<string, any>
): Promise<any> {
    try {
        switch (toolName) {
            // Session management
            case 'start_session':
                return await appiumClient.startSession(args.capabilities || args);

            case 'end_session':
                return await appiumClient.endSession();

            // Device operations
            case 'get_device_info':
                return await appiumClient.getDeviceInfo();

            case 'rotate_device':
                return await appiumClient.getDeviceManager().rotateDevice(args.orientation);

            case 'get_screen_size':
                return await appiumClient.getDeviceManager().getScreenSize();

            // Element operations
            case 'find_mobile_element':
                return await appiumClient.getElementManager().findElement(
                    args.by,
                    args.value
                );

            case 'tap_element':
                return await appiumClient.getElementManager().tapElement(
                    args.by,
                    args.value
                );

            case 'send_mobile_keys':
                return await appiumClient.getElementManager().sendKeys(
                    args.by,
                    args.value,
                    args.text
                );

            // Gesture operations
            case 'swipe_screen':
                return await appiumClient.getGestureManager().swipe(
                    args.direction,
                    args.distance
                );

            case 'tap_screen':
                return await appiumClient.getGestureManager().tap(
                    args.x,
                    args.y
                );

            case 'long_press_screen':
                return await appiumClient.getGestureManager().longPress(
                    args.x,
                    args.y,
                    args.duration
                );

            // Context operations
            case 'get_available_contexts':
                return await appiumClient.getContextManager().getAvailableContexts();

            case 'switch_context':
                return await appiumClient.getContextManager().switchToContext(args.context);

            case 'get_current_context':
                return await appiumClient.getContextManager().getCurrentContext();

            // App operations
            case 'launch_app':
                return await appiumClient.getAppManager().launchApp(args.appId);

            case 'terminate_app':
                return await appiumClient.getAppManager().terminateApp(args.appId);

            case 'get_app_state':
                return await appiumClient.getAppManager().getAppState(args.appId);

            case 'background_app':
                return await appiumClient.getAppManager().backgroundApp(args.seconds);

            case 'reset_app':
                return await appiumClient.getAppManager().resetApp();

            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    } catch (error) {
        // Return error in consistent format
        return {
            success: false,
            message: `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
