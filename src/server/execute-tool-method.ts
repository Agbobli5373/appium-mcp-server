import { AppiumClient } from '../appium-client/index.js';

/**
 * Execute tool method by routing to appropriate AppiumClient methods
 * Maps the tool descriptor names (src/tools/*) to AppiumClient manager calls.
 * Aligns calls with current manager method names/signatures.
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

            // Element operations (use strategy+locator where supported)
            case 'find_mobile_element':
                return await appiumClient.getElementManager().findElement(
                    args.strategy,
                    args.locator
                );

            case 'tap_element':
                if (args.strategy && args.locator) {
                    return await appiumClient.getElementManager().tapElement(args.strategy, args.locator);
                }
                return { success: false, message: 'tap_element requires strategy and locator' };

            case 'send_mobile_keys':
                if (args.strategy && args.locator && typeof args.text === 'string') {
                    return await appiumClient.getElementManager().sendKeys(args.strategy, args.locator, args.text);
                }
                return { success: false, message: 'send_mobile_keys requires strategy, locator and text' };

            case 'get_element_text':
                if (args.strategy && args.locator) {
                    const res = await appiumClient.getElementManager().findElement(args.strategy, args.locator);
                    return { success: res.success, message: res.message, data: res.data?.text };
                }
                return { success: false, message: 'get_element_text requires strategy and locator' };

            case 'get_element_bounds':
                if (args.strategy && args.locator) {
                    const res = await appiumClient.getElementManager().findElement(args.strategy, args.locator);
                    return { success: res.success, message: res.message, data: res.data?.bounds };
                }
                return { success: false, message: 'get_element_bounds requires strategy and locator' };

            // Gesture operations (map to implemented GestureManager methods)
            case 'swipe_screen': {
                // Prefer direction-based swipe; infer direction if coordinates provided
                if (typeof args.startX === 'number' && typeof args.endX === 'number' && typeof args.startY === 'number' && typeof args.endY === 'number') {
                    const dx = args.endX - args.startX;
                    const dy = args.endY - args.startY;
                    const horizontal = Math.abs(dx) > Math.abs(dy);
                    const direction = horizontal ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
                    return await appiumClient.getGestureManager().swipe(direction as any, 0.5);
                }
                // fallback: accept direction & distance
                if (args.direction) {
                    return await appiumClient.getGestureManager().swipe(args.direction, args.distance);
                }
                return { success: false, message: 'swipe_screen requires coordinates or direction' };
            }

            case 'swipe_element':
                // Not implemented as element-specific swipe; fallback to swipe_screen
                return { success: false, message: 'swipe_element is not supported; use swipe_screen with coordinates' };

            case 'pinch_zoom': {
                if (typeof args.centerX === 'number' && typeof args.centerY === 'number') {
                    return await appiumClient.getGestureManager().pinchZoom(args.centerX, args.centerY, args.scale);
                }
                return { success: false, message: 'pinch_zoom requires centerX and centerY' };
            }

            case 'long_press':
                if (typeof args.x === 'number' && typeof args.y === 'number') {
                    return await appiumClient.getGestureManager().longPress(args.x, args.y, args.durationMs);
                }
                return { success: false, message: 'long_press requires x and y' };

            case 'double_tap':
                if (typeof args.x === 'number' && typeof args.y === 'number') {
                    return await appiumClient.getGestureManager().doubleTap(args.x, args.y);
                }
                return { success: false, message: 'double_tap requires x and y' };

            case 'multi_touch':
                if (Array.isArray(args.touches)) {
                    return await appiumClient.getGestureManager().multiTouch(args.touches);
                }
                return { success: false, message: 'multi_touch requires touches array' };

            case 'scroll': {
                if (typeof args.deltaX === 'number' || typeof args.deltaY === 'number') {
                    // derive direction from deltas
                    const dx = args.deltaX || 0;
                    const dy = args.deltaY || 0;
                    const horizontal = Math.abs(dx) > Math.abs(dy);
                    const direction = horizontal ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
                    const distance = 0.5;
                    return await appiumClient.getGestureManager().scroll(direction as any, distance);
                }
                return { success: false, message: 'scroll requires deltaX or deltaY' };
            }

            // Context operations (match src/tools/context-management.ts)
            case 'get_contexts':
                return await appiumClient.getContextManager().getAvailableContexts();

            case 'get_current_context':
                return await appiumClient.getContextManager().getCurrentContext();

            case 'switch_context':
                return await appiumClient.getContextManager().switchToContext(args.contextName);

            case 'get_context_details':
                return await appiumClient.getContextManager().getContextDetails();

            case 'switch_to_webview':
                return await appiumClient.getContextManager().switchToWebView(args.index);

            case 'switch_to_native':
                return await appiumClient.getContextManager().switchToNative();

            case 'is_webview_available':
                return await appiumClient.getContextManager().isWebViewAvailable();

            case 'get_webview_count':
                return await appiumClient.getContextManager().getWebViewCount();

            // App operations (match src/tools/app-management.ts)
            case 'launch_app':
                return await appiumClient.getAppManager().launchApp(args.appId);

            case 'terminate_app':
                return await appiumClient.getAppManager().terminateApp(args.appId);

            case 'get_app_state':
                return await appiumClient.getAppManager().getAppState(args.appId);

            case 'is_app_installed':
                return await appiumClient.getAppManager().isAppInstalled(args.bundleId);

            case 'install_app':
                return await appiumClient.getAppManager().installApp(args.appPath);

            case 'remove_app':
                return await appiumClient.getAppManager().removeApp(args.bundleId);

            case 'get_app_strings':
                return await appiumClient.getAppManager().getAppStrings(args.language, args.stringFile);

            case 'start_activity':
                return await appiumClient.getAppManager().startActivity(
                    args.appPackage,
                    args.appActivity,
                    args.appWaitPackage,
                    args.appWaitActivity
                );

            case 'get_current_activity':
                return await appiumClient.getAppManager().getCurrentActivity();

            case 'get_current_package':
                return await appiumClient.getAppManager().getCurrentPackage();

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
