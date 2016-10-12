import React from "react";
import {createStore} from "redux";

import {leanReducer, connectLean} from "../src/lean";

import {render} from "./helpers";


test("renders from initial state", () => {
    const store = createStore(leanReducer);
    let Hello = ({name}) => {
        return <div>Hello {name}</div>;
    };

    Hello = connectLean({
        scope: "ascope",
        getInitialState() {
            return {name: "esa"};
        },
    })(Hello);

    const component = render(store, Hello);
    expect(component.toJSON()).toMatchSnapshot();
});
