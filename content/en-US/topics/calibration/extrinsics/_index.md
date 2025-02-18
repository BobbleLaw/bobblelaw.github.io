---
title: Extrinsic Calibration
description:
toc: true
authors:
  - host
tags:
categories:
series:
date: '2022-11-20T13:06:19+08:00'
lastmod: '2022-11-20T22:52:56+08:00'
draft: false
---

## Problem Statement

The hand-eye calibration problem first appeared and got its name from the robotics community, where a camera ("eye") was mounted on the gripper ("hand") of a robot. The cameras was calibrated using a calibration pattern. Then the unknown transformation from the robot coordinate system to the calibration pattern coordinate system as well as the transformation from the camera to the hand coordinate system need to be estimated simultaneously.

## Application

### Robot-Camera Calibration

This is the standard *hand-eye calibration* problem: Calculate the camera-sensor transformation $\bold{X}$ by using several measurements $A_i$, $B_i$ (that give you $A$, $B$).

+ Robot Arm with Camera
+ Outside-In Tracking System with Inside-Out Tracking System
+ Camera with gyroscope

### Tracker Alignment

First estimate hand-eye calibration using standard algorithms, then calculate $Y$ from the estimated parameters. Note that the problem is symetric in $X$ and $Y$.

We then can either use the Hand-Eye Calibration methods to estimate $X$ and then $Y$ independently, or use the estimated $x$ to calculate $y$ by closing the loop.

## Possible Solutions

Roughly, the methods used can be split up into two parts: Most approaches decompose the matrix X into its rotational and translational part and optimize for first the rotation and then the translation.

### Solve the Rotation first then the Translation

The "classic" way, these papers are refered by many later on

+ Real Time Versatile Robotics Hand/Eye Calibration using 3D Machine Vision
+ A new technique for fully autonomous and efficient 3D robotics hand/eye calibration
+ Calibration of wrist-mounted robotic sensors by solving homogeneous transform equations of the form $AX=XB$

An early comparison of the methods available at that time was given by

+ Extrinsic calibration of a vision sensor mounted on a robot

Another way using quaternionsas rotation representation:

+ Quaternions Approach to Solve the Kinematic Equation of Rotation of a Sensor-Mounted Robotic Manipulator
+ Finding the position and orientation of a sensor on a robot manipulator using quaternions

Non-linear equation system:

+ Simultaneous robot-world and hand-eye calibration
+ Hand-eye calibration

Another one using the Euclidean Group

+ Robot Sensor Calibration: Solving AX = XB on the Euclidean Group
+ A Tracker Alignment Framework for Augmented Reality


### Solve Rotation and Translation Together

+ Hand-eye calibration using dual quaternions
### Others
