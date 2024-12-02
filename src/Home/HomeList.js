import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Container, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Authapi from '../Authapi';
import { Link } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete, MdOutlineCancel } from "react-icons/md";
import Switch from '@mui/material/Switch';
import Expired from '../Login/ExpiredToken';


const HomeListData = () => {
    const [rows, setRows] = useState([]); // for DataGrid rows
    const [filteredRows, setFilteredRows] = useState([]); // for filtered rows based on search
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [activeStates, setActiveStates] = useState(
        Array.isArray(rows) ? rows.reduce((acc, row) => ({ ...acc, [row.id]: false }), {}) : {}
    );




    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await Authapi.gethomeList();
            if (response.results) {
                const data = response.results.map((item, index) => ({
                    id: item.id,
                    sr_no: index + 1,
                    home_section_title: item.home_section_title,
                    home_section_description: item.home_section_description,
                    home_section_button_name: item.home_section_button_name,
                    home_section_button_name_link: item.home_section_button_name_link,
                    home_section_img: item.home_section_img,
                }));
                setRows(data);
            }
        } catch (error) {
            console.error('Fetch data error: ', error);
            Swal.fire('Error', 'There was an issue fetching the data.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredData = rows.filter((row) =>
            row.home_section_title.toLowerCase().includes(query) ||
            row.home_section_description.toLowerCase().includes(query) ||
            row.home_section_button_name.toLowerCase().includes(query) ||
            row.home_section_button_name_link.toLowerCase().includes(query) ||
            row.home_section_img.toLowerCase().includes(query)
        );
        setFilteredRows(filteredData);
    };


    const handleCancel = () => {
        setSearchQuery('');
        setFilteredRows([]);
        fetchData();
    };

    // Handle delete
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
                const response = await Authapi.homegetDelete(id);
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


    const paginationModel = { page: 0, pageSize: 5 };

    const getActive = async (id) => {
        try {
            const response = await Authapi.homestatus(id);
            // console.log(response)
            setActiveStates(prevStates => ({
                ...prevStates,
                [id]: !prevStates[id]
            }));
        } catch (error) {
            console.error('Error:', error);
        }
    };


    // DataGrid columns
    const columns = [
        // { field: 'id', headerName: 'ID', width: 90, flex: 1 },
        { field: 'sr_no', headerName: 'S.No', width: 90, flex: 1 },
        { field: 'home_section_title', headerName: 'Title', width: 150, flex: 1 },
        { field: 'home_section_description', headerName: 'Description', width: 200, flex: 1 },
        { field: 'home_section_button_name', headerName: 'Button Name', width: 150, flex: 1 },
        { field: 'home_section_button_name_link', headerName: 'Button URL', width: 150, flex: 1 },
        { field: 'home_section_img', headerName: 'Image', width: 150, flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            flex: 2,
            renderCell: (params) => (
                <strong>
                    <Link
                        to={`/HomeEditform/${params.row.id}`}
                        className="btn btn-primary m-2"
                        style={{ backgroundColor: "#113b4f" }}
                        id="edit"
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
            <div className="container-fluid panel-header panel-header-sm"></div>
            <div className="col-md-12">
                <div className="row card mt-4" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">Home</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <div style={{ marginTop: '30px' }}>
                                <h4>Home Sections Data</h4>
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

export default HomeListData;
