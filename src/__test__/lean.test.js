import React from "react";
import renderer from "react-test-renderer";
import {createStore} from "redux";
import {Provider} from "react-redux";

import {get} from "lodash/fp";

import leanReducer, {connectLean} from "../lean";



test("basic updating", () => {

    const store = createStore(leanReducer);
    var update = null;
    const My = ({name, changeName}) => {
        update = changeName;
        return <div>Hello {name}</div>;
    };

    const Connected = connectLean({
        scope: "ascope",
        defaults: {
            name: "esa",
        },
        updates: {
            changeName() {
                return {name: "matti"};
            },
        },
    })(My);

    const Main = () => {
        return (
            <Provider store={store}>
                <Connected />
            </Provider>
        );
    };

    expect(get(["ascope", "name"], store.getState())).toBe(undefined);

    const component = renderer.create(<Main />);
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
        defaults: {
            name: "esa",
        },
        mapState(state) {
            return {name: state.name.toUpperCase()};
        },
        updates: {
            changeName() {
                return {name: "matti"};
            },
        },
    })(My);

    const Main = () => {
        return (
            <Provider store={store}>
                <Connected />
            </Provider>
        );
    };

    expect(get(["ascope", "name"], store.getState())).toBe(undefined);

    const component = renderer.create(<Main />);
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
        defaults: {
            count: 0,
        },
        updates: {
            inc() {
                return {count: i => i+1};
            },
        },
    })(Counter);

    const Main = () => {
        return (
            <Provider store={store}>
                <Connected />
            </Provider>
        );
    };

    expect(get(["ascope", "count"], store.getState())).toBe(undefined);

    const component = renderer.create(<Main />);
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
        defaults: {
            name: "esa",
        },
        updates: {
            changeName() {
                return {name: "matti"};
            },
        },
    })(My);

    const Main = () => {
        return (
            <Provider store={store}>
                <Connected scope="propScope" />
            </Provider>
        );
    };

    expect(get(["propScope", "name"], store.getState())).toBe(undefined);

    const component = renderer.create(<Main />);
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
        defaults: {
            name: "esa",
        },
        updates: {
            changeName() {
                return {name: "matti"};
            },
        },
    })(My);

    var setState = null;
    var Main = React.createClass({
        getInitialState() {
            return {greeting: "Hi"};
        },
        changeGreeting() {
        },
        render() {
            setState = this.setState.bind(this);
            return (
                <Provider store={store}>
                    <Connected scope="propScope" greeting={this.state.greeting} />
                </Provider>
            );
        },
    });

    const component = renderer.create(<Main />);
    expect(component.toJSON()).toMatchSnapshot();
    var prevUpdate = update;

    setState({greeting: "Hellou"});
    expect(component.toJSON()).toMatchSnapshot();

    expect(update).toBe(prevUpdate);

});

