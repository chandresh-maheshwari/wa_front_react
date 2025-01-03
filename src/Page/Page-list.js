import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Container, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import Authapi from '../Authapi';
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
    const [statusFilter, setStatusFilter] = useState('all');
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await Authapi.pageListData();
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
                const initialActiveStates = formattedData.reduce((acc, row) => ({
                    ...acc,
                    [row.id]: row.status === 1,
                }), {});
                setActiveStates(initialActiveStates);

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

    // multi delete data 
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
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, mark them!',
        });

        if (confirmDelete.isConfirmed) {
            try {
                const promises = ids.map(id => Authapi.pageDeleteData(id));
                await Promise.all(promises);
                // console.log(ids);

                Swal.fire('Success!', 'Selected items marked as deleted.', 'success');
                fetchData();
            } catch (error) {
                Swal.fire('Error!', error.response?.data?.message || error.message || 'Failed to delete items', 'error');
            }
        }
    };

    // single deleted data
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

    // single page active
    const getSingleActive = async (id, currentStatus) => {
        // console.log(currentStatus)
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            // console.log(newStatus)
            const response = await Authapi.pagestatus(id, newStatus);
            if (response.status === true) {

                setActiveStates((prevStates) => ({
                    ...prevStates,
                    [id]: newStatus === 1,
                }));
                fetchData()
            }
            else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Failed to update status ', 'error');
        }
    };

    // multi page inactive data 
    const getInactive = async (ids) => {
        if (selectedRows.length === 0) {
            Swal.fire('Warning', 'Please select at least one item to delete.', 'warning');
            return;
        }
        if (Array.isArray(ids) && ids.length > 0) {
            const newStatus = 0;
            try {
                // const idssToDeactivate = ids.filter(id => activeStates[id] !== false);
                if (ids.length > 0) {
                    const promises = ids.map(id => Authapi.pagestatus(id, newStatus));
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
            Swal.fire('Warning', 'Please select at least one item to delete.', 'warning');
            return;
        }
        if (Array.isArray(ids) && ids.length > 0) {
            const newStatus = 1;
            try {

                // const idsToActivate = ids.filter(id => activeStates[id] !== true);
                if (ids.length > 0) {
                    const promises = ids.map(id => Authapi.pagestatus(id, newStatus));
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

    //  single inner page  active
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


    const handleStatusFilterChange = (event) => {
        const filterValue = event.target.value;
        setStatusFilter(filterValue);

        if (filterValue === 'all') {
            setFilteredRows(rows);
        } else if (filterValue === 'page active') {
            setFilteredRows(rows.filter(row => row.status === 1 && row.type === 'page'));
            setSelectedRows([]);
        } else if (filterValue === 'page inactive') {
            setFilteredRows(rows.filter(row => row.status === 0 && row.type === 'page'));
            setSelectedRows([]);
        } else if (filterValue === 'deleted') {
            setFilteredRows(rows.filter(row => row.status === -1));
            setSelectedRows([]);
        } else if (filterValue === 'inner page active') {
            setFilteredRows(rows.filter(row => row.status === 1 && row.type === 'inner page'));
            setSelectedRows([]);
        } else if (filterValue === 'inner page inactive') {
            setFilteredRows(rows.filter(row => row.status === 0 && row.type === 'inner page'));
            setSelectedRows([]);
        }
    };

    // inner Page Multi Active
    const getMultiActive = async (ids) => {
        if (selectedRows.length === 0) {
            Swal.fire('Warning', 'Please select at least one item to delete.', 'warning');
            return;
        }
        if (Array.isArray(ids) && ids.length > 0) {
            const newStatus = 1;
            try {
                // const idsToinnerActivate = ids.filter(id => activeStates[id] !== true);
                if (ids.length > 0) {
                    const promises = ids.map(id => Authapi.pageActive(id, newStatus));
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

    // multi in active data in inner page 
    const getmultiInactive = async (ids) => {
        if (selectedRows.length === 0) {
            Swal.fire('Warning', 'Please select at least one item to delete.', 'warning');
            return;
        }
        if (Array.isArray(ids) && ids.length > 0) {
            const newStatus = 0;
            try {
                //  const idsToDeactivate = ids.filter(id => activeStates[id] !== false);
                if (ids.length > 0) {
                    const promises = ids.map(id => Authapi.pageActive(id, newStatus));
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
    // const columns = [
    //     {
    //         field: 'checkboxSelection',
    //         headerName: 'Select',
    //         width: 100,
    //         renderHeader: () => (
    //             <input
    //                 type="checkbox"
    //                 checked={selectedRows.length === rows.length}
    //                 onChange={() => handleSelectAllRows()}
    //             />
    //         ),
    //         renderCell: (params) => (
    //             <input
    //                 type="checkbox"
    //                 checked={selectedRows.includes(params.row.id)}
    //                 onChange={() => handleCheckboxChange(params.row.id)}
    //             />
    //         ),
    //     },
    //     { field: 'sr_no', headerName: 'Sr.No', width: 90, flex: 1 },
    //     { field: 'page_name', headerName: 'Page Name', width: 150, flex: 1 },
    //     {
    //         field: 'image',
    //         headerName: 'Image',
    //         width: 250,
    //         flex: 1,
    //         renderCell: (params) => (
    //             <img
    //                 src={params.row.image_url}
    //                 alt="Page"
    //                 style={{ width: '50%', height: 'auto' }}
    //             />
    //         ),
    //     },
    //     { field: 'ordering', headerName: 'Ordering', width: 150, flex: 1 },

    //     {
    //         field: 'actions',
    //         headerName: 'Actions',
    //         width: 150,
    //         flex: 1,
    //         renderCell: (params) => (
    //             <strong onClick={(e) => e.stopPropagation()}>
    //                 <Tooltip title="Update">
    //                     <IconButton aria-label="Update" color='primary' className='Edit-list' >
    //                         <Link
    //                             to={`/Page-edit/${params.row.id}`}
    //                             id="edit"
    //                             className='m-3'
    //                         >
    //                             <FaEdit />
    //                         </Link>
    //                     </IconButton>
    //                 </Tooltip>
    //                 <Tooltip title="Delete">
    //                     <IconButton aria-label="delete" color='primary'>
    //                         <MdDelete onClick={() => handleDelete1(params.row.id)} />
    //                     </IconButton>
    //                 </Tooltip>
    //                 <Tooltip title=" Page Active">
    //                     {/* <> */}
    //                     <Switch
    //                         key={params.row.id}
    //                         checked={params.row.status}
    //                         size="xs"
    //                         onChange={() => getSingleActive(params.row.id, params.row.status)}
    //                     />
    //                     {/* </> */}

    //                 </Tooltip>
    //                 <Tooltip title=" Inner Page Active">
    //                     <Switch
    //                         key={params.row.id}
    //                         checked={params.row.page_status}
    //                         size="xs"
    //                         onChange={() => getActive1(params.row.id, params.row.page_status)}
    //                     />
    //                 </Tooltip>
    //             </strong>
    //         ),
    //     },
    // ];
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
        {
            field: 'sr_no',
            headerName: 'Sr.No',
            width: 90,
            flex: 1
        },
        {
            field: 'page_name',
            headerName: 'Page Name',
            width: 150,
            flex: 1,
            renderCell: (params) => params.row.page_name || '-'
        },
        {
            field: 'page_description',
            headerName: 'Page Description',
            width: 200,
            flex: 1,
            renderCell: (params) => params.row.page_description || '-'
        },
        {
            field: 'image',
            headerName: 'Image',
            width: 250,
            flex: 1,
            renderCell: (params) => {
                return params.row.image_url ? (
                    <img
                        src={params.row.image_url}
                        alt="Page"
                        style={{ width: '50%', height: 'auto' }}
                    />
                ) : (
                    <span>-</span>
                );
            }
        },
        {
            field: 'ordering',
            headerName: 'Ordering',
            width: 150,
            flex: 1,
            renderCell: (params) => params.row.ordering || '-'
        },

        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            flex: 1,
            renderCell: (params) => (
                <strong onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Update">
                        <IconButton aria-label="Update" color='primary' className='Edit-list'>
                            <Link
                                to={`/Page-edit/${params.row.id}`}
                                id="edit"
                                className='m-3'
                            >
                                <FaEdit />
                            </Link>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete" color='primary'>
                            <MdDelete onClick={() => handleDelete1(params.row.id)} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Page Active">
                        <Switch
                            key={params.row.id}
                            checked={params.row.status}
                            size="xs"
                            onChange={() => getSingleActive(params.row.id, params.row.status)}
                        />
                    </Tooltip>
                    <Tooltip title="Inner Page Active">
                        <Switch
                            key={params.row.id}
                            checked={params.row.page_status}
                            size="xs"
                            onChange={() => getActive1(params.row.id, params.row.page_status)}
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


    return (
        <>

            <Expired />
            <div className="col-md-12">
                <div className="row " style={{ marginLeft: "20%", width: "80%", marginBottom: "20px", marginTop: '7%' }}>

                    <div className="card-header col-6">
                        <h5 className="title ">Page</h5>
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
                                <MenuItem value="page active" onClick={() => getActive(selectedRows)}>Page Active</MenuItem>
                                <MenuItem value="page inactive" onClick={() => getInactive(selectedRows)}>Page Inactive</MenuItem>
                                <MenuItem value="deleted" onClick={() => handleDelete(selectedRows)}>Deleted</MenuItem>
                                <MenuItem value="inner page active" onClick={() => getMultiActive(selectedRows)}>Inner Page Active</MenuItem>
                                <MenuItem value="inner page inactive" onClick={() => getmultiInactive(selectedRows)}>Inner Page Inactive</MenuItem>
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
                            </div>

                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PageList;

