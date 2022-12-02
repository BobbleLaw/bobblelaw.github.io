---
title: Understanding Perspective-N-Points
description: 
date: 2022-10-27T16:37:56+08:00
draft: false
---

## Introduction

The Perspective-n-Point (PnP) problem is the problem of estimating the relative pose between an object and the camera, given a set of correspondences between 3D points and their projections on the image plane.
It is a fundamental problem that was first studied in the photogrammetry literature, and later on studied in the context of computer vision.

In this post, I will present a few solvers (among many), discuss their proofs and also show some concise implementations.
I will focus on the minimal solvers - solutions to the PnP problem that requires the minimal amount of information.
In this case, we need at least three pairs of correspondences, and the minimal solvers that only require three pairs of correspondences are called P3P solvers.

## Preliminaries

So, what is a PnP problem exactly?
To understand this, let's first look at the P3P problem.
Fig. 1 shows the typical geometry of a P3P problem instance.
$P_{1}$, $P_{2}$ and $P_{3}$ are three known 3D points in the fixed world frame, and $P_{1}^{I}$, $P_{2}^{I}$ and $P_{3}^{I}$ are their projections on the image plane respectively.
$O$ is the camera's optical center, also known as the center of projection.
Note that we assume a calibrated pinhole camera: that is we know the camera's focal lengths and distortion coefficients,
and the image points $P_{1}^{I}$, $P_{2}^{I}$ and $P_{3}^{I}$ are calibrated rays with two degrees of freedom each.


The goal of the P3P problem is: find the $P_{1}$, $P_{2}$ and $P_{3}$&rsquo;s coordinates in the camera frame.
And PnP problems are the extended version: find $P_{i}$, $i = {1 \ldots n}$'s coordinates in the camera frame.
To put it in a more algebraic form, we have the following equation:

<div>
\[\begin{aligned}
P^{C}_{i} = R^{C}_{W} P_{i} + t^{C} \qquad i = {1 \ldots 3}
\end{aligned}\]
<div>

<div>
\[\begin{aligned}
x ={}& a+b+c+{} \\
&d+e+f+g
\end{aligned}\]
</div>


where $R^{C}$ and $t^{C}$ are the relative transformation we are trying to solve (so that we can recover $P^{C}_{i}$, the positions of the points in the camera&rsquo;s frame).
We know the projections of $P_{i}$ on the camera&rsquo;s pixel space.

Interestingly, the early solutions to this problem solve for $P^{C}_{i}$ directly, then find the $R^{C}$ and $t^{C}$ using <a href="arun_method_for_3d_reg.html">Arun's Method.</a>
For them, the problem of P3P boils down to solving the geometry of a tetrahedron.
The first three methods introduced in this pose belong to this category.