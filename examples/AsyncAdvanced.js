
import React from "react";
import {connectLean, thunk} from "../src/lean";

class AsyncAdvanced extends React.Component {
    componentWillUnmount() {
        // Cancel request on unmount
        this.props.cancel();
    }
    render() {
        const {fetchAsync, data, status, cancel} = this.props;
        return (
            <div>
                <p>status: {status}</p>
                <p>data: {data}</p>
                <button onClick={fetchAsync}>fetch</button>
                <button onClick={cancel}>cancel</button>
            </div>
        );
    }
}

AsyncAdvanced = connectLean({
    scope: "asyncAdvanced",
    getInitialState() {
        return {
            status: "waiting",
            data: "nodata",
        };
    },
    handlers() {
        // If handlers is a function it will excuted once for each component
        // instance. You may keep some component specific data here which is
        // not ok for redux state. Such as xhr-objects, promises etc.
        var timer = null;

        return {
            setData(data) {
                return {data};
            },
            cancel(e) {
                e.preventDefault();
                clearTimeout(timer);
                this.setState({status: "canceled"});
            },
            fetchAsync(e) {
                e.preventDefault();
                this.setState({status: "fetching"});
                timer = setTimeout(() => {
                    this.setState({status: "done"});
                    this.setData("async fetched data!");
                }, 3000);
            },
        };
    },

})(AsyncAdvanced);


export default AsyncAdvanced;
