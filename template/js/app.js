/**
 * App entry: wires landing, stopwatch and countdown views to the DOM.
 * Exports initApp for testing with a custom document.
 */

import { formatMsToDisplay, parseAndValidateCountdown, clampCountdownInput } from './time-utils.js';
import { createStopwatch } from './stopwatch.js';
import { createCountdown } from './countdown.js';

const VIEW_LANDING = 'landing';
const VIEW_STOPWATCH = 'stopwatch';
const VIEW_COUNTDOWN = 'countdown';

export function initApp(doc = document) {
  const stopwatch = createStopwatch();
  const countdown = createCountdown(0);

  const landing = doc.getElementById('view-landing');
  const stopwatchView = doc.getElementById('view-stopwatch');
  const countdownView = doc.getElementById('view-countdown');
  const linkStopwatch = doc.getElementById('link-stopwatch');
  const linkCountdown = doc.getElementById('link-countdown');
  const backStopwatch = doc.getElementById('back-stopwatch');
  const backCountdown = doc.getElementById('back-countdown');

  const stopwatchMain = doc.getElementById('stopwatch-main');
  const stopwatchMillis = doc.getElementById('stopwatch-millis');
  const stopwatchMillisWrap = doc.getElementById('stopwatch-millis-wrap');
  const stopwatchPrimaryBtn = doc.getElementById('stopwatch-primary-btn');
  const stopwatchResetBtn = doc.getElementById('stopwatch-reset-btn');

  const countdownMain = doc.getElementById('countdown-main');
  const countdownMillis = doc.getElementById('countdown-millis');
  const countdownMillisWrap = doc.getElementById('countdown-millis-wrap');
  const countdownH = doc.getElementById('countdown-h');
  const countdownM = doc.getElementById('countdown-m');
  const countdownS = doc.getElementById('countdown-s');
  const countdownPrimaryBtn = doc.getElementById('countdown-primary-btn');
  const countdownResetBtn = doc.getElementById('countdown-reset-btn');
  const countdownError = doc.getElementById('countdown-error');

  function showView(viewId) {
    [landing, stopwatchView, countdownView].forEach((el) => {
      if (el) el.classList.add('hidden');
    });
    const active =
      viewId === VIEW_STOPWATCH
        ? stopwatchView
        : viewId === VIEW_COUNTDOWN
          ? countdownView
          : landing;
    if (active) active.classList.remove('hidden');
    const countdownState = countdown.getState();
    if (
      viewId === VIEW_COUNTDOWN &&
      countdownState !== 'running' &&
      countdownState !== 'paused'
    ) {
      applyCountdownInput();
    }
  }

  function renderStopwatch() {
    if (!stopwatchMain) return;
    const { main, millis } = formatMsToDisplay(stopwatch.getDisplayMs());
    stopwatchMain.textContent = main;
    if (stopwatchMillis) stopwatchMillis.textContent = millis;
    if (stopwatchMillisWrap) {
      stopwatchMillisWrap.classList.toggle('hidden', !stopwatch.isMillisVisible());
    }
    if (stopwatchPrimaryBtn) {
      stopwatchPrimaryBtn.textContent =
        stopwatch.getState() === 'running' ? 'Pause' : 'Start';
    }
  }

  function renderCountdown() {
    if (!countdownMain) return;
    const { main, millis } = formatMsToDisplay(countdown.getDisplayMs());
    countdownMain.textContent = main;
    if (countdownMillis) countdownMillis.textContent = millis;
    if (countdownMillisWrap) {
      countdownMillisWrap.classList.toggle('hidden', !countdown.isMillisVisible());
    }
    if (countdownPrimaryBtn) {
      countdownPrimaryBtn.textContent =
        countdown.getState() === 'running' ? 'Pause' : 'Start';
      countdownPrimaryBtn.disabled = countdown.getState() === 'idle' && countdown.getDisplayMs() <= 0;
    }
    const allowEdit = countdown.isEditingAllowed();
    if (countdownH) countdownH.disabled = !allowEdit;
    if (countdownM) countdownM.disabled = !allowEdit;
    if (countdownS) countdownS.disabled = !allowEdit;
  }

  function applyCountdownInput() {
    const strH = countdownH ? countdownH.value : '';
    const strM = countdownM ? countdownM.value : '';
    const strS = countdownS ? countdownS.value : '';
    const result = parseAndValidateCountdown(strH, strM, strS);
    if (result.error) {
      if (countdownError) {
        countdownError.textContent = result.error;
        countdownError.classList.remove('hidden');
      }
      return false;
    }
    if (countdownError) {
      countdownError.textContent = '';
      countdownError.classList.add('hidden');
    }
    const clamped = clampCountdownInput(result.h, result.m, result.s);
    if (countdownH) countdownH.value = String(clamped.h).padStart(2, '0');
    if (countdownM) countdownM.value = String(clamped.m).padStart(2, '0');
    if (countdownS) countdownS.value = String(clamped.s).padStart(2, '0');
    countdown.setTarget((clamped.h * 3600 + clamped.m * 60 + clamped.s) * 1000);
    return true;
  }

  stopwatch.subscribe(renderStopwatch);
  countdown.subscribe(renderCountdown);
  renderStopwatch();
  renderCountdown();

  if (linkStopwatch) {
    linkStopwatch.addEventListener('click', (e) => {
      e.preventDefault();
      showView(VIEW_STOPWATCH);
    });
  }
  if (linkCountdown) {
    linkCountdown.addEventListener('click', (e) => {
      e.preventDefault();
      showView(VIEW_COUNTDOWN);
    });
  }
  if (backStopwatch) {
    backStopwatch.addEventListener('click', (e) => {
      e.preventDefault();
      showView(VIEW_LANDING);
    });
  }
  if (backCountdown) {
    backCountdown.addEventListener('click', (e) => {
      e.preventDefault();
      showView(VIEW_LANDING);
    });
  }

  if (stopwatchPrimaryBtn) {
    stopwatchPrimaryBtn.addEventListener('click', () => {
      if (stopwatch.getState() === 'running') stopwatch.pause();
      else stopwatch.start();
    });
  }
  if (stopwatchResetBtn) {
    stopwatchResetBtn.addEventListener('click', () => stopwatch.reset());
  }

  if (countdownPrimaryBtn) {
    countdownPrimaryBtn.addEventListener('click', () => {
      const countdownState = countdown.getState();
      if (countdownState === 'running') countdown.pause();
      else {
        if (countdownState !== 'paused' && !applyCountdownInput()) return;
        countdown.start();
      }
    });
  }
  if (countdownResetBtn) {
    countdownResetBtn.addEventListener('click', () => {
      countdown.reset();
      if (countdownH) countdownH.value = '00';
      if (countdownM) countdownM.value = '00';
      if (countdownS) countdownS.value = '00';
    });
  }
  if (countdownH || countdownM || countdownS) {
    [countdownH, countdownM, countdownS].filter(Boolean).forEach((input) => {
      input.addEventListener('input', () => applyCountdownInput());
      input.addEventListener('blur', () => applyCountdownInput());
    });
  }

  showView(VIEW_LANDING);
  return { stopwatch, countdown, showView };
}
