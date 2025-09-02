import { describe, it, expect } from 'vitest';
import { executeToolMethod } from '../../src/server/execute-tool-method.js';

describe('executeToolMethod wiring', () => {
  it('calls AppManager.launchApp when toolName is "launch_app"', async () => {
    const launched = { success: true, message: 'launched' };
    const mockAppManager = {
      launchApp: async (appId: string) => {
        expect(appId).toBe('com.example.app');
        return launched;
      }
    };

    const mockClient: any = {
      getAppManager: () => mockAppManager
    };

    const res = await executeToolMethod(mockClient, 'launch_app', { appId: 'com.example.app' });
    expect(res).toEqual(launched);
  });

  it('calls ElementManager.findElement when toolName is "find_mobile_element"', async () => {
    const found = {
      success: true,
      message: 'found',
      data: { elementId: 'el-1', locator: 'btn', strategy: 'id' }
    };
    const mockElementManager = {
      findElement: async (strategy: string, locator: string) => {
        expect(strategy).toBe('id');
        expect(locator).toBe('btn');
        return found;
      }
    };

    const mockClient: any = {
      getElementManager: () => mockElementManager
    };

    const res = await executeToolMethod(mockClient, 'find_mobile_element', { strategy: 'id', locator: 'btn' });
    expect(res).toEqual(found);
  });
});
