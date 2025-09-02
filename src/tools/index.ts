import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { appManagementTools } from "./app-management.js";
import { contextManagementTools } from "./context-management.js";
import { deviceManagementTools } from "./device-management.js";
import { elementInteractionTools } from "./element-interaction.js";
import { gestureTools } from "./gesture-tools.js";
import { enhancedGestureTools } from "./enhanced-gesture-tools.js";
import { locatorTools } from "./locator-tools.js";
import { mobileAnalysisTools } from "./mobile-analysis.js";
import { iosTools } from "./ios-tools.js";
import { androidTools } from "./android-tools.js";

// Combine all tool categories
export const tools: Tool[] = [
    ...deviceManagementTools,
    ...elementInteractionTools,
    ...gestureTools,
    ...enhancedGestureTools,
    ...locatorTools,
    ...mobileAnalysisTools,
    ...appManagementTools,
    ...contextManagementTools,
    ...iosTools,
    ...androidTools
];
