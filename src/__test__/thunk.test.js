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
