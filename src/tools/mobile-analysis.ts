import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const mobileAnalysisTools: Tool[] = [
  {
    name: "take_mobile_screenshot",
    description: "Capture a mobile-optimized screenshot (base64 or file)",
    inputSchema: {
      type: "object",
      properties: {
        format: { type: "string", enum: ["png", "jpg"], default: "png" },
        quality: { type: "number", minimum: 1, maximum: 100 },
        asBase64: { type: "boolean", default: true }
      },
      additionalProperties: false
    }
  },
  {
    name: "get_page_source",
    description: "Return the XML/HTML page source of the current mobile view",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: "wait_mobile_element",
    description: "Wait for a mobile element to satisfy a condition",
    inputSchema: {
      type: "object",
      properties: {
        strategy: { type: "string", enum: ["accessibility id", "id", "xpath", "class name", "css selector", "name"] },
        locator: { type: "string" },
        timeout: { type: "number" },
        visible: { type: "boolean" }
      },
      required: ["strategy", "locator"],
      additionalProperties: false
    }
  },
  {
    name: "scroll_mobile",
    description: "Scroll on mobile (alias for scroll) using delta or direction",
    inputSchema: {
      type: "object",
      properties: {
        elementId: { type: "string" },
        deltaX: { type: "number" },
        deltaY: { type: "number" },
        direction: { type: "string", enum: ["up", "down", "left", "right"] },
        distance: { type: "number" },
        durationMs: { type: "number" }
      },
      additionalProperties: false
    }
  },
  {
    name: "long_press_element",
    description: "Long press a mobile element identified by locator",
    inputSchema: {
      type: "object",
      properties: {
        strategy: { type: "string", enum: ["accessibility id", "id", "xpath", "class name", "css selector", "name"] },
        locator: { type: "string" },
        durationMs: { type: "number" }
      },
      required: ["strategy", "locator"],
      additionalProperties: false
    }
  }
];
