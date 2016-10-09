import {createStore} from "redux";
import {get} from "lodash/fp";

import leanReducer, {update} from "../lean";



test("update action creator", () => {
    const store = createStore(leanReducer);
    store.dispatch(update({foo: "bar"}));
    expect(get(["foo"], store.getState())).toBe("bar");

});
