import React, {useState} from "react";
import styles from './register-form.module.css'
import {Product} from "@/types/user";
import {useDispatch} from "react-redux";
import {EditProduct} from "@/api/product-api";
import {messageActions} from "@/store";

const initialData={id:'',name: '', price: 0, description: '',type:'House'}

function ProductForm(props:{ onSubmit:(formData?:Product)=>void,  initData?:Product}){
    const dispatch= useDispatch()
    const [formData, setFormData]= useState(props.initData||initialData)
    const [changedData, setChangedData]= useState({name:false, price:false, description:false})

    const nameInvalid = (formData.name.trim().length<3) && changedData.name;
    const descriptionInvalid = (formData.description.trim().length<3) && changedData.description;
    const priceInvalid = (formData.price<1) && changedData.price;
    const isFormValid=!(nameInvalid||descriptionInvalid||priceInvalid);

    const findClass=(condition:boolean)=>{
        return condition ? styles.formField+" "+ styles.invalid:styles.formField;
    }

    async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const token = localStorage.getItem('token')
        if (isFormValid&&token) {
            const error = await EditProduct( formData.name, formData.description, formData.price, formData.type,props.initData?.id)
            if (error) {
                dispatch(messageActions.setMessage({message: error, messageType: "error"}))
            }else{
                dispatch(messageActions.setMessage({message:'Product data saved successfully', messageType:"success"}))
            }
            props.onSubmit &&  props.onSubmit(formData)
        }
    }

    return (
        <>
            <div className={styles.container}>
                <h1>{props.initData? "Edit" : "Add Product"}</h1>
                <form onSubmit={submitHandler}>
                        <div className={findClass(nameInvalid)}>
                            <label htmlFor='name'>Name</label>
                            <input
                                placeholder={"Name"}
                                value = {formData.name}
                                type='text' id='name'
                                onChange={event=>{setFormData({...formData, name:event.target.value})}}
                                onBlur={() =>{setChangedData({...changedData, name:true})}}
                            />
                            {nameInvalid && <p className={styles.errorText}>Name must not be empty!</p>}
                        </div>

                    <div className={findClass(descriptionInvalid)}>
                        <label htmlFor='description'>Description</label>
                        <input
                            placeholder={"Description"}
                            value = {formData.description}
                            type='text' id='description'
                            onChange={event=>{setFormData({...formData, description:event.target.value})}}
                            onBlur={() =>{setChangedData({...changedData, description:true})}}
                        />
                        {descriptionInvalid && <p className={styles.errorText}>Description must not be empty!</p>}
                    </div>

                    <div className={findClass(priceInvalid)}>
                        <label htmlFor='price'>Price</label>
                        <input
                            placeholder={"Price"}
                            value = {formData.price}
                            type='number' id='price'
                            onChange={event=>{setFormData({...formData, price : Number(event.target.value)})}}
                            onBlur={() =>{setChangedData({...changedData, price :true})}}
                        />
                        {priceInvalid && <p className={styles.errorText}>Invalid Price!</p>}
                    </div>
                    <div className={findClass(false)}>
                        <label htmlFor="underline_select" >Type: </label>
                        <select value={formData.type}
                                onChange={e=>setFormData({...formData, type:e.target.value})}
                                id="underline_select" className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                            <option value="House">House</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Single Room">Single Room</option>
                        </select>
                    </div>
                    <div className={styles.formAction}>
                        <button className={styles.button} disabled={!isFormValid}>Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
}
export default ProductForm

