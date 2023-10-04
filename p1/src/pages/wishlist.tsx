import React from "react";
import Products from "@/components/product-list";
import galaxy from '../../public/galaxy.png'
import phone from '../../public/phone.png'

function WishlistPage(){

    return (<div>
        <div className={'containerImg'}>
            <img src={galaxy.src} alt="galaxy" className={'galaxy'}/>
        </div>
        <img src={phone.src} alt="p" className={'galaxyP'}/>
    </div>)
}

export default WishlistPage