import React, {useEffect, useState} from "react";
import Table1 from "@/components/table";
import {decode, getUsers} from "@/api/user-api";
import {useDispatch, useSelector} from "react-redux";
import {messageActions, userActions} from "@/store";
import {useRouter} from "next/router";


function UsersPage(){
    const [data, setData]= useState([]);
    const token = localStorage.getItem('token')
    const dispatch= useDispatch()
    const router = useRouter()
    const userRole = useSelector((state:{user:{role:string, name:string}}) => state.user.role)

    useEffect(() => {
        if(token && userRole==='admin'){
            getUsers(token).then(async response => {
                if (response)
                    if(response.status===401){
                        dispatch(messageActions.setMessage({message:'Session expired', messageType:'error'}));
                        dispatch(userActions.logout())
                        await router.push('/')
                    }
                    if (!response.ok) {
                        dispatch(messageActions.setMessage({message:'Fetch error', messageType:'error'}));
                        await router.push('/')
                        return []
                    } else return response.json()
            })
                .then(function(data1) {
                    setData(data1)
                    console.log(data1)
                })
        }else{
            dispatch(messageActions.setMessage({message:'access denied', messageType:'error'}));
            router.push('/')
        }},[])

    return (
        <div className="min-w-max min-h-screen dark text-foreground bg-background p-8 flex items-start justify-center">
            {data.length>0 && <Table1 users={data}/>}
        </div>
    )
}


    // useEffect(()=>{
    //    const token1=localStorage.getItem('token')
    //     if(token1) {
    //         token = token1;
    //         console.log('tokeeen4:'+token)
    //     }
    // },[]);

    //     dispatch(messageActions.setMessage("baiuri"))
    // return (
    //     // <div style={{background:"black", color:"white", margin:'0', padding:'2rem', width:'auto'}} className={'container'}>
    //         <div className="min-w-max min-h-screen dark text-foreground bg-background p-8 flex items-start justify-center">
    //         {/*<h1>Users:</h1>*/}
    //         {/*    <Table1 users={props.users}/>*/}
    //         {/*</div>*/}
    //     </div>)
// }

//
// export async function getStaticProps(){
//     // const token = localStorage.getItem('token')
//     const response = await fetch('http://localhost:3001/v1/users/reset', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//     })
//
//     if(!response.ok) {
//         return {props:{users:[{name:'abc'}]}}
//     }
//   console.log(response.body)
//     return {props:{users:[{name:'def'}]}}
//
//     // return {
//         // props:{
//             // users: response.jsonmap(meetup=>({
//     //             title:meetup.title,
//     //             address:meetup.address,
//     //             image:meetup.image,
//     //             id:meetup._id.toString(),
//     //         }))
//     //     },
//     //     revalidate:10
//     // };
// }
//


export default UsersPage


