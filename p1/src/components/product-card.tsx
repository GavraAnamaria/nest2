import React, {useRef, useState} from "react";
import styles from './product-card.module.css'
import {useSelector} from "react-redux";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

function ProductCard(props:{style:string }){
    const card_style = props.style==='card2' ? styles.card2:styles.card
    const userData = useSelector((state:{user:{role:string, name:string}}) => state.user)

    const [visible, setVisible] = useState(false);
    const toast = useRef<Toast>(null);

    const accept = () => {
        if (toast.current) {
            toast.current.show({severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000});
        }
    }

    const reject = () => {
        if (toast.current) {
            toast.current.show({severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000});
        }
    }


    return (<>
            <Toast ref={toast} />
            <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Are you sure you want to delete this item?" header="Confirmation" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
            <div className={card_style}>
                {userData.role==='admin' && <div className={styles.exitBtn} style={{backgroundColor:"red"}} onClick={() => setVisible(true)} >x</div>}
                <img src="https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg" alt="house"/>
                 <div className={styles.text}>
                    <p className={styles.text_elem}>ala</p>
                    <p className={styles.text_elem}>bala</p>
                    <p className={styles.text_elem}>portocala</p>
                </div>
                <div>
                    <p className={styles.text_elem}>20$</p>
                     <button className={styles.text_elem}>{props.style==='card2'?<span>Buton </span>: 'Buton'}</button>
                    {userData.role==='admin' &&  <button className={styles.text_elem} style={{backgroundColor:"coral"}}>{props.style==='card2'?<span>Edit</span>: 'Edit'}</button>}
                </div>
            </div>
        </>
    )
}

export default ProductCard