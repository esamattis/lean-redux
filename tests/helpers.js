import React from "react";
import {Provider} from "react-redux";
import renderer from "react-test-renderer";

export const render = (store, Component) => {
    const Main = () => {
        return (
            <Provider store={store}>
                <Component />
            </Provider>
        );
    };

    return renderer.create(<Main />);
};
