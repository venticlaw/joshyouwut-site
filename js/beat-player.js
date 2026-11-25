(() => {
  const audio = document.querySelector('[data-beat-audio]');
  const canvas = document.querySelector('[data-beat-waveform]');
  const seek = document.querySelector('[data-waveform-seek]');
  const toggle = document.querySelector('[data-player-toggle]');
  if (!audio || !canvas || !seek || !toggle) return;
  const elapsed = document.querySelector('[data-player-elapsed]');
  const total = document.querySelector('[data-player-duration]');
  const volume = document.querySelector('[data-player-volume]');
  const url = new URL('../assets/data/waveforms.json', document.currentScript?.src || new URL('js/beat-player.js', window.location.href));
  let peaks = {};
  const measureDock = () => {
    const height = document.querySelector('#player').getBoundingClientRect().height;
    if (height > 0) document.body.style.setProperty('--beat-dock-clearance', `${Math.ceil(height) + 16}px`);
  };
  const duration = () => Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : Number(audio.dataset.previewDuration) || 60;
  const time = (seconds) => `${Math.floor(Math.max(0, seconds) / 60)}:${String(Math.floor(Math.max(0, seconds) % 60)).padStart(2, '0')}`;
  const draw = () => {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width || 500));
    const height = Math.max(1, Math.round(rect.height || 48));
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * scale; canvas.height = height * scale;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(scale, scale);
    const values = peaks[audio.dataset.beatId];
    const progress = Math.min(1, Math.max(0, Number(seek.value) / 1000));
    if (!Array.isArray(values) || !values.length) {
      context.fillStyle = '#8d8981'; context.fillRect(0, height / 2, width, 1); return;
    }
    const count = Math.min(values.length, Math.max(1, Math.floor(width / 4)));
    for (let index = 0; index < count; index++) {
      const sample = values[Math.floor(index * values.length / count)];
      const barHeight = Math.max(2, Math.min(1, Number(sample) || 0) * (height - 6));
      context.fillStyle = index / count < progress ? '#f1bd5b' : '#96938c';
      context.fillRect(index * width / count, (height - barHeight) / 2, Math.max(1, width / count - 2), barHeight);
    }
  };
  const update = () => {
    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    elapsed.textContent = time(current); total.textContent = time(duration());
    seek.value = String(Math.min(1000, current / duration() * 1000));
    seek.setAttribute('aria-valuetext', `${time(current)} of ${time(duration())}`);
    seek.disabled = !Number.isFinite(audio.duration) || audio.duration <= 0;
    toggle.disabled = !audio.dataset.beatId;
    toggle.setAttribute('aria-label', `${audio.paused ? 'Play' : 'Pause'} ${document.querySelector('[data-current-title]').textContent}`);
    toggle.setAttribute('aria-pressed', String(!audio.paused));
    toggle.querySelector('span').className = audio.paused ? 'play-icon' : 'pause-icon';
    document.body.dataset.playerPlaying = String(!audio.paused);
    draw();
  };
  seek.addEventListener('input', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = Number(seek.value) / 1000 * audio.duration;
    update();
  });
  volume.addEventListener('input', () => { audio.volume = Math.min(1, Math.max(0, Number(volume.value))); });
  ['timeupdate', 'durationchange', 'loadedmetadata', 'play', 'pause', 'ended', 'emptied'].forEach(event => audio.addEventListener(event, update));
  document.addEventListener('jyw:beat-selected', update);
  window.addEventListener('resize', () => { draw(); measureDock(); });
  if (window.ResizeObserver) new ResizeObserver(measureDock).observe(document.querySelector('#player'));
  fetch(url.href).then(response => { if (!response.ok) throw new Error(); return response.json(); }).then(data => {
    if (data.version === 1 && data.peaks_by_beat && typeof data.peaks_by_beat === 'object') peaks = data.peaks_by_beat;
    draw();
  }).catch(() => { /* The native range remains usable if waveform data is unavailable. */ });
  document.body.classList.add('player-enhanced');
  audio.controls = false;
  update();
  measureDock();
})();
