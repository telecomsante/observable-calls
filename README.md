# [Observable] calls

The main purpose of this library is to provide a mean to observe function calls during unit tests.
If it fits any need beyond testing, feel free to report this new usage context to enhance the documentation.

Type `npm install observable-calls` to get the library, you can then use it this way:

```js
const Observable = require('zen-observable');
const spy = require('observable-calls')(Observable);

const f = spy((a, b) => a + b)
f.calls(3).subscribe({
  next: console.log,
  complete: () => console.log('complete')
});

f(1, 2); // {args: [1, 2], output: 3}
f(2, 3); // {args: [2, 3], output: 5}
f(3, 4); // {args: [3, 4], output: 7}
// complete
f(4, 5); // no more console output
```

> The library was tested with [zen-observable](https://github.com/zenparsing/zen-observable) but any compliant [Observable] library should be usable.

The library module exports a function with the following signature: `Observable => function => function`

The first call specifies the [Observable] implementation library to use.
The second call will transform any function in a new function with a `calls` property.

This `calls` property is a function providing a new [Observable] at each call.
It takes an integer as its only argument in order to specify the number of calls to observe until completion.

The values that can be emitted by the [Observable] are:

- `{args: [...], output: ...}` in case of a successful function call;
- `{args: [...], err: ...}` in case of an exception raised by a function call.

> If `calls` is called with no argument, the default number of calls to observe is 0 which means that the new [Observable] will immediately complete.
> If you want the [Observable] to never complete, pass `Infinity` as the `calls` argument.

[Observable]: https://github.com/tc39/proposal-observable
