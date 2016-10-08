import {connectAdvanced} from "react-redux";
import getOr from "lodash/fp/getOr";
import updateIn from "lodash/fp/update";
import mapValues from "lodash/fp/mapValues";
import updateObject from "updeep/dist/update";
const mapValuesWithKey = mapValues.convert({cap: false});


const plain = {};
const pass = o => o;
const withSlash = s => s ? ("/" + s) : "";

export function thunk(cb) {
    return {_thunk: cb};
}
export function connectLean(options=plain) {
    return connectAdvanced(dispatch => {
        const withDefaults = options.defaultProps ? s => ({...options.defaultProps, ...s}) : pass;
        var handlersCache = null;
        var propsCache = null;
        var prevScope = {}; // Just some object with unique identity
        const getProps = () => propsCache;

        return (fullState, ownProps) => {
            var scope = ownProps.scope || options.scope;
            var scopedState = null;

            if (!scope && typeof options.mapState !== "function") {
                console.warn("scope and mapState are undefined for connectLean. The component will render on every store update. You have killed performance.");
                scopedState = fullState;
            } else {
                const mapState = typeof options.mapState === "function" ? options.mapState : pass;
                scopedState = {...getOr(plain, scope, fullState), scope};
                scopedState =  mapState(withDefaults(scopedState));
            }


            // Regenerate handlers only when the scope changes
            if (prevScope !== scope) {
                prevScope = scope;
                const dispatchUpdate = (updateName, update) => {

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

                handlersCache = mapValuesWithKey(bindDispatch, options.handlers);
            }

            return propsCache = {...ownProps, ...scopedState, ...handlersCache, scope};
        };

    }, {
        getDisplayName: name => "ConnectLean(" + name + ")",
    });
}


const actionPattern = /^LEAN_UPDATE/;

export default function leanReducer(state, action) {
    if (!actionPattern.test(action.type)) {
        return state;
    }
    const {scope, update, withDefaults} = action;

    if (scope) {
        return updateIn(scope, s => updateObject(update, withDefaults(s)), state);
    }

    return updateObject(action.update, withDefaults(state));
}
