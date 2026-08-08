<template>
  <div class="observability" aria-label="Observability information matrix diagram">
    <div class="math-node">Observations</div>
    <div class="arrow">↓</div>
    <div class="math-node symbol">Jacobian <i>J</i></div>
    <div class="arrow">↓</div>
    <div class="math-node symbol">Jᵀ W J</div>
    <div class="fork">
      <div class="fork-line"></div>
      <div class="fork-options">
        <div class="outcome good"><strong>well-conditioned</strong><span>informative</span></div>
        <div class="outcome poor"><strong>poorly-conditioned</strong><span>degenerate</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.observability { align-items: center; display: flex; flex-direction: column; padding-top: 3px; }
.math-node { background: #fff; border: 1px solid var(--cal-line); border-radius: 10px; font-size: 14px; font-weight: 700; padding: 9px 18px; text-align: center; width: 170px; }
.math-node.symbol { color: var(--cal-accent); font-family: Georgia, serif; font-size: 19px; }
.arrow { color: var(--cal-muted); font-size: 19px; height: 24px; }
.fork { position: relative; width: 100%; }
.fork-line { border-left: 1.5px solid var(--cal-line); border-right: 1.5px solid var(--cal-line); border-top: 1.5px solid var(--cal-line); height: 20px; margin: 12px auto 0; width: 72%; }
.fork-options { display: grid; gap: 12px; grid-template-columns: 1fr 1fr; }
.outcome { border-radius: 9px; padding: 10px 6px; text-align: center; }
.outcome strong { display: block; font-size: 11px; }
.outcome span { display: block; font-size: 10px; margin-top: 2px; }
.outcome.good { background: var(--cal-teal-soft); color: var(--cal-teal); }
.outcome.poor { background: var(--cal-danger-soft); color: var(--cal-danger); }
</style>
