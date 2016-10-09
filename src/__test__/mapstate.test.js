import React from "react";
import {createStore} from "redux";

import {render} from "./helpers";

import {leanReducer, connectLean, update} from "../lean";

test("can map state", () => {
    const store = createStore(leanReducer);

    const My = ({name}) => {
        return <div>Hello {name}</div>;
    };

    const Connected = connectLean({
        defaultProps: {
            name: "default",
        },
        mapState(state) {
            return {name: state.name.toUpperCase()};
        },
    })(My);


    const component = render(store, Connected);
    expect(component.toJSON()).toMatchSnapshot();
    store.dispatch(update({name: "updated"}));
    expect(component.toJSON()).toMatchSnapshot();
});

test("map state can access ownProps", () => {
    const store = createStore(leanReducer);

    const My = ({name}) => {
        return <div>Hello {name}</div>;
    };

    const spy = jest.fn();

    const Connected = connectLean({
        defaultProps: {
            name: "default",
        },
        mapState(state, ownProps) {
            spy(ownProps.parentProp);
            return {name: state.name.toUpperCase()};
        },
    })(My);

    render(store, () => <Connected parentProp="parentValue" />);
    expect(spy).toHaveBeenCalledWith("parentValue");

});
