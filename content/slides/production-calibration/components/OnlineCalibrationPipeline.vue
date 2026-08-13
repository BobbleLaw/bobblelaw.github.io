<template>
  <div class="pipeline-wrap" aria-label="Online calibration pipeline">
    <svg viewBox="0 0 1596 455" role="img">
      <defs>
        <marker id="online-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="#66737c" />
        </marker>
        <marker id="online-arrow-teal" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="#168c82" />
        </marker>
      </defs>

      <g class="stage-label">
        <text x="266" y="32">1 · OBSERVATION</text>
        <text x="798" y="32">2 · ESTIMATION</text>
        <text x="1330" y="32">3 · DECISION</text>
      </g>
      <line class="divider" x1="532" x2="532" y1="12" y2="432" />
      <line class="divider" x1="1064" x2="1064" y1="12" y2="432" />

      <g class="edge" marker-end="url(#online-arrow)">
        <line x1="266" x2="266" y1="104" y2="131" />
        <line x1="266" x2="266" y1="197" y2="224" />
        <line x1="266" x2="266" y1="290" y2="316" />
        <path d="M348 351 H580 V93 H698" />
        <line x1="798" x2="798" y1="126" y2="318" />
        <path d="M898 351 H1110 V93 H1230" />
        <line x1="1330" x2="1330" y1="126" y2="176" />
      </g>
      <g class="edge accepted" marker-end="url(#online-arrow-teal)">
        <line x1="1330" x2="1330" y1="242" y2="290" />
        <line x1="1330" x2="1330" y1="356" y2="389" />
      </g>
      <path class="reject-edge" d="M184 351 H157" marker-end="url(#online-arrow)" />
      <path class="reject-edge" d="M1412 209 H1439" marker-end="url(#online-arrow)" />

      <g class="node"><rect x="166" y="62" width="200" height="42"/><text x="266" y="88">Normal runtime data</text></g>
      <g class="node"><rect x="166" y="131" width="200" height="66"/><text x="266" y="170">Feature tracking</text></g>
      <g class="node"><rect x="166" y="224" width="200" height="66"/><text x="266" y="252">Geometric</text><text x="266" y="273">constraints</text></g>
      <g class="node decision"><polygon points="266,316 348,351 266,386 184,351"/><text x="266" y="347">Observable?</text><text class="minor" x="266" y="366">good geometry</text></g>
      <g class="node muted"><rect x="81" y="330" width="76" height="42"/><text x="119" y="356">Discard</text></g>

      <g class="node primary"><rect x="698" y="60" width="200" height="66"/><text x="798" y="99">Estimation</text></g>
      <g class="node"><rect x="698" y="318" width="200" height="66"/><text x="798" y="347">Candidate</text><text x="798" y="368">Δ calibration</text></g>
      <g class="node primary"><rect x="1230" y="60" width="200" height="66"/><text x="1330" y="99">Confidence gate</text></g>
      <g class="node decision"><polygon points="1330,176 1412,209 1330,242 1248,209"/><text x="1330" y="214">Trust it?</text></g>
      <g class="node accepted"><rect x="1230" y="290" width="200" height="66"/><text x="1330" y="329">Bounded update</text></g>
      <g class="node device"><rect x="1230" y="389" width="200" height="42"/><text x="1330" y="415">Production runtime</text></g>
      <g class="node muted"><rect x="1439" y="188" width="76" height="42"/><text x="1477" y="214">Reject</text></g>
      <text class="branch-label yes" x="1344" y="275">accept</text>
    </svg>
  </div>
</template>

<style scoped>
.pipeline-wrap { height: 328px; width: 100%; }
svg { height: 100%; overflow: visible; width: 100%; }
.stage-label text { fill: #007bff; font-family: var(--cal-display); font-size: 13px; font-weight: 800; letter-spacing: .1em; text-anchor: middle; }
.divider { stroke: #dbe2e7; stroke-dasharray: 4 7; }
.edge { fill: none; stroke: #66737c; stroke-width: 2; }
.edge.accepted { stroke: #168c82; stroke-width: 2.5; }
.reject-edge { fill: none; stroke: #9aa5ad; stroke-dasharray: 5 5; stroke-width: 2; }
.node rect, .node polygon { fill: #fff; stroke: #cfd8df; stroke-width: 1.5; }
.node rect { rx: 12; }
.node text { fill: #343a40; font-family: var(--cal-body); font-size: 15px; font-weight: 700; text-anchor: middle; }
.node .minor { fill: #6c757d; font-size: 10px; font-weight: 600; }
.node.primary rect { fill: #e6f1ff; stroke: #007bff; }
.node.accepted rect { fill: #e4f4f1; stroke: #168c82; }
.node.muted rect { fill: #edf2f6; }
.node.muted text { fill: #6c757d; }
.node.device rect { fill: #343a40; stroke: #343a40; }
.node.device text { fill: #fff; }
.annotation text { fill: #6c757d; font-family: var(--cal-body); font-size: 13px; font-weight: 600; text-anchor: middle; }
.branch-label { fill: #6c757d; font-family: var(--cal-body); font-size: 11px; font-weight: 700; }
.branch-label.yes { fill: #168c82; }
</style>
