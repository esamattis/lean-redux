
import React from "react";
import {createStore} from "redux";

import {leanReducer, connectLean} from "../src/lean";

import {render} from "./helpers";

describe("map state", () => {

    test("gets initial state", () => {
        const spy = jest.fn();
        const store = createStore(leanReducer);
        let Hello = ({name}) => {
            return <div>Hello {name}</div>;
        };

        Hello = connectLean({
            scope: "ascope",
            getInitialState() {
                return {name: "from initial"};
            },
            mapState(state) {
                spy(state.name);
            },
        })(Hello);

        render(store, Hello);
        expect(spy).toHaveBeenCalledWith("from initial");
    });
});

