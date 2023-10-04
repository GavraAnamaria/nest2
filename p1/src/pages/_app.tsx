import { AppProps } from 'next/app';
import Layout from "@/layout/Layout";
import '../styles/globals.css';
import React from "react";
import {Provider} from "react-redux";
import store, {persistor} from "@/store";
import {PersistGate} from "redux-persist/integration/react";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import {NextUIProvider} from "@nextui-org/react";   // theme

function MyApp({ Component, pageProps }: AppProps) {
    return (
    <Provider store = {store}>
        <PersistGate loading={null} persistor={persistor}>
            <NextUIProvider>
            <Layout>
                <Component  {...pageProps} />
            </Layout>
            </NextUIProvider>
        </PersistGate>
    </Provider>
    );
}

export default MyApp;