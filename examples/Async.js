
import React from "react";
import {connectLean} from "../src/lean";

var Async = ({fetchAsync, data, status}) => (
    <div>
        <p>status: {status}</p>
        <p>data: {data}</p>
        <button onClick={fetchAsync}>fetch</button>
    </div>
);
Async = connectLean({
    scope: "async",
    getInitialState() {
        return {
            status: "waiting",
            data: "nodata",
        };
    },
    handlers: {
        setData(data) {
            return {data};
        },
        fetchAsync(e) {
            e.preventDefault();

            this.setState({status: "fetching"});
            setTimeout(() => {
                this.setState({status: "done"});
                this.setData("async fetched data!");
            }, 1000);

        },
    },

})(Async);


export default Async;
