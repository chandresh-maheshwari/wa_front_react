import { Container, Button } from '@mui/material';
import Authapi from '../Authapi';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete, MdOutlineCancel } from 'react-icons/md';
import "../Custom.css";
import Switch from '@mui/material/Switch';
import Expired from '../Login/ExpiredToken';
// import '../Navbar.css'

const DynamicList = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStates, setActiveStates] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await Authapi.dynamicListData();
            if (response && response.results) {
                const data = response.results.map((item) => ({
                    id: item.id,
                    post_title: item.post_title,
                    post_type: item.post_type,
                    ordering: item.ordering,
                    status: item.status,
                }));

                const sortedData = data.sort((a, b) => b.id - a.id);
                const dataWithSrNo = sortedData.map((item, index) => ({
                    ...item,
                    sr_no: index + 1,
                }));

                setRows(dataWithSrNo);
                setFilteredRows(dataWithSrNo);

                const initialActiveStates = dataWithSrNo.reduce((acc, row) => ({
                    ...acc,
                    [row.id]: row.status === 1,
                }), {});
                setActiveStates(initialActiveStates);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Swal.fire('Error', 'Failed to load data.', 'error');
        }
    };


    const handleSearch = (event) => {
        const query = event.target.value;
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

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will mark the item as deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, mark it!',
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await Authapi.dynamicDeleteData(id);
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

    const getActive = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            const response = await Authapi.dynamicstatus(id, newStatus);
            if (response) {
                setActiveStates((prevStates) => ({
                    ...prevStates,
                    [id]: newStatus === 1,
                }));

            } else {
                throw new Error('Failed to update status');
            }
            fetchData()
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    const paginationModel = { page: 0, pageSize: 5 };
    const columns = [
        { field: 'sr_no', headerName: 'Sr.No', width: 90, flex: 1 },
        { field: 'post_title', headerName: 'Title', width: 150, flex: 1 },
        { field: 'post_type', headerName: 'Post Type', width: 150, flex: 1 },
        { field: 'ordering', headerName: 'Ordering', width: 150, flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            flex: 1,
            renderCell: (params) => (
                <strong onClick={(e) => e.stopPropagation()}>
                    <Link
                        to={`/dynamic-edit/${params.row.id}`}
                        className="btn btn-primary m-2"
                        style={{ backgroundColor: '#113b4f' }}
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
                        checked={params.row.status}
                        size="xs"
                        onChange={() => getActive(params.row.id, activeStates[params.row.id] ? 1 : 0)}
                    />
                    {console.log(params.row.status)}
                </strong>
            ),
        },
    ];

    const handlesearchCancel = () => {
        setSearchQuery('');
        setFilteredRows([]);
        fetchData();
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection);
    };

    return (
        <>
            <Expired />
            <div className="col-md-12">
                <div className="row card" style={{ marginLeft: '22%', width: '75%', marginBottom: '20px', marginTop: '10%' }}>
                    <div className="card-header">
                        <h5 className="title">Post</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <div style={{ marginTop: '30px' }}>
                                <h4>Post Data</h4>
                                <input
                                    type='text'
                                    className='form-control form control navbar-search'
                                    placeholder='Search'
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <Button className='text-dark' style={{ marginTop: "-96px", marginLeft: "92%" }} onClick={handlesearchCancel}>
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
                                        selectionModel={selectedRows}
                                        onSelectionModelChange={handleSelectionChange}
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

export default DynamicList;
