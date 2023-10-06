import React from "react";

const columns = [
    {name: "ID", uid: "id"},
    {name: "NAME", uid: "name", sortable: true},
    {name: "ROLE", uid: "role"},
    {name: "STATUS", uid: "status"},//CONFIRMAT
    {name: "UPDATED AT", uid: "updatedAt", sortable: true},
    {name: "CREATED AT", uid: "createdAt", sortable: true},
    {name: "PASSWORD", uid: "password"},
    {name: "ACTIONS", uid: "actions"},
];
const statusOptions = [
    {name: "Confirmed", uid: "confirmed"},
    {name: "Waiting for confirmation", uid: "unconfirmed"},
];

const roleOptions = [
    {name: "Admin", uid: "admin"},
    {name: "Client", uid: "client"},
];


export {columns, statusOptions, roleOptions};
