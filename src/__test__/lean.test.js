import React from "react";
import renderer from "react-test-renderer";
import {createStore} from "redux";
import {Provider} from "react-redux";

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

    expect(store.getState()).toMatchSnapshot();

    const component = renderer.create(<Main />);
    expect(component.toJSON()).toMatchSnapshot();
    update();
    expect(component.toJSON()).toMatchSnapshot();

    expect(store.getState()).toMatchSnapshot();

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

    expect(store.getState()).toMatchSnapshot();

    const component = renderer.create(<Main />);
    expect(component.toJSON()).toMatchSnapshot();
    update();
    expect(component.toJSON()).toMatchSnapshot();

    expect(store.getState()).toMatchSnapshot();

});
