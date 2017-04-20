import React from "react";
import {createStore, combineReducers} from "redux";

import {leanReducer, connectLean} from "../src/lean";

import {render} from "./helpers";

describe("can be used with combineReducers", () => {
    beforeEach(() => {
        leanReducer.setGlobalScope("lean");
    });

    afterEach(() => {
        leanReducer.setGlobalScope(null);
    });

    test("works", () => {
        const store = createStore(combineReducers({lean: leanReducer}));
        let handler = null;

        let Hello = ({name, setName}) => {
            handler = setName;
            return <div>Hello {name}</div>;
        };

        Hello = connectLean({
            scope: "ascope",
            getInitialState() {
                return {name: "from initial"};
            },

            setName() {
                this.setState({name: "foo"});
            },
        })(Hello);

        render(store, Hello);
        handler();
        const {component} = render(store, Hello);

        expect(store.getState()).toMatchSnapshot();
        expect(component.toJSON()).toMatchSnapshot();
    });
});
