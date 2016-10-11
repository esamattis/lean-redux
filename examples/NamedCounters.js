
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

    handleXClick(e) {
        e.preventDefault();
        this.props.onRemove(this.props.id);
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

    handleNameChange(e) {
        e.preventDefault();
        this.setState({newName: e.target.value});
    },

    addCounter(e) {
        e.preventDefault();

        // This is a little used feature React setState where you can give a
        // function to update the state. Here we use the update() function from
        // lodash/fp to update items deeply in the state. It's curried function
        // which means it returns a function when all arguments are not given
        // to it. It needs three PATH, UPDATER, DATA. We do give the DATA here
        // so it returns a funtion waiting for the data.
        this.setState(update(
            ["counters", this.state.nextCounterId],
            () => ({
                id:  this.state.nextCounterId,
                name: this.state.newName,
            })
        ));

        this.setState({
            newName: "",
            nextCounterId: this.state.nextCounterId + 1,
        });

    },

    removeCounter(counterId) {
        this.setState(update(["counters"], omit(counterId)));
    },
})(NamedCounters);


export default NamedCounters;
