import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createStopwatch, STOPWATCH_STATES } from '../js/stopwatch.js';

describe('stopwatch state and display', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts in idle with 0 and millis hidden', () => {
    const sw = createStopwatch();
    expect(sw.getState()).toBe(STOPWATCH_STATES.STATE_IDLE);
    expect(sw.getDisplayMs()).toBe(0);
    expect(sw.isMillisVisible()).toBe(false);
  });

  it('transitions to running on start() and shows millis', () => {
    const sw = createStopwatch();
    sw.start();
    expect(sw.getState()).toBe(STOPWATCH_STATES.STATE_RUNNING);
    expect(sw.isMillisVisible()).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(sw.getDisplayMs()).toBe(1000);
  });

  it('pauses and resumes', () => {
    const sw = createStopwatch();
    sw.start();
    vi.advanceTimersByTime(500);
    sw.pause();
    expect(sw.getState()).toBe(STOPWATCH_STATES.STATE_PAUSED);
    const atPause = sw.getDisplayMs();
    vi.advanceTimersByTime(2000);
    expect(sw.getDisplayMs()).toBe(atPause);
    sw.start();
    vi.advanceTimersByTime(100);
    expect(sw.getDisplayMs()).toBe(atPause + 100);
  });

  it('reset returns to idle and hides millis', () => {
    const sw = createStopwatch();
    sw.start();
    vi.advanceTimersByTime(1000);
    sw.reset();
    expect(sw.getState()).toBe(STOPWATCH_STATES.STATE_IDLE);
    expect(sw.getDisplayMs()).toBe(0);
    expect(sw.isMillisVisible()).toBe(false);
  });

  it('repeated start in running is no-op', () => {
    const sw = createStopwatch();
    sw.start();
    vi.advanceTimersByTime(100);
    sw.start();
    vi.advanceTimersByTime(100);
    expect(sw.getDisplayMs()).toBe(200);
  });
});
