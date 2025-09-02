import { AppiumClient } from '../appium-client/index.js';
import Ajv from 'ajv';
import type { ValidateFunction } from 'ajv';
import { tools } from '../tools/index.js';

/**
 * Execute tool method by routing to appropriate AppiumClient methods
 * Single place for input checking and normalized responses.
 */

const ajv = new Ajv();
const validators = new Map<string, ValidateFunction>();

function validateToolInput(toolName: string, args: Record<string, any>) {
    const toolDef = tools.find(t => t.name === toolName);
    if (!toolDef || !('inputSchema' in toolDef) || !toolDef.inputSchema) return null;
    let validate = validators.get(toolName);
    if (!validate) {
        validate = ajv.compile(toolDef.inputSchema as any);
        validators.set(toolName, validate);
    }
    const valid = validate(args);
    if (valid) return null;
    if (validate.errors) {
        // Normalize common required-property errors into a readable message for tests/clients
        const requiredErrors = (validate.errors as any[]).filter(e => e.keyword === 'required').map(e => (e.params && (e.params as any).missingProperty) || e.message);
        if (requiredErrors.length) {
            const uniq = Array.from(new Set(requiredErrors));
            return `Missing required properties: ${uniq.join(', ')}`;
        }
        return JSON.stringify(validate.errors);
    }
    return 'Invalid input';
}

function wrapResult(res: any) {
    if (res && typeof res === 'object' && 'success' in res) return res;
    return { success: true, message: 'OK', data: res };
}

function wrapError(message: string, err?: any) {
    return {
        success: false,
        message,
        error: err instanceof Error ? err.message : err
    };
}

function validateRequiredProps(required: string[], args: Record<string, any>) {
    const missing = required.filter(p => !(p in args));
    if (missing.length) {
        return `Missing required properties: ${missing.join(', ')}`;
    }
    return null;
}

export async function executeToolMethod(
    appiumClient: AppiumClient,
    toolName: string,
    args: Record<string, any> = {}
): Promise<any> {
    try {
        const validationError = validateToolInput(toolName, args);
        if (validationError) return wrapError(`Invalid input: ${validationError}`);
        switch (toolName) {
            // Session management
            case 'start_session': {
                const err = validateRequiredProps(['capabilities'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.startSession(args.capabilities || args);
                return wrapResult(res);
            }

            case 'end_session': {
                const res = await appiumClient.endSession();
                return wrapResult(res);
            }

            // Device operations
            case 'get_device_info': {
                const res = await appiumClient.getDeviceInfo();
                return wrapResult(res);
            }

            case 'rotate_device': {
                const err = validateRequiredProps(['orientation'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getDeviceManager().rotateDevice(args.orientation);
                return wrapResult(res);
            }

            case 'get_screen_size': {
                const res = await appiumClient.getDeviceManager().getScreenSize();
                return wrapResult(res);
            }

            // Element operations
            case 'find_mobile_element': {
                const err = validateRequiredProps(['strategy', 'locator'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getElementManager().findElement(args.strategy, args.locator);
                return wrapResult(res);
            }

            case 'tap_element': {
                const err = validateRequiredProps(['strategy', 'locator'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getElementManager().tapElement(args.strategy, args.locator);
                return wrapResult(res);
            }

            case 'send_mobile_keys': {
                const err = validateRequiredProps(['strategy', 'locator', 'text'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getElementManager().sendKeys(args.strategy, args.locator, args.text);
                return wrapResult(res);
            }

            case 'get_element_text': {
                const err = validateRequiredProps(['strategy', 'locator'], args);
                if (err) return wrapError(err);
                const found = await appiumClient.getElementManager().findElement(args.strategy, args.locator);
                return wrapResult(found.success ? found.data?.text : found);
            }

            case 'get_element_bounds': {
                const err = validateRequiredProps(['strategy', 'locator'], args);
                if (err) return wrapError(err);
                const found = await appiumClient.getElementManager().findElement(args.strategy, args.locator);
                return wrapResult(found.success ? found.data?.bounds : found);
            }

            // Gesture operations
            case 'swipe_screen': {
                // accept either direction/distance or coordinates
                if (args.direction) {
                    const res = await appiumClient.getGestureManager().swipe(args.direction, args.distance);
                    return wrapResult(res);
                }
                if (typeof args.startX === 'number' && typeof args.endX === 'number' && typeof args.startY === 'number' && typeof args.endY === 'number') {
                    const dx = args.endX - args.startX;
                    const dy = args.endY - args.startY;
                    const horizontal = Math.abs(dx) > Math.abs(dy);
                    const direction = horizontal ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
                    const res = await appiumClient.getGestureManager().swipe(direction as any, args.distance || 0.5);
                    return wrapResult(res);
                }
                return wrapError('swipe_screen requires direction or start/end coordinates');
            }

            case 'swipe_element': {
                return wrapError('swipe_element is not supported; use swipe_screen with coordinates');
            }

            case 'pinch_zoom': {
                const err = validateRequiredProps(['centerX', 'centerY'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getGestureManager().pinchZoom(args.centerX, args.centerY, args.scale);
                return wrapResult(res);
            }

            case 'long_press': {
                const err = validateRequiredProps(['x', 'y'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getGestureManager().longPress(args.x, args.y, args.durationMs);
                return wrapResult(res);
            }

            case 'double_tap': {
                const err = validateRequiredProps(['x', 'y'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getGestureManager().doubleTap(args.x, args.y);
                return wrapResult(res);
            }

            case 'multi_touch': {
                const err = validateRequiredProps(['touches'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getGestureManager().multiTouch(args.touches);
                return wrapResult(res);
            }

            case 'scroll': {
                const err = validateRequiredProps(['deltaX', 'deltaY'], args);
                if (err) {
                    // allow either deltaX or deltaY individually
                    if (typeof args.deltaX === 'number' || typeof args.deltaY === 'number') {
                        const dx = args.deltaX || 0;
                        const dy = args.deltaY || 0;
                        const horizontal = Math.abs(dx) > Math.abs(dy);
                        const direction = horizontal ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
                        const res = await appiumClient.getGestureManager().scroll(direction as any, args.distance || 0.5);
                        return wrapResult(res);
                    }
                    return wrapError(err);
                }
                const dx = args.deltaX || 0;
                const dy = args.deltaY || 0;
                const horizontal = Math.abs(dx) > Math.abs(dy);
                const direction = horizontal ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
                const res = await appiumClient.getGestureManager().scroll(direction as any, args.distance || 0.5);
                return wrapResult(res);
            }

            case 'rotate_gesture': {
                // rotate gesture not implemented in GestureManager yet
                return wrapError('rotate_gesture is not implemented');
            }

            case 'take_mobile_screenshot': {
                const driver = appiumClient.getDriver && appiumClient.getDriver();
                if (!driver) return wrapError('No active session');
                try {
                    const imgBase64 = await driver.takeScreenshot();
                    // always return base64 string under screenshot property
                    return wrapResult({ screenshot: imgBase64 });
                } catch (err) {
                    return wrapError('Failed to take screenshot', err);
                }
            }

            case 'get_page_source': {
                const driver = appiumClient.getDriver && appiumClient.getDriver();
                if (!driver) return wrapError('No active session');
                try {
                    const src = await driver.getPageSource();
                    return wrapResult({ pageSource: src });
                } catch (err) {
                    return wrapError('Failed to get page source', err);
                }
            }

            case 'wait_mobile_element': {
                const err = validateRequiredProps(['strategy', 'locator'], args);
                if (err) return wrapError(err);
                // reuse element manager's findElement which already waits
                const res = await appiumClient.getElementManager().findElement(args.strategy, args.locator);
                return wrapResult(res);
            }

            case 'scroll_mobile': {
                // alias to scroll with direction/distance or delta
                if (args.direction) {
                    const res = await appiumClient.getGestureManager().scroll(args.direction, args.distance || 0.5);
                    return wrapResult(res);
                }
                const dx = args.deltaX || 0;
                const dy = args.deltaY || 0;
                if (typeof dx === 'number' || typeof dy === 'number') {
                    const horizontal = Math.abs(dx) > Math.abs(dy);
                    const direction = horizontal ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
                    const res = await appiumClient.getGestureManager().scroll(direction as any, args.distance || 0.5);
                    return wrapResult(res);
                }
                return wrapError('scroll_mobile requires direction or delta values');
            }

            case 'long_press_element': {
                const err = validateRequiredProps(['strategy', 'locator'], args);
                if (err) return wrapError(err);
                const found = await appiumClient.getElementManager().findElement(args.strategy, args.locator);
                if (!found || !found.success) return wrapError('Element not found for long_press_element');
                const bounds = found.data?.bounds;
                if (!bounds) return wrapError('Element bounds not available for long_press_element');
                const centerX = Math.floor(bounds.x + bounds.width / 2);
                const centerY = Math.floor(bounds.y + bounds.height / 2);
                const res = await appiumClient.getGestureManager().longPress(centerX, centerY, args.durationMs);
                return wrapResult(res);
            }

            // Context operations
            case 'get_contexts': {
                const res = await appiumClient.getContextManager().getAvailableContexts();
                return wrapResult(res);
            }

            case 'get_current_context': {
                const res = await appiumClient.getContextManager().getCurrentContext();
                return wrapResult(res);
            }

            case 'switch_context': {
                const err = validateRequiredProps(['contextName'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getContextManager().switchToContext(args.contextName);
                return wrapResult(res);
            }

            case 'get_context_details': {
                const res = await appiumClient.getContextManager().getContextDetails();
                return wrapResult(res);
            }

            case 'switch_to_webview': {
                const err = validateRequiredProps(['index'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getContextManager().switchToWebView(args.index);
                return wrapResult(res);
            }

            case 'switch_to_native': {
                const res = await appiumClient.getContextManager().switchToNative();
                return wrapResult(res);
            }

            case 'is_webview_available': {
                const res = await appiumClient.getContextManager().isWebViewAvailable();
                return wrapResult(res);
            }

            case 'get_webview_count': {
                const res = await appiumClient.getContextManager().getWebViewCount();
                return wrapResult(res);
            }

            // App operations
            case 'launch_app': {
                const res = await appiumClient.getAppManager().launchApp(args.appId);
                return wrapResult(res);
            }

            case 'terminate_app': {
                const res = await appiumClient.getAppManager().terminateApp(args.appId);
                return wrapResult(res);
            }

            case 'get_app_state': {
                const err = validateRequiredProps(['appId'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getAppManager().getAppState(args.appId);
                return wrapResult(res);
            }

            case 'is_app_installed': {
                const err = validateRequiredProps(['bundleId'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getAppManager().isAppInstalled(args.bundleId);
                return wrapResult(res);
            }

            case 'install_app': {
                const err = validateRequiredProps(['appPath'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getAppManager().installApp(args.appPath);
                return wrapResult(res);
            }

            case 'remove_app': {
                const err = validateRequiredProps(['bundleId'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getAppManager().removeApp(args.bundleId);
                return wrapResult(res);
            }

            case 'get_app_strings': {
                const res = await appiumClient.getAppManager().getAppStrings(args.language, args.stringFile);
                return wrapResult(res);
            }

            case 'start_activity': {
                const err = validateRequiredProps(['appPackage', 'appActivity'], args);
                if (err) return wrapError(err);
                const res = await appiumClient.getAppManager().startActivity(
                    args.appPackage,
                    args.appActivity,
                    args.appWaitPackage,
                    args.appWaitActivity
                );
                return wrapResult(res);
            }

            case 'get_current_activity': {
                const res = await appiumClient.getAppManager().getCurrentActivity();
                return wrapResult(res);
            }

            case 'get_current_package': {
                const res = await appiumClient.getAppManager().getCurrentPackage();
                return wrapResult(res);
            }

            case 'background_app': {
                const res = await appiumClient.getAppManager().backgroundApp(args.seconds);
                return wrapResult(res);
            }

            case 'reset_app': {
                const res = await appiumClient.getAppManager().resetApp();
                return wrapResult(res);
            }

            default:
                return wrapError(`Unknown tool: ${toolName}`);
        }
    } catch (error) {
        return wrapError('Tool execution failed', error);
    }
}
