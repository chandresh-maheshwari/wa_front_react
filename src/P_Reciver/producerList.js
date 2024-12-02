import { Container, TextField, Button, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Authapi from '../Authapi';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete, MdOutlineCancel } from "react-icons/md";
import { DataGrid } from '@mui/x-data-grid';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Switch from '@mui/material/Switch';

import Expired from '../Login/ExpiredToken';
const ProducerList = () => {


    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [activeStates, setActiveStates] = useState(
        Array.isArray(rows) ? rows.reduce((acc, row) => ({ ...acc, [row.id]: false }), {}) : {}
    );




    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await Authapi.getreciverList();
            if (response.results) {
                const data = response.results.map((item, index) => ({
                    id: item.id,
                    sr_no: index + 1,
                    section_title: item.section_title,
                    section_image: item.section_image,
                    producer_title: item.producer_title,
                    producer_description: item.producer_description,
                    receiver_title: item.receiver_title,
                    receiver_description: item.receiver_description,
                }));
                setRows(data);
                setFilteredRows(data);
            }
        } catch (error) {
            console.error('Fetch data error: ', error);
            Swal.fire('Error', 'There was an issue fetching the data.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredData = rows.filter((row) =>
            row.section_title.toLowerCase().includes(query) ||
            row.producer_title.toLowerCase().includes(query) ||
            row.producer_description.toLowerCase().includes(query) ||
            row.receiver_title.toLowerCase().includes(query) ||
            row.receiver_description.toLowerCase().includes(query)
        );
        setFilteredRows(filteredData);
    };

    const handleCancel = () => {
        setSearchQuery('');
        setFilteredRows(rows);
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
                const response = await Authapi.getreciverDelete(id);
                if (response) {
                    setRows(rows.filter(row => row.id !== id));
                    Swal.fire('Success!', 'Item marked as deleted.', 'success');
                    fetchData();
                }
            } catch (error) {
                Swal.fire('Error!', error.response?.data?.message || error.message || 'Failed to delete item', 'error');
            }
        }
    };

    const getActive = async (id) => {
        try {
            const response = await Authapi.producerstatus(id);
            console.log(response)
            setActiveStates(prevStates => ({
                ...prevStates,
                [id]: !prevStates[id]
            }));
        } catch (error) {
            console.error('Error:', error);
        }
    };



    const paginationModel = { page: 0, pageSize: 5 };

    const columns = [
        // { field: 'id', headerName: 'ID', width: 70, flex: 1 },
        { field: 'sr_no', headerName: 'S.No', width: 90, flex: 1 },
        { field: 'section_title', headerName: 'Title', width: 150, flex: 1 },
        { field: 'producer_title', headerName: 'Producer Title', width: 150, flex: 1 },
        { field: 'producer_description', headerName: 'Producer Description', width: 200, flex: 1 },
        { field: 'receiver_title', headerName: 'Receiver Title', width: 150, flex: 1 },
        { field: 'receiver_description', headerName: 'Receiver Description', width: 200, flex: 1 },
        {
            field: 'section_image', headerName: 'Image', width: 150, flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            flex: 2,
            renderCell: (params) => (
                <strong>
                    <Link
                        to={`/ProducerReciverEdit/${params.row.id}`}
                        className="btn btn-primary m-2"
                        style={{ backgroundColor: "#113b4f" }}
                        title="Edit"
                    >
                        <BiEditAlt />
                    </Link>

                    <button
                        className='btnkkk btn-oblong btn-danger btn-sm'
                        title="Soft Delete"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <MdDelete />
                    </button>
                    <Switch
                        key={params.row.id}
                        checked={activeStates[params.row.id]}
                        size="xs"
                        onChange={() => getActive(params.row.id)}
                    />
                </strong>
            ),
        },
    ];

    return (
        <>
            <Expired />
            <div className="col-md-12">
                <div className="row card" style={{ marginLeft: "22%", width: "75%", marginTop: "10%", marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">Product Receiver</h5>
                    </div>
                    <div className="card-body">
                        <Container>

                            <div style={{ marginTop: '30px' }}>
                                <h4>Reciver & Producer Section Data</h4>
                                <input
                                    type='text'
                                    className='form-control form control navbar-search'
                                    placeholder='Search'
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <Button
                                    className='text-dark'
                                    style={{ marginTop: "-96px", marginLeft: "92%" }}
                                    onClick={handleCancel}
                                >
                                    <MdOutlineCancel style={{ marginLeft: "30px" }} />
                                </Button>

                                <div style={{ width: '100%', height: '400px', overflowY: 'auto' }}>
                                    <DataGrid
                                        rows={filteredRows}
                                        columns={columns}
                                        initialState={{ pagination: { paginationModel } }}
                                        pageSizeOptions={[5, 10, 20]}
                                        checkboxSelection
                                        loading={loading}
                                        autoHeight={false}
                                        onPageChange={(newPage) => setPage(newPage)}
                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                        sx={{
                                            height: '100%',
                                            '& .MuiDataGrid-columnHeaders': {
                                                backgroundColor: '#2c9dd4',
                                                color: 'white',
                                            },
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

export default ProducerList;
