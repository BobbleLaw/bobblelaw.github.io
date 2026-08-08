<template>
  <div class="testing-pyramid" aria-label="Three validation layers">
    <svg viewBox="0 0 460 350" role="img">
      <polygon class="fleet" points="50,300 410,300 350,225 110,225" />
      <polygon class="system" points="110,215 350,215 300,140 160,140" />
      <polygon class="algorithm" points="160,130 300,130 230,35" />
      <text class="tier-title light" x="230" y="82">Algorithm</text>
      <text class="tier-copy light" x="230" y="102">geometry makes sense</text>
      <text class="tier-title" x="230" y="174">System</text>
      <text class="tier-copy" x="230" y="194">localization remains stable</text>
      <text class="tier-title" x="230" y="261">Fleet</text>
      <text class="tier-copy" x="230" y="281">field metrics do not regress</text>
    </svg>
  </div>
</template>

<style scoped>
.testing-pyramid { height: 290px; }
svg { height: 100%; width: 100%; }
polygon { stroke-width: 1.5; }
.algorithm { fill: #007bff; stroke: #007bff; }
.system { fill: #e6f1ff; stroke: #9bc9ff; }
.fleet { fill: #e4f4f1; stroke: #8fcac3; }
text { fill: #343a40; font-family: var(--cal-body); text-anchor: middle; }
.tier-title { font-size: 17px; font-weight: 800; }
.tier-copy { fill: #6c757d; font-size: 11px; }
.light { fill: #fff; }
</style>
