import React from "react";
import Table1 from "@/components/table";

function UsersPage(){

    return (
        // <div style={{background:"black", color:"white", margin:'0', padding:'2rem', width:'auto'}} className={'container'}>
            <div  className="w-screen h-screen dark text-foreground bg-background p-8 flex items-start justify-center">
            {/*<h1>Users:</h1>*/}
                <Table1/>
            {/*</div>*/}
        </div>)
}

export default UsersPage