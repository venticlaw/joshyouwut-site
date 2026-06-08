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
- **Data Blue:** `#4267B2` — technical/plugin or sync detail, use sparingly.

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
- **Waitlists:** first name, email, and phone when product/plugin interest is involved.
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
- Do keep JYW and Your Mix Sucks related but visually distinct when needed.
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

## Agent Prompt Guide
When generating JoshYouWut artifacts:
- Start from `css/site.css` and `assets/jyw-logo.svg`.
- Preserve the black/cream/gold/coral/mint palette.
- Treat site copy as sales copy: specific, outcome-led, and lead-qualifying.
- Keep all backend, checkout, payment, lead storage, Google Drive, and outbound-send actions approval-gated.
- If a new asset is for approval, include a screenshot or visual preview.
