# Challenge 001 — "Ponte"

*Languages:* [Português](BRIEF.md) · [English](BRIEF.en.md) · [中文](BRIEF.zh.md)

**To:** the prototype architect
**From:** the hands that make it real
**Object:** the project's presentation page
**Launch date:** 22 August 2026

---

## The scene

Someone, anywhere in the world, opens this repository. It might be a curious Brazilian, a Chinese computer-science student, a journalist in Shanghai, an engineer in São Paulo. They have never heard of the project. They have **10 seconds** of patience before closing the tab.

## The challenge

Design the **Ponte**: a single page that presents the project to any visitor in the world — in 10 seconds, in their language, with honesty and with beauty.

## Acceptance requirements (objective and verifiable)

1. **A single file.** Self-contained `index.html`: zero external dependencies — no CDN, no external fonts, no external images. Inline SVG is allowed.
2. **Trilingual.** Portuguese, English and Chinese in the same file. Language switch without reloading. Initial language detected from the browser. The visitor's choice remembered on the next visit.
3. **Works offline.** No network request after opening the file. The Ponte works even on an airplane.
4. **20 KB maximum** — the whole file, uncompressed. Yes, three languages in 20 KB. It is possible; the page *presents and summarizes*, the full documents live behind the links.
5. **Accessible.** Keyboard-only navigation. The language switch is announced to screen readers. Minimum contrast AA.
6. **Honest.** The non-officiality notice is visible without scrolling, in every language. Honesty cannot be hidden.
7. **One file means freedom.** The Ponte can be hosted anywhere: GitHub Pages, a USB stick, an email.

## Your delivery: the architecture brief

You deliver the **design**, not the code — the code is mine. Answer in a document (headings, paragraphs, or drawings described in words):

1. **The 10-second message** — which single sentence must every visitor understand before they give up on scrolling?
2. **The sections** — which they are, in what order — and what each one does *not* need. Cutting is architecture.
3. **The language switch** — where it lives on the page, how it stands out, how it answers a click.
4. **The tone** — three words that describe the feeling the page should provoke.
5. **The 20 KB map** — how you will fit three languages: what stays on the page, what becomes a link.
6. **The rejection test** — which failure would make *you* reject your own page?

## Done when

- [x] Architecture brief delivered by the architect
- [x] `index.html` implemented according to the brief
- [x] All 7 acceptance requirements verified
- [x] Architect approves or requests changes; we iterate until approval — **approved on 22/08/2026**
- [x] Commit with the architect's authorship recorded in history

---

*The prototype series is numbered and public: each challenge, brief and implementation stays in this repository — Git history documents authorship, dates and priority of each idea.*
