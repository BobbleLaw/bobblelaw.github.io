# MTKView

In the previous article, we got acquainted with Metal’s command submission model, including command queues, command buffers, and command encoders. In this article, we will meet the `MTKView` class, which allows us to display the pictures we draw with Metal on the screen.

## Introducing MTKView

The `MTKView` class is provided by the MetalKit framework. MetalKit is a small framework that provides higher-level utility types that make working with Metal easier.

`MTKView` is a subclass of the basic view class in AppKit in UIKit. On macOS, it inherits from `NSView`, while on iOS it inherits from `UIView`. At this time, Apple hasn’t provided a SwiftUI-native Metal view, so if you want to put one of these views in a SwiftUI view body, you’ll need to wrap it with `NSViewRepresentable/UIViewRepresentable`.

You use `MTKView` just like you would any other view type. You can add it to a storyboard, instantiate it manually and add it to a view hierarchy, etc. The difference is that the contents of an MTKView are updated by using Metal to draw things with the GPU.

Under the covers, an `MTKView` is backed by a special `CALayer` subtype called `CAMetalLayer`. This Metal layer, in turn, provides _textures_, which are resources that hold image data.

We’ll talk a lot more about textures in subsequent articles. The important part is that whenever you draw things with Metal, you’re drawing them _into_ a texture, and `MTKView` is the conduit through which those textures are displayed on the screen.

## Creating an MTKView with Storyboards

Let’s write some code. This time, instead of working in a Playground, we start by creating a new _project_ in Xcode. Use the macOS App template, choose a name, and make sure that you select Swift as the language and Storyboard as the interface paradigm.

![new project](sample.png)

Once the project is created and saved somewhere, open Main.storyboard.

Interface Builder does not include `MTKView` as one of the view types in the object palette. Instead, we drop a Custom View onto the root view of the view controller. We can then configure its class in the inspector. Set it to `MTKView`.

![set to MTKView](sample.png)

## Associating a Device with a View

An `MTKView` doesn’t draw anything on its own; instead, we have to issue commands to the GPU to tell it to draw for us.

The first step to ensuring we have somewhere to draw is to set the `MTKView`’s device. Associating a device to the view allows the view to create textures on our behalf. These textures then become the “canvas” to which we draw.

To set the view’s device, we need a reference to the view, so wire up an outlet in the `ViewController` class that refers to the view. I named mine `metalView`.

We instantiate our device as before: by calling `MTLCreateSystemDefaultDevice()`. We then set the `device` property on our view to this device.

The complete listing for ViewController.swift so far is shown below. Make sure the outlet is actually connected to the Storyboard by verifying that the bubble next to its declaration is filled in.

```Swift
import Cocoa
import Metal
import MetalKit

class ViewController: NSViewController {

    @IBOutlet weak var metalView: MTKView!
    var device: MTLDevice!

    override func viewDidLoad() {
        super.viewDidLoad()

        device = MTLCreateSystemDefaultDevice()
        metalView.device = device
    }
}
```

Note that we have also added a property to the view controller that stores the device; this is so we can create other Metal objects as necessary down the line.

Building and running the app at this point would be underwhelming. We’d probably just see a gray window, since we haven’t given the view a way to tell us when to draw, nor have we issued any GPU commands to draw into it.

## The MTKViewDelegate Protocol

The most convenient way to get notified when an `MTKView` wants to draw is by setting its `delegate` property. By default, the view runs an internal timer that fires regularly, allowing us to render interactive content.

The first step of setting up a delegate is informing Swift that we want our `ViewController` class to conform to the `MTKViewDelegate` protocol:

```Swift
class ViewController: NSViewController, MTKViewDelegate
```

We can then assign the view controller as the view’s delegate in `viewDidLoad()`:

```Swift
metalView.delegate = self
```

If we stop here, though, our program won’t compile, because we haven’t implemented the required methods of the protocol. There are two of them, and minimal implementations of both are shown here:

```Swift
func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {
}
func draw(in view: MTKView) {
}
```

The `mtkView(_:drawableSizeWillChange:)` method is called when the view’s size changes, so we can reshape the contents to fit the view if needed.

The `draw(in:)` method is called periodically so we have the chance to redraw the contents of the view with Metal. This is where we will do most of our work.

## Clearing the Canvas

We won’t quite get around to drawing shapes in this article; there are still a few more concepts we need to introduce first.

Instead, we will show how to clear the view to a solid color using some of the objects we introduced last time, as well as a new encoder type.

The new encoder type is `MTLRenderCommandEncoder`. As its name suggests, it allows us to encode rendering (drawing) commands into our command buffers. The `MTLRenderCommandEncoder` protocol includes many methods for doing all sorts of rendering work.

We create a render command encoder by asking for one from the command buffer. However, unlike blit command encoder creation, creating a render command encoder requires some extra information: a render pass descriptor.

A render pass descriptor is an object that tells the encoder which texture(s) it is drawing into. In this case, because we’re drawing into an `MTKView`, these textures are provided by the view itself. We ask the view for its `currentRenderPassDescriptor` to get the pass descriptor for the current frame:

```Swift
let renderPassDescriptor = view.currentRenderPassDescriptor
```

This render pass descriptor comes preconfigured with the view’s current texture, along with some other state that determines how the existing contents of the texture should be treated. By default, the texture is cleared to the _clear color_ of the view, which we can control by setting its `clearColor` property:

```Swift
// Set the view's clear color to a pleasant shade of blue
metalView.clearColor = MTLClearColor(red: 0.0, green: 0.5, blue: 1.0, alpha: 1.0)
```

As always, we need a command buffer before we can create a command encoder, so the first half of the `draw(in:)` method looks like this:

```Swift
let commandBuffer = commandQueue.makeCommandBuffer()!

guard let renderPassDescriptor = view.currentRenderPassDescriptor else {
    print("Didn't get a render pass descriptor from MTKView; dropping frame...")
    return
        }

let renderPassEncoder = commandBuffer.makeRenderCommandEncoder(descriptor: renderPassDescriptor)!
```

First, we make a command buffer, then we ask for the current render pass descriptor, then we use it to make a render command encoder. If we fail to get a render pass descriptor, we skip the current frame.

Now that we have a render command encoder, we could use it to draw some things. But we don’t know how to do that just yet. In the meantime, we’ll just end encoding, indicating to the command buffer that the current _render pass_ is complete.

```Swift
renderPassEncoder.endEncoding()
```

Even without any drawing commands in the command buffer, the texture will still be cleared. Now we just need to get it onto the screen.

When we draw into an `MTKView`, its texture is wrapped in an object called a `drawable`, which allows us to display it on the screen. We call this process _presentation_. To present the current drawable/texture on the screen, we call the `present(_:)` method on the command buffer:

```Swift
commandBuffer.present(view.currentDrawable!)
```

This call tells the system to replace the existing contents of the view with the newly-drawn contents when the GPU is done executing the previous commands (in this case, that just means clearing the texture).

As usual, we can now commit the command buffer and see the results of our work.

```Swift
commandBuffer.commit()
```

If everything went according to plan, you should see the window cleared to a pleasing shade of blue:

![result](sample.png)

All right, now we’re getting somewhere! We’re finally using the GPU to put colors on the screen. Well, one color. But there will be a lot more colors soon. In the next article, we’ll introduce yet another essential topic, _shaders_, and start to write code that runs on the GPU!