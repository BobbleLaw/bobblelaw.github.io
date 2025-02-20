# Commands

So far in this series, we have talked about devices and buffers. Creating a device and asking it to allocate GPU memory are important tasks, but in order to put the GPU to work, we need to learn how to speak its language. We need to learn how to issue commands.

## What are Commands?

As mentioned in the previous article, Metal doesn’t have functions that let us simultaneously supply data and draw shapes. Providing data and issuing draw commands are separate operations, and they comprise the most common types of Metal commands.

Let’s make this a little less abstract. Say you have a buffer that contains a couple of points, and you want to draw a line segment. First, you would tell Metal which buffer holds the line data. Then, you would tell Metal to draw the line. In pseudocode, it might look like this:

```Swift
commandList.setBuffer(pointBuffer)
commandList.drawLines(1)
```

This isn’t real Metal code, but it encapsulates an extremely common pattern. First, supply the data you want the GPU to operate on, then specify the operations you want to carry out.

## Queuing Up

The GPU is a separate processor from the CPU. We want these two processors to be able to run simultaneously, rather than one waiting on the other to be able to do its work.

For this reason, the GPU doesn’t immediately execute instructions as we specify them. Instead, commands are collected in command buffers, then shipped off to the GPU as a batch.

We deliver commands to the GPU using an object called a command queue. In code, a command queue is an object that conforms to the MTLCommandQueue protocol. A command queue’s purpose in life is to create command buffers we can populate with commands and deliver them to the GPU when they’re ready to execute.

We create a command queue by asking for one from our device:

```Swift
let commandQueue = device.makeCommandQueue()!
```

Like our device, this command queue will stay alive for the duration of our app’s execution; we only ever need to create one queue.

## Creating and Submitting Command Buffers

Of course, a queue isn’t much use if it’s empty forever. So let’s give our queue some work to deliver to the GPU. Recall that we put commands into a command buffer that is then delivered to the GPU by the command queue.

We create a command buffer by asking for one from the queue:

```Swift
let commandBuffer = commandQueue.makeCommandBuffer()!
```

At this point, we have a command buffer that we can write commands into, commands like “use this buffer” and “draw a line” and “copy some data from here to there.” However, the command buffer itself doesn’t have methods that let us specify these commands; that’s done by a separate kind of object we’ll look at next.

Instead, for the moment, we’ll just tell the GPU to run our (empty) command buffer and let us know when it’s done.

We can know when a command buffer is done by adding a completed handler to it:

```Swift
commandBuffer.addCompletedHandler { completedCommandBuffer in
    print("Command buffer completed")
}
```

Getting notified of command buffer completion asynchronously allows the CPU and GPU to continue running independently, which we always want, for maximum efficiency.

To actually execute the command buffer, we commit it, which lets its associated command queue know it’s ready for execution:

```Swift
commandBuffer.commit()
```

If you run the code above in a Swift Playground, you should see the following output:

```cmd
Command buffer completed
```

This indicates that we’ve successfully created a command queue, used it to enqueue a command buffer, and been notified of its completion. That may not feel like much progress, but it actually is: every app that uses Metal uses this command submission model.

Now we just need to get some commands into the buffer.

## Encoding Commands

We call the process of writing commands into a command buffer encoding. We’ll start drawing things soon enough, but the easiest way to introduce command encoding is with the blit encoder.

The main purpose of the blit encoder is to efficiently copy regions of memory between resources (i.e., buffers and textures).

Suppose we want to copy data from our buffer of line segment points to another buffer. We might start by creating our “source” and “destination” buffers, much as we did in the previous entry.

```Swift
let sourceBuffer = device.makeBuffer(length: 16, options: [])!
let destBuffer = device.makeBuffer(length: 16, options: [])!
```

Also as before, we can write point data into the source buffer by forming a mutable pointer to a `SIMD2<Float>` array and setting its elements:

```Swift
let points = sourceBuffer.contents().bindMemory(to: SIMD2<Float>.self, capacity: 2)
points[0] = SIMD2<Float>(10, 10)
points[1] = SIMD2<Float>(100, 100)
```

To copy data between buffers, we will use a blit command encoder. Assuming we already have a device, command queue, and command buffer ready to go, we can ask our command buffer for a blit encoder:

```Swift
let blitCommandEncoder = commandBuffer.makeBlitCommandEncoder()!
```

Each command encoder type has methods that encode its respective kind of operations: compute command encoders encode commands related to general-purpose computation on the GPU, render command encodersencode rendering (drawing) commands, and blit command encoders encode copy commands.

We will use the `copy(from:sourceOffset:to:destinationOffset:size:)` method to copy from one buffer to another. Since we want to duplicate the data completely between our source and destination buffers, both offset parameters will be 0, and the size to copy will be twice the stride of one of our points, or 16 bytes in total.

```Swift
blitCommandEncoder.copy(from: sourceBuffer, sourceOffset: 0, to: destBuffer, destinationOffset: 0, size: MemoryLayout<SIMD2<Float>>.stride * 2)
```

This method writes the copy command into the encoder’s associated command buffer. It does not cause the copy to happen immediately; it happens after we commit the command buffer.

When we’re done writing commands with a command encoder, we call `endEncoding()` on it.

```Swift
blitCommandEncoder.endEncoding()
```

As before, we can then add a completed handler before committing the command buffer, so we know when the copy command is done executing.

To verify that our copy command actually worked, we can use the completed handler to retrieve the point data from our destination buffer and print it out.

```Swift
commandBuffer.addCompletedHandler { completedCommandBuffer in
    let outPoints = destBuffer.contents().bindMemory(to: SIMD2<Float>.self, capacity: 2)
    let p1 = outPoints[1]
    print("p1 in destination buffer is \(p1)")
}
```

Running this code prints the following:

```cmd
p1 in destination buffer is SIMD2<Float>(100.0, 100.0)
```

Obviously this example is pretty trivial. It seems we’ve done a lot of work just to copy a handful of bytes from one area in memory to another, but consider this example in a broader context. You now know how to encode and enqueue commands for the GPU, and that’s an important step toward using Metal to render 3D graphics.

The next step on our Metal journey is the view class that enables us to display rendered content on the screen. In the next article, we’ll finally see some results of our labor.