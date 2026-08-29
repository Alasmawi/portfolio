// Canvas size for each K9 diagram layout, and the container width at which the
// wide one becomes usable.
//
// This lives outside K9Flow.jsx because K9Flow is lazy-loaded: K9Architecture
// needs the height to reserve space for the Suspense fallback without pulling
// React Flow into the main bundle.
//
// The numbers are not arbitrary. The diagram's container is *not* a function of
// the viewport — the projects panel puts a 264px sidebar in at 768px, which
// collapses the preview pane from 570px to 342px, and the panel itself caps at
// max-w-6xl. Measured container widths:
//
//   viewport  360  390  414  480  560  640  700 |768  820  900 1024 1152 1280+
//   container 274  304  328  394  474  510  570 |342  394  474  598  726  838
//                                                ^ sidebar appears
//
// So a layout chosen by `(min-width: 640px)` — as this diagram used to be —
// hands the widest graph to the *narrowest* containers in the range. That is
// what was scaling it to 0.35–0.60 and shrinking the labels to 4–9px.
export const WIDE_MIN_CONTAINER = 560;

// Both layouts are portrait, and the same height on purpose — crossing the
// breakpoint changes the drawing's width, never the space it occupies, so the
// panel around it doesn't jump.
//
// A left-to-right rank flow needs five card columns, which is ~650–950px of
// width; the container never exceeds 838px and is usually far less. Flowing
// top-to-bottom and spending the spare width on *rows* is what lets both
// layouts render at scale 1.0 instead of being shrunk to fit.
export const CANVAS = {
  compact: { w: 300, h: 552 },
  wide: { w: 560, h: 552 },
};
