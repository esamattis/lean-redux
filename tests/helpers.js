import React from "react";
import {Provider} from "react-redux";
import renderer from "react-test-renderer";

export const render = (store, Component) => {
    const res = {};
    class Main extends React.Component {
        render() {

            if (!res.setProps) {
                // eslint-disable-next-line react/jsx-no-bind
                res.setProps = this.setState.bind(this);
            }

            return (
                <Provider store={store}>
                    <Component {...this.state} />
                </Provider>
            );
        }
    }

    res.component =  renderer.create(<Main />);
    return res;
};
