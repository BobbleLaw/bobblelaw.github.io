# Constants

Last time, we talked about how to add attributes to vertices so we could fill our triangle with smoothly shaded colors. In this article we will talk about how to pass constant data to shaders, which remains the same for all vertices in a draw call.


## Constant Data

We call this data _constant_ data because it doesn’t change between invocations of the shader function. This contrasts with both attribute data, which can change per-vertex, and interpolated data, which can change per-fragment. Some APIs (notably OpenGL) call these types of constant values _uniforms_, while most others use the term _constants_.

Like vertices, constant shader parameters can be ordinary types like `float`, `float2`, etc.; or they can be structs. It is often useful to collect together the constants that change at the same “frequency”—per frame, per draw call, etc.—so as to minimize the number of times you need to set buffers on the command encoder.

## Getting Constants into Shaders

Suppose we want to animate the triangle we have been drawing in the past several articles. One of the simplest things we could do is provide a vector that we use to offset the position of each vertex. By updating this vector over time, we could make the triangle move around the screen.

We can achieve this effect by using a dynamic constant in our vertex shader. The phrase “dynamic constant” might seem like a contradiction in terms, but it really just refers to constants that change over time and less often than once per draw call.

We modify the vertex function to take a constant reference to `float2` and indicate that it will be available in buffer 1, since buffer 0 holds our vertex data:

```Swift
vertex VertexOut vertex_main(
    VertexIn in [[stage_in]],
    constant float2 &positionOffset [[buffer(1)]])
```

We update the body of the vertex function to add this offset vector to the current vertex’s position, moving by the specified amount in NDC space:

```Swift
out.position = float4(in.position + positionOffset, 0.0, 1.0);
```

To get the constant data into the shader, we use the exact same method to bind the constant buffer that we used to bind the vertex buffer. We bind it to buffer slot 1, corresponding to the `buffer(1)` in the shader code:

```Swift
renderCommandEncoder.setVertexBuffer(
    constantBuffer, 
    offset: currentConstantBufferOffset, 
    index: 1)
```

Notice that we supply an offset when binding the buffer, which we haven’t done before. To understand why, we need to talk a little about multiple buffering and data synchronization.

## Triple Buffering

Recall that the CPU and GPU work in parallel: the GPU might be running previously-encoded commands while we’re encoding the next frame on the CPU. For this reason, we need to ensure that we don’t change data out from under the GPU, which could cause corruption or even a crash.

By default, a Metal layer has three drawables available. Since we need a drawable (and the texture it contains) in order to encode a frame, say that a view can have up to three frames “in flight” at a time.

We declare a global constant to indicate that we allow up to three frames to be processing at once (this is called “triple buffering”):

```Swift
let MaxOutstandingFrameCount = 3
```

To help keep track of which frame we’re rendering, we’ll add a frame count member to the renderer class, which we’ll increment once we’re done encoding each frame:

```Swift
private var frameIndex: Int
```

Since we can have three frames in flight, we also allocate three memory regions for our constants, to ensure that the constants we wrote for a previous frame don’t get overwritten before the GPU is done with them.

We don’t need to allocate three separate buffers to hold our per-frame constants. Instead, we can allocate a buffer that is three times the necessary size, and use a per-frame offset to determine the correct region to write into.

We’ll add several members to our renderer class to keep track of the constant buffer, the size and stride of the constant data, and the offset into the constant buffer that corresponds to the current frame:

```Swift
private var constantsBuffer: MTLBuffer!
private let constantsSize: Int
private let constantsStride: Int
private var constantsBufferOffset: Int
```

We set up these values in our initializer:

```Swift
self.frameIndex = 0
self.constantsSize = MemoryLayout<SIMD2<Float>>.size
self.constantsStride = align(constantsSize, upTo: 256)
self.constantsBufferOffset = 0
```

Note that we store the size and stride of the constants separately. Even though the constants themselves are quite small (only 8 bytes in total), some GPUs have a limit on how granular the buffer offset can be. Therefore, in this case, the stride is 256 bytes per constant vector.

Now that we know how big our constant buffer needs to be, we allocate it in the `makeResources()` method:

```Swift
constantBuffer = device.makeBuffer(
    length: constantsStride * MaxOutstandingFrameCount,
    options: .storageModeShared)
```

## Data Synchronization

We know we have enough space to store three frames’ worth of constants, but how to we ensure that we access each region at the right time? We need some kind of synchronization primitive that lets us encode up to three frames, but then waits until one completes before beginning the next.

It turns out that the Dispatch framework has just the thing: `DispatchSemaphore`, which is a “counting semaphore” implementation.

We initialize a Dispatch semaphore with a value that will be decremented at the start of each frame and incremented at the end of each frame. Any time its value is zero, asking it to decrement will cause it to first block the current thread until it is incremented on another thread.

```Swift
private var frameSemaphore = DispatchSemaphore(value: 
    MaxOutstandingFrameCount)
```

We structure our draw method around this semaphore. Upon entry to the `draw(in:)` method, we wait on the semaphore, then we encode our rendering work, then we add a completed handler to the command buffer that will increment the semaphore (by calling `signal()`). Before returning we increment the frame count.

```Swift
func draw(in view: MTKView) {
    // This blocks if three frames are already underway
    frameSemaphore.wait() 
    
    updateConstants()
    
    // … encode work …
    
    commandBuffer.addCompletedHandler { [weak self] _ in
        // This unblocks the waiting thread, if any
        self?.frameSemaphore.signal()
    }
    frameIndex += 1
}
```

We already saw above how to bind the constant buffer prior to issuing our draw call; everything else about our render command encoding is the same.

## Updating Per-Frame Constants

Updating the constants consists of calculating the position offset vector from the current time, then writing the vector into the constant buffer at the current offset. We add an `updateConstants()` method to do this work.

First, the offset vector calculation. We take the current time, turn it into a rotation angle by multiplying it by a speed factor and taking the result mod 2π. Then we find the vector by taking the cosine and size of the angle as our x and y coordinates, respectively:

```Swift
func updateConstants() {
    let time = CACurrentMediaTime()
    let speedFactor = 3.0
    let rotationAngle = Float(fmod(speedFactor * time, .pi * 2))
    let rotationMagnitude: Float = 0.1
    var positionOffset = 
        rotationMagnitude * SIMD2<Float>(cos(rotationAngle), 
                                         sin(rotationAngle))
                 
    // …
```

To determine where we will write the vector, we find the constant buffer offset. It is equal to the current frame index modulo the maximum frame index (3) multiplied by the constants stride:

```Swift
constantsBufferOffset = 
    (frameIndex % MaxOutstandingFrameCount) * constantsStride
```

The expression `frameIndex % MaxOutstandingFrameCount` cycles through the sequence 0, 1, 2, 0, 1, 2, etc., so after we write the constants for the third frame, we reuse the region of the buffer that was used for the first frame. This type of structure is called a _circular buffer_ or _ring buffer_.

To get a pointer to the current constant buffer region, we use the `advanced(by:)` method on the `contents()` pointer of the buffer. We then copy the position offset vector into the buffer with the `copyMemory(from:byteCount:)` method.

```Swift
    let constants = constantsBuffer.contents()
        .advanced(by: constantsBufferOffset)
    constants.copyMemory(from: &positionOffset, 
                         byteCount: constantsSize)
}
```

If we build and run our updated app, we can see the triangle gently circling the screen:

![Result](sample.png)

Next time, we’ll look at some 2D math that will help us leverage the power of animation and interaction in the future.