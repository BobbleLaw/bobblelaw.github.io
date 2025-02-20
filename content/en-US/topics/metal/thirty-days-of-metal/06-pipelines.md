# Pipelines

Let’s recap what we’ve learned in the first five installments of this series.

First, we learned about how to get a device object, which lets us allocate resources and create various other objects related to command submission. Then, we talked about creating buffers, a type of resource that holds the data to be used by the GPU in fulfilling our commands. Then, we talked about how to encode commands and submit them to the GPU for execution. Last time, we started to get acquainted with shaders, the programs we write that run on the GPU itself.

Looking back, we’ve covered a lot of ground! Our next step is to understand how to build pipelines from our shader functions.

We will begin with the simplest kind of pipeline: _compute pipelines_. In contrast to render pipelines — which have many stages like vertex processing, rasterization, fragment processing, and so on — compute pipelines really only have one stage: “do the work.”

## Kernel Functions

The work done by a compute pipeline occurs in a particular kind of shader function called a _kernel function_, also called a “compute kernel” or “compute function.” Each invocation of a kernel function does a small unit of work on various data to produce an output.

For example, a kernel function might retrieve two numbers from two different input buffers, add them together, then write the result to a third buffer. Here’s what that looks like in code:

```Cpp
kernel void add_two_values(constant float *inputsA [[buffer(0)]],
                           constant float *inputsB [[buffer(1)]],
                           device float *outputs   [[buffer(2)]],
                           uint index [[thread_position_in_grid]])
{
    outputs[index] = inputsA[index] + inputsB[index];
}
```

Once again, ignore the syntax and instead focus on the operation being performed. We take pointers to two input buffers (`inputsA` and `inputsB`), a pointer to the output buffer (`outputs`), and an index that tells us which element to operate on. In the body of the function, we do the work of getting the two input values, add them, and write the result to the outputs.

But how do we know which index we’re operating on? We’ll get to that, but first we need to know how to construct a compute pipeline that will enable us to use this kernel function.

## Creating Compute Pipelines

Creating a compute pipeline is a two-stage process. Assume we already have a device and a library object (we discussed libraries in the previous entry). First, we create an `MTLFunction` object referring to the kernel function.

As we saw last time, we can create a function object by asking for it by name from the library:

```Swift
let kernelFunction = library.makeFunction(name: "add_two_values")!
```

We then create the compute pipeline by passing the function to the `makeComputePipelineState(function:)` method on our device:

```Swift
let computePipeline = try device.makeComputePipelineState(function: kernelFunction)
```

The `computePipeline` variable now holds a reference to a `compute pipeline state` object, which conforms to the `MTLComputePipelineState` protocol. How do we use such an object?

## Organizing Compute Work

GPUs are built to operate in parallel on many pieces of data at the same time. When we write vertex and fragment functions, we are writing code that might be executed concurrently on dozens of vertices or fragments. This massive concurrency is part of what makes GPUs so efficient.

When we write kernel functions, we aren’t necessarily processing vertices or pixels, so we need some other way of organizing work. This is called a _grid_.

A grid is nothing more than a block of work. Grids can be one-, two-, or three-dimensional. You can think of the dimensions of a grid as corresponding to nested `for` loops. A one-dimensional grid is a single `for` loop; a two-dimensional-grid is a nested `for` loop; and a three-dimensional grid is a doubly-nested `for` loop.

In the same way that we might use indices such as `i`, `j`, and `k` to index the iterations of a loop, we uniquely identify the index of a piece of work through its position in the grid.

So how do we define grids in code and use them to get work done?

First, we need to understand that each invocation of our kernel function corresponds to a unique _thread_ of execution. We subdivide our grid into groups of threads — called _threadgroups_ — that are intended to execute concurrently. Like grids themselves, threadgroups can be one-, two-, or three-dimensional. The dimensions of our grid are then the size of the threadgroup multiplied by the number of threadgroups we want to execute.

Generally, the number of threads in a threadgroup should be a multiple of 32 or 64 (assuming there are at least that many invocations needed to get the job done). More specifically, it should be a multiple of the compute pipeline state’s <u>threadExecutionWidth</u> property. <u>Selecting the best threadgroup size</u> is sometimes a matter of experimentation and won’t matter for the small examples I’m showing here.

Suppose we have two arrays containing 256 floats each and we want to sum them up. Since arrays are one-dimensional data structures, we might define our threadgroup size like this

```Swift
let threadsPerThreadgroup = MTLSize(width: 32, height: 1, depth: 1)
```

Each threadgroup will have 32 threads, allowing the kernel function to run up to 32 times concurrently.

We now need to select a threadgroup count that, when multiplied by the threadgroup size, equals the total number of array elements. 256/32=8, so we need 8 threadgroups:

```Swift
let threadgroupCount = MTLSize(width: 8, height: 1, depth: 1)
```

Thus our total grid size is 256×1×1.

## Encoding Compute Work

Now that we know how to organize work into grids, let’s talk about using our compute pipeline to do the work.

First, let’s allocate a few buffers to hold the input and output values:

```Swift
let elementCount = 256
let inputBufferA = device.makeBuffer(length: MemoryLayout<Float>.stride * elementCount,
                                     options: .storageModeShared)!
let inputBufferB = device.makeBuffer(length: MemoryLayout<Float>.stride * elementCount,
                                     options: .storageModeShared)!
let outputBuffer = device.makeBuffer(length: MemoryLayout<Float>.stride * elementCount,
                                     options: .storageModeShared)!
```

Then, let’s populate the buffers with some values so we can validate that the operation completed successfully.

```Swift
let inputsA = inputBufferA.contents().assumingMemoryBound(to: Float.self)
let inputsB = inputBufferB.contents().assumingMemoryBound(to: Float.self)
for i in 0..<elementCount {
    inputsA[i] = Float(i)
    inputsB[i] = Float(elementCount - i)
}
```

Input buffer A contains the numbers 0 to 255 in sequence, while input buffer B contains the numbers 256 to 1 in reverse order. If we sum them up pairwise, each value in the output will therefore be 256.

As we saw previously, we send commands to the GPU in parcels called command buffers. Assuming we have a command queue already, we can ask it to create a command buffer:

```Swift
let commandBuffer = commandQueue.makeCommandBuffer()!
```

We now create a new kind of encoder object: a compute command encoder. As the name suggests, we use a compute command encoder to encode compute work for the GPU.

```Swift
let commandEncoder = commandBuffer.makeComputeCommandEncoder()!
```

Unlike the blit command encoder we saw previously, compute and render command encoders require a pipeline state object. This is because render commands and compute commands both execute shader functions, and a pipeline state object contains one or more compiled shader functions.

We set the previously created compute pipeline state on the command encoder before asking it to do any work:

```Swift
commandEncoder.setComputePipelineState(computePipeline)
```

We then set the inputs of our kernel function. Each buffer parameter is “bound” by calling the `setBuffer(:offset:index:)` method. Note that the index parameter of each buffer argument matches the index in the `buffer` attribute in the shader code.

```Swift
commandEncoder.setBuffer(inputBufferA, offset: 0, index: 0)
commandEncoder.setBuffer(inputBufferB, offset: 0, index: 1)
commandEncoder.setBuffer(outputBuffer, offset: 0, index: 2)
```

The command to execute a grid of compute work is called a _dispatch_, so we use the `dispatchThreadgroups(_:, threadsPerThreadgroup:)` method to tell the encoder to encode a command to dispatch our grid:

```Swift
commandEncoder.dispatchThreadgroups(threadgroupCount,
                                    threadsPerThreadgroup: threadsPerThreadgroup)
                                    ```

Since that’s all the work we want to encode, we then call `endEncoding` on the encoder:

```Swift
commandEncoder.endEncoding()
```

As before, if we want to see the results of our work, we can print out the elements of the output buffer once we’re informed the work is done.

```Swift
commandBuffer.addCompletedHandler { _ in
    let outputs = outputBuffer.contents().assumingMemoryBound(to: Float.self)
    for i in 0..<elementCount {
        print("Output element \(i) is \(outputs[i])")
    }
}
commandBuffer.commit()
```

On my machine, this prints:

```cmd
Output element 0 is 256.0
Output element 1 is 256.0
Output element 2 is 256.0
⋮
Output element 253 is 256.0
Output element 254 is 256.0
Output element 255 is 256.0
```

Success!

In this article, we learned how to write kernel functions and ask the device to compile them into compute pipeline states. We then learned about how to encode compute work that operates on multiple buffers.

At long last, we’re ready to start drawing shapes! Next time, we’ll introduce render pipeline states and draw calls, opening a whole new dimension of possibilities.