
import React from "react";
import {connectLean} from "../src/lean";
import {omit, pick} from "lodash/fp";

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
        handleXClick(e, _1, _2, props) {
            e.preventDefault();
            props.onRemove(props.id);
        },
    },
})(NamedCounter);

var NamedCounters = ({counters, handleNameChange, newName, addCounter, removeCounter, scope}) => (
    <div>
        <input onChange={handleNameChange} value={newName} />
        <button onClick={addCounter} disabled={!newName}>add</button>
        {Object.keys(counters).sort().map(counterId => (
            <NamedCounter key={counterId} scope={[scope, "counters", counterId]} onRemove={removeCounter} />
        ))}
    </div>
);
NamedCounters = connectLean({
    scope: "namedCounters",
    defaultProps: {
        nextCounterId: 1,
        newName: "",
        counters: {},
    },
    handlers: {
        handleNameChange(e) {
            e.preventDefault();
            return {newName: e.target.value};
        },
        addCounter(e, _1, _2, props) {
            e.preventDefault();

            return {
                newName: "",
                nextCounterId: i => i + 1,
                counters: {
                    [props.nextCounterId]: {
                        id:  props.nextCounterId,
                        name: props.newName,
                    },
                },
            };
        },
        removeCounter(counterId) {
            // Lean Redux works beautifully with curried functions. Such as
            // lodash/fp or Ramda. Without currying this would look like this:
            //     {counters: counters => omit(counterId, counters)}
            return {counters: omit(counterId)};
        },
    },

})(NamedCounters);


export default NamedCounters;
