import React, {useEffect, useRef, useState} from "react";
import ProductCard from "@/components/product-card";
import styles from './product-list.module.css'
import display1 from '../../public/display1.png'
import display2 from '../../public/display2.png'
import add from '../../public/add.png'
import { useSelector} from "react-redux";
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';
import {deleteProduct,  getProducts} from "@/api/product-api";
import {Toast} from "primereact/toast";
import {ConfirmDialog} from "primereact/confirmdialog";
import ProductForm from "@/components/forms/product-form";
import {Product, User as UserType} from "@/types/user";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Selection} from "@nextui-org/react";
import {SearchIcon} from "../../public/SearchIcon";
import {ChevronDownIcon} from "@nextui-org/shared-icons";
import {roleOptions, statusOptions, typeOptions} from "@/components/data";
import {capitalize} from "@/components/utils";


function Products(){
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [type, setType] = React.useState<Selection>(new Set([typeOptions.all]));
    const [searchValue, setSearchValue] = React.useState('');
    const userData = useSelector((state:{user:{role:string, name:string}}) => state.user)
    const [selected, setSelected] = useState(1)
    const [openModal, setOpenModal] = useState(false)
    const toast = useRef<Toast>(null);
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState('');
    const [orderBy, setOrderBy] = useState('');

    function detStyle(nr:number){
        return nr===selected? styles.menu + ' ' + styles.menuSelected : styles.menu
    }

    const fetchProducts = async () => {
        try{
            const res = await getProducts();
            const data = await  res.json();
            setProducts(data);
        }catch (error){
            console.log ("Error while fetching data");
        }
    };

    useEffect(() => {
        let filteredProducts1 = [...products];
        if ( searchValue.trim()) {
            const search= searchValue.trim().toLowerCase();
            filteredProducts1 = filteredProducts1.filter((product) => product.name.toLowerCase().includes(search))}
        if (Array.from(type)[0] !== typeOptions.all) {
            filteredProducts1 = filteredProducts1.filter((product) => (product.type === Array.from(type)[0]));
        }

        setFilteredProducts(filteredProducts1);
    }, [ products, searchValue, type]);

    const sortedItems = React.useMemo(() => {
        return [...filteredProducts].sort((a: Product, b: Product) => {
            const first = a[orderBy as keyof Product] ;
            const second = b[orderBy as keyof Product] ;
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return cmp;
        // dir === "descending" ? -cmp : cmp!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        });
    }, [orderBy, filteredProducts]);

    useEffect( () => {
        (async function () {
            await fetchProducts();
        })();
    },[]);

    const deleteItem=(itemId:string)=>{
        setId(itemId)
        setVisible(true)
    }

    const accept = async () => {
         await deleteProduct(id);
        if (toast.current) {
            toast.current.show({severity: 'info', summary: 'Confirmed', detail: 'Item deleted', life: 3000});
        }
        await fetchProducts()
    }

    const reject = () => {
        if (toast.current) {
            toast.current.show({severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000});
        }
    }

    const onSubmit= async ()=>{
        setOpenModal(false);
        await fetchProducts()
    }

    const TopContent = ()=><div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1",
                        }}
                        placeholder="Search by name..."
                        size="sm"
                        startContent={<SearchIcon className="text-default-300" />}
                        value={searchValue}
                        variant="bordered"
                        onClear={() => setSearchValue("")}
                        onValueChange={setSearchValue}
                    />

                    <div className="flex gap-4">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Type
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="type"
                                closeOnSelect={true}
                                selectedKeys={type}
                                selectionMode="single"
                                onSelectionChange={setType}
                            >
                                 {Object.values(typeOptions).map((type) => (
                                        <DropdownItem key={type} className="capitalize">
                                            {capitalize(type)}
                                        </DropdownItem>
                                    ))}
                            </DropdownMenu>
                        </Dropdown>
                        <div className={'flex gap-5 align-bottom'}>
                            <label className={'py-2'}>Order by: </label>
                            <select value={orderBy} onChange={(e)=>setOrderBy(e.target.value)}
                                    id="select" className="block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                                <option value="">Implicit</option>
                                <option value="price">Price</option>
                                <option value="type">Type</option>
                                <option value="name">Name</option>
                                <option value="description">Description</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>;


    return(
        <>
            <Modal onClose={()=>setOpenModal(false)} open={openModal}
                   aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description">
                <Box className = {styles.modal}>
                    <ProductForm onSubmit = {onSubmit}/>
                </Box>
            </Modal>
            <Toast ref={toast} />
            <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Are you sure you want to delete this item?" header="Confirmation" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} className='confirm'/>

            <TopContent/>
            <div style={{display:'flex'}}>
                <img className={detStyle(1)} src={display1.src} alt="grid" onClick={()=>setSelected(1)}/>
                <img className={detStyle(2)} src={display2.src} alt="list" onClick={()=>setSelected(2)}/>
                {userData.role==='admin' && <img className={styles.menu} src={add.src} onClick={()=>setOpenModal(true)} alt="list"/>}
            </div>
            <div className={styles.cards}>
                    {sortedItems.map((product)=>(
                      <ProductCard key={product.id} style={selected===1? 'card':'card2'} role={userData.role} product={product} onDelete={deleteItem}/>
                    ))}
            </div>
        </>
    )
}
export default Products
