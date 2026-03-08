import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initApp } from '../js/app.js';

function createAppDOM() {
  const doc = document.implementation.createHTMLDocument('Test');
  doc.body.innerHTML = `
    <div id="view-landing"></div>
    <div id="view-stopwatch" class="hidden">
      <span id="stopwatch-main">00:00:00</span>
      <span id="stopwatch-millis-wrap" class="hidden"><span id="stopwatch-millis">000</span></span>
      <button type="button" id="stopwatch-primary-btn">Start</button>
      <button type="button" id="stopwatch-reset-btn">Reset</button>
    </div>
    <div id="view-countdown" class="hidden">
      <span id="countdown-main">00:00:00</span>
      <span id="countdown-millis-wrap" class="hidden"><span id="countdown-millis">000</span></span>
      <input type="number" id="countdown-h" value="0">
      <input type="number" id="countdown-m" value="0">
      <input type="number" id="countdown-s" value="30">
      <button type="button" id="countdown-primary-btn">Start</button>
      <button type="button" id="countdown-reset-btn">Reset</button>
    </div>
  `;
  return doc;
}

describe('DOM behaviour', () => {
  let doc;

  beforeEach(() => {
    vi.useFakeTimers();
    doc = createAppDOM();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('stopwatch', () => {
    it('shows Start and 00:00:00 initially, millis hidden', () => {
      initApp(doc);
      const main = doc.getElementById('stopwatch-main');
      const millisWrap = doc.getElementById('stopwatch-millis-wrap');
      const btn = doc.getElementById('stopwatch-primary-btn');
      expect(main.textContent).toBe('00:00:00');
      expect(millisWrap.classList.contains('hidden')).toBe(true);
      expect(btn.textContent).toBe('Start');
    });

    it('Start changes to Pause and shows millis when running', () => {
      initApp(doc);
      const btn = doc.getElementById('stopwatch-primary-btn');
      const millisWrap = doc.getElementById('stopwatch-millis-wrap');
      btn.click();
      expect(btn.textContent).toBe('Pause');
      expect(millisWrap.classList.contains('hidden')).toBe(false);
      vi.advanceTimersByTime(1000);
      const main = doc.getElementById('stopwatch-main');
      expect(main.textContent).toBe('00:00:01');
    });

    it('Reset returns display to 00:00:00 and hides millis', () => {
      initApp(doc);
      doc.getElementById('stopwatch-primary-btn').click();
      vi.advanceTimersByTime(500);
      doc.getElementById('stopwatch-reset-btn').click();
      expect(doc.getElementById('stopwatch-main').textContent).toBe('00:00:00');
      expect(doc.getElementById('stopwatch-millis-wrap').classList.contains('hidden')).toBe(true);
      expect(doc.getElementById('stopwatch-primary-btn').textContent).toBe('Start');
    });
  });

  describe('countdown', () => {
    it('primary button toggles Start/Pause and countdown runs', () => {
      const { showView } = initApp(doc);
      showView('countdown');
      const btn = doc.getElementById('countdown-primary-btn');
      expect(btn.textContent).toBe('Start');
      btn.click();
      expect(btn.textContent).toBe('Pause');
      vi.advanceTimersByTime(500);
      const main = doc.getElementById('countdown-main');
      expect(main.textContent).not.toBe('00:00:00');
      doc.getElementById('countdown-primary-btn').click();
      expect(btn.textContent).toBe('Start');
    });

    it('Reset stops and returns to 00:00:00', () => {
      const { showView } = initApp(doc);
      showView('countdown');
      doc.getElementById('countdown-primary-btn').click();
      vi.advanceTimersByTime(1000);
      doc.getElementById('countdown-reset-btn').click();
      expect(doc.getElementById('countdown-main').textContent).toBe('00:00:00');
      expect(doc.getElementById('countdown-millis-wrap').classList.contains('hidden')).toBe(true);
    });

    it('inputs are disabled when countdown is running', () => {
      const { showView } = initApp(doc);
      showView('countdown');
      const h = doc.getElementById('countdown-h');
      const m = doc.getElementById('countdown-m');
      expect(h.disabled).toBe(false);
      doc.getElementById('countdown-primary-btn').click();
      expect(h.disabled).toBe(true);
      expect(m.disabled).toBe(true);
      doc.getElementById('countdown-primary-btn').click();
      expect(h.disabled).toBe(false);
    });
  });
});
