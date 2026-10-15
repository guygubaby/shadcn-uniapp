# Website motion

Reference: [Cuberto](https://cuberto.com/), adapted to this product with the existing Vue Router, motion-v, Tailwind, and native scrolling.

| Effect | Owner | Trigger and verification | Reduced motion |
| --- | --- | --- | --- |
| Masked words | RevealText | Initial and route entry; observed nonzero word translation during entry | Readable static words |
| Content reveals | RevealBlock | Once in view, coordinated with route readiness | Immediate content |
| Rising fill and rolling label | MarketingLink | Hover and keyboard focus | Immediate feedback |
| White route cover and outgoing lift | RouteStage | Bottom-up cover, covered swap, opacity reveal; observed intermediate scale and lift | Direct navigation after Vue patch |
| Flexible rule | ElasticDivider | Fine pointer; observed curved SVG path and release | Straight rule |
| Pointer follower | SiteCursor | Fine pointer on marketing routes; observed position and opacity | Hidden; native pointer retained |
| Block change | Blocks page | Local reveal without reloading the iframe | Immediate content |

The Creator canvas keeps its controls direct. Native scrolling remains the sole scroll owner. Browser checks cover route Back during a transition, reduced-motion navigation, 390px layout, shared theme and locale changes, student selection, and message read state. This adapts selected interactions; it does not reproduce Cuberto's authored footage or entire agency site.
