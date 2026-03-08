import { describe, it, expect } from 'vitest';
import {
  formatMsToDisplay,
  parseAndValidateCountdown,
  clampCountdownInput,
} from '../js/time-utils.js';

describe('time formatting', () => {
  it('formats 0 ms as 00:00:00 and 000', () => {
    expect(formatMsToDisplay(0)).toEqual({ main: '00:00:00', millis: '000' });
  });

  it('formats 1000 ms as 00:00:01 and 000', () => {
    expect(formatMsToDisplay(1000)).toEqual({ main: '00:00:01', millis: '000' });
  });

  it('formats 61000 ms as 00:01:01 and 000', () => {
    expect(formatMsToDisplay(61000)).toEqual({ main: '00:01:01', millis: '000' });
  });

  it('formats 3661000 ms as 01:01:01 and 000', () => {
    expect(formatMsToDisplay(3661000)).toEqual({ main: '01:01:01', millis: '000' });
  });

  it('formats milliseconds correctly', () => {
    expect(formatMsToDisplay(1250)).toEqual({ main: '00:00:01', millis: '250' });
    expect(formatMsToDisplay(999)).toEqual({ main: '00:00:00', millis: '999' });
  });

  it('treats invalid input as 0', () => {
    expect(formatMsToDisplay(-1)).toEqual({ main: '00:00:00', millis: '000' });
    expect(formatMsToDisplay(NaN)).toEqual({ main: '00:00:00', millis: '000' });
    expect(formatMsToDisplay('x')).toEqual({ main: '00:00:00', millis: '000' });
  });
});

describe('countdown parsing and validation', () => {
  it('parses valid H,M,S to totalMs', () => {
    expect(parseAndValidateCountdown(0, 0, 0)).toEqual({ totalMs: 0 });
    expect(parseAndValidateCountdown(0, 1, 30)).toEqual({ totalMs: 90000 });
    expect(parseAndValidateCountdown(1, 0, 0)).toEqual({ totalMs: 3600000 });
    expect(parseAndValidateCountdown('1', '2', '3')).toEqual({ totalMs: 3723000 });
  });

  it('returns error for non-numeric values', () => {
    const r = parseAndValidateCountdown('a', 0, 0);
    expect(r).toHaveProperty('error');
  });

  it('returns error for hours out of range', () => {
    expect(parseAndValidateCountdown(100, 0, 0)).toHaveProperty('error');
    expect(parseAndValidateCountdown(-1, 0, 0)).toHaveProperty('error');
  });

  it('returns error for minutes or seconds out of range', () => {
    expect(parseAndValidateCountdown(0, 60, 0)).toHaveProperty('error');
    expect(parseAndValidateCountdown(0, 0, 60)).toHaveProperty('error');
  });
});

describe('clamp countdown input', () => {
  it('clamps to valid ranges', () => {
    expect(clampCountdownInput(0, 0, 0)).toEqual({ h: 0, m: 0, s: 0 });
    expect(clampCountdownInput(50, 30, 45)).toEqual({ h: 50, m: 30, s: 45 });
    expect(clampCountdownInput(200, 80, 90)).toEqual({ h: 99, m: 59, s: 59 });
    expect(clampCountdownInput(-1, -1, -1)).toEqual({ h: 0, m: 0, s: 0 });
  });
});
