
# Lean Redux

[Redux](http://redux.js.org/) without the boilerplate.

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

const store = createStore(composeReducers(myReducer, myAnotherReducer, leanReducer));

```

Checkout the [index.js in
examples](https://github.com/epeli/lean-redux/blob/master/examples/index.js)
for complete example.

## API

### `leanConnect(options: Object)`

Connects a React component to a Redux store. Like `connect()` in React Redux it
does not modify the component but returns a new one.

#### `options` keys

- `scope: string|Array` Scope the component to a part of the state.  deep
scopes can be defined with arrays. Works like paths in
[Lodash](https://lodash.com/docs/4.16.4#set).
- `defaultProps: Object` Default values for props that do not exist in the state
- `mapState(state: Object, ownProps: Object): Object` Just like the `mapStateToProps` in React Redux, but the
state is scoped according to the `scope` option. If not defined the default
implementation is to return the props matching `defaultProps`.
- `handlers: Object|Function` Object of event handler to be passed to the
component as props. Each handler can return an `updates` value which transforms
the part of the state scoped to the component. See below for details. Can be
also a function which is executed when the component is mounted. See examples
for details.

#### `updates` values

Handlers can return an `updates` value to transform the state. It can update as
many values as wanted, as deeply as needed. It can either be an object, a
function, or a value.

If `updates` is an object, for each key/value, it will apply the updates
specified in the value to `state[key]`.

If `updates` is a function, it will call the function with object and return the value.

If `updates` is a value, it will return that value.

`updates` is recursive. You can define deep nested updates. Ex. `{foo: {bar: i
=> i*2}}`.

Sometimes, you may want to set an entire
object to a property, or a function. In that case, you'll need to use a
function to return that value, otherwise it would be interpreted as an update.
Ex. `function() { return { a: 0 }; }`.

The `updates` implementation is from
[updeep](https://github.com/substantial/updeep).

