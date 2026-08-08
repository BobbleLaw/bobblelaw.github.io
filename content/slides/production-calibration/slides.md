---
theme: default
title: Building a Production Calibration System
info: |
  Factory calibration, online compensation, validation, and production deployment
aspectRatio: 16/9
canvasWidth: 1280
colorSchema: light
transition: none
download: false
exportFilename: snap-calibration-presentation
mdc: true
---

<div class="title-layout">
  <div class="eyebrow">Production Computer Vision</div>
  <h1 class="deck-title">Building a Production<br><span class="accent">Calibration System</span></h1>
  <div class="deck-subtitle">Factory Calibration · Online Compensation · Validation at Scale</div>
  <div class="presenter-name">Ziyun Luo</div>
</div>

<!--
Timing: ~1:15

This project was a production calibration system for robotic mowers. The algorithm mattered, but the difficult engineering work was making calibration fast enough for a factory, robust enough for uncontrolled data, and conservative enough to update a deployed device safely.

I will focus on the decisions around that optimizer: observability, validation, software boundaries, and production safeguards.
-->

---

# Reliable navigation starts with trusted geometry
<div class="section-rule"></div>

<div class="product-flow">
  <div class="sensor-stack">
    <div class="flow-node">Stereo Cameras</div>
    <div class="flow-node">IMU</div>
    <div class="flow-node">Other Sensors</div>
  </div>
  <div class="flow-arrow">→</div>
  <div class="flow-node primary">Localization</div>
  <div class="flow-arrow">→</div>
  <div class="flow-node">Navigation</div>
</div>

<div class="lifetime-risks">Factory baseline &nbsp;·&nbsp; temperature &nbsp;·&nbsp; vibration &nbsp;·&nbsp; mechanical stress &nbsp;·&nbsp; impact &nbsp;·&nbsp; long-term use</div>

<div class="bottom-thesis">The challenge was not just calibrating the device once, but keeping calibration trustworthy throughout its lifetime.</div>

<!--
Timing: ~1:45

The mower localized from multiple sensors, so their geometric relationship directly affected navigation quality. Factory calibration gave us a trusted starting point.

But the device then lived outdoors. Temperature cycles, vibration, stress, impact, and long-term use could move the physical system away from that factory baseline. That changed the question from “can we calibrate it?” to “how do we keep calibration trustworthy?”
-->

---

# Optimization had to satisfy four production constraints
<div class="section-rule"></div>

<div class="four-pillars">
  <div class="pillar">
    <div class="pillar-mark">A</div>
    <h3>Accuracy</h3>
    <p>Meet downstream localization requirements.</p>
  </div>
  <div class="pillar">
    <div class="pillar-mark">T</div>
    <h3>Throughput</h3>
    <p>Stay off the factory critical path.</p>
  </div>
  <div class="pillar">
    <div class="pillar-mark">R</div>
    <h3>Robustness</h3>
    <p>Handle noise and changing environments.</p>
  </div>
  <div class="pillar">
    <div class="pillar-mark">S</div>
    <h3>Safety</h3>
    <p>Never make a good system worse.</p>
  </div>
</div>

<div class="bottom-thesis">Optimization quality alone was not enough — we needed a reliable decision system around it.</div>

<!--
Timing: ~1:40

These constraints pulled in different directions. Accuracy encouraged more data and more optimization. Throughput limited both. Robustness required rejecting bad observations, while online safety required rejecting plausible-looking but uncertain answers.

That meant success could not be defined by one optimization metric. We needed a system that decided when to collect, estimate, accept, retry, or do nothing.
-->

---

# Calibration is a lifecycle, not just an optimizer
<div class="section-rule"></div>

<div class="offline-online-legend">
  <div class="legend-item"><span class="legend-line"></span> factory baseline</div>
  <div class="legend-item"><span class="legend-line online"></span> runtime assurance</div>
</div>

<SystemArchitecture />

<div class="diagram-caption">A validated factory baseline enters production; runtime evidence can propose controlled corrections.</div>

<!--
Timing: ~2:00

I treated calibration as a lifecycle. Offline, the factory workflow produced and independently validated baseline parameters, persisted them, and wrote them to the device.

Online, the deployed system monitored normal runtime observations. It could estimate a possible change, but validation and update policy remained separate stages. This separation was important: each stage had different failure modes, test strategies, and operational ownership.
-->

---

# Factory calibration was an automated decision pipeline
<div class="section-rule"></div>

<div class="factory-flow">
  <div class="factory-step">Device<span>identified + configured</span></div>
  <div class="factory-chevron">›</div>
  <div class="factory-step">Motorized Rig<span>automated acquisition</span></div>
  <div class="factory-chevron">›</div>
  <div class="factory-step core">Detection<span>targets + features</span></div>
  <div class="factory-chevron">›</div>
  <div class="factory-step core">Optimization<span>sensor geometry</span></div>
</div>

<div class="factory-decision">
  <div class="decision-result fail">FAIL → retry / diagnose</div>
  <div class="decision-diamond"><span>validate</span></div>
  <div class="decision-result pass">PASS → persist + write</div>
</div>

<div class="small-note" style="text-align:center; margin-top:20px;">Rig control · automatic criteria · result persistence · operator and debugging tools</div>

<div class="bottom-thesis">Reprojection error was one signal, not the acceptance criterion.</div>

<!-- Optional Qt tool screenshot: add public/assets/qt-calibration-tool.png and place it here. -->

<!--
Timing: ~2:15

The rig and software automated acquisition rather than asking an operator to manually find poses. Detection and optimization were followed by independent acceptance checks, then persistence and device programming.

The tooling mattered as much as the math: operators needed clear pass/fail behavior, and engineers needed intermediate observations and metrics for diagnosis. Reprojection error helped, but a low residual alone could still hide weak coverage, poor geometry, or implausible parameters.
-->

---

# The factory baseline could drift in the field
<div class="section-rule"></div>

<div class="geometry-compare">
  <div class="geometry-state">
    <h3>Factory</h3>
    <div class="camera-pair"><div class="camera"></div><div class="baseline"></div><div class="camera"></div></div>
    <div class="geometry-equation">Transform = T<sub>AB</sub></div>
  </div>
  <div class="geometry-state field">
    <h3>Field</h3>
    <div class="camera-pair"><div class="camera"></div><div class="baseline"></div><div class="camera shifted"></div></div>
    <div class="geometry-equation">Transform = T′<sub>AB</sub></div>
  </div>
</div>

<div class="cause-row">
  <span class="cause">temperature</span><span class="cause">mechanical stress</span><span class="cause">impact</span><span class="cause">assembly creep</span><span class="cause">long-term use</span>
</div>

<div class="question-block">Can we estimate calibration changes from normal operating data — without a calibration target?</div>

<!--
Timing: ~1:40

The online problem was harder because there was no controlled target, rig, or operator. We had only normal operating data, and much of that data was not informative for calibration.

So the core contribution was not simply moving the factory optimizer onto the device. It was designing a pipeline that recognized when runtime evidence was sufficient, estimated a candidate, and then made a conservative production decision.
-->

---

# Online calibration separates observation, estimation, and decision
<div class="section-rule"></div>

<OnlineCalibrationPipeline />

<div class="bottom-thesis">An optimizer producing an answer does not mean the system should trust it.</div>

<!--
Timing: ~2:40

I separated the system into three questions.

First: observation. Can this runtime window actually constrain the calibration parameters? If not, discard it before optimization.

Second: estimation. Given informative geometry, what change best explains the observations?

Third: decision. Is the candidate plausible, stable, independently beneficial, and supported strongly enough to modify a production baseline?

This architecture made abstention a normal successful outcome rather than an error case.
-->

---

# A low residual is meaningless when geometry is degenerate
<div class="section-rule"></div>

<div class="risk-policy" style="font-size:18px; margin-top:-12px; padding:9px 18px;">A small residual under degenerate geometry is not evidence that the estimate is correct.</div>

<div class="split-observability">
  <div class="obs-column poor">
    <h3 class="danger">Poor geometry</h3>
    <div class="obs-list">
      <div class="obs-item">mostly straight or repetitive motion</div>
      <div class="obs-item">low parallax</div>
      <div class="obs-item">limited image coverage</div>
      <div class="obs-item">short or unstable tracks</div>
      <div class="obs-item">weak parameter excitation</div>
    </div>
  </div>
  <div class="obs-column good">
    <h3 class="teal">Good geometry</h3>
    <div class="obs-list">
      <div class="obs-item">diverse motion and viewing directions</div>
      <div class="obs-item">strong parallax</div>
      <div class="obs-item">wide image coverage</div>
      <div class="obs-item">long stable tracks</div>
      <div class="obs-item">sufficient parameter excitation</div>
    </div>
  </div>
  <div class="obs-column good">
    <ObservabilityDiagram />
    <div class="signals">
      <span class="signal">feature count</span><span class="signal">track duration</span><span class="signal">coverage</span><span class="signal">parallax</span><span class="signal">motion diversity</span><span class="signal">conditioning</span><span class="signal">covariance</span><span class="signal">window consistency</span>
    </div>
    <div class="small-note" style="margin-top:9px;">Representative signals; the exact subset is system-dependent.</div>
  </div>
</div>

<!--
Timing: ~2:50

This was the central technical lesson. With weak excitation, an optimizer can fit the observations while calibration parameters remain underconstrained. The residual can look excellent because many parameter combinations explain the same data.

We therefore evaluated the evidence before trusting the result: track quality, spatial coverage, parallax, motion diversity, and measures related to conditioning or uncertainty. These are representative signals—the important design principle is to explicitly test whether the data contains information about the parameter being estimated.
-->

---

# Updating requires stronger evidence than estimating
<div class="section-rule"></div>

<div class="risk-policy">False-positive calibration updates are more dangerous than missed updates.</div>

<ConfidenceGate />

<!--
Timing: ~2:50

A candidate had to pass multiple independent gates. We checked physical plausibility, consistency across observation windows, improvement in metrics not used solely to fit the candidate, and temporal stability.

Even an accepted update was bounded in size and rate. This limited the consequence of an unexpected failure and made behavior easier to monitor and roll back.

The policy was intentionally asymmetric. Missing an update meant continuing with the trusted baseline. A false-positive update could corrupt a system that was already working.
-->

---

# The calibration core was isolated from products and tools
<div class="section-rule"></div>

<div class="engineering-layout">
  <ProductionArchitecture />
  <div class="cross-cutting">
    <div class="eyebrow">Cross-cutting</div>
    <div class="cross-label">Logging</div>
    <div class="cross-label">Configuration</div>
    <div class="cross-label">Result persistence</div>
    <div class="cross-label">Visualization</div>
    <div class="cross-label">Versioning</div>
    <div class="cross-label">Regression testing</div>
  </div>
</div>

<div class="reuse-row">One core · unit tests · offline datasets · factory tooling · production runtime</div>

<div class="bottom-thesis">The calibration core should be independently testable from the device and UI.</div>

<!--
Timing: ~2:20

The software boundary was deliberate. Geometry, optimization, metrics, and validation lived in a reusable C++ core behind stable APIs.

The device runtime, Qt factory tool, and offline analysis tooling were consumers rather than owners of calibration logic. That allowed the same behavior to run against unit tests, captured datasets, factory devices, and production observations.

Cross-cutting capabilities—especially logging, result versioning, and replay—made field failures reproducible instead of anecdotal.
-->

---

# Validation connected algorithm quality to fleet behavior
<div class="section-rule"></div>

<div class="metrics">
  <div class="metric"><div class="metric-value">~30 s</div><div class="metric-label">calibration duration</div></div>
  <div class="metric"><div class="metric-value">4×</div><div class="metric-label">devices per cycle</div></div>
  <div class="metric"><div class="metric-value">~100K</div><div class="metric-label">deployed devices</div></div>
  <div class="metric"><div class="metric-value" style="font-size:36px; margin-top:13px;">Robust</div><div class="metric-label">field operation</div></div>
</div>

<div style="display:grid; grid-template-columns:0.75fr 1.25fr; gap:48px; align-items:center; margin-top:28px;">
  <TestingPyramid />
  <div class="validation-layers" style="grid-template-columns:1fr; margin-top:0; gap:17px;">
    <div class="validation-layer"><strong>Algorithm-level validation</strong><span>Does the estimated geometry make sense?</span></div>
    <div class="validation-layer"><strong>System-level validation</strong><span>Does downstream localization remain stable or improve?</span></div>
    <div class="validation-layer"><strong>Fleet-level validation</strong><span>Do field metrics or failure rates regress?</span></div>
  </div>
</div>

<div class="bottom-thesis">The metric we ultimately cared about wasn't reprojection error. It was whether calibration remained invisible to the customer.</div>

<!--
Timing: ~2:10

These figures are editable placeholders for the final interview version: about thirty seconds per calibration, four devices per cycle, and roughly one hundred thousand deployed products.

Validation connected three levels. Algorithm checks asked whether geometry and uncertainty made sense. System checks measured whether localization remained stable or improved. Fleet checks watched for regressions in real operation.

That hierarchy prevented a locally attractive calibration metric from becoming the only definition of success.
-->

---

# Four principles made calibration reliable in production
<div class="section-rule"></div>

<div class="principles">
  <div class="principle"><div class="principle-num">01</div><h3>Calibration is a system problem</h3><p>The optimizer is only one component.</p></div>
  <div class="principle"><div class="principle-num">02</div><h3>Observability comes first</h3><p>Do not estimate what the data does not constrain.</p></div>
  <div class="principle"><div class="principle-num">03</div><h3>Updating needs stronger evidence</h3><p>Prefer no update over an uncertain update.</p></div>
  <div class="principle"><div class="principle-num">04</div><h3>Debuggability is designed in</h3><p>Capture enough state to reproduce failures offline.</p></div>
</div>

<div class="closing-thesis">Reliable calibration = estimation + observability + validation + safe deployment.</div>
<div class="thanks">Thank you · Questions</div>

<!--
Timing: ~1:30. Expected uninterrupted total: ~24 minutes.

The main lesson is that production calibration is not a single optimization problem. It is a system that controls when estimation is valid, when a result is trustworthy, and how change reaches a deployed product safely.

Observability prevents false confidence. Independent validation connects parameters to customer-visible behavior. Conservative deployment policy makes abstention safe. And deliberate debugging support lets the team learn when reality breaks an assumption.

Thank you—I’m happy to go deeper into the factory workflow, online estimator, confidence signals, or production architecture.
-->
