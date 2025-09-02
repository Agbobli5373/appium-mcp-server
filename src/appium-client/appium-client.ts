import {
    AppiumCapabilities,
    AppiumResponse,
    DeviceInfo,
    SessionInfo,
    AppiumError,
    BaseManager
} from './types.js';
import { AppManager, ContextManager, DeviceManager, ElementManager, GestureManager } from './index.js';


/**
 * Main Appium client that manages the AppiumDriver and coordinates all mobile automation operations
 */
export class AppiumClient {
    private driver: WebdriverIO.Browser | null = null;
    private sessionInfo: SessionInfo | null = null;

    // Managers for different aspects of mobile automation
    private deviceManager: DeviceManager;
    private elementManager: ElementManager;
    private gestureManager: GestureManager;
    private contextManager: ContextManager;
    private appManager: AppManager;

    constructor() {
        // Initialize all managers
        this.deviceManager = new DeviceManager();
        this.elementManager = new ElementManager();
        this.gestureManager = new GestureManager();
        this.contextManager = new ContextManager();
        this.appManager = new AppManager();

        // Set up manager references to this client
        this.updateAllManagers();
    }

    /**
     * Update all managers with current driver reference
     */
    private updateAllManagers(): void {
        const managers: BaseManager[] = [
            this.deviceManager,
            this.elementManager,
            this.gestureManager,
            this.contextManager,
            this.appManager
        ];

        managers.forEach(manager => manager.setDriver(this.driver));
    }

    /**
     * Start a new Appium session with specified capabilities
     */
    async startSession(capabilities: AppiumCapabilities): Promise<AppiumResponse<SessionInfo>> {
        try {
            // Validate capabilities
            this.validateCapabilities(capabilities);

            // Create WebDriver instance
            const { remote } = await import('webdriverio');

            this.driver = await remote({
                hostname: process.env.APPIUM_HOST || '127.0.0.1',
                port: parseInt(process.env.APPIUM_PORT || '4723'),
                logLevel: (process.env.LOG_LEVEL || 'info') as any,
                capabilities
            });

            // Update session info
            this.sessionInfo = {
                sessionId: this.driver.sessionId,
                capabilities,
                startTime: new Date(),
                lastActivity: new Date()
            };

            // Update all managers with the new driver
            this.updateAllManagers();

            return {
                success: true,
                message: `Appium session started successfully on ${capabilities.platformName}`,
                data: this.sessionInfo
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to start Appium session: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * End the current Appium session
     */
    async endSession(): Promise<AppiumResponse> {
        try {
            if (!this.driver) {
                return {
                    success: false,
                    message: 'No active session to end'
                };
            }

            await this.driver.deleteSession();
            this.driver = null;
            this.sessionInfo = null;

            // Update all managers
            this.updateAllManagers();

            return {
                success: true,
                message: 'Appium session ended successfully'
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to end Appium session: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Get current session information
     */
    getSessionInfo(): SessionInfo | null {
        return this.sessionInfo;
    }

    /**
     * Check if session is active
     */
    isSessionActive(): boolean {
        return this.driver !== null && this.sessionInfo !== null;
    }

    /**
     * Get device information
     */
    async getDeviceInfo(): Promise<AppiumResponse<DeviceInfo>> {
        if (!this.isSessionActive()) {
            return {
                success: false,
                message: 'No active session'
            };
        }

        return this.deviceManager.getDeviceInfo();
    }

    /**
     * Validate Appium capabilities
     */
    private validateCapabilities(capabilities: AppiumCapabilities): void {
        if (!capabilities.platformName) {
            throw new AppiumError('platformName is required', 'INVALID_CAPABILITIES');
        }

        if (!capabilities.platformVersion) {
            throw new AppiumError('platformVersion is required', 'INVALID_CAPABILITIES');
        }

        if (!capabilities.deviceName) {
            throw new AppiumError('deviceName is required', 'INVALID_CAPABILITIES');
        }

        if (!capabilities.automationName) {
            throw new AppiumError('automationName is required', 'INVALID_CAPABILITIES');
        }

        // Platform-specific validation
        if (capabilities.platformName === 'Android') {
            if (capabilities.automationName !== 'UiAutomator2') {
                throw new AppiumError('Android requires UiAutomator2 automation', 'INVALID_CAPABILITIES');
            }
        } else if (capabilities.platformName === 'iOS') {
            if (capabilities.automationName !== 'XCUITest') {
                throw new AppiumError('iOS requires XCUITest automation', 'INVALID_CAPABILITIES');
            }
        }
    }

    /**
     * Get current driver instance (for advanced usage)
     */
    getDriver(): WebdriverIO.Browser | null {
        return this.driver;
    }

    /**
     * Access to individual managers for advanced operations
     */
    getDeviceManager(): DeviceManager {
        return this.deviceManager;
    }

    getElementManager(): ElementManager {
        return this.elementManager;
    }

    getGestureManager(): GestureManager {
        return this.gestureManager;
    }

    getContextManager(): ContextManager {
        return this.contextManager;
    }

    getAppManager(): AppManager {
        return this.appManager;
    }
}
