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
                expect(state).toMatchSnapshot();
                spy(state.name);
            },
        })(Hello);

        render(store, Hello);
        expect(spy).toHaveBeenCalledWith("from initial");
    });

    test("defaultProps in ownProps", () => {
        const propSpy = jest.fn();
        const stateSpy = jest.fn();
        const store = createStore(leanReducer);
        let Hello = ({name}) => {
            return <div>Hello {name}</div>;
        };

        Hello = connectLean({
            scope: "ascope",
            getInitialState() {
                return {name: "from initial"};
            },
            defaultProps: {
                aProp: "default prop",
            },
            mapState(state, ownProps) {
                propSpy(ownProps.aProp);
                stateSpy(state.aProp);
            },
        })(Hello);

        render(store, Hello);
        expect(propSpy).toHaveBeenCalledWith("default prop");
        expect(stateSpy).toHaveBeenCalledWith(undefined);
    });

    test("parent props override defaultProps in ownProps", () => {
        const propSpy = jest.fn();
        const stateSpy = jest.fn();
        const store = createStore(leanReducer);
        let Hello = ({name}) => {
            return <div>Hello {name}</div>;
        };

        Hello = connectLean({
            scope: "ascope",
            getInitialState() {
                return {name: "from initial"};
            },
            defaultProps: {
                aProp: "default prop",
            },
            mapState(state, ownProps) {
                propSpy(ownProps.aProp);
                stateSpy(state.aProp);
            },
        })(Hello);

        const {setProps} = render(store, Hello);
        setProps({aProp: "parent prop"});
        expect(propSpy).toHaveBeenLastCalledWith("parent prop");
        expect(stateSpy).toHaveBeenLastCalledWith(undefined);
    });
});
