import React from "react";

import Counter from "./Counter";

var MultipleCounters = () => (
    <div>
        <div>
            <Counter scope="multicounter1" />
        </div>
        <div>
            <Counter scope="multicounter2" />
        </div>
    </div>
);

export default MultipleCounters;
