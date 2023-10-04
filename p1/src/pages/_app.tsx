import { AppProps } from 'next/app';
import Layout from "@/layout/Layout";
import '../styles/globals.css';
import React from "react";
import {Provider} from "react-redux";
import store, {persistor} from "@/store";
import {PersistGate} from "redux-persist/integration/react";
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme

function MyApp({ Component, pageProps }: AppProps) {
    return (
    <Provider store = {store}>
        <PersistGate loading={null} persistor={persistor}>
            <Layout>
                <Component  {...pageProps} />
            </Layout>
        </PersistGate>
    </Provider>
    );
}

export default MyApp;