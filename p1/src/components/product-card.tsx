import React, {useState} from "react";
import styles from './product-card.module.css'
import {Product} from "@/types/user";
import Box from "@mui/material/Box";
import ProductForm from "@/components/forms/product-form";
import Modal from "@mui/material/Modal";

function ProductCard(props:{style:string, role:string , product:Product, onDelete:(id:string)=>void }){
    const [openModal, setOpenModal] = useState(false)
    const [data, setData] = useState(props.product)
    const {id, name,type, price, description}= data;

    let card_style = props.style==='card2' ? styles.card2:styles.card
    if(props.role === "admin") card_style = card_style+' '+ styles.darkCard

    const onSubmit = (formData?:Product)=>{
        setOpenModal(false);
        formData&&setData(formData);
    }

    return (
           <div className={card_style} >
               <Modal onClose={()=>setOpenModal(false)} open={openModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description" >
                   <Box className={styles.modal}>
                       <ProductForm onSubmit={onSubmit} initData={data}/>
                   </Box>
               </Modal>
                {props.role==='admin' && <div className={styles.exitBtn} style={{backgroundColor:"red"}} onClick={()=>props.onDelete(id)} >x</div>}
                <img src="https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg" alt="house"/>
                 <div className={styles.text}>
                    <p className={styles.text_elem}>{name}</p>
                    <p className={styles.description}>{type}</p>
                    <p className={styles.description}>{description}</p>
                </div>
                <div>
                    <p className={styles.text_elem}>{price}$</p>
                    {props.role==='admin' ?  <button className={styles.text_elem} style={{backgroundColor:"coral"}} onClick={()=>setOpenModal(true)}>{props.style==='card2'?<span>Edit</span>: 'Edit'}</button>:
                        <button className={styles.text_elem}>{props.style==='card2'?<span>Buy</span>: 'Buy'}</button>}
                </div>
            </div>
    )
}

export default ProductCard
