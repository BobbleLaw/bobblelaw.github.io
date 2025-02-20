# Buffer

In the previous article we got acquainted with Metal and learned a little about devices.

In this article, we will start to allocate memory on the GPU in the form of _buffers_. Buffers are essential to graphics programming, because they hold the data that the GPU operates on.

## Data?

That’s a bit abstract, so let’s talk about _what kinds_ of data might be held in a buffer.

In some graphics APIs, if you want to draw a line, there might be a function called `drawLine` to draw a line segment, or perhaps a pair of functions called `moveTo` and `lineTo`, to specify where a line starts and ends.

In Metal, we don’t have such convenient APIs available. Instead, to draw a line, we need to store the line’s endpoints in a buffer, then issue commands to the GPU that tell it to draw lines based on the data in that buffer.

In the next article, we will start to look at _how_ we prepare these commands to be executed by the GPU, but the important point for now is: if you want to draw anything with Metal, the information needed to do so must be stored in memory that the GPU can access. And in Metal, that means that it must be in a buffer.

## Creating a Buffer

We create buffers in Metal by requesting them from our device using the `makeBuffer(length:options:)` method and its siblings:

```Swift
let buffer = device.makeBuffer(length: 16, options: [])!
```

The `length` parameter is the size of the buffer’s memory in bytes (16 bytes, in this case). The `options` parameter allows us to control some aspects of the buffer’s creation, but for now we leave it empty.

To verify that the buffer has the expected size, we can print it out:

```Swift
print("Buffer is \(buffer.length) bytes in length")
```

## Copying Data into a Buffer

We won’t be able to do much with our buffer unless we copy some data into it. Continuing the example of line drawing from above, let’s learn how to put the endpoints of a 2D line into our new buffer.

We first get a _pointer_ to the buffer’s memory by calling its `contents()` method. This method returns an `UnsafeMutableRawPointer`, which tells us that Swift has no idea what type or how much memory is held by the buffer. That’s okay; we know what type of data we want to put into it.

To add type information to the pointer, we can _bind_ it to a particular type. The most natural Swift type for storing two-dimensional points is `SIMD2<Float>`, a vector type containing two floating-point coordinates. We bind our buffer pointer to this type, indicating that it has room for two points:

```Swift
let points = buffer.contents().bindMemory(to: SIMD2<Float>.self, capacity: 2)
```

Binding the memory makes it possible to treat `points` much like an ordinary Swift array. Assigning elements of this “array” copies the data directly into the buffer. Let’s write a pair of points into the buffer:

```Swift
points[0] = SIMD2<Float>(10, 10)
points[1] = SIMD2<Float>(100, 100)
```

To verify that we have successfully written into the buffer, we can retrieve the second point and print its value:

```Swift
let p1 = points[1]
print("p1 is \(p1)")
```

On my system, this prints

```cmd
p1 is SIMD2<Float>(100.0, 100.0)
```

indicating success!

At this point, you might be feeling like we’re moving pretty slowly, like we’re never going to get around to actually “doing graphics.” I want to assure you that this is normal. Learning to use Metal takes a lot longer than just picking up a high-level API and running with it. However, knowing Metal allows you to do things you could never do with those APIs. So take heart, because in the next article, we’ll start looking at how to put the GPU to work.