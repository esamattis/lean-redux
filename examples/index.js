// eslint-disable-next-line
window.SOURCE = SOURCE;
var SOURCE = window.SOURCE;

import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import createLogger from "redux-logger";

import leanReducer from "../src/lean";


import Counter from "./Counter";
import MultipleCounters from "./MultipleCounters";
import DynamicCounters from "./DynamicCounters";
import Async from "./Async";
import AsyncAdvanced from "./AsyncAdvanced";


const store = createStore(leanReducer, applyMiddleware(createLogger()));

const Example = ({source, children}) => (
    <div className="example">
        <div className="demo">
            {children}
        </div>
        <pre>
            <code className="javascript">
                {(SOURCE[source] || "").trim()}
            </code>
        </pre>
    </div>
);

var Main = () => (
    <Provider store={store}>
        <div>
            <h2>Simple counter</h2>
            <Example source="Counter.js" >
                <Counter />
            </Example>

            <h2>Multiple Counters</h2>
            <p>
                Instead of defining the scope in the <em>connectLean</em> HOC
                you can define it as a prop. Notice how we can reuse the
                component from the previous example just by mounting it to a
                antoher part of the state.
            </p>
            <Example source="MultipleCounters.js" name="">
                <MultipleCounters />
            </Example>

            <h2>Dynamic Counters</h2>
            <p>
                The prop can be dynamic and even go deeper into the state using the array syntax. The path creation works like in <a href="https://lodash.com/docs/4.16.4#set">Lodash</a>.
            </p>
            <Example source="DynamicCounters.js" >
                <DynamicCounters />
            </Example>

            <h2>Async updates</h2>
            <p>
                Like redux-thunk.
            </p>
            <Example source="Async.js" >
                <Async />
            </Example>
            <h2>Advanced Async</h2>
            <p>
                Use constructor pattern to handle component specific async state.
            </p>
            <Example source="AsyncAdvanced.js" >
                <AsyncAdvanced />
            </Example>
        </div>
    </Provider>
);


ReactDOM.render(<Main />, document.getElementById("app"));
window.hljs.initHighlightingOnLoad();
