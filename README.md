
# Lean Redux [![Build Status](https://secure.travis-ci.org/epeli/lean-redux.png?branch=master)](http://travis-ci.org/epeli/lean-redux)

[Redux](http://redux.js.org/) state like local component state.

## Design


- Basic Redux state access and updating should be simple as it is with the
  component local state
  - No need to manually create action types or reducers
  - The same API with React Components! Use `this.setState()` to update Redux state
- Redux state is be scoped to the components
  - Component cannot interfere with parts of the state that do not belong to it
- Play well with other tools in the Redux community
  - Time travel debuggers, state serialization tools, Redux Form etc. work well with Lean Redux
  - You can drop this into your existing project and start using it only for
    parts of the app
- Good performance
  - Lean Redux is build on top of the new `connectAdvanced()` primitive of
    React Redux 5.0 and implements the same optimizations as `connect()`
  - Handlers are automatically bound to avoid some [pure render anti-patterns](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f)


## Example

```js
import {connectLean} from "lean-redux";

var Counter = ({count, handleClick}) => (
    <div>
        {count} <button onClick={handleClick}>+1</button>
    </div>
);
Counter = connectLean({
    getInitialState() {
        return {count: 0};
    },
    handleClick(e) {
        e.preventDefault();
        this.setState({count: this.state.count + 1});
    },
})(Counter);

// Scope it to a myCounter key in the Redux state
// <Counter scope="myCounter" />
```

To learn more checkout the [live examples](https://epeli.github.io/lean-redux/examples/).

## Setup

    yarn add lean-redux

or

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

### Usage with the Redux `combineReducers` helper

The `combineReducers` helper function does not like dynamically generated top
level state keys so Lean Redux must be scoped under a specific key in the Redux
state when used with the `combineReducers` helper.

```js
import {createStore, combineReducers} from "redux";
import {leanReducer} from "lean-redux";

leanReducer.setGlobalScope("lean");

const store = createStore(combineReducers({
    lean: leanReducer
}));
```

## API

Functions exported by the `lean-redux` module.

### `connectLean(options: Object): (component: ReactComponent) => ReactComponent`

Connects a React component to a Redux store. Like `connect()` in React Redux it
does not modify the component but returns a new one.

#### `options`

- `scope: string|Array|Function` Scope the component to a part of the Redux
  state. Deep scopes can be defined with arrays. Missing path values in the
  state will be automatically created as objects. If the value is a function it
  should return the final scope. Parent component props are passed to the
  function.  If `scope` is passed as a prop from the parent component it will
  override the value defined here unless it's a function.
- `getInitialState(): Object` Create default values for the scoped state. Like
  React component `getInitialState()` this is executed only once when the
  component is mounted.
- `mapState(state: Object, ownProps: Object): Object` Modify the state before
  passing it to the wrapped component. Just like the `mapStateToProps` in React
  Redux, but the state is scoped according to the `scope` option. If not
  defined the default implementation is to return the props matching what
  `getInitialState()` returns.
- `defaultProps: Object` Default props for the handler context.

Any other methods are considered to be "handlers" and are passed to the wrapped
component as props.

#### `handlerContext` 

The context, `this`, in the handlers is like in the React Components.

- `this.state: Object` The current scoped state from Redux
- `this.props: Object` Props from `defaultProps` and any additional props passed by
  the parent component.
- `this.setState(function|object nextState, [function callback])` Function to
  update the scoped Redux state. The API is exactly the same with the React
  Component [`setState()`](https://facebook.github.io/react/docs/component-api.html#setstate).
- `this.dispatch: Function` Redux store dispatch
