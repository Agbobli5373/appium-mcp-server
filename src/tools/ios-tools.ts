import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const iosTools: Tool[] = [
    {
        name: "ios_get_simulator_list",
        description: "List all available iOS simulators, optionally filtered by runtime version",
        inputSchema: {
            type: "object",
            properties: {
                runtime: {
                    type: "string",
                    description: "Optional iOS runtime version to filter simulators (e.g., 'iOS-17-0')"
                }
            },
            additionalProperties: false
        }
    },
    {
        name: "ios_create_simulator",
        description: "Create a new iOS simulator instance",
        inputSchema: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "Name for the new simulator"
                },
                deviceType: {
                    type: "string",
                    description: "Device type identifier (e.g., 'iPhone 15')"
                },
                runtime: {
                    type: "string",
                    description: "iOS runtime version (e.g., 'iOS-17-0')"
                }
            },
            required: ["name", "deviceType", "runtime"],
            additionalProperties: false
        }
    },
    {
        name: "ios_delete_simulator",
        description: "Delete an iOS simulator by its UDID",
        inputSchema: {
            type: "object",
            properties: {
                udid: {
                    type: "string",
                    description: "Unique device identifier of the simulator to delete"
                }
            },
            required: ["udid"],
            additionalProperties: false
        }
    },
    {
        name: "ios_get_device_logs",
        description: "Retrieve iOS device logs from the current session",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    },
    {
        name: "ios_install_app",
        description: "Install an iOS app (.ipa file) on the device",
        inputSchema: {
            type: "object",
            properties: {
                appPath: {
                    type: "string",
                    description: "Path to the .ipa file to install"
                },
                bundleId: {
                    type: "string",
                    description: "Bundle identifier of the app (optional)"
                }
            },
            required: ["appPath"],
            additionalProperties: false
        }
    },
    {
        name: "ios_uninstall_app",
        description: "Uninstall an iOS app by its bundle identifier",
        inputSchema: {
            type: "object",
            properties: {
                bundleId: {
                    type: "string",
                    description: "Bundle identifier of the app to uninstall"
                }
            },
            required: ["bundleId"],
            additionalProperties: false
        }
    },
    {
        name: "ios_handle_system_alert",
        description: "Handle iOS system alerts by accepting or dismissing them",
        inputSchema: {
            type: "object",
            properties: {
                action: {
                    type: "string",
                    enum: ["accept", "dismiss"],
                    description: "Action to perform on the system alert"
                }
            },
            required: ["action"],
            additionalProperties: false
        }
    },
    {
        name: "ios_get_device_info",
        description: "Get detailed iOS-specific device information",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    }
];
