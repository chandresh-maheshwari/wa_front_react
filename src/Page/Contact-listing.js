import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdOutlineCancel } from "react-icons/md";
import { Container, TextField, Button, Grid, IconButton, Tooltip } from '@mui/material';
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
    // const handleCancel = () => {
    //     setSearchQuery('');
    //     fetchData();
    // };
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection);
    };




    const handleDelete = async (id) => {
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





    const columns = [
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
                            <MdDelete onClick={() => handleDelete(params.row.id)} />
                        </IconButton>
                    </Tooltip>

                </strong>
            ),
        },
    ];

    return (
        <>

            <Expired />
            <div className="container-fluid panel-header panel-header-sm"></div>
            <div className="col-md-12">
                <div className="row card mt-4" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">Contact Us</h5>
                    </div>
                    <div className="card-body">
                        <Container>

                            <div style={{ width: '100%', marginTop: '20px', marginBottom: "45px" }}>
                                <h4>Contact Us</h4>
                                <input
                                    type='search'
                                    className='form-control form control navbar-search'
                                    placeholder='Search'
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                {/* <Button className='text-dark' style={{ marginTop: "-96px", marginLeft: "92%" }} onClick={handleCancel}>
                                    <MdOutlineCancel style={{ marginLeft: "30px" }} />
                                </Button> */}
                                <div style={{ width: '100%', height: '400px', overflowY: 'auto' }}>
                                    <DataGrid
                                        rows={searchQuery ? filteredRows : rows}
                                        columns={columns}
                                        initialState={{ pagination: { paginationModel: { page, pageSize } } }}
                                        pageSizeOptions={[5, 10, 20]}
                                        checkboxSelection
                                        loading={loading}
                                        autoHeight={false}
                                        sx={{
                                            height: '100%',
                                            overflow: 'hidden',
                                            '& .MuiDataGrid-columnHeaders': {
                                                backgroundColor: '#2c9dd4',
                                                color: 'white',
                                                // wordWrap: 'break-word'
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

