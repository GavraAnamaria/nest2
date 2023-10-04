import React from "react";
import Products from "@/components/product-list";

function HomePage(){

    return (<>
        {/*<div className={'container'}>*/}
            {/*<h1>Home Page</h1>*/}
            <div className="w-screen min-h-screen dark text-foreground bg-background p-8 justify-center">
                <h1>Home Page</h1>

                <Products/>
            </div>
        {/*</div>*/}
        </>)
}

export default HomePage