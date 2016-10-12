import React from "react";
import {createStore} from "redux";

import {leanReducer, connectLean} from "../src/lean";

import {render} from "./helpers";

describe("performance", () => {

    test("component does not render if the mapped state does not change", () => {
        const store = createStore(leanReducer);
        const renderSpy = jest.fn();
        let handler = null;

        class Hello extends React.PureComponent {
            render() {
                handler = this.props.setName;
                renderSpy();
                return <div>Hello {name}</div>;
            }
        }

        Hello = connectLean({
            scope: "ascope",
            getInitialState() {
                return {name: "from initial"};
            },
            mapState() {
                return {name: "hard coded"};
            },
            setName() {
                this.setState({name: "from handler"});
            },
        })(Hello);

        render(store, Hello);
        const renderCount = renderSpy.mock.calls.length;
        handler();
        expect(renderSpy).toHaveBeenCalledTimes(renderCount);
    });

    test("mapState is not called if state does not change", () => {
        const store = createStore(leanReducer);
        const mapSpy = jest.fn();
        let handler = null;

        class Hello extends React.PureComponent {

            render() {
                handler = this.props.setName;
                return <div>Hello {name}</div>;
            }
        }

        Hello = connectLean({
            scope: "ascope",
            getInitialState() {
                return {name: "same value"};
            },
            mapState() {
                mapSpy();
                return {name: "hard coded"};
            },
            setName() {
                this.setState({name: "same value"});
            },
        })(Hello);

        render(store, Hello);
        const mapCount = mapSpy.mock.calls.length;
        handler();
        expect(mapSpy).toHaveBeenCalledTimes(mapCount);
    });

    test("mapState is called if parent props change when it's using them", () => {
        const store = createStore(leanReducer);
        const mapSpy = jest.fn();

        class Hello extends React.PureComponent {

            render() {
                return <div>Hello {name}</div>;
            }
        }

        Hello = connectLean({
            scope: "ascope",
            getInitialState() {
                return {name: "same value"};
            },
            defaultProps: {
                aProp: "default prop",
            },
            mapState(state, ownProps) {
                mapSpy();
                return {name: "hard coded", p: ownProps.aProp};
            },
            setName() {
                this.setState({name: "same value"});
            },
        })(Hello);

        const {setProps} = render(store, Hello);
        setProps({aProp: "from parent1"});
        const mapCount = mapSpy.mock.calls.length;
        setProps({aProp: "from parent2"});
        expect(mapSpy).toHaveBeenCalledTimes(mapCount + 1);
    });

    test("mapState is not called if parent props dont' change even when it's using them", () => {
        const store = createStore(leanReducer);
        const mapSpy = jest.fn();

        class Hello extends React.PureComponent {

            render() {
                return <div>Hello {name}</div>;
            }
        }

        Hello = connectLean({
            scope: "ascope",
            getInitialState() {
                return {name: "same value"};
            },
            defaultProps: {
                aProp: "default prop",
            },
            mapState(state, ownProps) {
                mapSpy();
                return {name: "hard coded", p: ownProps.aProp};
            },
            setName() {
                this.setState({name: "same value"});
            },
        })(Hello);

        const {setProps} = render(store, Hello);
        setProps({aProp: "from parent"});
        const mapCount = mapSpy.mock.calls.length;
        setProps({aProp: "from parent"});
        expect(mapSpy).toHaveBeenCalledTimes(mapCount);
    });

    test("mapState is not called when parent props change when it's not using them", () => {
        const store = createStore(leanReducer);
        const mapSpy = jest.fn();

        class Hello extends React.PureComponent {

            render() {
                return <div>Hello {name}</div>;
            }
        }

        Hello = connectLean({
            scope: "ascope",
            getInitialState() {
                return {name: "same value"};
            },
            defaultProps: {
                aProp: "default prop",
            },
            mapState(state) {
                mapSpy();
                return {name: state.name.toUpperCase()};
            },
            setName() {
                this.setState({name: "same value"});
            },
        })(Hello);

        const {setProps} = render(store, Hello);
        setProps({aProp: "from parent1"});
        const mapCount = mapSpy.mock.calls.length;
        setProps({aProp: "from parent2"});
        expect(mapSpy).toHaveBeenCalledTimes(mapCount);
    });

});
