
import React from "react";
import {connectLean} from "../src/lean";

class Async extends React.Component {
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

Async = connectLean({
    scope: "async",
    getInitialState() {
        return {
            status: "waiting",
            data: "nodata",
        };
    },

    setData(data) {
        this.setState({data});
    },

    fetchAsync(e) {
        e.preventDefault();
        this.setState({status: "fetching"});

        // Context of leanConnect() is created when the component is mounted.
        // So it can be used hold items that are not approciate for Redux
        // state. Such as promises, errors, xhr objects etc.
        this.timer = setTimeout(() => {
            this.setState({status: "done"});
            this.setData("async fetched data!");
        }, 3000);
    },

    cancel(e) {
        e.preventDefault();
        clearTimeout(this.timer);
        this.setState({status: "canceled"});
    },
})(Async);


export default Async;
