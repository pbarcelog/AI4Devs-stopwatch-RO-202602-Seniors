import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initApp } from '../js/app.js';

function createAppDOM() {
  const doc = document.implementation.createHTMLDocument('Test');
  doc.body.innerHTML = `
    <main>
      <section id="view-landing"></section>
      <section id="view-stopwatch" class="view hidden">
        <a href="#" id="back-stopwatch" class="back-link">← Back</a>
        <div class="panel">
          <div class="display" role="timer" aria-label="Stopwatch">
            <span class="main-time" id="stopwatch-main">00:00:00</span>
            <span id="stopwatch-millis-wrap" class="millis-wrap hidden" aria-hidden="true"><span class="millis" id="stopwatch-millis">000</span></span>
          </div>
          <div class="buttons">
            <button type="button" class="btn btn-primary" id="stopwatch-primary-btn">Start</button>
            <button type="button" class="btn btn-reset" id="stopwatch-reset-btn">Reset</button>
          </div>
        </div>
      </section>
      <section id="view-countdown" class="view hidden">
        <a href="#" id="back-countdown" class="back-link">← Back</a>
        <div class="panel">
          <div class="display" role="timer" aria-label="Countdown">
            <span class="main-time" id="countdown-main">00:00:00</span>
            <span id="countdown-millis-wrap" class="millis-wrap hidden" aria-hidden="true"><span class="millis" id="countdown-millis">000</span></span>
          </div>
          <div class="countdown-edit">
            <label for="countdown-h">Hours</label>
            <input type="number" id="countdown-h" min="0" max="99" value="0" aria-label="Hours">
            <label for="countdown-m">Minutes</label>
            <input type="number" id="countdown-m" min="0" max="59" value="0" aria-label="Minutes">
            <label for="countdown-s">Seconds</label>
            <input type="number" id="countdown-s" min="0" max="59" value="0" aria-label="Seconds">
          </div>
          <p id="countdown-error" class="error-msg hidden" role="alert"></p>
          <div class="buttons">
            <button type="button" class="btn btn-primary" id="countdown-primary-btn">Start</button>
            <button type="button" class="btn btn-reset" id="countdown-reset-btn">Reset</button>
          </div>
        </div>
      </section>
    </main>
  `;
  return doc;
}

function setCountdownInputs(doc, h, m, s) {
  const elH = doc.getElementById('countdown-h');
  const elM = doc.getElementById('countdown-m');
  const elS = doc.getElementById('countdown-s');
  if (elH) { elH.value = String(h); elH.dispatchEvent(new Event('input', { bubbles: true })); }
  if (elM) { elM.value = String(m); elM.dispatchEvent(new Event('input', { bubbles: true })); }
  if (elS) { elS.value = String(s); elS.dispatchEvent(new Event('input', { bubbles: true })); }
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
      setCountdownInputs(doc, 0, 0, 30);
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
      setCountdownInputs(doc, 0, 0, 30);
      doc.getElementById('countdown-primary-btn').click();
      vi.advanceTimersByTime(1000);
      doc.getElementById('countdown-reset-btn').click();
      expect(doc.getElementById('countdown-main').textContent).toBe('00:00:00');
      expect(doc.getElementById('countdown-millis-wrap').classList.contains('hidden')).toBe(true);
    });

    it('inputs are disabled when countdown is running', () => {
      const { showView } = initApp(doc);
      showView('countdown');
      setCountdownInputs(doc, 0, 0, 30);
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
