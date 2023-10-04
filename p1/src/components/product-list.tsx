import React, {useState} from "react";
import ProductCard from "@/components/product-card";
import styles from './product-list.module.css'
import display1 from '../../public/display1.png'
import display2 from '../../public/display2.png'
import add from '../../public/add.png'
import {useSelector} from "react-redux";
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



function Products(){
    const userData = useSelector((state:{user:{role:string, name:string}}) => state.user)
    const [selected, setSelected] = useState(1)
    const [openModal, setOpenModal] = useState(false)
    function detStyle(nr:number){
        return nr===selected? styles.menu + ' ' + styles.menuSelected : styles.menu
    }




    return(
        <>
            <Modal onClose={()=>setOpenModal(false)} open={openModal}
                   aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description">
                <Box className={styles.modal}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Text in a modal
                        Text in a modal
                        Text in a modal
                        Text in a modal
                    </Typography>
                </Box>
            </Modal>
            <div style={{display:'flex'}}>
                <img className={detStyle(1)} src={display1.src} alt="grid" onClick={()=>setSelected(1)}/>
                <img className={detStyle(2)} src={display2.src} alt="list" onClick={()=>setSelected(2)}/>
                {userData.role==='admin' && <img className={styles.menu} src={add.src} onClick={()=>setOpenModal(true)} alt="list"/>}
            </div>
            <div className={styles.cards}>
                <ProductCard style={selected===1? 'card':'card2'} role={userData.role}/>
                <ProductCard style={selected===1? 'card':'card2'} role={userData.role}/>
                <ProductCard style={selected===1? 'card':'card2'} role={userData.role}/>
                <ProductCard style={selected===1? 'card':'card2'} role={userData.role}/>
                <ProductCard style={selected===1? 'card':'card2'} role={userData.role}/>
            </div>
        </>
    )
}
export default Products