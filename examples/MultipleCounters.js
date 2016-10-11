import React from "react";

import Counter from "./Counter";

var MultipleCounters = () => (
    <div>
        <div>
            <Counter scope="multicounter1" amount={2} />
        </div>
        <div>
            <Counter scope="multicounter2" amount={10} />
        </div>
    </div>
);

export default MultipleCounters;
