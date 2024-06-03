export async function getProducts(){
    return await fetch('http://localhost:3001/v1/products', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

export async function deleteProduct(id:string) {
    const response = await fetch('http://localhost:3001/v1/products/'+ id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    if (response.status/100 === 4) {
        return response.text().then(error=>JSON.parse(error).message)
    }

    if(!response.ok)
        return "Delete error"

    return ""
}

export async function EditProduct( name:string, description:string, price:number, type:string,id?:string) {
    const token = localStorage.getItem('token')
    const editData = {name:name, description:description, price:price, type:type}
    const response = await fetch(`http://localhost:3001/v1/products/${id||''}`, {
        method: id?'PUT':'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
    })

    if (response.status === 422 || response.status === 401) {
        return response.text().then(error=>JSON.parse(error).message)
    }

    if(!response.ok) {
        return `Request failed.`
    }

    return ""
}
