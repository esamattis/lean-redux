import React from "react";
import {connect} from "react-redux";
import {connectLean} from "../src/lean";
import {getOr} from "lodash/fp";

import Counter from "./Counter";

var Configurator = ({handleChange, amount}) => (
    <div>
        Set increment amount <input type="text" onChange={handleChange} value={amount} placeholder="1" />
    </div>
);
Configurator = connectLean({
    scope: "config",

    getInitialState() {
        return {amount: ""};
    },

    handleChange(e) {
        this.setState({amount: parseInt(e.target.value, 10)});
    },
})(Configurator);


var ConfiguredCounter = ({amount}) => (
    <div>
        <Counter scope={["configuredCounter", "inDeep"]} amount={amount} />
    </div>
);
ConfiguredCounter = connect(
    state => {
        return {amount: getOr(1, ["config", "amount"], state)};
    }
)(ConfiguredCounter);


var Main = () => (
    <div>
        <Configurator />
        <ConfiguredCounter />
    </div>

);

export default Main;
