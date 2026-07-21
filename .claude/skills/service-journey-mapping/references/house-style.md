# House style — page skeleton and CSS conventions

The fastest and safest route: **copy the `<style>` block and page skeleton from the
canonical file for your artifact type** (listed in SKILL.md), then adapt content.
This file documents the conventions so you can adapt confidently and rebuild if a
canonical file is ever lost.

## Design tokens

```css
:root{
  --navy:#00267F;      /* headers, stage heads, lane accents */
  --navy-deep:#001a5c; /* card headings */
  --gold:#FFC726;      /* eyebrow chip, header underline, panel accents */
  --offwhite:#F7F3F3;  /* page background */
  --charcoal:#2C2C2C;  /* footer, labels */
  --ink:#1a1a1a;
  --card:#ffffff;
  --line:#d8d2d2;
  --red:#B42318;       /* gaps / to-build */
  --green:#1C7C43;     /* works today / new */
  --purple:#6941C6;    /* shared / feelings lane */
}
```

Font stack: `"Segoe UI",system-ui,-apple-system,Arial,sans-serif`. No external fonts,
no frameworks — each page is one self-contained HTML file plus the shared comments
script.

## Page skeleton (top to bottom)

1. **`<header>`** — navy, gold bottom border. Contains:
   - `.eyebrow` — gold chip, uppercase, names the artifact type and scope
     (e.g. "Journey map · Applicant · After submitting a form")
   - `<h1>` with one `<span>` segment in gold for the emphasis phrase
   - `.meta` paragraph — who × what, one-paragraph orientation, `<strong>` opener
2. **Optional strips** — e.g. the simplified blueprint's "The CMS includes:" strip
   (`#fff9e3` background) for source-board header notes.
3. **`.legend`** — sticky (`position:sticky;top:0;z-index:40`), white, swatches for
   lanes/actors + tag chips with one-line meanings.
4. **`.scroller > .blueprint|.journey`** — `overflow-x:auto` wrapper around a CSS
   grid. The page body must never scroll horizontally; only this container does.
5. **`.panels`** — 2–3 summary panels (`auto-fit,minmax(320px,1fr)`).
6. **`<footer>`** — charcoal. Companion links + source citation + date.
7. **Comments script tag** — always last (see delivery.md).

## The grid

```css
.blueprint{ display:grid;
  grid-template-columns:150px repeat(N, minmax(268px, 1fr));
  min-width: ~ (150 + N×280) px; }
```

- N = number of phases (5–7 works; 6 is typical).
- Row structure: one `.corner` + N `.stagehead` cells, then for each lane:
  one `.lanelabel` + N `.cell` divs. Grid auto-placement handles rows — keep the
  child count exact or the whole grid shears.
- `.lanelabel` is `position:sticky;left:0` so lane names survive horizontal scroll.
  Its `.inner` has a 5px left border in the lane's accent colour.
- Between lanes, insert blueprint lines as full-width rows:
  `.bline` with a sticky label — "Line of interaction", "Line of visibility",
  "Line of internal interaction" (blueprints only; journey maps have no lines).

## Stage heads

```html
<div class="stagehead"><div class="num">Stage 1</div><h2>Submit</h2><p>The form is sent</p></div>
```

Navy, rounded top corners. `.num` is gold uppercase ("Stage N" for blueprints,
"Phase N" for simplified). The `<p>` is a short editorial subtitle — write it as a
hook ("A status page with no front door"), not a repeat of the title.

## Cards

`.cardx` — white, 1px `--line` border, radius 8, small shadow. Contents: `<h4>`
(optional for single-fact cards), `<p>` or `<ul>`, then `.tags` with `.tagchip`s.

Variants by artifact:
- **Detailed blueprint:** `.cardx.evidence` (cream `#fffaf0`) for the physical
  evidence lane; `.cardx.support` (grey, dashed border) for the support lane;
  actor accents as 4px left borders (`.applicantline` navy, `.staffline` gold,
  `.bothline` purple). State outlines: `.isgap` (2px red), `.isopen` (2px blue
  `#1550b0`).
- **Simplified blueprint:** lane-tinted card backgrounds matching the Miro board —
  applicant `#ececec`, front `#e2f2f7`, back `#ffe9c4`, support `#ecdcf5`. To-build
  cards get `outline:2px solid var(--red)` with red heading and `#8a2018` body text.
- **Journey map:** `.cardx.touch` (cream) for touchpoints, `.cardx.pain`
  (`#fdf1f0`) with red headings, `.cardx.opp` (`#eefaf3`) with green headings, and
  `.feelcard` (`#f4f1fb`) for the feelings lane — emoji `.mood` at 26px, purple
  uppercase label, quoted thought, then an `<em>` insight line.

## Tag chips

`.tagchip` — 10.5px uppercase pills. The standard sets:

| Set | Chips |
|---|---|
| As-is | `tag-today` green "Works today" · `tag-gap` red "Gap" · `tag-open` blue "Open question" |
| Simplified | `tag-build` red "To build" (working cards carry no chip) |
| Future-state | `tag-new` green · `tag-changed` blue · `tag-same` grey · `tag-removed` red |
| Actor chips | `tag-applicant`/`tag-vendor` navy · `tag-staff`/`tag-org` gold · `tag-both` purple |

## Summary panels

2–3 `.panel` blocks with an underlined uppercase `h3` (gold underline by default;
green for "working today", red for gaps/to-build, blue for open questions). Bullets
carry `<strong>` lead-ins. These panels are what a minister or PS actually reads —
write them as the executive summary of the grid.

## Print

Keep the `@media print` block: legend unsticks, scroller unclips, background goes
white. People print these for workshops.
