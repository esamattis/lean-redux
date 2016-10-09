import React from "react";
import renderer from "react-test-renderer";
import {createStore} from "redux";
import {Provider} from "react-redux";
import {get} from "lodash/fp";

import {leanReducer, connectLean} from "../lean";

const render = (store, Component) => {
    const Main = () => {
        return (
            <Provider store={store}>
                <Component />
            </Provider>
        );
    };

    return renderer.create(<Main />);
};


test("basic updating", () => {

    const store = createStore(leanReducer);
    var update = null;
    const My = ({name, changeName}) => {
        update = changeName;
        return <div>Hello {name}</div>;
    };

    const Connected = connectLean({
        scope: "ascope",
        defaultProps: {
            name: "esa",
        },
        handlers: {
            changeName() {
                return {name: "matti"};
            },
        },
    })(My);

    expect(get(["ascope", "name"], store.getState())).toBe(undefined);

    const component = render(store, Connected);
    expect(component.toJSON()).toMatchSnapshot();
    update();
    expect(component.toJSON()).toMatchSnapshot();

    expect(get(["ascope", "name"], store.getState())).toBe("matti");

});

test("updating with map state", () => {

    const store = createStore(leanReducer);
    var update = null;
    const My = ({name, changeName}) => {
        update = changeName;
        return <div>Hello {name}</div>;
    };

    const Connected = connectLean({
        scope: "ascope",
        defaultProps: {
            name: "esa",
        },
        mapState(state) {
            return {name: state.name.toUpperCase()};
        },
        handlers: {
            changeName() {
                return {name: "matti"};
            },
        },
    })(My);

    expect(get(["ascope", "name"], store.getState())).toBe(undefined);

    const component = render(store, Connected);
    expect(component.toJSON()).toMatchSnapshot();
    update();
    expect(component.toJSON()).toMatchSnapshot();

    expect(get(["ascope", "name"], store.getState())).toBe("matti");

});

test("can use function to update the state", () => {

    const store = createStore(leanReducer);
    var update = null;
    const Counter = ({count, inc}) => {
        update = inc;
        return <div>{count}</div>;
    };

    const Connected = connectLean({
        scope: "ascope",
        defaultProps: {
            count: 0,
        },
        handlers: {
            inc() {
                return {count: i => i+1};
            },
        },
    })(Counter);

    expect(get(["ascope", "count"], store.getState())).toBe(undefined);

    const component = render(store, Connected);

    expect(component.toJSON()).toMatchSnapshot();
    update();
    expect(component.toJSON()).toMatchSnapshot();

    expect(get(["ascope", "count"], store.getState())).toBe(1);

});

test("pass scope as a prop", () => {

    const store = createStore(leanReducer);
    var update = null;

    const My = ({name, changeName}) => {
        update = changeName;
        return <div>Hello {name}</div>;
    };

    const Connected = connectLean({
        defaultProps: {
            name: "esa",
        },
        handlers: {
            changeName() {
                return {name: "matti"};
            },
        },
    })(My);


    expect(get(["propScope", "name"], store.getState())).toBe(undefined);

    const component = render(store, () => <Connected scope="propScope" />);
    expect(component.toJSON()).toMatchSnapshot();
    update();
    expect(component.toJSON()).toMatchSnapshot();

    expect(get(["propScope", "name"], store.getState())).toBe("matti");

});


test("do not recreate update function on parent prop changes", () => {
    const store = createStore(leanReducer);
    var update = null;

    const My = ({name, greeting, changeName}) => {
        update = changeName;
        return <div>{greeting} {name}</div>;
    };

    const Connected = connectLean({
        defaultProps: {
            name: "esa",
        },
        handlers: {
            changeName() {
                return {name: "matti"};
            },
        },
    })(My);

    var setState = null;
    var Wrap = React.createClass({
        getInitialState() {
            return {greeting: "Hi"};
        },
        render() {
            // eslint-disable-next-line react/jsx-no-bind
            setState = this.setState.bind(this);
            return (
                <Connected scope="propScope" greeting={this.state.greeting} />
            );
        },
    });

    const component = render(store, Wrap);
    expect(component.toJSON()).toMatchSnapshot();
    var prevUpdate = update;

    setState({greeting: "Hellou"});
    expect(component.toJSON()).toMatchSnapshot();

    expect(update).toBe(prevUpdate);

});

test("prop scope change generates new update function", () => {
    const store = createStore(leanReducer);
    var update = null;

    const My = ({name, changeName}) => {
        update = changeName;
        return <div>Hello {name}</div>;
    };

    const Connected = connectLean({
        defaultProps: {
            name: "esa",
        },
        handlers: {
            changeName() {
                return {name: "matti"};
            },
        },
    })(My);

    var setState = null;
    var Wrap = React.createClass({
        getInitialState() {
            return {scope: "first"};
        },
        render() {
            // eslint-disable-next-line react/jsx-no-bind
            setState = this.setState.bind(this);
            return (
                <Connected scope={this.state.scope} />
            );
        },
    });

    const component = render(store, Wrap);
    var prevUpdate = update;
    update();
    expect(component.toJSON()).toMatchSnapshot();
    expect(get(["first", "name"], store.getState())).toBe("matti");

    setState({scope: "second"});
    update();

    expect(component.toJSON()).toMatchSnapshot();

    // The previous state is still here
    expect(get(["first", "name"], store.getState())).toBe("matti");
    // And now we have the new one
    expect(get(["second", "name"], store.getState())).toBe("matti");

    expect(update).not.toBe(prevUpdate);

});

test("all props are passed to the update functions", () => {

    const store = createStore(leanReducer);
    var props = null;
    var update = null;

    const My = ({name, changeName}) => {
        update = changeName;
        return <div>Hello {name}</div>;
    };


    const Connected = connectLean({
        scope: "ascope",
        defaultProps: {
            name: "esa",
        },
        handlers: {
            changeName(name, _props) {
                props = _props;
                return {name};
            },
        },
    })(My);

    const Wrap = () => {
        return (
            <Connected parentProp="parent" />
        );
    };

    expect(get(["ascope", "name"], store.getState())).toBe(undefined);

    const component = render(store, Wrap);
    expect(component.toJSON()).toMatchSnapshot();
    update("suuronen");
    expect(component.toJSON()).toMatchSnapshot();

    expect(get(["ascope", "name"], store.getState())).toBe("suuronen");

    expect(get(["name"], props)).toBe("esa");
    expect(get(["parentProp"], props)).toBe("parent");
    expect(get(["changeName"], props)).toBe(update);

});

