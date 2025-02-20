# Preface

This series of posts is my attempt to present the Metal graphics programming framework in small, bite-sized chunks for Swift app developers who haven’t done GPU programming before.

To run the sample code that accompanies these posts, you will need a fairly recent Mac with Xcode 13 installed. Most of the code can run on an iPhone with relatively little modification, but an iPhone is not required.

# Welcome to Metal!

What exactly is Metal, and why should you care?

Metal is a framework—a collection of application programming interfaces (APIs) — that enables you to program the graphics processing unit (GPU) in your phone or computer.

One evocative use of GPU programming is to render 3D graphics for video games, so this series on Metal will cover topics in 3D graphics programming that are essential for real-time interactive apps like games. You should be aware, though, that GPUs are used for other things besides games, like machine learning, data visualization, and physical simulations.

Unlike other graphics frameworks (Core Graphics, SceneKit, SwiftUI Canvas, etc.), Metal requires you to have more low-level knowledge. This entails understanding how to write code that runs on the GPU and how to explicitly describe the work that goes into drawing your pictures. My task with this series is to make that job approachable and at least a little bit fun.

Over the next 30 articles, we will look at many aspects of graphics programming, culminating in sample code that renders an animated, interactive, three-dimensional scene. With the knowledge you gain, you will be able to add 3D graphics to your own apps and games and be well on your way to GPU mastery.