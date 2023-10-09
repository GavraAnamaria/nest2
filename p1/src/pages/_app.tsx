import { AppProps } from 'next/app';
import Layout from "@/layout/layout";
import '../styles/globals.css';
import React from "react";
import {Provider} from "react-redux";
import store, {persistor} from "@/store";
import {PersistGate} from "redux-persist/integration/react";
import {NextUIProvider} from "@nextui-org/react";
import {ChakraProvider} from "@chakra-ui/react";
import {PrimeReactProvider} from "primereact/api";   // theme
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
// import 'primeflex/primeflex.css';                                   // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store = {store}>
            <PersistGate loading={null} persistor={persistor}>
                    {/*<ChakraProvider>/!*mesaj eroare*!/*/}
                        <Layout>
                            <NextUIProvider>
                                <PrimeReactProvider>

                                {/*<Message/>*/}
                                <ChakraProvider/>{/*mesaj eroare*/}

                            <div style={{paddingTop:'3rem'}}>  {/*bara meniu=fixa=>se suprapue cu pagina*/}
                                <Component  {...pageProps} />
                            </div>
                                </PrimeReactProvider>
                            </NextUIProvider>
                        </Layout>
                    {/*</ChakraProvider>*/}
            </PersistGate>
        </Provider>
    );
}

export default MyApp;