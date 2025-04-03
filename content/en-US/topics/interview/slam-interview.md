---
title: SLAM Interview Questions
description: Questions are collected from Chinese internet.
toc: false
authors:
  - host
tags: 
  - SLAM
categories:
series:
date: '2022-10-27T16:37:56+08:00'
lastmod: '2022-11-20T22:52:56+08:00'
featuredImage:
draft: false
---

## Linear Algebra

+ 如何求解 $Ax=b$？SVD和QR分解哪个更快？

Depend on the rank of $[A | b]$.

Solution include QR decomposition, LTLD decomposition, Cholesky decomposition and SVD decomposition.

## Optimization Basics

+ Explain Gradient descent, Gaussian-Newton, LM, Dogleg


## Computer Vision Basics

+ SIFT vs. SURF

+ Parallax and depth

$ \frac{parallax}{baseline} = \frac{focal~ length}{depth} $

+ Edge detection algorithms

Filtering, augmentation, and detection. Gaussian filter and some handcrafted kernel to locate pixel gradient.

1. Canny
2. Sobel
3. Laplacian

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

+ Explain Rigid body transform, Affine transform, and Projective transform

+ Explain ICP


## Filtering basic

+ Explain Kalman filter, Unsented Kalman filter, and Extended Kalman filter

+ Explain Particle filter


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

+ How to pick good key frames?

Consider from time and space domain.

1. Keep more frames at low speed movement, less frames at high speed movement. (???)
2. Keep enough distance, either in translation or rotation.
3. Tracking quality. Many method can be used to determin tracking quality. Covisibility (ORB-SLAM), Parallax (VINS), Tracked feature ratio.

+ 长廊问题

VIO. Make use of line features.

+ Kidnap problem

Relocation is also known as "Kidnap problem". It usually happens after robot losts its vision for a while (literally lost vision, or move into a feature-less area). Solution could be utilizing IMU pre-integration to locate previous key frames. Particles filter (?).



## ORB-SLAM

+ 哪个部分最耗时？

According to the paper, local BA consumes most of the time.
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

## General

### What are the different ways to represent rotations in 3D space?

#### SO3

```math
R{R}^{T} = I, det(R) = I
```

##### Lie Group

##### Lie Algebra
    
##### Pros
+ Directly apples to vectors (via matrix multiplication)
+ Composition is simple
+ No singularity (gimbal lock)
+ Easy to interpolate (SLERP)
      
##### Cons
+ Redundant storage (9 element -> 3 DoF)
+ Floating point drift cause loss of orthogoality (need re-normalization)
+ Computational expensive for repeated transformations

#### Quaternion

Normalize quaternion, 4D vector

```math
q = [w, x, y, z], with \| q \| = 1
```

##### Pros
+ Compact
+ Numerically stable
+ Easy to interpolate (SLERP)
+ Composition is simple

##### Cons
+ Less intuitive
+ Require conversion for direct vector transformation
+ Double-covering issue: -q and q represent the same rotation (???)

#### Axis-Angle

unit axis $n$ with rotation angle $\theta$

```math
(n,\theta)
```

##### Pros
+ Intuitive
+ Minimum storage
+ Convertible to other forms

##### Cons
+ Singularity
+ Not easy to calculate

#### Euler angle
represent by three angles, describing successive rotations

+ Conventions: XYZ, ZYX, ZYZ

Pros:
+ Intuitive
+ Minimum storage

Cons:
+ Gimbal lock
+ Non-unique representation
+ Not easy to interpolate

#### Gimbal lock

Euler angles describe a sequence of three rotations around different axes. The problem arises because:

+ Each rotation is applied sequentially, modifying the coordinate frame for the next rotation.
+ If one rotation aligns two axes, one degree of freedom is lost, meaning some rotations become indistinguishable.

### Describe the structure of the SE(3) matrix.

```math
T =
\begin{bmatrix}
R & t \\
0_{1 \times 3} & 1
\end{bmatrix}
```

+ Ensure T can be used for affine transformation in homogeneous coordinates.
+ Ensure Matrix Invertibility

```math
T^{-1} = 
\begin{bmatrix}
R^T & -R^Tt \\
0_{1 \times 3} & 1
\end{bmatrix}
```
+ Preserve Affine Transformations


### What sensors are suitable for SLAM (Simultaneous Localization and Mapping)?

|    Sensor    | Pros                                        | Cons                                     |
| :----------: | :------------------------------------------ | :--------------------------------------- |
|    Camera    | Rich texture, high resolution, lost cost    | scale ambiguity, sensitive to lighting   |
|     IMU      | High sample rate, robust to occlussion      | Drift over time, require integration     |
|    Lidar     | High accuracy, works in low light           | expensive                                |
| Depth sensor | Direct depth measurement                    | Limited range, sensitive to surface type |
|    Wheel     | Low-cost odometry                           | Slippage causes drift                    |
|     GNSS     | Global localization, accurate in open areas | Poor in occlussion                       |

#### Loosely-Coupled vs. Tightly-Coupled

+ Loosely-Coupled
  + Each sensor processes data indenpendently before fusion.
  + Fusion happens at state estimation level (EKF, optimization)
  
  Example: VIO
+ Tightly-Coupled
  + Sensor data is fused at raw data level (before computing separate odometry)
  + Uses joint optimization
  + IMU preintegration
  
### Why is non-linear optimization used in SLAM?

Nonlinearity in the system:
+ Rotation
+ Projection Models in camera
+ Sensor noise

In Visual SLAM:
+ Bundle Adjustment

```math
\sum_{i, j} || z_{ij} - \pi(T_i, Pj)||^2
```
+ Pose Graph Optimization

```math
\sum_{(i, j)\in \varepsilon} || T_i - T_i, T_{ij}||^2 \Sigma_{ij}
```

In LiDAR SLAM:
+ Scan Match (ICP)
+ Pose Graph Optimization

### What optimization methods are applicable for non-linear optimization in SLAM?

+ Gradient Descent

Update parameters in the opposite direction of the gradient

```math
x_{k+1} = x_k - \alpha \triangledown f(x_k)
```

where $\alpha$ is the step size

+ Newton-Raphson

Use second order Tylor expansion of the function to compute update

```math
x_{k+1} = x_k - H^{-1} \triangledown f(x_k)
```

where $H$ is the Hessian matrix

+ Gauss-Newton

Approximate Newton-Raphson by ignoring second-order derivates

```math
(J^TJ)\Delta x = -J^Tr
```

where $J$ is the Jacobian matrix, and $r$ is the residual vector

+ Levenberg-Marquardt

Combine Gauss-Newton and gradient descent by introducing damping factor $\lambda$

```math
(J^TJ + \lambda I)\Delta x = -J^Tr
```

If $\lambda$ is large, LM behaves like gradient descent, if it's small, LM behaves like Gauss-Newton.

LM is trust region method. Adjust $\lambda$ based on local solution.

Use LM for BA, GN for PGO

### What is loop closure and how is it achieved in SLAM?

Mainly two steps:

1. Loop Detection

+ Visual Place Recognition: Bag of Words, Deep Learning (NetVLAD)
+ Lidar SLAM: ICP, Global Descriptors (M2DP)
+ IMU + GPS fusion

2. Pose Graph Optimization

+ g2o
+ GTSAM

Challenges

+ Similar-looking places
+ Computational cost
+ Various lighting condition

### Define and differentiate the motion model and observation model in SLAM.

1. Motion Model

Predict the robot's next state based on control inputs and previous state.

Purpose:
+ Predict the robot new state
+ Models odometry
+ Introduces process noise (slippage, drift, imperfect actuators)

```math
x_t = f(x_{t-1}, u_t) + w_t
```

2. Observation Model

Relates sensor measurements to the estimated robot state and environment.

Purpose:
+ Correct the predicted state using sensor data

```math
z_t = h(x_t, m) + v_t
```

### What is RANSAC?

Given a dataset D with both inliers and outliers

1. Randomly sample N points from D
2. Fit a model M to sampled points
3. Evaluate the number of inliers satisfying a threshold.
4. Repeat for k itertations until a model with the highest inlier count is found.

The number of iteration k depends on

```math
k = \frac{log(1-p)}{log(1-w^n)}
```

where p is desired probability of finding a good model, w is estimated inlier ratio, N is number of points in the sample.

### Explain the concept of a robust kernel (or M-estimator).

A robust kernel (M-estimator) is a function that reduces the influence of outliers in optimization by modifying the cost function.

Huber, Cauchy, Tukey

### Discuss the Kalman filter and particle filter.

1. Kalman Filter 

Key Assumptions:
+ System dynamic follows linear state transition model
+ Measurement are linear function of the state
+ Gaussian noise in both process and measurement

System model

```math
x_k = Ax_{k-1} + Bu_k + w_k, w_k \sim \mathcal{N}(0, Q) \\
z_k = Hx_k + v_k, v_k \sim \mathcal{N}(0, R)
```
where
+ $x_k$ is state at time k
+ A is state transition matrix
+ B is control matrix
+ $u_k$ is control input
+ $w_k$ is process noise
+ $z_k$ is measurement at time k
+ H is measurement matrix
+ $v_k$ is mesurement noise

Prediction

```math
\hat{x}^-_k = A\hat{x}_{k-1} + Bu_k \\
P^-_k = AP_{k-1}A^T + Q
```

Update Measurement




1. Extended Kalman Filter


3. Particle Filter


### Contrast filter-based SLAM with graph-based SLAM.

### Define the information matrix and covariance matrix in the context of SLAM.

Information matrix is the inverse of covariance matrix.

Covariance matrix represents uncertainty.

```math
\Lambda = \Sigma^{-1}
```

### What is the Schur complement?

The Schur complement is a mathematical tool used to efficiently solve large systems of linear equations. In SLAM, it is widely used in Bundle Adjustment (BA) and Graph Optimization to reduce computational cost.

Definition:

Given a block matrix:

```math
M = 
\begin{bmatrix}
A_{n \times n} & B \\
C & D_{m \times m}
\end{bmatrix}
```

the Schur complement of A in M is

```math
S=D-CA^{-1}B
```

In SLAM, we often need to solve large linear system from nonlinear least squares problems:

```math
Hx = b
```

where $H$ (Hessian) matrix is large but sparse. Schur complement allows us to reduce the size of the problem.

Example, in BA, we both optimize camera poses $X$ and landmarks $L$, a simplified form of the equation looks like

```math
\begin{bmatrix}
H_{XX} & H_{XL} \\
H_{LX} & H_{LL}
\end{bmatrix}
\begin{bmatrix}
\Delta X \\
\Delta L
\end{bmatrix} = 
\begin{bmatrix}
b_X \\
b_L
\end{bmatrix}
```

Then we can use Schur complement to eliminate the landmarks.

### Compare LU, Cholesky, QR, SVD, and Eigenvalue decomposition. Which methods are commonly used in SLAM and why?

| Method                   | Form                 | Requirement                          | Usages                                                                  |
| :----------------------- | :------------------- | :----------------------------------- | :---------------------------------------------------------------------- |
| LU                       | $A=LU$               | Square matrix                        | Solve sparse linear function                                            |
| Cholesky                 | $A=LL^T$             | Symmetric Positive Definite matrices | In Hessian based optimization                                           |
| QR                       | $A=QR$               | Least squares problems               | Used in linear least squares, but less efficient than Cholesky for SLAM |
| SVD                      | $A=U \Sigma V^T$     | Rank-deficient matrices              | Used in outlier rejection                                               |
| Eigenvalue Decomposition | $A=V \Lambda V^{-1}$ | Covariance analysis                  | Used in PCA                                                             |


### Why is least squares optimization favored?

Explain how Maximum-a-posteriori (MAP) and Maximum Likelihood Estimation (MLE) are applied in SLAM.

### What representations are used to describe a map or structure in SLAM?


Which map representation would you choose for path planning and why?


Distinguish between sparse mapping and dense mapping.

### Explain the concepts of Lie groups and Lie algebra.


### How can multiple maps be merged into a single map in SLAM?

### What is Inverse Depth Parameterization?

```math
\varphi = 1/Z
```

Why use inverse depth?
+ Improve numerical stability. When the point is far, small changes cause large variation in depth.
+ Avoid singularity at infinity


### Describe pose graph optimization in SLAM.

### Define drift in SLAM. What is scale drift?

### How can computational costs be reduced in SLAM?

What is keyframe-based optimization?

Why is a Look-Up Table (LUT) considered an effective strategy?

### What is relocalization in SLAM? How does relocalization differ from loop closure detection?

### What does marginalization entail in the context of SLAM?

Marginalization is a technique used in SLAM to remove or reduce the influence of certain variables from the optimization problem while preserving as much relevant information as possible. This is done to improve computational efficiency and memory usage.

Mathematically, marginalization involves integrating out or eliminating certain variables (e.g., past poses, old landmarks) from the probability distribution.


### Explain the concept of IMU pre-integration in SLAM.

Why?

Integrating raw IMU data naively leads to:

+ Accumulation of noise and drift over time.
+ High computational cost if processed frame-by-frame.

Solution

Instead of integrating IMU data every time we need a state estimate, we pre-integrate the measurements between two keyframes and use this compact representation in optimization.


### Explain the process of image projection.

What are intrinsic and extrinsic matrices?

Which formula is used to estimate depth from a single-view image?

### What does camera calibration entail and what information is gained from it?

Provide the formulas for the K matrix and the Distortion coefficient.

### Describe the characteristics of Monocular, Stereo, and RGB-D SLAM, along with their respective advantages and disadvantages.

How is the depth map generated in RGB-D?

How is the depth map generated in Stereo?

Explain the concept of stereo disparity.

Is there any way to restore scale in monocular VSLAM?

### Explain bundle adjustment.

What are the differences between local and global bundle adjustments?

### What are the Essential and Fundamental matrices?

Fundamental Matrix (F)

The Fundamental Matrix encodes the epipolar geometry between two **uncalibrated** cameras. Given two points in two images, the epipolar constraint is:

```math
x^T_2 F x_1 = 0
```

where $x_1$ and $x_2$ are are homogeneous image coordinates. $F$ is a 3x3 rank-2 matrix, 7 DoF (9 DoF - 1 DoF homogeneous coordinate - 1 DoF scale)

+ 8-point algorithm, 7-point algorithm, RANSAC

Essential Matrix (E)

The Essential Matrix is a special case of the Fundamental Matrix for **calibrated cameras**. It relates corresponding points in normalized camera coordinates:

```math
x^T_2 E x_1 = 0 \\
E = K^T_2 F K_1
```

where $x_1$ and $x_2$ are in the normalized image coordinate system (removes distortion & focal length effects). $F$ is a 3x3 rank-2 matrix, 5 DoF (translation + rotation).

+ Directly encode translation and rotation between camera

```math
E = [t]_\times R
```

8-point algorithm

1. Collect 8 or more point pairs
2. Construct a linear system:

```math
Af=0
```

by expending $F$ constaint. $A$ is 8x9, and $f$ is 9 elements of $F$.

3. Solve the $f$ using SVD
4. **Enforce rank-2 constraint** on $F$ by setting the smallest singular value to zero

Pros & Cons

+ Simple and effective
+ Works well with many point (using RANSAC)
+ Required intrinsics to compute $E$

7-point algorithm

1. Collect 8 or more point pairs
2. Construct a linear system:

```math
Af=0
```

by expending $F$ constaint. $A$ is 7x9, and $f$ is 9 elements of $F$.

3. Solve the $f$ using SVD. Now there will be two solutions
4. Solve a cubic polynomial to find a valid combination of the two solutions.

5-point algorithm

Recover E from 5 point pairs.

### What is the Homography matrix?

Given two corresponding point pair in two images, they are related by

```math
x_2 = H x_1
```

Expanding to

```math
\begin{bmatrix}
u_2 \\
v_2 \\
1
\end{bmatrix}
=
\begin{bmatrix}
h_{11} & h_{12} & h_{13} \\
h_{21} & h_{22} & h_{23} \\
h_{31} & h_{32} & h_{33}
\end{bmatrix}
\begin{bmatrix}
u_1 \\
v_1 \\
1
\end{bmatrix}
```

We need 4 point pairs to estimate $H$

Requirement:
+ Scene is planar
+ camera undergoes pure rotation

### Describe the camera models you are familiar with.

### Explain the process of local feature matching.

Steps:

1. Feature Detection

Identify distinctive points in an image that are repeatable across different views.

2. Feature Desciptor

Each detected keypoint is represented as a descriptor, which encodes the local appearance of the feature.

3. Feature Matching

Match features between two images using descriptor similarity.

4. Verification

+ Ratio test (Lowe's criterion)
+ RANSAC
+ Epipolar constraint

FAST

1. Detects corners by checking brightness differences in a circle of 16 pixels around a candidate pixel.
2. A pixel is a corner if at least 9 contiguous pixels are much brighter or darker than the center pixel.
3. Uses machine learning for adaptive thresholding (FAST-9, FAST-12).


ORB

1. Feature Detection: Uses FAST corner detection.
2. Orientation Assignment: Computes intensity moment to assign rotation.
3. Feature Descriptor: Uses BRIEF (Binary Robust Independent Elementary Features) but modified to be rotation-invariant.

SIFT

1. Feature Detection: Uses Difference of Gaussians (DoG) at multiple scales to detect stable keypoints.
2. Orientation Assignment: Computes gradient histograms for robustness.
3. Feature Descriptor: Creates a 128-dimensional vector using gradient distributions.

How does a feature in deep learning differ from a feature in SLAM?

What strategies are effective for accurate feature matching?

### Explain how local feature tracking is performed.

What can serve as a motion model?

What methods can be used for optical flow?

Describe template tracking.

How does optical flow differ from direct tracking?

### Explain the features and differences between PTAM, ORB-SLAM, and SVO.

### What are the differences between Visual Odometry, Visual-SLAM, and Structure-from-Motion (SfM)?

### Why isn’t SIFT used in real-time VSLAM?

What are some alternatives to SIFT?

What are the benefits of using deep learning-based local feature detection?

### What is reprojection error?

What is photometric error?

### What is the Perspective-n-Point (PnP) problem?

How do you determine the camera’s pose when there is a 2D-3D correspondence?

### What are the differences between Feature-based VSLAM and Direct VSLAM?

### What methods are effective in reducing blur in an image?

### What is a co-visibility graph?

### How is loop closure detection performed?

Describe the Bag-of-Visual-Words and VLADs.

How is a Bag-of-Visual-Words created?

Explain TF-IDF.

### What distinguishes a floating-point descriptor from a binary descriptor?

How can the distance between feature descriptors be calculated?

### What defines a good local feature?

What is meant by invariance?

### How is image patch similarity determined?

Compare SSD, SAD, and NCC.

### Explain Direct Linear Transform (DLT).

### Describe the Image Pyramid.

### Outline the methods for line/edge extraction.

### Explain Triangulation.

### Implement a fast matrix multiplication algorithm.

```cpp
template <typename T>
using Matrix2_ = std::vector<std::vector<T>>;

using Matrix2d = Matrix2_<double>;

Matrix2d matmul_fast(const Matrix2d& A, const Matrix2d& B) {
    // TODO: Ensure A and B can multiply
    const auto n = A.size();

    Matrix2d res(n, std::vector<double>(n, 0.0));
    for (size_t i{0}; i < n; ++i) {
        for (size_t i{0}; i < n; ++i) {
        
        }
    }
}


```


### Implement a brute-force matcher given a set of 2 pairs of feature descriptors.

```cpp


using Descriptor = std::vector<double>;
using Descriptors = std::vector<Descriptor>;

double euclideanDistance(const Descriptor& desc1, const Descriptor% desc2) {
    // TODO: Check size consistency
    const auto size = desc1.size();

    auto sum{0.};
    for (size_t i{0}; i < size; ++i) {
        const auto diff = desc1[i] - desc2[i];
        sum += diff * diff;
    }

    return std::sqrt(sum);
}

std::unordered_map<int, int> brutalForceMatch(const Descriptors& desciptors1, const Descriptors& descriptors2) {
    std::unordered_map<size_t, size_t> matches;
    for (size_t i{0}; i < desciptors1.size(); ++i) {
      auto minDist = std::numeric_limits<double>::max();
      auto minIndex{-1};
      for (size_t j{0}; j < desciptors2.size(); ++j) {
        if (const auto dist = euclideanDistance(desciptors1[i], desciptors2[j]); dist < minDist) {
          minDist = dist;
          minIndex = j;
        }
      }

      if (minIndex != -1) {
        matches.insert({i, minIndex});
      }
    }

    return matches;
}

```