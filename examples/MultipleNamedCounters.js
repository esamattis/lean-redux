import React from "react";

import NamedCounters from "./NamedCounters";

var MultipleNamedCounters = () => (
    <div>
        <h3>First</h3>
        <div>
            <NamedCounters scope="multipleNamedCounters" />
        </div>
        <h3>Second</h3>
        <p>
          We can deeply scope this too.
        </p>
        <div>
            <NamedCounters scope={["multi", "deep", "example"]} />
        </div>
    </div>
);

export default MultipleNamedCounters;
