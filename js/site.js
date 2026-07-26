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
    lane: "Beat store catalog",
    use: "Artist licensing / custom brief",
    tags: ["artist", "rap"],
    description: "Dark, focused pocket with space for a serious lead vocal, sharp hook energy, and a clear licensing conversation.",
    file: "assets/audio/previews/unfuckwittable-100bpm-cmin-preview.m4a"
  },
  {
    id: "the-elite-theme",
    title: "The Elite Theme",
    bpm: 140,
    key: "B minor",
    lane: "Premium energy",
    use: "Sports / sync / artist brief",
    tags: ["artist", "sync"],
    description: "Big entrance energy with a clean theme feel for artists, sports edits, and placement-style briefs.",
    file: "assets/audio/previews/the-elite-theme-140bpm-bm-preview.m4a"
  },
  {
    id: "trenta-fried-chicken",
    title: "TRENTA FRIED CHICKEN",
    bpm: 130,
    key: "C minor",
    lane: "Producer signature",
    use: "Artist record / brand cue",
    tags: ["artist", "sync"],
    description: "High-character production with attitude, bounce, and a strong JoshYouWut identity signal for artists or branded moments.",
    file: "assets/audio/previews/trenta-fried-chicken-130bpm-cm-preview.m4a"
  },
  {
    id: "juggernaut",
    title: "Juggernaut",
    bpm: 135,
    key: "C# minor",
    lane: "Heavy impact",
    use: "Artist licensing / sync inquiry",
    tags: ["artist", "sync"],
    description: "Aggressive, placement-ready momentum for artists, sports energy, or briefs that need weight and movement.",
    file: "assets/audio/previews/juggernaut-135bpm-csharpm-preview.m4a"
  },
  {
    id: "i-made-this-for-jid",
    title: "I Made This For JID",
    bpm: 85,
    key: "D minor",
    lane: "Lyrical pocket",
    use: "Artist licensing / rap record",
    tags: ["artist", "rap"],
    description: "A precise pocket for technical writing, flow switches, and an artist who wants room to rap.",
    file: "assets/audio/previews/i-made-this-for-jid-85bpm-dm-preview.m4a"
  }
];

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
    note: "WAV plus available stems/trackouts for a serious single.",
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
const ymsExtraFields = document.querySelectorAll("[data-yms-extra-field]");
const ymsProductInterestInput = document.querySelector("[data-yms-product-interest]");
const ymsCustomerPriceInput = document.querySelector("[data-yms-customer-price]");
const submitLabel = document.querySelector("[data-submit-label]");

let activeBeatIndex = 0;
let activeBeatFilter = "all";

const buildBeatCheckoutAction = (beat, tierKey, variant = "card") => {
  const tier = beatLicenseTiers[tierKey];
  if (!tier) return "";
  const isPrimary = tierKey === "premium";
  const className = variant === "player" ? `button ${isPrimary ? "primary" : "secondary"}` : "beat-tier-link";
  const label = tier.live && tier.url ? `Buy ${tier.label} ${tier.price}` : `${tier.label} ${tier.price}`;

  if (tier.live && tier.url) {
    return `<a class="${className}" href="${tier.url}" target="_blank" rel="noopener" data-beat-checkout="${beat.id}" data-license-tier="${tierKey}">${label}</a>`;
  }

  const offering = tierKey === "exclusive" ? "custom" : "beat";
  const commerceLabel = `${beat.title} | ${tier.label} | ${tier.price}`;
  const actionLabel = tierKey === "exclusive" ? `Request ${tier.label}` : `Start ${tier.label} ${tier.price}`;
  return `<a class="${className}" href="#contact" data-offering="${offering}" data-beat-inquiry="${beat.index ?? activeBeatIndex}" data-commerce-label="${commerceLabel}" data-package-budget="${tier.budget}" data-license-tier="${tierKey}">${actionLabel}</a>`;
};

const buildBeatTierActions = (beat, variant = "card") => `
  <div class="beat-tier-actions ${variant === "player" ? "is-player" : ""}" aria-label="${beat.title} license options">
    ${buildBeatCheckoutAction(beat, "starter", variant)}
    ${buildBeatCheckoutAction(beat, "premium", variant)}
    ${buildBeatCheckoutAction(beat, "exclusive", variant)}
  </div>
`;

const offeringLabels = {
  beat: "One-off beat purchase",
  mix: "Mixing / mastering",
  custom: "Custom production",
  package: "Artist package purchase",
  sync: "SYNC licensing",
  yms: "Your Mix Sucks purchase interest",
  release: "Release / Apple Music update"
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
  if (summaryTitle) summaryTitle.textContent = title || "Artist package purchase";
  if (summaryDetail) {
    summaryDetail.textContent =
      detail || "Choose an offer above and the form will keep the package, beat, and budget range attached.";
  }
};

const updateRequiredState = (element, isRequired) => {
  const input = element.matches("input, select, textarea") ? element : element.querySelector("input, select, textarea");
  if (input) {
    input.required = isRequired;
  }
};

function updateFormContext(offering = "package") {
  const normalizedOffering = offering || "package";
  const isPlugin = normalizedOffering === "yms";
  const isYms = normalizedOffering === "yms";

  contextPanels.forEach((panel) => {
    const panelName = panel.dataset.contextPanel;
    panel.hidden = panelName !== normalizedOffering && !(normalizedOffering === "custom" && panelName === "beat");
  });

  projectFields.forEach((field) => {
    field.hidden = isPlugin;
    field.classList.toggle("is-hidden", isPlugin);
    updateRequiredState(field, !isPlugin && field.querySelector("[name='timeline'], [name='budget']"));
  });

  ymsExtraFields.forEach((field) => {
    field.hidden = isYms;
    field.classList.toggle("is-hidden", isYms);
    updateRequiredState(field, !isYms && field.querySelector("[name='goal']"));
  });

  if (ymsProductInterestInput) ymsProductInterestInput.value = isYms ? "Your Mix Sucks" : "";
  if (ymsCustomerPriceInput) ymsCustomerPriceInput.value = isYms ? "$59" : "";
  if (submitLabel) submitLabel.textContent = isYms ? "Start YMS purchase path" : "Send strong inquiry";

  if (formStatus) {
    formStatus.textContent = normalizedOffering === "yms"
      ? "Start the Your Mix Sucks purchase path for $59 one-time license updates, compatibility notes, and installer details."
      : "Send the details and JoshYouWut will follow up with the right next step.";
  }
}

const moveToLeadForm = (offering, beat, packageName = "", packageBudget = "", commerceLabel = "") => {
  selectOffering(offering);
  let summary = commerceLabel || offeringLabels[offering] || "JoshYouWut inquiry";
  let detail = "The selected path is attached to this inquiry.";

  if (selectedBeatInput && beat) {
    selectedBeatInput.value = `${beat.title} | ${beat.bpm} BPM | ${beat.key}`;
    summary = commerceLabel || `Beat license: ${beat.title}`;
    detail = `${beat.bpm} BPM · ${beat.key} · ${beat.use}`;
  } else if (selectedBeatInput && offering !== "beat") {
    selectedBeatInput.value = "";
  }
  if (selectedPackageInput) {
    selectedPackageInput.value = packageName || commerceLabel;
  }
  if (packageName) {
    summary = packageName.split("|").map((part) => part.trim()).filter(Boolean).slice(0, 2).join(" · ");
    detail = packageBudget ? `Budget range auto-filled: ${packageBudget}` : "Package inquiry selected.";
  }
  if (budgetSelect && packageBudget) {
    budgetSelect.value = packageBudget;
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

const renderBeatCards = () => {
  if (!beatGrid) return;

  const visibleBeats = beats
    .map((beat, index) => ({ ...beat, index }))
    .filter((beat) => activeBeatFilter === "all" || beat.tags.includes(activeBeatFilter));

  beatGrid.innerHTML = visibleBeats
    .map(
      (beat) => `
        <article class="store-card beat-card ${beat.index === activeBeatIndex ? "is-active" : ""}" data-beat-card="${beat.index}">
          <button class="beat-card-button" type="button" data-load-beat="${beat.index}">
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
          ${buildBeatTierActions(beat)}
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
  currentInquiry.href = "#contact";
  currentInquiry.dataset.beatInquiry = String(index);
  currentInquiry.dataset.commerceLabel = `${beat.title} | Premium Lease | ${beatLicenseTiers.premium.price}`;
  currentInquiry.dataset.packageBudget = beatLicenseTiers.premium.budget;
  const playerActions = document.querySelector(".beat-player-actions");
  const existingTierActions = playerActions?.querySelector(".beat-tier-actions");
  existingTierActions?.remove();
  playerActions?.insertAdjacentHTML("afterbegin", buildBeatTierActions({ ...beat, index }, "player"));
  if (selectedBeatInput && !selectedBeatInput.value) {
    selectedBeatInput.value = `${beat.title} | ${beat.bpm} BPM | ${beat.key}`;
  }

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

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-offering]");
  if (!link) return;

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

updateFormContext("package");

const initialOffering = new URLSearchParams(window.location.search).get("offering");
if (initialOffering && offeringLabels[initialOffering]) {
  selectOffering(initialOffering);
  if (window.location.hash === "#contact") {
    leadForm?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
