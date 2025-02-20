
# Devices

To get started, we will learn about **devices**.

A device is an abstraction of the graphics processing unit, or GPU, inside your iPhone or Mac. The GPU is a separate processor from the CPU and is specialized for different kinds of work. A big part of our job here is learning what GPUs are good at and how to program them.

In code, a device is an object that conforms to the MTLDevice protocol. This protocol includes methods for allocating GPU resources, as well as many other kinds of objects. We will see many of these as we progress through our exploration of Metal.

## Getting a Device

I recommend creating a Playground in Xcode and running the code in this article as we go along.

The first thing you should do is import the Metal framework so the compiler can find Metal’s types and functions:

```Swift
import Metal
```

The simplest way to get a Metal device is to call the `MTLCreateSystemDefaultDevice()` function. As its name suggests, this function returns the default device. Its return type is `MTLDevice?`, since it can return nil on systems that do not support Metal.

```Swift
let device = MTLCreateSystemDefaultDevice()!
```

Once we have a device, we can print out its name:

```Swift
print("Device name: \(device.name)")
```

On iOS devices, there is only one Metal device, while some Macs have several. Here are some possible device names you might see if you run this code on a Mac or iPhone:

```cmd
AMD Radeon Pro 5500M
Intel(R) UHD Graphics 630
Apple A10 GPU
Apple A14 GPU
```

Asking for the name of a device may sometimes be useful, but that’s not the most interesting thing we can do by far. In the next article, we will start talking about resources, objects that hold the data that the GPU operates on.