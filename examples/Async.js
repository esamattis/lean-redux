
import React from "react";
import {connectLean, thunk} from "../src/lean";

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

            // Like redux-thunk. You can send multiple updates over time using
            // the update function. If you need to get the updated version of
            // the component props you can use the getProps function
            return thunk((update, getProps) => {
                update({status: "fetching"});
                setTimeout(() => {
                    update({status: "done"});
                    getProps().setData("async fetched data!");
                }, 2000);
            });
        },
    },

})(Async);


export default Async;
