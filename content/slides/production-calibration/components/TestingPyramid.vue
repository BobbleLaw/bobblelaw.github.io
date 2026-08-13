<template>
  <div class="testing-pyramid" aria-label="Three validation layers">
    <svg viewBox="0 0 460 350" role="img">
      <polygon class="fleet" points="42,304 418,304 360,220 100,220" />
      <polygon class="system" points="100,220 360,220 300,132 160,132" />
      <polygon class="algorithm" points="160,132 300,132 230,30" />
      <text class="tier-title algorithm-title light" x="230" y="102">Baseline</text>
      <text class="tier-title system-title" x="230" y="178">System</text>
      <text class="tier-copy system-copy" x="230" y="200">downstream applications remain stable</text>
      <text class="tier-title fleet-title" x="230" y="263">Integration</text>
      <text class="tier-copy fleet-copy" x="230" y="288">field metrics do not regress</text>
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
.tier-title { font-weight: 800; }
.tier-copy { fill: #6c757d; }
.algorithm-title { font-size: 12px; }
.system-title { font-size: 18px; }
.system-copy { font-size: 10px; }
.fleet-title { font-size: 24px; }
.fleet-copy { font-size: 12px; }
.light { fill: #fff; }
</style>
