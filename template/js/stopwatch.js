/**
 * Stopwatch state machine: idle | running | paused.
 * Milliseconds are considered "visible" only after the stopwatch has been started (running or paused).
 */

const STATE_IDLE = 'idle';
const STATE_RUNNING = 'running';
const STATE_PAUSED = 'paused';

export function createStopwatch() {
  let state = STATE_IDLE;
  let elapsedMs = 0;
  let startTimestamp = 0;
  let intervalId = null;
  const listeners = new Set();

  function getState() {
    return state;
  }

  function getDisplayMs(now = Date.now()) {
    if (state === STATE_IDLE) return 0;
    if (state === STATE_PAUSED) return elapsedMs;
    return elapsedMs + (now - startTimestamp);
  }

  function isMillisVisible() {
    return state !== STATE_IDLE;
  }

  function notify() {
    listeners.forEach((cb) => cb());
  }

  function start() {
    if (state === STATE_RUNNING) return;
    if (state === STATE_IDLE) {
      elapsedMs = 0;
      startTimestamp = Date.now();
      state = STATE_RUNNING;
      intervalId = setInterval(notify, 10);
    } else {
      startTimestamp = Date.now();
      state = STATE_RUNNING;
      intervalId = setInterval(notify, 10);
    }
    notify();
  }

  function pause() {
    if (state !== STATE_RUNNING) return;
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    elapsedMs = elapsedMs + (Date.now() - startTimestamp);
    state = STATE_PAUSED;
    notify();
  }

  function reset() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    elapsedMs = 0;
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
    start,
    pause,
    reset,
    subscribe,
  };
}

export const STOPWATCH_STATES = { STATE_IDLE, STATE_RUNNING, STATE_PAUSED };
