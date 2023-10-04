import React, {useState} from "react";
import ProductCard from "@/components/product-card";
import styles from './product-list.module.css'
import display1 from '../../public/display1.png'
import display2 from '../../public/display2.png'


function Products(){
    const [selected, setSelected] = useState(1)
    function detStyle(nr:number){
        return nr===selected? styles.menu + ' '+styles.menuSelected : styles.menu
    }
    return(
        <>
            <div style={{display:'flex'}}>
            <img className={detStyle(1)} src={display1.src} alt="grid" onClick={()=>setSelected(1)}/>
            <img className={detStyle(2)} src={display2.src} alt="list" onClick={()=>setSelected(2)}/>
            </div>
        <div className={styles.cards}>
            <ProductCard style={selected===1? 'card':'card2'}/>
            <ProductCard style={selected===1? 'card':'card2'}/>
            <ProductCard style={selected===1? 'card':'card2'}/>
            <ProductCard style={selected===1? 'card':'card2'}/>
            <ProductCard style={selected===1? 'card':'card2'}/>
        </div>
        </>
    )
}
export default Products