
# Lean Redux [![Build Status](https://secure.travis-ci.org/epeli/lean-redux.png?branch=master)](http://travis-ci.org/epeli/lean-redux)

[Redux](http://redux.js.org/) state like local state.

## Design goals

- Simple things should be simple
  - Basic Redux state access and updating should be simple as it is with the component local state
  - No need to manually define action types, reducers or even actions creators
- Redux state can be scoped to the components
  - Component cannot interfere with parts of the state that do not belong to it
- Play well with other tools in the Redux community
  - Time travel debuggers, Redux Form etc. work well with Lean Redux
  - You should be able to drop this into your existing project and start using it only for parts of the app
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
    getInitialState() {
        return {count: 0};
    },
    handlers: {
        inc(e) {
            e.preventDefault();
            return {count: i => i + 1};
        },
    },
})(Counter);
```

To learn more checkout the [live examples](https://epeli.github.io/lean-redux/examples/).

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

const store = createStore(composeReducers(myReducer, myAnotherReducer, leanReducer));

```

Checkout the [index.js in
examples](https://github.com/epeli/lean-redux/blob/master/examples/index.js)
for complete example.

## API

Functions exported by the `lean-redux` module.

### `connectLean(options: Object): (component: ReactComponent) => ReactComponent`

Connects a React component to a Redux store. Like `connect()` in React Redux it
does not modify the component but returns a new one.

#### `options` keys

- `scope: string|Array` Scope the component to a part of the state. Deep
scopes can be defined with arrays. Works like paths in
[Lodash](https://lodash.com/docs/4.16.4#set). If `scope` is passed as a prop
from the parent component it will override the value defined here.
- `getInitialState(): Object` Create default values for the scoped state. Like
component getInitialState this is executed only once when the component is
mounted.
- `mapState(state: Object, ownProps: Object): Object` Just like the
`mapStateToProps` in React Redux, but the state is scoped according to the
`scope` option. If not defined the default implementation is to return the
props matching what `getInitialState()` returns.
- `handlers: Object|createHandlers(): Object` Object of event handler to be
passed to the component as props. Each handler can return a `LeanUpdate` which
transforms the part of the state scoped to the component. See below for
details. Can be also a function which is used to generated the handlers when
the component is mounted. See examples for details.

#### `LeanUpdate`

Handlers can return a `LeanUpdate` to transform the state. It can update as
many values as wanted, as deeply as needed. It can either be an object, a
function, or a value.

If `LeanUpdate` is an object, for each key/value, it will apply the updates
specified in the value to `state[key]`.

If `LeanUpdate` is a function, it will call the function with object and return the value.

If `LeanUpdate` is a value, it will return that value.

`LeanUpdate` is recursive. You can define deep nested updates. Ex. `{foo: {bar: i
=> i*2}}`.

Sometimes, you may want to set an entire
object to a property, or a function. In that case, you'll need to use a
function to return that value, otherwise it would be interpreted as an update.
Ex. `function() { return { a: 0 }; }`.

Updates made with `LeanUpdate`s are always applied in immutable manner. State is
never mutated in place.

The `LeanUpdate` implementation is from
[updeep](https://github.com/substantial/updeep).

### `thunk(callback(update(update: LeanUpdate), getProps(): Object))`

Lean Redux comes with simple thunk implementation for async state updates. It's
heavily inspired by [Redux Thunk](https://github.com/gaearon/redux-thunk).

Just return a thunk from a handler:

```js
import {connectLean, thunk} from "lean-redux";

MyComponent = connectLean({
    defaultProps: {
        status: "waiting",
    },
    handlers: {
        asyncLoad() {
            return thunk((update, getProps) => {
                update({status: "starting"});
                setTimeout(() => {
                    update({status: "done"});
                }, 1000);
            });
        }
    },
})(MyComponent);
```

The `update` function passed to the thunk callback works like `dispatch()` in
Redux Thunk but instead of dispatching actions you send `LeanUpdate`s (see above).

The `getProps` returns the current props of the component. It's a function
instead of direct prop values because the props can change over the time.


### `update([scope: string|Array], update: LeanUpdate)`

Normal Redux action creator for dispatching `LeanUpdate`s manually. Use it if you
want to use the `LeanUpdate`s outside of the components. Ex. from store
directly `store.dispatch(update({foo: "bar"}))` or from Redux Thunk callback or
whatever situation you have.

