import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCountdown, COUNTDOWN_STATES } from '../js/countdown.js';

describe('countdown state and display', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts idle with given initial and millis hidden', () => {
    const cd = createCountdown(60000);
    expect(cd.getState()).toBe(COUNTDOWN_STATES.STATE_IDLE);
    expect(cd.getDisplayMs()).toBe(60000);
    expect(cd.isMillisVisible()).toBe(false);
  });

  it('counts down when running and stops at 0', () => {
    const cd = createCountdown(1000);
    cd.start();
    expect(cd.getState()).toBe(COUNTDOWN_STATES.STATE_RUNNING);
    expect(cd.isMillisVisible()).toBe(true);
    vi.advanceTimersByTime(500);
    expect(cd.getDisplayMs()).toBe(500);
    vi.advanceTimersByTime(600);
    expect(cd.getDisplayMs()).toBe(0);
    expect(cd.getState()).toBe(COUNTDOWN_STATES.STATE_COMPLETED);
  });

  it('does not go negative', () => {
    const cd = createCountdown(100);
    cd.start();
    vi.advanceTimersByTime(500);
    expect(cd.getDisplayMs()).toBe(0);
  });

  it('pause and resume', () => {
    const cd = createCountdown(5000);
    cd.start();
    vi.advanceTimersByTime(1000);
    cd.pause();
    expect(cd.getState()).toBe(COUNTDOWN_STATES.STATE_PAUSED);
    const atPause = cd.getDisplayMs();
    vi.advanceTimersByTime(2000);
    expect(cd.getDisplayMs()).toBe(atPause);
    cd.start();
    vi.advanceTimersByTime(500);
    expect(cd.getDisplayMs()).toBe(atPause - 500);
  });

  it('reset stops and returns to 00:00:00', () => {
    const cd = createCountdown(60000);
    cd.start();
    vi.advanceTimersByTime(1000);
    cd.reset();
    expect(cd.getState()).toBe(COUNTDOWN_STATES.STATE_IDLE);
    expect(cd.getDisplayMs()).toBe(0);
    expect(cd.isMillisVisible()).toBe(false);
  });

  it('setTarget only when idle or paused', () => {
    const cd = createCountdown(1000);
    expect(cd.setTarget(5000)).toBe(true);
    expect(cd.getDisplayMs()).toBe(5000);
    cd.start();
    expect(cd.setTarget(1000)).toBe(false);
    cd.pause();
    expect(cd.setTarget(2000)).toBe(true);
    expect(cd.getDisplayMs()).toBe(2000);
  });

  it('start from 0 does nothing', () => {
    const cd = createCountdown(0);
    cd.start();
    expect(cd.getState()).toBe(COUNTDOWN_STATES.STATE_IDLE);
  });

  it('editing allowed when idle or paused only', () => {
    const cd = createCountdown(60000);
    expect(cd.isEditingAllowed()).toBe(true);
    cd.start();
    expect(cd.isEditingAllowed()).toBe(false);
    cd.pause();
    expect(cd.isEditingAllowed()).toBe(true);
  });
});
