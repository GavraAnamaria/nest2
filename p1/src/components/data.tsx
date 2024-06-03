import React from "react";

const columns = [
    {name: "ID", uid: "id"},
    {name: "NAME", uid: "name"},
    {name: "EMAIL", uid: "email", sortable: true},
    {name: "ROLE", uid: "role", sortable: true},
    {name: "STATUS", uid: "status", sortable: true},
    {name: "UPDATED AT", uid: "updatedAt", sortable: true},
    {name: "CREATED AT", uid: "createdAt", sortable: true},
    {name: "PASSWORD", uid: "password"},
    {name: "ACTIONS", uid: "actions"},
];
const statusOptions = {
    all: "all",
    confirmed: "Confirmed",
    unconfirmed: "Waiting for confirmation",
    };

const typeOptions = {
    all: "All",
    house:"House",
    apartment:"Apartment",
   singleRoom:"Single Room"
    };

const roleOptions = [
    {name: "Admin", uid: "admin"},
    {name: "Client", uid: "client"},
];


export {columns, statusOptions, roleOptions, typeOptions};
