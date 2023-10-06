import React from "react";
import Products from "@/components/product-list";

function HomePage(){

    return (<>
        <div className={'container'}>
            <h1>Home Page</h1>
            <Products/>
        </div>
        </>)
}

export default HomePage