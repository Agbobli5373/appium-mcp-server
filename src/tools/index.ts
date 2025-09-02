import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { appManagementTools } from "./app-management";
import { contextManagementTools } from "./context-management";
import { deviceManagementTools } from "./device-management";
import { elementInteractionTools } from "./element-interaction";
import { gestureTools } from "./gesture-tools";
import { mobileAnalysisTools } from "./mobile-analysis";
import { iosTools } from "./ios-tools";
import { androidTools } from "./android-tools";

// Combine all tool categories
export const tools: Tool[] = [
    ...deviceManagementTools,
    ...elementInteractionTools,
    ...gestureTools,
    ...mobileAnalysisTools,
    ...appManagementTools,
    ...contextManagementTools,
    ...iosTools,
    ...androidTools
];
