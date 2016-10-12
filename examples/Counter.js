import React from "react";
import {connectLean} from "../src/lean";

var Counter = ({count, inc, amount}) => (
    <span>
        {count} <button onClick={inc}>+{amount}</button>
    </span>
);

Counter = connectLean({
    // This scopes the counter under "singleCounter" key in the state. If this
    // is omitted the component uses the full state.
    scope: "singleCounter",

    defaultProps: {
        amount: 1,
    },

    // By default only props defined in getInitialState() are passed to the
    // wrapped component. If you want to add some other props from the state
    // you can define a mapState key with a function returning the desired
    // state.
    getInitialState() {
        return {count: 0};
    },

    inc() {
        this.setState({count: this.state.count + this.props.amount});
    },

})(Counter);


export default Counter;
