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
                console.log("render");
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
                mapSpy();
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
});
