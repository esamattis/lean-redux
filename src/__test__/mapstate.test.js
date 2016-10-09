import React from "react";
import {createStore} from "redux";
import {Provider} from "react-redux";
import {get} from "lodash/fp";
import renderer from "react-test-renderer";

import {render} from "./helpers";

import {leanReducer, connectLean, update, thunk} from "../lean";

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


});
