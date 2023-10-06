import { AppProps } from 'next/app';
import Layout from "@/layout/layout";
import '../styles/globals.css';
import React from "react";
import {Provider} from "react-redux";
import store, {persistor} from "@/store";
import {PersistGate} from "redux-persist/integration/react";
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import {NextUIProvider} from "@nextui-org/react";
import {ChakraProvider} from "@chakra-ui/react";
import Message from "@/components/message";   // theme

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store = {store}>
            <PersistGate loading={null} persistor={persistor}>
                    {/*<ChakraProvider>/!*mesaj eroare*!/*/}
                        <Layout>
                            <NextUIProvider>
                                {/*<Message/>*/}
                                <ChakraProvider/>{/*mesaj eroare*/}

                            <div style={{paddingTop:'3rem'}}>  {/*bara meniu=fixa=>se suprapue cu pagina*/}
                                <Component  {...pageProps} />
                            </div>
                            </NextUIProvider>
                        </Layout>
                    {/*</ChakraProvider>*/}
            </PersistGate>
        </Provider>
    );
}

export default MyApp;