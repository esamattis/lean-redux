
# Lean Redux

Redux without the boilerplate.

## Design goals

- Simple things should be simple
  - No need to manually define action types, reducers or even actions creators.
  Just create event handlers which directly manipulate the Redux state scoped
  to them.
- Components should be mountable to other parts of the state easily like in Elm
- Play well with other tools in the Redux community
  - Time travel debuggers, Redux Form etc. work well with Lean Redux
- Make it easy to avoid [pure render anti-patterns](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.5idpdujva)
  - No need to create callbacks in during renders. Just use the `handlers` option.
- Keep the awesome performance of [React Redux](https://github.com/reactjs/react-redux)
  - Lean Redux is build on top of the new `connectAdvanced()` primitive of React Redux 5.0


## Example

```js
import {connectLean} from "lean-redux";

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

Checkout the [live examples](https://epeli.github.io/lean-redux/examples/).

## Setup

    npm install --save lean-redux

Just add the `leanReducer` to your store and start creating components with
`connectLean`.

```js
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import {leanReducer} from "lean-redux";

const store = createStore(leanReducer);

var Main = () => (
    <Provider store={store}>
        <Counter />
    </Provider>
);

ReactDOM.render(<Main />, document.getElementById("app"));
```

If you already have other reducers you can merge `leanReducer` into them with
the `composeReducers` helper:

```js
import {leanReducer, composeReducers} from "lean-redux";

const store = createStore(composeReducers(myReducer, myAnotherReduer, leanReducer));

```

work in progress...
