/**
 * Time formatting and parsing utilities.
 * Single responsibility: pure functions for time display and countdown input validation.
 */

/**
 * Format milliseconds into main time (HH:MM:SS) and millis (000).
 * @param {number} ms - non-negative milliseconds
 * @returns {{ main: string, millis: string }}
 */
export function formatMsToDisplay(ms) {
  if (typeof ms !== 'number' || ms < 0 || !Number.isFinite(ms)) {
    ms = 0;
  }
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor(ms % 1000);
  const pad = (n, len) => String(n).padStart(len, '0');
  return {
    main: `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`,
    millis: pad(millis, 3),
  };
}

/**
 * Parse and validate countdown input. Returns total milliseconds or an error.
 * @param {string|number} h - hours (0-99)
 * @param {string|number} m - minutes (0-59)
 * @param {string|number} s - seconds (0-59)
 * @returns {{ totalMs: number } | { error: string }}
 */
export function parseAndValidateCountdown(h, m, s) {
  const num = (v) => (typeof v === 'string' ? v.trim() : String(v));
  const hh = parseInt(num(h), 10);
  const mm = parseInt(num(m), 10);
  const ss = parseInt(num(s), 10);
  if (Number.isNaN(hh) || Number.isNaN(mm) || Number.isNaN(ss)) {
    return { error: 'Invalid: values must be numbers' };
  }
  if (hh < 0 || hh > 99) return { error: 'Hours must be between 0 and 99' };
  if (mm < 0 || mm > 59) return { error: 'Minutes must be between 0 and 59' };
  if (ss < 0 || ss > 59) return { error: 'Seconds must be between 0 and 59' };
  const totalMs = (hh * 3600 + mm * 60 + ss) * 1000;
  return { totalMs };
}

/**
 * Clamp raw input values to valid countdown ranges (H 0-99, M 0-59, S 0-59).
 * @param {number} h
 * @param {number} m
 * @param {number} s
 * @returns {{ h: number, m: number, s: number }}
 */
export function clampCountdownInput(h, m, s) {
  const n = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  return {
    h: Math.min(99, Math.max(0, Math.floor(n(h)))),
    m: Math.min(59, Math.max(0, Math.floor(n(m)))),
    s: Math.min(59, Math.max(0, Math.floor(n(s)))),
  };
}
