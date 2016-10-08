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
