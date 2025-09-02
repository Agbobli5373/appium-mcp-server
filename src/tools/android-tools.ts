import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const androidTools: Tool[] = [
    {
        name: "android_get_emulator_list",
        description: "List all available Android emulators, optionally filtered by API level",
        inputSchema: {
            type: "object",
            properties: {
                apiLevel: {
                    type: "string",
                    description: "Optional Android API level to filter emulators (e.g., '33')"
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "android_create_emulator",
        description: "Create a new Android emulator instance",
        inputSchema: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "Name for the new emulator"
                },
                device: {
                    type: "string",
                    description: "Device type identifier (e.g., 'pixel')"
                },
                apiLevel: {
                    type: "string",
                    description: "Android API level (e.g., '33')"
                },
                target: {
                    type: "string",
                    description: "Android target (e.g., 'android-33')"
                }
            },
            required: ["name", "device", "apiLevel", "target"],
            additionalProperties: false
        }
    },
    {
        name: "android_delete_emulator",
        description: "Delete an Android emulator by name",
        inputSchema: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "Name of the emulator to delete"
                }
            },
            required: ["name"],
            additionalProperties: false
        }
    },
    {
        name: "android_get_device_logs",
        description: "Retrieve Android device logs (logcat) from the current session",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    },
    {
        name: "android_install_apk",
        description: "Install an Android app (.apk file) on the device",
        inputSchema: {
            type: "object",
            properties: {
                apkPath: {
                    type: "string",
                    description: "Path to the .apk file to install"
                },
                packageName: {
                    type: "string",
                    description: "Package name of the app (optional)"
                }
            },
            required: ["apkPath"],
            additionalProperties: false
        }
    },
    {
        name: "android_uninstall_app",
        description: "Uninstall an Android app by its package name",
        inputSchema: {
            type: "object",
            properties: {
                packageName: {
                    type: "string",
                    description: "Package name of the app to uninstall"
                }
            },
            required: ["packageName"],
            additionalProperties: false
        }
    },
    {
        name: "android_grant_permissions",
        description: "Grant runtime permissions to an Android app",
        inputSchema: {
            type: "object",
            properties: {
                packageName: {
                    type: "string",
                    description: "Package name of the app"
                },
                permissions: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of permissions to grant"
                }
            },
            required: ["packageName", "permissions"],
            additionalProperties: false
        }
    },
    {
        name: "android_revoke_permissions",
        description: "Revoke permissions from an Android app",
        inputSchema: {
            type: "object",
            properties: {
                packageName: {
                    type: "string",
                    description: "Package name of the app"
                },
                permissions: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of permissions to revoke"
                }
            },
            required: ["packageName", "permissions"],
            additionalProperties: false
        }
    },
    {
        name: "android_toggle_network",
        description: "Enable or disable network connectivity on Android device",
        inputSchema: {
            type: "object",
            properties: {
                enabled: {
                    type: "boolean",
                    description: "Whether to enable (true) or disable (false) network"
                }
            },
            required: ["enabled"],
            additionalProperties: false
        }
    },
    {
        name: "android_get_device_info",
        description: "Get detailed Android-specific device information",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    }
];
