import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const gestureTools: Tool[] = [
  {
    name: "swipe_screen",
    description: "Swipe across the screen from start to end coordinates",
    inputSchema: {
      type: "object",
      properties: {
        startX: { type: "number" },
        startY: { type: "number" },
        endX: { type: "number" },
        endY: { type: "number" },
        durationMs: { type: "number" }
      },
      required: ["startX", "startY", "endX", "endY"],
      additionalProperties: false
    }
  },
  {
    name: "swipe_element",
    description: "Swipe relative to an element (by elementId)",
    inputSchema: {
      type: "object",
      properties: {
        elementId: { type: "string" },
        offsetX: { type: "number" },
        offsetY: { type: "number" },
        durationMs: { type: "number" }
      },
      required: ["elementId", "offsetX", "offsetY"],
      additionalProperties: false
    }
  },
  {
    name: "pinch_zoom",
    description: "Perform pinch (zoom out) or zoom (zoom in) gesture around a center point",
    inputSchema: {
      type: "object",
      properties: {
        centerX: { type: "number" },
        centerY: { type: "number" },
        distance: { type: "number" },
        scale: { type: "number" },
        durationMs: { type: "number" }
      },
      required: ["centerX", "centerY", "distance"],
      additionalProperties: false
    }
  },
  {
    name: "long_press",
    description: "Long press at a coordinate or on an element",
    inputSchema: {
      type: "object",
      properties: {
        elementId: { type: "string" },
        x: { type: "number" },
        y: { type: "number" },
        durationMs: { type: "number" }
      },
      required: [],
      additionalProperties: false
    }
  },
  {
    name: "double_tap",
    description: "Double tap at a coordinate or on an element",
    inputSchema: {
      type: "object",
      properties: {
        elementId: { type: "string" },
        x: { type: "number" },
        y: { type: "number" }
      },
      required: [],
      additionalProperties: false
    }
  },
  {
    name: "multi_touch",
    description: "Perform a multi-touch gesture with multiple touch points",
    inputSchema: {
      type: "object",
      properties: {
        touches: {
          type: "array",
          items: {
            type: "object",
            properties: {
              x: { type: "number" },
              y: { type: "number" },
              durationMs: { type: "number" }
            },
            required: ["x", "y"],
            additionalProperties: false
          }
        }
      },
      required: ["touches"],
      additionalProperties: false
    }
  },
  {
    name: "scroll",
    description: "Scroll by amount or within an element",
    inputSchema: {
      type: "object",
      properties: {
        elementId: { type: "string" },
        deltaX: { type: "number" },
        deltaY: { type: "number" },
        durationMs: { type: "number" }
      },
      required: ["deltaX", "deltaY"],
      additionalProperties: false
    }
  }
];
