---
title: How VINS works? -- Theories
description: Breif introduction of VINS theories
toc: false
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
\[ 
  \int u \frac{dv}{dx}\, dx=uv-\int \frac{du}{dx}v\,dx
\]
</div>

<div>
\[ 
  p(\boldsymbol{x} | \boldsymbol{z}) = p(\boldsymbol{z} | \boldsymbol{x})p(\boldsymbol{x})
\]
</div>

<div>
\[ 
  p(\boldsymbol{z} | \boldsymbol{x}) = \prod_{i} p(\boldsymbol{z_i} | \boldsymbol{x_i})
\]
</div>

For example, 

<div>
\[\begin{align}
  \~a_t &= a_t + ~ _w^T{R} ~ ^w{g} + b_{a_t} + n_a \\
  \~\omega &= \omega_t + b_{\omega_t} + n_\omega
\end{align}\]
</div>

<div>
\[
  n_a \sim N(0, \sigma_a^2) \\
  n_{\omega} \sim N(0, \sigma_{\omega}^2)
\]
</div>

<div>
\[\begin{align}
  _{B_{k+1}}^G{p} &=~ _{B_{k}}^G{p} +~ _{B_{k}}^G{v}\varDelta{t} + \iint_{[t_k, t_{k+1}]} a_t ~ dt^2  \\
  _{B_{k+1}}^G{v} &=~ _{B_{k}}^G{v} + \int_{[t_k, t_{k+1}]} a_t ~ dt \\
  _{B_{k+1}}^G{q} &=~ _{B_{k}}^G{q} \otimes \int_{[t_k, t_{k+1}]} \frac{1}{2} ~ ^{B_{k}}{q} \otimes 
          \begin{bmatrix}
            \omega_t \\
            0
          \end{bmatrix} dt 
\end{align}\]
</div>

<div>
\[\begin{align}
  _G^{B_k}{R} ~ _{B_{k+1}}^G{p} &=~ _{B_{k}}^G{p} +~ _{B_{k}}^G{v}\varDelta{t} + \iint_{[t_k, t_{k+1}]} a_t ~ dt^2  \\
  _G^{B_k}{R} ~ _{B_{k+1}}^G{v} &=~ _{B_{k}}^G{v} + \int_{[t_k, t_{k+1}]} a_t ~ dt \\
  _G^{B_k}{q} \otimes _{B_{k+1}}^G{q} &=~ \gamma_{B_{k+1}}^{B_k}
\end{align}\]
</div>


<div>
\[\begin{align}
  \alpha_{B_{k+1}}^{B_k} &= \iint_{[t_k, t_{k+1}]} {_{B_t}^{B_k}{R}(\^a_t-b_{a_t}-n_a)} ~ dt^2  \\
  \beta_{B_{k+1}}^{B_k} &= \int_{[t_k, t_{k+1}]} {_{B_t}^{B_k}{R}(\^a_t-b_{a_t}-n_a)}  ~ dt \\
  \gamma_{B_{k+1}}^{B_k} &= \int_{[t_k, t_{k+1}]} {\frac{1}{2}\Omega(\~\omega_t - b_{\omega_t} - n_\omega)\gamma_{B_t}^{B_{k+1}}} dt 
\end{align}\]
</div>

<div>
\[\begin{align}
  \alpha_{B_{k+1}}^{B_k} &\approx  \^\alpha_{B_{k+1}}^{B_k} + J_{b_a}^\alpha\delta{b_a} + J_{b_a}^\alpha\delta{b_\omega}\\
  \beta_{B_{k+1}}^{B_k} &\approx \^\beta_{B_{k+1}}^{B_k} + J_{b_a}^\beta\delta{b_a} + J_{b_a}^\beta\delta{b_\omega}\\
  \gamma_{B_{k+1}}^{B_k} &\approx \^\gamma_{B_{k+1}}^{B_k} \otimes \begin{bmatrix}
                  1 \\
                  \frac{1}{2}J_{b_\omega}^\gamma\delta{b_\omega}
                \end{bmatrix} 
\end{align}\]
</div>

### Question: Purpose of pre-integration?
