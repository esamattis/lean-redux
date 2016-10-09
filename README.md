
# Lean Redux

Lean Redux without the boilerplate.

Example:

```js
var Counter = ({count, inc}) => (
    <div>
        {count} <button onClick={inc}>inc</button>
    </div>
);
Counter = connectLean({
    defaultProps: {
        count: 0,
    },
    handlers: {
        inc(e) {
            e.preventDefault();
            return {count: i => i + 1};
        },
    },
})(Counter);
```

Checkout more [live examples here](https://epeli.github.io/lean-redux/examples/).

## Design goals

- Simple things should be simple
- Components should be mountable to other parts of the state easily like in Elm
- Play well with other tools in the Redux community
- Make it easy to avoid [pure render anti-patterns](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.5idpdujva)
- Keep the awesome performance of [React Redux](https://github.com/reactjs/react-redux)

