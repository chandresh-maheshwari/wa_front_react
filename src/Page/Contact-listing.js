import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdOutlineCancel } from "react-icons/md";
import { Container, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import Authapi from '../Authapi';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Switch from '@mui/material/Switch';
import Expired from '../Login/ExpiredToken';
import { useNavigate } from 'react-router-dom';
import '../Custom.css'

const Contact = () => {

    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [activeStates, setActiveStates] = useState(
        Array.isArray(rows) ? rows.reduce((acc, row) => ({ ...acc, [row.id]: false }), {}) : {}
    );
    // const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await Authapi.contactListData();
            // console.log("API Response:", response);
            if (Array.isArray(response.results)) {
                const formattedData = response.results.map((item, index) => ({
                    id: item.id,
                    sr_no: index + 1,
                    name: item.name,
                    email: item.email,
                    contact_number: item.contact_number,
                    description: item.description,
                }));
                setRows(formattedData);
                setFilteredRows(formattedData);

            } else {
                console.error("Unexpected response format", response.results);
                Swal.fire('Error', 'Invalid data format received.', 'error');
            }
        } catch (error) {
            console.error("Failed to fetch navbar items", error);
            Swal.fire('Error', 'Failed to load navbar items.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // const handleSearch = (event) => {
    //     const query = event.target.value.toLowerCase();
    //     setSearchQuery(query);

    //     const filteredData = rows.filter((row) =>
    //         row.name.toLowerCase().includes(query) ||
    //         row.email.toLowerCase().includes(query) ||
    //         row.contact_number.toString().includes(query) ||
    //         row.description.toString().includes(query)

    //     );
    //     setFilteredRows(filteredData);
    // };
    const handleSearch = (event) => {
        const query = event.target.value.trim();
        setSearchQuery(query);

        if (query) {
            const filtered = rows.filter((row) => {
                return Object.values(row).some((value) =>
                    String(value).toLowerCase().includes(query.toLowerCase())
                );
            });
            setFilteredRows(filtered);
        } else {
            setFilteredRows(rows);
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection);
    };


    // multi Delete Data
    const handleDelete = async (ids) => {
        if (Array.isArray(ids)) {
            ids = [ids];
        }

        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will mark the selected items as deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, mark them!',
        });

        if (confirmDelete.isConfirmed) {
            try {
                const promises = ids.map(id => Authapi.contactdelete(id));
                await Promise.all(promises);
                // console.log(ids);

                Swal.fire('Success!', 'Selected items marked as deleted.', 'success');
                fetchData();
            } catch (error) {
                Swal.fire('Error!', error.response?.data?.message || error.message || 'Failed to delete items', 'error');
            }
        }
    };

    // Single Delete Data
    const handleDelete1 = async (id) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "This will mark the item as deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, mark it!'
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await Authapi.contactdelete(id);
                if (response) {
                    Swal.fire('Success!', 'Item marked as deleted.', 'success');
                    fetchData();
                } else {
                    throw new Error(response?.message || 'Failed to delete item');
                }
            } catch (error) {
                Swal.fire('Error!', error.response?.data?.message || error.message || 'Failed to delete item', 'error');
            }
        }
    };



    const paginationModel = { page: 0, pageSize: 5 };


    const handleStatusFilterChange = (event) => {
        const filterValue = event.target.value;
        setStatusFilter(filterValue);

        if (filterValue === 'all') {
            setFilteredRows(rows);
        } else if (filterValue === 'active') {
            setFilteredRows(rows.filter(row => row.status === 1));
        } else if (filterValue === 'inactive') {
            setFilteredRows(rows.filter(row => row.status === 0));
        } else if (filterValue === 'deleted') {
            setFilteredRows(rows.filter(row => row.status === -1)); // Assuming -1 represents deleted status
        }
    };



    const columns = [
        {
            field: 'checkboxSelection',
            headerName: 'Select',
            width: 100,
            renderHeader: () => (
                <input
                    type="checkbox"
                    checked={selectedRows.length === rows.length}
                    onChange={() => handleSelectAllRows()}
                />
            ),
            renderCell: (params) => (
                <input
                    type="checkbox"
                    checked={selectedRows.includes(params.row.id)}
                    onChange={() => handleCheckboxChange(params.row.id)}
                />
            ),
        },
        { field: 'sr_no', headerName: 'Sr.No', width: 90, flex: 1 },
        { field: 'name', headerName: 'Name', width: 90, flex: 1 },
        { field: 'email', headerName: 'Email', width: 90, flex: 1 },
        { field: 'contact_number', headerName: 'Contact Number', width: 90, flex: 1 },
        { field: 'description', headerName: 'Description', width: 90, flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            flex: 1,
            renderCell: (params) => (
                <strong onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete" color='primary'>
                            <MdDelete onClick={() => handleDelete1(params.row.id)} />
                        </IconButton>
                    </Tooltip>

                </strong>
            ),
        },
    ];

    const handleCheckboxChange = (id) => {
        const newSelectedRows = selectedRows.includes(id)
            ? selectedRows.filter(rowId => rowId !== id)
            : [...selectedRows, id];

        setSelectedRows(newSelectedRows);
    };

    const handleSelectAllRows = () => {
        if (selectedRows.length === rows.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(rows.map(row => row.id));
        }
    };

    return (
        <>

            <Expired />

            <div className="col-md-12">
                <div className="row " style={{ marginLeft: "20%", width: "80%", marginBottom: "20px", marginTop: "7%" }}>

                    <div className="card-header col-6">
                        <h5 className="title ">Contact Us</h5>
                    </div>
                    <div className="card-header col-3">
                        <FormControl fullWidth>
                            <InputLabel>Status Filter</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                label="Status Filter"
                            >
                                <MenuItem value="all" disabled>All</MenuItem>
                                <MenuItem value="deleted" onClick={() => handleDelete(selectedRows)}>Deleted</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="card-header col-3">
                        <input
                            type="search"
                            className="form-control form control navbar-search"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="card-body">
                        <Container>

                            <div style={{ width: '100%', marginBottom: "45px" }}>

                                <div style={{ width: '100%', height: '400px', overflowY: 'auto' }}>
                                    <DataGrid
                                        rows={searchQuery ? filteredRows : rows}
                                        columns={columns}
                                        initialState={{ pagination: { paginationModel } }}
                                        pageSizeOptions={[5, 10, 20]}
                                        loading={loading}
                                        autoHeight={false}
                                        onPageChange={(newPage) => setPage(newPage)}
                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                        sx={{
                                            '& .MuiDataGrid-columnHeaders': {
                                                backgroundColor: '#2c9dd4',
                                                color: 'white',
                                            },
                                        }}
                                        selectionModel={selectedRows}
                                        onSelectionModelChange={handleSelectionChange}
                                        onCellClick={(params, event) => {
                                            if (event.target.closest('.MuiCheckbox-root')) {
                                                return;
                                            }
                                            event.stopPropagation();
                                        }}
                                    />
                                </div>
                            </div>

                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;

