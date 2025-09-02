import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const contextManagementTools: Tool[] = [
  {
    name: "get_contexts",
    description: "List available contexts (NATIVE_APP, WEBVIEW_*)",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "get_current_context",
    description: "Get the current context name",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "switch_context",
    description: "Switch to a named context",
    inputSchema: {
      type: "object",
      properties: {
        contextName: { type: "string" }
      },
      required: ["contextName"],
      additionalProperties: false
    }
  },
  {
    name: "get_context_details",
    description: "Get details for each available context (name, type, url if applicable)",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "switch_to_webview",
    description: "Switch to a webview by index (0-based)",
    inputSchema: {
      type: "object",
      properties: {
        index: { type: "number" }
      },
      required: ["index"],
      additionalProperties: false
    }
  },
  {
    name: "switch_to_native",
    description: "Switch to the native app context",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "is_webview_available",
    description: "Return whether any webview contexts are available",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "get_webview_count",
    description: "Get the number of available webview contexts",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  }
];
