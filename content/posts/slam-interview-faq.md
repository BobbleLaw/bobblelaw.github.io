---
title: SLAM Interview FAQs
description: Questions are collected from Chinese internet
date: 2022-10-27T16:37:56+08:00
draft: false
---

## Linear Algebra

+ 如何求解 $Ax=b$? SVD和QR分解哪个更快？

Depend on the rank of $[A | b]$.

Solution include QR decomposition, LTLD decomposition, Cholesky decomposition and SVD decomposition.

## Optimization Basics

+ Explain Gradient descent, Gaussian-Newton, LM, Dogleg
+ 
## Computer Vision Basics

+ 提取边缘的方法
+ Hoffman transform


## 3D Basics

+ 如何对匹配好的点做进一步的处理，已到达更好的效果？

1. Compare the distance with experienced threshold
2. RANSAC
3. KNN

+ Explain RANSAC
  
+ Explain Essential matrix, Fundamental matrix, and Homography matrix. 
  

+ PnP最少需要几个点？只有一/二个点的自由度是多少？


+ Explain Triangulation

+ Explain Bundle Adjustment

+ Why Lie Group/Algebra

+ Explain Epipolar geometry

## VSLAM General

+ 后端H矩阵求解算法的复杂度是多少？如何加速后端求解？

The complexity is _O(3)_. Make use of the sparsity feature,
block calculation, then marginization.

+ 各种主流开源算法之间的对比，优劣？


+ 对于光线明暗变化，动态场景，有什么常见处理方法？

Mult-sensor fusion.

Solutions to dynamic scenes:
1. RANSAC. Consider moving objects as outliers. Limited to small amout of outliers
2. Foreground and background
3. Optic flow to estimate the moving objects
4. Geometry constraint.
5. Deep learning object detection
6. Motor dynamic constraint. Human movement.


+ 长廊问题

VIO. Make use of line features.

+ Kidnap problem

## ORB-SLAM

+ 哪个部分最耗时？

According to the paper, local BA takes most of the time.
Local BA includes the following steps:
1. Add current keyframe and its covisible frame to `ILocalKeyFrame`
2. Iterate over `ILocalKeyFrame`, add observed MapPoints to `LocalMapPoint`
3. Mark the observed keyframes that don't belong to local key frame fixed state, they are exclude in BA
4. Construct g2o optimizer
5. Add pose of local keyframe
6. Add pose of fixed keyframe
7. Add 3D map point vertex
8. Link related map point and keyframe 
9. Start optimization. Corse to fine, use kernel function in corse stage to filter out outliers.
10. Calculate error, exclude the keyframes and map points with great error
11. Update state


+ 怎么克服尺度漂移问题？回环检测的原理及估计了哪些量？

Loop detection includes the following steps:
1. Check if keyframes exist
2. Detect the candidate loop frames
3. Calculate the Sim3 between current frame and closed loop frame.
4. Essential graph optimization


+ 初始化步骤

A simplified SfM

+ Covisibility graph and Essential graph
+ 
  
## Calibration

+ Common camera models
+ 

