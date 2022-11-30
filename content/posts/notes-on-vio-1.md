---
title: Notes on VIO - MSCKF Part I 
date: 2022-11-13T15:50:13+08:00
draft: true
---

## FEJ Explaination

可观性问题会直接带来多传感器融合融态中的关键手段：FEJ First Estimated Jacobian.

即不同残差对同一状态求Jacobian时，线性化点必须一致，以避免零空间null space退化而使不可观变量变可观。

因此对其的理解是一件非常重要的事情。初学者在没有足够资料与文档解释的情况下，对其的理解是比较困难的。

从业者应该都清楚，状态估计走到今天，前端已经进入了大成熟阶段，回环手段也较为一致(如word bag或语义)，后端优化是核心中的核心。而其中对于H矩阵/或信息矩阵的处理与维护是核心

这类矩阵维护中，基于BA的滑动窗口滤波是基础手段之一，我们需要进行边缘化的同时传递先验信息(形成pose graph)，节约开销的同时能够将先验信息传递至下一个滑动窗口。

现在我们将被Marginized后的变量描述为Xm，剩余的变量记为Xr

Marginized后：先验信息经过舒尔补操作后分别由残差矩阵b与先验信息矩阵Λ构成

这2个矩阵都由2个部分构成(具体构成就不写了)，对应的Jacobian和残差r需要由这2个矩阵通过正定方程(增量方程)反解出来

但这样就出现了2个核心问题：
1. 被Marg后的变量与测量已经丢弃，先验信息矩阵Λ中关于Xr的Jacobian在后续求解中已无法更新
2. Xr中部分变量还和其他残差有关，这些残差的Jacobian会随新的状态估计的迭代更新而不断在最新的线性化点中计算

则Λ变为了Λ1(线性化点固定)与Λ2（线性化点在变），这样最终将导致Λ的零空间改变，引入错误信息。这里导入线性代数的一个基础概念：满秩必可逆，转置逆不变，不满秩则有零空间。

因此导入了FEJ

可观性/能观性用最通俗和直观的方式来描述就是：状态一变，测量就变

单目SLAM存在7自由度不可观：3旋转，3平移，尺度皆不可观
单目+IMU存在4自由度不可观：Yaw与3平移，pitch与roll因重力而可观，尺度因加速度计而可观

因此大家在调试对应slam系统中，如果出现问题，一定要考虑到可观性/能观性问题。

另外FEL在实际工程中也存在不少问题，待后续具体实验中详解

Li Mingyang && Huang Guoquan paper

## Where the drift comes from?

整个VINS-MONO系统，较容易在系统静止或外力给予较大冲击时产生轨迹漂移，原因是imu的bias在预积分中持续发散，视觉重投影误差产生的约束失效(如静止)，先验约束可能会在LM的线性求解器中产生无法收敛的情况，导致后端优化完全失效，因视觉静止系统也无法回环。

对这一类问题的定位方向如下
1. 标定方向：VINS-MONO对系统标定的要求很高，尤其是imu的内参标定如果不准确还会直接影响双传感器之间的外参，所以定位重心首先应该放在标定的准确性上。另外也应该检验可见光相机的标定准确性，可通过ORB-SLAM等进行验证
2. 对时方向，IMU与相机的对时是一个难度较大的事项，如果有MCU从传感器直读数据进行对时的话，会是一个比较好的方式，这样对应的td会比较小。但如果通过vins-mono自己的优化对时的话，实际是异步的方式，比较容易受到各种因素的干扰，如视觉数据通过网络输入产生的延时，通过VI数据接口进入主控中的vins系统处理也会有延时，这个问题目前我们还在处理当中
3. imu本身的数据问题导致权重变化，使视觉约束无法再拉回imu的偏移，这个是之前定位问题的思路，但是实际位置姿态的估计是由3种核心约束构成的，后续定位过程中我们发现了先验约束是直接进入了无法迭代的状态，即在舒尔补或cholesky分解的过程就出现了严重问题，这个问题的定位需要更多的打印日志与数据分析，我们暂时排除了这种可能性将更多的精力放到了lamda数据NAN值上。为何在静止状态时视觉约束无法将imu轨迹漂移拉回，这个也是需要深度定位的问题，后续在问题解决后我们会给出分析与对应的解决手段.
   
## Gaussian distribution

高翔博士的VSLAM十四讲是一本非常生动和工程的书籍，有助于初学者快速掌握相关的知识。但如果仅从14讲就切入行业的话，实际的困难有2方面，一方面是在真正的工程和商业落地中，硬件与PCBA的总体设计/供应链/大厂/方案商/生产商/商业竞争会带来一系列的问题(后续文章中会时不时提到)。另一方面是十四讲本身实在是写得太好和简单，容易让同学们自认为这个学科的简单快速的跳入工程，以忽略数理和基础知识的重要性。

进入正题(理解如下部分与系列文章的后续部分需要较为扎实的线性代数基础，对概率导论中的Bayes法则清晰，熟悉高等数学中的求导/积分与链式法则)：整个讲解会以非常通俗甚至偏低智的方式完成，其目的是让大家能更简单的了解VSLAM与机器人状态估计领域并提起兴趣，可能会存在不少错误欢迎大家斧正。因为这个学科以及后续的多传感器融合融态的本质学习曲线确实是相当的陡峭。

### 高斯分布的2个重要概念

expectation and variance. 分别对应到整个高斯在概率密度函数上的均值，在高斯分布上我们也可以将其理解为极小值或极大值，以及对应高斯分布这座小山的陡度或者斜率。

简单带一嘴全概率公理：整个事件概率终值为1，也可以理解为概率密度/概率密度函数设值为1(其实是完全不同的概念，有兴趣的话可阅读MIT的概率导论)，可以理解为在x/y2轴平面图上通过积分反解出的面积。概率密度的零阶矩正好是整个全事件的概率个人理解的是，高斯分布在机器人状态估计中在大量应用，其期望与协方差的本质可以确定为状态估计本身的2种输入，分别以概率一阶矩与概率二阶矩来进行表述(对应泰勒展开)，直接对应于期望与方差/协方差(这2个其实是有差异的，但是初学者无需过多理会)高斯概率密度函数中的均值μ的英文表述为mean，与高斯分布的期望值是不同的概念

### Linear and non-linear

实际机器人运动中所有涉及的状态估计均为非线性

线性比较好理解，如在一个完全无风的篮球馆进行投篮触框之前的曲线(仅受重力影响，不要纠结地球自转行星引力了)，在一个材质完全一样的表面(又是一种假设)对底部材质完全一样的质量块给予一个推力带来的运动到停止的过程。

从如上的2个小例子大家就会明白，纯粹的线性运动，实际几乎是不可能存在的理想状态。

但凡事都有2个方面，极端非线性运动的情况，其实在机器人实际运动和操作中也是稀少的。绝大部分的机器人状态估计，在工业与民用范畴，都偏向于轻度或中度非线性。

### 大量地将线性高斯系统假设进实际工程

从1和2大家就能看出来，实际真实的VSLAM与多传感器融合融态工程中，就是将大量实际非线性运动的状态估计，以线性高斯系统模拟和假设出来，并作出最接近的状态估计。这里面最常用的数学工具就是矩阵与最小二乘，因为第一篇主要讨论高斯分布，就不在这赘述了。后续会详解的以卡尔曼滤波/扩展卡尔曼滤波进行的状态估计也会与这块相关。

### 统计独立性与不相关性

在这里我们只需要牢记在高斯系统或高斯概率密度函数中，统计独立性和不相关性是等价的。其实这2种特性在概率导论中有清晰的描述，就不赘述了。

### 香农信息与互信息

此处我们需要牢记，这2种信息对应的均为以定量来刻画不确定性，且香农信息和互信息可以实现换算关系。香农信息H以求概率密度函数负ln对数的期望值方式实现。(ln和exp也广泛应用在机器人状态估计中，涉及李群李代数部分详解)。互信息表述2个随机变量x与y之间的当一个已知后另一个的不确定性减少了多少。在联合高斯分布估计状态信息时广泛应用。香农信息与互信息具备换算关系。

### 克拉美罗下界(CRLB)与Fisher information matrix

又是2个听起来很难懂的术语？克拉美罗下界是一种方法，定义为：大家可以理解为一个界限，界定了一个参数的真实值的无偏估计(机器人状态估计本质)的协方差Σ，可以由费歇尔信息矩阵I来定义边界(机器人状态估计学习与工程中最容易搞错的就是符号和矩阵名称，不同的书籍体系中用的对应描述都有区别，一定要注意)。最终起的结果是利用了已有观测值估计参数效果和估计方式好坏的标准。此处有一重要的关系：如果我们从高斯概率密度函数中进行了K次采样(即传感器测量)，且均为统计独立，则其费歇尔信息矩阵正好是高斯协方差Σ逆的K倍。其CRLB大于等于1/K*Σ。表明在CRLB处我们状态估计量的期望等于高斯概率密度函数的均值μ通俗说就是：在高斯概率密度函数下，状态估计值的不确定下界，随测量/观测值增加变得越来越小，正符合我们的要求与标准。

### 为何要使用联合高斯分布与联合高斯概率密度函数？

这里有一个和工程紧密结合的通俗直观的解释：在机器人状态估计的过程中，我们需要得到的状态估计至少涉及空间中的2种关键变量：相机位置姿态C与路标位置姿态L，这样我们才能在完成相机位置姿态估计的同时完成建图。因为坐标系实际都是相对的。另外我们的测量值在多传感器融合融态中也有多种观测与测量，比如相机给予的观测值与视觉重投影误差，陀螺仪给予的测量值，轮速计或GPS/RTK给予的位置姿态测量值。 因此大量的使用联合高斯分布与联合高斯概率密度是常态。如经典卡尔曼的基础形式：旧的估计综合预测+测量，导入卡尔曼增益与革新量，输出新的估计。此处还需要注意归一化积，这是个很简单的概念就不赘述了，就是把多个高斯分布用某种数学形式加入一个归一化常数进行归一。大家只需要知道多个pdf(高斯概率密度函数)归一化后的结果仍然是pdf即可

### 在卡尔曼滤波与BA(光束平差法)中联合高斯概率密度应用的体现

应用的方面很多，因为今天主题写的是高斯分布，就在后续的系列更新中去做吧，而且很多部分涉及工程。总体来说就是当我们面对复杂的非线性系统的状态估计时，处处都会涉及线性高斯的假设，如最速下降法到牛顿法，到高斯牛顿法与LM法的递进，尤其是高斯分布中Σ与其的逆会在关键的H矩阵中起到一系列的作用。

## Bayesian estimation

贝叶斯法则在机器人状态估计中起的核心作用。其实这个世界的数理确实复杂，但往往它们开始往工程阶段走时，我们往往可以用最简单的方式达成理解。贝叶斯法则的本质是当有n个人(变量)，认为一件事在系统里发生了，则这件事发生的几率极高。当然反之有2种情况，如果在一个大数里这里面有个别人反对，我们可以不理会，当其为离群值(outliar)，但如果有1/3的人反对，那我们就应该评估这件事是否发生了，应该重新进行估计。       

听起来很有意思吧？其实这个也是机器人状态估计的本质方法。接下来讲讲贝叶斯法则的基础形式：后验=先验*似然/xx(标量)。这里需要牢记的是贝叶斯法则本质是描述事件A和B互为条件下概率之间确定关系的陈述。       

在具体工程工作中我们只需要关注它们在机器人状态估计中分别代表啥即可，白话说法：后验就是咱们要的状态估计x，先验就是传感器观测/测量值y/v，似然是其中比较难理解的部分，在机器人状态估计中直接对应当状态是某一个x值时，对应观测/测量值y/v应该是多少。通常是一整组的数据，在系统中我们也称之为条件概率。      

最大后验估计又是啥呢？一句话表述就是我们把所有拿到的观测y和测量v（如陀螺仪）的数据都扔进系统，然后去看状态估计x值最大的可能性。本质上我们寻找这种最优状态估计的方法，又可以根据已有的数据计算最大似然估计。实际上也是我们去最小化整体目标函数J(x)(有时叫F(x))的过程。     

目标函数来自于运动/观测方程(形式不赘述，到处都有)，与系列文章第一篇高斯分布应用有密不可分的关系。这里最重要的参考图是机器人学中的状态估计p38页中图3-1。     

贝叶斯推断和最大后验估计最大的区别：贝叶斯推断从已经建立的状态先验估计出发，比如以运动方程建立先验，最终计算全贝叶斯后验概率。最大后验估计是全扔进去做。

贝叶斯滤波：其实贝叶斯滤波是相对最傻瓜式的方法，但是也是一切的根基，目前我们掌握的大量的滤波方式也是由其引发，因此充分了解其工作机理是很有益的。    

这里必须提一下一阶马尔科夫性：k时刻状态仅与k-1时刻状态相关的假设，卡尔曼滤波的基础    

因为这一章重点讲贝叶斯，就不过多提及前向后向与卡尔曼滤波了。贝叶斯滤波的核心形式：


### Kalman filter

todo

这里提一下，线性代数的本质就是近乎无上限的求解多元多次方程组，随着我们算力与开销的扩展与廉价化，线性代数的重要性变得越来越高。在这里提一嘴，线性代数的除法即求逆，也是系统中可能涉及开销最高的部分，因此近现代科学家们发明了大量的方法对矩阵进行分解或求伪逆，如机器人状态估计中常用的舒尔补，cholesky分解，QR分解，LDU/UDL与SMW恒等式等。

1.首先第一步，机器人状态估计数论入门整体是由50%的线性代数，20%高等数学，10%概率导论，20%李群与李代数构成的。2. 线性代数部分需要深入学习矩阵的本质，相关的所有矩阵运算，熟悉向量的使用。需要充分了解矩阵正定，可逆所代表的性质，熟悉特征值与特征向量，熟悉行列式需要认真学习矩阵常用分解，分解是缓释求逆开销的核心方式：如chole sky/QR//SVD分解熟悉舒尔补操作，以及由舒尔补代出的SMW恒等式常用的针对矩阵与向量的最小二乘法3. 概率导论需要充分了解贝叶斯法则，贝叶斯推断与最大后验估计(系列的贝叶斯部分有描述)4. 高等数学主要涉及求导，积分，以及偏导数与链式法则，在机器人状态估计中相关运算需要经常和矩阵与向量进行结合，常用一阶泰勒展开。

### Choose between optimization and Kalman filter

机器人状态估计中，大家应该总体会对这一块兴趣较大，就是在自己的系统中到底是使用BA做联合优化，还是使用卡尔曼滤波做优化呢？个人认为系统如果不依赖强力前端传感器(如激光雷达，光纤陀螺仪)的情况下，后端优化是可以将状态估计做到更好的主要路径。

经过这么多年的发展，经典卡尔曼滤波KF已经衍申出了很多种形态，常用的有EKF(扩展卡尔曼)，ESKF(基于误差的卡尔曼滤波)，IEKF(带迭代的扩展卡尔曼)与MSCKF(这个通常是一个具体VIO系统的名称，也代表多状态约束卡尔曼滤波)等。

BA相对就清晰一些，通常就是通过紧耦合为系统构建一系列的约束，常见约束就是
1. 先验约束
2. 视觉重投影误差
3. IMU预积分约束，还可以加入一些类似轮速计，RTK之类的约束。万变不离其宗。

优化与滤波有如下一些基础差异：
1. 滤波是建立在一阶马尔科夫性上的单次优化，但同时受限于一阶马尔科夫性
2. 滤波比单次优化精度高，直接使用了协方差来传递状态，优化需要使用LM之类进行求解
3. 多次优化比滤波精度高，多次迭代不断收敛误差，但是缺点是开销比较高
4. 滤波比较适用于松耦合，即不同传感器通过前端直接输入位置姿态(预测+更新)，再输出新的状态估计；优化使用多种状态做紧耦合，再输出新的状态估计。
5. 个人认为VR/XR这类相对本地位置进行坐标系变换的应用更适合滤波，机器人行业优化更合适。

而实际上这些年随着整个VSLAM的发展，事情正在起变化。滤波和优化的边界越来越不明显，甚至开始各种交叉和混合使用。以先验约束迭代的卡尔曼滤波器IEKF，多状态约束的卡尔曼滤波器MSCKF，再加上更多工程手段。越来越强的前端传感器，越来越便宜的前端算力，也使得滤波的手段应用得越来越广泛。优化的优势也开始不再那么明显。

说一下现今差异上的一些理解(部分来自吴克艰博士2022SLAM论坛)：
1. 优化与滤波数学本质一样，只是形式不同，最终都是非线性最小二乘问题。(矩阵的形式和矩阵的分块，分解有较大区别)
2. 使用哪种手段取决于需要应用和落地的场景是长还是短，这块很玄学，没有明确定义，参见3
3. 精度与开销的平衡，取决于你使用的系统传感器能力与前端算力平台的能力，传感端越强，系统可以更依靠前端，偏向滤波；反之如果算力平台能力尚可，传感端较弱，偏向优化。
4. 优化实际主要手段是重线性化/边缘化，选择需要固定住的部分形成先验(未必一定是路标)，未边缘化的部分使用重线性化。滤波主要利用协方差进行状态估计。
5. 使用常规还是平方根进行处理，最终都是精度与开销的平衡。大规模的数据多用BA，对效率高的场景使用KF。未来大多数机器人实际场景个人判断是BA+SFW或MSCKF为主类，辅助以各自系统的工程手段实现。

### Visual Odometry

前端里程计总体来说是比较简单的部分，描述常用的3种，有部分前端涉及到专利壁垒，提及的主要都是公开和方便使用的。先从提取和匹配说起：
1. ORB
ORB是一种相当有效的提取前端特征的方法，主要提取角点与描述子。角点就是角点咯(和字面意思一样)，描述子(Descripter)是比较有趣的东西，实际上相当于给其定义了一个方向！即质心对应的重心。最终因为用一组二进制进行存储和处理，开销比较理想。初学者无需过度去研究这个东西的原理，属于大成熟项目，懂的使用即可在纯VSLAM里是最好用的方法之一。
2. LK光流法
最主流的前端特征提取方法，简单的说就是利用灰度差提取视觉特征点，缺点是受光流和阴影变化影响极大！优点就是极其的高效，为了提升准确度可以利用尺度不确定性建立多层光流金字塔(如3层)。这种方法成为最主流的方法，是因为在加入了各种优化/滤波用的运动传感器如IMU/车速计后进行耦合后，高效的LK光流法成为了利器，类似于航空发动机的双引擎架构。
3. 直接法
主流在用直接法的系统有DSO，直接法可以认为是加强版光流法！同样具备多重金字塔架构，用特殊的方法计算光度误差及其Jacobian 个人觉得应该是未来比较主流的手段，这一类求解的前端精度相当高。
4. 深度学习
前端深度学习前端目前总体来看比较扯淡，但是目前孙佳明博士研究出了一类针对特定目标的位姿估计前端，这个从原理和逻辑看应该属于学习网络(仍然需要样本和数据集，但是可以高速生成)，具体大家可以去研究孙博士的LoFTR，总体这个挺复杂的。
5. 基于线段跟踪和凸优化的前端
这个目前中科院自动化所在做，从原理上看非常有意思也符合逻辑，我们也在尝试这种可能性效果不佳可能还是因为我们水平一般。。。同时因为目前还没有开源，实际效果还有待市场或者项目中的验证。大家有兴趣地可以去看他们的paper，从实践效果来看很棒。
Structural Regularity Aided Visual-Inertial Odometry with Novel Coordinate Alignment and Line Triangulation

### ZUPT in VIO

VIO系统后端核心的三种约束是：先验约束，视觉约束与IMU预积分。实验对象是VINS-MONO，首先因为我们主要的工程是基于VINS-MONO，另外VINS-MONO也是当前所有VIO系统里整个骨干脉络和原理逻辑比较清晰的一版，在其基础上出的工程问题较容易被处理与定位。VIO，视觉IMU里程计，相信未来是比较实用和高性价比的位置姿态估计方式，但当前主要存在以下的一系列问题：1.FEJ，等一线性化点雅克比，VIO系统在SWF滑动窗口优化的过程中，信息矩阵H会分为两个部分H1和H2，其中一部分线性化点在变化，另一部分线性化点被固定。针对性的策略是使不同残差对同一状态估计求Jacobian时，线性化点必须一致，以避免矩阵中的Null space退化而使不可观变量变为可观。VINS-MONO未使用FEJ，原因未知，实际产生的结果并未有太多影响。2.YAW角与3自由度不可观问题，这4个自由度不可观的好处就在于系统可以更好的估计最优解，坏处在于如果发生异常现象(不要过于相信数据集，在实际情况下异常现象是很容易出现的)时，轨迹会产生突刺，并迅速因尺度不确定性而导致系统不可用，即使回环也无法处理。2.视觉完全丢失的情况，举几个很常见的例子(1)突然进入无纹理区转向 (2)突然遭受撞击在极短时间从东南向西北 (3)使用卷帘快门高速进入了急剧晃动和颠簸的状态。这多种情况都会导致系统视觉跟踪丢失，如其使用的LK法中，蓝色点表示新跟踪点，到了一段时间后转红色，这一类情况都会导致红色丢失产生一堆新的蓝色。产生的直接结果就是系统不再有视觉约束，如采用的硬件比较弱的话，系统会快速输入错误的先验约束，并逐步被IMU预积分约束联合拉飞。3.相机行进间视觉剧烈扰动的情况，相机前出现新的无法被辨识的动态障碍物，如人员，并大量破坏了特征点。在这种情况下VIO会不断更新错误的关键帧，并塞满滑窗SWF，在IMU实际并没有什么太大实际运动的情况下，视觉约束的权重矩阵Σ会占据主导。4.零速下IMU漂移的问题，这也是很普遍的现象之一了。当系统快速进入零速(缓慢进入问题不大)，系统Margin new frame的策略是不再生成新的关键帧KF，并丢弃视觉测量，继续向下传递预积分。在此种情况下VIO会很容易进入累积预积分误差进入尺度飘飞。5.零速下视觉扰动的问题，如系统顺利进入零速，轨迹稳定后相机前出现了一系列的扰动(和第3点基本一致，略有不同)，系统也会较容易进入尺度飘飞。6.长时间无yaw输入向上产生大pitch角长期静止观察产生尺度飘飞。这个问题还没有定位，但实际是有这类现象的，row角同理。对应的解决工程及手段：这块应该是充满干货的知识了，也不知道会不会有人看到~从1-6的一系列问题，大家会了解，使VIO正确和理想的工作本来就是一件充满困难的事情。首先这类系统要完全掌握和学懂原理，就需要花大量的时间，即使学懂了，上面那一系列的问题也是难以避免的，那这一系列的问题根源是什么呢？ 其实就是在你使用的位置姿态估计组件与方法中的约束！以VIO为例，其中最关键的就是先验约束，视觉约束和IMU约束，我们的目标函数最终实际是针对这3种约束的非线性最小二乘解，但这每个约束里面的Σ及其对应的权重控制策略，决定了系统的鲁棒性和可用性。而实际是否会有比较完美的策略呢？当然不会有，这里就需要使用对应的工程进行深化处理。1.零速更新ZUPT是一种工程策略，如针对问题5和6，可以直接在后端优化前加入限定条件，我们使用的策略是针对IMU输入的6自由度，判断在一段时间内IMU对应的欧式距离平均值，我们的IMU是200HZ，即5ms输出一个数据。通过40-100ms即8至20个IMU数据计算欧式距离，即可判断系统是否进入静止/零速状态。在状态被激活时，可以破坏原Σ的权重策略(如直接降低视觉权重至极小值)，使视觉滑窗SWF停止更新。对应的IMU策略有多种 (1)如不断使用最新的一组最新的IMU数据进行预积分，相当于把VIO变成了IO，工程实操会比较困难和更细节一些。(2)或者直接在零速更新判断生效时，把VIO变成VO，使IMU的预积分停止，但是第二种情况仍然会出现障碍物扰动导致的轨迹飘飞。在工程处理的过程中，一定要注意不要破坏滑窗和后端优化本身！2.针对问题2有一种更简单直接的暴力策略，实际效果是很好的，即通过IMU的高速运动输入(如上提到的欧式距离策略)，(1)一种策略是使系统直接从VIO变为IO，这样在处理剧烈颠簸和急剧晃动时的视觉丢失效果是比较好的。前提仍然是一定注意不要破坏滑窗和后端优化本身！(2)另一种策略是在后端优化中写回调函数，从前端来取红色/蓝色LK法的特征点数量进行直接判断。 一种是视觉的方法，一种是IMU的方法。本质都是针对极端情况建立新的三约束Σ调整策略。3.问题1的话可以直接尝试手动加入FEJ，我们试了一下效果没什么变化。问题2其实算是问题3-6的成因之一，就不赘述了。最后讲一下问题3，问题3是最难处理的，比如系统在运动，同时一直有个人员在前方随动的情况。这种我们目前也没有好的方法，其实从思路上来说就是让系统进入纯IO优化，但是这个判断条件难以被建立，如果主系统带NPU的话就好办，可以用机器学习的方法建立人员判断条件进入IO，那就很简单了。4.加入这些工程策略后，尺度飘飞得到了很好的处理。大家也可以使用自己的策略去约束极端情况。综上所述，最容易出现问题的场景如下：(1)静转动，动转静 (2)视觉高速晃动丢失，无纹理丢失，大Pitch/Row视觉丢失 (3)活动障碍物常规的处理手段是内参/外参调整，使用硬件同步对时确保td的准确性，使用全局快门。很多同学认为如果能保障这些都处理得很好的情况时，建立一个统一的Σ策略即可解决问题，实际也是不可能的~今天介绍的重点是如何从系统后端优化与三约束的整体层面去策略性地提升鲁棒性Robust。