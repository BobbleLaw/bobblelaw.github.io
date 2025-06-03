---
title: Understanding Automatic Differentiation
description: My humble understand towards AD.
date: '2021-03-17T20:47:18+08:00'
authors: "Bob Law"
tags: 
  - Optimization
image:
toc: false
draft: false
---

Deriving derivatives is not fun. In this post, I will deep dive into the methods for automatic differentiation (AD). After reading this post, I hope you can feel confident with using the various AD techniques, and hopefully never manually calculate derivatives again. Note that this post is not a comparison between AD libraries. For that, a good starting point is [here]().

## Why Automatic Differentiation?

Automatic differentiation is a natural continuation of scientists and engineers’ pursuit for mechanizing computation. After all, we learn how to take derivatives by memorizing a set of rules. Why can’t computers do the same thing?

Nevertheless, if you just simply follow the rules and symbolically solve for derivatives, the results you get will be deep in the expression hell. Consider the product rule we are all familiar with:

```math
\begin{align}
  \frac{d}{d x}(f(x) g(x)) = \left(\frac{d}{d x} f(x)\right) g(x)+f(x)\left(\frac{d}{d x} g(x)\right)
\end{align}
```

Assume that we are not conducting any simplification along the way. By simply following the product rule, we are multiplying the number of common terms in both $f(x)$ and 
$\frac{d}{dx}f(x)$, and $g(x)$ and $\frac{d}{dx}g(x)$ by two. Essentially, this well result in a tree-like structure where the number of terms increase exponentially. Table 1 shows the results of applying symbolic differentiation using MATLAB’s diff(f,x) function without simplification. Notice how the number of terms drastically increase, and how there are a repetition of the same terms in the derivatives’ expressions (which will come in handy when we discuss the algorithms for AD).

So what if we find derivatives numerically? After all, in most applications we don’t care about the forms of the derivatives, only the final values. Perhaps we can try the finite difference method. It is essentially the numerical approximation to the definition of gradients. Given a scalar multivariate function $f: \reals^n \to \reals$ , we can approximate the gradients as

```math
\begin{align}
  \frac{\partial{f(\bold{x})}}{\partial{x}}(f(x) g(x)) \approx \frac{f(\bold{x}+\varDelta_i)-f(x)}{h}
\end{align}
```

where $\varDelta_i$ is a small increment on dimension $i$. This is the so-called forward difference method.

There are a few issues with this method. First, it requires $O(n)$ work for n-dimensional gradients, which is prohibitive for neural networks with millions of learnable parameters. It is also plagued by numerical errors. Specifically, round-off errors (errors caused by using finite-bit floating point representations) and truncation errors (the difference between the analytical gradients and the numerical gradients). At small $\varDelta_i$, round-off errors dominate. At large $\varDelta_i$, truncation errors dominate (see Fig. 2). Such errors might be significant in ill-conditioned problems, causing numerical instabilities.

Automatic differentiation, on the other hand, is a solution to the problem of calculating derivatives without the downfalls of symbolic differentiation and finite differences. The key idea behind AD is to decompose calculations into elementary steps that form an evaluation trace, and combine each step’s derivative together through the chain rule. Because of the use of evaluation traces, AD can differentiate through not only closed-form calculations, but also control flow statements used in programs. Regardless of the actual path taken, at the end numerical computations will form an evaluation trace which can be used for AD.

In the rest of this post, I introduce the definition of evaluation traces, and the two modes of AD: forward and reverse.

## Evaluation Traces

To decompose the functions into elementary steps, we need to construct their **evaluation traces**. You can view these traces as a recording of the steps you take to reach the final results. Let’s take a look at an example function $f: \reals^2 \to \reals^1$:

```math
\begin{align}
  y = \left[\sin \left(x_{1} / x_{2}\right)+x_{1} / x_{2}-\exp \left(x_{2}\right)\right] \left[x_{1} / x_{2}-\exp \left(x_{2}\right)\right]
\end{align}
```

## Forward Mode

### Accumulating the Tangent Trace

Let’s say we want to calculate the partial derivative of $y$ with respect to $x_1$, with $x_1=1.5$ and $x_2=0.5$. As we mentioned above, we can try do it one intermediate variable at a time. Note that we are **only calculating the numerical value** of the derivative. For each $v_i$, we calculate $\.{v_i}=\frac{\partial{v_i}}{\partial{x_1}}$. Let’s try a few variables to see how it goes:

```math
\begin{align}
  \dot{v}_{-1} &= \frac{\partial x_{1}}{\partial x_{1}} = 1.0 \\
  \dot{v}_{0} &= \frac{\partial x_{2}}{\partial x_{1}} = 0 \\
  \dot{v}_{1} &= \frac{\partial (v_{-1} / v_{0}) }{\partial x_{1}} = \dot{v}_{-1} (v_{0}^{-1}) + \dot{v}_{0} (-v_{-1} v_{0}^{-2})  = 1.00 / 0.50 = 2.00 \\
  \dot{v}_{2} &= \frac{\partial (\sin{(v_{1})}) }{\partial x_{1}} = \cos(v_{1}) \dot{v_{1}} = -0.99 \times 2.00 = -1.98
\end{align}
```

For these calculations, we are simply applying chain rules with basic derivatives. Note that how $\.{v_i}$ **only depends on the derivatives and values of the earlier variables**. We can now augment Table 2 to include the derivatives.


The values of the intermediate variables are sometimes called the **primal trace**, and the derivative values the **tangent trace**.

This generalizes nicely to a generic vector-valued function $f:\reals^n \to \reals^m$. Assume we are trying to evaluate the function at $\bold{x} = \bold{a}, ~ \bold{a} \in \reals^n$. In that case, the Jacobian matrix is in the form of

```math
\begin{align}
  \mathbf{J}_{f}=\left.\left[\begin{array}{ccc}
  \frac{\partial y_{1}}{\partial x_{1}} & \cdots & \frac{\partial y_{1}}{\partial x_{n}} \\
  \vdots & \ddots & \vdots \\
  \frac{\partial y_{m}}{\partial x_{1}} & \cdots & \frac{\partial y_{m}}{\partial x_{n}}
  \end{array}\right]\right|_{\mathbf{x}=\mathbf{a}}
\end{align}
```

and each column consists of

```math
\begin{align}
  \dot{y}_{j}=\left.\frac{\partial y_{j}}{\partial x_{i}}\right|_{\mathbf{x}=\mathbf{a}}, j=1, \ldots, m
\end{align}
```

which are the partial derivatives of $y_i$ with respect to each $x_i$. So we can obtain the columns one by one by setting the corresponding $\.{x_i}$ and setting the other entries zero. This opens some interesting techniques. For example, if we want to compute the Jacobian-vector product with $\bold{r}$, we can simply set $\bold{\dot{x}}=\bold{r}$
 instead of a unit vector:

```math
\begin{align}
    \mathbf{J}_{f} \mathbf{r}=\left[\begin{array}{ccc}
    \frac{\partial y_{1}}{\partial x_{1}} & \cdots & \frac{\partial y_{1}}{\partial x_{n}} \\
    \vdots & \ddots & \vdots \\
    \frac{\partial y_{m}}{\partial x_{1}} & \cdots & \frac{\partial y_{m}}{\partial x_{n}}
    \end{array}\right]\left[\begin{array}{c}
    r_{1} \\
    \vdots \\
    r_{n}
    \end{array}\right].
\end{align}
```

In terms of complexity, forward mode is on the order of $O(n)$, where $n$ is the dimension of the input vector. Hence, it will be a great choice for $f: \reals \to \reals^m$, while performing poorly for $f: \reals \to \reals^m$.

### Using Dual Numbers

One popular way to implement forward mode AD is to use dual numbers. Dual numbers were introduced by William Clifford in 1873 through his paper *Preliminary Sketch of Biquaternions*. Clifford was studying how to extend Hamilton’s vectors to consider rotations around not only the origin, but any arbitrary lines in the 3-dimensional space. He called his extension on vectors rotors, and the sum of such rotors motors. He then introduces a symbol $\omega$ to convert motors into vectors, and that $\omega^2=0$. His reasoning was purely geometric:

> The symbol $\omega$, applied to any motor, changes it into a vector parallel to its axis and proportional to the rotor part of it. … and if made to operate directly on a vector, reduces it to zero.

However, it turns out that dual numbers can be conveniently to represent differentiation.

Formally, we represent dual numbers as $a+b\epsilon$. They follow the usual component-wise addition rule:

```math
\begin{align}
  (a + b \epsilon) + (c + d \epsilon) = (a + c) + (b + d) \epsilon.
\end{align}
```

And their multiplications work like this (similar to complex numbers):

```math
\begin{align}
  (a+b \epsilon)(c+d \epsilon)=a c+(a d+b c) \epsilon + db \epsilon^{2} = a c + (a d+b c) \epsilon,
\end{align}
```

with the rule that $\epsilon^2=0$.

The connection between dual numbers and differentiation becomes clear once we look at the Taylor series expansion. Given an arbitrary real function $f:\reals \to \reals$, we can express its Taylor series expansion at $x_0$ as

```math
\begin{align}
  f(x)=f\left(x_{0}\right)+f^{\prime}\left(x_{0}\right)\left(x-x_{0}\right)+\cdots+\frac{f^{(n)}\left(x_{0}\right)}{n !}\left(x-x_{0}\right)^{n}+\mathcal{O}\left(\left(x-x_{0}\right)^{n+1}\right)
\end{align}
```

as long as the function is $n+1$ times differentiable and has bounded $n+1$ derivative. If we instead extend them to using dual numbers as inputs, it follows that

```math
\begin{align}
  f(a + b \epsilon) =\sum_{n=0}^{\infty} \frac{f^{(n)}(a) b^{n} \epsilon^{n}}{n !}=f(a)+b f^{\prime}(a) \epsilon
\end{align}
```

So if we set $b=1$, we can get the derivative at $x=a$ by taking the coefficient of $\epsilon$ after evaluation:

```math
\begin{align} \label{eq:dual-single-v} \tag{1}
  f(a + \epsilon) = f(a) + f^{\prime}(a) \epsilon
\end{align}
```

where we expanded the Taylor series at $a$, and since $\epsilon^2=0$, all terms involving $\epsilon^2$ and higher vanish. Under this formulation, addition works:

```math
\begin{align}
  f(a + \epsilon) + g(a + \epsilon) &= f(a) + g(a) + (f^{\prime}(a) + g^{\prime}(a) ) \epsilon.
\end{align}
```

Multiplication works:

```math
\begin{align}
  f(a + \epsilon)  g(a + \epsilon) &= f(a) g(a) + (f^{\prime}(a) g(a)  + f(a) g^{\prime}(a) ) \epsilon.
\end{align}
```

And chain rule works as expected:

```math
\begin{align}
  f(g(a + \epsilon)) &=f(g(a) + g^{\prime}(a) \epsilon) \\
  &=f(g(a)) + f^{\prime}(g(a)) g^{\prime}(a) \epsilon.
\end{align}
```

This essentially gives us the way to conduct forward mode AD by using dual numbers, we can get the primal and tangent trace simultaneously.

So, how do we take this to higher dimensions?
We simply add an $\epsilon$ for each component.
Assume a function $f: \reals^n \to \reals$.
We define a vector $\boldsymbol{\epsilon} \in \reals^{n}$ where $\boldsymbol{\epsilon}_i^2 =  \boldsymbol{\epsilon}_i \ boldsymbol{\epsilon}_j = 0$. If you write out the component-wise computation following Eq.[1](), it follows that

```math
\begin{align}
  f(\boldsymbol{a} + \boldsymbol{\epsilon}) = f(\boldsymbol{a}) + \nabla f(\boldsymbol{a}) \cdot \boldsymbol{\epsilon}
\end{align}
```

$\nabla f(\boldsymbol{a}) \cdot \boldsymbol{\epsilon}$ can be interpreted as the directional derivative of $f$ in the direction of $\boldsymbol{\epsilon}$. Addition, multiplication and chain rule work as expected:

```math
\begin{align}
  f(\boldsymbol{a} + \boldsymbol{\epsilon}) + g(\boldsymbol{a} + \boldsymbol{\epsilon}) &= f(\boldsymbol{a}) + g(\boldsymbol{a}) + (\nabla f(\boldsymbol{a}) + \nabla g(\boldsymbol{a}) ) \boldsymbol{\epsilon} \\
  f(\boldsymbol{a} + \boldsymbol{\epsilon})   g(\boldsymbol{a} + \boldsymbol{\epsilon}) &= f(\boldsymbol{a}) g(\boldsymbol{a}) + (\nabla f(\boldsymbol{a}) g(\boldsymbol{a})  + f(\boldsymbol{a}) \nabla g(\boldsymbol{a}) ) \boldsymbol{\epsilon} \\
  f(g(\boldsymbol{a} + \boldsymbol{\epsilon})) &=f(g(\boldsymbol{a})) + \nabla f(g(\boldsymbol{a})) \nabla g(\boldsymbol{a}) \boldsymbol{\epsilon}
\end{align}
```

For $f : \reals^n \rightarrow \mathbb{R}^{m}$, instead of using a vector of $\epsilon$, we can use a matrix of $\epsilon$. And for each row of that matrix, we follow the exact same rule as Eq.[2]().

## Reverse Mode

### Propagate From the End

Reverse mode automatic differentiation, also known as adjoint mode, calculates the derivative by going from the end of the evaluation trace to the beginning. The intuition comes from the chain rule. Consider a function $y = f(x(t))$. From the chain rule, it follows that

```math
\begin{align}
  \frac{\partial y}{\partial t} = \frac{\partial y}{\partial x} \cdot \frac{\partial x}{\partial t}
\end{align}
```

The two terms on the right-hand side can be seen as going backwards: $\frac{\partial y}{\partial x}$ can be determined once we calculate $y$ from $x$, and $\frac{\partial x}{\partial t}$ can be calculated once we calculate $x$ from $t$. Extending this to multivariate functions, we have the multivariate chain rule:

Theorem [1](): Suppose \$g: \reals^n \to \reals^m$ is differentiable at $a \in \reals^n$ and $f: \reals^m \to \reals^{p}$ is differentiable at $g(a) \in \reals^m$. Then $f \circ g: \reals^n \to \reals^p$ is differentiable at $a$, and its derivative at this point is given by

```math
D_{a}(f \circ g)=D_{g(a)}(f) D_{a}(g)
```

The proof of it can be found in Appendix A4 of *Vector Calculus, Linear Algebra, and Differential Forms: a Unified Approach* by John H. Hubbard and Barbara Burke Hubbard.

For example, for a function $F(t) = f(g(t)) = f(x(t), y(t))$ where $f : \reals^{2} \to \reals$ and $g : \reals \to \reals^2$, we have

```math
\begin{align}
  D_{a}(f \circ g)=D_{a}(F)=\frac{d F}{d t} \\
  D_{g(a)}(f)=\left[\begin{array}{ll}
    \frac{\partial f}{\partial x} & \frac{\partial f}{\partial y}
    \end{array}\right] \\
  D_{a}(g)=\left[\begin{array}{l}
    \partial x / \partial t \\
    \partial y / \partial t
    \end{array}\right]
\end{align}
```

So it follows

```math
\begin{align}
  \frac{d F}{d t} = \left[\begin{array}{ll}
    \frac{\partial f}{\partial x} & \frac{\partial f}{\partial y}
    \end{array}\right]
    \left[\begin{array}{l}
    \partial x / \partial t \\
    \partial y / \partial t
    \end{array}\right] = \frac{\partial f}{\partial x} \frac{\partial x}{\partial t} + \frac{\partial f}{\partial y} \frac{\partial y}{\partial t}
\end{align}
```

Applying this idea to automatic differentiation, we have the reverse mode. To calculate derivatives in this mode, we need to conduct two passes. First, we need to do a forward pass, where we obtain the primal trace (Table [2]()).
We then propagate the partials backward to obtain the desired derivatives (following the chain rule). Let's go back to our example before to see reverse mode in action. Consider again the function

```math
\begin{align}
  y=\left[\sin \left(x_{1} / x_{2}\right)+x_{1} / x_{2}-\exp \left(x_{2}\right)\right] \left[x_{1} / x_{2}-\exp \left(x_{2}\right)\right].
\end{align}
```

Following the same way of assigning intermediate variables as in Table [2]() and in Fig. <a href="#orgc408073">3</a>, we can assemble an adjoint trace. An adjoint \(\bar{v}_{i}\) is defined as

```math
\begin{align}
  \bar{v}_{i} = \frac{\partial y_{j}}{\partial v_{i}},
\end{align}
```

which is equivalent to the product of all the partials from $y_{j}$ up until $v_{i}$. We start from the last variable $v_{6} = y$:

```math
\begin{align}
  \bar{v}_{6} &= \frac{\partial y}{\partial v_{6}} = 1 \\
  \bar{v}_{5} &= \frac{\partial y}{\partial v_{5}} = \bar{v}_{6} \frac{\partial v_{6}}{\partial v_{5}} = 1 \times v_{4} = 1.3513 \\
  \bar{v}_{4} &= \frac{\partial y}{\partial v_{4}} = \frac{\partial y}{\partial v_{5}} \frac{\partial v_{5}}{\partial v_{4}} + \frac{\partial y}{\partial v_{6}} \frac{\partial v_{6}}{\partial v_{4}} = \bar{v}_{5} \frac{\partial v_{5}}{\partial v_{4}} + \bar{v}_{6} \frac{\partial v_{6}}{\partial v_{4}} = 1.3513 + 1.4914 = 2.8437
\end{align}
```

And repeat the same process for all the intermediate variables, we have Table [4]() below.

Note how we are able to obtain the adjoints of the input variables $x$ and $y$ (which are equivalent to the partial derivatives of $f$ with respect to $x$ and $y$) at the same time. For a function $f : \reals^n \to \reals$, it takes only one application of reverse mode to compute the entire gradient. In general, if the dimension of the outputs is significantly smaller than that of inputs, reverse mode is a better choice.


## Conclusion

This post covers basic automatic differentiation techniques for forward and reverse mode. I learned a lot by actually implementing the techniques, instead of just going over the mathematics. For future posts, I might try cover the topics of differentiable programming and optimization for robotics.

## References

+ Textbook:
  + Griewank, Andreas, and Andrea Walther. Evaluating Derivatives: Principles and Techniques of Algorithmic Differentiation. 2nd ed. Philadelphia, PA: Society for Industrial and Applied Mathematics, 2008.
+ Papers:
  + Revels, Jarrett, Miles Lubin, and Theodore Papamarkou. &ldquo;Forward-mode automatic differentiation in Julia.&rdquo; arXiv preprint arXiv:1607.07892 (2016). ([link](https://arxiv.org/pdf/1607.07892.pdf))
  + Baydin, Atilim Gunes, et al. "Automatic differentiation in machine learning: a survey." Journal of Marchine Learning Research 18 (2018): 1-43. ([link](https://www.jmlr.org/papers/volume18/17-468/17-468.pdf))
+ Articles:
  + Reverse-mode automatic differentiation: a tutorial([link](https://rufflewind.com/2016-12-30/reverse-mode-automatic-differentiation))
  + Engineering Trade-Offs in Automatic Differentiation: from TensorFlow and PyTorch to Jax and Julia([link](http://www.stochasticlifestyle.com/engineering-trade-offs-in-automatic-differentiation-from-tensorflow-and-pytorch-to-jax-and-julia/))

