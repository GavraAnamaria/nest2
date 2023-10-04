import React, {ChangeEvent, useState} from "react";
import styles from './register-form.module.css'
import {LoginUser, RegisterUser, SendConfirmMsg, ResetPassword, decode} from "@/api/user-api";
import {useRouter} from "next/router";
import Link from "next/link";
import {useDispatch} from "react-redux";
import {messageActions, userActions} from "@/store";

const RegisterForm: React.FC<{mode:string}> =(props)=>{
    const dispatch= useDispatch()
    const isLogin = (props.mode === 'login')
    const isRegister = (props.mode === 'register')
    const router = useRouter();
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    const [formData, setFormData]= useState({
        firstName:"",
        uName:"",
        email:"",
        password:"",
        repPassword:"",
    })

    const [changedData, setChangedData]= useState({
        firstName:false,
        name:false,
        email:false,
        password:false,
        repPassword:false
    })

    const nameInvalid = (formData.uName.trim().length<3) && changedData.name
    const firstNameInvalid = (formData.firstName.trim().length<3) && changedData.firstName
    const emailIsValid = /^\w+(\.[-]?\w+)*@\w+(\.[-]?\w+)*(\.\w{2,3})+$/.test(formData.email.trim())
    const emailInvalid = !emailIsValid && changedData.email
    const passwordIsValid = passwordErrors.length===0;
    const passwordInvalid = !passwordIsValid && changedData.password
    const repPasswordInvalid = (formData.repPassword.trim() !== (formData.password.trim())) && changedData.repPassword

    const findClass=(condition:boolean)=>{
        return condition ? styles.formField+" "+ styles.invalid:styles.formField;
    }
    
    // const inputNameClass = nameInvalid? styles.formField+" "+ styles.invalid:styles.formField;
    // const inputFirstNameClass = firstNameInvalid? styles.formField+" "+ styles.invalid:styles.formField;
    // const inputEmailClass = emailInvalid? styles.formField+" "+ styles.invalid:styles.formField;
    // const inputPasswordClass = passwordInvalid? styles.formField+" "+ styles.invalid:styles.formField;
    // const inputRepeatPasswordClass = repPasswordInvalid ? styles.formField+" "+ styles.invalid:styles.formField;

    const loginFormIsValid = emailIsValid && passwordIsValid
    const registerFormIsValid = loginFormIsValid && formData.firstName.trim() !== '' && formData.uName.trim() !== ''  && formData.repPassword.trim() === (formData.password.trim());
    const resetFormIsValid = passwordIsValid && formData.repPassword.trim() === (formData.password.trim());
    const formIsValid = isLogin ? loginFormIsValid : isRegister? registerFormIsValid : resetFormIsValid;

    const handlePasswordChange = (e:ChangeEvent<HTMLInputElement>) => {
        const password=e.target.value
        setFormData({...formData, password:e.target.value})
        const errors:string[]=[];
        if (password.length < 8 || e.target.value==='' ){
            errors.push('Password must be at least 8 characters long!');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter!');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter!');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one digit!');
        }
        if (!/[@#$%^&*!]/.test(password)) {
            errors.push('Password must contain at least one special character (!@#$%^&*)!');
        }
        setPasswordErrors(errors);};

    function reset(){
        setFormData({uName:'', firstName:'', password: '', email: '', repPassword: ''})
        setChangedData({name:false, firstName:false, password: false, email: false, repPassword: false})
    }

    async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        reset()
        let error
        let path
        if (formIsValid) {
            if (isLogin) {
                error = await LoginUser(formData.email, formData.password)
                dispatch(messageActions.setMessage({message:'Welcome back! You have successfully logged in.', messageType:"success"}))
                const token = localStorage.getItem('token')
                if(token) {
                    const user = decode(token);
                    const role = user.role.substring(1)
                    dispatch(userActions.login({ role: role, name: user.firstName }))
                }
                path='/'
            } else if(isRegister){
              error = await SendConfirmMsg(formData.email)
                if(!error) {
                    error = await RegisterUser(formData.email, formData.password, formData.firstName, formData.uName)
                    dispatch(messageActions.setMessage({message:'Confirmation email sent! Please check your inbox.', messageType:"success"}))
                }
                 path='/'
            }else{
                const token =  router.query.token
                if(token) {
                    error = await ResetPassword(token.toString(), formData.password)
                    dispatch(messageActions.setMessage({message:'Password Reset Successful.', messageType:"success"}))
                }
                path='/auth/login'
            }
            if(error){
                dispatch(messageActions.setMessage({message:error, messageType:"error"}))
                return;
            }
            await router.push(path);
        }
    }


    return (
        <>
        <div className={styles.container}>
            <h1>{isLogin? "Login": (isRegister)? "Register":"Reset Password"}</h1>
            <form onSubmit={submitHandler}>
                {isRegister &&
                    <div className={findClass(firstNameInvalid)}>
                    <label htmlFor='firstName'>First Name</label>
                    <input
                        placeholder={"First name"}
                        value = {formData.firstName}
                        type='text' id='firstName'
                        onChange={event=>{setFormData({...formData, firstName:event.target.value})}}
                        onBlur={() =>{setChangedData({...changedData, firstName:true})}}
                    />
                    {firstNameInvalid && <p className={styles.errorText}>First name must not be empty!</p>}
                </div>}

                {isRegister &&<div className={findClass(nameInvalid)}>
                    <label htmlFor='name'>Last Name</label>
                    <input
                        placeholder={"Last name"}
                        value = {formData.uName}
                        type='text' id='name'
                        onChange={event=>{setFormData({...formData, uName:event.target.value})}}
                        onBlur={() =>{setChangedData({...changedData, name:true})}}
                    />
                    {nameInvalid && <p className={styles.errorText}>Name must not be empty!</p>}
                </div>}

                {(isRegister || isLogin) && <div className={findClass(emailInvalid)}>
                    <label htmlFor='email'>Email</label>
                    <input
                        placeholder={"abc@ex.com"}
                        value = {formData.email}
                        type='email' id='email'
                        onChange={event=>{setFormData({...formData, email : event.target.value})}}
                        onBlur={() =>{setChangedData({...changedData, email :true})}}
                    />
                    {emailInvalid && <p className={styles.errorText}>Invalid Email!</p>}
                </div>}

                <div className={findClass(passwordInvalid)}>
                    <label htmlFor='password'>Password</label>
                    <input
                        //placeholder={"password"}
                        value={formData.password}
                        type='password' id='password'
                        onChange={handlePasswordChange}
                        onBlur={() =>{setChangedData({...changedData, password :true})}}
                    />
                    {passwordInvalid && <div>{isLogin? <p className={styles.errorText}>Invalid Password</p>:passwordErrors.map(p=> {return <p key={p.length} className={styles.errorText}>{p}</p>})}</div>}
                </div>

                {!isLogin && <div className={findClass(repPasswordInvalid)}>
                    <label htmlFor='rPassword'>Confirm Password</label>
                    <input
                        value={formData.repPassword}
                        type='password' id='rPassword'
                        onChange={e=>setFormData({...formData, repPassword:e.target.value})}
                        onBlur={() =>{setChangedData({...changedData, repPassword:true})}}
                    />
                    {repPasswordInvalid && <p className={styles.errorText}>Wrong password!</p>}
                </div>}
                <div className={styles.formAction}>
                    <button className={styles.button} disabled={!formIsValid}>Submit</button>
                </div>
                <div className={styles.paragraph}>
                    {isLogin &&
                        <div>
                            <p>Don&apos; t have an account?<Link href="/auth/register">  Sign Up</Link></p>
                            <p><Link href="/auth/reset-password"> Forgot Password?</Link></p>
                        </div>}
                    {isRegister && <p>Already have an account? <Link href="/auth/login">  Log in</Link></p>}
                </div>
            </form>
        </div>
        </>
    );
}
export default RegisterForm

