---
name: service-journey-mapping
description: >
  Service & journey mapping for GovTech Barbados. Builds service blueprints (detailed,
  simplified, or current-state + future-state pairs) and journey maps (per actor:
  applicant, official, vendor…) as styled HTML pages with inline commenting, from a
  transcript, a Miro board, or an interview with the user. Use this skill whenever the
  user asks for a service blueprint, journey map, experience map, "map this service /
  process / journey", a simplified or future-state blueprint, or wants meeting notes, an
  Otter transcript, or a Miro board turned into a service design artifact — even if they
  don't say "blueprint" explicitly. Also use it when the user asks to update or extend
  one of the existing blueprint/journey pages in Prototypes/.
---

# Service & journey mapping

Build service blueprints and journey maps as self-contained HTML pages in the GovTech
Barbados house style, publishable on GitHub Pages with inline commenting so colleagues
can respond. The value of these artifacts is that every card is *true* — grounded in a
transcript, a board, or the user's own answers — and that open questions are surfaced
honestly instead of papered over.

## Deliverables

| Artifact | Lanes | Tag system |
|---|---|---|
| Detailed service blueprint (as-is) | Physical evidence · Applicant actions · Frontstage · Backstage · Support processes | Works today / Gap / Open question |
| Simplified service blueprint | Applicant actions · Front stage · Back stage · Systems & support | Works today (plain) / To build (red outline) |
| Current + future state pair | Same five lanes as detailed | New / Changed / Unchanged / Removed |
| Journey map (one per actor) | What they do · Touchpoints · Thinking & feeling · Pain points · Opportunities | Works today / Gap / Open question |

A "simplified" blueprint is one card per moment, matching the user's Miro convention.
Red on a Miro board means **needed but not fully functional today** — it becomes a
red-outlined "To build" card, never silently merged into normal content.

## Workflow

Follow these six steps in order. Do not skip step 3 — building on guesses produces
plausible-looking cards that are wrong, and wrong cards destroy trust in the whole
artifact.

### 1. Scope

Confirm with the user (briefly — one question round at most):
- Which artifact(s)? A blueprint and its journey maps are often wanted together.
- Which service, which ministry/MDA?
- As-is, future state, or both? This decides the tag system (table above).

### 2. Gather source material

Three modes, detailed in [references/sources.md](references/sources.md) — read it
before gathering, it contains environment workarounds that are not guessable
(macOS blocks reading ~/Downloads; Miro boards often aren't shared with the
connector account and need the Chrome fallback; Miro comment threads usually can't
be opened by automation and must be asked for):

- **Transcript / notes** — mine it with the checklist in sources.md.
- **Miro board** — read cells, red text, and comment badge *positions*; ask the user
  for comment *contents*.
- **Interview** — no source material; ask the structured question script.

### 3. Present and ask before building

Show the user what you extracted (compact — phases, lanes, red items, open
questions) so they can correct your reading. Then ask targeted questions about:
- anything ambiguous or unreadable in the source,
- every comment/question the user left on the source,
- how their questions should be represented (usually: as content updates or
  "To build" cards, not as open-question cards — but ask).

Use AskUserQuestion for genuinely choice-shaped decisions, plain text for
open-ended ones. Recommend a default for every question you ask.

### 4. Generate

Read [references/house-style.md](references/house-style.md) for the page skeleton and
CSS conventions, and [references/content-model.md](references/content-model.md) for
lane definitions, card-writing rules, and summary panels.

Non-negotiables:
- Every card traces to the source or to a user answer. Never invent process facts.
- Plain language, sentence case, "the applicant/officer does X" in active voice.
- Wire in inline commenting on every page (see delivery.md for the script tag and
  the page-id registry).
- Cross-link companion pages in the footer, and cite the source + date there.
- File goes in `Prototypes/` with a descriptive kebab-case name.

### 5. Verify in the browser

Serve the repo root locally and check the page before handing over — rendering bugs
in a 1900px grid are invisible in the code. Procedure and known browser-pane
glitches are in [references/delivery.md](references/delivery.md). At minimum: full
screenshot of the top, console error check, and a DOM count of cards/lanes/panels
against what you generated.

### 6. Deliver

Summarize what was built and how source material was folded in. **Offer** to commit
and push to GitHub Pages — never push unasked. The safe push procedure (the working
tree carries unrelated deletions that must not be staged) and the live URL pattern
are in [references/delivery.md](references/delivery.md).

## Canonical worked examples

Point of truth for style and tone — read the relevant one before generating, and
prefer copying its `<style>` block over re-deriving CSS:

| Artifact type | File | Live |
|---|---|---|
| Detailed blueprint (as-is) | `Prototypes/service-blueprint-case-management.html` | adunnir.github.io/govtech-barbados-prototypes/Prototypes/service-blueprint-case-management.html |
| Simplified blueprint | `Prototypes/service-blueprint-case-management-simplified.html` | …/service-blueprint-case-management-simplified.html |
| Journey map | `Prototypes/journey-map-cms-applicant.html` | …/journey-map-cms-applicant.html |
| Future-state blueprint | git history: `Prototypes/service-blueprint-future-state-online.html` (deleted from working tree — recover with `git show HEAD:<path>`) | …/service-blueprint-future-state-online.html |

If a canonical file is missing from the working tree, it is still in git history and
live on Pages — recover it rather than improvising.
