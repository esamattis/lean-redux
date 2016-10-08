
import React from "react";
import {connectLean} from "../src/lean";
import {range} from "lodash/fp";

import Counter from "./Counter";

var DynamicCounters = ({counterCount, scope, addCounter, removeCounter}) => (
    <div>
        <button onClick={addCounter} >add counter</button>
        <button onClick={removeCounter} >remove counter</button>
        {range(0, counterCount).map(i => <Counter key={i} scope={[scope, "counters", i]} />)}
    </div>
);
DynamicCounters = connectLean({
    scope: "dynamicCounters",
    defaults: {
        counterCount: 1,
    },
    updates: {
        addCounter(e) {
            e.preventDefault();
            return {counterCount: i => i + 1};
        },
        removeCounter(e) {
            e.preventDefault();
            return {counterCount: i => Math.max(i - 1, 0)};
        },
    },

})(DynamicCounters);


export default DynamicCounters;