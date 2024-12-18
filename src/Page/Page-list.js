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

const PageList = () => {

    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [activeStates, setActiveStates] = useState(
        Array.isArray(rows) ? rows.reduce((acc, row) => ({ ...acc, [row.id]: false }), {}) : {}
    );
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await Authapi.pageListData();
            console.log("API Response:", response);
            if (Array.isArray(response.results)) {
                const formattedData = response.results.map((item, index) => ({
                    id: item.id,
                    sr_no: index + 1,
                    status: item.status,
                    page_status: item.page_status,
                    page_name: item.page_name,
                    page_description: item.page_description,
                    image_url: item.image_url,
                    ordering: item.ordering,
                    // post_type: item.post_type,

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

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredData = rows.filter((row) =>
            row.page_name.toLowerCase().includes(query) ||
            row.ordering.toLowerCase().includes(query)

        );
        setFilteredRows(filteredData);
    };

    const handleCancel = () => {
        setSearchQuery('');
        fetchData();
    };
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
                const response = await Authapi.pageDeleteData(id);
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

    // first active btn 
    const getActive = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            const response = await Authapi.pagestatus(id, newStatus);
            if (response) {

                setActiveStates((prevStates) => ({
                    ...prevStates,
                    [id]: newStatus === 1,
                }));
                fetchData()
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };
    // section active btn 
    const getActive1 = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            const response = await Authapi.pageActive(id, newStatus);
            if (response) {

                setActiveStates((prevStates) => ({
                    ...prevStates,
                    [id]: newStatus === 1,
                }));
                fetchData()
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };


    const columns = [
        // { field: 'id', headerName: 'ID', width: 90, flex: 1 }, 
        { field: 'sr_no', headerName: 'Sr.No', width: 90, flex: 1 },
        { field: 'page_name', headerName: 'Page Name', width: 150, flex: 1 },
        {
            field: 'image',
            headerName: 'Image',
            width: 250,
            flex: 1,
            renderCell: (params) => (
                <img
                    src={params.row.image_url}
                    alt="Page"
                    style={{ width: '50%', height: 'auto' }}
                />
            ),
        },
        { field: 'ordering', headerName: 'Ordering', width: 150, flex: 1 },
        // { field: 'post_type', headerName: 'Post Type', width: 150, flex: 1 },

        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            flex: 1,
            // renderCell: (params) => (
            //     <strong>
            //         <Link
            //             to={`/Page-edit/${params.row.id}`}
            //             className="btn btn-primary m-2"
            //             style={{ backgroundColor: "#113b4f" }}
            //             id="edit"
            //             title="Edit"
            //         >
            //             <BiEditAlt />
            //         </Link>
            //         <button className='btnkkk btn-oblong btn-danger btn-sm' title="Soft Delete"
            //             onClick={() => handleDelete(params.row.id)}>
            //             <MdDelete />
            //         </button>
            //         <Switch
            //             key={params.row.id}
            //             checked={params.row.status}
            //             size="xs"
            //             onChange={() => getActive(params.row.id, activeStates[params.row.id] ? 0 : 1)}
            //         />
            //         <Switch
            //             key={params.row.id}
            //             checked={params.row.page_status}
            //             size="xs"
            //             onChange={() => getActive1(params.row.id, activeStates[params.row.id] ? 0 : 1)}
            //         />
            //     </strong>
            // ),
            renderCell: (params) => (
                <strong onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Update">
                        <IconButton aria-label="Update" color='primary' className='Edit-list' >
                            <Link
                                to={`/Page-edit/${params.row.id}`}
                                id="edit"
                                className='m-2'
                            >
                                <FaEdit />
                            </Link>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete" color='primary'>
                            <MdDelete onClick={() => handleDelete(params.row.id)} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Active">
                        <Switch
                            key={params.row.id}
                            checked={params.row.status}
                            size="xs"
                            onChange={() => getActive(params.row.id, activeStates[params.row.id] ? 0 : 1)}
                        />
                    </Tooltip>
                    <Tooltip title="Active">
                        <Switch
                            key={params.row.id}
                            checked={params.row.page_status}
                            size="xs"
                            onChange={() => getActive1(params.row.id, activeStates[params.row.id] ? 0 : 1)}
                        />
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
                        <h5 className="title">Page</h5>
                    </div>
                    <div className="card-body">
                        <Container>

                            <div style={{ width: '100%', marginTop: '20px', marginBottom: "45px" }}>
                                <h4>Page Listing</h4>
                                <input
                                    type='text'
                                    className='form-control form control navbar-search'
                                    placeholder='Search'
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <Button className='text-dark' style={{ marginTop: "-96px", marginLeft: "92%" }} onClick={handleCancel}>
                                    <MdOutlineCancel style={{ marginLeft: "30px" }} />
                                </Button>
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

export default PageList;

