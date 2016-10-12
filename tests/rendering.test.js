import React from "react";
import {createStore} from "redux";

import {leanReducer, connectLean} from "../src/lean";

import {render} from "./helpers";

describe("renders", () => {

    test("from initial state", () => {
        const store = createStore(leanReducer);
        let Hello = ({name}) => {
            return <div>Hello {name}</div>;
        };

        Hello = connectLean({
            scope: "ascope",
            getInitialState() {
                return {name: "from initial"};
            },
        })(Hello);

        const {component} = render(store, Hello);
        expect(component.toJSON()).toMatchSnapshot();
    });

    test("not from map props which collide with state", () => {
        const store = createStore(leanReducer);
        let Hello = ({name}) => {
            return <div>Hello {name}</div>;
        };

        Hello = connectLean({
            scope: "ascope",
            getInitialState() {
                return {name: "from initial"};
            },
        })(Hello);

        const {component, setProps} = render(store, Hello);
        setProps({name: "from parent"});
        expect(component.toJSON()).toMatchSnapshot();
    });


    test("from mapState()", () => {
        const store = createStore(leanReducer);
        let Hello = ({name}) => {
            return <div>Hello {name}</div>;
        };

        Hello = connectLean({
            scope: "ascope",
            mapState() {
                return {name: "from map state"};
            },
            getInitialState() {
                return {name: "from initial"};
            },
        })(Hello);

        const {component} = render(store, Hello);
        expect(component.toJSON()).toMatchSnapshot();
    });
});
