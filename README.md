# Appium MCP Server

A Model Context Protocol (MCP) server that provides seamless integration between MCP clients and Appium for mobile automation. This server enables natural language interactions with mobile devices and emulators for automated testing, mobile app testing, and device control.

## Features

- Natural Language Interface: control mobile devices using conversational commands
- Complete Mobile Automation: comprehensive tools covering essential Appium operations
- Cross-Platform Support: iOS and Android devices, emulators, and simulators
- AI‑Optimized Discovery: specialized tools for mobile app analysis and test generation
- Flexible Tool Control: limit available tools using environment variables
- TypeScript Implementation: full type safety and better error handling

### 🚀 Phase 5: Platform-Specific Enhancements

The latest release introduces advanced platform-specific features for iOS and Android, providing deeper integration and optimized performance for each platform:

#### iOS-Specific Features

- **Simulator Management**: Create, boot, reset, and manage iOS simulators programmatically
- **Predicate Locators**: Use NSPredicate strings for advanced iOS element selection
- **Class Chain Locators**: Leverage iOS Class Chain selectors for complex element hierarchies
- **System Alerts**: Handle iOS system alerts and permissions automatically
- **Natural Scrolling**: iOS-optimized swipe gestures with momentum and natural feel

#### Android-Specific Features

- **Emulator Management**: Control Android emulators with advanced configuration options
- **UiAutomator Locators**: Use UiAutomator selectors for Android-specific element location
- **DataMatcher Locators**: Advanced Android element location using DataMatcher patterns
- **Permission Management**: Grant and revoke Android app permissions dynamically
- **Network Control**: Toggle WiFi, mobile data, and airplane mode programmatically

#### Cross-Platform Capabilities

- **Smart Locator Routing**: Automatically chooses optimal locator strategy per platform
- **Enhanced Gestures**: Platform-aware gesture system with iOS fling and Android momentum
- **Fallback Strategies**: Try multiple locator approaches if primary method fails
- **Platform Detection**: Automatic platform detection with optimized defaults
- **Unified API**: Single interface that adapts to iOS or Android seamlessly

#### Advanced Features

- **Locator Suggestions**: Get platform-specific locator strategy recommendations
- **Element Validation**: Comprehensive element state checking (visible, enabled, clickable)
- **Performance Optimization**: Platform-specific optimizations for faster element location
- **Type Safety**: Full TypeScript support with strict type checking

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

### Using pnpm

```bash
pnpm install
```

### Using yarn

```bash
yarn install
```

3. Build the project

### Using pnpm

```bash
pnpm build
```

### Using yarn

```bash
yarn build
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

### Phase 5: Advanced Platform-Specific Examples

#### iOS Simulator Management

```json
{
    "tool": "ios_create_simulator",
    "args": {
        "deviceType": "iPhone 14",
        "runtime": "iOS 17.0"
    }
}
```

```json
{
    "tool": "ios_boot_simulator",
    "args": {
        "simulatorId": "iPhone-14-simulator"
    }
}
```

#### iOS Advanced Element Location

```json
{
    "tool": "ios_predicate_locate",
    "args": {
        "predicate": "type == 'XCUIElementTypeButton' AND label CONTAINS 'Login'",
        "multiple": false,
        "timeout": 10000
    }
}
```

```json
{
    "tool": "ios_class_chain_locate",
    "args": {
        "classChain": "**/XCUIElementTypeTable/XCUIElementTypeCell[1]",
        "multiple": true
    }
}
```

#### Android Emulator Management

```json
{
    "tool": "android_create_emulator",
    "args": {
        "name": "test-emulator",
        "device": "pixel_6",
        "apiLevel": "33"
    }
}
```

```json
{
    "tool": "android_boot_emulator",
    "args": {
        "emulatorId": "emulator-5554",
        "options": {
            "noWindow": false,
            "gpu": "swiftshader_indirect"
        }
    }
}
```

#### Android Advanced Element Location

```json
{
    "tool": "android_uiautomator_locate",
    "args": {
        "selector": "new UiSelector().className(\"android.widget.Button\").textContains(\"Submit\")",
        "multiple": false
    }
}
```

```json
{
    "tool": "android_datamatcher_locate",
    "args": {
        "matcher": "{\"name\": \"submit_button\", \"class\": \"android.widget.Button\"}",
        "timeout": 15000
    }
}
```

#### Cross-Platform Smart Location

```json
{
    "tool": "smart_locate_element",
    "args": {
        "strategy": "accessibility-id",
        "locator": "login-button",
        "multiple": false,
        "timeout": 10000
    }
}
```

#### Enhanced Gestures

```json
{
    "tool": "enhanced_swipe",
    "args": {
        "direction": "right",
        "distance": 0.8,
        "velocity": 2000,
        "naturalScrolling": true
    }
}
```

```json
{
    "tool": "ios_fling",
    "args": {
        "direction": "down",
        "velocity": 3000
    }
}
```

#### Fallback Location Strategies

```json
{
    "tool": "cross_platform_locate",
    "args": {
        "primaryStrategy": "accessibility-id",
        "primaryLocator": "login-btn",
        "fallbackStrategies": [
            {
                "strategy": "id",
                "locator": "com.example:id/login_button"
            },
            {
                "strategy": "xpath",
                "locator": "//android.widget.Button[contains(@text, 'Login')]"
            }
        ],
        "timeout": 15000
    }
}
```

#### Element Validation

```json
{
    "tool": "validate_element",
    "args": {
        "elementId": "login-button",
        "visible": true,
        "enabled": true,
        "clickable": true,
        "text": "Sign In"
    }
}
```

#### Locator Strategy Suggestions

```json
{
    "tool": "get_locator_suggestions",
    "args": {
        "platform": "android"
    }
}
```

### Example Workflow

```javascript
// JavaScript (pseudo-code; adapt to your MCP client library)
await mcpClient.callTool('start_session', {
    platformName: 'Android',
    platformVersion: '12.0',
    deviceName: 'emulator-5554',
    automationName: 'UiAutomator2',
    app: '/path/to/app.apk',
});

await mcpClient.callTool('find_mobile_element', {
    by: 'accessibility-id',
    value: 'username-field',
});

await mcpClient.callTool('send_mobile_keys', {
    by: 'accessibility-id',
    value: 'username-field',
    text: 'testuser@example.com',
});

await mcpClient.callTool('tap_element', {
    by: 'accessibility-id',
    value: 'login-button',
});

await mcpClient.callTool('end_session', {});
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
│   │   ├── ios-manager.ts         # iOS-specific operations (Phase 5)
│   │   ├── android-manager.ts     # Android-specific operations (Phase 5)
│   │   ├── simulator-manager.ts   # iOS simulator management (Phase 5)
│   │   ├── emulator-manager.ts    # Android emulator management (Phase 5)
│   │   ├── enhanced-gesture-manager.ts # Platform-aware gestures (Phase 5)
│   │   ├── locator-manager.ts     # Smart locator routing (Phase 5)
│   │   ├── platform-detector.ts   # Platform detection utilities (Phase 5)
│   │   └── types.ts               # TypeScript interfaces
│   └── tools/
│       ├── index.ts               # Tool exports
│       ├── device-management.ts   # Device control tools
│       ├── element-interaction.ts # Element interaction tools
│       ├── gesture-tools.ts       # Gesture tools
│       ├── app-management.ts      # App management tools
│       ├── mobile-analysis.ts     # Mobile-specific analysis tools
│       ├── ios-tools.ts           # iOS-specific tools (Phase 5)
│       ├── android-tools.ts       # Android-specific tools (Phase 5)
│       ├── enhanced-gesture-tools.ts # Advanced gesture tools (Phase 5)
│       └── locator-tools.ts       # Smart locator tools (Phase 5)
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

### Phase 5: Platform-Specific Troubleshooting

#### iOS Simulator Issues

- **Simulator won't boot**: Ensure Xcode is properly installed and simulators are available
- **xcrun command not found**: Install Xcode command line tools: `xcode-select --install`
- **Predicate locators failing**: Verify NSPredicate syntax and element hierarchy
- **Class Chain not working**: Check iOS version compatibility and element structure

#### Android Emulator Issues

- **Emulator won't start**: Verify Android SDK installation and emulator images
- **ADB connection failed**: Check USB debugging is enabled and device is authorized
- **UiAutomator selectors failing**: Verify Android API level and selector syntax
- **DataMatcher not working**: Check Android version and DataMatcher format

#### Cross-Platform Issues

- **Platform detection fails**: Ensure correct capabilities are provided in session start
- **Smart locator routing issues**: Check that platform-specific drivers are installed
- **Enhanced gestures not working**: Verify platform compatibility and gesture parameters
- **Fallback strategies failing**: Ensure all fallback locators are valid for the platform

## Contributing

See the `docs/` folder for detailed contribution guidelines, API documentation, and development setup instructions.

## License

MIT License

---

_This project follows the proven architecture of the Selenium MCP server while adapting to the unique requirements of mobile automation with Appium._
