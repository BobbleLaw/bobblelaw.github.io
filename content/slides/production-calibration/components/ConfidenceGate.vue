<template>
  <div class="confidence-wrap" aria-label="Confidence-driven calibration update gate">
    <svg viewBox="0 0 1120 430" role="img">
      <defs>
        <marker id="gate-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="#7a8790" />
        </marker>
        <marker id="gate-arrow-green" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="#168c82" />
        </marker>
      </defs>

      <g class="edge" marker-end="url(#gate-arrow)">
        <line x1="560" x2="560" y1="64" y2="94" />
        <path d="M560 136 V160 H207 V185" />
        <path d="M560 136 V185" />
        <path d="M560 136 V160 H913 V185" />
        <path d="M207 243 V272 H560" />
        <line x1="560" x2="560" y1="243" y2="272" />
        <path d="M913 243 V272 H560" />
        <line x1="560" x2="560" y1="314" y2="342" />
        <path d="M492 374 H355 V402 H291" />
      </g>
      <g class="edge accept" marker-end="url(#gate-arrow-green)">
        <path d="M628 374 H766 V402 H829" />
      </g>

      <g class="node candidate"><rect x="435" y="20" width="250" height="44"/><text x="560" y="47">Candidate calibration</text></g>
      <g class="node label"><rect x="435" y="94" width="250" height="42"/><text x="560" y="120">Quality gates</text></g>

      <g class="node gate"><rect x="92" y="185" width="230" height="58"/><text x="207" y="210">Independent metric</text><text x="207" y="230">improvement</text></g>
      <g class="node gate"><rect x="445" y="185" width="230" height="58"/><text x="560" y="210">Physical parameter</text><text x="560" y="230">plausibility</text></g>
      <g class="node gate"><rect x="798" y="185" width="230" height="58"/><text x="913" y="210">Consistency & stability</text><text x="913" y="230">across time</text></g>

      <g class="node confidence"><rect x="435" y="272" width="250" height="42"/><text x="560" y="298">Confidence</text></g>
      <g class="node decision"><polygon points="560,342 628,374 560,406 492,374"/><text x="560" y="379">Threshold</text></g>

      <g class="node reject"><rect x="176" y="380" width="230" height="44"/><text x="291" y="407">Reject · keep baseline</text></g>
      <g class="node update"><rect x="714" y="380" width="230" height="44"/><text x="829" y="407">Accept · bounded update</text></g>
    </svg>
    <div class="policy-strip">
      <span>Weak evidence <b>→ no update</b></span>
      <span>Degenerate geometry <b>→ no update</b></span>
      <span>No meaningful drift <b>→ no update</b></span>
      <span class="go">Consistent evidence <b>→ controlled update</b></span>
    </div>
  </div>
</template>

<style scoped>
.confidence-wrap { height: 415px; width: 100%; }
svg { height: 350px; overflow: visible; width: 100%; }
.edge { fill: none; stroke: #7a8790; stroke-width: 2; }
.edge.accept { stroke: #168c82; stroke-width: 2.5; }
.node rect, .node polygon { fill: #fff; stroke: #cfd8df; stroke-width: 1.5; }
.node rect { rx: 12; }
.node text { fill: #343a40; font-family: var(--cal-body); font-size: 15px; font-weight: 700; text-anchor: middle; }
.node.candidate rect { fill: #343a40; stroke: #343a40; }
.node.candidate text { fill: #fff; }
.node.label rect, .node.confidence rect { fill: #e6f1ff; stroke: #007bff; }
.node.reject rect { fill: #fbeaea; stroke: #b64242; }
.node.reject text { fill: #b64242; }
.node.update rect { fill: #e4f4f1; stroke: #168c82; }
.node.update text { fill: #168c82; }
.policy-strip { display: grid; gap: 8px; grid-template-columns: repeat(4, 1fr); margin-top: 2px; }
.policy-strip span { background: var(--cal-surface-soft); border-radius: 8px; color: var(--cal-muted); font-size: 11px; padding: 8px 10px; text-align: center; }
.policy-strip b { color: var(--cal-danger); }
.policy-strip .go { background: var(--cal-teal-soft); }
.policy-strip .go b { color: var(--cal-teal); }
</style>
