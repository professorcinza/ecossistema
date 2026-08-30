# Delivery 001 — "Ponte"

*Languages:* [Português](DELIVERY.md) · [English](DELIVERY.en.md) · [中文](DELIVERY.zh.md)

**Architect:** Cleiton Moura Loura · **Implementation:** according to the brief, on 22 August 2026

---

## What the architect specified

1. A single landing page, end to end;
2. The message carried by a mix of colours and symbols of the two nations;
3. A widget fixed while scrolling, which swaps the translation strings;
4. A selector with country code and country flag;
5. Everything minified: inline JavaScript and CSS, in a single `index.html` compressed as far as it will go.

## How each point was implemented

1. **Single page** — one `index.html`, zero external dependencies, zero network requests (works offline);
2. **Colours and symbols** — top bar in a green → gold → red gradient (Brazil and China meeting in gold, common to both flags); logo as a golden lozenge with a red star (Brazil's lozenge + China's star); principles marked alternating gold, green and red;
3. **Fixed widget** — `position:fixed`, top-right, visible throughout the scroll; swaps every string marked `data-i`, the document links (each language points to its own version) and the page `lang` attribute; initial language detected from the browser; choice persisted in `localStorage`;
4. **Flags and codes** — inline SVG (BR · EN with the US flag · ZH), at 17×12 px;
5. **Minification** — HTML, CSS and JS packed into a single file; size check below.

## Implementation decisions subject to the architect's approval

- **Simplified flags** (at 12 px height, details such as Brazil's 27 stars, the US's 50 asterisks and China's four small stars are invisible — omitted to save bytes; a faithful version can be restored at a cost of space);
- **English represented by the US flag** — conventional choice; can be swapped;
- **10-second message** (not specified in the brief): "A bridge between Brazil and China — friendship, cooperation and open inventions: a personal initiative, patent-free, with authorship always credited";
- **Tone** (not specified in the brief): welcoming, honest, alive.

## Acceptance requirements verification

| # | Requirement | Status |
|---|---|---|
| 1 | A single file, zero external dependencies | ✓ verified |
| 2 | Trilingual, switch without reload, browser detection, choice remembered | ✓ 17 functional tests, 17 passed |
| 3 | Works offline (no network request) | ✓ verified |
| 4 | ≤ 20 KB uncompressed | ✓ verified (see below) |
| 5 | Accessible: keyboard, screen reader, contrast AA | ✓ implemented |
| 6 | Non-officiality notice visible without scrolling, in every language | ✓ verified |
| 7 | One file, hostable anywhere | ✓ |

## Verified size

- `index.html`: **9,750 bytes** uncompressed — 48% of the 20 KB budget.
- External URLs in the file: **0** (verified by search) — no network request, offline guaranteed.

## Functional test evidence (jsdom, 22/08/2026)

Language detection (pt-BR, zh-CN, fallback fr-FR→en), all strings swapped on click, links swapped by language, `html.lang` and `<title>` updated, `aria-pressed` moved to the active button, announcement in `aria-live` in the new language, persistence in `localStorage`, non-officiality notice rendered at the top, zero script errors: **17 tests, 17 passed.**

## Revision 2 (22/08/2026) — external blueprints section

At the architect's request, the **"External projects & blueprints"** section was added (trilingual), with a link to `https://github.com/professorcinza/Our-Civilization-The-Game`.

- **Link status:** verified again on 22/08/2026 — **public repository, reachable** (4 commits; `BLUEPRINT.md`, content CC BY-SA 4.0, code AGPL-3.0). Before publication it returned 404;
- The link is external (`target=_blank`, `rel=noopener noreferrer`), but **does not generate a network request** when the page loads — the offline requirement still holds.

## Revision 3 (27/08/2026) — Welcome Letter and Constitution on the Ponte

The Ponte now also points to the **Welcome Letter** and the **engineering constitution (SDD)**, each language to its own version. The non-officiality notice, the 20 KB ceiling and the offline requirement still hold.

## Outstanding

- [x] Architect's approval (or changes) — **approved on 22/08/2026**
- [x] Commit with authorship recorded
- [x] Public publication of the `Our-Civilization-The-Game` repository so the Ponte link works
- [x] BRIEF and DELIVERY in PT, EN and ZH — conception debt paid on 27/08/2026
