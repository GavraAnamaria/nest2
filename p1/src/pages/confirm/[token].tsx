import {useRouter} from "next/router";
import {ConfirmEmail} from "@/api/user-api";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {messageActions} from "@/store";

function ConfirmPage() {
    const router = useRouter();
    const token =  router.query.token
    const dispatch= useDispatch()

    async function conf(token:string) {
        const error = await ConfirmEmail(token)
        if (error) {
            dispatch(messageActions.setMessage({message:error, messageType:"error"}))
            await router.push('/');
        } else {
            dispatch(messageActions.setMessage({message:"Success! Your email address has been confirmed.", messageType:"success"}))
            await router.push('/auth/login');
        }
    }

    useEffect(() => {
        if (token) {
            conf(token.toString())
        }
    }, [token]);


    return(
         <h1>Redirecting...</h1>
     )
}

export default ConfirmPage





