import React from "react";

import RandomGif from "./RandomGif";

var RandomGifPair = ({scope}) => (
    <div>
        <div>
            <RandomGif scope={[scope, "first"]} tag="cats" />
        </div>
        <div>
            <RandomGif scope={[scope, "second"]} tag="cars" />
        </div>
    </div>
);

export default RandomGifPair;
