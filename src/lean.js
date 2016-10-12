import {connectAdvanced} from "react-redux";
import getOr from "lodash/fp/getOr";
import updateIn from "lodash/fp/update";
import mapValues from "lodash/fp/mapValues";
import pick from "lodash/fp/pick";
import flattenDeep from "lodash/fp/flattenDeep";
import isEmpty from "lodash/fp/isEmpty";
import pickBy from "lodash/fp/pickBy";

// XXX: This probably not a public API. Should change to something stable.
import shallowEqual from "react-redux/lib/utils/shallowEqual";

const mapValuesWithKey = mapValues.convert({cap: false});
const pickFunctions = pickBy(v => typeof v === "function");

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

function createCache({isEqual = shallowEqual, initial = plain} = plain) {
    var cache = initial;

    const update =  o => {
        if (cache && isEqual(o, cache)) {
            update.changed = false;
            return cache;
        }

        update.changed = true;
        return cache = o;
    };
    update.changed = true;
    update.get = () => cache;

    return update;
}

const plain = {};

export function connectLean(_options=plain) {
    return connectAdvanced(dispatch => {
        var {scope, defaultProps, mapState, getInitialState, ...handlers} = _options;
        handlers = pickFunctions(handlers);

        let initialState = plain;
        let boundHandlers = null;
        let finalProps = null;

        const scopedStateCache = createCache();
        const mappedStateCache = createCache({initial: null});
        const propsCache = createCache();
        const scopeCache = createCache();


        if (typeof getInitialState === "function") {
            initialState = getInitialState();
        }


        mapState = typeof mapState === "function"
            ? mapState
            : pick(Object.keys(initialState));


        const handlerContext = {};

        var setStateCallbacks = [];
        return (fullState, ownProps) => {
            scope = ownProps.scope || scope;
            if (Array.isArray(scope)) {
                scope = flattenDeep(scope);
            }
            scope = scopeCache(scope);

            const props = propsCache({...defaultProps, ...ownProps, scope});
            var scopedState = fullState || plain;

            if (!isEmpty(scope)) {
                scopedState = {...getOr(plain, disableLodashPath(scope), fullState), scope};
            }

            scopedState = scopedStateCache({...initialState, ...scopedState});
            handlerContext.state = scopedState;
            handlerContext.props = props;
            if (!isEmpty(setStateCallbacks)) {
                setStateCallbacks.forEach(cb => cb());
                setStateCallbacks = [];
            }

            while (true) {
                const mapStateUsesProps = mapState.length > 1;
                if (mappedStateCache.get() === null || scopedStateCache.changed || (propsCache.changed && mapStateUsesProps)) {
                    const mappedState =  mapState(scopedState, props);
                    if (typeof mappedState === "function") {
                        // Map state was a map state creator. Update mapState and redo this.
                        mapState = mappedState;
                        continue;
                    }
                    mappedStateCache(mappedState);
                }
                break;
            }

            if (scopeCache.changed || boundHandlers === null) {

                const bindDispatch = (handler, handlerName) => {
                    var type = "LEAN_UPDATE";

                    if (Array.isArray(scope)) {
                        type += "/" + scope.join(".");
                    } else if (typeof scope === "string") {
                        type += "/" + scope;
                    }

                    type += "/" + handlerName;

                    const methods = {
                        setState(update, cb) {
                            if (typeof cb === "function") {
                                setStateCallbacks.push(cb);
                            }
                            dispatch({
                                type,
                                initialState,
                                props: ownProps,
                                update,
                                scope,
                            });
                        },
                    };


                    return (...args) => {

                        Object.assign(
                            handlerContext,
                            boundHandlers,
                            methods
                        );

                        handler.apply(handlerContext, args);
                    };
                };

                boundHandlers = mapValuesWithKey(bindDispatch, handlers);
            }


            // The caching may seem really weird by but because connectAdvanced
            // checks for idendities we must return the previous idendity of
            // this object when we know there's no changes to avoid the wrapped
            // component from rendering.
            if (finalProps === null || propsCache.changed || mappedStateCache.changed || scopeCache.changed) {
                finalProps = {...props, ...mappedStateCache.get(), ...boundHandlers, scope};
            }
            return finalProps;
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
    let {scope, initialState, update, props} = action;


    const doUpdate = state => {
        let s =  {...initialState, ...state};

        if (typeof update === "function") {
            update = update(s, props);
        }

        return {...initialState, ...state, ...update};
    };


    if (!isEmpty(scope)) {
        return updateIn(disableLodashPath(scope), doUpdate,state);
    }

    return doUpdate(state);
}

export default leanReducer;
