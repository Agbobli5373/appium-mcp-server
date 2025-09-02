import { BaseManager, AppiumResponse } from './types.js';

/**
 * Emulator Manager - Advanced Android emulator management
 */
export class EmulatorManager implements BaseManager {
    private driver: WebdriverIO.Browser | null = null;

    setDriver(driver: WebdriverIO.Browser | null): void {
        this.driver = driver;
    }

    /**
     * Get detailed emulator information
     */
    async getEmulatorDetails(name?: string): Promise<AppiumResponse<any[]>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Get detailed emulator information
            let command = 'emulator -list-avds -verbose';
            if (name) {
                command = `emulator -list-avds -verbose | grep -A 10 "^${name}$"`;
            }

            const result = execSync(command, { encoding: 'utf8' });
            const emulators = result.trim().split('\n\n').filter(block => block.trim() !== '');

            // Get additional system image information
            const imageCommand = 'sdkmanager --list | grep system-images';
            let systemImages: string[] = [];
            try {
                const imageResult = execSync(imageCommand, { encoding: 'utf8' });
                systemImages = imageResult.trim().split('\n').filter(line => line.trim() !== '');
            } catch (imageError) {
                // sdkmanager might not be available, continue without system images
            }

            return {
                success: true,
                message: `Retrieved detailed information for ${emulators.length} emulator configurations`,
                data: [{ emulators, systemImages }]
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to get emulator details: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Boot an emulator with specific configuration
     */
    async bootEmulator(name: string, options?: {
        port?: number;
        scale?: number;
        gpu?: 'auto' | 'host' | 'swiftshader' | 'angle' | 'off';
        memory?: number;
        cores?: number;
    }): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Build emulator command with options
            let bootCommand = `emulator -avd "${name}"`;

            if (options?.port) {
                bootCommand += ` -port ${options.port}`;
            }

            if (options?.scale) {
                bootCommand += ` -scale ${options.scale}`;
            }

            if (options?.gpu) {
                bootCommand += ` -gpu ${options.gpu}`;
            }

            if (options?.memory) {
                bootCommand += ` -memory ${options.memory}`;
            }

            if (options?.cores) {
                bootCommand += ` -cores ${options.cores}`;
            }

            // Add no-window option for headless operation
            bootCommand += ' -no-window';

            // Start emulator in background
            execSync(bootCommand + ' &', { stdio: 'ignore' });

            return {
                success: true,
                message: `Emulator "${name}" booting in background`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to boot emulator: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Shutdown an emulator
     */
    async shutdownEmulator(nameOrPort?: string | number): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Shutdown emulator by port or name
            let shutdownCommand = 'adb emu kill';
            if (typeof nameOrPort === 'number') {
                shutdownCommand = `adb -s emulator-${nameOrPort} emu kill`;
            }

            execSync(shutdownCommand);

            return {
                success: true,
                message: `Emulator ${nameOrPort || 'all'} shutdown successfully`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to shutdown emulator: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Reset emulator to clean state
     */
    async resetEmulator(name: string): Promise<AppiumResponse> {
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
                execSync(`adb -s emulator-5554 emu kill`); // Default port
            } catch (shutdownError) {
                // Emulator might not be running, continue
            }

            // Reset emulator data
            const resetCommand = `emulator -avd "${name}" -wipe-data`;
            execSync(resetCommand + ' &', { stdio: 'ignore' });

            return {
                success: true,
                message: `Emulator "${name}" reset to clean state`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to reset emulator: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Set emulator location for testing
     */
    async setEmulatorLocation(port: number, latitude: number, longitude: number): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Set location using geo fix
            const locationCommand = `adb -s emulator-${port} emu geo fix ${longitude} ${latitude}`;
            execSync(locationCommand);

            return {
                success: true,
                message: `Emulator on port ${port} location set to ${latitude}, ${longitude}`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to set emulator location: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Get emulator system image information
     */
    async getSystemImages(): Promise<AppiumResponse<any[]>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Get available system images
            const imageCommand = 'sdkmanager --list | grep system-images';
            const result = execSync(imageCommand, { encoding: 'utf8' });
            const systemImages = result.trim().split('\n').filter(line => line.trim() !== '');

            return {
                success: true,
                message: `Found ${systemImages.length} available Android system images`,
                data: systemImages
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to get system images: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Take emulator screenshot
     */
    async takeEmulatorScreenshot(port: number, outputPath?: string): Promise<AppiumResponse<string>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Generate output path if not provided
            const screenshotPath = outputPath || `./emulator_screenshot_port_${port}_${Date.now()}.png`;

            // Take screenshot using adb
            const screenshotCommand = `adb -s emulator-${port} exec-out screencap -p > "${screenshotPath}"`;
            execSync(screenshotCommand);

            return {
                success: true,
                message: `Emulator screenshot saved to ${screenshotPath}`,
                data: screenshotPath
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to take emulator screenshot: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Check if emulator is running
     */
    async isEmulatorRunning(port: number): Promise<AppiumResponse<boolean>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Check if emulator is running on specified port
            const checkCommand = `adb devices | grep "emulator-${port}"`;
            const result = execSync(checkCommand, { encoding: 'utf8' }).trim();

            const isRunning = result.includes(`emulator-${port}`);

            return {
                success: true,
                message: `Emulator on port ${port} is ${isRunning ? 'running' : 'not running'}`,
                data: isRunning
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to check emulator status: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Get emulator acceleration status
     */
    async getAccelerationStatus(): Promise<AppiumResponse<any>> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');

            // Check acceleration status
            const accelCommand = 'emulator -accel-check';
            const result = execSync(accelCommand, { encoding: 'utf8' });

            return {
                success: true,
                message: 'Emulator acceleration status retrieved',
                data: { status: result.trim() }
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to get acceleration status: ${errorMessage}`,
                error: errorMessage
            };
        }
    }

    /**
     * Configure emulator network settings
     */
    async configureNetwork(port: number, config: {
        dns?: string;
        proxy?: string;
        speed?: 'full' | 'gsm' | 'hscsd' | 'gprs' | 'edge' | 'umts' | 'hsdpa';
    }): Promise<AppiumResponse> {
        if (!this.driver) {
            return {
                success: false,
                message: 'No active driver session'
            };
        }

        try {
            const { execSync } = await import('child_process');
            const commands: string[] = [];

            // Configure DNS
            if (config.dns) {
                commands.push(`adb -s emulator-${port} shell setprop net.dns1 ${config.dns}`);
            }

            // Configure proxy
            if (config.proxy) {
                commands.push(`adb -s emulator-${port} shell setprop http.proxy ${config.proxy}`);
            }

            // Configure network speed
            if (config.speed) {
                const speedMap: Record<string, string> = {
                    'full': '0',
                    'gsm': '1',
                    'hscsd': '2',
                    'gprs': '3',
                    'edge': '4',
                    'umts': '5',
                    'hsdpa': '6'
                };
                commands.push(`adb -s emulator-${port} shell setprop net.speed ${speedMap[config.speed] || '0'}`);
            }

            // Execute all commands
            for (const command of commands) {
                execSync(command);
            }

            return {
                success: true,
                message: `Network configuration applied to emulator on port ${port}`
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                message: `Failed to configure emulator network: ${errorMessage}`,
                error: errorMessage
            };
        }
    }
}
