import React, {useRef, useState} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor} from "@nextui-org/react";
import {PlusIcon} from "../../public/Plusicon";
import {ChevronDownIcon} from "@nextui-org/shared-icons";
import {VerticalDotsIcon} from "../../public/VerticalDotsIcon";
import {SearchIcon} from "../../public/SearchIcon";
import {columns, statusOptions, roleOptions} from "./data";
import {capitalize} from "./utils";
import {Toast} from "primereact/toast";
import {ConfirmDialog} from "primereact/confirmdialog";
import {deleteUser} from "@/api/user-api";
import styles from "@/components/product-list.module.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RegisterForm from "@/components/forms/register-form";


const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "createdAt", "updatedAt", "actions"];
type User={id:string, role:string, email:string, password:string, createdAt:string, updatedAt:string, firstName:string, lastName:string, isEmailConfirmed:boolean}
// type User1={id:string, role:string, email:string, password:string, createdAt:string, updatedAt:string, name:string, status:string}

export default function Table1(props:{users:User[]}) {
    // const users2:User1[] = props.users.map(u=> {return {id:u.id, role:u.role.substring(1), email:u.email, password:u.password,createdAt:u.createdAt, updatedAt:u.updatedAt, name:u.firstName+' '+u.lastName, status:(u.role.charAt(0)==='0')? 'unconfirmed' : 'confirmed' }})
    const [users, setUsers] = useState(props.users)
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [roleFilter, setRoleFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);
    const pages = Math.ceil(users.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);

    const [confirmVisible, setConfirmVisible] = useState(false);
    const toast = useRef<Toast>(null);
    const [uid, setUid]=useState('')
    const [openModal, setOpenModal] = useState(false)
    const [editData, setEditData] = useState("")

    const getUserById=(id:string)=>{
        const user = props.users.find(x => x.id === id);
        return user? {id:id, firstName: user.firstName, uName: user.lastName, email: user.email, role: user.role.substring(1), password: user.password, repPassword: user.password}:undefined;

    }

    const reject = () => {
        if (toast.current) {
            toast.current.show({
                severity: 'warn',
                summary: 'Rejected',
                detail: 'Deletion has been successfully canceled. Your item is safe.',
                life: 3000
            });
        }
    }

    const accept = async () => {
        const token = localStorage.getItem('token')
        if (token && toast.current) {
            const error = await deleteUser(token, uid)
            if (error) {
                toast.current.show({
                    severity: 'error',
                    summary: 'ERROR',
                    detail: error,
                    life: 3000
                });
            } else {
                toast.current.show({severity: 'info', summary: 'Confirmed', detail: 'User deleted', life: 3000});
                // window.location.reload()
                const updatedUsers = users.filter((user) => user.id !== uid);
                setUsers(updatedUsers);
            }
        }
    }

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];
        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                (user.firstName.includes(filterValue)||user.lastName.includes(filterValue))
            );
        }

        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((user) => {
                const status = user.isEmailConfirmed? 'confirmed':'waiting for confirmation';
                return Array.from(statusFilter).includes(status)
                }
            );
        }

        if (roleFilter !== "all" && Array.from(roleFilter).length !== roleOptions.length) {
            filteredUsers = filteredUsers.filter((user) =>
                  Array.from(roleFilter).includes(user.role),
            );
        }
        return filteredUsers;
    }, [users, filterValue, statusFilter, roleFilter]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: User, b: User) => {
            const first = a[sortDescriptor.column as keyof User] ;
            const second = b[sortDescriptor.column as keyof User] ;
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof User];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{radius: "full", size: "sm", src: "https://i.pravatar.cc/150?u=a042581f4e29026024d"}}
                        classNames={{
                            description: "text-default-500",
                        }}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{user.role}</p>
                        {/*<p className="text-bold text-tiny capitalize text-default-500">{user.team}</p>*/}
                    </div>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        color={ user.isEmailConfirmed? "success":"danger"}
                        size="sm"
                        variant="dot">
                        {user.isEmailConfirmed? 'confirmed':'waiting for confirmation'}
                    </Chip>
                );
            case "updatedAt":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{user.updatedAt}</p>
                    </div>
                );
            case "createdAt":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{user.createdAt}</p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex justify-start items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger>
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-400" onClick={()=>setUid(user.id)}/>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu >
                                <DropdownItem>View</DropdownItem>
                                <DropdownItem onClick={()=>{setOpenModal(true); setEditData(user.id)}}>Edit</DropdownItem>
                                <DropdownItem onClick={()=>setConfirmVisible(true)}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);


    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
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
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue("")}
                        onValueChange={onSearchChange}
                    />

                    <div className="flex gap-4">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Role
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={roleFilter}
                                selectionMode="multiple"
                                onSelectionChange={setRoleFilter}
                            >
                                {roleOptions.map((role) => (
                                    <DropdownItem key={role.uid} className="capitalize">
                                        {capitalize(role.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="text-small" />}
                                    size="sm"
                                    variant="flat"
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button
                            className="bg-foreground text-background"
                            endContent={<PlusIcon />}
                            size="sm"
                            onClick={()=>setOpenModal(true)}
                        >
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {users.length} users</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        roleFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        users.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
                <span className="text-small text-default-400">
          {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${items.length} selected`}
        </span>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const classNames = React.useMemo(
        () => ({
            wrapper: ["max-h-[382px]", "max-w-3xl"],
            th: [//"bg-transparent",
                "text-default-500", "border-b", "border-divider"],
            td: [
                // changing the rows border radius
                // first
                "group-data-[first=true]:first:before:rounded-none",
                "group-data-[first=true]:last:before:rounded-none",
                // middle
                "group-data-[middle=true]:before:rounded-none",
                // last
                "group-data-[last=true]:first:before:rounded-none",
                "group-data-[last=true]:last:before:rounded-none",
            ],
        }),
        [],
    );

    return (<>
            <Modal onClose={()=>{setOpenModal(false); setEditData("")}} open={openModal}
                   aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description">
                <Box className={styles.modal}>
                    {editData? <RegisterForm mode='edit' initData={getUserById(editData)}/>: <RegisterForm mode='create'/>}
                </Box>
            </Modal>
        <Toast ref={toast} />
        <ConfirmDialog visible={confirmVisible} onHide={() => setConfirmVisible(false)} message={`Are you sure you want to delete the user with id ${uid}?`} header="Confirmation" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} className="confirm"/>
            <Table
            isCompact
            removeWrapper
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            checkboxesProps={{
                classNames: {
                    wrapper: "after:bg-foreground after:text-background text-background",
                },
            }}
            classNames={classNames}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No users found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table></>
    );
}
