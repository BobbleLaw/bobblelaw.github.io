<template>
  <svg class="production-architecture" viewBox="0 0 760 420" role="img" aria-label="Production software architecture">
    <defs>
      <marker id="production-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
        <path d="M0,0 L8,4 L0,8 Z" fill="#66737c" />
      </marker>
    </defs>
    <g class="edges" marker-end="url(#production-arrow)">
      <line x1="380" x2="380" y1="166" y2="214" />
      <path d="M380 250 V282 H142 V316" />
      <line x1="380" x2="380" y1="250" y2="316" />
      <path d="M380 282 H618 V316" />
    </g>
    <g class="core">
      <rect x="190" y="34" width="380" height="132" rx="17" />
      <text class="core-title" x="380" y="68">Calibration Core</text>
      <line x1="225" x2="535" y1="85" y2="85" />
      <text x="380" y="112">Geometry · Optimization</text>
      <text x="380" y="140">Metrics · Validation</text>
    </g>
    <g class="api">
      <rect x="265" y="214" width="230" height="36" rx="10" />
      <text x="380" y="238">Stable C++ APIs</text>
    </g>
    <g class="consumer-boxes">
      <rect x="45" y="316" width="194" height="68" rx="13" />
      <rect x="283" y="316" width="194" height="68" rx="13" />
      <rect x="521" y="316" width="194" height="68" rx="13" />
    </g>
    <g class="consumer-labels">
      <text x="142" y="357">Device Runtime</text>
      <text x="380" y="348">Factory Tool</text><text class="minor" x="380" y="369">Qt / UI</text>
      <text x="618" y="348">Offline Analysis</text><text class="minor" x="618" y="369">datasets + replay</text>
    </g>
  </svg>
</template>

<style scoped>
.production-architecture { height: 390px; width: 100%; }
.edges { fill: none; stroke: #66737c; stroke-width: 2; }
.core rect { fill: #e6f1ff; stroke: #007bff; stroke-width: 2; }
.core line { stroke: #9bc9ff; }
.core text { fill: #343a40; font-family: var(--cal-body); font-size: 16px; font-weight: 700; text-anchor: middle; }
.core .core-title { fill: #007bff; font-size: 20px; font-weight: 800; }
.api rect { fill: #343a40; }
.api text { fill: #fff; font-family: var(--cal-body); font-size: 14px; font-weight: 700; text-anchor: middle; }
.consumer-boxes rect { fill: #fff; stroke: #cfd8df; stroke-width: 1.5; }
.consumer-labels text { fill: #343a40; font-family: var(--cal-body); font-size: 15px; font-weight: 750; text-anchor: middle; }
.consumer-labels .minor { fill: #6c757d; font-size: 12px; font-weight: 600; }
</style>
