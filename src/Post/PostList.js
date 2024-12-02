import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { BiEditAlt } from "react-icons/bi";
import { MdDelete, MdOutlineCancel } from "react-icons/md";
import { Container, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import Authapi from '../Authapi';
import Switch from '@mui/material/Switch';
import Expired from '../Login/ExpiredToken';
import { useNavigate } from 'react-router-dom';

const PostListing = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStates, setActiveStates] = useState({});
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await Authapi.postList();
            if (response.results) {
                const data = response.results.map((item, index) => ({
                    id: item.id,
                    sr_no: index + 1,
                    ...item,
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

        const filteredData = rows.filter((row) => {
            return Object.values(row).some(value => 
                String(value).toLowerCase().includes(query)
            );
        });
        setFilteredRows(filteredData);
    };

    const handleCancel = () => {
        setSearchQuery('');
        fetchData();
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
                const response = await Authapi.postDeleteData(id);
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
            const response = await Authapi.Poststatus(id);
            setActiveStates(prevStates => ({
                ...prevStates,
                [id]: !prevStates[id]
            }));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const paginationModel = { page: 0, pageSize: 5 };

    const generateColumns = () => {
        if (rows.length === 0) return [];

        const sampleRow = rows[0];
        const dynamicColumns = Object.keys(sampleRow)
            .filter(key => !['id', 'sr_no'].includes(key))
            .map(key => ({
                field: key,
                headerName: key.charAt(0).toUpperCase() + key.slice(1),
                width: 150,
                flex: 1,
            }));

        return [
            // { field: 'sr_no', headerName: 'S.No', width: 90, flex: 1 },
            ...dynamicColumns,
            {
                field: 'actions',
                headerName: 'Actions',
                width: 150,
                flex: 2,
                renderCell: (params) => (
                    <strong>
                        <Link
                            to={`/PostEdit/${params.row.id}`}
                            className="btn btn-primary m-2"
                            style={{ backgroundColor: "#113b4f" }}
                            id="edit"
                            title="Edit"
                        >
                            <BiEditAlt />
                        </Link>
                        <button className='btnkkk btn-oblong btn-danger btn-sm' title="Soft Delete"
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
    };

    return (
        <>
            <Expired />
            <div className="container-fluid panel-header panel-header-sm"></div>
            <div className="col-md-12">
                <div className="row card mt-4" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">Post</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <div style={{ width: '100%', marginTop: '20px', marginBottom: "45px" }}>
                                <h4>Post Listing</h4>
                                <input
                                    type='text'
                                    className='form-control form-control navbar-search'
                                    placeholder='Search'
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <Button className='text-dark' style={{ marginTop: "-96px", marginLeft: "92%" }} onClick={handleCancel}>
                                    <MdOutlineCancel style={{ marginLeft: "30px" }} />
                                </Button>
                                <div style={{ height: '400px', overflowY: 'auto' }}>
                                    <DataGrid
                                        rows={searchQuery ? filteredRows : rows}
                                        columns={generateColumns()}
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

export default PostListing;
