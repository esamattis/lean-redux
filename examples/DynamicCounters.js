
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

    getInitialState() {
        return {counterCount: 1};
    },

    addCounter(e) {
        e.preventDefault();
        this.setState({counterCount: this.state.counterCount + 1});
    },

    removeCounter(e) {
        e.preventDefault();
        this.setState({counterCount: Math.max(this.state.counterCount - 1, 0)});
    },
})(DynamicCounters);


export default DynamicCounters;
