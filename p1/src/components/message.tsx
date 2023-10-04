import {useDispatch, useSelector} from "react-redux";
import {messageActions} from "@/store";
import {Alert, AlertIcon, ChakraProvider, Stack} from "@chakra-ui/react";
import React from "react";
function Message(){
    const message = useSelector((state:{message:{message:string, messageType:"info"| "warning" | "success" | "error" | "loading" | undefined}})=>state.message)
    const dispatch =useDispatch()
    const deleteMessage =()=>{
        dispatch(messageActions.deleteMessage())
    }

    return<>
        {/*<p>{message.message}</p>*/}
        {message.message?
            <ChakraProvider>
                <Stack >
                    <Alert status={message.messageType} variant="solid">
                        <AlertIcon />
                        {message.message}
                        <button className={'exitButton'} onClick={deleteMessage}>x</button>
                    </Alert>
                </Stack>
            </ChakraProvider>
        :<p></p>
}
    </>
    }
    export default Message