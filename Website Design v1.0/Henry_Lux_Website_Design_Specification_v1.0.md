# Henry Lux — Website Design Specification v1.0

**Prepared for:** Henry Lux  
**Date:** September 6, 2026  
**Purpose:** A bounded design brief, acceptance criteria, and safe implementation sequence for refining the existing photography website.  
**Status:** Ready for repository review and a limited prototype. Not a visually validated design, production release, or authorization to deploy.

## 1. Executive decision

Proceed with an artist-first, photograph-led refinement of the existing website. Retain the working direction **Contemporary Editorial with Quiet Gallery restraint**, but treat it as a way to present Henry's work, not as a requirement to use fashionable typography, enormous gaps, or complicated gallery transitions.

The central design objective is:

> Help a visitor remember a particular photograph or body of work, understand whose work it is, and take the next relevant step without hunting.

Personal projects should lead the presentation. Portraits, Still Life, and Contact should nevertheless remain easy to find. Artistic priority must not become an obstacle to visitors evaluating a commission or institutional opportunity.

The first coding assignment is a read-only inventory of the actual website repository. The first implementation assignment, after that inventory is reviewed, is one homepage and one representative project-page prototype using Henry's actual photographs. Do not redesign every page before those two pages are tested.

This specification supersedes conflicting assistant suggestions from Phases 1–3. It does not override Henry's explicit preferences, repository safety rules, or later decisions. All numerical design tokens and file-size budgets below are proposed starting constraints, not measurements of the present site or universal design standards.

## 2. Evidence, limits, and corrections

### What was verified from public page content

| Public observation | Source | What it does not establish |
|---|---|---|
| The homepage exposes genre-based navigation and a short introduction. | S1 | Whether the rendered typography, spacing, or image crop is good or bad. |
| The Projects page exposes links to Fatherhood and Labor Creates. | S2 | Whether Observation exists elsewhere, is unpublished, or is ready. |
| The About page identifies Henry as a New York photographer and discusses education and recognition early. | S3 | Whether the text should be replaced wholesale. |
| Contact provides direct email and lists optional assignment-related fields. | S4 | Which fields are visible initially, conditionally revealed, or hidden by the implementation. |
| Fatherhood and Labor Creates have authored statements and exposed image-viewer controls. | S5, S6 | The full image inventory, sequencing, viewer quality, or accessibility. |
| Alec Soth's project page exposes Gallery and Index controls. | S7 | That dual views improve outcomes for Henry, or that this interaction would be original to his site. |

The public-page text was rechecked on September 6, 2026. This review did not obtain a working rendered-browser session, the current repository, real-device screenshots, analytics, a complete visual image review, or measured performance results. The attempted independent page download was unsuccessful. No live website files were changed.

Earlier numerical design scores were subjective impressions, not measured audit results. They are withdrawn as evidence. Earlier descriptions of Phase 3 as complete should be read as completion of a conceptual proposal, not completion of visual validation.

### Corrections to the earlier proposal

**Do not equate minimal copy with weak identity.** Henry has previously preferred a restrained homepage without inflated claims, schooling, sales copy, or excessive artist-statement text. The work and its arrangement can communicate identity without a new manifesto.

**Shorten the homepage.** Multiple photographs from every project, a second anonymous opening image, a biography, and very large spaces would duplicate the project pages. Use a selective introduction instead.

**Do not bury selected portfolios.** A visitor should not have to scroll through three personal projects before discovering Portraits or Still Life. Include an early, quiet shortcut as well as the Work index.

**Demote Sequence/Index from mandatory signature to tested enhancement.** The idea is established elsewhere. Its value here must be practical, not a claim of uniqueness.

**Do not prescribe a serif as proof of sophistication.** Compare a restrained existing/neutral sans-serif treatment against a selective serif addition using identical images. Keep the simpler treatment unless the second voice earns its place.

**Do not prescribe small photographs or large gaps without looking at the pictures.** Intimate detail may require a larger image. Empty space can interrupt a sequence as easily as it can support one.

**Verify before repairing Contact.** Inspect its actual states before implementing progressive disclosure that may already exist.

## 3. Audience and intended outcomes

The working audience priority follows Henry's artist-first direction: people considering the work in an artistic, educational, institutional, or collaborative context first; selective assignment clients second. General visitors should still understand the site without art-world knowledge. These are planning priorities, not findings from audience research.

A successful visit might mean remembering Fatherhood, opening another body of work, finding relevant portrait or still-life photographs, reading the artist's background, or making a thoughtful inquiry. More scrolling or a longer visit is not automatically success.

The site should communicate an identifiable photographic practice without pretending that all current work shares a single perfected thesis. Family, labor, place, observation, and formal photographic craft can coexist. Do not force them into a slogan or attribute intentions Henry has not endorsed.

The public tone should be direct, human, and specific. Avoid invented credentials, client lists, exhibition histories, project dates, representations, or claims about the importance of the work.

## 4. Release scope and boundaries

### Required for the first refined release

A clearer homepage; one coherent Work index; a shared and readable visual system; well-presented active project and portfolio pages; a reliable image viewer; accessible navigation; a verified Contact experience; sensible image delivery; accurate page and sharing metadata; and a documented way for Henry to add or reorder photographs.

### Optional only after the core prototype succeeds

A second all-images view, a second type family, special image pairings on selected pages, and limited UI transitions. None of these is a launch requirement by itself.

### Outside this release

A blog, journal publishing system, shop, newsletter, accounts, booking system, client portal, new paid hosting service, complete branding exercise, custom cursor, decorative film effects, autoplay, parallax, scroll hijacking, or a framework migration solely for appearance.

Do not incorporate Lux Darkroom, ThoughtInbox, or other unrelated project code. This is the photography website project only.

## 5. Information architecture and routes

The intended primary navigation is **Henry Lux / Work / About / Contact**. The name links home. A visible current-page indication and a keyboard-accessible skip link are required.

The Work overview contains two named sections: **Projects** and **Selected portfolios**. Fatherhood and Labor Creates are currently verified public project links. Observation is a reserved content entry, not an assumed published project. Portraits and Still Life remain named destinations rather than being hidden behind an ambiguous visual grid.

| Display destination | Default route decision |
|---|---|
| Home | Preserve the existing home route and any functioning index alias. |
| Work | Reuse `projects.html` as the expanded Work index for the first release. A navigation label does not require a filename change. |
| Fatherhood | Preserve `fatherhood.html`. |
| Labor Creates | Preserve `labor-creates.html`. |
| Portraits | Preserve `portraits.html`. |
| Still Life | Preserve `still-life.html`. |
| About | Preserve `about.html`. |
| Contact | Preserve `contact.html`. |
| Observation | Inspect existing files and publication status before deciding its route or displaying a link. |

No working incoming URL should silently become a 404. A new `/work` route is not necessary for this release. Any later migration requires an explicit old-to-new map and a hosting-compatible implementation, not an assumed server redirect.

Desktop navigation should show the three text links directly. On phones, first test whether they fit comfortably with the name. Use a labelled Menu control only when needed, not merely because the viewport is mobile. Important labels must not disappear into hover-only interactions.

A compact sticky header is optional. It must not obstruct photographs, anchored content, or keyboard focus. Prefer a nonsticky mobile header if space is constrained. W3C identifies obscured focus under sticky content as an accessibility concern. [S13]

## 6. Page composition

### Homepage: an introduction, not a second portfolio

The prototype should begin with the name and navigation, one strong photograph, and its project identity or a clear route to its body of work. A modest location/photography descriptor is sufficient. No artist manifesto is required.

Near the beginning, include a quiet path to Projects, Portraits, and Still Life. It may be a line of links rather than three competing cards. This preserves direct access while allowing projects to dominate the imagery.

Continue with a small number of project previews, then compact Portraits and Still Life entries and a restrained contact/footer area. Use approximately four to six photographs in total as the prototype budget. The opening photograph counts toward this total; it should not immediately be repeated as a second teaser.

Do not require an About portrait or several biographical paragraphs on the homepage. The About destination is already available. Do not add a standalone second image purely to demonstrate asymmetry.

Every preview has a visible title and a predictable destination. On Home and Work, a preview image opens the relevant project, not the full-screen image viewer. Inside a project, an image can open the viewer. This distinction avoids ambiguous click behavior.

If Observation is not ready, omit its public preview. Do not publish an empty page, invent dates or a statement, or delay the entire refinement waiting for it.

### Work: efficient overview

Use relatively compact project entries with title, representative photograph, and verified metadata where useful. Separate the authored projects from the selected genre portfolios using hierarchy rather than large decorative barriers.

The page must be useful to someone scanning quickly. Do not turn it into another long sequence of oversized photographs. Project numbering is optional and should be omitted unless it improves orientation; it is not part of Henry's identity by default.

### Authored project pages

Provide the title, a short orientation where needed, and an obvious way to read the existing full statement. Keep the statement access point in a consistent location. The photographs may be edited differently per project; navigation and explanatory controls should not move unpredictably.

Use Henry's actual image order. Begin with a clear opening photograph and allow full-frame viewing. A project page should remain meaningful when JavaScript is unavailable. Do not assume the current galleries meet or fail this requirement without inspecting them.

The initial system needs only three compositional patterns: a generous single photograph, an inset single photograph, and an intentional pair. Patterns are available tools, not a required alternating formula. A straight sequence can be the correct decision.

At the end, provide an evident return to all work and, where appropriate, one next-project link. Do not duplicate a giant project directory after every series.

### Selected Portraits and Still Life

Use the same typography, image primitives, and viewer, with less explanatory writing as appropriate. Do not invent named assignments or clients to make the portfolios seem more established.

Portraits and Still Life need not use a second gallery mode or exactly the same photographic density as Fatherhood. Their aim is to show a coherent selection, not to imitate a documentary project statement.

### About

Lead with a concise factual introduction and the actual practice. Keep background, education, and recognition, but place them after the introduction. Do not characterize being a student as something shameful or remove useful credentials.

Henry's present public introduction already identifies him as a New York photographer. [S3] A fuller practice paragraph is an editorial task for later review, not permission for Codex to invent one. Preserve existing text until a replacement is explicitly accepted.

Use a real, approved portrait or working photograph if it helps. A downloadable CV should exist only when there is an actual maintained document to offer.

### Contact

Direct email must remain visible and usable without the form. Keep the actual published address unless Henry changes it. Do not force every visitor through an assignment questionnaire.

The desired default form is Name, Email, Message, and an optional inquiry category. If an inquiry category is used, allow a general inquiry rather than requiring a commercial classification. Assignment-specific details can be exposed only when useful or behind a clearly labelled optional disclosure.

Before modifying the form, inspect its endpoint, validation, conditional fields, bot protection, success/error messages, and no-JavaScript behavior. Preserve working functionality. The public text alone does not establish a visibility bug. [S4]

Test form behavior with interception or mocks before any live submission. A real message submission requires explicit authorization. Hidden irrelevant fields must not prevent submission or be sent as misleading stale values. Preserve useful user-entered content on an error and provide an email fallback.

## 7. Visual system: defaults for the prototype

These values are adjustable starting tokens, not evidence that a particular measurement is best.

| Role | Proposed starting point |
|---|---|
| Page canvas | Neutral white, `#FFFFFF`. |
| Primary text | `#171717`. |
| Secondary text | `#595959`, not low-contrast pale gray. |
| Decorative divider | `#DEDEDE`; not the sole visual boundary of an essential control. |
| Viewer canvas | Neutral near-black, initially `#141414`; compare against the work. |
| Body text | Approximately `1.125rem`, line height around 1.5–1.6. |
| Navigation and metadata | Approximately `0.9375–1rem`; do not make usability depend on tiny type. |
| Project/page titles | Fluid within roughly `2–4rem`, tested with real titles. |
| Prose measure | About 55–65 characters as an initial limit. |
| Spacing vocabulary | A small set based on 8, 16, 24, 40, 64, 96, and 144 CSS px at the default root size. Use responsive/relative expressions rather than fixed large mobile gaps. |
| Page gutters | Start around 20 px on narrow phones and 40–64 px on larger viewports, then inspect. |
| Interactive target goal | At least 44 by 44 CSS px for main standalone controls where practical. This is our comfort target, not the WCAG 2.2 AA minimum. |

The final choice of typeface remains a bounded prototype decision. Test at most two treatments with the same images and content: a restrained sans-serif treatment and a restrained serif/sans pairing. Check the actual family license and loading cost before adoption. No paid font purchase is assumed. No font files are included in this handoff.

Use image frames without decorative shadows, gradients, rounded-card containers, or text laid across the photograph by default. These are project-specific stylistic choices, not rules that all such treatments are inherently unprofessional.

The internal grid may use 12 columns on desktop if helpful, but the implementation is free to use a simpler structure that produces the accepted result. On mobile, preserve image order and recompute sizes rather than reproducing desktop offsets at miniature scale.

Never force a portrait into a landscape hero crop solely to fill the screen. Full photographic aspect ratios are the default. Approved thumbnail or social crops must be separate deliberate exceptions. Height limits should fit the actual viewport and header; an arbitrary 88% viewport hero is not a requirement.

## 8. Interaction contract

### Image viewer: required behavior, existing code first

Inspect the existing viewer before replacing it. Retain proven features unless they conflict with an accepted design or accessibility requirement.

The viewer is an optional enhanced way to inspect a photograph. It must provide visible close and previous/next controls, position within the project, and an intelligible image description. In the prototype, navigation follows the authored sequence and shows an end state rather than silently looping.

Keyboard focus enters the viewer, remains within it while it is modal, and returns to the invoking photograph when it closes. Escape closes it. Background content must not remain interactable under a modal. These requirements follow W3C's dialog guidance. [S8]

The close control must not vanish on an inactivity timer. Captions and controls must be available without hovering. Swiping is a supplement to buttons, not the only navigation method. Do not block ordinary browser zoom. Do not implement elaborate custom pinch/pan gestures merely for novelty.

Closing restores the prior page position. Avoid adding a browser-history entry for every next-image action. Preserve any existing useful deep-link behavior only after testing it; do not invent a modal routing subsystem for the first release.

Images load in appropriate sizes. Opening one image must not eagerly fetch every project at full viewer resolution. Include useful failure and loading states rather than a permanent spinner or empty overlay.

### A second gallery view: optional experiment

The working control labels for the prototype are **Sequence / All images**. Test whether people understand them without explanation. Retain Index as a possible label only if testing supports it.

Both views must use one authoritative image list, identical ordering, and the same image IDs. Do not create two manually maintained galleries. Avoid downloading duplicate full-size photographs when switching views.

Switching should preserve a logical place in the project, not reset a viewer midway through the work to the top. On phones the overview will usually need fewer columns and readable touch targets; the exact geometry must be tested.

A layout change is sufficient. Animated tile rearrangement is not required. Disable unnecessary motion under `prefers-reduced-motion`. [S14]

Keep the feature only if it helps people scan or revisit images without confusion and without excessive implementation or maintenance burden. The first refined release can ship without it.

### Motion

Use brief feedback for links or viewer opening only when useful. Around 150–200 ms is a prototype starting point, not a requirement. Photographs must not remain invisible until a scroll animation fires. No forced scroll speed, parallax, autoplay, or animated entry gate.

## 9. Photographic curation and publishing control

The opener and final project order remain decisions about photographs, not typography. Do not replace the current homepage image merely because its public description mentions dramatic lighting. Its suitability has not been visually adjudicated in this review.

Compare a small set of real opener candidates for identity, emotional specificity, relation to the rest of the work, mobile legibility, and willingness to publish. Select the layout and crop together. Do not choose solely for visual spectacle or solely because a project title seems important.

Record each chosen image's project, stable identifier, order, layout role, alt text, optional caption, approved crop policy, and publication status. Dates, places, and names must be verified rather than inferred from filenames or current year.

Do not generate substitute portfolio photographs or add a stock image just to make a mockup impressive. When Henry's assets are unavailable, retain an explicitly labelled internal placeholder and do not claim the composition has been validated.

Family and sensitive images require an intentional publication review. Do not introduce exact home locations, child-identifying details, hidden GPS metadata, or private master files. Draft/unlisted assets must not be treated as private simply because they lack navigation links. Keep nonpublic originals outside publicly deployed assets and public repository history.

Henry retains final editorial control. Codex may flag missing information but must not silently rewrite statements, choose new public images, recrop photographs, infer subjects' identities, or invent artistic intentions.

## 10. Image delivery and color

Use a repeatable delivery workflow based on finished, approved exports, not automatic processing of RAW files or archival scans. Preserve originals outside the delivery process. Generate only the necessary web derivatives and document the command or steps Henry will use.

Use appropriate responsive sources, intrinsic dimensions, and loading priorities: the main initial photograph is not lazy-loaded; offscreen images can be. Reserve image space to prevent page movement, and ensure the declared display sizes match the accepted layouts. These practices follow web.dev's responsive-image guidance. [S9]

Begin with a tested JPEG delivery baseline and compare modern-format derivatives only where they retain photographic quality and produce a worthwhile transfer reduction. AVIF is not mandatory. Evaluate skin, smooth gradients, deep shadows, fine grain, and saturated detail rather than accepting one compression setting for all images.

A color-managed sRGB web-export set is the proposed baseline. Adobe recommends sRGB for web preparation and distinguishes conversion from merely assigning a profile. [S17, S18] Do not relabel Adobe RGB or another source as sRGB without conversion. Do not change Henry's archival working-space policy or Photoshop defaults as part of a website redesign.

Inspect profile handling in the actual image toolchain. Retain or correctly transform the information needed for intended color while removing sensitive metadata. Do not strip everything indiscriminately or promise identical appearance on every uncalibrated display.

Provisional initial-page budgets for discussion after the baseline audit are approximately 1.5 MB transferred on the mobile homepage's initial view and 75 KB compressed of first-party JavaScript. Record the viewport, device pixel ratio, cache state, measurement window, and network conditions. These are guardrails, not measurements or reasons to damage the pictures. A documented quality exception is preferable to destructive compression.

## 11. Accessibility and performance acceptance

Aim to implement WCAG 2.2 AA requirements applicable to the site. An automated checker alone is not a conformance determination. The following are the most relevant engineering and review checks, not an exhaustive legal certification.

| Area | Required check |
|---|---|
| Image alternatives | Meaningful alternatives for informative photographs; decorative alternatives only when truly appropriate. Keep artistic captions separate from visual descriptions. [S12] |
| Text contrast | At least 4.5:1 for ordinary text and 3:1 for qualifying large text. [S10] |
| Pointer targets | Meet the WCAG 2.2 AA minimum of 24 by 24 CSS px or a valid exception; use the larger project target for main controls where practical. [S11] |
| Keyboard and focus | All functions operable without a mouse, visible focus, no accidental traps outside an active modal, and no hidden focus beneath a header. [S8, S13] |
| Reflow and zoom | Check narrow layouts down to 320 CSS px and zoomed text/page behavior without losing content or controls. [S15] |
| Motion | Respect the reduced-motion preference; no hidden work awaiting animation. [S14] |
| Forms | Visible labels, clear required status, relevant fields, comprehensible validation, persistent input after failure, and fallback email. |
| JavaScript failure | Core navigation, project content, and a route to contact remain usable. |
| Browser/device review | Real phone and desktop checks as available; clearly label emulation and unavailable environments. |

The production performance objectives are LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1 at the 75th percentile, segmented by mobile and desktop. These are Google's published Core Web Vitals targets. [S16]

Before launch, use repeatable lab comparisons and interaction checks. Do not claim a field-performance pass from one Lighthouse result. If real-user data are unavailable or insufficient, explicitly record that limitation. Compare against the current site under the same conditions.

Do not require a particular overall Lighthouse score at the expense of image quality or useful behavior. Investigate regressions and actual bottlenecks.

## 12. Maintenance and architecture

Keep the present hosting and delivery model unless the repository audit establishes a specific obstacle. Do not introduce React, Next.js, a database, a CMS, or a paid service merely to make the result feel more professional.

Prefer small reusable page and gallery primitives. Whether that means shared static markup, an existing generator, or a small build script depends on the repository. If a build step is proposed, explain the reduction in duplication and the new maintenance obligation before adopting it.

There should be one authoritative record for an image and its order. The exact file format is an implementation decision. A record needs enough information to identify the public image, its dimensions and variants, alt text, optional caption, publication eligibility, and layout role. Avoid a custom content-management application.

Henry should be able to replace a photograph, change its caption, or reorder a project without redesigning the page. A routine content edit should not require edits to several duplicated galleries or fragile CSS selectors.

Provide a brief maintenance guide with the actual repository commands, source locations, export procedure, local preview procedure, and deployment/rollback process. Do not document imagined tools or paths.

## 13. Search, sharing, and credibility

Preserve meaningful page titles and give each active project an accurate description and canonical URL appropriate to the chosen routes. Include deliberate sharing titles and approved preview imagery where supported by the existing implementation.

Use Henry Lux consistently as the public photographic name while preserving any existing necessary ownership credit. Do not scatter alternative brand spellings across browser titles and previews without a reason.

The homepage is not the only entrance. A person landing directly on Fatherhood should see the project identity, Henry's name, a route to other work, and Contact. Every project page must stand on its own.

No fabricated structured data, reviews, clients, exhibitions, physical studio address, or service claims. Verify link previews by testing the rendered metadata rather than assuming a theme provides them.

Do not add analytics or tracking to justify the redesign. Start with direct usability observation. If measurement is later useful, decide its purpose, privacy implications, and maintenance cost separately.

## 14. Validation: prove improvement with real work

Use the current site as a baseline and the same approved photographs in comparisons. Otherwise a better opening image might be mistaken for a better layout.

A small exploratory review with approximately three to five people can uncover confusion; it is not a statistically representative study. Include at least one person unfamiliar with Henry's work, and someone who might review or commission photography if available.

Give viewers a brief first look, then ask what image or subject they remember and whose site they visited. Ask them to open a project, find portraits or still life, and locate an email route. Do not explain the navigation first or lead them toward praising the design.

Observe the second gallery view only if it is prototyped. Can a viewer find a particular image, return to the sequence, and understand their location? If not, improve or omit it.

Henry's own review has equal importance: Are the photographs shown whole? Do the pairs mean something? Does the mobile presentation change the meaning or bury detail? Does the site sound like him? Would he feel comfortable sending it to an institution today?

Success is stronger recall of the work and easier relevant actions without compromising photographs. Visitor praise for an animation is not sufficient. Longer dwell time is not a goal by itself.

### Decision rule

If the compact project-first prototype is no clearer or more satisfying than the current site with modest corrections, keep the simpler version. Do not continue redesigning merely to justify prior effort.

## 15. Implementation sequence and model budget

| Stage | Concrete deliverable | Default reasoning choice | Stop condition |
|---|---|---|---|
| A. Read-only inventory | Repository map, current behavior, measured baseline where possible, reuse/repair recommendations, unresolved blockers. | Regular Codex with High reasoning if available. | Findings returned; no edits or deployment. |
| B. Bounded visual prototype | One homepage and one representative project page with real assets; at most two typography treatments. | Regular Codex for implementation; ordinary chat reasoning for review. | Henry has an inspectable desktop/mobile preview. |
| C. Interaction decision | Verified viewer behavior and optional Sequence/All images comparison. | Regular Codex; escalate only for a specific unresolved problem. | Keep or reject the extra view. |
| D. Apply accepted system | Remaining active pages, content preservation, images, metadata, and documented maintenance. | Regular Codex in small changes. | Acceptance checks pass or limitations are documented. |
| E. Release review | Cross-page checks, regression report, explicit rollout and rollback record. | High by default; Ultra only if complexity warrants. | Henry authorizes deployment. |

This Pro review establishes the bounded brief. Pro need not remain enabled for every copy or spacing decision. Further reasoning is worthwhile when new evidence exposes a consequential conflict, not simply because a step has been labelled final.

Do not automatically use Ultra for a small static-site inventory. Escalate when the actual repository reveals interacting gallery state, image-build, deployment, accessibility, or maintenance problems that benefit from deeper or parallel review. Identify the reason first.

OpenAI's documentation says Ultra may use maximum reasoning and additional agents, with usage depending on the work performed. [S19] Its personal-plan documentation distinguishes included usage from purchased credits, which extend eligible features after included limits. [S20] This document does not infer Henry's available balance, treat every chat message as a deduction from one pool, or estimate a fixed monetary cost.

Use one scoped task at a time. No automatic agent fan-out, credit purchases, paid dependencies, or unrelated refactors. The relevant question is whether the next action produces a durable improvement or resolves a real uncertainty.

## 16. Safety, release gates, and open decisions

The current website is the baseline to preserve, not disposable scaffolding. Record the actual repository, branch, commit, working-tree state, deployment configuration, and any uncommitted work. Do not import commit hashes or assumptions from Lux Darkroom.

Before approved edits, establish a recoverable checkpoint appropriate to the actual Git state and work on an isolated branch or worktree. Never erase or overwrite uncommitted work to make the repository look clean. No package installation or dependency change without a reason and authorization under the working environment's rules.

The read-only audit must not commit, rename assets, submit the Contact form, edit DNS, change hosting settings, or deploy. Later deployment is a separate explicit action after visual and functional review.

### Gates before a production release

| Gate | Evidence required |
|---|---|
| Repository correctness | The working copy and deployment target are verified as Henry's photography site. |
| Editorial integrity | Actual images, order, crops, statements, dates, and public/private status are accepted. |
| Visual prototype | Desktop and mobile presentations have been inspected; untested cases are named. |
| Functionality | Navigation, gallery, contact states, error handling, and old URLs have been checked. |
| Accessibility and performance | Manual and available automated results are reported without overstating scope. |
| Maintainability | Henry has a repeatable content-update procedure. |
| Reversibility | A specific baseline and rollback route exist. |
| Publication | Henry explicitly authorizes deployment. |

### Bounded open decisions

The remaining decisions are the opening photograph, final project order, Observation's publication readiness, exact typeface choice, whether the additional overview helps, and adjustments revealed by the actual repository. They do not justify restarting strategy research. Resolve them through the limited prototype and content review.

**Next action:** Give Codex the accompanying read-only audit prompt and this specification in the actual website workspace. The result should be evidence about the existing implementation, not another speculative redesign proposal.

## 17. Sources and provenance

All sources below were accessed September 6, 2026. Website observations refer to retrieved public page text, not a completed visual inspection. Design choices and test budgets are original recommendations in this specification. Source URLs are recorded for verification; availability and product documentation can change.

- **S1 — Henry Lux homepage:** `https://henryluxphotography.com/`
- **S2 — Henry Lux Projects:** `https://henryluxphotography.com/projects.html`
- **S3 — Henry Lux About:** `https://henryluxphotography.com/about.html`
- **S4 — Henry Lux Contact:** `https://henryluxphotography.com/contact.html`
- **S5 — Henry Lux Fatherhood:** `https://henryluxphotography.com/fatherhood.html`
- **S6 — Henry Lux Labor Creates:** `https://henryluxphotography.com/labor-creates.html`
- **S7 — Alec Soth, Sleeping by the Mississippi:** `https://alecsoth.com/photography/projects/sleeping-by-the-mississippi`
- **S8 — W3C, Dialog (Modal) Pattern:** `https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`
- **S9 — web.dev, Responsive images:** `https://web.dev/learn/design/responsive-images`
- **S10 — W3C, Contrast (Minimum):** `https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html`
- **S11 — W3C, Target Size (Minimum):** `https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html`
- **S12 — W3C, Images Tutorial:** `https://www.w3.org/WAI/tutorials/images/`
- **S13 — W3C, Focus Not Obscured (Minimum):** `https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html`
- **S14 — MDN, prefers-reduced-motion:** `https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion`
- **S15 — W3C, Reflow:** `https://www.w3.org/WAI/WCAG22/Understanding/reflow`
- **S16 — web.dev, Web Vitals:** `https://web.dev/articles/vitals`
- **S17 — Adobe, Color settings:** `https://helpx.adobe.com/photoshop/using/color-settings.html`
- **S18 — Adobe, Change color profile for documents:** `https://helpx.adobe.com/photoshop/desktop/adjust-color/color-profiles/change-color-profile-for-documents.html`
- **S19 — OpenAI, ChatGPT Rate Card:** `https://help.openai.com/en/articles/11481834-chatgpt-rate-card-business-enterpriseedu` (cited for the explanation of Ultra, not to assign Business-plan rates to Henry).
- **S20 — OpenAI, Using Credits for Flexible Usage in ChatGPT, Personal plans:** `https://help.openai.com/en/articles/12642688-using-credits-for-flexible-usage-in-chatgpt-freegopluspro-sora`
