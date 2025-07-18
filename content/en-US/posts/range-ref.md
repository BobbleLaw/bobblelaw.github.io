---
title: range_ref<T>
description: A fast, lightweight, non-owning view of a range.
date: '2020-11-12T19:37:43+08:00'
authors: "Bob Law"
tags: 
  - C++
image:
toc: false
draft: false
---

Passing references to functions is great.

```cpp
struct some_user_type;

void foo(some_user_type const& v)
{
    // freely read from v
}
```

Memory management and lifetime handling is done by the caller.
Users of your function / API have a liberating amount of freedom how they organize their data: on the stack, on the heap, in smart pointers, in vectors, it doesn't matter.
They can pass a reference to your function.
No (potentially expensive) copy is performed.

From an API perspective, C++ references are views on a single object.
We already have a few "view types" for more complex needs:

* [std::string_view](https://en.cppreference.com/w/cpp/string/basic_string_view) for "views on strings" (C++17)
* [std::span](https://en.cppreference.com/w/cpp/container/span) for "views on contiguous ranges" (C++20)
* [mdspan](http://open-std.org/JTC1/SC22/WG21/docs/papers/2020/p0009r10.html) for a multidimensional version of `std::span` (proposed)
* [function_ref](https://foonathan.net/2017/01/function-ref-implementation/) for "views on callables"

> These types can quickly lead to dangling references and should mainly be used as function parameters.
> Arthur O'Dwyer calls them [borrow types or parameter-only types](https://quuxplusone.github.io/blog/2018/03/27/string-view-is-a-borrow-type).
> A more general term is "view type".
> I personally avoid calling them "reference types" as that only ever leads to confusion.

In this blog post I propose and present a new view type that I find quite useful:

```cpp
void foo(range_ref<std::string_view> values)
{
    values.for_each([&](std::string_view s) { 
        std::cout << s << std::endl;
    });
}

// usage examples:
std::vector<std::string> v = ...;
foo(v);

std::list<char const*> l = ...;
foo(l);

std::span<std::string_view> s = ...;
foo(s);

std::set<std::string> s = ...;
foo(s);

char const* a[] = ...;
foo(a);

foo({"hello", "world"});
```

A `range_ref<T>` is a non-owning, lightweight view of a range whose element type is _convertible_ to `T`.
If used as a function parameter, we can pass any object that supports [range-based for](https://en.cppreference.com/w/cpp/language/range-for) and where `T(*std::begin(my_obj))` is valid.

In the previous example, `foo` is not templated and can be implemented in a source file.
However, we still have extreme freedom how to pass parameters, making for a delightful API.

The best thing: `range_ref<T>` is completely non-allocating and quite fast (though not as fast as a templated implementation can be).


## Motivation

Before we start with `range_ref<T>`, I want to motivate the need for view types a bit further.
(If you already drank the view type kool-aid, you can safely skip to the next section.)

On a basic level, we use `T&` for a mutable view on a single object, and, correspondingly, `T const&` for a readonly view.
(Don't confuse this with a view on an immutable object, as the underlying object might get changed through a different alias.)

So, why do we even bother with more complex view types?

```cpp
void foo(std::string const& s)
{
    // do some parsing, maybe?
}
```

Isn't `std::string const&` already a view on a string?

Yes and no.

`std::string const&` is a view on a string, but not all views on a string have to be `std::string const&`.
`(char const*, size_t)` is also a perfectly fine view on a string.

One could say that `std::string const&` is "too concrete".
It forces the caller to use a specific type to manage their strings.
Even if the actual call of `foo` does not allocate, the caller is forced to convert their strings into a `std::string` (either explicitly or implicitly), potentially doing a short-lived heap allocation.

`foo("'sup")` will compile, but constructs a temporary string.

> Most standard libraries actually implement [small](https://akrzemi1.wordpress.com/2014/04/14/common-optimizations/) [string](https://shaharmike.com/cpp/std-string/) [optimization](https://blogs.msmvps.com/gdicanio/2016/11/17/the-small-string-optimization/).
> Depending on the actual implementation, strings up to 23 characters might actually not allocate.

Views don't have to be references to concrete types.
Especially if there are multiple choices for representation.
Most complex view types operate on a slightly higher level of abstraction and wrap enough information to support a larger class of concrete types.

`std::string_view` is the [standard library's view on strings](https://en.cppreference.com/w/cpp/string/basic_string_view).

From an implementation perspective, it's just a glorified `std::pair<char const*, size_t>`.

From an API perspective, `std::string_view` is a view on any contiguous range of `char`s.
As a non-owning type, lifetime is handled by the caller and any string-like type that can provide `char const*` and size can be passed via `std::string_view` without allocation.
This includes `std::string`, but also C strings, `std::vector<char>`, `std::array<char, 20>`, and even subranges of these.

With C++20, we get `std::span<T>`, the [view on contiguous ranges of `T`](https://en.cppreference.com/w/cpp/container/span), or view on array-like types.
`std::span<T>` is a really great type.
Too often I see APIs that take `std::vector<float> const& values`, because they want to accept a range of `float`s.
If the values live in a local array, the caller has to construct a temporary `vector` to call the function.
Passing `{1.5f, 2.5f, 3.5f}` constructs a temporary `vector`.

Sometimes, there is an additional overload that takes `float const*` and `size_t`, either to acknowledge the inappropriateness of `std::vector<float> const&` or to channel their inner C programmer.
While this does solve the performance issues, it doesn't make the API easier to use:

```cpp
std::array<float, 10> get_values();
void process_values(float const* values, size_t size);

// what we have to do:
auto vals = get_values();
process_values(vals.data(), vals.size());

// what we would love to do:
process_values(get_values());
```

With `std::span`, we can! 

`void process_values(std::span<float const> values)` is exactly the abstraction we want to use here.

## The Need for `range_ref<T>`

So ...

Why `range_ref<T>`?

`std::span<T>` has two big limitations: the objects have to be contiguous in memory and they have to match quite well.
You can neither pass `std::set<double>` nor `std::vector<int>` to a `std::span<double const>`.

Consider the following function:

```cpp
std::string concatenate(??? strings)
{
    std::string result;
    for (auto const& s : strings)
        result += s;
    return result;
}
```

What type would you give `strings`?

Well, we can certainly avoid this question by templating the function:

```cpp
template <class StringRange>
std::string concatenate(StringRange&& strings)
{
    std::string result;
    for (auto const& s : strings)
        result += s;
    return result;
}
```

However, this most likely forces us to implement `concatenate` in the header and will probably increase compile time.
For more complex functions, we might have to include additional headers, leading to increased header dependency.

Before C++17 we might have been tempted to pass `std::vector<std::string> const& strings`.
After C++17/20, you might consider:

* `std::vector<std::string_view> const& strings`
* `std::span<std::string const> strings`
* `std::span<std::string_view const> strings`

Especially the last one seems great, no? view of views, sounds delicious.

Well, you cannot pass a `std::vector<std::string>` to the first and third.

And the second would not accept a `std::array<char const*, 3>`.


## Designing `range_ref<T>`

You are hopefully convinced by now that a proper type for the `strings` in `concatenate` is missing.

I call this type `range_ref<T>` and it is a view on:

* any type that supports [range-based for](https://en.cppreference.com/w/cpp/language/range-for)
* whose elements are _convertible_ to `T`

It should be non-owning, non-allocating, and fast.

The idea is to provide a type-erased wrapper of the following templated function:

```cpp
template <class T, class Range, class Callback>
void call_for_each(Range&& range, Callback&& callback)
{
    for (auto&& v : range)
        callback(T(v));
}
```

The `range_ref<T>` is type-erasing `Range` in the sense that while it accepts a generic `Range` from the caller, neither the `range_ref<T>` itself nor the API author know the concrete `Range` compile-time.

The `T` is our element type contract: only elements convertible to `T` are allowed.

`callback` on the other hand will be hidden from the caller and is provided by the consumer of a `range_ref<T>`.

Let's assume that we have a `function_ref<ReturnT(ArgsT...)>` type as described by [Vittorio Romeo](https://vittorioromeo.info/index/blog/passing_functions_to_functions.html) or [Jonathan Müller](https://foonathan.net/2017/01/function-ref-implementation/).
This is basically a function pointer that also allows capturing lambdas and other callables (a non-owning view of a callable, implemented roughly via function pointer plus `void*`).

With this we can formulate our first version of `range_ref<T>`:

```cpp
template <class T>
struct range_ref
{
    void for_each(function_ref<void(T)> callback)
    {
        _for_each(_range, callback);
    }

private:
    using range_fun_t = void (*)(void*, function_ref<void(T)>);

    void* _range = nullptr;
    range_fun_t _for_each = nullptr;
};
```

Before we see how to construct this type, we can already look at its consumer-site API:
The type itself is only templated on `T`, so it is agnostic to the actual range type and also to the callback type.

We now have a solution for our `concatenate` example:

```cpp
std::string concatenate(range_ref<std::string_view> strings)
{
    std::string result;
    strings.for_each([&](std::string_view s) { 
        result += s; 
    });
    return result;
}
```

> Unfortunately, we cannot use range-based for with `range_ref<T>`.
> While it is possible to design `range_ref<T>` to support it, it adds quite some overhead and can easily lead to dangling references.
> In the callback pattern, it is guaranteed that any temporary that we convert to `std::string_view` outlives the callback function.

However, we are still missing the construction of `range_ref<T>`:

```cpp
template <class Range, 
          std::enable_if_t<is_compatible_range<Range, T>::value, int> = 0>
range_ref(Range&& range)
{
    _range = &range;
    _for_each = [](void* r, function_ref<void(T)> callback) {
        for (auto&& v : *reinterpret_cast<decltype(&range)>(r))
            callback(v);
    };
}
```

Here, we accept any range that is compatible, i.e. whose elements are convertible to `T`.
We use [SFINAE](https://en.cppreference.com/w/cpp/language/sfinae) to reject incompatible ranges.
This way, we can for example overload functions on `range_ref<double>` and `range_ref<std::string_view>` without any problems.
Note [the particular form of the `std::enable_if`](https://en.cppreference.com/w/cpp/types/enable_if#Notes).
While we only have one constructor for now, the `std::enable_if_t<cond, int> = 0` pattern prevents errors when overloading multiple templates functions.

`decltype(&range)` is used to recover the pointer to the correct range type.
`Range*` would not work when passing lvalue references as pointers to references are forbidden.

A possible implementation of `is_compatible_range` is:

```cpp
template <class RangeT, class ElementT, class = void>
struct is_compatible_range : std::false_type { };

template <class RangeT, class ElementT>
struct is_compatible_range<RangeT, ElementT, std::void_t<
        decltype(ElementT(*std::begin(std::declval<RangeT>()))),
        decltype(std::end(std::declval<RangeT>()))>
    >
     : std::true_type { };
```

This uses [the C++17 helper `std::void_t`](https://en.cppreference.com/w/cpp/types/void_t) that simplifies partial specialization SFINAE.
`std::begin` and `std::end` make sure that C arrays work.
We ensure that the element type is convertible to our target type via `ElementT(*std::begin(...))`.

One small problem arises when passing `const&` ranges: `_range = &range;` is invalid because it tries to convert `Range const*` to `void*`.
Depending on your preference for purity, we can either use a `const_cast` (which is fine as the later `reinterpret_cast` will re-add the `const`) or a `union` of `void*` and `void const*`.

Congratulations, we have our first working version of `range_ref<T>`!

And we gained a lot of freedom when passing types to `concatenate`.
A small collection of possible caller types that are supported and do not cause additional allocations:

* `std::vector<std::string>`
* `std::set<std::string_view>`
* `std::list<char const*>`
* `std::array<std::string, 5>`
* `char const* strings[10]`
* `std::span<std::string>`

We can even support `concatenate({"hello", " ", "world"})` if we add an `std::initializer_list` ctor:

```cpp
template <class U, 
          std::enable_if_t<std::is_convertible_v<U const&, T>, int> = 0>
range_ref(std::initializer_list<U> const& range)
{
    // or via union depending on preference
    _range = const_cast<void*>(static_cast<void const*>(&range));
    _for_each = [](void* r, function_ref<void(T)> f) {
        for (auto&& v : *static_cast<decltype(&range)>(r))
            f(v);
    };
}
```

It is important to note that the initializer list must be passed via `const&` because `&range` would otherwise be a pointer to a local variable and be invalid when we later call `for_each`.

Finally, it might be interesting to define a default constructed `range_ref<T>` as the empty range:

```cpp
range_ref()
{
    _for_each = [](void*, function_ref<void(T)>) {};
}
```


## Composition

Another neat aspect of `range_ref<T>` is that it composes properly with respect to nesting:
`range_ref<T>` is any range whose elements are convertible to T, `range_ref<range_ref<T>>` is any range whose elements are ranges whose elements are convertible to `T`.

Note that `std::span` does not have this property.
`std::span<int>` is a contiguous range of `int`s.
`std::span<std::span<int>>` is NOT a contiguous range of contiguous range of `int`s, but only a contiguous range of `std::span<int>`.

With `range_ref<T>`, we can for example define the following function:

```cpp
std::string make_html_table(range_ref<range_ref<std::string_view>> rows)
{
    std::string result;
    result += "<table>";
    rows.for_each([&](range_ref<std::string_view> cols) {
        result += "<tr>";
        cols.for_each([&](std::string_view entry) {
            result += "<td>";
            result += entry;
            result += "</td>";
        });
        result += "</tr>";
    });
    result += "</table>";
    return result;
}
```

And now it doesn't matter if we want to pass `std::vector<std::vector<std::string>>` or `std::list<std::array<char const*, 3>>`.

Unfortunately, while `range_ref<T>` works nicely with nested ranges, it itself does not support range-based for and thus does not compose with itself.
For example, a `std::vector<range_ref<int>>` could not be passed as `range_ref<range_ref<int>>`.
It remains future work to fix this shortcoming without compromising other design goals.
Note that `range_ref<T>` typically appears in parameters and is usually not stored in other data structures.


## Final Version

```cpp
template <class RangeT, class ElementT, class = void>
struct is_compatible_range : std::false_type { };

template <class RangeT, class ElementT>
struct is_compatible_range<RangeT, ElementT, std::void_t<
        decltype(ElementT(*std::begin(std::declval<RangeT>()))),
        decltype(std::end(std::declval<RangeT>()))>
    >
     : std::true_type { };

// a non-owning, lightweight view of a range
// whose element types are convertible to T
template <class T>
struct range_ref
{
    // iterates over the viewed range and invokes callback for each element
    void for_each(function_ref<void(T)> callback) 
    { 
        _for_each(_range, callback); 
    }

    // empty range
    range_ref()
    {
        _for_each = [](void*, function_ref<void(T)>) {};
    }

    // any compatible range
    template <class Range, 
              std::enable_if_t<is_compatible_range<Range, T>::value, int> = 0>
    range_ref(Range&& range)
    {
        _range = const_cast<void*>(static_cast<void const*>(&range));
        _for_each = [](void* r, function_ref<void(T)> callback) {
            for (auto&& v : *reinterpret_cast<decltype(&range)>(r))
                callback(v);
        };
    }

    // {initializer, list, syntax}
    template <class U, 
              std::enable_if_t<std::is_convertible_v<U const&, T>, int> = 0>
    range_ref(std::initializer_list<U> const& range)
    {
        _range = const_cast<void*>(static_cast<void const*>(&range));
        _for_each = [](void* r, function_ref<void(T)> f) {
            for (auto&& v : *static_cast<decltype(&range)>(r))
                f(v);
        };
    }

private:
    using range_fun_t = void (*)(void*, function_ref<void(T)>);

    // or via union depending on const_cast preference
    void* _range = nullptr;
    range_fun_t _for_each = nullptr;
};
```

Note that you need a `function_ref`, e.g. from [here](https://foonathan.net/2017/01/function-ref-implementation/) or [here](https://vittorioromeo.info/index/blog/passing_functions_to_functions.html).

## Summary

In this post I proposed a new view type: `range_ref<T>`.

This type accepts any range that has elements that are _convertible_ to `T`.
It is non-owning, non-allocating, and quite lightweight: only two pointers, same size as `std::string_view` or `std::span<T>`.
Performance-wise, this solution is slower than a templated function but still quite fast:
The range-based for loop itself (increment, dereference, condition) can be inlined (in the `_for_each` function defined in the `range_ref<T>` ctor).
The loop body is behind a `function_ref`, which translates to a single, perfectly predictable function pointer call.

If there is interest, I might do a follow-up post in the future that includes:

* benchmarks
* how to model cancellation
* automatic deref and the case for `range_ref<T const&>`
* a full reference implementation on github
* exploring a `range_ref<T>` that supports range-based for

Additional discussion and comments on [reddit](https://www.reddit.com/r/cpp/comments/jhtso1/range_reft_a_fast_nonowning_view_on_a_range/).

### Update 2020-10-26:

So, `range_ref<T>` might not be the best name for this view type.
While it models all kind of ranges, it is itself not a range, thus creating some confusion.
Though I don't have a preferred version yet, alternative names include:

* `sequence_ref<T>`
* `iterable_ref<T>`
* `foreachable_ref<T>`

[Boost has any_range](https://www.boost.org/doc/libs/1_67_0/libs/range/doc/html/range/reference/ranges/any_range.html) which is itself a range and type erases increment, dereference, comparison.
range-v3 has a similar `any_view<T>`.
However, they suffer from the mentioned lifetime issue (apart from being slower because they have to type erase "more").
Consider for example:

```cpp
int values[] = {1, 2, 3};
auto r = std::ranges::views::transform(values, [](int i) {
    return std::to_string(i);
});
```

Now, if you try to wrap `r` into a `any_view<std::string_view>` and iterate over it, the `string_view` will bind to a temporary `std::string`.
This string is then destroyed _before_ you use it in the loop, leading to a dangling reference.
In contrast, my `range_ref<std::string_view>` would also create a `string_view` from a temporary `std::string`.
However, it immediately the `string_view` to the callback function, which can safely use it as the temporary `std::string` is destroyed at the end of the expression, i.e. _after_ the callback finished.

Currently, I do not know how to provide a view on a range that works with view type elements and is itself a range again.