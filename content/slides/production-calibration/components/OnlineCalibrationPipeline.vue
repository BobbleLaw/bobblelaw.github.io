<template>
  <div class="pipeline-wrap" aria-label="Online calibration pipeline">
    <svg viewBox="0 0 1160 455" role="img">
      <defs>
        <marker id="online-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="#66737c" />
        </marker>
        <marker id="online-arrow-teal" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="#168c82" />
        </marker>
      </defs>

      <g class="stage-label">
        <text x="164" y="32">1 · OBSERVATION</text>
        <text x="580" y="32">2 · ESTIMATION</text>
        <text x="986" y="32">3 · DECISION</text>
      </g>
      <line class="divider" x1="374" x2="374" y1="12" y2="432" />
      <line class="divider" x1="783" x2="783" y1="12" y2="432" />

      <g class="edge" marker-end="url(#online-arrow)">
        <line x1="164" x2="164" y1="104" y2="131" />
        <line x1="164" x2="164" y1="197" y2="224" />
        <line x1="164" x2="164" y1="290" y2="316" />
        <path d="M246 351 H410 V91 H480" />
        <line x1="580" x2="580" y1="126" y2="169" />
        <line x1="580" x2="580" y1="235" y2="278" />
        <path d="M680 317 H818 V91 H886" />
        <line x1="986" x2="986" y1="126" y2="176" />
      </g>
      <g class="edge accepted" marker-end="url(#online-arrow-teal)">
        <line x1="986" x2="986" y1="242" y2="290" />
        <line x1="986" x2="986" y1="356" y2="389" />
      </g>
      <path class="reject-edge" d="M904 209 H837 V371 H761" marker-end="url(#online-arrow)" />
      <path class="reject-edge" d="M82 351 H36 V403 H110" marker-end="url(#online-arrow)" />

      <g class="node"><rect x="64" y="62" width="200" height="42"/><text x="164" y="88">Normal runtime data</text></g>
      <g class="node"><rect x="64" y="131" width="200" height="66"/><text x="164" y="170">Feature tracking</text></g>
      <g class="node"><rect x="64" y="224" width="200" height="66"/><text x="164" y="252">Geometric</text><text x="164" y="273">constraints</text></g>
      <g class="node decision"><polygon points="164,316 246,351 164,386 82,351"/><text x="164" y="347">Observable?</text><text class="minor" x="164" y="366">good geometry</text></g>
      <g class="node muted"><rect x="110" y="390" width="108" height="42"/><text x="164" y="416">Discard</text></g>

      <g class="node primary"><rect x="480" y="60" width="200" height="66"/><text x="580" y="99">Estimation</text></g>
      <g class="node"><rect x="480" y="169" width="200" height="66"/><text x="580" y="198">Candidate</text><text x="580" y="219">Δ calibration</text></g>
      <g class="annotation"><text x="580" y="294">What change best</text><text x="580" y="313">explains the evidence?</text></g>

      <g class="node primary"><rect x="886" y="60" width="200" height="66"/><text x="986" y="99">Confidence gate</text></g>
      <g class="node decision"><polygon points="986,176 1068,209 986,242 904,209"/><text x="986" y="214">Trust it?</text></g>
      <g class="node accepted"><rect x="886" y="290" width="200" height="66"/><text x="986" y="329">Bounded update</text></g>
      <g class="node device"><rect x="886" y="389" width="200" height="42"/><text x="986" y="415">Production runtime</text></g>
      <text class="branch-label" x="815" y="359">reject</text>
      <text class="branch-label yes" x="1000" y="275">accept</text>
    </svg>
  </div>
</template>

<style scoped>
.pipeline-wrap { height: 410px; width: 100%; }
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
