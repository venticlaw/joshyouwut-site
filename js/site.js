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

let beats = [];
const beatBpmLabel = (beat) => Number.isFinite(beat.bpm) ? `${beat.bpm} BPM` : "BPM not listed";
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const catalogUrl = new URL("../assets/data/beats.json", document.currentScript?.src || window.location.href);

const beatLicenseTiers = {
  starter: {
    label: "Starter Lease",
    price: "$29",
    budget: "Under $250",
    note: "MP3/WAV path for one release. No stems.",
    live: false,
    url: ""
  },
  premium: {
    label: "Premium Lease",
    price: "$79",
    budget: "Under $250",
    note: "MP3/WAV plus high-quality stems for a serious single. Stems delivered within 24 hours of successful payment. No separate request needed.",
    live: false,
    url: ""
  },
  exclusive: {
    label: "Exclusive Buyout",
    price: "From $500+",
    budget: "$500-$1,000",
    note: "Request-first rights conversation before exclusivity is reserved.",
    live: false,
    url: ""
  }
};

const packageOptions = {
  "launch-loadout": {
    label: "Music Launch Loadout",
    summary: "Music Launch Loadout · 1 Full Song",
    detail: "$900 sale price · $1,000 original",
    selectedPackage: "Music Launch Loadout | 1 Full Song | $900 sale / $1,000 original",
    budget: "$500-$1,000",
    price: "$900"
  },
  "elite-ep": {
    label: "Elite Exclusive Music Bundle",
    summary: "Elite Exclusive Music Bundle · 5 Full Songs",
    detail: "$3,500 sale price · $4,000 original",
    selectedPackage: "Elite Exclusive Music Bundle | 5 Full Songs | $3,500 sale / $4,000 original",
    budget: "$2,500-$5,000",
    price: "$3,500"
  },
  "all-inclusive": {
    label: "All-Inclusive Music Bundle",
    summary: "All-Inclusive Music Bundle · 10 Full Songs",
    detail: "$7,000 sale price · $7,500 original",
    selectedPackage: "All-Inclusive Music Bundle | 10 Full Songs | $7,000 sale / $7,500 original",
    budget: "$5,000-$10,000",
    price: "$7,000"
  }
};

const beatGrid = document.querySelector("[data-beat-grid]");
const beatFilterButtons = document.querySelectorAll("[data-beat-filter]");
const beatAudio = document.querySelector("[data-beat-audio]");
const currentTitle = document.querySelector("[data-current-title]");
const currentDescription = document.querySelector("[data-current-description]");
const currentBpm = document.querySelector("[data-current-bpm]");
const currentKey = document.querySelector("[data-current-key]");
const currentUse = document.querySelector("[data-current-use]");
const currentLane = document.querySelector("[data-current-lane]");
const currentInquiry = document.querySelector("[data-current-inquiry]");
const nextBeatButton = document.querySelector("[data-next-beat]");
const leadForm = document.querySelector("[data-lead-form]");
const selectedBeatInput = document.querySelector("[data-selected-beat]");
const selectedPackageInput = document.querySelector("[data-selected-package]");
const budgetSelect = document.querySelector("select[name='budget']");
const summaryTitle = document.querySelector("[data-summary-title]");
const summaryDetail = document.querySelector("[data-summary-detail]");
const leadIdInput = document.querySelector("[data-lead-id]");
const capturedAtInput = document.querySelector("[data-captured-at]");
const formStatus = document.querySelector("[data-form-status]");
const contextPanels = document.querySelectorAll("[data-context-panel]");
const projectFields = document.querySelectorAll("[data-context-field='project']");
const detailFields = document.querySelectorAll("[data-detail-field]");
const productInterestInput = document.querySelector("[data-product-interest]");
const customerPriceInput = document.querySelector("[data-customer-price]");
const submitLabel = document.querySelector("[data-submit-label]");
const commerceConfigUrl = new URL("../assets/commerce/checkout-config.json", document.currentScript?.src || window.location.href);
commerceConfigUrl.searchParams.set("v", "20260801-clean-storefront");
const commerceConfigPath = commerceConfigUrl.href;

let activeBeatIndex = -1;
let activeBeatFilter = "all";
let checkoutConfig = null;
let selectedPackageKey = "";

const contactHrefFor = (offering = "package") =>
  leadForm ? "#contact" : `contact.html?offering=${encodeURIComponent(offering)}#contact`;

const beatContactHref = (beat, tierKey) => {
  const params = new URLSearchParams({ offering: tierKey === "exclusive" ? "custom" : "beat", beat: beat.id, license: tierKey });
  return `contact.html?${params}#contact`;
};

const validBeatCheckoutUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && /^[a-z0-9-]+\.lemonsqueezy\.com$/i.test(url.hostname) &&
      !url.username && !url.password && url.pathname.startsWith("/checkout/") ? url.href : "";
  } catch { return ""; }
};

const buildBeatCheckoutAction = (beat, tierKey, variant = "card") => {
  const tier = beatLicenseTiers[tierKey];
  if (!tier) return "";
  const isPrimary = tierKey === "premium";
  const className = variant === "player" ? `button ${isPrimary ? "primary" : "secondary"}` : "beat-tier-link";
  const checkoutUrl = validBeatCheckoutUrl(tier.urlsByBeat?.[beat.id]);
  const hasLiveCheckout = tierKey === "starter" && tier.live && checkoutUrl;
  const label = hasLiveCheckout ? `Buy ${tier.label} ${tier.price}` : `${tier.label} ${tier.price}`;

  if (hasLiveCheckout) {
    return `<a class="${className}" href="${escapeHtml(checkoutUrl)}" target="_blank" rel="noopener" data-beat-checkout="${escapeHtml(beat.id)}" data-license-tier="${tierKey}">${escapeHtml(label)}</a>`;
  }

  const offering = tierKey === "exclusive" ? "custom" : "beat";
  const commerceLabel = `${beat.title} | ${tier.label} | ${tier.price}`;
  const actionLabel = `Inquire: ${tier.label} ${tier.price}`;
  return `<a class="${className}" href="${escapeHtml(beatContactHref(beat, tierKey))}" data-offering="${offering}" data-beat-inquiry="${beat.index ?? activeBeatIndex}" data-commerce-label="${escapeHtml(commerceLabel)}" data-package-budget="${escapeHtml(tier.budget)}" data-license-tier="${tierKey}">${escapeHtml(actionLabel)}</a>`;
};

const buildBeatTierActions = (beat, variant = "card") => `
  <div class="beat-tier-actions ${variant === "player" ? "is-player" : ""}" aria-label="${escapeHtml(beat.title)} license options">
    ${buildBeatCheckoutAction(beat, "starter", variant)}
    ${buildBeatCheckoutAction(beat, "premium", variant)}
    ${buildBeatCheckoutAction(beat, "exclusive", variant)}
  </div>
`;

const offeringLabels = {
  beat: "Beat question before buying",
  mix: "Mixing / mastering question",
  custom: "Exclusive or custom request",
  package: "Question before buying",
  sync: "SYNC licensing",
  release: "Trust / proof question"
};

const selectOffering = (offering = "package") => {
  document.querySelectorAll(".radio-card.was-selected").forEach((card) => card.classList.remove("was-selected"));
  const radio = document.querySelector(`[data-offering-radio="${offering}"]`);
  if (radio) {
    radio.checked = true;
    radio.closest(".radio-card")?.classList.add("was-selected");
  }
  updateFormContext(offering);
};

const setSelectionSummary = (title, detail) => {
  if (summaryTitle) summaryTitle.textContent = title || "Question before buying";
  if (summaryDetail) {
    summaryDetail.textContent =
      detail || "Use the form when you need clarity, support, or a human follow-up before moving forward.";
  }
};

const updateRequiredState = (element, isRequired) => {
  const input = element.matches("input, select, textarea") ? element : element.querySelector("input, select, textarea");
  if (input) {
    input.required = isRequired;
  }
};

function updateFormContext(offering = "package") {
  const normalizedOffering = offeringLabels[offering] ? offering : "package";
  const isPackage = normalizedOffering === "package";

  contextPanels.forEach((panel) => {
    const panelName = panel.dataset.contextPanel;
    panel.hidden = panelName !== normalizedOffering && !(normalizedOffering === "custom" && panelName === "beat");
  });

  projectFields.forEach((field) => {
    const isBudgetField = Boolean(field.querySelector("[name='budget']"));
    const shouldHide = isPackage && isBudgetField;
    field.hidden = shouldHide;
    field.classList.toggle("is-hidden", shouldHide);
    updateRequiredState(field, !shouldHide && field.querySelector("[name='timeline'], [name='budget']"));
  });

  detailFields.forEach((field) => {
    field.hidden = false;
    field.classList.remove("is-hidden");
    updateRequiredState(field, Boolean(field.querySelector("[name='goal']")));
  });

  const selectedPackage = selectedPackageKey ? packageOptions[selectedPackageKey] : null;

  if (productInterestInput) {
    productInterestInput.value = selectedPackage ? selectedPackage.label : "";
  }
  if (customerPriceInput) customerPriceInput.value = selectedPackage ? selectedPackage.price : "";
  if (submitLabel) {
    submitLabel.textContent = "Contact Josh";
  }

  if (formStatus) {
    formStatus.textContent =
      selectedPackage
        ? `${selectedPackage.label} is selected. Ask the question that would make you comfortable moving forward.`
        : "Send the question, trust concern, rights need, order issue, or custom brief. The clearer you are, the faster this moves.";
  }
}

const moveToLeadForm = (offering, beat, packageName = "", packageBudget = "", commerceLabel = "") => {
  if (offering === "package") {
    const matchedPackage = Object.entries(packageOptions).find(([, option]) =>
      packageName.includes(option.label) || commerceLabel.includes(option.label)
    );
    selectedPackageKey = matchedPackage?.[0] || selectedPackageKey;
  } else {
    selectedPackageKey = "";
  }
  selectOffering(offering);
  const packageOption = selectedPackageKey ? packageOptions[selectedPackageKey] : null;
  let summary = commerceLabel || offeringLabels[offering] || "JoshYouWut inquiry";
  let detail = "Tell us what would help you feel clear enough to move.";

  if (selectedBeatInput && beat) {
    selectedBeatInput.value = `${beat.title} | ${beatBpmLabel(beat)} | ${beat.key}`;
    summary = commerceLabel || `Beat license: ${beat.title}`;
    detail = `${beatBpmLabel(beat)} · ${beat.key} · ${beat.use}`;
  } else if (selectedBeatInput && offering !== "beat") {
    selectedBeatInput.value = "";
  }
  if (selectedPackageInput) {
    selectedPackageInput.value = packageOption?.selectedPackage || packageName || commerceLabel;
  }
  if (packageOption || packageName) {
    summary = packageOption?.summary || packageName.split("|").map((part) => part.trim()).filter(Boolean).slice(0, 2).join(" · ");
    detail = packageOption ? `${packageOption.detail} · Ask the question before you commit.` : "Ask the question before you commit.";
  }
  if (budgetSelect) {
    budgetSelect.value = packageOption?.budget || packageBudget || budgetSelect.value;
  }
  setSelectionSummary(summary, detail);
  leadForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => {
    leadForm?.querySelector("input[name='first_name']")?.focus({ preventScroll: true });
  }, 450);
};

const createLeadId = () => {
  const randomPart =
    window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `jyw_${randomPart}`;
};

const queryInput = document.querySelector("[data-beat-query]");
const genreInput = document.querySelector("[data-beat-genre]");
const bpmMinInput = document.querySelector("[data-bpm-min]");
const bpmMaxInput = document.querySelector("[data-bpm-max]");
const playState = document.querySelector("[data-play-state]");
const catalogMessage = document.querySelector("[data-catalog-message]");
const catalogRetry = document.querySelector("[data-catalog-retry]");
const previousBeatButton = document.querySelector("[data-previous-beat]");
const repeatBeat = document.querySelector("[data-repeat-beat]");
const autoAdvance = document.querySelector("[data-auto-advance]");
let catalogState = "loading";

const visibleBeatEntries = () => beats.map((beat, index) => ({ ...beat, index })).filter((beat) => {
  const query = queryInput?.value.trim().toLowerCase() || "";
  const genre = genreInput?.value || activeBeatFilter;
  return (genre === "all" || beat.genres?.includes(genre) || beat.tags.includes(genre)) &&
    (!bpmMinInput?.value || (Number.isFinite(beat.bpm) && beat.bpm >= Number(bpmMinInput.value))) &&
    (!bpmMaxInput?.value || (Number.isFinite(beat.bpm) && beat.bpm <= Number(bpmMaxInput.value))) &&
    [beat.title, beat.lane, beat.use, beat.description, ...beat.tags, ...(beat.genres || [])].join(" ").toLowerCase().includes(query);
});

const renderBeatCards = () => {
  if (!beatGrid) return;
  const visibleBeats = visibleBeatEntries();
  const count = document.querySelector("[data-beat-count]");
  if (count) count.textContent = catalogState === "ready" ? `${visibleBeats.length} of ${beats.length} previews` : "";
  if (catalogMessage && catalogState === "ready") catalogMessage.textContent = !beats.length ? "No published beats yet." :
    !visibleBeats.length ? "No beats match these filters. Try another search or clear the filters." : "";
  [previousBeatButton, nextBeatButton].forEach((button) => { if (button) button.disabled = !visibleBeats.length; });

  beatGrid.innerHTML = visibleBeats
    .map(
      (beat) => `
        <article class="store-card beat-card track-row ${beat.index === activeBeatIndex ? "is-active" : ""}" data-beat-card="${beat.index}">
          <button class="beat-card-button" type="button" data-load-beat="${beat.index}" aria-label="${beat.index === activeBeatIndex && !beatAudio?.paused ? "Pause" : "Play"} ${escapeHtml(beat.title)}" ${beat.index === activeBeatIndex ? 'aria-current="true"' : ""}>
            <span class="play-icon" aria-hidden="true"></span>
            <span>
              <strong>${escapeHtml(beat.title)}</strong>
              <small>${escapeHtml(beatBpmLabel(beat))} · ${escapeHtml(beat.key)}${beat.index === activeBeatIndex ? (beatAudio?.paused ? " · Selected" : " · Playing") : ""}</small>
            </span>
          </button>
          ${Number.isFinite(beat.featured_order) ? '<span class="beat-featured">Featured</span>' : ""}
          <span class="track-genre">${escapeHtml(beat.lane)}</span>
          <button class="button secondary track-license" type="button" data-open-license="${beat.index}" aria-label="Choose a license for ${escapeHtml(beat.title)}">License <span>${escapeHtml(beatLicenseTiers.starter.price)}</span></button>
        </article>
      `
    )
    .join("");
};

const renderPlayerActions = () => {
  const actions = document.querySelector(".beat-player-actions");
  const beat = beats[activeBeatIndex];
  if (!actions || !beat) return;
  let button = actions.querySelector("[data-open-license]");
  if (!button) {
    button = document.createElement("button");
    button.className = "button primary";
    button.type = "button";
    actions.append(button);
  }
  button.dataset.openLicense = String(activeBeatIndex);
  button.textContent = `Get this beat ${beatLicenseTiers.starter.price}`;
};

const updateBeatSelection = () => {
  beatGrid?.querySelectorAll("[data-load-beat]").forEach((button) => {
    const index = Number(button.dataset.loadBeat);
    const beat = beats[index];
    const selected = index === activeBeatIndex;
    button.closest("[data-beat-card]").classList.toggle("is-active", selected);
    if (selected) button.setAttribute("aria-current", "true"); else button.removeAttribute("aria-current");
    button.setAttribute("aria-label", `${selected && !beatAudio.paused ? "Pause" : "Play"} ${beat.title}`);
    button.querySelector("small").textContent = `${beatBpmLabel(beat)} · ${beat.key}${selected ? (beatAudio.paused ? " · Selected" : " · Playing") : ""}`;
  });
};

const licenseDialog = document.querySelector("[data-license-dialog]");
const openBeatLicense = (index) => {
  const beat = beats[index];
  if (!beat || !licenseDialog) return;
  const focusedTier = licenseDialog.contains(document.activeElement) ? document.activeElement.dataset.licenseTier : null;
  licenseDialog.dataset.beatIndex = String(index);
  document.querySelector("[data-license-title]").textContent = beat.title;
  const live = beatLicenseTiers.starter.live && validBeatCheckoutUrl(beatLicenseTiers.starter.urlsByBeat?.[beat.id]);
  document.querySelector("[data-license-status]").textContent = live ? "Choose Starter to continue to secure checkout." : "To arrange your license, send Josh the selected beat and tier below.";
  licenseDialog.querySelector(".license-dialog-actions").innerHTML = [
    ["starter", "One non-exclusive song release. MP3/WAV. No stems."],
    ["premium", "MP3/WAV plus high-quality stems delivered within 24 hours of successful payment. No separate request needed."],
    ["exclusive", "Discuss exclusive rights, publishing and custom terms."]
  ].map(([key, detail]) => `<section class="license-option"><h3>${escapeHtml(beatLicenseTiers[key].label)}</h3><p>${escapeHtml(detail)}</p>${buildBeatCheckoutAction({...beat,index}, key, "player")}</section>`).join("");
  if (!licenseDialog.open) licenseDialog.showModal();
  if (["starter", "premium", "exclusive"].includes(focusedTier)) licenseDialog.querySelector(`[data-license-tier="${focusedTier}"]`)?.focus();
};
document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-open-license]");
  if (trigger) openBeatLicense(Number(trigger.dataset.openLicense));
});
document.querySelector("[data-license-close]")?.addEventListener("click", () => licenseDialog?.close());
document.querySelector("a[href='#licensing']")?.addEventListener("click", () => {
  const guide = document.querySelector("[data-license-guide]");
  if (guide) guide.open = true;
});

const playSelectedBeat = () => {
  if (beatAudio?.error) beatAudio.load();
  return beatAudio?.play().catch((error) => {
  if (error.name !== "AbortError" && playState) playState.textContent = "Preview could not play. Use the audio controls to retry or choose another beat.";
  });
};

const loadBeat = (index, shouldPlay = false) => {
  const beat = beats[index];
  if (!beat || !beatAudio) return;

  activeBeatIndex = index;
  beatAudio.dataset.beatId = beat.id;
  beatAudio.dataset.previewDuration = String(beat.duration_seconds || 60);
  if (playState) playState.textContent = `Ready: ${beat.title}`;
  currentTitle.textContent = beat.title;
  currentTitle.title = beat.title;
  currentDescription.textContent = beat.description;
  currentBpm.textContent = Number.isFinite(beat.bpm) ? beat.bpm : "Not listed";
  currentKey.textContent = beat.key;
  currentUse.textContent = beat.use;
  currentLane.textContent = beat.lane;
  if (currentInquiry) {
    currentInquiry.href = contactHrefFor("beat");
    currentInquiry.dataset.beatInquiry = String(index);
    currentInquiry.dataset.commerceLabel = `${beat.title} | Premium Lease | ${beatLicenseTiers.premium.price}`;
    currentInquiry.dataset.packageBudget = beatLicenseTiers.premium.budget;
  }
  renderPlayerActions();
  if (selectedBeatInput && !selectedBeatInput.value) {
    selectedBeatInput.value = `${beat.title} | ${beatBpmLabel(beat)} | ${beat.key}`;
  }

  if (beatAudio.getAttribute("src") !== beat.file) {
    beatAudio.src = beat.file;
    beatAudio.load();
  }

  updateBeatSelection();
  document.dispatchEvent(new CustomEvent("jyw:beat-selected", {detail: {id:beat.id,title:beat.title}}));

  if (shouldPlay) {
    playSelectedBeat();
  }
};

const stepBeat = (direction, shouldPlay = true) => {
  const visible = visibleBeatEntries();
  if (!visible.length) return;
  const position = visible.findIndex((beat) => beat.index === activeBeatIndex);
  const next = position < 0 ? (direction > 0 ? 0 : visible.length - 1) : (position + direction + visible.length) % visible.length;
  loadBeat(visible[next].index, shouldPlay);
};

const restoreBeatInquiry = () => {
  if (!leadForm) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("beat");
  if (!id) return;
  const tierKey = params.get("license") || params.get("tier") || "starter";
  const beat = beats.find((entry) => entry.id === id);
  const tier = beatLicenseTiers[tierKey];
  if (beat && tier) {
    moveToLeadForm(tierKey === "exclusive" ? "custom" : "beat", beat, "", tier.budget, `${beat.title} | ${tier.label} | ${tier.price}`);
  } else if (id) {
    setSelectionSummary("Beat unavailable", "This beat is not currently in the published catalog. Ask Josh about availability.");
  }
};

const fetchBeatCatalog = async () => {
  catalogState = "loading";
  if (beatGrid) beatGrid.setAttribute("aria-busy", "true");
  if (catalogMessage) catalogMessage.textContent = "Loading beats...";
  if (catalogRetry) catalogRetry.hidden = true;
  renderBeatCards();
  try {
    const response = await fetch(catalogUrl.href, { cache: "no-store" });
    if (!response.ok) throw new Error("Catalog unavailable");
    const catalog = await response.json();
    if (!catalog || !Object.hasOwn(catalog, "version") || !Array.isArray(catalog.beats)) throw new Error("Invalid catalog");
    const ids = new Map();
    catalog.beats.filter((beat) => beat?.published === true).forEach((beat) => {
      ids.set(beat.id, (ids.get(beat.id) || 0) + 1);
    });
    beats = catalog.beats.filter((beat) => {
      if (beat?.published !== true) return false;
      if (!["id", "title", "key", "lane", "use", "description", "file"].every((key) => typeof beat[key] === "string" && beat[key].trim()) ||
          !(beat.bpm === null || (Number.isFinite(beat.bpm) && beat.bpm > 0)) || !Array.isArray(beat.tags) || !beat.tags.every((tag) => typeof tag === "string") || ids.get(beat.id) !== 1 ||
          (beat.genres !== undefined && (!Array.isArray(beat.genres) || !beat.genres.every((genre) => typeof genre === "string")))) return false;
      let pageFile;
      try { pageFile = new URL(beat.file, window.location.href); } catch { return false; }
      const previewRoot = new URL("assets/audio/previews/", window.location.href);
      if (pageFile.origin !== window.location.origin || !["http:", "https:"].includes(pageFile.protocol) ||
          !beat.file.startsWith("assets/audio/previews/") || !pageFile.pathname.startsWith(previewRoot.pathname)) return false;
      return true;
    }).sort((a, b) => {
      const rankA = Number.isFinite(a.featured_order) ? a.featured_order : Infinity;
      const rankB = Number.isFinite(b.featured_order) ? b.featured_order : Infinity;
      return rankA - rankB || a.title.localeCompare(b.title);
    });
    catalogState = "ready";
    if (genreInput) {
      const selected = genreInput.value;
      genreInput.replaceChildren(new Option("All genres", "all"), ...[...new Set(beats.flatMap((beat) => beat.genres || beat.tags))].sort().map((tag) => new Option(tag, tag)));
      if ([...genreInput.options].some((option) => option.value === selected)) genreInput.value = selected;
    }
    const deepLink = new URLSearchParams(window.location.search).get("beat");
    const initialIndex = beats.findIndex((beat) => beat.id === deepLink);
    if (beatGrid && beatAudio && beats.length) loadBeat(initialIndex >= 0 ? initialIndex : 0);
    if (deepLink && initialIndex < 0 && playState) playState.textContent = "Requested beat is unavailable. Choose another preview.";
    renderBeatCards();
    restoreBeatInquiry();
  } catch {
    catalogState = "error";
    if (catalogMessage) catalogMessage.textContent = "The beat catalog could not load. Please retry.";
    if (playState) playState.textContent = "Catalog unavailable.";
    if (catalogRetry) catalogRetry.hidden = false;
    if (leadForm && new URLSearchParams(window.location.search).has("beat")) {
      setSelectionSummary("Beat details could not load", "Your selection is still in this page address. Reload to retry, or include the beat ID in your question.");
    }
  } finally {
    if (beatGrid) beatGrid.setAttribute("aria-busy", "false");
  }
};

if (beatGrid && beatAudio) {

  beatGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-load-beat]");
    if (!button) return;
    const index = Number(button.dataset.loadBeat);
    if (index === activeBeatIndex) {
      if (beatAudio.paused) playSelectedBeat(); else beatAudio.pause();
    } else loadBeat(index, true);
  });

  nextBeatButton?.addEventListener("click", () => {
    stepBeat(1);
  });
  document.querySelector("[data-player-toggle]")?.addEventListener("click", () => {
    if (beatAudio.paused) playSelectedBeat(); else beatAudio.pause();
  });
  previousBeatButton?.addEventListener("click", () => stepBeat(-1));
  beatAudio.addEventListener("ended", () => {
    if (repeatBeat?.checked) { beatAudio.currentTime = 0; playSelectedBeat(); }
    else if (autoAdvance?.checked) stepBeat(1);
    else if (playState) playState.textContent = `Finished: ${beats[activeBeatIndex]?.title || "Preview"}`;
  });
  ["play", "playing", "pause", "waiting"].forEach((type) => beatAudio.addEventListener(type, () => {
    if (playState) playState.textContent = `${type === "play" || type === "playing" ? "Playing" : type === "waiting" ? "Buffering" : "Paused"}: ${beats[activeBeatIndex]?.title || "Preview"}`;
    // Update play labels without replacing the focused catalog button.
    updateBeatSelection();
  }));
  beatAudio.addEventListener("error", () => { if (playState) playState.textContent = "Preview unavailable. Choose another beat or retry with the audio controls."; });
  document.querySelector("[data-beat-search]")?.addEventListener("submit", (event) => event.preventDefault());
  document.querySelector("[data-beat-search]")?.addEventListener("reset", () => setTimeout(renderBeatCards, 0));
  [queryInput, genreInput, bpmMinInput, bpmMaxInput].forEach((input) => input?.addEventListener("input", renderBeatCards));
  catalogRetry?.addEventListener("click", fetchBeatCatalog);

  beatFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeBeatFilter = button.dataset.beatFilter || "all";
      beatFilterButtons.forEach((filterButton) => {
        filterButton.classList.toggle("is-active", filterButton === button);
      });
      renderBeatCards();
    });
  });
}

if (beatGrid || leadForm) fetchBeatCatalog();

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-offering]");
  if (!link) return;
  if (!leadForm) return;
  if (link.dataset.checkoutActive === "true") return;

  const offering = link.dataset.offering;
  const beatIndex = link.dataset.beatInquiry;
  const packageName = link.dataset.packageInquiry || "";
  const packageBudget = link.dataset.packageBudget || "";
  const commerceLabel = link.dataset.commerceLabel || "";
  const beat = typeof beatIndex === "string" ? beats[Number(beatIndex)] : offering === "beat" ? beats[activeBeatIndex] : null;

  event.preventDefault();
  moveToLeadForm(offering, beat, packageName, packageBudget, commerceLabel);
});

leadForm?.addEventListener("change", (event) => {
  if (event.target.matches("[data-offering-radio]")) {
    if (event.target.dataset.offeringRadio !== "package") {
      selectedPackageKey = "";
      if (selectedPackageInput) selectedPackageInput.value = "";
    }
    document.querySelectorAll(".radio-card.was-selected").forEach((card) => card.classList.remove("was-selected"));
    event.target.closest(".radio-card")?.classList.add("was-selected");
    updateFormContext(event.target.dataset.offeringRadio);
  }
});

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!leadForm.reportValidity()) return;

  const capturedAt = new Date().toISOString();
  const leadId = createLeadId();
  if (leadIdInput) leadIdInput.value = leadId;
  if (capturedAtInput) capturedAtInput.value = capturedAt;

  const formData = new FormData(leadForm);
  const payload = Object.fromEntries(formData.entries());
  const offering = formData.get("offering") || "General inquiry";
  const selectedBeat = formData.get("selected_beat") || "None selected";
  const selectedPackage = formData.get("selected_package") || "None selected";
  const formspreeEndpoint = leadForm.dataset.formspreeEndpoint?.trim();
  const localMirrorEndpoint = leadForm.dataset.localMirrorEndpoint?.trim();
  const fallbackEmail = leadForm.dataset.fallbackEmail || "support@joshyouwut.com";
  const brand = leadForm.dataset.brand || "JoshYouWut";
  const normalizedPayload = {
    lead_id: leadId,
    captured_at: capturedAt,
    source_site: brand,
    source_url: window.location.href,
    offering: String(offering),
    selected_beat: String(selectedBeat),
    selected_package: String(selectedPackage),
    product_interest: payload.product_interest || "",
    customer_price: payload.customer_price || "",
    first_name: payload.first_name || "",
    email: payload.email || "",
    artist_or_company: payload.artist || "",
    phone_number: payload.phone || "",
    social_or_website: payload.social || "",
    timeline: payload.timeline || "",
    budget_range: payload.budget || "",
    links: payload.links || "",
    goal: payload.goal || "",
    existing_files_or_decisions: payload.assets || "",
    raw_message: payload.goal || "",
    ingestion_method: formspreeEndpoint ? "provider_import" : "static_form_mailto",
    status: "new",
    notes: ""
  };
  const subject = encodeURIComponent(`JoshYouWut inquiry: ${offering}`);
  const body = encodeURIComponent(
    [
      "JoshYouWut lead inquiry",
      "",
      `Lead ID: ${leadId}`,
      `Captured at: ${capturedAt}`,
      `Offering: ${offering}`,
      `Selected beat: ${selectedBeat}`,
      `Selected package: ${selectedPackage}`,
      `Product interest: ${formData.get("product_interest") || ""}`,
      `Customer price: ${formData.get("customer_price") || ""}`,
      `First name: ${formData.get("first_name") || ""}`,
      `Email: ${formData.get("email") || ""}`,
      `Artist / company: ${formData.get("artist") || ""}`,
      `Phone number: ${formData.get("phone") || ""}`,
      `Social or website: ${formData.get("social") || ""}`,
      `Timeline: ${formData.get("timeline") || ""}`,
      `Budget range: ${formData.get("budget") || ""}`,
      `Links: ${formData.get("links") || ""}`,
      "",
      "Goal:",
      formData.get("goal") || "",
      "",
      "Existing files / decisions:",
      formData.get("assets") || "",
      "",
      "Source: JoshYouWut.com lead form"
    ].join("\n")
  );

  const submitButton = leadForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  if (formStatus) {
    formStatus.textContent = "Sending inquiry...";
  }

  const mirrorLead = () => {
    if (!localMirrorEndpoint) return Promise.resolve();
    return fetch(localMirrorEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedPayload)
    }).catch(() => {});
  };

  const submitLead = async () => {
    if (formspreeEndpoint) {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: new FormData(leadForm)
      });

      if (!response.ok) {
        throw new Error("Form endpoint rejected the submission.");
      }

      await mirrorLead();
      leadForm.reset();
      document.querySelectorAll(".radio-card.was-selected").forEach((card) => card.classList.remove("was-selected"));
      if (selectedBeatInput) selectedBeatInput.value = "";
      if (formStatus) {
        formStatus.textContent = "Inquiry sent. Josh has the details needed to follow up.";
      }
      return;
    }

    await mirrorLead();
    window.location.href = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;
    if (formStatus) {
      formStatus.textContent = "Opening your email app with the inquiry details.";
    }
  };

  submitLead()
    .catch(() => {
      window.location.href = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;
      if (formStatus) {
        formStatus.textContent = "Opening your email app with the inquiry details.";
      }
    })
    .finally(() => {
      submitButton.disabled = false;
    });
});

const searchParams = new URLSearchParams(window.location.search);
const initialOffering = searchParams.get("offering");
const initialPackageKey = searchParams.get("package");

if (initialPackageKey && packageOptions[initialPackageKey]) {
  selectedPackageKey = initialPackageKey;
}

updateFormContext("package");

if (initialOffering && offeringLabels[initialOffering]) {
  selectOffering(initialOffering);
  const initialPackage = selectedPackageKey ? packageOptions[selectedPackageKey] : null;
  if (initialOffering === "package" && initialPackage) {
    if (selectedPackageInput) selectedPackageInput.value = initialPackage.selectedPackage;
    if (budgetSelect) budgetSelect.value = initialPackage.budget;
    setSelectionSummary(initialPackage.summary, initialPackage.detail);
  }
  if (window.location.hash === "#contact") {
    leadForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

const getCheckoutProduct = (productKey) => checkoutConfig?.products?.[productKey] || null;

const canUseCheckout = (product) =>
  Boolean(checkoutConfig?.public_active && product?.checkout_url && /^https:\/\/.+\.lemonsqueezy\.com\//.test(product.checkout_url));

const validLemonUrlsByKey = (urlsByKey = {}) =>
  Object.fromEntries(
    Object.entries(urlsByKey).filter(([, url]) => /^https:\/\/.+\.lemonsqueezy\.com\//.test(String(url)))
  );

const applyDirectCheckoutLink = (link, productKey) => {
  const product = getCheckoutProduct(productKey);
  if (!product) return;

  const active = canUseCheckout(product);
  const fallbackOffering = product.fallback_offering || link.dataset.offering || "package";
  const label = active ? `Buy ${product.name} ${product.price}` : link.dataset.inactiveLabel || `${checkoutConfig?.inactive_label || "Buy now"} ${product.price}`;

  if (!active && link.dataset.hideWhenInactive === "true") {
    link.hidden = true;
    link.dataset.checkoutActive = "false";
    return;
  }

  link.hidden = false;
  link.textContent = label.trim();
  link.dataset.checkoutActive = String(active);

  if (active) {
    link.href = product.checkout_url;
    link.target = "_blank";
    link.rel = "noopener";
    link.removeAttribute("data-offering");
    return;
  }

  link.href = link.dataset.fallbackHref || contactHrefFor(fallbackOffering);
  link.removeAttribute("target");
  link.removeAttribute("rel");
  link.dataset.offering = fallbackOffering;
};

const applyCheckoutConfig = () => {
  document.querySelectorAll("[data-checkout-product]").forEach((link) => {
    applyDirectCheckoutLink(link, link.dataset.checkoutProduct);
  });

  const starter = getCheckoutProduct("beat_starter");
  const premium = getCheckoutProduct("beat_premium");

  if (starter) {
    beatLicenseTiers.starter.price = starter.price || beatLicenseTiers.starter.price;
    beatLicenseTiers.starter.urlsByBeat = validLemonUrlsByKey(starter.checkout_urls_by_beat || {});
    beatLicenseTiers.starter.live = checkoutConfig?.public_active === true && starter.live === true && starter.verified === true;
  } else {
    beatLicenseTiers.starter.live = false;
    beatLicenseTiers.starter.urlsByBeat = {};
  }

  if (premium) {
    beatLicenseTiers.premium.price = premium.price || beatLicenseTiers.premium.price;
    beatLicenseTiers.premium.live = false;
  }

  if (beatGrid && beatAudio) {
    beatGrid.querySelectorAll(".track-license span").forEach((price) => { price.textContent = beatLicenseTiers.starter.price; });
    renderPlayerActions();
    if (licenseDialog?.open) openBeatLicense(Number(licenseDialog.dataset.beatIndex));
  }
};

fetch(commerceConfigPath, { cache: "no-store" })
  .then((response) => (response.ok ? response.json() : null))
  .then((config) => {
    if (!config) return;
    checkoutConfig = config;
    applyCheckoutConfig();
  })
  .catch(() => {});
