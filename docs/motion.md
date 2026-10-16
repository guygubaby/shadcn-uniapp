# Website motion

Reference: [Cuberto](https://cuberto.com/), adapted to this product with the existing Vue Router, motion-v, Tailwind, and native scrolling.

| Effect                              | Owner          | Trigger and verification                                                            | Reduced motion                    |
| ----------------------------------- | -------------- | ----------------------------------------------------------------------------------- | --------------------------------- |
| Masked words                        | RevealText     | Initial and route entry; observed nonzero word translation during entry             | Readable static words             |
| Content reveals                     | RevealBlock    | Once in view, coordinated with route readiness                                      | Immediate content                 |
| Rising fill and rolling label       | MarketingLink  | Hover and keyboard focus                                                            | Immediate feedback                |
| Theme-colored route cover and outgoing lift | RouteStage     | Bottom-up cover follows the site background in light / dark mode; covered swap and opacity reveal | Direct navigation after Vue patch |
| Flexible rule                       | ElasticDivider | Fine pointer; observed curved SVG path and release                                  | Straight rule                     |
| Pointer follower                    | SiteCursor     | Fine pointer on marketing routes; observed position and opacity                     | Hidden; native pointer retained   |
| Block change                        | Blocks page    | Local reveal without reloading the iframe                                           | Immediate content                 |

The Creator canvas keeps its controls direct. Native scrolling remains the sole scroll owner. Browser checks cover route Back during a transition, reduced-motion navigation, 390px layout, shared theme and locale changes, student selection, and message read state. This adapts selected interactions; it does not reproduce Cuberto's authored footage or entire agency site.

## Extended site motion

This pass keeps the Cuberto reference and native scrolling. It adds no dependency and does not animate Wot component colors, values, or internal elements.

| Effect                                   | Owner                                | Trigger / observed intermediate state                                                                                                 | Fallback                                                                     | Status  |
| ---------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------- |
| Localized masked prose                   | RevealText / splitRevealText         | First-load H1 transforms measured at 89–90px, then none; route copy readable after cover                                              | Word / whitespace fallback preserving emoji; visible static reduced motion   | adapted |
| Card contraction and staged entrances    | RevealBlock                          | Home / Blocks cards, Creator controls and six Docs sections rendered; 390px without horizontal overflow                               | Static reduced motion, normal keyboard focus                                 | adapted |
| Reversible preview / story drift         | ScrollSurface / native view timeline | At scrollY 0 / 650 / 0, hero surface y changed 0.36 / -17.61 / 0.36px                                                                 | Static in browsers without both timeline and range support                   | adapted |
| Reading progress and anchor scrolling    | App / native root scroll timeline    | At scrollY 0 / 650 / 0, progress scale changed 0 / .467 / 0; Docs anchor content visible                                              | Progress hidden without timeline support; reduced motion uses direct anchors | adapted |
| Preview card arrival and hover elevation | GallerySection                       | 74 H5 cards; entering card opacity .657 / .790 observed, settled 1; transform remains none                                            | Static cards without timelines or with reduced motion; no miniapp animation  | adapted |
| Mobile navigation disclosure             | SiteMenu / ExpandPanel               | Open height 133px; closing 115px and inert; reverse reopens; Escape restores trigger focus; route works                               | Direct reduced-motion disclosure; links remain semantic                      | adapted |
| Source disclosure                        | Blocks / ExpandPanel                 | Open 684 → 687px; closing 5px and inert; reverse 684px with inert cleared                                                             | Direct reduced-motion disclosure; closing content inert                      | adapted |
| Creator drawer                           | CreatorWorkbench / Vue Transition    | 390px entry translate -.54%, then 0; exit settles display none; Escape returns focus after preview inert clears                       | Direct reduced motion; preview inert while mobile drawer is open             | adapted |
| Header, theme / lock icons, controls     | App / CreatorPicker / Button         | Header / language / theme / lock animation wired; native input and selected theme response checked; all press variants share one rule | Static reduced motion; native controls and focus rings                       | adapted |
| Dialog, popover, tab content             | Shared data-slot CSS                 | Dialog entry opacity .995 / exit .851 with panel-out retained; tabs and picker panel-in observed; reduced motion removes animations   | No animation under reduced motion; Reka owns presence and focus              | adapted |
| Footer and error page                    | RevealBlock / RevealText             | Shared reveal wired; dedicated footer / 404 intermediate frames not separately captured                                               | Readable static reduced motion                                               | adapted |

Authored video, agency service expansion, hover footage and an added FAQ are omitted: this product has no corresponding content. The site retains its existing white route cover, outgoing lift, elastic rules and contextual pointer. View-timeline effects are progressive enhancement and do not install a scroll polyfill.

Validation: production site and H5 builds passed; four localized text tests passed (including punctuation attachment). Browser checks used Codex browser at 1440×1000 and 390×844, including live reduced-motion switching (card opacity 1, animation none), menu reversal, drawer focus restoration, source disclosure reversal and route return. Real devices, Safari / Firefox, screen readers and a production performance trace were not checked. Raw CDP animation playback-rate control was unavailable; intermediate states above were observed at normal playback speed.

## Theme switch

The shared ThemeToggle uses a 650ms circular View Transition originating at the header button. The icon has its own named snapshot and rotation. A same-origin acknowledgement waits for the Wot preview to apply its mode before the new snapshot; a 180ms timeout lets an unloaded preview fall back without blocking the page. No animation frame is awaited inside the capture callback, because rendering is paused during capture. Unsupported browsers and reduced motion update directly.

Observed in the production build: dark and light intermediate circle radii around 855px; icon rotation matrix was nonidentity; iframe mode was already dark at reveal start. Enter-key switching and a repeated click settled with the expected mode and aria-busy=false. Reduced motion switched directly, without a transition marker, and the preview followed. Two acknowledgement tests cover wrong origin / source / mode, listener cleanup and timeout.

The route backdrop is present only while covering the outgoing page. During the incoming reveal it is already transparent; only the fill fades out. The fill uses the site's background token, staying white in light mode and dark in dark mode. Earlier browser samples confirmed a 30% black outgoing backdrop and an incoming fill opacity of .803 above a fully opaque new page, followed by no cover, inert state, or scroll lock.
