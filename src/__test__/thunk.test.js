import React from "react";
import {createStore} from "redux";
import {Provider} from "react-redux";
import {get} from "lodash/fp";
import renderer from "react-test-renderer";

import {leanReducer, connectLean, update, thunk} from "../lean";

test("update using thunk", () => {
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
                return thunk(update => {
                    update({name: "thunk"});
                });
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

    expect(get(["ascope", "name"], store.getState())).toBe("thunk");

});

test("thunks can access props with getProps()", () => {
    const store = createStore(leanReducer);
    var handler = null;
    const spy1 = jest.fn();
    const spy2 = jest.fn();

    const My = ({name, changeName}) => {
        handler = changeName;
        return <div>Hello {name}</div>;
    };

    const Connected = connectLean({
        scope: "ascope",
        defaultProps: {
            name: "esa",
        },
        handlers: {
            changeName() {
                return thunk((update, getProps) => {
                    spy1(getProps().name);
                    update({name: "thunk"});
                    spy2(getProps().name);
                });
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

    renderer.create(<Main />);
    handler();
    expect(spy1).toHaveBeenCalledWith("esa");
    expect(spy2).toHaveBeenCalledWith("thunk");


});
