---
title: MSCKF Series
description:
toc: true
tags: []
categories:
series:
date: '2022-11-18T19:14:11+08:00'
lastmod: '2022-11-20T22:52:56+08:00'
draft: false
---

## Notations

## Review of Extended Kalman Filter

```math
\begin{align}
x_{k} &= f(x_{k-1}, u_{k-1}) + w_{k-1} \\
z_{k} &= h(x_{k}) + v_{k-1}
\end{align}
```

where $w_{k} ∼ N(0, Q_{k})$, $v_{k} ∼ N(0, R_{k})$.


```math
\begin{align}
_{G}^{B}\dot{q}(t) &= \frac{1}{2} \Omega(^{G}\omega(t))_{G}^{B}q(t), ~
\text{with} ~ \Omega(\omega)= \begin{bmatrix}
              -[\omega]_{\times} & \omega \\
              -\omega^{T}   & 0
             \end{bmatrix} \\
^{G}\dot{p}(t) &= ~ ^{G}v(t) \\
^{G}\dot{v}(t) &= ~ ^{G}a(t) \\
\dot{b}_{g}(t) &= n_{w_{g}}(t) \\
\dot{b}_{a}(t) &= n_{w_{a}}(t)
\end{align}
```

```math
\begin{align}
_{G}^{B}\dot{q}(t) &= \frac{1}{2} \Omega(^{G}\omega(t))_{G}^{B}q(t), ~
\text{with} ~ \Omega(\omega)= \begin{bmatrix}
            -[\omega]_{\times} & \omega \\
            -\omega^{T}   & 0
           \end{bmatrix} \\
^{G}\dot{p}(t) &= ~ ^{G}v(t) \\
^{G}\dot{v}(t) &= ~ ^{G}a(t) \\
\dot{b}_{g}(t) &= n_{w_{g}}(t) \\
\dot{b}_{a}(t) &= n_{w_{a}}(t)
\end{align}
```

```math
\bold{x}_{B} = [^{G}q_{B}^{T},~ ^{G}p_{B}^{T},~ ^{G}v_{B}^{T},~ b_{g}^{T},~ b_{a}^{T}]^{T}
```

```math
\widetilde{\bold{x}}_{B} = [^{G}\delta\theta_{B}^{T},~ ^{G}\widetilde{p}_{B}^{T},~ ^{G}\widetilde{v}_{B}^{T},~ \widetilde{b}_{g}^{T},~ \widetilde{b}_{a}^{T}]^{T}
```

## Complete state vector

```math
\begin{pmatrix} a&b\\c&d \end{pmatrix} \quad
\begin{bmatrix} a&b\\c&d \end{bmatrix} \quad
\begin{Bmatrix} a&b\\c&d \end{Bmatrix} \quad
\begin{vmatrix} a&b\\c&d \end{vmatrix} 
```


```math
\begin{aligned}
x ={}& a+b+c+{} \\
&d+e+f+g
\end{aligned}
```
