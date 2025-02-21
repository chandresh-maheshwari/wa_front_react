import { Container, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel, Checkbox } from '@mui/material';

import Authapi from '../Authapi';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdAdd, MdRestore, MdOutlineCancel } from 'react-icons/md';
import Switch from '@mui/material/Switch';
import Expired from '../Login/ExpiredToken';
import { useLocation } from 'react-router-dom';
import ls from 'local-storage';
import "../Custom.css";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';

const PostDynamicList = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStates, setActiveStates] = useState({});
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const location = useLocation();
    const post_title = location.state?.post_title;
    const [columns, setColumns] = useState([]);
    const [expandedEmails, setExpandedEmails] = useState({});
    const [abc, setAbc] = useState();
    const [statusFilter, setStatusFilter] = useState('all');
    const [actionFilter, setActionFilter] = useState("all");

    useEffect(() => {
        setTimeout(() => {
            fetchData();
        }, 100);
    }, [post_title]);

    const fetchData = async () => {
        try {
            const response = await Authapi.postdynamicListData(post_title);
            if (response.status === true) {
                const formattedRows = response.results.map((item, index) => {
                    const filteredData = Object.keys(item.data)
                        .filter(key => !key.includes('_') && !key.includes('slug') && key !== 'id' && key !== 'status')
                        .reduce((obj, key) => {
                            obj[key] = item.data[key];
                            return obj;
                        }, {});
                    return {
                        id: item.id,
                        status: item.status,
                        deleted_at: item.deleted_at,
                        "Sr No": index + 1,
                        ...filteredData,
                    };
                });

                // Filter out deleted items by default
                const nonDeletedRows = formattedRows.filter(row => row.deleted_at !== 1);
                setRows(formattedRows);
                setFilteredRows(nonDeletedRows);
            } else {
                console.error('Invalid response structure:', response);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };




    // console.log(selectedRows.length === rows.length);
    const dynamicColumns = [
        {
            field: 'checkboxSelection',
            headerName: 'Select',
            width: 100,
            renderHeader: () => (
                <input
                    type="checkbox"
                    checked={rows.length > 0 && selectedRows.length === rows.length}
                    onChange={handleSelectAllRows}
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

        ...Object.keys(rows[0] || {}).map((key) => {
            if (key === 'id' || key === 'status' || key === 'deleted_at') return null;
            return {
                field: key,
                headerName: key.charAt(0).toUpperCase() + key.slice(1),
                width: key === 'quote_section_image' ? 150 : 200,
                cellClassName: 'wrap-text',
                renderCell: (params) => {
                    const value = params.row[key];
                    const isExpanded = expandedEmails[params.row.id];
                    const displayValue = typeof value === 'string' ? value : (value !== undefined && value !== null ? String(value) : "-");
                    const safeValue = displayValue.replace(/[^a-zA-Z0-9-_]/g, '_');
                    const isImage = typeof value === 'string' && (value.endsWith('.jpg') || value.endsWith('.jpeg') || value.endsWith('.png') || value.endsWith('.gif'));
                    return (
                        <div style={{ whiteSpace: 'normal', }}>
                            {isImage ? (
                                <img src={value} alt={displayValue} style={{ width: '50%', height: 'auto' }} />
                            ) : (
                                <span className={`email-display-${safeValue}`}>
                                    {displayValue}
                                </span>
                            )}
                        </div>
                    );
                }
            };
        }).filter(Boolean),
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => {
                if (statusFilter === 'deleted' && params.row.deleted_at === 1) {
                    return (
                        <Tooltip title="Restore">
                            <IconButton aria-label="restore" color="primary" className="action-button" style={{ margin: '1px' }} onClick={() => handleRestore(params.row.id)}>
                                <MdRestore />
                            </IconButton>
                        </Tooltip>
                    );
                }
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Tooltip title="Update">
                            <IconButton aria-label="Update" className="action-button" onClick={() => handleEdit(params.row.id)} color="primary" style={{ margin: '1px' }}>
                                <FaEdit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton aria-label="delete" color="primary" style={{ margin: '1px' }} className='action-button'>
                                <MdDelete onClick={() => handleDelete1(params.row.id)} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={params.row.status ? 'Inactive' : 'Active'}>
                            <Switch
                                key={params.row.id}
                                checked={params.row.status}
                                size="xs"
                                className='switch-class'
                                onChange={async () => {
                                    const confirmToggle = await Swal.fire({
                                        title: 'Are you sure?',
                                        text: 'Do you want to change the active status?',
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: "#48AD3B",
                                        cancelButtonColor: "#87888a",
                                        confirmButtonText: 'Yes, change it!'
                                    });

                                    if (confirmToggle.isConfirmed) {
                                        await getActive1(params.row.id, params.row.status);
                                        Swal.fire('Success!', 'Active status changed successfully.', 'success');
                                    }
                                }}
                                style={{ margin: '1px' }}
                            />
                        </Tooltip>
                    </div>
                );
            },
        },
    ];


    const handleSelectAllRows = (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedRows(rows.map((row) => row.id));
        } else {
            setSelectedRows([]);
        }
    };


    const handleCheckboxChange = (id) => {
        setSelectedRows((prevSelectedRows) => {
            if (prevSelectedRows.includes(id)) {
                return prevSelectedRows.filter((rowId) => rowId !== id);
            } else {
                return [...prevSelectedRows, id];
            }
        });
    };

    // const handleSearch = (event) => {
    //     const query = event.target.value.trim();
    //     setSearchQuery(query);

    //     if (query) {
    //         const filtered = rows.filter((row) => {
    //             return Object.values(row).some((value) =>
    //                 String(value).toLowerCase().includes(query.toLowerCase())
    //             );
    //         });
    //         setFilteredRows(filtered);
    //     } else {
    //         setFilteredRows(rows);
    //     }
    // };
    const handleSearch = (event) => {
        const query = event.target.value.trim();
        setSearchQuery(query);

        if (query) {
            // Determine the filter based on the statusFilter
            const filtered = rows
                .filter((row) => {
                    if (statusFilter === "all") {
                        return row.deleted_at === 0;
                    } else if (statusFilter === "deleted") {
                        return row.deleted_at === 1;
                    }
                    return false;
                })
                .filter((row) => {
                    return Object.values(row).some((value) =>
                        String(value).toLowerCase().includes(query.toLowerCase())
                    );
                });
            setFilteredRows(filtered);
        } else {
            // Apply the current status filter when the search query is cleared
            if (statusFilter === "all") {
                setFilteredRows(rows.filter((row) => row.deleted_at === 0));
            } else if (statusFilter === "deleted") {
                setFilteredRows(rows.filter((row) => row.deleted_at === 1));
            }
        }
    };


    const handlesearchCancel = () => {
        setSearchQuery('');
        setFilteredRows([]);
    };



    const handleActionFilterChange = (event) => {
        const filterValue = event.target.value;
        setActionFilter(filterValue);
        setSelectedRows([]);
        applyFilter(rows, filterValue);
    };

    const applyFilter = (data, filterValue) => {
        console.log("Applying filter:", filterValue);
        let filteredData;
        switch (filterValue) {
            case "active":
                filteredData = data.filter((row) => row.status === 1 && row.deleted_at === 0);
                break;
            case "inactive":
                filteredData = data.filter((row) => row.status === 0 && row.deleted_at === 0);
                break;
            case "deleted":
                filteredData = data.filter((row) => row.deleted_at === 1);
                break;
            default: // "all" case
                filteredData = data.filter((row) => row.deleted_at !== 1); // Exclude deleted items
        }
        setFilteredRows(filteredData.map((row, index) => ({ ...row, "Sr No": index + 1 })));
        console.log("Filtered Rows:", filteredData);
    };

    const handleStatusFilterChange = (event) => {
        const filterValue = event.target.value;
        console.log("Filter Changed:", filterValue);
        setStatusFilter(filterValue);
        applyFilter(rows, filterValue);
    };


    const getActive1 = async (id, currentStatus) => {

        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            const response = await Authapi.postdynamicstatus(id, newStatus);
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
                if (ids.length > 0) {
                    const promises = ids.map(id => Authapi.postdynamicstatus(id, newStatus));
                    await Promise.all(promises);

                    setActiveStates(prevStates => {
                        const newStates = { ...prevStates };
                        ids.forEach(id => {
                            newStates[id] = false;
                        });
                        return newStates;
                    });

                    fetchData();
                    Swal.fire('Success!', 'Selected items are now inactive.', 'success');
                } else {
                    Swal.fire('Info', 'All selected items are already inactive.', 'info');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to update status', 'error');
            }
        }
    };

    // multi page active data 
    const getActive = async (ids) => {
        if (selectedRows.length === 0) {
            Swal.fire('Warning', 'Please select at least one item to Active.', 'warning');
            return;
        }
        if (Array.isArray(ids) && ids.length > 0) {
            const newStatus = 1;
            try {
                // const idsToActivate = ids.filter(id => activeStates[id] !== true);
                if (ids.length > 0) {
                    const promises = ids.map(id => Authapi.postdynamicstatus(id, newStatus));
                    await Promise.all(promises);

                    setActiveStates(prevStates => {
                        const newStates = { ...prevStates };
                        ids.forEach(id => {
                            newStates[id] = true;
                        });
                        return newStates;
                    });

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
    // multi Delete Data 
    const handleDelete = async (ids) => {
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
            confirmButtonColor: "#48AD3B",
            cancelButtonColor: "#87888a",
            confirmButtonText: 'Yes, mark them!',
        });

        if (confirmDelete.isConfirmed) {
            try {
                const promises = ids.map(id => Authapi.postdynamicDeleteData(id));
                await Promise.all(promises);

                Swal.fire('Success!', 'Selected items marked as deleted.', 'success');
                fetchData();
            } catch (error) {
                Swal.fire('Error!', error.response?.data?.message || error.message || 'Failed to delete items', 'error');
            }
        }
    };


    const handleRestore = async (id) => {
        try {
            const response = await Authapi.restorePostDeletedData(id);
            if (response) {
                Swal.fire("Success!", "Item restored successfully.", "success");
                setStatusFilter("all");
                fetchData();
            } else {
                throw new Error(response?.message || "Failed to restore item");
            }
        } catch (error) {
            Swal.fire(
                "Error!",
                error.response?.data?.message ||
                error.message ||
                "Failed to restore item",
                "error"
            );
        }
    };

    const handleEdit = async (id) => {
        navigate(`/post-edit/${id}`, { state: { post_title } });
    }
    const handleDelete1 = async (id) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "This will mark the item as deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#48AD3B",
            cancelButtonColor: "#87888a",
            confirmButtonText: 'Yes, mark it!'
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await Authapi.postdynamicDeleteData(id);
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
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection);
    };

    const handleAddNavigate = () => {
        navigate('/dynamic-form'); // Navigate to the /page route
    };

    const paginationModel = { page: 0, pageSize: 10 };
    return (
        <>
            <Expired />
            <div className="col-md-12">
                <div className="row " style={{ marginLeft: '20%', width: '80%', marginBottom: '20px', marginTop: '1%' }}>
                    <div className="card-header col-6 post-section">
                        <h5 className="title">{post_title}</h5>
                        {/* <IconButton className="post-add-btn" aria-label="add" color="primary" state={{ post_title }} onClick={handleAddNavigate}>
                            <MdAdd />
                        </IconButton> */}
                        <Link className="post-add-btn " title={`Add ${post_title}`} id="listing" to="/post-form" state={{ post_title }}>
                            <MdAdd />
                        </Link>
                    </div>

                    {/* <div className="card-header col-3">
                        <FormControl fullWidth>
                            <InputLabel>Action Filter</InputLabel>
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
                    </div> */}
                    <div className="card-header col-3">
                        <FormControl fullWidth>
                            <InputLabel>Status Filter</InputLabel>
                            <Select
                                className="filter_dropdown_of_main_page"
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                label="Status Filter"
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                                <MenuItem value="deleted">Deleted</MenuItem>
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
                    {/* <div className="card-body">
                        <Container>
                            <div style={{ overflowX: 'auto' }}> */}
                    <div className="card-body" style={{ height: 'calc(115vh - 200px)', width: '80%' }}>
                        <Container style={{ height: '100%' }}>
                            <div style={{ width: '100%', marginBottom: "45px" }}>

                                <div style={{ width: '100%', height: '500px', overflowY: 'hidden' }}>
                                    <DataGrid
                                        rows={filteredRows}
                                        columns={dynamicColumns}
                                        initialState={{ pagination: { paginationModel } }}
                                        pageSizeOptions={[5, 10, 20, { value: rows.length, label: 'All' }]}
                                        loading={loading}
                                        autoHeight={false}
                                        onPageChange={(newPage) => setPage(newPage)}
                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                        sx={{
                                            height: '100%',
                                            overflow: 'hidden',
                                            '& .MuiDataGrid-columnHeaders': {
                                                backgroundColor: '#113b4f',
                                                color: 'white',
                                            },
                                            '& .MuiDataGrid-cell': {
                                                padding: '10px',
                                                borderBottom: '1px solid #e0e0e0',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            },
                                            '& .MuiDataGrid-row:hover': {
                                                backgroundColor: '#f5f5f5',
                                            },
                                            // '& .MuiDataGrid-footerContainer': {
                                            //     backgroundColor: '#2c9dd4',
                                            //     color: 'white',
                                            // },
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
                                    <div className="card-header col-3 action-filter-div">
                                        <FormControl
                                            fullWidth
                                            sx={{
                                                maxWidth: "100%",
                                                marginTop: "-60px",
                                                marginBottom: "46px",
                                            }}
                                        >
                                            <InputLabel>Action Filter</InputLabel>
                                            <Select
                                                value={actionFilter}
                                                className='filter_dropdown_of_main_page'
                                                onChange={handleActionFilterChange}
                                                label="Action Filter"
                                            >
                                                <MenuItem value="all" disabled>All</MenuItem>
                                                <MenuItem value="active" onClick={() => getActive(selectedRows)}>Active</MenuItem>
                                                <MenuItem value="inactive" onClick={() => getInactive(selectedRows)}>Inactive</MenuItem>
                                                <MenuItem value="deleted" onClick={() => handleDelete(selectedRows)}>Deleted</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostDynamicList;

