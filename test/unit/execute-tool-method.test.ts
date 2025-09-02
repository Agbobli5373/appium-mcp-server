import { describe, it, expect, vi } from 'vitest';
import { executeToolMethod } from '../../src/server/execute-tool-method.js';

describe('executeToolMethod wiring and validation', () => {
  it('calls startSession on appiumClient when start_session invoked', async () => {
    const fakeClient: any = {
      startSession: vi.fn().mockResolvedValue({ success: true, message: 'started' }),
    };

    const res = await executeToolMethod(fakeClient, 'start_session', { capabilities: { platformName: 'Android' } });
    expect(fakeClient.startSession).toHaveBeenCalledWith({ platformName: 'Android' });
    expect(res).toBeDefined();
    expect(res.success).toBe(true);
    expect(res.message).toBe('started');
  });

    it('returns validation error for required input (get_app_state)', async () => {
        const fakeClient: any = {
          getAppManager: () => ({ getAppState: vi.fn() }),
        };
    
        const res = await executeToolMethod(fakeClient, 'get_app_state', {}); // missing appId
        expect(res).toBeDefined();
        expect(res.success).toBe(false);
        expect(typeof res.message).toBe('string');
        expect(res.message).toMatch(/Missing required properties/i);
      });

  it('routes find_mobile_element to element manager when input valid', async () => {
    const findFn = vi.fn().mockResolvedValue({ success: true, data: { elementId: 'el-1' } });
    const fakeClient: any = {
      getElementManager: () => ({ findElement: findFn }),
    };

    const res = await executeToolMethod(fakeClient, 'find_mobile_element', { strategy: 'accessibility id', locator: 'login' });
    expect(findFn).toHaveBeenCalledWith('accessibility id', 'login');
    expect(res).toBeDefined();
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ elementId: 'el-1' });
  });
});
