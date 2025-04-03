# Drawing in 2D

Last time, we looked at how to create compute pipeline states from kernel functions so we can perform arbitrary computation on the GPU. This time, we’ll focus on a different kind of pipeline state: _render pipeline states_.

When you have to manage a lot of the moving parts yourself, rendering is a pretty complex task. By now, you probably appreciate just how much more work it is to do anything with Metal than other graphics APIs. Maybe you’ve also gotten a glimpse of how much more powerful and flexible Metal is as a GPU-oriented API. Or maybe not. But pretty soon, you’ll have a much better feel for your latent Metal superpowers.

We will be building on the `MTKView` sample app from Day 4, so consider refreshing your memory on that before continuing.

## The Graphics Pipeline

We often use the phrase “graphics pipeline” to describe the series of stages data flows through to produce digital pictures. At the start of the pipeline, we have a set of geometric data (vertices) that represent the object(s) we want to draw. At the end of the pipeline, we have pixels in a texture.

Here is a greatly simplified diagram of the process:

![Simplied rendering pipeline](sample.png)

The light blue boxes in this figure represent “programmable” stages, portions of the pipeline where we are responsible for writing shader code. We have already seen examples of vertex and fragment functions, but have not really begun to use them in earnest.

In brief, the vertex shader reads vertex data and outputs the position of the vertex, along with any other per-vertex data needed by the rest of the pipeline. Vertices are then gathered together into primitives (points, lines, and triangles). Then, the rasterizer determines which pixels belong to each primitive and _interpolates_ the values between the vertices. These interpolated vertex properties are fed into the fragment shader, which calculates the color of the fragment. That color is then combined with the existing color in the output color texture. Once this process has run for each vertex, primitive, and fragment, the picture is complete.

The rest of this article will cover what the jobs of the vertex and fragment shader are in more detail, as well as how we build render pipeline state objects from them and use those to encode draw commands.

We will reuse the vertex and fragment shader functions we wrote on Day 5. I’ve included them here for your convenience:

```cpp
#include <metal_stdlib>
using namespace metal;
vertex float4 vertex_main(device float2 const* positions [[buffer(0)]], uint vertexID [[vertex_id]])
{
    float2 position = positions[vertexID];
    return float4(position, 0.0, 1.0);
}

fragment float4 fragment_main(float4 position [[stage_in]]) {
    return float4(1.0, 0.0, 0.0, 1.0);
}
```

## Coordinate Spaces, Briefly

When we talk about positions, it is important to realize that positions are relative to some _coordinate system_.

A coordinate system consists of a point called the _origin_ and a set of perpendicular unit-length _axes_. Given a coordinate system, a given point can be assigned a list of coordinates specifying how far away the point is from the origin along each axis. In 2D, we use x and y to denote these coordinates, while in 3D we add a z coordinate. So the point `(1, 3, 2)` is one unit (right) along the x axis, three units (up) along the y axis, and two units (toward us) along the z axis away from the origin. Because the origin is zero units away from itself, it is labeled `(0, 0, 0)`.

We will learn in future articles how to transform points from one coordinate system to another. For the time being, we won’t worry too much about that. Just know that sometimes, it’s easier to work in one system versus another, and there is a way to move between them.

## Normalized Device Coordinates

In graphics, it is often useful to use “normalized” coordinate systems, where some significance is attached to the positions that are one unit away from the origin. One such space is _normalized device coordinate_ (NDC) space, illustrated here:

![NDC](ndc.png)

What is the significance of the values -1 and 1 in NDC space? You can think of them as the boundaries of the picture we’re drawing. For example, the point (1, 1) is at the top right of NDC, while the point (-1, -1) is at the bottom left. This is true regardless of the resolution (size) of the image, which is what makes NDC space convenient to work in.

The main purpose of a vertex function is to determine the position of each vertex. But in what space are these positions defined? For now, you can think of them as being in normalized device coordinates. (This is a lie, but it’s one of those very useful lies.) This means that we’ll be defining our shapes to draw with points whose x and y values are all between -1 and 1.

## A Renderer Class

Now that we are starting to write more code in our sample apps, it is convenient to refactor some of the rendering code into its own class.

We define a Renderer class that holds the various Metal objects. Here is the part of the class definition that declares these members:

```Swift
class Renderer: NSObject, MTKViewDelegate {
    let device: MTLDevice
    let commandQueue: MTLCommandQueue
    let view: MTKView
    private var renderPipelineState: MTLRenderPipelineState!
    private var vertexBuffer: MTLBuffer!
```

By now, you know that we need a command queue to send commands to the GPU, and we need an `MTKView` to present our drawings to the screen. We also have a member of type `MTLRenderPipelineState`, which is a new pipeline state type we will introduce below.

To initialize a renderer, we provide it with a Metal device and a view to draw into. The renderer configures the view and assigns itself as the view’s delegate so it knows when to draw.

```Swift
init(device: MTLDevice, view: MTKView) {
    self.device = device
    self.commandQueue = device.makeCommandQueue()!
    self.view = view
    super.init()
    view.device = device
    view.delegate = self
    view.clearColor = MTLClearColor(red: 0.95, 
                                    green: 0.95, 
                                    blue: 0.95, 
                                    alpha: 1.0)
    makePipeline()
    makeResources()
}
```

To see how this simplifies our view controller, here’s the complete updated definition of the `ViewController` class:

```Swift
class ViewController: NSViewController {
    @IBOutlet weak var mtkView: MTKView!
    var renderer: Renderer!
    override func viewDidLoad() {
        super.viewDidLoad()
        let device = MTLCreateSystemDefaultDevice()!
        renderer = Renderer(device: device, view: mtkView)
    }
}
```

We will return shortly to the `Renderer` class, but now we turn to the central topic of this article: render pipeline states.

## Render Pipeline States

As we saw last time, we use pipeline state objects to tell our command encoder which shader function we want to run when executing subsequent commands. For example, we set the compute pipeline state containing our `add_two_values` kernel function when we wanted to add the values in two buffers, then dispatched a grid telling the GPU how many work items to execute.

When we want to encode drawing commands, we need to provide a render pipeline state. A render pipeline state encompasses a vertex function, a fragment function, and other values used to configure the GPU to our preferences. Any drawing commands (draw calls) we issue after setting the render pipeline state on the encoder will use that pipeline state’s shaders to process the vertices and fragments of the draw call.

As with compute pipeline states, we create render pipeline states by requesting them from a device. However, because render pipelines are more complex than compute pipelines, we first fill out a render pipeline descriptor.

Render pipeline descriptors are an example of the [parameter object pattern](). They gather the various parameters needed to create a render pipeline state together, so they can be passed to the pipeline state creation method all at once.

You may have noticed a call to the renderer’s `makePipeline()` method in the initializer above. This is where we will configure and create our pipeline state:

```Swift
func makePipeline() {
    guard let library = device.makeDefaultLibrary() else {
        fatalError("Unable to create default Metal library")
    }
    let renderPipelineDescriptor = MTLRenderPipelineDescriptor()
    //…
```

First, we make sure we’re able to get the app’s default Metal shader library. Then we instantiate the render pipeline descriptor.

The vertex and fragment functions to run during the vertex and fragment stages of the pipeline are essential for doing anything useful, so we retrieve each function from the library and set it on the descriptor:

```Swift
renderPipelineDescriptor.vertexFunction = library.makeFunction(name: "vertex_main")!
renderPipelineDescriptor.fragmentFunction = library.makeFunction(name: "fragment_main")!
```

There are many, many other possible variables we could set on the descriptor, but for now, the only other essential one is the color attachment’s pixel format. This tells Metal the layout of the texture we will be drawing into. We set it to the color pixel format of the MTKView, since that is where our drawing will be happening.

```Swift
renderPipelineDescriptor.colorAttachments[0].pixelFormat = view.colorPixelFormat
```

Finally, we ask the device to create the render pipeline state by calling the `makeRenderPipelineState(descriptor:)` method. This operation can fail—for example, if the descriptor is invalid—so we wrap it in a `do…catch` block:

```Swift
do {
        renderPipelineState = try device.makeRenderPipelineState(descriptor: renderPipelineDescriptor)
} catch {
        fatalError("Error while creating render pipeline state: \(error)")
}
```

## Preparing the Vertex Buffer

We’re almost ready to start drawing, but first we need something to draw. Let’s define a few points and write them into a buffer. We can define a new method called `makeResources()` in our renderer class to encapsulate this:

```Swift
func makeResources() {
    var positions = [
        SIMD2<Float>(-0.8,  0.4),
        SIMD2<Float>( 0.4, -0.8),
        SIMD2<Float>( 0.8,  0.8)
    ]
    vertexBuffer = device.makeBuffer(bytes: &positions,
                                     length: MemoryLayout<SIMD2<Float>>.stride * positions.count,
                                     options: .storageModeShared)
}
```

We use a different buffer creation method called `makeBuffer(bytes:length:options)` this time, since we have created the list of vertex positions in advance. This creates the buffer and copies the positions into it in one step. We could also have used the `makeBuffer(length:options:)` method as we did before, but then we’d have to copy the points in separately.

Note that the x and y coordinates of each point are between -1 and 1. This means that once they pass through the vertex function, they will be in NDC space already. If you can’t quite visualize where they are, consider drawing a graph and plotting them, then noticing that they can be joined into a large triangle.

# Encoding Draw Calls

Since we have made our renderer the delegate of our `MTKView`, its `draw(in:) `method will be called each frame to update the view’s contents.

As we did when clearing the view on Day 4, we start our draw method by asking the view for its current render pass descriptor, then making a command buffer:

```Swift
func draw(in view: MTKView) {
    guard let renderPassDescriptor = view.currentRenderPassDescriptor else { return }
    guard let commandBuffer = commandQueue.makeCommandBuffer() else { return }
    //…
```

We know we’ll be issuing render commands, so we create a render command encoder from the pass descriptor:

```Swift
let renderCommandEncoder = commandBuffer.makeRenderCommandEncoder(descriptor: renderPassDescriptor)!
```

When we want to draw something, we do it in three steps:

1. Set any state we want on the render command encoder, including the render pipeline state object.
2. Set any resources we want to use in our draw calls; in this case, that’s just the buffer containing the vertex positions
3. Encode draw calls, describing the types of primitive to draw and the number of vertices to use.

Below, each of these steps is executed in turn. We’ll be drawing one triangle, so we specify `.triangle` as the primitive type and `3` as the vertex count:

```Swift
renderCommandEncoder.setRenderPipelineState(renderPipelineState)
renderCommandEncoder.setVertexBuffer(vertexBuffer, offset: 0, index: 0)
renderCommandEncoder.drawPrimitives(type: .triangle, vertexStart: 0, vertexCount: 3)
```

We can issue as many draw calls as we want in each encoder, even switching between render pipeline states between them if we want.

For now, we’re just trying to get our first triangle on the screen, so we do our usual work to end the frame: end encoding, present the drawable, and commit the command buffer.

```Swift
renderCommandEncoder.endEncoding()

commandBuffer.present(view.currentDrawable!)
commandBuffer.commit()
}
```

If all has gone according to plan, we can build and run to see the results of our labors: the first triangle, with many more to come.

![Result](result.png)

After learning a lot of concepts and writing a lot of code, we finally achieved our first milestone: drawing a triangle on the screen. In the next article, we’ll talk about how to extend the amount of data processed by our pipeline by adding more attributes to our vertices. Stay tuned!