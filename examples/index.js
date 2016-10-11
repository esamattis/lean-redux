// eslint-disable-next-line
window.SOURCE = SOURCE;
var SOURCE = window.SOURCE;

import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware, compose} from "redux";
import {Provider} from "react-redux";
import createLogger from "redux-logger";

import {leanReducer, connectLean} from "../src/lean";


import Counter from "./Counter";
import MultipleCounters from "./MultipleCounters";
import ConfiguredCounter from "./ConfiguredCounter";
import DynamicCounters from "./DynamicCounters";
import NamedCounters from "./NamedCounters";
import Async from "./Async";
import AsyncAdvanced from "./AsyncAdvanced";
import RandomGif from "./RandomGif";
import RandomGifPair from "./RandomGifPair";
import RandomGifList from "./RandomGifList";


var enhancers = [
    applyMiddleware(createLogger()),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
].filter(Boolean);

const store = createStore(leanReducer, compose(...enhancers));

const GIF_SCOPE = "gifStuff";

function highlight(sel) {
    document.querySelectorAll(sel).forEach(function(block) {
        window.hljs.highlightBlock(block);
    });
}

const Example = ({source, children}) => (
    <div className="example">
        <div className="demo">
            {children}
        </div>
        <div className="source">
            <div>
                <a href={"https://github.com/epeli/lean-redux/blob/master/examples/" + source}>{source}</a>
            </div>
            <pre>
                <code className="javascript">
                    {(SOURCE[source] || "").trim()}
                </code>
            </pre>
        </div>
    </div>
);

var Main = ({gifsVisible, showGifs}) => (
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
            antoher part of the state using the <em>scope</em> prop.
        </p>
        <Example source="MultipleCounters.js" name="">
            <MultipleCounters />
        </Example>

        <h2>Dynamic Counters</h2>
        <p>
            The <em>scope</em> prop can be dynamic and even go deep into
            the state using the array syntax. The path creation works like
            in <a href="https://lodash.com/docs/4.16.4#set">Lodash</a>.
        </p>
        <Example source="DynamicCounters.js" >
            <DynamicCounters />
        </Example>

        <h2>Named Counters</h2>
        <p>
            This is the standard TODO example (but with added counters!)
            demonstrating advanced component scoping.
        </p>
        <Example source="NamedCounters.js" >
            <NamedCounters />
        </Example>

        <h2>Configured Counter</h2>
        <p>
            Because the state is in Redux we can access it with normal Redux <em>connect()</em> too.
        </p>
        <Example source="ConfiguredCounter.js" name="">
            <ConfiguredCounter />
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


        <h2>Random Gif</h2>
        <p>
            At last we'll partly solve the problem presented at <a href="https://github.com/slorber/scalable-frontend-with-elm-or-redux">slorber/scalable-frontend-with-elm-or-redux</a>.
            Partly because with this library you don't write the reducers or
            actions yourself (unless you really want to you can of course). So
            that part of the "Specification" is ignored.
        </p>
        <p>
            The gif examples will fire some actions on mount so they are not
            mounted initially make things cleaner.
        </p>
        <p>
            <a href="#" onClick={showGifs}>Click here the mount them</a>.
        </p>
        <p>
            These gif examples do not use cover any new concepts anymore.
            They are just some more real worldish examples combining async
            loading with scopes.
        </p>
        <p>
            For fun we'll scope all of them under <em>gifStuff</em> key in the
            Redux state. Checkout
            the <a href="https://github.com/epeli/lean-redux/blob/master/examples/index.js">examples/index.js</a> on
            github to see how the scope is initialized for them.
        </p>

        {gifsVisible && <div className="gifs">
            <Example source="RandomGif.js" >
                <RandomGif tag="robots" scope={[GIF_SCOPE, "single"]} />
            </Example>

            <h2>Random Gif Pair</h2>
            <p>
                This should look very familiar. See how the scope is passed
                along from the parent component.
            </p>
            <Example source="RandomGifPair.js" >
                <RandomGifPair scope={[GIF_SCOPE, "pair"]} />
            </Example>

            <h2>Random Gif List</h2>
            <p>
                This is just a simpler version the Named Counters example. The
                fact that the nested components are async doesn't show up here
                in anyway.
            </p>
            <Example source="RandomGifList.js" >
                <RandomGifList scope={[GIF_SCOPE, "list"]} />
            </Example>
        </div>}
    </div>
);
Main = connectLean({
    getInitialState() {
        return {gifsVisible: false};
    },
    handlers: {
        showGifs(e) {
            e.preventDefault();
            setTimeout(() => highlight(".gifs pre code"), 0);
            this.setState({gifsVisible: true});
        },
    },
})(Main);


ReactDOM.render(<Provider store={store}><Main /></Provider>, document.getElementById("app"));
highlight("pre code");

