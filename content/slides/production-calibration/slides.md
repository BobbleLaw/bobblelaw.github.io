---
theme: default
title: Building a Production Calibration Solution
info: |
  Factory calibration, online compensation, validation, and production deployment
aspectRatio: 16/9
canvasWidth: 1280
colorSchema: light
transition: none
download: false
exportFilename: snap-panel-presentation
mdc: true
---

<div class="title-layout">
  <h1 class="deck-title">Building a Production<br><span class="accent">Calibration Solution</span></h1>
  <div class="deck-subtitle">Factory Calibration · Online Compensation</div>
  <div class="presenter-name">Ziyun Luo</div>
</div>
<img class="title-setup-photo" src="/assets/poc_setup.png" alt="Proof-of-concept mower calibration setup surrounded by fiducial targets">

<!--
Hi everyone, thanks for having me.

I’m Ziyun. I applied for this Computer Vision Engineer - Calibration role. Today I’d like to walk through one of my past projects that happens to align with the job description particularly well: building a production calibration system for a robotic mower platform.

I’ll start with the factory calibration system, then explain why that alone was not enough once the device was deployed in the field, and finally how we approached online calibration and safe parameter updates.
-->

---

# Background
<div class="section-rule"></div>

<div class="career-flow" aria-label="Career progression">
  <section class="career-stage">
    <div class="career-kicker">Research Focus & Earlier career</div>
    <h2>3D Computer Vision</h2>
    <div class="career-topics">3D registration<br>3D reconstruction<br>6 DoF pose estimation<br>Depth sensor</div>
  </section>
  <div class="career-arrow">→</div>
  <section class="career-stage">
    <div class="career-kicker">Robotic mower</div>
    <h2>Robotics</h2>
    <div class="career-topics">Visual SLAM<br>Production calibration<br>Embeded system</div>
  </section>
  <div class="career-arrow">→</div>
  <section class="career-stage">
    <div class="career-kicker">Current role</div>
    <h2>OS & UI Framework</h2>
    <div class="career-role">Senior Software Engineer at Roku</div>
    <div class="career-topics">Embeded UI framework<br>Data contract and API design<br>Language engine</div>
  </section>
</div>

<div class="bottom-thesis">This project sits at the intersection of computer vision and production engineering.</div>

<!--
Before I get into the project, a quick overview of my background.

In my grad school and earlier in career, I wmostly orked on 3D computer vision and machine vision, tasks like 6 DoF pose estimation, using point cloud, or images, 3D reconstruction of multiple images, structured light.

And I went to a robotic mower company, I worked on and owned the whole calibration solution across different models. I also contribute to visual SLAM code repo.

Currently, I’ve been working as a senior software engineer in Roku, mainly around UI framework architecture, Data contract and API design for new UI features. and maintain in house language.

For this presentation, I won't cover that part, as it's totally not relant to this role, in case any of you are interested, you can ask more in the following 1-on-1 deep dive sessions. I’ll focus on the robotic mower project because it combines both sides: computer vision and production engineering.
-->

---

# The Problem
<div class="section-rule"></div>

<img class="problem-planning-inset" src="/assets/mower_planning.webp" alt="Robotic mower coverage planning illustration">

<div class="product-flow problem-flow">
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

<div class="lifetime-risks problem-risks">Factory baseline &nbsp;·&nbsp; temperature &nbsp;·&nbsp; vibration &nbsp;·&nbsp; mechanical stress &nbsp;·&nbsp; impact &nbsp;·&nbsp; long-term use</div>

<div class="bottom-thesis problem-thesis">The challenge was not just calibrating the device once, but keeping calibration trustworthy throughout its lifetime.</div>
<img class="mower-family-strip" src="/assets/mower_family.webp" alt="Robotic mower product family">

<!--
The product was an autonomous robotic mower.

It relied on multiple sensors for localization and navigation, including stereo cameras, an IMU, and other sensing components.

Accurate sensor geometry was a prerequisite for the localization stack to work correctly.

That meant every device needed a trusted set of calibration parameters before it could leave manufacturing.

At first, the problem looked fairly conventional:

collect controlled observations, estimate the calibration parameters, validate them, and write the result to the device. With OpenCV, it's few lines of code.

But because this was a production product, we had additional constraints.

Calibration had to be accurate, repeatable, fast enough for manufacturing throughput, robust across hardware variation, and easy to diagnose when something went wrong.

So the first problem we solved was:

**How do we build a factory calibration system that is accurate enough for localization, but also reliable and efficient enough for large-scale production?**
-->

---

# Factory Calibration and Validation
<div class="section-rule"></div>

<div class="factory-validation-grid">
  <section class="factory-validation-half factory-half">
    <h2>Calibration</h2>
    <div class="factory-validation-summary">Calibration produced a candidate baseline through automated acquisition and estimation.</div>
    <div class="compact-factory-flow">
      <div class="compact-factory-step">Device<span>identify + configure</span></div>
      <div class="compact-chevron">↓</div>
      <div class="compact-factory-step">Motorized rig<span>automated acquisition</span></div>
      <div class="compact-chevron">↓</div>
      <div class="compact-factory-step core">Detection<span>targets + features</span></div>
      <div class="compact-chevron">↓</div>
      <div class="compact-factory-step core">Optimization<span>sensor geometry</span></div>
      <div class="compact-chevron">↓</div>
      <div class="compact-decision-diamond"><span>validate</span></div>
    </div>
    <div class="compact-factory-outcomes">
      <div class="decision-result fail">FAIL<br><span>retry / diagnose</span></div>
      <div class="decision-result pass">PASS<br><span>persist + write</span></div>
    </div>
    <div class="compact-support-note">Rig control · automatic criteria · result persistence · operator tooling</div>
  </section>

  <section class="factory-validation-half validation-half">
    <h2>Validation</h2>
    <div class="factory-validation-summary">Independent validation decided whether the candidate baseline was safe to ship.</div>
    <div class="compact-validation-layout">
      <div class="compact-validation-layers">
        <div class="validation-layer"><strong>Baseline</strong><span>Does the estimated geometry make sense?</span></div>
        <div class="validation-layer"><strong>System</strong><span>Do downstream use cases remain stable?</span></div>
        <div class="validation-layer"><strong>Integration</strong><span>Do field metrics or failure rates regress?</span></div>
      </div>
      <TestingPyramid />
    </div>
  </section>
</div>

<!--
The factory workflow was highly automated.

The device was placed into a motorized calibration setup.

We collected controlled sensor observations while the rig moved the device through the required poses.

The pipeline then performed feature or calibration-target detection, estimated the sensor parameters, and independently validated the result before accepting it.

Conceptually, the flow was as in the graph.

One important design was that the optimizer itself did not decide whether a calibration was valid.

A numerically converged solution was only a candidate result.

We applied independent acceptance criteria before deploying it. There's a validation station right next to calibration station, which use the fresh calibrated result to reconstruct a controlled scene. 

So even at the factory stage, we were already treating calibration as more than an optimization problem.
-->

---

# Production Engineering
<div class="section-rule"></div>

<div class="engineering-results">
  <div class="engineering-main">
    <ProductionArchitecture />
    <div class="reuse-row">One core · unit tests · offline datasets · factory tooling · production runtime</div>
  </div>
  <figure class="factory-setup-photo">
    <img src="/assets/early_version_setup.jpeg" alt="Early production calibration rig with fiducial target walls">
    <figcaption>Early calibration-rig setup</figcaption>
  </figure>
</div>

<div class="metrics production-results">
  <div class="metric"><div class="metric-value">~30 s</div><div class="metric-label">calibration duration</div></div>
  <div class="metric"><div class="metric-value">4×</div><div class="metric-label">devices per cycle</div></div>
  <div class="metric"><div class="metric-value">~100K</div><div class="metric-label">deployed devices</div></div>
  <div class="metric"><div class="metric-value robust-value">Robust</div><div class="metric-label">field operation</div></div>
</div>

<div class="bottom-thesis">Engineering the core for reuse, automation, and diagnosis made calibration fast enough for production.</div>

<!--
A big part of the project was engineering the calibration workflow into something that could operate reliably in manufacturing.

The system had to recover gracefully from bad sensor input, failed observations, or invalid optimization results.

It also needed to make failures explainable to operators, detailed enough for engineers to locate the issues, modular enough that algorithm improvement and tooling improvement can happen in parallel.

We separated the calibration core from the UI and device-control logic.

That meant the same core components could be exercised from the production application, offline analysis tools, and automated tests.

There were several supporting systems around the core algorithm.

We also had tooling for monitoring incoming sensor data, controlling the rig, visualizing calibration results, diagnosing failed runs, and storing historical calibration data.

This was important for reproducibility and regression testing.

From a throughput perspective, the calibration cycle was around 30 seconds, and the system could process four devices in parallel.

The overall calibration workflow was eventually used across roughly 100,000 production devices. still ramping up fast even after I left the team last time I heard.

At that point, we had solved the first problem: establishing a reliable calibration baseline at manufacturing scale.

But that raised the next question.
-->

---

# Why Factory Calibration Wasn't Enough
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

<div class="question-block">Can we estimate calibration changes from normal operating data without a calibration target?</div>

<!--
The factory calibration represents the geometry of the device at one point in time.

It assumes that the relationship between sensors remains sufficiently stable afterwards.

In practice, that assumption can break.

The device operates outdoors and experiences temperature variation, vibration, mechanical stress, long-term usage, and potentially accidental impact.

Those effects can change the effective sensor geometry after the device has left the factory.

The individual sensors may still appear healthy. But a small geometric shift can create a persistent systematic error in the localization stack.

So we ended up with a second, much harder problem:

**Can we detect and compensate for calibration changes during normal operation, without asking the user to perform a dedicated calibration procedure?**

This is what led us to online calibration.
-->

---

# Online Calibration Approach
<div class="section-rule"></div>

<OnlineCalibrationPipeline />

<div class="pipeline-questions">
  <div>Is the current data informative enough to constrain calibration?</div>
  <div>What correction best explains the observations?</div>
  <div>Is there enough evidence to modify trusted state?</div>
</div>

<div class="bottom-thesis">The optimiser generates a candidate; the system decides whether it deserves trust.</div>

<!--
The online system used observations that were already available during normal operation.

There was no calibration target and no controlled rig.

That changes the nature of the problem substantially.

In the factory, we control the observations.

In the field, we have to decide whether the observations are good enough to tell us anything about calibration at all.

I like to divide the online calibration problem into three separate questions.

The first question is:

**Is the current data informative enough to constrain the calibration parameters?**

The second question is:

**If it is informative, what calibration correction best explains the observations?**

And the third question is:

**Even if we can estimate a correction, do we have enough evidence to safely modify the trusted calibration state?**

That separation became one of the key design principles.

We deliberately avoided continuously estimate calibration and immediately write the latest result.

The optimizer generates a candidate.

The rest of the flow decides whether that candidate deserves to become trusted state.
-->

---

# Observability and Safe Updates
<div class="section-rule"></div>

<div class="observability-update-grid">
  <section class="merged-half observability-half">
    <h2>Trust the evidence before the estimate</h2>
    <div class="merged-policy">A low residual is meaningless when geometry is degenerate.</div>
    <div class="merged-observability">
      <div class="obs-column poor">
        <h3 class="danger">Poor geometry</h3>
        <div class="obs-list">
          <div class="obs-item">repetitive motion</div>
          <div class="obs-item">low parallax</div>
          <div class="obs-item">limited coverage</div>
          <div class="obs-item">weak excitation</div>
        </div>
      </div>
      <div class="obs-column good">
        <h3 class="teal">Good geometry</h3>
        <div class="obs-list">
          <div class="obs-item">diverse motion</div>
          <div class="obs-item">strong parallax</div>
          <div class="obs-item">wide coverage</div>
          <div class="obs-item">stable tracks</div>
        </div>
      </div>
    </div>
    <div class="signal-heading">Representative confidence signals</div>
    <div class="signals merged-signals">
      <span class="signal">track duration</span><span class="signal">coverage</span><span class="signal">parallax</span><span class="signal">motion diversity</span><span class="signal">conditioning</span><span class="signal">covariance</span><span class="signal">window consistency</span>
    </div>
  </section>

  <section class="merged-half update-half">
    <h2>Require stronger evidence to update</h2>
    <div class="merged-policy">False-positive updates are more dangerous than missed updates.</div>
    <div class="compact-confidence-gate">
      <div class="gate-candidate">Candidate calibration</div>
      <div class="gate-arrow">↓</div>
      <div class="gate-quality">
        <div>Independent metric<br>improvement</div>
        <div>Physical parameter<br>plausibility</div>
        <div>Consistency &amp; stability<br>across time</div>
      </div>
      <div class="gate-arrow">↓</div>
      <div class="gate-confidence">Confidence threshold</div>
      <div class="gate-arrow split-arrow">↙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↘</div>
      <div class="gate-outcomes">
        <div class="reject">Reject · keep baseline</div>
        <div class="accept">Accept · bounded update</div>
      </div>
    </div>
    <div class="update-policy-strip"><span>Weak evidence → no update</span><span>Degenerate geometry → no update</span><span>Consistent evidence → controlled update</span></div>
  </section>
</div>

<!--
The hardest technical issue in online calibration was observability.

A small residual does not necessarily mean the calibration estimate is correct.

For example, if the device motion is repetitive, there is very little parallax, the visual features cover only a small part of the image, or the motion does not excite a particular parameter direction, multiple calibration values can explain the observations almost equally well.

The optimizer can still converge. It can even produce a very low residual.

But the parameter estimate may be poorly constrained.

So before trusting an estimate, we considered whether the observations contained enough useful geometric information.

At the practical level, that means signals such as feature quality, track stability, spatial coverage, parallax, and motion diversity.

At the numerical level, the same idea can be understood through the Jacobian and the approximate Hessian.

If the information matrix has weak directions, some combination of calibration parameters is poorly observable.

The key lesson is:

**A small residual under degenerate geometry is not evidence of correct calibration.**

Once the estimator produced a candidate, we still did not update immediately.

We looked for additional evidence.

Was the candidate physically plausible?

Was it consistent across multiple observation windows?

Did independent metrics improve?

Was the estimate stable over time?

The update policy was deliberately conservative.

If the geometry was poor, we did nothing.

If independent windows disagreed, we did nothing.

If the estimated change was physically unreasonable, we did nothing.

Only when there was persistent, consistent, high-confidence evidence would the system allow a controlled update.

The principle I’d summarize this with is:

**The trusted calibration state should be harder to modify than an internal estimate.**

That was important because the cost of a false-positive update was much higher than the cost of waiting longer to correct a genuine drift.
-->

---

# Outcomes and Lessons Learned
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
Looking back, there are four main lessons I took from the project.

The first is:

**Calibration is a system problem.**

The optimizer is only one component. Data collection, validation, observability, tooling, diagnostics, and deployment policy are equally important.

The second is:

**Observability comes before optimization.**

If the data does not constrain a parameter, the correct answer may simply be that we do not know yet.

The third is:

**Updating requires stronger evidence than estimating.**

Generating a candidate calibration and modifying trusted device state should be treated as two separate operations.

And the fourth is:

**Debuggability needs to be designed in from the beginning.**

Calibration bugs often do not crash the system. They produce numbers that look plausible but are subtly wrong. So replayability, intermediate metrics, and clear acceptance or rejection reasons are extremely important.

If I had to summarize the whole project in one line, it would be:

**Reliable calibration is not just estimation. It is estimation plus observability, validation, and safe deployment.**

That combination of computer vision and production engineering is one of the areas I enjoy most.

Thank you.

I’m happy to go into any of the technical details.
-->
