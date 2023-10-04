import RegisterForm from "@/components/register-form";
import styles from "@/components/register-form.module.css";
import React, {useState} from "react";
import {LoginUser, RegisterUser, SendConfirmMsg} from "@/api/user-api";
import {useRouter} from "next/router";
import {Alert, AlertIcon, ChakraProvider, Stack} from "@chakra-ui/react";
import {SendResetMsg} from "@/api/user-api";
import {useDispatch} from "react-redux";
import {messageActions} from "@/store";
function ResetPasswordPage(){
    const dispatch= useDispatch()
    const router = useRouter();
    const [email, setEmail]= useState("")
    const [changed, setChanged]= useState(false)
    const emailIsValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
    const inputEmailClass = (emailIsValid || !changed) ? styles.formField : styles.formField+" "+ styles.invalid;

    async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let error = await SendResetMsg(email)
        dispatch(messageActions.setMessage({message:'Email sent! Please check your inbox.', messageType:'success'}))
        if (error) {
            dispatch(messageActions.setMessage({message:error, messageType:'error'}))
            return;
        }
        await router.push( '/');
    }

    return (
        <>
        <div className={styles.container}>
        <h1>{"Reset Password"}</h1>
        <form onSubmit={submitHandler}>
        <div className={inputEmailClass}>
            <label htmlFor='email'>Email</label>
            <input
                placeholder={"abc@ex.com"}
                value = {email}
                type='email' id='email'
                onChange={event=>{setEmail( event.target.value)}}
                onBlur={() =>{setChanged(true)}}
            />
            {(!emailIsValid && changed) && <p className={styles.errorText}>Invalid Email!</p>}
            <div className={styles.formAction}>
                <button className={styles.button} style={{marginTop:'2rem'}} disabled={!emailIsValid}>Submit</button>
            </div>
        </div>
        </form>
        </div>
        </>
    )
}

export default ResetPasswordPage