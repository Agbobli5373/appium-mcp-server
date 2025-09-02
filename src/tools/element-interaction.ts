import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const elementInteractionTools: Tool[] = [
  {
    name: "find_mobile_element",
    description: "Find a mobile element by locator and strategy",
    inputSchema: {
      type: "object",
      properties: {
        strategy: { type: "string", enum: ["accessibility id", "id", "xpath", "class name", "css selector", "name"] },
        locator: { type: "string" },
        timeout: { type: "number" }
      },
      required: ["strategy", "locator"],
      additionalProperties: false
    }
  },
  {
    name: "tap_element",
    description: "Tap a mobile element",
    inputSchema: {
      type: "object",
      properties: {
        elementId: { type: "string" }
      },
      required: ["elementId"],
      additionalProperties: false
    }
  },
  {
    name: "send_mobile_keys",
    description: "Send keys/text to a mobile element",
    inputSchema: {
      type: "object",
      properties: {
        elementId: { type: "string" },
        text: { type: "string" },
        clearBefore: { type: "boolean" }
      },
      required: ["elementId", "text"],
      additionalProperties: false
    }
  },
  {
    name: "get_element_text",
    description: "Get the visible text of a mobile element",
    inputSchema: {
      type: "object",
      properties: {
        elementId: { type: "string" }
      },
      required: ["elementId"],
      additionalProperties: false
    }
  },
  {
    name: "get_element_bounds",
    description: "Get element bounds (x, y, width, height)",
    inputSchema: {
      type: "object",
      properties: {
        elementId: { type: "string" }
      },
      required: ["elementId"],
      additionalProperties: false
    }
  }
];
