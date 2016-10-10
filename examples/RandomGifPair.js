import React from "react";

import RandomGif from "./RandomGif";

var RandomGifPair = () => (
    <div>
        <div>
            <RandomGif scope={["randomGifPair", "first"]} tag="cats" />
        </div>
        <div>
            <RandomGif scope={["randomGifPair", "second"]} tag="cars" />
        </div>
    </div>
);

export default RandomGifPair;
