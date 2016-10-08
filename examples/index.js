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


const store = createStore(leanReducer, applyMiddleware(createLogger()));

const Example = ({name, source, children}) => (
    <div className="example">
        <h1>{name}</h1>
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
            <Example source="Counter.js" name="Simple counter">
                <Counter />
            </Example>
            <Example source="MultipleCounters.js" name="Multiple Counters">
                <MultipleCounters />
            </Example>
            <Example source="DynamicCounters.js" name="Dynamic Counters">
                <DynamicCounters />
            </Example>
        </div>
    </Provider>
);


ReactDOM.render(<Main />, document.getElementById("app"));
window.hljs.initHighlightingOnLoad();
