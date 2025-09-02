/**
 * Get allowed tools from environment variable MCP_TOOLS
 * Returns null if no filtering should be applied (use all tools)
 * Returns array of tool names if specific tools are requested
 */
export function getAllowedTools(): string[] | null {
    const mcpTools = process.env.MCP_TOOLS;

    if (!mcpTools) {
        // No MCP_TOOLS specified - use all tools
        return null;
    }

    if (mcpTools === "*") {
        // Explicitly request all tools
        return null;
    }

    try {
        // Try to parse as JSON array
        const tools = JSON.parse(mcpTools);

        if (Array.isArray(tools)) {
            return tools.filter((tool: any) => typeof tool === 'string');
        }

        // If it's a string, treat as single tool
        if (typeof tools === 'string') {
            return [tools];
        }

        console.warn("Invalid MCP_TOOLS format. Expected JSON array or string. Using all tools.");
        return null;

    } catch (error) {
        // If JSON parsing fails, try comma-separated string
        if (typeof mcpTools === 'string') {
            return mcpTools.split(',').map(tool => tool.trim()).filter(tool => tool.length > 0);
        }

        console.warn("Failed to parse MCP_TOOLS. Using all tools as fallback.");
        return null;
    }
}
