# Content model — lanes, cards, and copy rules

## Phases (columns)

5–7 phases, named as **moments in the service**, not internal process steps.
Good: "Handoff & confirmation", "Track & wait", "Decide", "Close & learn".
Bad: "Processing", "Backend integration", "Phase 2".

Each phase's subtitle should say what's interesting about it — the tension or the
change — so someone scanning only the header row still gets the story.

## Lanes (rows) and what belongs in each

### Blueprints

| Lane | Contains | Watch out for |
|---|---|---|
| Physical evidence | Things people can see/touch: forms, emails, status pages, licences, letters | "Silence" is evidence too — an empty stage where nothing reaches the person is a card, not a blank cell |
| Applicant/customer actions | What the citizen does, including waiting and giving up | Write behaviour, not system function ("files the confirmation away", not "receives email") |
| Frontstage | What the service shows/says — visible staff actions and system responses | This is the copy the citizen actually reads; quote real page copy in italics where you have it |
| Backstage | Staff actions invisible to the citizen | Name who decides things; note where nobody is notified or assigned |
| Support processes | Systems, integrations, data, access control, policies | The place for API handoffs, status models, ID generation, email services |

Blueprint lines separate the lanes: **line of interaction** (applicant ↔ frontstage),
**line of visibility** (frontstage ↔ backstage), **line of internal interaction**
(backstage ↔ support).

Simplified blueprints drop physical evidence and merge to four lanes (applicant,
front stage, back stage, systems & support) — one card per moment, with extra
"To build" cards stacked beneath where needed.

### Journey maps

One map per actor. Lanes: **What they do** · **Touchpoints** (what the service
shows them) · **Thinking & feeling** · **Pain points** · **Opportunities**.

The feelings lane carries the narrative arc: emoji + short state label + a
first-person thought in quotes + an `<em>` insight sentence. The arc should be
honest — if the low point is rejection with no contact route, let the lane say so.
Pain points and opportunities must correspond: every pain either has an opportunity
card in the same column or an explicit open question.

## Tag systems — pick by mapping mode

- **As-is mapping** (understanding today): Works today / Gap / Open question.
  A *Gap* is a known break with agreement it's broken. An *Open question* is a
  design decision nobody has made yet. Don't conflate them — gaps get fixed,
  questions get answered.
- **Simplified / roadmap** (Miro convention): plain cards work today; red-outlined
  **To build** cards are needed-but-not-functional. Red text on a source board
  always maps to To build.
- **Future-state pairs**: New / Changed / Unchanged / Removed, judged against the
  current-state page. "Unchanged" is a deliberate design decision — say *why* it's
  deliberately kept in the summary panel.

## Card-writing rules

- **One fact per card.** If a card needs "and also", it's two cards.
- **Ground every claim.** Each card's content must trace to the transcript, the
  board, or a user answer. If you can't point to the source line, ask — don't
  smooth over.
- **Plain language.** Understandable by a 9-year-old where possible: "told" not
  "notified", "sent" not "submitted" in citizen-facing copy. Internal lanes may use
  the team's own vocabulary (CaMS, MDA, program code) since staff read them.
- **Keep the killer details.** Verbatim copy ("Your application was not
  successful"), specific numbers, and named behaviours ("Justin approves everyone
  in one go") are what make these artifacts persuasive. Quote them in italics.
- **Bold the load-bearing phrase** in a card, at most one per card.
- **Empty cells are allowed** in simplified blueprints; in detailed ones, prefer a
  card that names the absence ("Silence — nothing reaches the applicant").

## Summary panels

Two or three, depending on mode:
- As-is: *Working today* / *Gaps to close* / *Open design questions*
- Simplified: *Working today* / *To build — for this to work well* (group the
  to-build list into 4–6 named themes so it reads as a roadmap)
- Future-state: *Removed from the journey* / *New in the journey* / *Deliberately
  unchanged*
- Journey maps: *The intended experience* / *The core problem* / *Questions to
  answer next*

## Handling the user's questions and comments

When the source carries the user's own questions (Miro comments, margin notes),
ask how each should land. The usual pattern from past sessions: most become
**content updates or To build cards** (the question implies the answer), a few
stay as open questions, and clusters of related comments merge into one card that
carries the shared design direction. Reflect the user's reasoning in the card body
("no lag window for over-eager applicants…") — the why is what colleagues respond to.
