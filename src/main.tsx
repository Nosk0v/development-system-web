import React from 'react';
import ReactDOM from 'react-dom/client';
import './shared/styles/main.scss';
import './shared/styles/global.scss';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import {Provider} from "react-redux";
import {store} from "./app/store.ts";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
);