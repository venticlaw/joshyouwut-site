const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const header = document.querySelector("[data-site-header]");

const setHeaderState = () => {
  if (!header) return;
  header.toggleAttribute("data-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const beats = [
  {
    id: "unfuckwittable",
    title: "UnfuckWittable",
    bpm: 100,
    key: "C minor",
    lane: "Beat contest catalog",
    use: "Artist / custom licensing",
    description: "Dark, focused pocket with space for a serious lead vocal and sharp hook energy.",
    file: "assets/audio/previews/unfuckwittable-100bpm-cmin-preview.m4a"
  },
  {
    id: "the-elite-theme",
    title: "The Elite Theme",
    bpm: 140,
    key: "B minor",
    lane: "Premium energy",
    use: "Sports / sync / artist brief",
    description: "Big entrance energy with a clean theme feel for artists, sports cuts, and impact edits.",
    file: "assets/audio/previews/the-elite-theme-140bpm-bm-preview.m4a"
  },
  {
    id: "trenta-fried-chicken",
    title: "TRENTA FRIED CHICKEN",
    bpm: 130,
    key: "C minor",
    lane: "Producer signature",
    use: "Artist / brand cue",
    description: "High-character production with attitude, bounce, and a strong JoshYouWut identity signal.",
    file: "assets/audio/previews/trenta-fried-chicken-130bpm-cm-preview.m4a"
  },
  {
    id: "juggernaut",
    title: "Juggernaut",
    bpm: 135,
    key: "C# minor",
    lane: "Heavy impact",
    use: "Artist / sync inquiry",
    description: "Aggressive, placement-ready momentum for artists or briefs that need weight and movement.",
    file: "assets/audio/previews/juggernaut-135bpm-csharpm-preview.m4a"
  },
  {
    id: "i-made-this-for-jid",
    title: "I Made This For JID",
    bpm: 85,
    key: "D minor",
    lane: "Lyrical pocket",
    use: "Artist / rap record",
    description: "A precise pocket for technical writing, flow switches, and an artist who wants room to rap.",
    file: "assets/audio/previews/i-made-this-for-jid-85bpm-dm-preview.m4a"
  }
];

const beatGrid = document.querySelector("[data-beat-grid]");
const beatAudio = document.querySelector("[data-beat-audio]");
const currentTitle = document.querySelector("[data-current-title]");
const currentDescription = document.querySelector("[data-current-description]");
const currentBpm = document.querySelector("[data-current-bpm]");
const currentKey = document.querySelector("[data-current-key]");
const currentUse = document.querySelector("[data-current-use]");
const currentLane = document.querySelector("[data-current-lane]");
const currentInquiry = document.querySelector("[data-current-inquiry]");
const nextBeatButton = document.querySelector("[data-next-beat]");

let activeBeatIndex = 0;

const getInquiryHref = (beat) => {
  const subject = encodeURIComponent(`Beat licensing inquiry: ${beat.title}`);
  const body = encodeURIComponent(
    `Beat: ${beat.title}\nBPM: ${beat.bpm}\nKey: ${beat.key}\nUse: ${beat.use}\n\nProject notes:\n`
  );
  return `mailto:joshyouwut@gmail.com?subject=${subject}&body=${body}`;
};

const renderBeatCards = () => {
  if (!beatGrid) return;

  beatGrid.innerHTML = beats
    .map(
      (beat, index) => `
        <article class="store-card beat-card ${index === activeBeatIndex ? "is-active" : ""}" data-beat-card="${index}">
          <button class="beat-card-button" type="button" data-load-beat="${index}">
            <span class="play-icon" aria-hidden="true"></span>
            <span>
              <strong>${beat.title}</strong>
              <small>${beat.bpm} BPM · ${beat.key}</small>
            </span>
          </button>
          <p class="tag">${beat.lane}</p>
          <p>${beat.description}</p>
          <dl>
            <div><dt>BPM</dt><dd>${beat.bpm}</dd></div>
            <div><dt>Key</dt><dd>${beat.key}</dd></div>
            <div><dt>Use</dt><dd>${beat.use}</dd></div>
          </dl>
          <a href="${getInquiryHref(beat)}">Request licensing</a>
        </article>
      `
    )
    .join("");
};

const loadBeat = (index, shouldPlay = false) => {
  const beat = beats[index];
  if (!beat || !beatAudio) return;

  activeBeatIndex = index;
  currentTitle.textContent = beat.title;
  currentDescription.textContent = beat.description;
  currentBpm.textContent = beat.bpm;
  currentKey.textContent = beat.key;
  currentUse.textContent = beat.use;
  currentLane.textContent = beat.lane;
  currentInquiry.href = getInquiryHref(beat);

  if (beatAudio.getAttribute("src") !== beat.file) {
    beatAudio.src = beat.file;
    beatAudio.load();
  }

  renderBeatCards();

  if (shouldPlay) {
    beatAudio.play().catch(() => {});
  }
};

if (beatGrid && beatAudio) {
  renderBeatCards();
  loadBeat(0);

  beatGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-load-beat]");
    if (!button) return;
    loadBeat(Number(button.dataset.loadBeat), true);
  });

  nextBeatButton?.addEventListener("click", () => {
    const nextIndex = (activeBeatIndex + 1) % beats.length;
    loadBeat(nextIndex, true);
  });
}
