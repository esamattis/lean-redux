import React from "react";

import Counter from "./Counter";

var MultipleCounters = () => (
    <div>
        <div>
            <div>Increments by 2</div>
            <Counter scope="multicounter1" amount={2} />
        </div>
        <div>
            <div>Increments by 10</div>
            <Counter scope="multicounter2" amount={10} />
        </div>
    </div>
);

export default MultipleCounters;
