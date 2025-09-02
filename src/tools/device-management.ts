import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const deviceManagementTools: Tool[] = [
  {
    name: "start_session",
    description: "Start a new Appium session",
    inputSchema: {
      type: "object",
      properties: {
        capabilities: { type: "object" }
      },
      required: ["capabilities"],
      additionalProperties: false
    }
  },
  {
    name: "end_session",
    description: "End the current Appium session",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "get_device_info",
    description: "Retrieve device information",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "rotate_device",
    description: "Rotate device to given orientation",
    inputSchema: {
      type: "object",
      properties: {
        orientation: { type: "string", enum: ["PORTRAIT", "LANDSCAPE"] }
      },
      required: ["orientation"],
      additionalProperties: false
    }
  },
  {
    name: "get_screen_size",
    description: "Get current device screen size",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  }
];
