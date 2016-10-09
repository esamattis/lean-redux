import React from "react";
import {connectLean} from "../src/lean";

var Counter = ({count, inc}) => (
    <span>
        {count} <button onClick={inc}>inc</button>
    </span>
);
Counter = connectLean({
    // This scopes the counter under "singleCounter" key in the state. If this
    // is omitted the component uses the full state.
    scope: "singleCounter",
    defaultProps: {
        count: 0,
    },
    handlers: {
        // The props object is passed to the handlers as the last argument.
        inc(e, _skip1, _skip2, props) {
            e.preventDefault();
            return {count: props.count + 1};
        },
    },
})(Counter);


export default Counter;
