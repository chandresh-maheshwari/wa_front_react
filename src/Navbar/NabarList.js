import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';
import { BiEditAlt } from "react-icons/bi";
import { MdDelete, MdOutlineCancel } from "react-icons/md";
import { Container, TextField, Button, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import Authapi from '../Authapi';
import './Navbar.css';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Switch from '@mui/material/Switch';
import Expired from '../Login/ExpiredToken';
import { useNavigate } from 'react-router-dom';

const NavbarListData = () => {
    // const [navTitle, setNavTitle] = useState('');
    // const [navUrl, setNavUrl] = useState('');
    // const [ordering, setOrdering] = useState('');
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
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
            const response = await Authapi.getDataList();
            if (Array.isArray(response.results)) {
                const formattedData = response.results.map((item, index) => ({
                    id: item.id,
                    sr_no: index + 1,
                    navTitle: item.nav_menu_name,
                    navUrl: item.nav_menu_link,
                    ordering: item.menu_ordering,
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
            row.navTitle.toLowerCase().includes(query) ||
            row.navUrl.toLowerCase().includes(query) ||
            row.ordering.toString().includes(query)
        );
        setFilteredRows(filteredData);
    };

    const handleCancel = () => {
        setSearchQuery('');
        fetchData();
    };
    const paginationModel = { page: 0, pageSize: 5 };
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
                const response = await Authapi.getDelete(id);
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




    const getActive = async (id) => {
        try {
            const response = await Authapi.navbarstatus(id);
            console.log(response)
            setActiveStates(prevStates => ({
                ...prevStates,
                [id]: !prevStates[id]
            }));
        } catch (error) {
            console.error('Error:', error);
        }
    };



    const columns = [
        // { field: 'id', headerName: 'ID', width: 90, flex: 1 }, 
        { field: 'sr_no', headerName: 'S.No', width: 90, flex: 1 },
        { field: 'navTitle', headerName: 'Nav Menu Title', width: 150, flex: 1 },
        { field: 'navUrl', headerName: 'Link URL', width: 250, flex: 1 },
        { field: 'ordering', headerName: 'Ordering', width: 150, flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            flex: 1,
            renderCell: (params) => (
                <strong>
                    <Link
                        to={`/navbaredit/${params.row.id}`}
                        className="btn btn-primary m-2"
                        style={{ backgroundColor: "#113b4f" }}
                        id="edit"
                        title="Edit"
                    >
                        <BiEditAlt />
                    </Link>
                    <button className='btnkkk btn-oblong btn-danger btn-sm' title="Soft Delete"
                        onClick={() => handleDelete(params.row.id)}>
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
            <div className="container-fluid panel-header panel-header-sm"></div>
            <div className="col-md-12">
                <div className="row card mt-4" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">NavBar</h5>
                    </div>
                    <div className="card-body">
                        <Container>

                            <div style={{ width: '100%', marginTop: '20px', marginBottom: "45px" }}>
                                <h4>NavBar Listing</h4>
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
                                <div style={{ height: '400px', overflowY: 'auto' }}>
                                    <DataGrid
                                        rows={filteredRows || []}
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

export default NavbarListData;

