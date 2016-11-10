
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

    test("has props from defaultProps", () => {
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
            defaultProps: {
                aProp: "default prop",
            },
            setName() {
                spy(this.props.aProp);
                this.setState({name: "from handler"});
            },
        })(Hello);

        render(store, Hello);
        handler();
        expect(spy).toHaveBeenLastCalledWith("default prop");
    });

    test("default props can be overridden from parent", () => {
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
            defaultProps: {
                aProp: "default prop",
            },
            setName() {
                spy(this.props.aProp);
                this.setState({name: "from handler"});
            },
        })(Hello);

        const {setProps} = render(store, Hello);
        setProps({aProp: "from parent"});
        handler();
        expect(spy).toHaveBeenLastCalledWith("from parent");
    });

    test("getInitialState can be called from the handler", () => {
        const spy = jest.fn();
        const store = createStore(leanReducer);
        let handler = null;

        let Hello = ({name, aHandler}) => {
            handler = aHandler;
            return <div>Hello {name}</div>;
        };

        Hello = connectLean({
            scope: "ascope",
            getInitialState() {
                return {name: "from initial"};
            },
            aHandler() {
                spy(this.getInitialState());
            },
        })(Hello);

        render(store, Hello);
        handler();
        expect(spy).toHaveBeenLastCalledWith({name: "from initial"});
    });

    ["getInitialState", "mapState", "setState"].forEach(method => {
        test(`should not pass ${method} as a handler`, () => {
            const spy = jest.fn();
            const store = createStore(leanReducer);
            let handler = null;

            let Hello = props => {
                spy(props[method]);
                return <div>Hello {props.name}</div>;
            };

            Hello = connectLean({
                scope: "ascope",
                getInitialState() {
                    return {name: "from initial"};
                },
                mapState() {
                    return {name: "from map state"};
                },
                aHandler() {
                    spy(this.getInitialState());
                },
            })(Hello);

            render(store, Hello);
            expect(spy).toHaveBeenLastCalledWith(undefined);
        });
    });

});

