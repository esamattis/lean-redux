
import React from "react";
import {connectLean} from "../src/lean";
import {range} from "lodash/fp";

import Counter from "./Counter";

var DynamicCounters = ({counterCount, scope, addCounter, removeCounter}) => (
    <div>
        <button onClick={addCounter} >add counter</button>
        <button onClick={removeCounter} >remove counter</button>
        {range(0, counterCount).map(i => (
            <div key={i} >
                <Counter scope={[scope, "counters", i]} />
            </div>
        ))}
    </div>
);
DynamicCounters = connectLean({
    scope: "dynamicCounters",
    defaultProps: {
        counterCount: 1,
    },
    handlers: {
        addCounter(e) {
            e.preventDefault();
            // Instead of accessing the props from the arguments you can also
            // return an object of functions to get the previus value in the
            // key.
            return {counterCount: i => i + 1};
        },
        removeCounter(e) {
            e.preventDefault();
            return {
                counterCount: i => Math.max(i - 1, 0),
            };
        },
    },

})(DynamicCounters);


export default DynamicCounters;
