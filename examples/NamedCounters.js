
import React from "react";
import {connectLean} from "../src/lean";
import {omit, pick, update} from "lodash/fp";

import Counter from "./Counter";


var NamedCounter = ({scope, name, handleXClick}) => (
    <div>
        {name} <Counter scope={scope} /> <button onClick={handleXClick}>x</button>
    </div>
);
NamedCounter = connectLean({
    // name and id are the scoped part of the state. Pick those up.
    mapState: pick(["name", "id"]),
    handlers: {
        handleXClick(e) {
            e.preventDefault();
            this.props.onRemove(this.props.id);
        },
    },
})(NamedCounter);

var NamedCounters = ({counters, handleNameChange, newName, addCounter, removeCounter, scope}) => (
    <div>
        <input onChange={handleNameChange} value={newName} />
        <button onClick={addCounter} disabled={!newName}>add</button>
        {Object.keys(counters).sort().map(counterId => (
            <NamedCounter key={counterId} scope={[scope, "counters", counterId]} onRemove={removeCounter} id={counterId} />
        ))}
    </div>
);
NamedCounters = connectLean({
    scope: "namedCounters",
    getInitialState() {
        return {
            nextCounterId: 1,
            newName: "",
            counters: {},
        };
    },
    handlers: {
        handleNameChange(e) {
            e.preventDefault();
            this.setState({newName: e.target.value});
        },
        addCounter(e) {
            e.preventDefault();

            console.log("state", this.state);
            this.setState(update(["counters", String(this.state.nextCounterId)], () => ({
                id:  this.state.nextCounterId,
                name: this.state.newName,
            })));

            this.setState({
                newName: "",
                nextCounterId: this.state.nextCounterId + 1,
            });

        },
        removeCounter(counterId) {
            this.setState(update(["counters"], omit(counterId)));
        },
    },

})(NamedCounters);


export default NamedCounters;
