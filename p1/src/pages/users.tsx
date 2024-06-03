import React, {useEffect, useState} from "react";
import Table1 from "@/components/table";
import { getUsers} from "@/api/user-api";
import {useDispatch, useSelector} from "react-redux";
import {messageActions, userActions} from "@/store";
import {useRouter} from "next/router";
import Box from "@mui/material/Box";
import styles from "@/components/product-list.module.css";
import RegisterForm from "@/components/forms/register-form";
import Modal from "@mui/material/Modal";
import {User} from "@/types/user";


function UsersPage(){
    const [data, setData]= useState<User[]>([]);
    const [openModal, setOpenModal] = useState(false)
    const [editData, setEditData] = useState("")

    const token = localStorage.getItem('token')
    const dispatch= useDispatch()
    const router = useRouter()
    const userRole = useSelector((state:{user:{role:string, name:string}}) => state.user.role)

    const fetchData=()=>{
        if(token && userRole==='admin'){
        getUsers(token).then(async response => {
            if (response)
                if(response.status===401){
                    dispatch(messageActions.setMessage({message:'Session expired', messageType:'error'}));
                    dispatch(userActions.logout())
                    await router.push('/auth/login')
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
        dispatch(messageActions.setMessage({message:'Access denied', messageType:'error'}));
        router.push('/')
    }}

    useEffect(() => {fetchData()},[])

    const getUserById=(id:string)=>data.find(x => x.id === id)

const onSubmitForm=()=>{
        setOpenModal(false);
        setEditData('');
    fetchData();
}

    return (
        <div className="min-w-max min-h-screen dark text-foreground bg-background p-8 flex items-start justify-center">
            <Modal onClose={()=>{setOpenModal(false); setEditData("")}} open={openModal}
                   aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description">
                <Box className={styles.modal}>
                     <RegisterForm mode={editData?'edit':'create'} onSubmit={onSubmitForm} initData={editData?getUserById(editData):undefined}/>
                </Box>
            </Modal>


            {data.length>0 && <Table1 users={data} setEditData={setEditData} setOpenModal={setOpenModal}/>}
        </div>
    )
}
export default UsersPage
