import * as React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import AppWrapper from "./App";
import {Provider} from "react-redux";
import store from "./redux/store";

const root = ReactDOM.createRoot(
    document.getElementById("main-wrapper")
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <AppWrapper/>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);