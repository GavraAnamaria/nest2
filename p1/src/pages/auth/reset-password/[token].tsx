import {useRouter} from "next/router";
import {useEffect} from "react";

function RedirectPage() {
    const router = useRouter();
    const token =  router.query.token

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token.toString())
            router.push('/auth/reset-password/reset');
        }
    }, [token]);


    return(
        <h1>Redirecting...</h1>
    )
}

export default RedirectPage





