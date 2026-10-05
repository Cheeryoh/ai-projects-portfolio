# Certification capstones layout proposal

## Decision

Promote Certification Intelligence out of the three-card experiment row. Place it beside The AI Capability Engineering Exam in a new two-column capstone grid. Keep the original JTA Exam Builder Orchestra, AI Fluency Performance Based Exam (V1), and CourseForge as the three equal supporting experiments below.

This keeps the current visual system: dark surfaces, warm borders, compact metrics, pill tags, restrained motion, and the existing 20px grid rhythm. The change is hierarchy, not a redesign.

## Implementation status (2026-10-04)

- The page now uses two equal capstone cards above the three supporting experiment cards.
- Certification Intelligence uses the final 1600x900 application screenshot at `C:\Users\Justin O\Desktop\All AI Projects\web\cheeryoh-certification-portfolio\assets\certification-intelligence.png`.
- The layout was verified at 1440px, 1024px, and 390px. The screenshots and measured geometry are in `C:\Users\Justin O\Desktop\All AI Projects\web\cheeryoh-certification-portfolio\docs\layout-verification`.
- The Certification Intelligence walkthrough and deployment URLs are still pending verification. Both controls remain visibly disabled until those destinations exist and are checked.
- The original JTA card, historical walkthrough, and Railway links remain in the supporting row.

## Evidence from the current site

- The live page at `https://cheeryoh.com/` has one full-width flagship followed by three equal experiment cards.
- The local branch currently places Certification Intelligence in the narrow-card row at `index.html:161`, while the live JTA Exam Builder card is no longer present as its own card. Restore that JTA card from the repository history or current production source. Do not turn the JTA card into the new capstone.
- The existing flagship structure is `article.card.card-flagship` at `index.html:76`; its media, summary, and session steps are styled by `.card-media`, `.card-body`, `.card-body-main`, and `.card-steps` in `style.css:582-649`.
- The supporting experiment grid is `.projects-sub-grid` at `index.html:159` and `style.css:395-399`.
- The certification lifecycle video is still awaiting human acceptance and publication. `walkthrough-jta.html:19-20` correctly distinguishes the pending 3:21 lifecycle cut from the historical JTA video.
- The existing Railway links open the original builder and its archived runs. They are not the future Certification Intelligence deployment.

## Proposed page structure

Inside `.projects-grid`, use two sibling grids:

```html
<div class="projects-capstone-grid">
  <article class="card card-capstone">...</article>
  <article class="card card-capstone">...</article>
</div>

<div class="projects-sub-grid">
  <!-- JTA Exam Builder Orchestra -->
  <!-- AI Fluency Performance Based Exam (V1) -->
  <!-- CourseForge -->
</div>
```

Both capstones should use the same DOM order:

1. One 16:9 screenshot.
2. Category and status row.
3. Title and one-sentence hook.
4. Three metrics.
5. Short description.
6. Four-step explanation.
7. Technology tags.
8. `Watch walkthrough` and `Open Experiment` actions in the same order.

Use one screenshot per capstone. The current two-image Performance Lab treatment would give it more visual weight and make equal heights fragile.

## Responsive layout

### Desktop, 1100px and wider

- `.projects-capstone-grid`: two equal columns, 20px gap, `align-items: stretch`.
- `.projects-sub-grid`: three equal columns, 20px gap.
- Each capstone uses one 16:9 media frame and a single-column body. Keep the four-step block below the description rather than recreating the current wide card's internal left/right split inside a half-width card.
- Let the card flex layout push tags and CTAs to the bottom. Avoid fixed card heights and text clipping.

### Tablet, 768px to 1099px

- At 920px and wider, retain two capstone columns and three supporting columns. Reduce capstone padding from 32px to 28px and the step-list gap slightly.
- Below 920px, stack both capstones, then stack the three supporting experiments. This avoids a 2+1 orphan row and keeps copy readable in portrait orientation.
- Preserve 20px vertical spacing between all cards.

### Mobile, below 768px

- One card per row.
- Full-width 16:9 media.
- Metrics may wrap, but keep all three visible.
- Stack both CTAs as equal-width controls.
- Allow natural card height. Equal height only applies when the capstones share a row.

## Section copy

**Label**

`The Experiments`

**Heading**

`5 AI systems I built for L&D and certification.`

**Subtitle**

`Two capstones show how I design and operate assessment systems end to end. The original JTA builder supports my work at Intuit, and the AI Fluency exam is in development there. Certification Intelligence is an independent simulation.`

## Capstone 1 copy

**Category**

`Certification Capstone`

**Status**

`Runs 100% Local`

**Title**

`The AI Capability Engineering Exam`

**Hook**

`AI can pass a technical test. This exam measures how the person works with it.`

**Metrics**

- `200` / `Point Rubric`
- `7` / `Live Checks`
- `150` / `Process Points`

**Description**

`A live support case, an AI customer, real infrastructure, and transcript-backed grading reveal the candidate's process. Two candidates can reach the same technical result and still earn very different scores for how they investigated, delegated, verified, and explained the work.`

**Steps label**

`How a session works`

1. `Interview a simulated customer in plain chat.`
2. `Diagnose a live case with your own AI agent.`
3. `The system captures technical and process evidence.`
4. `A cited debrief scores the 200-point rubric.`

## Capstone 2 copy

**Category**

`Certification Capstone`

**Status**

`Independent Simulation`

**Title**

`Certification Intelligence`

**Hook**

`A connected certification lifecycle, from job analysis to monitored release, with every consequential change passing through review.`

**Metrics**

- `10` / `Lifecycle Stages`
- `10,000` / `Synthetic Attempts`
- `600,000` / `Simulated Responses`

The current `25 Lifecycle Phases` label is inaccurate. The implementation has ten lifecycle stages and 25 lifecycle artifacts.

**Description**

`This independent demonstration connects practitioner validation, blueprinting, standard setting, pilot analysis, launch, monitoring, investigation, and refresh. Its evidence and reviewer decisions are pre-generated simulations built to make governance visible. They do not validate a real credential.`

**Steps label**

`How evidence moves`

1. `Practitioner evidence proposes the JTA and domain weights.`
2. `An approved blueprint controls form assembly.`
3. `Standard setting and pilot evidence support a reviewed launch.`
4. `Monitoring opens investigations; approved successors return to pilot and revalidation.`

Add two persistent disclosure chips near the status row:

- `SIMULATED DATA`
- `SIMULATED REVIEW`

Do not rely on the paragraph alone for these disclosures.

## CTA treatment

Use the same action order and geometry on both capstones:

1. `Watch walkthrough` using `.card-cta-primary`.
2. `Open Experiment` using `.card-cta-ghost`.

The Performance Lab walkthrough can continue to use `walkthrough-perflab.html`. Its experiment remains local-only, so show `Open Experiment` as a disabled, non-anchor control with `Local only` helper text unless a public build is supplied.

Certification Intelligence currently has neither an accepted public walkthrough URL nor a deployed application URL. Show both action positions, but render them as disabled non-anchor controls labeled `Walkthrough pending` and `Deployment pending`. Do not use `href="#"`, the historical YouTube ID, or the original Railway builder URL. Activate each CTA only after its destination is separately verified.

When the new video is accepted, create a dedicated `walkthrough-certification-intelligence.html`. Keep `walkthrough-jta.html` associated with the original JTA card and its historical video. When the new app is deployed, its `Open Experiment` action must use the separate verified URL requested for Certification Intelligence.

## Screenshot strategy

### Performance Lab

Use `assets/perflab-console.webp` as the single hero image. It shows the defining interaction and already has a useful alt description. Keep `assets/perflab-report.webp` for the walkthrough or a later detail page.

### Certification Intelligence

The selected 1600x900 screenshot is now stored at:

`C:\Users\Justin O\Desktop\All AI Projects\web\cheeryoh-certification-portfolio\assets\certification-intelligence.png`

It shows the ten-stage lifecycle navigation, synthetic-data disclosure, simulated-review disclosure, and overview evidence in one frame. The page declares its intrinsic `width="1600" height="900"`, retains `loading="lazy"`, and uses descriptive alt text that identifies the simulated review.

Do not use a frame from the unpublished video as proof that the video is public.

## Exact implementation targets

- `index.html:67-70`: update the section count and subtitle.
- `index.html:73-156`: wrap the current Performance Lab card in `.projects-capstone-grid` and adapt it to the shared capstone structure.
- `index.html:161-222`: move Certification Intelligence into the capstone grid and replace its current builder links with pending CTA states until real URLs exist.
- `index.html:159-335`: restore the original JTA Exam Builder Orchestra card as the first child of `.projects-sub-grid`; retain AI Fluency and CourseForge after it.
- `style.css:390-399`: add `.projects-capstone-grid` and preserve the 20px rhythm.
- `style.css:581-649`: scope shared media and step rules to `.card-capstone`; make the capstone body single-column at half width.
- `style.css:652-666`: replace the current 1024/820 grid transitions with the 920px stack behavior described above.
- `style.css:809-817`: make both capstone actions full width on mobile and preserve metric wrapping.
- `walkthrough-jta.html:19-20`: retain the historical JTA distinction; do not silently replace the old embed with the pending lifecycle video.
- `assets/perflab-console.webp`: retain as Capstone 1 media.
- `assets/certification-intelligence.png`: selected 1600x900 Certification Intelligence application screenshot.

## Implementation pitfalls

- Do not remove or rename the original JTA experiment. Certification Intelligence is a separate capstone and future deployment.
- Do not point the new capstone at `exam-jta-orchestration-production.up.railway.app`; those links currently represent the original builder.
- Do not call deterministic simulated reviewer decisions human approvals.
- Do not shorten the disclosure to a vague `demo` badge. Keep both `SIMULATED DATA` and `SIMULATED REVIEW` visible.
- Do not claim the 3:21 walkthrough is available until its final upload URL has been accepted.
- Do not hard-code equal pixel heights. Matched structure, one media ratio, similar copy length, grid stretch, and bottom-aligned actions will produce equal desktop cards without clipping.
- Do not preserve the two-image media treatment on only one capstone.
- Do not use `object-fit: cover` on a dense application screenshot without checking that navigation and decision context survive the crop at desktop and mobile widths.
- Do not add a new animation system. The existing `[data-animate]` observer in `main.js:42-59` already handles the cards and respects reduced motion.
