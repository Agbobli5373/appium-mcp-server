import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppiumClient } from '../../src/appium-client/appium-client';
import { PlatformDetector } from '../../src/appium-client/platform-detector';

// Mock child_process module
vi.mock('child_process', () => ({
    execSync: vi.fn((command: string) => {
        if (command.includes('xcrun simctl list devices --json')) {
            // Mock iOS simulator list response
            return JSON.stringify({
                devices: {
                    'com.apple.CoreSimulator.SimRuntime.iOS-17-0': [
                        {
                            name: 'iPhone 14',
                            udid: '12345678-1234-1234-1234-123456789012',
                            state: 'Shutdown'
                        },
                        {
                            name: 'iPhone 15',
                            udid: '87654321-4321-4321-4321-210987654321',
                            state: 'Booted'
                        }
                    ]
                }
            });
        } else if (command.includes('emulator -list-avds')) {
            // Mock Android emulator list response
            return 'Pixel_6_API_33\nPixel_7_API_34\nNexus_5X_API_28\n';
        }
        throw new Error(`Command not mocked: ${command}`);
    })
}));

// Mock WebDriver
const mockWebDriver = {
    execute: vi.fn(),
    executeScript: vi.fn(),
    findElement: vi.fn(),
    findElements: vi.fn(),
    wait: vi.fn(),
    getCapabilities: vi.fn(),
    getSessionId: vi.fn(),
    quit: vi.fn(),
    capabilities: {
        platformName: 'iOS',
        platformVersion: '17.0'
    }
};

describe('Phase 5 Integration Tests', () => {
    let appiumClient: AppiumClient;

    beforeEach(() => {
        appiumClient = new AppiumClient();
        (appiumClient as any).driver = mockWebDriver;

        // Update managers with driver reference
        appiumClient.getIOSManager().setDriver(mockWebDriver as any);
        appiumClient.getAndroidManager().setDriver(mockWebDriver as any);
        appiumClient.getEnhancedGestureManager().setDriver(mockWebDriver as any);
        appiumClient.getLocatorManager().setDriver(mockWebDriver as any);
    });

    describe('Platform Detection', () => {
        it('should detect iOS platform', () => {
            const capabilities = {
                platformName: 'iOS' as const,
                platformVersion: '17.0',
                deviceName: 'iPhone 14',
                automationName: 'XCUITest' as const
            };
            const platform = PlatformDetector.detectPlatform(capabilities);
            expect(platform).toBe('ios');
        });

        it('should detect Android platform', () => {
            const capabilities = {
                platformName: 'Android' as const,
                platformVersion: '13.0',
                deviceName: 'Pixel 6',
                automationName: 'UiAutomator2' as const
            };
            const platform = PlatformDetector.detectPlatform(capabilities);
            expect(platform).toBe('android');
        });

        it('should provide iOS defaults', () => {
            const defaults = PlatformDetector.getPlatformDefaults('ios');
            expect(defaults.automationName).toBe('XCUITest');
        });

        it('should provide Android defaults', () => {
            const defaults = PlatformDetector.getPlatformDefaults('android');
            expect(defaults.automationName).toBe('UiAutomator2');
        });
    });

    describe('Manager Access', () => {
        it('should provide iOS manager', () => {
            const iosManager = appiumClient.getIOSManager();
            expect(iosManager).toBeDefined();
        });

        it('should provide Android manager', () => {
            const androidManager = appiumClient.getAndroidManager();
            expect(androidManager).toBeDefined();
        });

        it('should provide enhanced gesture manager', () => {
            const gestureManager = appiumClient.getEnhancedGestureManager();
            expect(gestureManager).toBeDefined();
        });

        it('should provide locator manager', () => {
            const locatorManager = appiumClient.getLocatorManager();
            expect(locatorManager).toBeDefined();
        });
    });

    describe('Basic Functionality', () => {
        it('should handle iOS simulator list', async () => {
            mockWebDriver.execute.mockResolvedValue(['iPhone Simulator']);
            const iosManager = appiumClient.getIOSManager();
            const result = await iosManager.getSimulatorList();
            expect(result.success).toBe(true);
        });

        it('should handle Android emulator list', async () => {
            mockWebDriver.execute.mockResolvedValue(['Pixel_6_API_33']);
            const androidManager = appiumClient.getAndroidManager();
            const result = await androidManager.getEmulatorList();
            expect(result.success).toBe(true);
        });

        it('should handle cross-platform gestures', async () => {
            mockWebDriver.execute.mockResolvedValue({ success: true });
            const gestureManager = appiumClient.getEnhancedGestureManager();
            const result = await gestureManager.swipe('right', 0.5);
            expect(result).toHaveProperty('success');
        });

        it('should handle smart location', async () => {
            mockWebDriver.findElement.mockResolvedValue({ elementId: 'test-element' });
            const locatorManager = appiumClient.getLocatorManager();
            const result = await locatorManager.smartLocate('id', 'test-button', {});
            expect(result).toHaveProperty('success');
        });
    });
});
