---
layout: post
title: Structured Light from Motion - Build a SL used on Manipulator
tags: [structured light, robotics]
---

This winter I am going to finish my master degree in UST. In the pass two years, I spent most of my time digging into structured light systems, 3D scanning and object pose estimation, like real deep. Until now two structured light systems, each of which consists of a PointGrey Camera and a TI DLP3000/4500 EVM, are successfully deployed on two manipulators (UR5). With my software, they are capable of 
1. Project custom patterns designed for different types of objects;
2. Tracking object with simple surface geometry under low moving speed;
3. Tracking object 6 DoF pose based on known CAD with single RGB camera;
4. View planning based on current scan quality, and SL execusive paramters;
5. Communicate via ROS to move the manipulator.

These sounds bluffing and overwhelming, right? Of course not all the functions are integrated into a single software, that's insane amount of work! I am still wokring on it, but the good news is at least I have implemented all of them. 

Considering if I can't get enrolled into MUJIN, I may not do this again, I decide to write down all my experience when I built the system, including therories, environment setup, problems encountered, libraries usage, software structure design, and etc. Hope it will be helpful to someone who is interested in active 3D vision system.

The whole series will contain the following sections.
+   [Structured Light - Overview](http://example.com/)
+   [Structured Light - Hardware](http://example.com/)
+   [Structured Light - Software](http://example.com/)
+   [Structured Light - Calibration](http://example.com/)
+   [Object Pose Estimation - With Point Cloud](http://example.com/)
+   [Object Pose Estimation - With Monocular RGB](http://example.com/)
+   [Manipulator - Overview](http://example.com/)
+   [Manipulator - ROS](http://example.com/)
+   [Manipulator - Calibration](http://example.com/)
+   [Manipulator - Planning](http://example.com/)

All these sections may be separated into several parts, according to the content.

Feel free to email me if you have any problems when you try to make a structured light system, or find confused in some concepts or algorithms derivation. 

Enjoy!