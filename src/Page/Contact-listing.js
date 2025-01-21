import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { MdDelete, MdVisibility } from "react-icons/md";
import { Container, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Authapi from '../Authapi';
import Expired from '../Login/ExpiredToken';
import '../Custom.css'
import { Link } from 'react-router-dom';


const Contact = () => {
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    // const [activeStates, setActiveStates] = useState(
    //     Array.isArray(rows) ? rows.reduce((acc, row) => ({ ...acc, [row.id]: false }), {}) : {}
    // );
    // const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await Authapi.contactListData();
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
                Swal.fire("Error", "Invalid data format received.", "error");
            }
        } catch (error) {
            console.error("Failed to fetch navbar items", error);
            Swal.fire("Error", "Failed to load navbar items.", "error");
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

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection);
    };

    // multi Delete Data
    const handleDelete = async (ids) => {
        if (Array.isArray(ids)) {
            ids = [ids];
        }

        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "This will mark the selected items as deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, mark them!",
        });

        if (confirmDelete.isConfirmed) {
            try {
                const promises = ids.map((id) => Authapi.contactdelete(id));
                await Promise.all(promises);
                // console.log(ids);

                Swal.fire("Success!", "Selected items marked as deleted.", "success");
                fetchData();
            } catch (error) {
                Swal.fire(
                    "Error!",
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to delete items",
                    "error"
                );
            }
        }
    };

    // Single Delete Data
    const handleDelete1 = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "This will mark the item as deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, mark it!",
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await Authapi.contactdelete(id);
                if (response) {
                    Swal.fire("Success!", "Item marked as deleted.", "success");
                    fetchData();
                } else {
                    throw new Error(response?.message || "Failed to delete item");
                }
            } catch (error) {
                Swal.fire(
                    "Error!",
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to delete item",
                    "error"
                );
            }
        }
    };

    // const handleView = async (row) => {
    //     Swal.fire({
    //         title: `Details`,
    //         html: `
    //           <p><strong>Name:</strong> ${row.name}</p>
    //           <p><strong>Email:</strong> ${row.email}</p>
    //           <p><strong>Contact Number:</strong> ${row.contact_number}</p>
    //           <p><strong>Description:</strong> ${row.description}</p>
    //         `,
    //         // icon: 'info',
    //         confirmButtonText: 'Close',
    //       });
    // };

    const handleView = async (row) => {
        Swal.fire({
          title: `Details`,
          html: `
            <div class="container">
              <div class="row text-center mb-3">
              </div>
              <div class="row">
                <div class="col-sm-6 contact-label"><strong>Name:</strong></div>
                <div class="col-sm-6 contact-val">${row.name}</div>
              </div>
              <div class="row">
                <div class="col-sm-6  contact-label"><strong>Email:</strong></div>
                <div class="col-sm-6 contact-val">${row.email}</div>
              </div>
              <div class="row">
                <div class="col-sm-6  contact-label"><strong>Contact Number:</strong></div>
                <div class="col-sm-6 contact-val">${row.contact_number}</div>
              </div>
              <div class="row">
                <div class="col-sm-6  contact-label"><strong>Description:</strong></div>
                <div class="col-sm-6  contact-val">${row.description}</div>
              </div>
            </div>
          `,
          confirmButtonText: 'Close',
        });
      };
      

    const handleStatusFilterChange = (event) => {
        const filterValue = event.target.value;
        setStatusFilter(filterValue);

        if (filterValue === "all") {
            setFilteredRows(rows);
        } else if (filterValue === "active") {
            setFilteredRows(rows.filter((row) => row.status === 1));
        } else if (filterValue === "inactive") {
            setFilteredRows(rows.filter((row) => row.status === 0));
        } else if (filterValue === "deleted") {
            setFilteredRows(rows.filter((row) => row.status === -1)); // Assuming -1 represents deleted status
        }
    };

    const columns = [
        {
            field: "checkboxSelection",
            headerName: "Select",
            width: 100,
            renderHeader: () => (
                <input
                    type="checkbox"
                    // checked={selectedRows.length === rows.length}
                    checked={rows.length > 0 && selectedRows.length === rows.length}
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
        { field: "sr_no", headerName: "Sr.No", width: 90, flex: 1 },
        { field: "name", headerName: "Name", width: 90, flex: 1 },
        { field: "email", headerName: "Email", width: 90, flex: 1 },
        {
            field: "contact_number",
            headerName: "Contact Number",
            width: 90,
            flex: 1,
        },
        { field: "description", headerName: "Description", width: 90, flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            flex: 1,
            renderCell: (params) => (
                <strong onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="View">
                        <IconButton aria-label="view" color="primary" onClick={() => handleView(params.row)}>
                            <MdVisibility />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete" color="primary">
                            <MdDelete onClick={() => handleDelete1(params.row.id)} />
                        </IconButton>
                    </Tooltip>
                </strong>
            ),
        },
    ];

    const handleCheckboxChange = (id) => {
        const newSelectedRows = selectedRows.includes(id)
            ? selectedRows.filter((rowId) => rowId !== id)
            : [...selectedRows, id];

        setSelectedRows(newSelectedRows);
    };

    const handleSelectAllRows = () => {
        if (selectedRows.length === rows.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(rows.map((row) => row.id));
        }
    };

    // pagination perpage
    const paginationModel = { page: 0, pageSize: 10 };
    return (
        <>
            <Expired />
            <div className="col-md-12">
                <div
                    className="row "
                    style={{
                        marginLeft: "20%",
                        width: "80%",
                        marginBottom: "20px",
                        marginTop: "1%",
                    }}
                >
                    <div className="card-header col-6">
                        <h5 className="title ">Contact Us</h5>
                    </div>
                    <div className="card-header col-3">
                        <FormControl fullWidth>
                            <InputLabel>Status Filter</InputLabel>
                            <Select
                                className='filter_dropdown_of_main_page'
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                label="Status Filter"
                            >
                                <MenuItem value="all" disabled>
                                    All
                                </MenuItem>
                                <MenuItem
                                    value="deleted"
                                    onClick={() => handleDelete(selectedRows)}
                                >
                                    Deleted
                                </MenuItem>
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

                    <div
                        className="card-body"
                        style={{ height: "calc(115vh - 200px)", width: "80%" }}
                    >
                        <Container style={{ height: "100%" }}>
                            <div style={{ width: "100%", marginBottom: "45px" }}>
                                <div
                                    style={{ width: "100%", height: "500px", overflowY: "auto" }}
                                >
                                    <DataGrid
                                        rows={searchQuery ? filteredRows : rows}
                                        columns={columns}
                                        initialState={{ pagination: { paginationModel } }}
                                        // pageSizeOptions={[5, 10, 20]}
                                        pageSizeOptions={[
                                            5,
                                            10,
                                            20,
                                            { value: rows.length, label: "All" },
                                        ]}
                                        loading={loading}
                                        autoHeight={false}
                                        onPageChange={(newPage) => setPage(newPage)}
                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                        sx={{
                                            "& .MuiDataGrid-columnHeaders": {
                                                backgroundColor: "#2c9dd4",
                                                color: "white",
                                            },
                                        }}
                                        selectionModel={selectedRows}
                                        onSelectionModelChange={handleSelectionChange}
                                        onCellClick={(params, event) => {
                                            if (event.target.closest(".MuiCheckbox-root")) {
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
