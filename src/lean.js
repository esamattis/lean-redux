import {connectAdvanced} from "react-redux";
import getOr from "lodash/fp/getOr";
import updateIn from "lodash/fp/update";
import mapValues from "lodash/fp/mapValues";
import pick from "lodash/fp/pick";
import flattenDeep from "lodash/fp/flattenDeep";
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


const plain = {};
const withSlash = s => s ? ("/" + s) : "";

export function thunk(cb) {
    return {_thunk: cb};
}
export function connectLean(options=plain) {
    return connectAdvanced(dispatch => {
        const withDefaults = s => ({...options.defaultProps, ...s});

        var boundHandlersCache = null;
        var propsCache = null;
        var prevScope = {}; // Just some object with unique identity
        const getProps = () => propsCache;

        const mapState = typeof options.mapState === "function"
            ? options.mapState
            : pick(Object.keys(options.defaultProps || plain));

        const handlers = typeof options.handlers === "function"
            ? options.handlers(getProps)
            : options.handlers;

        return (fullState, ownProps) => {
            var scope = ownProps.scope || options.scope;
            if (Array.isArray(scope)) {
                scope = flattenDeep(scope);
            }

            var scopedState = fullState || plain;

            if (scope) {
                scopedState = {...getOr(plain, scope, fullState), scope};
            }

            scopedState =  mapState(withDefaults(scopedState));

            // Regenerate handlers only when the scope changes
            if (prevScope !== scope) {
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
                        withDefaults,
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
    const {scope, update, withDefaults} = action;

    if (scope) {
        return updateIn(scope, s => updateObject(update, withDefaults(s)), state);
    }

    return updateObject(action.update, withDefaults(state));
}

export default leanReducer;
