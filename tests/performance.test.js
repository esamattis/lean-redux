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

            componentWillReceiveProps(nextProps) {
                console.log("componentWillReceiveProps");
                for (let key in this.props) {
                    if (nextProps[key] !== this.props[key]) {
                        console.log(this.props.amount, "prop changed", key);
                    }
                }
            }
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
});
