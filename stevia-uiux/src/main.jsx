import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import store, {persistor} from "./app/store.js";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <BrowserRouter basename={'/stevia'}>
                <App/>
            </BrowserRouter>
        </PersistGate>
    </Provider>
);
