import { Tool } from "@modelcontextprotocol/sdk/types.js";

// Import tool modules (to be created in Phase 3)
// import { deviceManagementTools } from "./device-management.js";
// import { elementInteractionTools } from "./element-interaction.js";
// import { gestureTools } from "./gesture-tools.js";
// import { appManagementTools } from "./app-management.js";
// import { mobileAnalysisTools } from "./mobile-analysis.js";

// Placeholder tools for Phase 1 - will be expanded in Phase 3
const placeholderTools: Tool[] = [
    {
        name: "start_session",
        description: "Start a new Appium session with device capabilities",
        inputSchema: {
            type: "object",
            properties: {
                platformName: {
                    type: "string",
                    enum: ["Android", "iOS"],
                    description: "Mobile platform"
                },
                platformVersion: {
                    type: "string",
                    description: "Platform version"
                },
                deviceName: {
                    type: "string",
                    description: "Device name"
                },
                automationName: {
                    type: "string",
                    enum: ["UiAutomator2", "XCUITest"],
                    description: "Automation engine"
                }
            },
            required: ["platformName", "platformVersion", "deviceName", "automationName"]
        }
    },
    {
        name: "end_session",
        description: "End the current Appium session",
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        }
    },
    {
        name: "get_device_info",
        description: "Get device information and capabilities",
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        }
    }
];

// Use placeholder tools for Phase 1
// In Phase 3, this will be replaced with:
// export const tools: Tool[] = [
//     ...deviceManagementTools,
//     ...elementInteractionTools,
//     ...gestureTools,
//     ...appManagementTools,
//     ...mobileAnalysisTools
// ];

export const tools: Tool[] = placeholderTools;
