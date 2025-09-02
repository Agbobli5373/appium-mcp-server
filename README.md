# Appium MCP Server

A Model Context Protocol (MCP) server that provides seamless integration between MCP clients and Appium for mobile automation. This server enables natural language interactions with mobile devices and emulators for automated testing, mobile app testing, and device control.

## Features

- Natural Language Interface: control mobile devices using conversational commands
- Complete Mobile Automation: comprehensive tools covering essential Appium operations
- Cross-Platform Support: iOS and Android devices, emulators, and simulators
- AI‑Optimized Discovery: specialized tools for mobile app analysis and test generation
- Flexible Tool Control: limit available tools using environment variables
- TypeScript Implementation: full type safety and better error handling

## Prerequisites

- Node.js 18.0.0 or higher
- TypeScript 5.0.0 or higher
- Appium Server 2.0+
- Mobile development environment:
  - **Android**: Android SDK, UiAutomator2 driver, Android device/emulator
  - **iOS**: Xcode, XCUITest driver, iOS Simulator (macOS only)

## Installation

1. Clone the project

```bash
git clone https://github.com/agbobli5373/appium-mcp-server.git
cd appium-mcp-server
```

2. Install dependencies

```bash
npm install
```

3. Build the project

```bash
npm run build
```

4. Test the server (optional)

```bash
node dist/index.js
```

You should see: `Appium MCP Server running on stdio`

## Usage Examples

1. Start the wrapper directly (for local testing)

```bash
# bash
node wrapper.cjs
# You should see: Appium MCP Server running on stdio
```

2. Start wrapper with a limited tool set

```bash
# bash
export MCP_TOOLS='["start_session","find_mobile_element","tap_element"]'
node wrapper.cjs
```

3. Example MCP client server config (Windows)

```json
{
  "servers": {
    "appium": {
      "command": "node",
      "args": ["C:\\absolute\\path\\to\\appium-mcp-server\\wrapper.cjs"]
    }
  }
}
```

## MCP Client Integration

### Tool Call Examples

Start an Appium session

```json
{
  "tool": "start_session",
  "args": {
    "platformName": "Android",
    "platformVersion": "12.0",
    "deviceName": "emulator-5554",
    "automationName": "UiAutomator2"
  }
}
```

Find and tap an element

```json
{
  "tool": "find_mobile_element",
  "args": {
    "by": "accessibility-id",
    "value": "login-button"
  }
}
```

```json
{
  "tool": "tap_element",
  "args": {
    "by": "accessibility-id",
    "value": "login-button"
  }
}
```

Perform swipe gesture

```json
{
  "tool": "swipe_screen",
  "args": {
    "direction": "up",
    "distance": 0.5
  }
}
```

### Example Workflow

```javascript
// JavaScript (pseudo-code; adapt to your MCP client library)
await mcpClient.callTool("start_session", {
  platformName: "Android",
  platformVersion: "12.0",
  deviceName: "emulator-5554",
  automationName: "UiAutomator2",
  app: "/path/to/app.apk"
});

await mcpClient.callTool("find_mobile_element", {
  by: "accessibility-id",
  value: "username-field"
});

await mcpClient.callTool("send_mobile_keys", {
  by: "accessibility-id",
  value: "username-field",
  text: "testuser@example.com"
});

await mcpClient.callTool("tap_element", {
  by: "accessibility-id",
  value: "login-button"
});

await mcpClient.callTool("end_session", {});
```

## Configuration

### MCP Client Configuration

Windows:

```json
{
  "servers": {
    "appium": {
      "command": "node",
      "args": ["C:\\path\\to\\your\\appium-mcp-server\\wrapper.cjs"]
    }
  }
}
```

macOS / Linux:

```json
{
  "servers": {
    "appium": {
      "command": "node",
      "args": ["/path/to/your/appium-mcp-server/wrapper.cjs"]
    }
  }
}
```

### Environment Variables

Control available tools with `MCP_TOOLS`:

- No `MCP_TOOLS` set (or no `env` section): all tools are available by default
- `MCP_TOOLS` with specific tools: only those tools become available

Example — default (all tools available):

```json
{
  "servers": {
    "appium": {
      "command": "node",
      "args": ["/path/to/appium-mcp-server/wrapper.cjs"]
    }
  }
}
```

Example — limit to specific tools:

```json
{
  "servers": {
    "appium": {
      "command": "node",
      "args": ["/path/to/appium-mcp-server/wrapper.cjs"],
      "env": {
        "MCP_TOOLS": ["start_session", "find_mobile_element", "tap_element", "send_mobile_keys"]
      }
    }
  }
}
```

## Development

### Available Scripts

- `npm run build` - Build the TypeScript project
- `npm run start` - Start the compiled server
- `npm run dev` - Start development server with hot reload
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

### Project Structure

```
appium-mcp-server/
├── src/
│   ├── index.ts                    # Entry point
│   ├── server/
│   │   ├── server.ts              # MCP server implementation
│   │   ├── get-allowed-tools.ts   # Tool filtering logic
│   │   └── execute-tool-method.ts # Tool execution router
│   ├── appium-client/
│   │   ├── index.ts               # Main exports
│   │   ├── appium-client.ts       # Core AppiumDriver management
│   │   ├── device-manager.ts      # Device control & info
│   │   ├── element-manager.ts     # Mobile element interactions
│   │   ├── gesture-manager.ts     # Touch gestures
│   │   ├── context-manager.ts     # App context switching
│   │   ├── app-manager.ts         # App lifecycle management
│   │   └── types.ts               # TypeScript interfaces
│   └── tools/
│       ├── index.ts               # Tool exports
│       ├── device-management.ts   # Device control tools
│       ├── element-interaction.ts # Element interaction tools
│       ├── gesture-tools.ts       # Gesture tools
│       ├── app-management.ts      # App management tools
│       └── mobile-analysis.ts     # Mobile-specific analysis tools
├── wrapper.cjs                    # CommonJS wrapper
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
├── vitest.config.ts              # Testing configuration
└── docs/                         # Documentation
```

## Troubleshooting

### Common Issues

- **Server won't start**: Verify Node.js v18+ and Appium Server are installed
- **Connection issues**: Confirm absolute paths in MCP client configuration
- **Platform-specific errors**: Ensure correct drivers and development tools are installed
- **Device connection issues**: Verify device/emulator is properly configured

### Platform-Specific Setup

#### Android Setup
1. Install Android SDK and set up environment variables
2. Install UiAutomator2 driver: `appium driver install uiautomator2`
3. Start Android emulator or connect physical device
4. Verify ADB connection: `adb devices`

#### iOS Setup (macOS only)
1. Install Xcode and command line tools
2. Install XCUITest driver: `appium driver install xcuitest`
3. Start iOS Simulator or connect physical device
4. Accept developer certificates and permissions

## Contributing

See the `docs/` folder for detailed contribution guidelines, API documentation, and development setup instructions.

## License

MIT License

---

*This project follows the proven architecture of the Selenium MCP server while adapting to the unique requirements of mobile automation with Appium.*
