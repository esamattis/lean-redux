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
const withSlash = s => s ? ("/" + s) : "";

export function thunk(cb) {
    return {_thunk: cb};
}
export function connectLean(options=plain) {
    return connectAdvanced(dispatch => {
        let initialState = plain;

        if (typeof options.getInitialState === "function") {
            initialState = options.getInitialState();
        } else if (options.defaultProps) {
            console.warn("You are using deprecated defaultProps. Update to getInitialState");
            initialState = options.defaultProps;
        }

        var boundHandlersCache = null;
        var propsCache = null;
        var prevScope = {}; // Just something which is never equal with real scopes
        const getProps = () => propsCache;

        var mapState = typeof options.mapState === "function"
            ? options.mapState
            : pick(Object.keys(initialState));

        const handlers = typeof options.handlers === "function"
            ? options.handlers(getProps)
            : options.handlers;

        return (fullState, ownProps) => {
            var scope = ownProps.scope || options.scope;
            if (Array.isArray(scope)) {
                scope = flattenDeep(scope);
            }

            var scopedState = fullState || plain;

            if (!isEmpty(scope)) {
                scopedState = {...getOr(plain, disableLodashPath(scope), fullState), scope};
            }

            scopedState = {...initialState, ...scopedState};

            // Implement React Redux style advanced performance pattern where
            // the mapState can create the mapState function itself
            let _state =  mapState(scopedState, ownProps);
            if (typeof _state === "function") {
                // map state generated a new mapState function. Save it
                mapState = _state;
                // and use it to map the state
                _state =  mapState(scopedState, ownProps);
            }
            scopedState = _state;


            // Regenerate handlers only when the scope changes
            if (!isEqual(prevScope, scope)) {
                prevScope = scope;
                const dispatchUpdate = (updateName, update) => {
                    if (!update) {
                        return;
                    }

                    if (update && typeof update._thunk === "function") {
                        return update._thunk(dispatchUpdate.bind(null, updateName), getProps);
                    }
                    var actionSuffix = scope;
                    if (Array.isArray(actionSuffix)) {
                        actionSuffix = actionSuffix.join(".");
                    }

                    dispatch({
                        type: "LEAN_UPDATE" + withSlash(actionSuffix) + withSlash(updateName),
                        update,
                        initialState,
                        scope,
                    });
                };

                const bindDispatch = (updateFn, updateName) => (...args) => dispatchUpdate(updateName, updateFn(...args.concat(propsCache)));

                boundHandlersCache = mapValuesWithKey(bindDispatch, handlers);
            }

            return propsCache = {...ownProps, ...scopedState, ...boundHandlersCache, scope};
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
