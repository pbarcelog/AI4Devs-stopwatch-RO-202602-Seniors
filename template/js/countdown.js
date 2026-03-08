/**
 * Countdown state machine: idle | running | paused | completed.
 * Milliseconds visible after started or paused. Editing allowed when idle or paused.
 */

const STATE_IDLE = 'idle';
const STATE_RUNNING = 'running';
const STATE_PAUSED = 'paused';
const STATE_COMPLETED = 'completed';

export function createCountdown(initialTotalMs = 0) {
  let state = STATE_IDLE;
  let remainingMs = Math.max(0, initialTotalMs);
  let endTimestamp = 0;
  let intervalId = null;
  const listeners = new Set();

  function getState() {
    return state;
  }

  function getDisplayMs(now = Date.now()) {
    if (state === STATE_IDLE || state === STATE_COMPLETED) return Math.max(0, remainingMs);
    if (state === STATE_PAUSED) return remainingMs;
    return Math.max(0, endTimestamp - now);
  }

  function isMillisVisible() {
    return state === STATE_RUNNING || state === STATE_PAUSED;
  }

  function isEditingAllowed() {
    return state === STATE_IDLE || state === STATE_PAUSED;
  }

  function setTarget(totalMs) {
    if (state === STATE_RUNNING) return false;
    remainingMs = Math.max(0, Math.floor(totalMs));
    if (state === STATE_COMPLETED) state = STATE_IDLE;
    notify();
    return true;
  }

  function notify() {
    listeners.forEach((cb) => cb());
  }

  function start() {
    if (state === STATE_RUNNING) return;
    if (remainingMs <= 0) return;
    if (state === STATE_IDLE || state === STATE_PAUSED) {
      endTimestamp = Date.now() + remainingMs;
      state = STATE_RUNNING;
      intervalId = setInterval(() => {
        const now = Date.now();
        if (now >= endTimestamp) {
          if (intervalId) clearInterval(intervalId);
          intervalId = null;
          remainingMs = 0;
          state = STATE_COMPLETED;
        }
        notify();
      }, 10);
    }
    notify();
  }

  function pause() {
    if (state !== STATE_RUNNING) return;
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    remainingMs = Math.max(0, endTimestamp - Date.now());
    state = STATE_PAUSED;
    notify();
  }

  function reset() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    remainingMs = 0;
    state = STATE_IDLE;
    notify();
  }

  function subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  return {
    getState,
    getDisplayMs,
    isMillisVisible,
    isEditingAllowed,
    setTarget,
    start,
    pause,
    reset,
    subscribe,
  };
}

export const COUNTDOWN_STATES = {
  STATE_IDLE,
  STATE_RUNNING,
  STATE_PAUSED,
  STATE_COMPLETED,
};
