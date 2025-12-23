import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MdDelete, MdVisibility, MdRestore } from "react-icons/md";
import { FaRegEye, FaEyeSlash, FaTimes } from "react-icons/fa";

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
    // Remove localStorage check
    setStatusFilter("all");
    fetchData();
    setSelectedRows([]); // Clear selected rows when data is fetched
  }, []);

  useEffect(() => {
    setSelectedRows([]); // Clear selected rows when statusFilter changes
  }, [statusFilter]);

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

        // Apply the current status filter
        let filtered;
        if (statusFilter === "all") {
          filtered = formattedData.filter((row) => row.deleted_at === 0);
        } else if (statusFilter === "deleted") {
          filtered = formattedData.filter((row) => row.deleted_at === 1);
        }

        // Recalculate sr_no for filtered rows
        const updatedFilteredRows = filtered.map((row, index) => ({
          ...row,
          sr_no: index + 1,
        }));

        setFilteredRows(updatedFilteredRows);
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
    // if (statusFilter !== "deleted") {
    //   Swal.fire(
    //     "Warning",
    //     "You can only delete items in the 'Deleted' state.",
    //     "warning"
    //   );
    //   return;
    // }

    // if (selectedRows.length === 0) {
    //   Swal.fire(
    //     "Warning",
    //     "Please select at least one item to delete.",
    //     "warning"
    //   );
    //   return;
    // }

    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This will mark the selected items as deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#48AD3B",
      cancelButtonColor: "#87888a",
      confirmButtonText: "Yes, mark them!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const promises = ids.map((id) => Authapi.contactdelete(id));
        await Promise.all(promises);
        Swal.fire("Success!", "Selected items marked as deleted.", "success");
        fetchData(); // Re-fetch to apply the "deleted" filter
        setSelectedRows([]); // Clear selected rows after action
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

    // Remove localStorage set
    // localStorage.setItem("statusFilter", filterValue);

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

    if (statusFilter === "deleted") {
      if (filterValue === "deleted") {
        handleDelete(selectedRows);
      } else if (filterValue === "restore") {
        handleMultiRestore();
      }
    } else {
      setSelectedRows([]);
    }
  };

  const handleRestore = async (ids) => {
    if (!Array.isArray(ids)) {
      ids = [ids]; // Ensure ids is an array
    }

    if (statusFilter !== "deleted") {
      Swal.fire(
        "Warning",
        "You can only restore items in the 'Deleted' state.",
        "warning"
      );
      return;
    }

    if (ids.length === 0) {

      Swal.fire(
        "Warning",
        "Please select at least one item to restore.",
        "warning"
      );
      return;
    }

    try {
      const promises = ids.map((id) => Authapi.restoreContactDeletedData(id));
      const results = await Promise.all(promises);

      if (results.every(result => result.status)) {
        Swal.fire("Success!", "Selected items restored successfully.", "success");
        fetchData(); // Re-fetch to apply the "deleted" filter
      } else {
        Swal.fire(
          "Error!",
          "Some items could not be restored.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        error.response?.data?.message ||
        error.message ||
        "Failed to restore items",
        "error"
      );
    }
  };

  const handleMultiRestore = async () => {
    // Filter selected rows to include only those currently displayed and eligible for restoration
    const eligibleForRestore = selectedRows.filter((id) =>
      filteredRows.some((row) => row.id === id && row.deleted_at === 1)
    );

    if (eligibleForRestore.length === 0) {
      Swal.fire(
        "Warning",
        "Please select at least one item to restore.",
        "warning"
      );
      return;
    }

    const confirmRestore = await Swal.fire({
      title: "Are you sure?",
      text: "This will restore the selected items!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#48AD3B",
      cancelButtonColor: "#87888a",
      confirmButtonText: "Yes, restore them!",
    });

    if (confirmRestore.isConfirmed) {
      try {
        const promises = eligibleForRestore.map((id) => Authapi.restoreContactDeletedData(id));
        await Promise.all(promises);
        Swal.fire("Success!", "Selected items have been restored.", "success");
        fetchData(); // Re-fetch to apply the "deleted" filter
        setSelectedRows([]); // Clear selected rows after action
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message ||
          error.message ||
          "Failed to restore items",
          "error"
        );
      }
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
          className="action-checkbox"
          checked={rows.length > 0 && selectedRows.length === rows.length}
          onChange={() => handleSelectAllRows()}
        />
      ),
      renderCell: (params) => (
        <input
          type="checkbox"
          className="action-checkbox"
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
        <div className="row contact-listing-container">
          <div className="card-header col-6">
            <h5 className="title contact-listing-title">Contact Us</h5>
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

          <div className="card-body table-card-body contact-listing-table-body">
            <Container className="table-container contact-listing-table-container">
              <div className="contact-listing-table-wrapper">
                <div className="contact-listing-table-inner">
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
                  <div className="card-header col-3 action-filter-div">

                    <FormControl
                      fullWidth
                      className="contact-listing-action-filter"
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
                        {statusFilter === "deleted" ? (
                          <MenuItem
                            value="restore"
                            onClick={handleMultiRestore}
                          >
                            Restore
                          </MenuItem>
                        ) : (
                          <MenuItem
                            value="delete"
                            onClick={() => handleDelete(selectedRows)}
                          >
                            Delete
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </div>

                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle className="contact-listing-dialog-title">
          Contact Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            className="contact-listing-dialog-close"
          >
            <FaTimes />
          </IconButton>
        </DialogTitle>
        <DialogContent className="contact-listing-dialog-content">
          <div>
            <table className="popuptable contact-listing-popup-table">
              <tbody>
                <tr>
                  <td className="contact-listing-popup-cell-right">
                    <b>Name</b>
                  </td>
                  <td className="contact-listing-popup-cell-center">:</td>
                  <td className="contact-listing-popup-cell-left">
                    {selectedTimeEntry?.name}
                  </td>
                </tr>
                <tr>
                  <td className="contact-listing-popup-cell-right">
                    <b>Email</b>
                  </td>
                  <td className="contact-listing-popup-cell-center">:</td>
                  <td className="contact-listing-popup-cell-left">
                    {selectedTimeEntry?.email}
                  </td>
                </tr>
                <tr>
                  <td className="contact-listing-popup-cell-right">
                    <b>Contact Number</b>
                  </td>
                  <td className="contact-listing-popup-cell-center">:</td>
                  <td className="contact-listing-popup-cell-left">
                    {selectedTimeEntry?.contact_number}
                  </td>
                </tr>
                <tr>
                  <td className="contact-listing-popup-cell-right">
                    <b>Description</b>
                  </td>
                  <td className="contact-listing-popup-cell-center">:</td>
                  <td className="contact-listing-popup-cell-left">
                    <>
                      {isReasonExpanded ||
                        selectedTimeEntry?.description.length <= 100
                        ? selectedTimeEntry?.description
                        : `${selectedTimeEntry?.description.substring(
                          0,
                          100
                        )}...`}
                      {selectedTimeEntry?.description.length > 100 && (
                        <span
                          onClick={() => setIsReasonExpanded(!isReasonExpanded)}
                          className="contact-listing-read-more"
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

