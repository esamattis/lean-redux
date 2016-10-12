import React from "react";
import {createStore} from "redux";

import {leanReducer, connectLean} from "../src/lean";

import {render} from "./helpers";

describe("scope", () => {

    test("is used to set the location in redux state", () => {
        const store = createStore(leanReducer);
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
                this.setState({name: "from handler"});
            },
        })(Hello);

        render(store, Hello);
        handler();
        expect(store.getState()).toMatchSnapshot();
    });

    test("can be overridden from the parent", () => {
        const store = createStore(leanReducer);
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
                this.setState({name: "from handler"});
            },
        })(Hello);

        const {setProps} = render(store, Hello);
        setProps({scope: "parentScope"});
        handler();
        expect(store.getState()).toMatchSnapshot();
    });
});

