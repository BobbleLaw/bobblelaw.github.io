# Shaders

In the previous article, we looked at how to start and end render passes by creating a render command encoder from a view’s render pass descriptor. We also saw how the act of executing a render pass can clear the contents of a texture to a solid color. Finally, we discussed how to present the cleared texture in the view.

We are now ready to start writing code that runs on the GPU.

## What is a Shader?

We call small programs that run on the GPU “shaders.” When shaders were introduced, the name was apt: the sole purpose of a <u>RenderMan</u> shader was to determine the color of a pixel, to _shade_ it.

Nowadays, shaders do more than shading, and this can be a bit confusing. Just keep in mind that when we say shader, we mean “a relatively small program that performs a unit of work on the GPU.”

There are several types of shaders in Metal. The two that we will learn about in this article are _vertex shaders_ and _fragment shaders_. The purpose of a vertex shader is to determine where a given vertex (point) should be positioned in space. The purpose of a fragment shader (called a pixel shader in some other APIs) is to produce the color of a single pixel. We will look at these types of shaders in greater detail as we go along.

The most general kind of shader is the _compute shader_. These perform arbitrary functions on arbitrary data. Compute shaders can be used alongside render shaders (i.e., vertex and fragment shaders) to implement post-processing effects like bloom, depth of field, and motion blur. They can also be used much more broadly to implement simulations, machine learning, and other types of computation at large scale.

## The Metal Shading Language

You might reasonably assume we would write shaders in the same language as our app: Swift. Unfortunately, this is not the case. Shaders are written in an entirely different language called Metal Shading Language, or MSL.

MSL is a derivative of C++, and its syntax is rather different from Swift’s. We will look at a few short examples below, but don’t worry if it doesn’t stick immediately; learning a new language takes time.

To demonstrate how to write shaders, we can first create a macOS command-line app, which reduces the boilerplate code to a bare minimum. Then, we can create a Metal shader source file using Xcode’s New File menu and selecting the “Metal File” template:

![new project](sample.png)

This file will have the following lines at the top, which are common to most Metal shader files, and simply import the Metal standard library, making it available throughout the file.

```Cpp
#include <metal_stdlib>
using namespace metal;
```

When we start drawing, we will learn about the graphics pipeline, the conceptual flow of data from 3D models to pixels on the screen. One of the first steps, or stages, in that pipeline is vertex processing, which happens partially inside your vertex shader.

When we talk specifically of the code that will be compiled into a shader program, we will use the more precise term _function_ or _shader function_. In referring to the function that operates in a particular stage, we will use the even more precise terms _vertex function_ and _fragment function_.

Let’s take a look at each of those in turn.

# Vertex Functions

The purpose of the vertex function is to fetch data from buffers (called vertex buffers) that contain the geometric data of a single vertex and process it into the final vertex position.

With no further ado, here’s a simple vertex function:

```Cpp
vertex float4 vertex_main(
    device float2 const* positions [[buffer(0)]],
    uint vertexID [[vertex_id]])
{
    float2 position = positions[vertexID];
    return float4(position, 0.0, 1.0);
}
```

There’s a lot to unpack here. How much of this weirdness is due to C++ and how much to Metal? What does the `device` keyword signify? What is that asterisk (`*`) doing? What are those double square brackets?

Don’t worry about any of that for now. It’ll come in time. Try to see through the syntax to the flow of data: we take a list of positions as a parameter, along with something called a “vertex ID,” and we produce a 4-element vector from the input position.

Believe it or not, this little function actually does some useful work. Specifically, it looks up which position corresponds to the current vertex, then transforms it into a format that’s useful to the rest of the pipeline.

After a vertex is processed by the vertex function, it goes on to be assembled into a “primitive,” or basic geometric shape. A primitive might be a point, a line segment, or a triangle.

A primitive is a kind of conceptual entity. You can’t look at a primitive; it only exists as data, a set of points. In order to turn primitives into pixels, we need a special-purpose part of the GPU called the _rasterizer_ to chop it up.

The purpose of the rasterizer is to take the primitives we’ve asked the GPU to draw and determine which pixels might be a part of them. Then, for each pixel, the fragment function is called to determine its color.

## Fragment Functions

The art of determining pixel colors — _pixel shading_ — is an elaborate art. We will get much more familiar with it in later entries, but we’ll really only scratch the surface of what’s possible.

In the meantime, let’s take a look at the simplest possible fragment function: the constant-color fragment shader.

```Cpp
fragment float4 fragment_main(float4 position [[stage_in]]) {
    return float4(1.0, 0.0, 0.0, 1.0);
}
```

Again, don’t worry too much about the syntax. The important thing to note is that this function also returns a 4-element vector. But this vector isn’t a position; it’s a color. It’s the color we want to assign to the current pixel. The elements (_components_) are listed in red, green, blue, alpha (RGBA) order, where alpha represents the opacity of the color.

This fragment function returns a solid red for every fragment. Not very exciting, but we’re still just getting started.

I’ve been somewhat loose in distinguishing between pixels and fragments so far. The difference is subtle but important, but it’s easiest to think of fragments as partial or potential contributors to a pixel’s color. One way in which a fragment might not entirely determine a pixel’s color is if it’s transparent: in that case, the fragment’s color is blended (mixed) with any existing pixel color to produce its combined color.

So now we’ve written some Metal shader code. How do we use it?

## Libraries

Like many other kinds of code, shaders must be compiled before they are run. In Metal, this process happens in two stages. The first stage occurs when your app is compiled, and it produces a file called a _library_. A library file has the extension `.metallib`.

The runtime counterpart of a library file is a library object, and object that implements the `MTLLibrary` protocol. We get a library object by asking our device for it (noticing a pattern yet?)

I prefer to use the `guard let` pattern when creating a library, since it provides the opportunity to report an error. As long as your Metal source is being compiled into your app bundle, creating a library shouldn’t fail, but it’s good to check.

```Swift
guard let library = device.makeDefaultLibrary() else {
    fatalError("Unable to create default shader library")
}
```

Any Metal shader files in your app target are automatically compiled into a library file called `default.metalliband` copied into your app bundle at compile time. Convenient.

To get references to your shader functions, you request them by name from the library. If you want to inspect a library’s contents at runtime, you can use its `functionNames` property to get a list of functions.

In the code below, we iterate the list of functions in our default library, which contains the vertex and fragment function we wrote above.

```Swift
for name in library.functionNames {
    let function = library.makeFunction(name: name)!
    print("\(function)")
}
```

The output will be something like

```cmd
<_MTLFunctionInternal: 0x109706cd0>
    name = fragment_main 
    device = <GFX10_MtlDevice: 0x130008000>
    functionType = MTLFunctionTypeFragment 
<_MTLFunctionInternal: 0x109707d40>
    name = vertex_main 
    device = <GFX10_MtlDevice: 0x130008000>
    functionType = MTLFunctionTypeVertex
```

Each function object (which conforms to the `MTLFunction` protocol but may have a private concrete type) knows its name and its type (`.fragment` or `.vertex` in this case).

## Conclusion

We’ve come a long way, but we still have a long way to go. Fortunately, we’re very close to being able to actually draw shapes on the screen. Next up, we’ll take a deeper look at the graphics pipeline and how we incorporate shaders into larger programs that turn geometry into pixels.