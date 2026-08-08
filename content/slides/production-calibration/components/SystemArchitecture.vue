<template>
  <div class="architecture-wrap" aria-label="Calibration lifecycle architecture">
    <svg viewBox="0 0 1120 470" role="img">
      <defs>
        <marker id="arch-arrow-blue" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="#007bff" />
        </marker>
        <marker id="arch-arrow-teal" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="#168c82" />
        </marker>
      </defs>

      <text class="lane-label blue" x="34" y="35">OFFLINE · FACTORY BASELINE</text>
      <line class="lane-rule blue-stroke" x1="34" x2="1086" y1="51" y2="51" />

      <g class="edge blue-stroke" marker-end="url(#arch-arrow-blue)">
        <line x1="184" x2="252" y1="127" y2="127" />
        <line x1="412" x2="480" y1="127" y2="127" />
        <line x1="640" x2="708" y1="127" y2="127" />
        <line x1="868" x2="936" y1="127" y2="127" />
        <line x1="1011" x2="1011" y1="172" y2="241" />
      </g>

      <g class="node"><rect x="34" y="85" width="150" height="84"/><text x="109" y="132">Sensors</text></g>
      <g class="node"><rect x="252" y="85" width="160" height="84"/><text x="332" y="118">Data</text><text x="332" y="141">Collection</text></g>
      <g class="node primary"><rect x="480" y="85" width="160" height="84"/><text x="560" y="132">Calibration</text></g>
      <g class="node"><rect x="708" y="85" width="160" height="84"/><text x="788" y="132">Validation</text></g>
      <g class="node"><rect x="936" y="85" width="150" height="84"/><text x="1011" y="118">Calibration</text><text x="1011" y="141">DB</text></g>

      <g class="node device"><rect x="936" y="241" width="150" height="78"/><text x="1011" y="285">Device</text></g>

      <text class="lane-label teal" x="34" y="263">ONLINE · RUNTIME ASSURANCE</text>
      <line class="lane-rule teal-stroke" x1="34" x2="876" y1="279" y2="279" />

      <g class="edge teal-stroke" marker-end="url(#arch-arrow-teal)">
        <line x1="184" x2="252" y1="356" y2="356" />
        <line x1="412" x2="480" y1="356" y2="356" />
        <line x1="640" x2="708" y1="356" y2="356" />
        <path d="M868 356 H902 V280 H936" fill="none" />
      </g>

      <g class="node"><rect x="34" y="317" width="150" height="78"/><text x="109" y="361">Localization</text></g>
      <g class="node online"><rect x="252" y="317" width="160" height="78"/><text x="332" y="349">Online</text><text x="332" y="372">Monitor</text></g>
      <g class="node online"><rect x="480" y="317" width="160" height="78"/><text x="560" y="361">Estimate</text></g>
      <g class="node online"><rect x="708" y="317" width="160" height="78"/><text x="788" y="349">Validate</text><text x="788" y="372">+ Update</text></g>

      <path class="branch teal-stroke" d="M1011 319 V430 H109" fill="none" marker-end="url(#arch-arrow-teal)" />
      <text class="branch-label" x="512" y="452">trusted parameters return to runtime</text>
    </svg>
  </div>
</template>

<style scoped>
.architecture-wrap { height: 430px; width: 100%; }
svg { height: 100%; overflow: visible; width: 100%; }
.lane-label { font-family: var(--cal-display); font-size: 13px; font-weight: 800; letter-spacing: .12em; }
.lane-label.blue { fill: #007bff; }
.lane-label.teal { fill: #168c82; }
.lane-rule { stroke-width: 2; }
.blue-stroke { stroke: #007bff; }
.teal-stroke { stroke: #168c82; }
.edge { fill: none; stroke-width: 2.5; }
.node rect { fill: #fff; stroke: #cfd8df; stroke-width: 1.5; rx: 14; }
.node text { fill: #343a40; font-family: var(--cal-body); font-size: 17px; font-weight: 700; text-anchor: middle; }
.node.primary rect { fill: #e6f1ff; stroke: #007bff; }
.node.online rect { fill: #e4f4f1; stroke: #168c82; }
.node.device rect { fill: #343a40; stroke: #343a40; }
.node.device text { fill: #fff; }
.branch { stroke-dasharray: 7 6; stroke-width: 2; }
.branch-label { fill: #6c757d; font-family: var(--cal-body); font-size: 12px; text-anchor: middle; }
</style>
