import React from "react";
import {createStore} from "redux";

import {leanReducer, connectLean} from "../lean";

import {render} from "./helpers";


test("parent prop does not override state values", () => {

    const store = createStore(leanReducer);
    const mapSpyState = jest.fn();
    const mapSpyOwnProps = jest.fn();
    const updateSpy = jest.fn();
    var handler = null;

    const My = ({name, changeName}) => {
        handler = changeName;
        return <div>Hello {name}</div>;
    };


    const Connected = connectLean({
        getInitialState() {
            return {name: "initialValue"};
        },
        mapState(state, ownProps) {
            mapSpyState(state.name);
            mapSpyOwnProps(ownProps.name);
            return {name: "mapValue"};
        },
        handlers: {
            changeName() {
                return {
                    name: value => {
                        updateSpy(value);
                        return "updatedValue";
                    },
                };
            },
        },
    })(My);

    const Wrap = () => (
        <div>
            <Connected name="parentValue" />
        </div>
    );

    const component = render(store, Wrap);
    expect(component.toJSON()).toMatchSnapshot();
    expect(mapSpyState).toHaveBeenLastCalledWith("initialValue");
    expect(mapSpyOwnProps).toHaveBeenLastCalledWith("parentValue");
    handler();
    expect(updateSpy).toHaveBeenLastCalledWith("initialValue");
    expect(component.toJSON()).toMatchSnapshot();
    handler();
    expect(updateSpy).toHaveBeenLastCalledWith("updatedValue");

});
