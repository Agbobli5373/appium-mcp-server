import { AppiumClient } from '../appium-client/index.js';
import { AppiumResponse, MobileLocatorStrategy } from '../appium-client/types.js';
import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Platform-Specific Locator Tools - Advanced element location strategies for MCP
 */
export class LocatorTools {
    private client: AppiumClient;

    constructor(client: AppiumClient) {
        this.client = client;
    }

    /**
     * Smart element location with platform-specific optimizations
     */
    async smartLocate(args: {
        strategy: MobileLocatorStrategy;
        locator: string;
        multiple?: boolean;
        timeout?: number;
        context?: string;
    }): Promise<AppiumResponse> {
        const options: { multiple?: boolean; timeout?: number; context?: string } = {};
        if (args.multiple !== undefined) options.multiple = args.multiple;
        if (args.timeout !== undefined) options.timeout = args.timeout;
        if (args.context !== undefined) options.context = args.context;

        return await this.client.getLocatorManager().smartLocate(
            args.strategy,
            args.locator,
            options
        );
    }

    /**
     * Advanced element waiting with platform-specific strategies
     */
    async waitForElement(args: {
        strategy: MobileLocatorStrategy;
        locator: string;
        timeout?: number;
        visible?: boolean;
        clickable?: boolean;
        context?: string;
    }): Promise<AppiumResponse> {
        const options: { timeout?: number; visible?: boolean; clickable?: boolean; context?: string } = {};
        if (args.timeout !== undefined) options.timeout = args.timeout;
        if (args.visible !== undefined) options.visible = args.visible;
        if (args.clickable !== undefined) options.clickable = args.clickable;
        if (args.context !== undefined) options.context = args.context;

        return await this.client.getLocatorManager().waitForElement(
            args.strategy,
            args.locator,
            options
        );
    }

    /**
     * Platform-specific element validation
     */
    async validateElement(args: {
        elementId: string;
        visible?: boolean;
        enabled?: boolean;
        clickable?: boolean;
        text?: string;
        attributes?: Record<string, string>;
    }): Promise<AppiumResponse> {
        // First find the element
        const elementResult = await this.client.getElementManager().findElement('id', args.elementId);
        if (!elementResult.success || !elementResult.data) {
            return {
                success: false,
                message: 'Element not found for validation',
                error: 'Element not found'
            };
        }

        // Get the WebdriverIO element from the elementId
        const driver = this.client.getDriver();
        if (!driver) {
            return {
                success: false,
                message: 'No active driver session',
                error: 'No driver'
            };
        }
        const element = await driver.$(`[id="${args.elementId}"]`);

        const options: { visible?: boolean; enabled?: boolean; clickable?: boolean; text?: string; attributes?: Record<string, string> } = {};
        if (args.visible !== undefined) options.visible = args.visible;
        if (args.enabled !== undefined) options.enabled = args.enabled;
        if (args.clickable !== undefined) options.clickable = args.clickable;
        if (args.text !== undefined) options.text = args.text;
        if (args.attributes !== undefined) options.attributes = args.attributes;

        return await this.client.getLocatorManager().validateElement(element, options);
    }

    /**
     * iOS-specific element location using NSPredicate
     */
    async iosPredicateLocate(args: {
        predicate: string;
        multiple?: boolean;
        timeout?: number;
    }): Promise<AppiumResponse> {
        const options: { multiple?: boolean; timeout?: number } = {};
        if (args.multiple !== undefined) options.multiple = args.multiple;
        if (args.timeout !== undefined) options.timeout = args.timeout;

        return await this.client.getLocatorManager().smartLocate(
            'predicate',
            args.predicate,
            options
        );
    }

    /**
     * iOS-specific element location using Class Chain
     */
    async iosClassChainLocate(args: {
        classChain: string;
        multiple?: boolean;
        timeout?: number;
    }): Promise<AppiumResponse> {
        const options: { multiple?: boolean; timeout?: number } = {};
        if (args.multiple !== undefined) options.multiple = args.multiple;
        if (args.timeout !== undefined) options.timeout = args.timeout;

        return await this.client.getLocatorManager().smartLocate(
            'class-chain',
            args.classChain,
            options
        );
    }

    /**
     * Android-specific element location using UiAutomator
     */
    async androidUiAutomatorLocate(args: {
        selector: string;
        multiple?: boolean;
        timeout?: number;
    }): Promise<AppiumResponse> {
        const options: { multiple?: boolean; timeout?: number } = {};
        if (args.multiple !== undefined) options.multiple = args.multiple;
        if (args.timeout !== undefined) options.timeout = args.timeout;

        return await this.client.getLocatorManager().smartLocate(
            'uiautomator',
            args.selector,
            options
        );
    }

    /**
     * Android-specific element location using DataMatcher
     */
    async androidDataMatcherLocate(args: {
        matcher: string;
        multiple?: boolean;
        timeout?: number;
    }): Promise<AppiumResponse> {
        const options: { multiple?: boolean; timeout?: number } = {};
        if (args.multiple !== undefined) options.multiple = args.multiple;
        if (args.timeout !== undefined) options.timeout = args.timeout;

        return await this.client.getLocatorManager().smartLocate(
            'datamatcher',
            args.matcher,
            options
        );
    }

    /**
     * Get locator strategy suggestions for current platform
     */
    async getLocatorSuggestions(args: {
        platform?: string;
    }): Promise<AppiumResponse> {
        const suggestions = this.client.getLocatorManager().getLocatorSuggestions(args.platform);
        return {
            success: true,
            message: `Locator suggestions for ${args.platform || 'current platform'}`,
            data: {
                suggestions,
                platform: args.platform || 'auto-detected'
            }
        };
    }

    /**
     * Cross-platform element location with fallback strategies
     */
    async crossPlatformLocate(args: {
        primaryStrategy: MobileLocatorStrategy;
        primaryLocator: string;
        fallbackStrategies?: Array<{
            strategy: MobileLocatorStrategy;
            locator: string;
        }>;
        timeout?: number;
        multiple?: boolean;
    }): Promise<AppiumResponse> {
        // Try primary strategy first
        const primaryOptions: { multiple?: boolean; timeout?: number } = {};
        if (args.multiple !== undefined) primaryOptions.multiple = args.multiple;
        if (args.timeout !== undefined) primaryOptions.timeout = args.timeout;

        const primaryResult = await this.client.getLocatorManager().smartLocate(
            args.primaryStrategy,
            args.primaryLocator,
            primaryOptions
        );

        if (primaryResult.success) {
            return primaryResult;
        }

        // Try fallback strategies
        if (args.fallbackStrategies) {
            for (const fallback of args.fallbackStrategies) {
                const fallbackOptions: { multiple?: boolean; timeout?: number } = {};
                if (args.multiple !== undefined) fallbackOptions.multiple = args.multiple;
                if (args.timeout !== undefined) fallbackOptions.timeout = args.timeout;

                const fallbackResult = await this.client.getLocatorManager().smartLocate(
                    fallback.strategy,
                    fallback.locator,
                    fallbackOptions
                );

                if (fallbackResult.success) {
                    return {
                        ...fallbackResult,
                        message: `Element found using fallback strategy: ${fallback.strategy}`
                    };
                }
            }
        }

        return {
            success: false,
            message: 'Element not found with any strategy',
            error: 'All location strategies failed'
        };
    }
}

/**
 * MCP Tool definitions for platform-specific locator operations
 */
export const locatorTools: Tool[] = [
    {
        name: "smart_locate_element",
        description: "Smart element location with platform-specific optimizations",
        inputSchema: {
            type: "object",
            properties: {
                strategy: {
                    type: "string",
                    enum: ["accessibility-id", "id", "xpath", "class", "name", "css", "tag", "link", "partial-link", "predicate", "class-chain", "uiautomator", "datamatcher", "text", "class-name"],
                    description: "Locator strategy to use"
                },
                locator: {
                    type: "string",
                    description: "Locator value (selector, xpath, etc.)"
                },
                multiple: {
                    type: "boolean",
                    description: "Find multiple elements instead of single"
                },
                timeout: {
                    type: "number",
                    description: "Timeout in milliseconds (default: 10000)"
                },
                context: {
                    type: "string",
                    description: "Context for element search"
                }
            },
            required: ["strategy", "locator"],
            additionalProperties: false
        }
    },
    {
        name: "wait_for_element",
        description: "Advanced element waiting with platform-specific strategies",
        inputSchema: {
            type: "object",
            properties: {
                strategy: {
                    type: "string",
                    enum: ["accessibility-id", "id", "xpath", "class", "name", "css", "tag", "link", "partial-link", "predicate", "class-chain", "uiautomator", "datamatcher", "text", "class-name"],
                    description: "Locator strategy to use"
                },
                locator: {
                    type: "string",
                    description: "Locator value"
                },
                timeout: {
                    type: "number",
                    description: "Maximum wait time in milliseconds (default: 10000)"
                },
                visible: {
                    type: "boolean",
                    description: "Wait for element to be visible"
                },
                clickable: {
                    type: "boolean",
                    description: "Wait for element to be clickable"
                },
                context: {
                    type: "string",
                    description: "Context for element search"
                }
            },
            required: ["strategy", "locator"],
            additionalProperties: false
        }
    },
    {
        name: "validate_element",
        description: "Platform-specific element validation",
        inputSchema: {
            type: "object",
            properties: {
                elementId: {
                    type: "string",
                    description: "ID of element to validate"
                },
                visible: {
                    type: "boolean",
                    description: "Check if element is visible"
                },
                enabled: {
                    type: "boolean",
                    description: "Check if element is enabled"
                },
                clickable: {
                    type: "boolean",
                    description: "Check if element is clickable"
                },
                text: {
                    type: "string",
                    description: "Expected text content"
                },
                attributes: {
                    type: "object",
                    description: "Expected attribute values",
                    additionalProperties: {
                        type: "string"
                    }
                }
            },
            required: ["elementId"],
            additionalProperties: false
        }
    },
    {
        name: "ios_predicate_locate",
        description: "iOS-specific element location using NSPredicate",
        inputSchema: {
            type: "object",
            properties: {
                predicate: {
                    type: "string",
                    description: "NSPredicate string for iOS element selection"
                },
                multiple: {
                    type: "boolean",
                    description: "Find multiple elements"
                },
                timeout: {
                    type: "number",
                    description: "Timeout in milliseconds"
                }
            },
            required: ["predicate"],
            additionalProperties: false
        }
    },
    {
        name: "ios_class_chain_locate",
        description: "iOS-specific element location using Class Chain",
        inputSchema: {
            type: "object",
            properties: {
                classChain: {
                    type: "string",
                    description: "Class Chain selector for iOS"
                },
                multiple: {
                    type: "boolean",
                    description: "Find multiple elements"
                },
                timeout: {
                    type: "number",
                    description: "Timeout in milliseconds"
                }
            },
            required: ["classChain"],
            additionalProperties: false
        }
    },
    {
        name: "android_uiautomator_locate",
        description: "Android-specific element location using UiAutomator",
        inputSchema: {
            type: "object",
            properties: {
                selector: {
                    type: "string",
                    description: "UiAutomator selector string"
                },
                multiple: {
                    type: "boolean",
                    description: "Find multiple elements"
                },
                timeout: {
                    type: "number",
                    description: "Timeout in milliseconds"
                }
            },
            required: ["selector"],
            additionalProperties: false
        }
    },
    {
        name: "android_datamatcher_locate",
        description: "Android-specific element location using DataMatcher",
        inputSchema: {
            type: "object",
            properties: {
                matcher: {
                    type: "string",
                    description: "DataMatcher string for Android"
                },
                multiple: {
                    type: "boolean",
                    description: "Find multiple elements"
                },
                timeout: {
                    type: "number",
                    description: "Timeout in milliseconds"
                }
            },
            required: ["matcher"],
            additionalProperties: false
        }
    },
    {
        name: "get_locator_suggestions",
        description: "Get locator strategy suggestions for current platform",
        inputSchema: {
            type: "object",
            properties: {
                platform: {
                    type: "string",
                    enum: ["ios", "android"],
                    description: "Platform to get suggestions for (auto-detects if not specified)"
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "cross_platform_locate",
        description: "Cross-platform element location with fallback strategies",
        inputSchema: {
            type: "object",
            properties: {
                primaryStrategy: {
                    type: "string",
                    enum: ["accessibility-id", "id", "xpath", "class", "name", "css", "tag", "link", "partial-link", "predicate", "class-chain", "uiautomator", "datamatcher", "text", "class-name"],
                    description: "Primary locator strategy"
                },
                primaryLocator: {
                    type: "string",
                    description: "Primary locator value"
                },
                fallbackStrategies: {
                    type: "array",
                    description: "Fallback strategies to try if primary fails",
                    items: {
                        type: "object",
                        properties: {
                            strategy: {
                                type: "string",
                                enum: ["accessibility-id", "id", "xpath", "class", "name", "css", "tag", "link", "partial-link", "predicate", "class-chain", "uiautomator", "datamatcher", "text", "class-name"]
                            },
                            locator: {
                                type: "string"
                            }
                        },
                        required: ["strategy", "locator"]
                    }
                },
                timeout: {
                    type: "number",
                    description: "Timeout in milliseconds"
                },
                multiple: {
                    type: "boolean",
                    description: "Find multiple elements"
                }
            },
            required: ["primaryStrategy", "primaryLocator"],
            additionalProperties: false
        }
    }
];
