import React from "react";
import {connectLean} from "../src/lean";

class RandomGif extends React.PureComponent {
    componentDidMount() {
        this.props.fetchGif();
    }
    render() {
        const {tag, status, src, fetchGif} = this.props;
        return (
            <div>
                <h4>gifs from tag: {tag}</h4>
                {src && <img src={src} />}
                <br />
                <button onClick={fetchGif} disabled={status !== "ok"}>
                    Next!
                </button> {status}
            </div>
        );
    }
}
RandomGif = connectLean({
    scope: "singleRandomGif",

    getInitialState() {
        return {
            status: "waiting",
            src: null,
        };
    },

    fetchGif() {
        this.setState({status: "fetching meta"});
        fetch("https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + this.props.tag)
        .then(res => res.json())
        .then(json => {
            this.setState({status: "loading image"});
            var src = json.data.fixed_height_small_url;

            // preload the image
            var img = new Image();
            img.onload = () => {
                this.setState({status: "ok", src});
            };
            img.src = src;


        });
    },
})(RandomGif);


export default RandomGif;
