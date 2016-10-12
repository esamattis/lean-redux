
import React from "react";
import {createStore} from "redux";

import {leanReducer, connectLean} from "../src/lean";

import {render} from "./helpers";

describe("handler context", () => {
    test("has state from initial state", () => {
        const spy = jest.fn();
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
                spy(this.state.name);
                this.setState({name: "from handler"});
            },
        })(Hello);

        render(store, Hello);
        handler();
        expect(spy).toHaveBeenLastCalledWith("from initial");
    });

    test("state is not overridden by map state", () => {
        const spy = jest.fn();
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
            mapState() {
                return {name: "from mapState"};
            },
            setName() {
                spy(this.state.name);
                this.setState({name: "from handler"});
            },
        })(Hello);

        render(store, Hello);
        handler();
        expect(spy).toHaveBeenLastCalledWith("from initial");
    });

    test("state can be changed from the handlers", () => {
        const spy = jest.fn();
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
                spy(this.state.name);
                this.setState({name: "from handler"});
            },
        })(Hello);

        render(store, Hello);
        handler();
        handler();
        expect(spy).toHaveBeenLastCalledWith("from handler");
    });

});

