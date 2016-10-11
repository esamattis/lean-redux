import React from "react";
import {connectLean, thunk} from "../src/lean";

class RandomGif extends React.PureComponent {
    componentDidMount() {
        this.props.fetchGif();
    }
    render() {
        const {tag, status, url, fetchGif} = this.props;
        return (
            <div>
                <h4>gifs from tag: {tag}</h4>
                {(url && status !== "fetching") && <img src={url} />}
                <br />
                <button onClick={fetchGif} disabled={status === "fetching"}>
                    {status === "fetching" ? "loading..." : "Next!"}
                </button>
            </div>
        );
    }
}
RandomGif = connectLean({
    scope: "singleRandomGif",
    getInitialState() {
        return {
            status: "waiting",
            url: null,
        };
    },
    handlers: {
        setUrl(url) {
            return {url};
        },
        fetchGif() {
            this.setState({status: "fetching"});
            fetch("https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + this.props.tag)
            .then(res => res.json())
            .then(json => {
                this.setState({
                    status: "ok",
                    url: json.data.fixed_height_small_url,
                });
            });
        },
    },

})(RandomGif);


export default RandomGif;
