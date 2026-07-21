# Source modes — transcripts, Miro boards, interviews

## Mode 1: Transcript or notes

### Getting the file

macOS blocks this environment from reading `~/Downloads` directly (EPERM even
unsandboxed). Copy the file out via Finder first:

```bash
osascript -e 'tell application "Finder" to duplicate (POSIX file "/Users/<user>/Downloads/<file>" as alias) to (POSIX file "<scratchpad-dir>" as alias)'
```

Then Read the copy from the scratchpad.

### Mining checklist

Read the whole transcript once, then extract into these buckets:

1. **Actors** — every distinct role (applicant, officer, program lead, super
   admin, systems). Each named person's behaviour is evidence ("Justin waits until
   all applications are in").
2. **Phases** — the natural moments of the service as the speakers describe them,
   not an idealized funnel.
3. **Touchpoints & verbatim copy** — emails, pages, and their actual wording.
   Verbatim quotes are gold; keep them.
4. **Statuses & state changes** — the real state model, including states people
   *wish* existed.
5. **Backstage actions** — who does what, who decides, who is (or isn't) notified.
6. **Systems** — integrations, IDs, access control, exports.
7. **Gaps** — things described as broken, missing, or "the problem we need to
   solve".
8. **Open questions** — things speakers explicitly didn't know or deferred
   ("we don't really have any more about the overall design of it").

Anything that fits none of the buckets but sounds load-bearing: note it and ask.

## Mode 2: Miro board

### Reading order

1. **Try the Miro connector first** (`board_list_items`, `context_get`,
   `comment_list_comments` on the board URL). If it errors with a permissions
   message, the board belongs to a team the connector account isn't in — don't
   retry; go to the Chrome fallback.
2. **Chrome fallback** — open the board URL in the user's real Chrome
   (claude-in-chrome tools), where they're logged in:
   - `navigate` to the URL, `wait` ~4s for the canvas to load, `screenshot`.
   - Use `zoom` on regions (header note, then row by row) to read exact cell text.
   - Note where comment badges sit (which cell), and where badges cover text.
   - **Do not burn time clicking comment badges** — the Miro canvas typically
     ignores synthetic clicks/scrolls (observed repeatedly: clicks, hovers,
     zoom buttons, and keyboard shortcuts all no-op). Read what you can visually.

### Interpreting the board

- **Red text = needed but not fully functional today** → To build cards. This is
  the user's established convention; never fold red content into normal cards.
- **Header sticky notes** = scope statements → header strip or summary panel.
- **Comment badges** = the user's questions. List their positions ("Back
  stage / Decision column") and ask the user to paste the contents — offer the
  alternative of sharing the board with the connector account. When they answer,
  ask how each should be represented (see content-model.md).
- **Text hidden behind badges**: reconstruct your best reading and ask the user to
  confirm it — flag it explicitly as a guess.

## Mode 3: Interview (no source material)

Ask in this order, one round at a time, keeping rounds short:

1. **The service in one sentence** — who applies for what, which MDA, what the
   outcome is (licence? payment? place on a program?).
2. **Phases** — "Walk me through it from the citizen deciding to apply to the case
   being closed. What are the 5–7 moments?"
3. **Per phase, by lane** — for each phase: What does the applicant do? What do
   they see or receive? What happens behind the scenes and who does it? What
   systems are involved?
4. **The unhappy paths** — What happens on rejection? When information is missing?
   When something physical must be collected? Where does silence occur?
5. **Gaps and wishes** — "What doesn't work today? What must exist for this to
   work well?" (these become Gap / To build cards)
6. **Open decisions** — "What has nobody decided yet?"

Reflect the answers back as a compact phase × lane sketch before generating, so
corrections happen on the sketch, not the finished page.
