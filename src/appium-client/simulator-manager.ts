import { BaseManager, AppiumResponse } from './types.js';

/**
 * Simulator Manager - Advanced iOS simulator management
 */
export class SimulatorManager implements BaseManager {
    private driver: WebdriverIO.Browser | null = null;

    setDriver(driver: WebdriverIO.Browser | null): void {
        this.driver = driver;
    }

    /**
     * Get detailed simulator information
     */
    async getSimulatorDetails(udid?: string): Promise<AppiumResponse<any[]>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Get detailed simulator information
            let command = 'xcrun simctl list devices --json';
            if (udid) {
                command = `xcrun simctl list devices --json | jq '.devices | to_entries[] | select(.value[]?.udid == "${udid}")'`;
            }

            const result = execSync(command, { encoding: 'utf8' });
            const simulators = JSON.parse(result);

            // Get additional runtime information
            const runtimeCommand = 'xcrun simctl list runtimes --json';
            const runtimeResult = execSync(runtimeCommand, { encoding: 'utf8' });
            const runtimes = JSON.parse(runtimeResult);

            return {
                success: true,
                message: `Retrieved detailed information for ${Object.keys(simulators).length} simulator configurations`,
                data: [{ simulators, runtimes: runtimes.runtimes }]
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to get simulator details: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Boot a simulator with specific configuration
     */
    async bootSimulator(udid: string, options?: {
        scale?: number;
        connectHardwareKeyboard?: boolean;
    }): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Boot simulator
            let bootCommand = `xcrun simctl boot ${udid}`;
            execSync(bootCommand);

            // Apply additional options if provided
            if (options?.scale) {
                const scaleCommand = `xcrun simctl ui ${udid} scale ${options.scale}`;
                try {
                    execSync(scaleCommand);
                } catch (scaleError) {
                    // Scale command might fail on some systems, continue
                }
            }

            if (options?.connectHardwareKeyboard !== undefined) {
                const keyboardCommand = `xcrun simctl ui ${udid} keyboard ${options.connectHardwareKeyboard ? 'connect' : 'disconnect'}`;
                try {
                    execSync(keyboardCommand);
                } catch (keyboardError) {
                    // Keyboard command might fail on some systems, continue
                }
            }

            return {
                success: true,
                message: `Simulator ${udid} booted successfully`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to boot simulator: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Shutdown a simulator
     */
    async shutdownSimulator(udid: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Shutdown simulator
            const shutdownCommand = `xcrun simctl shutdown ${udid}`;
            execSync(shutdownCommand);

            return {
                success: true,
                message: `Simulator ${udid} shutdown successfully`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to shutdown simulator: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Reset simulator to clean state
     */
    async resetSimulator(udid: string): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Shutdown first if running
            try {
                execSync(`xcrun simctl shutdown ${udid}`);
            } catch (shutdownError) {
                // Simulator might not be running, continue
            }

            // Erase simulator content and settings
            const eraseCommand = `xcrun simctl erase ${udid}`;
            execSync(eraseCommand);

            return {
                success: true,
                message: `Simulator ${udid} reset to clean state`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to reset simulator: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Set simulator location for testing
     */
    async setSimulatorLocation(udid: string, latitude: number, longitude: number): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Set location using simctl
            const locationCommand = `xcrun simctl location ${udid} set ${longitude},${latitude}`;
            execSync(locationCommand);

            return {
                success: true,
                message: `Simulator ${udid} location set to ${latitude}, ${longitude}`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to set simulator location: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Get simulator runtime information
     */
    async getSimulatorRuntimes(): Promise<AppiumResponse<any[]>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Get available runtimes
            const runtimeCommand = 'xcrun simctl list runtimes --json';
            const result = execSync(runtimeCommand, { encoding: 'utf8' });
            const runtimeData = JSON.parse(result);

            return {
                success: true,
                message: `Found ${runtimeData.runtimes.length} available iOS runtimes`,
                data: runtimeData.runtimes
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to get simulator runtimes: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Take simulator screenshot
     */
    async takeSimulatorScreenshot(udid: string, outputPath?: string): Promise<AppiumResponse<string>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Generate output path if not provided
            const screenshotPath = outputPath || `./simulator_screenshot_${udid}_${Date.now()}.png`;

            // Take screenshot using simctl
            const screenshotCommand = `xcrun simctl io ${udid} screenshot "${screenshotPath}"`;
            execSync(screenshotCommand);

            return {
                success: true,
                message: `Simulator screenshot saved to ${screenshotPath}`,
                data: screenshotPath
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to take simulator screenshot: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Check if simulator is booted
     */
    async isSimulatorBooted(udid: string): Promise<AppiumResponse<boolean>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Check simulator status
            const statusCommand = `xcrun simctl list devices --json | jq -r '.devices | to_entries[] | .value[] | select(.udid == "${udid}") | .state'`;
            const result = execSync(statusCommand, { encoding: 'utf8' }).trim();

            const isBooted = result === 'Booted';

            return {
                success: true,
                message: `Simulator ${udid} is ${isBooted ? 'booted' : 'not booted'}`,
                data: isBooted
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to check simulator status: ${errorMessage}`,
                error: errorMessage
            };
        }
    }
}
