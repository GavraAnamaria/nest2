export type User={id:string, firstName: string, lastName:string, email:string, role:string, password:string,createdAt?:string, updatedAt?:string, isEmailConfirmed:boolean}

export type Product ={
    id: string;
    name: string;
    type:string;
    price: number;
    description: string;
}
