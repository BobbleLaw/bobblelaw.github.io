# Vertex Attribute

In the previous article, we crossed the threshold from learning foundational concepts of Metal into actually drawing shapes with the GPU. In this article, we will augment the previous example by adding a new _attribute_ to our vertices — color — and learn how to simplify our vertex function signatures by using _vertex descriptors_.

## Attributes: Beyond Vertex Positions

When writing our first vertex function, we took two parameters: a pointer to a buffer containing two-element float vectors (positions), and a vertex ID:

```cpp
vertex float4 vertex_main(
    device float2 const* positions [[buffer(0)]],
    uint vertexID [[vertex_id]])
```

By indexing into the buffer, we could retrieve the position of the vertex and operate on it.

But what if we wanted our vertex to carry more data than just its position? When we want to render realistic lighting, we need to know which way the surface is oriented at each vertex, which is provided as a vector called the _vertex normal_. We might also want to apply a texture map to a surface, which requires us to include _texture coordinates_.

Each of these vertex properties — position, normal, texture coordinates — is called an _attribute_, and vertices can have many attributes.

We can gather the attributes of each vertex into a struct in our shader code, to make things easier to manage. Here’s a vertex struct with a position attribute and a color attribute:

```cpp
struct VertexIn {
    float2 position;
    float4 color;
};
```

With the attributes of the vertex packaged together, we could interleave positions and colors in our vertex buffer, and update our vertex function signature to take a pointer to these structs:

```cpp
vertex VertexOut vertex_main(
    device VertexIn const* vertices [[buffer(0)]],
    uint vertexID [[vertex_id]])
{
    VertexIn in = vertices[vertexID];
    ...
}
```

The return type `VertexOut` is another structure that gathers the output attributes of the vertex function, so they can be interpolated by the rasterizer:

```cpp
struct VertexOut {
    float4 position [[position]];
    float4 color;
};
```

## Alignment Considerations

Back in our Swift code, we might imagine that we could update our vertex buffer by just adding color information to the buffer:

```Swift
func makeResources() {
    var vertexData: [Float] = [
    //    x     y       r    g    b    a
        -0.8,  0.4,    1.0, 0.0, 1.0, 1.0,
         0.4, -0.8,    0.0, 1.0, 1.0, 1.0,
         0.8,  0.8,    1.0, 1.0, 0.0, 1.0,
    ]
    vertexBuffer = device.makeBuffer(
        bytes: &vertexData,
        length: MemoryLayout<Float>.stride * vertexData.count,
        options: .storageModeShared)
}
```

Superficially, this looks like it should work, but we’ve overlooked something crucial: alignment. The `float4` vector type has an alignment of 16 bytes, meaning that Metal expects every `float4` to start at a 16-byte boundary. But `float2` only has an alignment of 8 bytes, so the color values we wrote into our buffer are _misaligned_ and will not be loaded correctly.

We could alleviate this by padding the array of input values with extra floating point values to fill up the space between our positions and colors:

```Swift
func makeResources() {
    var vertexData: [Float] = [
    //    x     y  (pad  pad)  r    g    b    a
        -0.8,  0.4, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
         0.4, -0.8, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
         0.8,  0.8, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ]
    vertexBuffer = device.makeBuffer(
        bytes: &vertexData,
        length: MemoryLayout<Float>.stride * vertexData.count,
        options: .storageModeShared)
}
```

But there’s a better way: vertex descriptors.

## Vertex Descriptors

What we want is a way to decouple how we lay out our vertex data in our buffers from how we lay out our vertex structs in our shaders.

A _vertex descriptor_ is an object that tells Metal how vertex attributes are arranged in vertex buffers. It consists of an array of attributes and an array of buffer _layouts_.

We create a vertex descriptor by just instantiating it:

```Swift
let vertexDescriptor = MTLVertexDescriptor()
```

We specify each vertex attribute by providing its format, its offset, and its buffer index. The _format_ indicates the type of the attribute in the buffer (`float2`, `float4`, etc.). The _offset_ is the number of bytes from the start of the vertex to the attribute data. The _buffer index_ indicates which vertex buffer holds the data.

For example, here is how we might describe our position and color attributes:

```Swift
vertexDescriptor.attributes[0].format = .float2
vertexDescriptor.attributes[0].offset = 0
vertexDescriptor.attributes[0].bufferIndex = 0
vertexDescriptor.attributes[1].format = .float4
vertexDescriptor.attributes[1].offset = MemoryLayout<Float>.stride * 2
vertexDescriptor.attributes[1].bufferIndex = 0
```

Position is the first attribute, and each position is a two-element float vector (`.float2`). Since positions come first in the buffer, their offset is `0`. Since we’re interleaving positions and colors in the same buffer (buffer 0), we set the buffer index to 0.

Color is the second attribute; it has a format of `.float4`, since it contains 4 components (RGBA). It is offset 8 bytes (two floats’ worth of space) from the start of the vertex, and occupies the same buffer as our positions (buffer 0).

The only other bit of information we need to provide is the _stride_ between vertices, the total number of bytes a single vertex occupies.

Since all of our vertex data is in one buffer, we only need to configure the first buffer layout’s stride:

```Swift
vertexDescriptor.layouts[0].stride = MemoryLayout<Float>.stride * 6
```

This informs Metal that each vertex occupies the space of 6 floats, or 24 bytes.

Metal needs to know our vertex attributes and layout at shader compile time, so when building our pipeline(s), we set the `vertexDescriptor` property of our render pipeline descriptor to the vertex descriptor we just configured:

```Swift
renderPipelineDescriptor.vertexDescriptor = vertexDescriptor
```

## Adapting Shaders to Use Vertex Descriptors

Now that we are using a vertex descriptor, the job of writing vertex shaders gets easier. We just need to tell Metal which vertex struct members match which attributes, and Metal will automatically generate code to fetch vertex data from our buffer(s):

```cpp
struct VertexIn {
    float2 position [[attribute(0)]];
    float4 color    [[attribute(1)]];
};
```

We don’t need to worry about alignment anymore, since each struct member will be populated according to the information we provided in the vertex descriptor.

We can now simplify our vertex function signature as well:

```cpp
vertex VertexOut vertex_main(VertexIn in [[stage_in]])
```

`stage_in` indicates that we expect Metal to fetch vertices on our behalf, so we can eliminate the `vertex_id` parameter.

The rest of the vertex function continues much as it previously did, but now we also pass the vertex color through to the output:

```cpp
vertex VertexOut vertex_main(VertexIn in [[stage_in]])
{
    VertexOut out;
    out.position = float4(in.position, 0.0, 1.0);
    out.color = in.color;
    return out;
}
```

Tidy!

Since our vertices now have a color attribute, the rasterizer will automatically generate a color for each fragment by interpolating among the vertices. We can visualize this by returning the fragment color from the fragment function:

```cpp
fragment float4 fragment_main(VertexOut in [[stage_in]]) {
    return in.color;
}
```

Running the app produces a much more colorful triangle than before:

![Result](sample.png)

That’s how we add additional attributes to vertices and use Metal to simplify vertex shader authoring with vertex descriptors. Next time, we’ll look at how to feed other data besides vertex attributes into our shader functions, which will give us a glimpse of how to introduce interaction and animation into our Metal apps.