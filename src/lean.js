import {connectAdvanced} from "react-redux";
import getOr from "lodash/fp/getOr";
import updateIn from "lodash/fp/update";
import mapValues from "lodash/fp/mapValues";
import pick from "lodash/fp/pick";
import flattenDeep from "lodash/fp/flattenDeep";
import isEqual from "lodash/fp/isEqual";
import isEmpty from "lodash/fp/isEmpty";
import updateObject from "updeep/dist/update";
const mapValuesWithKey = mapValues.convert({cap: false});

export function composeReducers(...reducers) {
    return (state=null, action) => {
        return reducers.filter(r => typeof r === "function").reduce(
            ((state, subReducer) => subReducer(state, action)),
            state
        );
    };
}

function disableLodashPath(path) {
    if (typeof path === "string") {
        return [path];
    }

    return path;
}

export function update(...args) {
    let scope, update;

    if (args.length === 2) {
        [scope, update] = args;
    } else {
        update = args[0];
    }

    return {
        type: "LEAN_UPDATE",
        scope,
        update,
    };
}


const plain = {};

export function thunk(cb) {
    return {_thunk: cb};
}
export function connectLean(options=plain) {
    return connectAdvanced(dispatch => {
        let initialState = plain;

        if (typeof options.getInitialState === "function") {
            initialState = options.getInitialState();
        }

        var boundHandlersCache = null;
        var scopeCache = {}; // Just something which is never equals with real scopes

        var mapState = typeof options.mapState === "function"
            ? options.mapState
            : pick(Object.keys(initialState));

        const handlers = options.handlers || plain;

        const handlerContext = {};

        return (fullState, ownProps) => {

            var generateHandlers = false;
            var scope = ownProps.scope || options.scope;
            var props = {...options.defaultProps, ...ownProps, scope};

            if (Array.isArray(scope)) {
                scope = flattenDeep(scope);
            }

            if (!isEqual(scopeCache, scope)) {
                scopeCache = scope;
                generateHandlers = true;
            }

            var scopedState = fullState || plain;

            if (!isEmpty(scopeCache)) {
                scopedState = {...getOr(plain, disableLodashPath(scopeCache), fullState), scope: scopeCache};
            }

            scopedState = {...initialState, ...scopedState};
            handlerContext.state = scopedState;
            handlerContext.props = props;

            // Implement React Redux style advanced performance pattern where
            // the mapState can create the mapState function itself
            let mappedState =  mapState(scopedState, props);
            if (typeof mappedState === "function") {
                // map state generated a new mapState function. Save it
                mapState = mappedState;
                // and use it to map the state
                mappedState =  mapState(scopedState, props);
            }


            // Regenerate handlers only when the scope changes
            if (!isEqual(prevScope, scope)) {
                prevScope = scope;

                const bindDispatch = (handler, handlerName) => {
                    var type = "LEAN_UPDATE";

                    if (Array.isArray(scope)) {
                        type += "/" + scope.join(".");
                    } else if (typeof scope === "string") {
                        type += "/" + scope;
                    }

                    type += "/" + handlerName;

                    console.log("binding handler", handlerName);

                    return (...args) => {
                        console.log("executing handler", handlerName);
                        var localContext = {...handlerContext, ...{
                            setState(updatedState) {
                                dispatch({
                                    type,
                                    update: updatedState,
                                    initialState,
                                    scope,
                                });
                            },
                        }};

                        handler.apply(localContext, args);
                    };
                };

                boundHandlersCache = mapValuesWithKey(bindDispatch, handlers);
            }

            return {...props, ...mappedState, ...boundHandlersCache, scope: scopeCache};
        };

    }, {
        getDisplayName: name => "ConnectLean(" + name + ")",
    });
}


const actionPattern = /^LEAN_UPDATE/;

export function leanReducer(state, action) {
    if (!actionPattern.test(action.type)) {
        return state;
    }
    let {scope, update, initialState} = action;

    if (!isEmpty(scope)) {
        return updateIn(
            disableLodashPath(scope),
            s => updateObject(update, {...initialState, ...s}),
            state
        );
    }

    return updateObject(action.update, {...initialState, ...state});
}

export default leanReducer;
