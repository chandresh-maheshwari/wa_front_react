import { Container, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Authapi from '../Authapi';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdAdd } from 'react-icons/md';
import "../Custom.css";
import Switch from '@mui/material/Switch';
import Expired from '../Login/ExpiredToken';
import { useNavigate } from 'react-router-dom';


const DynamicList = () => {
    const navigate = useNavigate();    
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStates, setActiveStates] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [statusFilter, setStatusFilter] = useState('all');

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
    // multi deleted DAta 
    const handleDelete = async (ids) => {
        // Check if at least one checkbox is selected
        if (selectedRows.length === 0) {
            Swal.fire('Warning', 'Please select at least one item to delete.', 'warning');
            return;
        }

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
                const promises = ids.map(id => Authapi.dynamicDeleteData(id));
                await Promise.all(promises);
                Swal.fire('Success!', 'Selected items marked as deleted.', 'success');
                fetchData();
            } catch (error) {
                Swal.fire('Error!', error.response?.data?.message || error.message || 'Failed to delete items', 'error');
            }
        }
    };
    const handleEdit = async (id) => {
        navigate(`/dynamic-edit/${id}`);
    }
    // single Delelete Data
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

    // single active nd inactive data 
    const getSingleActive = async (id, currentStatus) => {

        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            const response = await Authapi.dynamicstatus(id, newStatus);
            if (response) {
                setActiveStates((prevStates) => ({
                    ...prevStates,
                    [id]: newStatus === 1,
                }));

                const event = new CustomEvent('dynamicPostStatusChanged', {
                    detail: { id, status: newStatus }
                });
                window.dispatchEvent(event);

                fetchData();
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };
    // multi inactive data 
    const getInactive = async (ids) => {
        if (selectedRows.length === 0) {
            Swal.fire('Warning', 'Please select at least one item to Inactive.', 'warning');
            return;
        }
        if (Array.isArray(ids) && ids.length > 0) {
            const newStatus = 0;
            try {
                // const idsToDeactivate = ids.filter(id => activeStates[id] !== false);              
                // if (idsToDeactivate.length > 0) {
                const promises = ids.map(id => Authapi.dynamicstatus(id, newStatus));
                await Promise.all(promises);

                setActiveStates(prevStates => {
                    const newStates = { ...prevStates };
                    ids.forEach(id => {
                        newStates[id] = false;
                    });
                    return newStates;
                });
                const event = new CustomEvent('dynamicPostStatusChanged', {
                    detail: { ids, status: newStatus }
                });
                window.dispatchEvent(event);
                fetchData();
                Swal.fire('Success!', 'Selected items are now inactive.', 'success');
                // } else {
                //     Swal.fire('Info', 'All selected items are already inactive.', 'info');
                // }
            } catch (error) {
                Swal.fire('Error', 'Failed to update status', 'error');
            }
        }
    };


    // multi active data 
    const getActive = async (ids) => {
        if (selectedRows.length === 0) {
            Swal.fire('Warning', 'Please select at least one item to Active.', 'warning');
            return;
        }
        if (Array.isArray(ids) && ids.length > 0) {
            const newStatus = 1;
            try {
                // const idsToActivate = ids.filter(id => activeStates[id] !== true);
                // console.log(idsToActivate)
                if (ids.length > 0) {
                    const promises = ids.map(id => Authapi.dynamicstatus(id, newStatus));
                    await Promise.all(promises);

                    setActiveStates(prevStates => {
                        const newStates = { ...prevStates };
                        ids.forEach(id => {
                            newStates[id] = true;
                        });
                        return newStates;
                    });
                    const event = new CustomEvent('dynamicPostStatusChanged', {
                        detail: { ids, status: newStatus }
                    });
                    window.dispatchEvent(event);
                    fetchData();
                    Swal.fire('Success!', 'Selected items are now active.', 'success');

                } else {
                    Swal.fire('Info', 'All selected items are already active.', 'info');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to update status', 'error');
            }
        }
    };

    const handleStatusFilterChange = (event) => {
        const filterValue = event.target.value;
        setStatusFilter(filterValue);
        if (filterValue === 'all') {
            setFilteredRows(rows);
        } else if (filterValue === 'active') {
            setFilteredRows(rows.filter(row => row.status === 1));
            setSelectedRows([]);
        } else if (filterValue === 'inactive') {
            setFilteredRows(rows.filter(row => row.status === 0));
            setSelectedRows([]);
        } else if (filterValue === 'deleted') {
            setFilteredRows(rows.filter(row => row.status === -1));
            setSelectedRows([]);
        }
    };
    const paginationModel = { page: 0, pageSize: 10};
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
        { field: 'sr_no', headerName: 'Sr No', width: 90, flex: 1 },
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
                    <Tooltip title="Update">
                        {/* <IconButton aria-label="Update" color='primary' className='Edit-list action-button'>
                            <Link to={`/dynamic-edit/${params.row.id}`} id="edit"   >
                                <FaEdit />
                            </Link>
                        </IconButton> */}
                         <IconButton aria-label="Update"  onClick={() => handleEdit(params.row.id)} color="primary" style={{ margin: '1px' }}>
                                                   
                                                   <FaEdit />
                                              
                                           </IconButton>

                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete" color='primary' className='action-button'>
                            <MdDelete onClick={() => handleDelete1(params.row.id)} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Active">
                        <Switch className='action-button'
                            key={params.row.id}
                            checked={params.row.status}
                            size="xs"
                            onChange={async () => {
                                const confirmToggle = await Swal.fire({
                                    title: 'Are you sure?',
                                    text: 'Do you want to change the active status?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, change it!'
                                });

                                if (confirmToggle.isConfirmed) {
                                    await getSingleActive(params.row.id, activeStates[params.row.id] ? 1 : 0);
                                    Swal.fire('Success!', 'Active status changed successfully.', 'success');
                                }
                            }}
                        />
                    </Tooltip>
                </strong>
            ),
        },
    ];

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection);
    };

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

    const handleAddNavigate = () => {
        navigate('/dynamic-form'); // Navigate to the /page route
    };

    return (
        <>
            <Expired />
            <div className="col-md-12">
             <div className="row" style={{ marginTop:'10px', marginBottom: '20px',  marginLeft: "262px" }}>

                <div className="card-header col-6 dynamic-post-section">
                    <h5 className="title ">Post</h5>
                    <IconButton className="dynamic-post-add-btn" aria-label="add" color="primary" onClick={handleAddNavigate}>
                        <MdAdd />
                    </IconButton>

                </div>
                <div className="card-header col-3">
                    <FormControl fullWidth>
                        <InputLabel>Status Filter</InputLabel>
                        <Select
                            value={statusFilter}
                            className='filter_dropdown_of_main_page'
                            onChange={handleStatusFilterChange}
                            label="Status Filter"
                        >
                            <MenuItem value="all" disabled>All</MenuItem>
                            <MenuItem value="active" onClick={() => getActive(selectedRows)}>Active</MenuItem>
                            <MenuItem value="inactive" onClick={() => getInactive(selectedRows)}>Inactive</MenuItem>
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
                <div className="card-body" style={{ height: 'calc(115vh - 200px)', width: '100%' }}>
                    <Container style={{ height: '100%' }}>
           
                        <div style={{ height: '100%' }}>
                            <DataGrid
                                rows={searchQuery ? filteredRows : rows}
                                columns={columns}
                                initialState={{ pagination: { paginationModel } }}
                                pageSizeOptions={[5, 10, 20, { value: rows.length, label: 'All' }]}
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
                    </Container>
                </div>
            </div>
            </div>
        </>
    );
};

export default DynamicList;
