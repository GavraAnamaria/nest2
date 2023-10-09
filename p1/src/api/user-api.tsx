export async function RegisterUser(email:string, password:string, firstName:string, lastName:string) {
    const authData = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    }
    const response = await fetch('http://localhost:3001/v1/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authData)
    })

    if (response.status === 422 || response.status === 401) {
        return response.text().then(error=>JSON.parse(error).message)
    }

    if(!response.ok) {
        return `The email address ${email} is already registered. Please log in or use a different email address to create a new account.`
    }

    return ""
}


export async function LoginUser(email:string, password:string) {
    let loginData = {
        email: email,
        password: password,
    }

    const response = await fetch('http://localhost:3001/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })

    if (response.status === 422 || response.status === 401) {
        return response.text().then(error=>JSON.parse(error).message)
    }

    if(!response.ok) {
        return "The server can't process your request"
    }

    const resData = await response.json()
    const token = resData.access_token
    const user = decode(token);
    if (user.role[0] === "0") {//confirm flag
        return "Please confirm your email address"
    }
    localStorage.setItem('token', token)

    return ""
}

export async function SendConfirmMsg(email:string) {

    const response = await fetch('http://localhost:3001/v1/confirm/'+email, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    if (response.status/100 === 4) {
        return response.text().then(error=>JSON.parse(error).message)
    }

    if(!response.ok) {
        return "The confirmation email cannot be sent!"
    }
    return ""
}

export async function ConfirmEmail(token:string) {

    const email=decode(token).email

    const response = await fetch('http://localhost:3001/v1/users/conf/'+email, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })

    if(!response.ok) {
        return "The registration link you are trying to use has expired!"
    }
    return ""
}


export async function SendResetMsg(email:string) {

    const response = await fetch('http://localhost:3001/v1/confirm/reset/'+email, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    if (response.status/100 === 4) {
        return response.text().then(error=>JSON.parse(error).message)
    }

    if(!response.ok) {
        return "Email cannot be sent"
    }
    return ""
}



export async function ResetPassword(token:string, password:string) {

    const email=decode(token).email
    const data= {
        email: email,
        password: password
    }
    const response = await fetch('http://localhost:3001/v1/users/reset', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body:(JSON.stringify(data))
    })

    if(!response.ok) {
        return "The reset link you are trying to use has expired!"
    }
    return ""
}

export async function getUsers(token:string) {
    const response = await fetch('http://localhost:3001/v1/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })

    return response
}


export async function deleteUser(token:string, id:string) {
    const response = await fetch('http://localhost:3001/v1/users/'+ id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })

    if (response.status/100 === 4) {
        return response.text().then(error=>JSON.parse(error).message)
    }

    if(!response.ok)
        return "Delete error"

    return ""
}


export function decode(token:string){
    const jwtData = token.split('.')[1];
    const decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtData = JSON.parse(decodedJwtJsonData);
    return decodedJwtData;
}