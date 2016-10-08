import React from "react";

import Counter from "./Counter";

var MultipleCounters = () => (
    <div>
        <Counter scope="multicounter1" />
        <Counter scope="multicounter2" />
    </div>
);

export default MultipleCounters;
