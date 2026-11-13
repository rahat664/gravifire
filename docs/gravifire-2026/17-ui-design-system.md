# GRAVIFIRE UI design system — phase 1

## Intent and scope

This phase introduces a restrained spacecraft research-operations visual language on the global navigation, Home (`/`) and science dashboard (`/dashboard`). It uses existing Next.js, Tailwind and Geist font assets. No UI framework or dependency was added. Research records, scientific calculations, applicability verdicts, ranking weights, evidence contracts, game rendering and campaign behavior are unchanged.

The Vesta 2038 setting is identified as a fictional campaign. NASA source evidence remains separate and source-linked; the UI does not imply NASA endorsement.

## Tokens

Tokens are declared in `src/app/globals.css` under `:root`.

| Token | Value | Use |
|---|---|---|
| `--gf-space-0` | `#070c12` | Page background |
| `--gf-space-1` | `#0b121a` | Raised navigation and panels |
| `--gf-space-2` | `#101b24` | Secondary instrument surface |
| `--gf-space-3` | `#15232d` | Higher-elevation surface |
| `--gf-border` | `rgba(160, 190, 200, .16)` | Quiet separators |
| `--gf-border-strong` | `rgba(119, 201, 214, .34)` | Active or emphasized panel boundary |
| `--gf-text` | `#edf4f6` | Primary text |
| `--gf-text-secondary` | `#b3c1c8` | Body and explanatory copy |
| `--gf-text-muted` | `#91a2aa` | Supporting metadata |
| `--gf-cyan` | `#74d5e3` | Interactive/action emphasis |
| `--gf-amber` | `#edbd79` | Evidence limits and caution |
| `--gf-green` | `#91d5b2` | Verified/status indication |
| `--gf-red` | `#ee8d87` | Critical/mismatch state |
| `--gf-radius` | `10px` | Standard research panel rounding |
| `--gf-panel-shadow` | low-opacity `0 18px 44px` | Panel separation |

The shell uses Geist Sans for interface copy and Geist Mono for short technical labels and measured values. Dashboard text previously rendered at 9–11 px is raised to 12 px; primary body copy remains 14–16 px or larger. Technical labels are uppercase only when short. Color is accompanied by explicit text labels.

## Layout and component rules

- **Navigation:** 68 px desktop command bar; compact 62 px mobile bar. Desktop exposes all five primary destinations and `aria-current="page"`. Mobile uses a native `details`/`summary` disclosure with five keyboard-operable routes and closes after selection. Mission Control remains a distinct destination. Game routes that hide the global navigation continue to use their existing body class behavior.
- **Home:** a two-column research-command hero on wide viewports and a single-column flow on mobile; compact status/capability telemetry; two evidence examples and a mission applicability limit; evidence-chain explanation; and a linked system directory. Counts are read from the existing local scientific registry. The record count explicitly includes mixed ingested record types (runs, observation records and configuration envelopes); it is not described as a run total or confidence measure.
- **Dashboard:** existing mission/objective controls, deterministic ranking, selected NASA record, comparison rows, partial-gravity warning and limitations retain their meaning and order. A subtle header/surface treatment and a 12 px floor for dense dashboard metadata improve scanning. The Evidence DNA and NASA source actions use a wrapping action row with separate hit areas.
- **Buttons:** filled cyan is reserved for the primary action; secondary actions use restrained outlined surfaces; source links remain recognizable as links. Focus uses a two-pixel cyan outline and offset.
- **Evidence and status:** recorded values, unknown states, match labels and warnings keep existing text and source traceability. Amber marks caveats; green marks verified states; mismatch labels remain explicit. No fabricated measurements or decorative scientific graphics are introduced.
- **Responsive behavior:** Home evidence cards and capability links collapse to one column on narrow screens. Dashboard controls/cards retain their existing responsive flow; menu, text sizing and source action wrapping are separately covered at 390 px.
- **Motion:** hover transitions are short and limited to navigation/action surfaces; reduced-motion preferences disable them.

## Accessibility notes

The Home and dashboard desktop/mobile Axe scans report zero WCAG 2.1 A/AA tagged violations. Keyboard-visible focus is provided for links, buttons, inputs, selects and disclosure summaries. The mobile navigation uses native disclosure semantics. This is automated evidence and does not replace manual NVDA review. Contrast was evaluated by the Axe scan on those four route/viewport combinations, not across the entire application or every state.

## Deliberate non-goals

This phase does not restyle ranking, Explorer, Virtual Lab, EMBER, Evidence DNA, the campaign, or the 3D game HUD. Those surfaces remain candidates for a later UI phase and retain their existing visual systems. Do not merge this research-system token set into the game HUD without a separate review.
