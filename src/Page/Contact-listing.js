import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MdDelete, MdVisibility, MdRestore } from "react-icons/md";
import {
  Container,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Authapi from "../Authapi";
import Expired from "../Login/ExpiredToken";
import "../Custom.css";
import { Link } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';

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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTimeEntry, setSelectedTimeEntry] = useState(null);
  const [isReasonExpanded, setIsReasonExpanded] = useState(false);
  const [actionFilter, setActionFilter] = useState("all");

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
          deleted_at: item.deleted_at,
        }));
        setRows(formattedData);
        const initialFilteredRows = formattedData.filter((row) => row.deleted_at === 0).map((row, index) => ({
          ...row,
          sr_no: index + 1,
        }));
        setFilteredRows(initialFilteredRows);
        // setFilteredRows(formattedData.filter((row) => row.deleted_at === 0));
      } else {
        console.error("Unexpected response format", response.results);
      }
    } catch (error) {
      console.error("Failed to fetch navbar items", error);
      Swal.fire("Error", "Failed to load navbar items.", "error");
    } finally {
      setLoading(false);
    }
  };
  // ... existing code ...

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

// ... existing code ...

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
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
      title: "Are you sure?",
      text: "This will mark the selected items as deleted!",
      icon: "warning",
      showCancelButton: true,
      // confirmButtonColor: "#d33",
      // cancelButtonColor: "#3085d6",
      confirmButtonColor: "#48AD3B",
      cancelButtonColor: "#87888a",
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
      confirmButtonColor: "#48AD3B",
      cancelButtonColor: "#87888a",
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

  const handleView = (row) => {
    setSelectedTimeEntry(row);
    setOpenDialog(true);
  };

  const handleStatusFilterChange = (event) => {
    const filterValue = event.target.value;
    setStatusFilter(filterValue);

    let filtered;
    if (filterValue === "all") {
      filtered = rows.filter((row) => row.deleted_at === 0);
    } else if (filterValue === "deleted") {
      filtered = rows.filter((row) => row.deleted_at === 1);
    }

    // Recalculate sr_no for filtered rows
    const updatedFilteredRows = filtered.map((row, index) => ({
      ...row,
      sr_no: index + 1,
    }));

    setFilteredRows(updatedFilteredRows);
  };

  const handleActionFilterChange = (event) => {
    const filterValue = event.target.value;
    setActionFilter(filterValue);
    setSelectedRows([]);
    setFilteredRows(rows.filter((row) => row.deleted_at === 0));
  };

  const handleRestore = async (id) => {
    try {
      const response = await Authapi.restoreContactDeletedData(id);
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
    // { field: "description", headerName: "Description", width: 90, flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      flex: 1,
      renderCell: (params) => (
        <strong onClick={(e) => e.stopPropagation()}>
          <Tooltip title="View">
            <IconButton
              aria-label="view"
              color="primary"
              onClick={() => handleView(params.row)}
              className="action-button"
            >
              <MdVisibility />
            </IconButton>
          </Tooltip>
          {statusFilter === "deleted" ? (
            <Tooltip title="Restore">
              <IconButton
                aria-label="restore"
                color="primary"
                onClick={() => handleRestore(params.row.id)}
                className="action-button"
              >
                <MdRestore />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Delete">
              <IconButton
                aria-label="delete"
                color="primary"
                className="action-button"
              >
                <MdDelete onClick={() => handleDelete1(params.row.id)} />
              </IconButton>
            </Tooltip>
          )}
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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
          <div className="card-header col-6" >
            <h5 className="title ">Contact Us</h5>
          </div>
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
        

          <div
            className="card-body"
            style={{ height: "calc(115vh - 200px)", width: "80%" }}
          >
            <Container style={{ height: "100%" }}>
              <div style={{ width: "100%", marginBottom: "45px" }}>
                <div
                  style={{ width: "100%", height: "500px", overflow: "hidden" }}
                >
                  <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
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
                        backgroundColor: "#113b4f",
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
                  <FormControl
                    fullWidth
                    sx={{
                      width: "20%",
                      marginTop: "-44px",
                      marginLeft: "10px",
                    }}
                  >
                    <InputLabel>Action Filter</InputLabel>
                    <Select
                      className="filter_dropdown_of_main_page"
                      value={actionFilter}
                      onChange={handleActionFilterChange}
                      label="Action Filter"
                    >
                      <MenuItem value="all" disabled>
                        All
                      </MenuItem>
                      <MenuItem
                        value="delete"
                        onClick={() => handleDelete(selectedRows)}
                      >
                        Delete
                      </MenuItem>
                      {/* Add more action items as needed */}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle
          sx={{
            backgroundColor: "#113b4f",
            color: "white",
            textAlign: "center",
            padding: "6px",
          }}
        >
          Contact Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            {/* Add a close icon here */}
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: "10px" }}>
          <div>
            <table
              className="popuptable"
              style={{
                width: "550px",
                borderCollapse: "collapse",
                border: "0px solid #000",
              }}
            >
              <tbody>
                <tr>
                  <td style={{ textAlign: "right" }}>
                    <b>Name</b>
                  </td>
                  <td style={{ padding: "8px", textAlign: "center" }}>:</td>
                  <td style={{ textAlign: "left" }}>
                    {selectedTimeEntry?.name}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right" }}>
                    <b>Email</b>
                  </td>
                  <td style={{ padding: "8px", textAlign: "center" }}>:</td>
                  <td style={{ textAlign: "left" }}>
                    {selectedTimeEntry?.email}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right" }}>
                    <b>Contact Number</b>
                  </td>
                  <td style={{ padding: "8px", textAlign: "center" }}>:</td>
                  <td style={{ textAlign: "left" }}>
                    {selectedTimeEntry?.contact_number}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "right" }}>
                    <b>Description</b>
                  </td>
                  <td style={{ padding: "8px", textAlign: "center" }}>:</td>
                  <td style={{ textAlign: "left" }}>
                    <>
                      {isReasonExpanded ||
                      selectedTimeEntry?.description.length <= 50
                        ? selectedTimeEntry?.description
                        : `${selectedTimeEntry?.description.substring(
                            0,
                            50
                          )}...`}
                      {selectedTimeEntry?.description.length > 50 && (
                        <span
                          onClick={() => setIsReasonExpanded(!isReasonExpanded)}
                          style={{
                            color: "#1b6e95",
                            cursor: "pointer",
                            marginLeft: "5px",
                            display: "inline-block",
                          }}
                        >
                          {isReasonExpanded ? "Read Less" : "Read More"}
                        </span>
                      )}
                    </>
                  </td>
                </tr>
                {/* <tr>
                                    <td style={{ padding: "8px", textAlign: "center" }}><b>Date Range</b></td>
                                    <td style={{ padding: "8px", textAlign: "center" }}>:</td>
                                    <td style={{ padding: "8px", textAlign: "center" }}>{selectedTimeEntry?.dateRange}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "8px", textAlign: "center" }}><b>No Of Days</b></td>
                                    <td style={{ padding: "8px", textAlign: "center" }}>:</td>
                                    <td style={{ padding: "8px", textAlign: "center" }}>{selectedTimeEntry?.noOfDays}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "8px", textAlign: "center" }}><b>Status</b></td>
                                    <td style={{ padding: "8px", textAlign: "center" }}>:</td>
                                    <td style={{ padding: "8px", textAlign: "center" }}>{selectedTimeEntry?.status}</td>
                                </tr> */}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Contact;

