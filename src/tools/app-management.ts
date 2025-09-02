import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const appManagementTools: Tool[] = [
  {
    name: "launch_app",
    description: "Launch an app by id or resume current app",
    inputSchema: {
      type: "object",
      properties: {
        appId: { type: "string" }
      },
      required: [],
      additionalProperties: false
    }
  },
  {
    name: "terminate_app",
    description: "Terminate an app by id or close current app",
    inputSchema: {
      type: "object",
      properties: {
        appId: { type: "string" }
      },
      required: [],
      additionalProperties: false
    }
  },
  {
    name: "get_app_state",
    description: "Get the state of an installed app",
    inputSchema: {
      type: "object",
      properties: {
        appId: { type: "string" }
      },
      required: ["appId"],
      additionalProperties: false
    }
  },
  {
    name: "is_app_installed",
    description: "Check whether an app is installed",
    inputSchema: {
      type: "object",
      properties: {
        bundleId: { type: "string" }
      },
      required: ["bundleId"],
      additionalProperties: false
    }
  },
  {
    name: "install_app",
    description: "Install an app from a path or URL",
    inputSchema: {
      type: "object",
      properties: {
        appPath: { type: "string" }
      },
      required: ["appPath"],
      additionalProperties: false
    }
  },
  {
    name: "remove_app",
    description: "Uninstall an app by bundle id",
    inputSchema: {
      type: "object",
      properties: {
        bundleId: { type: "string" }
      },
      required: ["bundleId"],
      additionalProperties: false
    }
  },
  {
    name: "get_app_strings",
    description: "Retrieve localized strings for the app",
    inputSchema: {
      type: "object",
      properties: {
        language: { type: "string" },
        stringFile: { type: "string" }
      },
      required: [],
      additionalProperties: false
    }
  },
  {
    name: "start_activity",
    description: "Start an Android activity",
    inputSchema: {
      type: "object",
      properties: {
        appPackage: { type: "string" },
        appActivity: { type: "string" },
        appWaitPackage: { type: "string" },
        appWaitActivity: { type: "string" }
      },
      required: ["appPackage", "appActivity"],
      additionalProperties: false
    }
  },
  {
    name: "get_current_activity",
    description: "Get current Android activity",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "get_current_package",
    description: "Get current Android package",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "background_app",
    description: "Background the app for a number of seconds",
    inputSchema: {
      type: "object",
      properties: {
        seconds: { type: "number" }
      },
      required: [],
      additionalProperties: false
    }
  },
  {
    name: "reset_app",
    description: "Reset the current app (clear data / restart)",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  }
];
