# JoshYouWut Design System

> Open Design-compatible brand contract for the JoshYouWut public site, beat store, player, licensing pages, product surfaces, and music-brand content.

## Visual Theme & Atmosphere
Producer-led Orlando music ecosystem with premium studio discipline. The brand should feel direct, clean, confident, and sales-ready without becoming corporate. It is for serious artists, managers, creators, and brands who need beats, custom production, mix help, and rights conversations handled like the record matters.

The visual energy should sit between boutique studio, record-label one-sheet, and modern commerce surface. Use black, cream, warm gold, coral, and mint as the core signal. Let the JYW logo carry weight. Avoid clutter, gimmicky music clichés, and generic playlist-card layouts.

## Color Palette & Roles
- **Ink:** `#101014` — primary text on light surfaces.
- **Coal:** `#19171B` — dark sections, premium panels, player shells.
- **Paper:** `#FBF8F0` — primary warm background.
- **Surface:** `#FFFDF7` — cards, forms, product areas.
- **Line:** `#DED9CF` — borders and input strokes.
- **Muted:** `#5F626D` — support text and metadata.
- **Gold:** `#D59B2F` — primary commerce/action accent.
- **Coral:** `#E35D45` — urgency, brand attitude, high-value labels.
- **Mint:** `#58B99F` — confirmation, availability, engineering/product freshness.
- **Data Blue:** `#4267B2` — SYNC, licensing, and catalog-detail moments, use sparingly.

Dark-mode sections should use coal/black with paper text. Light sections should use paper/surface with ink text. Gold is the main conversion accent; coral is the personality accent.

## Typography Rules
- **Display:** `Space Grotesk`, then Inter/system sans. Use for H1/H2, offer titles, player labels, product names.
- **Body/UI:** `Inter`, then system sans.
- **Logo text:** never recreate the logo in live text when the asset is available; use `assets/jyw-logo.svg`.
- **Display scale:** bold and compact, but never allow mobile clipping.
- **Body copy:** 16-18px, direct, practical, sales-aware.
- **Labels:** uppercase, 0.08em-0.12em tracking, short phrases only.

## Component Stylings
- **Buttons:** 8px radius, 2px coal border, bold label. Primary = coal fill on light surfaces or gold fill on dark surfaces. Secondary = transparent with visible border.
- **Cards:** 8px radius, 1px line border, warm surface fill. Use shadows only for hero/player/product emphasis.
- **Beat player:** dark shell, strong selected state, clear BPM/key/mood metadata, simple play/stop controls, and no hidden licensing ambiguity.
- **Offer cards:** lead with outcome and fit, then scope. Avoid price-first layouts unless Josh approves a public price.
- **Inquiry form:** decision-tree style with radio/checkbox choices. Capture useful lead info: offer interest, budget readiness, timeline, rights/use case, artist/brand info, and contact fields.
- **Inquiry forms:** use only when a buyer has questions, support needs, trust concerns, custom rights needs, artist packages, or SYNC briefs.
- **Logo use:** black square/black field with white logo is preferred. Do not distort, crop, recolor, or put the logo on low-contrast backgrounds.

## Layout Principles
- Keep the first viewport product-forward: logo, offer, player, or inquiry path should be visible quickly.
- Use full-width section bands, not nested cards.
- Keep commerce flows linear: hear/understand → choose path → submit inquiry.
- Beat and service surfaces should reduce doubt: rights, fit, next step, and contact expectations must be explicit.
- Public pages should never expose owner-only implementation notes, release gates, internal blockers, backend details, or unapproved checkout assumptions.

## Depth & Elevation
Use one strong hero/player elevation and mostly flat supporting cards. No glassy blur stacks, no floating decorative blobs, no generic gradient-heavy music UI. Texture can come from type, image, waveform-like rhythm, and restrained section contrast.

## Do's and Don'ts
- Do make the brand feel premium but reachable.
- Do make every offer explain who it is for, what problem it solves, and what happens after inquiry.
- Do keep JYW focused on beat licensing, artist packages, custom music, and SYNC.
- Do use the actual JYW logo asset.
- Do make rights/licensing language clear and non-legalistic.
- Don't imply checkout, instant downloads, or automated delivery unless that system is live and approved.
- Don't publish live payment links, refunds, or price changes without Josh approval.
- Don't bury the form after vague copy.
- Don't use generic "beats for everyone" language.

## Responsive Behavior
- **Desktop:** two-column hero/player layouts are acceptable; player and offers can sit side-by-side.
- **Tablet:** stack product and copy, keep controls thumb-friendly.
- **Mobile:** single-column, no horizontal overflow, hero headline and logo must fit, form radios must be easy to tap.

## Motion & Interaction
Use restrained hover/selected states for player tracks, offering cards, and form options. Motion should feel like studio equipment responding: crisp, quick, and useful. Respect reduced-motion preferences.

## Social Media Asset Standards
Use the same system across site, social, and video stills so every channel feels like the same producer brand.

### Shared Composition
- Use black or coal as the dominant field with paper/white type.
- Use gold for the main conversion/action signal and coral for attitude or urgency.
- Keep the JYW logo visible but not oversized; preferred placements are top-left or bottom-right.
- Use large uppercase display copy with short lines. Avoid paragraphs on image assets.
- Use one clear product/service lane per asset: beats, artist packages, custom production, or SYNC.
- Include useful metadata when the asset is music-facing: BPM, key, lane, price, or package scope.
- Keep safe margins at 7%-10% of the canvas edge for platform crops.
- Do not use owner-facing copy, backend notes, launch gates, placeholder language, or implementation status on public social assets.

### YouTube Banner
- Canvas: `2560x1440`.
- Safe center content: `1546x423`.
- Required: JYW logo, brand name, offer line, three commerce lanes.
- Keep the outer edges atmospheric; key text must live inside the safe center.

### Instagram Carousel
- Canvas per slide: `1080x1080`.
- Default set: three slides.
- Slide rhythm: hook -> offer proof -> action.
- Use a consistent bottom rail with slide count and brand mark.
- Each slide must stand alone when reposted outside the carousel.

### Threads Post
- Format: write a concise text post plus a square/portrait share card.
- Text should sound direct and buyer-facing, not corporate.
- Keep the first sentence strong enough to work without the image.

### YouTube Beat Video Template
- Still canvas: `1920x1080`.
- Use an existing instrumental preview as the audio bed.
- Required visual layers: logo, beat title, BPM/key, license CTA, restrained waveform/progress treatment.
- Export target can be `.webm` when MP4 tooling is unavailable; YouTube accepts WebM uploads.

## Agent Prompt Guide
When generating JoshYouWut artifacts:
- Start from `css/site.css` and `assets/jyw-logo.svg`.
- Preserve the black/cream/gold/coral/mint palette.
- Treat site copy as sales copy: specific, outcome-led, and lead-qualifying.
- Keep all backend, checkout, payment, lead storage, Google Drive, and outbound-send actions approval-gated.
- If a new asset is for approval, include a screenshot or visual preview.
