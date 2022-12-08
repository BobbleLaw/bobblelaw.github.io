---
title: How MSCKF Works? -- Preliminaries
description: Before diving into filter-based VIO
toc: true
authors:
  - host
tags: 
  - SLAM
categories:
series:
date: '2020-11-20T22:52:56+08:00'
lastmod: '2020-11-20T22:52:56+08:00'
featuredImage:
draft: false
---

## Notations

## Review of Extended Kalman Filter

<div>
\[\begin{align}
x_{k} &= f(x_{k-1}, u_{k-1}) + w_{k-1} \\
z_{k} &= h(x_{k}) + v_{k-1}
\end{align}\]
</div>

where $w_{k} ∼ N(0, Q_{k})$, $v_{k} ∼ N(0, R_{k})$.


<div>
\[\begin{align}
_{G}^{B}\.{q}(t) &= \frac{1}{2} Ω(^{G}ω(t))_{G}^{B}q(t), ~ 
with ~ Ω(ω)= \begin{bmatrix}
              -[ω]_{×} & ω \\
              -ω^{T}   & 0
             \end{bmatrix} \\
^{G}\.{p}(t) &= ~ ^{G}v(t) \\
^{G}\.{v}(t) &= ~ ^{G}a(t) \\
\.{b}_{g}(t) &= n_{w_{g}}(t) \\
\.{b}_{a}(t) &= n_{w_{a}}(t)
\end{align}\]
</div>

<div>
\[\begin{align}
_{G}^{B}\.{q}(t) &= \frac{1}{2} Ω(^{G}ω(t))_{G}^{B}q(t), ~ 
with ~ Ω(ω)= \begin{bmatrix}
            -[ω]_{×} & ω \\
            -ω^{T}   & 0
           \end{bmatrix} \\
^{G}\.{p}(t) &= ~ ^{G}v(t) \\
^{G}\.{v}(t) &= ~ ^{G}a(t) \\
\.{b}_{g}(t) &= n_{w_{g}}(t) \\
\.{b}_{a}(t) &= n_{w_{a}}(t)
\end{align}\]
</div>

<div>
\[ \bold{x}_{B} = [^{G}q_{B}^{T},~ ^{G}p_{B}^{T},~ ^{G}v_{B}^{T},~ b_{g}^{T},~ b_{a}^{T}]^{T} \]
</div>

<div>
\[ \~{\bold{x}}_{B} = [^{G}\delta\theta_{B}^{T},~ ^{G}\~p_{B}^{T},~ ^{G}\~v_{B}^{T},~ \~b_{g}^{T},~ \~b_{a}^{T}]^{T} \]
</div>





## Complete state vector

<div>
\[ \begin{pmatrix} a&b\\c&d \end{pmatrix} \quad
\begin{bmatrix} a&b\\c&d \end{bmatrix} \quad
\begin{Bmatrix} a&b\\c&d \end{Bmatrix} \quad
\begin{vmatrix} a&b\\c&d \end{vmatrix} \]
</div>


<div>
\[\begin{aligned}
x ={}& a+b+c+{} \\
&d+e+f+g
\end{aligned}\]
</div>