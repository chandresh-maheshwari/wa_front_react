import React, { useState, useEffect } from "react";

import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdAdd, MdRestore, MdDragIndicator } from "react-icons/md";
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
import { Link } from "react-router-dom";
import Authapi from "../Authapi";
import Switch from "@mui/material/Switch";
import Expired from "../Login/ExpiredToken";
import { useNavigate } from "react-router-dom";

const PageList = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeStates, setActiveStates] = useState(
    Array.isArray(rows)
      ? rows.reduce((acc, row) => ({ ...acc, [row.id]: false }), {})
      : {}
  );
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [draggedRowId, setDraggedRowId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedRows([]); // Clear selected rows when statusFilter changes
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      const response = await Authapi.pageListData();
      console.log("API Response:", response); // Log the API response

      if (Array.isArray(response.results)) {
        const formattedData = response.results.map((item, index) => ({
          id: item.id,
          sr_no: index + 1, // Ensure sr_no starts from 1
          status: item.status,
          page_status: item.page_status,
          page_name: item.page_name,
          // page_description: item.page_description,
          image_url: item.image_url,
          ordering: item.ordering,
          deleted_at: item.deleted_at,
        }));

        console.log("Formatted Data:", formattedData); // Log the formatted data

        formattedData.sort((a, b) => {
          if (a.ordering === b.ordering) {
            return a.id - b.id;
          }
          return (a.ordering || 0) - (b.ordering || 0);
        });

        setRows(formattedData); // Set all data, including deleted
        applyFilter(formattedData, statusFilter);
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

  const getFilteredData = (data, filterValue) => {
    switch (filterValue) {
      case "page active":
        return data.filter((row) => row.deleted_at === 0 && row.status === 1);
      case "page inactive":
        return data.filter((row) => row.deleted_at === 0 && row.status === 0);
      case "inner page active":
        return data.filter((row) => row.deleted_at === 0 && row.page_status === 1);
      case "inner page inactive":
        return data.filter((row) => row.deleted_at === 0 && row.page_status === 0);
      case "deleted":
        return data.filter((row) => row.deleted_at === 1);
      default:
        return data.filter((row) => row.deleted_at === 0);
    }
  };

  const applyFilter = (data, filterValue) => {
    console.log("Applying filter:", filterValue); // Log the filter being applied
    const filteredData = getFilteredData(data, filterValue)
      .sort((a, b) => {
        if (a.ordering === b.ordering) {
          return a.id - b.id;
        }
        return (a.ordering || 0) - (b.ordering || 0);
      })
      .map((row, index) => ({
        ...row,
        sr_no: index + 1, // Ensure sr_no starts from 1
      }));


  // const handleSearch = (event) => {
  //   const query = event.target.value.trim();
  //   setSearchQuery(query);

  //   if (query) {
  //     const filtered = rows.filter((row) => {
  //       return Object.values(row).some((value) =>
  //         String(value).toLowerCase().includes(query.toLowerCase())
  //       );
  //     });
  //     setFilteredRows(filtered);
  //   } else {
  //     setFilteredRows(rows);
  //   }
  // };
  const handleSearch = (event) => {
    const query = event.target.value.trim();
    setSearchQuery(query);

    if (query) {
      const baseData = getFilteredData(rows, statusFilter);
      const filtered = baseData
        .filter((row) =>
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(query.toLowerCase())
          )
        )
        .map((row, index) => ({
          ...row,
          sr_no: index + 1,
        }));
      setFilteredRows(filtered);
    } else {
      applyFilter(rows, statusFilter);
    }
  };
  // multi delete data
  // const handleDelete = async (ids) => {
  //   if (selectedRows.length === 0) {
  //     Swal.fire('Warning', 'Please select at least one item to delete.', 'warning');
  //     return;
  //   }

  //   if (selectedRows.length === 0) {
  //     Swal.fire(
  //       "Warning",
  //       "Please select at least one item to delete.",
  //       "warning"
  //     );
  //     return;
  //   }

  //   const confirmDelete = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "This will mark the selected items as deleted!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#48AD3B",
  //     cancelButtonColor: "#87888a",
  //     confirmButtonText: "Yes, mark them!",
  //   });

  //   if (confirmDelete.isConfirmed) {
  //     try {
  //       const promises = ids.map((id) => Authapi.pageDeleteData(id));
  //       await Promise.all(promises);
  //       Swal.fire("Success!", "Selected items marked as deleted.", "success");
  //       fetchData(); // Re-fetch to apply the "deleted" filter
  //       setSelectedRows([]); // Clear selected rows after action
  //     } catch (error) {
  //       Swal.fire(
  //         "Error!",
  //         error.response?.data?.message ||
  //         error.message ||
  //         "Failed to delete items",
  //         "error"
  //       );
  //     }
  //   }
  // };
 const handleDelete = async (ids, isPermanent = false) => {
    if (ids.length === 0) {
      Swal.fire("Warning", "Please select at least one item.", "warning");
      return;
    }

    const confirmDelete = await Swal.fire({
      title: isPermanent ? "Permanent Delete?" : "Soft Delete?",
      text: isPermanent
        ? "This will permanently delete selected items!"
        : "This will mark items as deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isPermanent
        ? "Yes, delete permanently!"
        : "Yes, delete!",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const promises = ids.map((id) =>
        Authapi.pageDeleteData(id, { isPermanent })
      );
      await Promise.all(promises);

      Swal.fire(
        "Success!",
        isPermanent ? "Items permanently deleted." : "Items soft deleted.",
        "success"
      );

      // After delete, keep status filter as "deleted" if permanent delete
      const newFilter = isPermanent ? "deleted" : statusFilter;
      applyFilter(rows, newFilter);
      setSelectedRows([]);
      fetchData(); // Refresh rows
      setStatusFilter(newFilter);
    } catch (error) {
      Swal.fire("Error", "Delete failed!", "error");
    }
  };
  // single restore data
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
      const promises = ids.map((id) => Authapi.restorePageDeletedData(id));
      const results = await Promise.all(promises);

      if (results.every(result => result.status)) {
        Swal.fire("Success!", "Selected items restored successfully.", "success");

        // Update the state directly instead of re-fetching
        const updatedRows = rows.map((row) => {
          if (ids.includes(row.id)) {
            return { ...row, deleted_at: 0 }; // Update the deleted_at status
          }
          return row;
        });

        setRows(updatedRows);
        applyFilter(updatedRows, statusFilter); // Reapply the current filter
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


  const handleEdit = async (id) => {
    navigate(`/Page-edit/${id}`);
  };
  // single deleted data
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
        const response = await Authapi.pageDeleteData(id);
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

  const paginationModel = { page: 0, pageSize: 10 };

  // single page active
  const getSingleActive = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await Authapi.pagestatus(id, newStatus);
      if (response.status === true) {
        // Update the rows state first
        const updatedRows = rows.map(row =>
          row.id === id ? { ...row, status: newStatus } : row
        );
        setRows(updatedRows);

        // Then apply the current filter to the updated data
        applyFilter(updatedRows, statusFilter);

        setActiveStates((prevStates) => ({
          ...prevStates,
          [id]: newStatus === 1,
        }));
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Failed to update status ", "error");
    }
  };

  // multi page inactive data
  const getInactive = async (ids) => {
    if (selectedRows.length === 0) {
      Swal.fire(
        "Warning",
        "Please select at least one item to Inactive.",
        "warning"
      );
      return;
    }
    if (Array.isArray(ids) && ids.length > 0) {
      const newStatus = 0;
      try {
        const promises = ids.map((id) => Authapi.pagestatus(id, newStatus));
        await Promise.all(promises);

        // Update the rows state first
        const updatedRows = rows.map(row =>
          ids.includes(row.id) ? { ...row, status: newStatus } : row
        );
        setRows(updatedRows);

        // Then apply the current filter to the updated data
        applyFilter(updatedRows, statusFilter);

        setActiveStates((prevStates) => {
          const newStates = { ...prevStates };
          ids.forEach((id) => {
            newStates[id] = false;
          });
          return newStates;
        });

        Swal.fire("Success!", "Selected items are now inactive.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to update status", "error");
      }
    }
  };

  // multi page active data
  const getActive = async (ids) => {
    if (selectedRows.length === 0) {
      Swal.fire(
        "Warning",
        "Please select at least one item to Active.",
        "warning"
      );
      return;
    }
    if (Array.isArray(ids) && ids.length > 0) {
      const newStatus = 1;
      try {
        const promises = ids.map((id) => Authapi.pagestatus(id, newStatus));
        await Promise.all(promises);

        // Update the rows state first
        const updatedRows = rows.map(row =>
          ids.includes(row.id) ? { ...row, status: newStatus } : row
        );
        setRows(updatedRows);

        // Then apply the current filter to the updated data
        applyFilter(updatedRows, statusFilter);

        setActiveStates((prevStates) => {
          const newStates = { ...prevStates };
          ids.forEach((id) => {
            newStates[id] = true;
          });
          return newStates;
        });

        Swal.fire("Success!", "Selected items are now active.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to update status", "error");
      }
    }
  };

  //  single inner page  active
  const getActive1 = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await Authapi.pageActive(id, newStatus);
      if (response) {
        // Update the rows state first
        const updatedRows = rows.map(row =>
          row.id === id ? { ...row, page_status: newStatus } : row
        );
        setRows(updatedRows);

        // Then apply the current filter to the updated data
        applyFilter(updatedRows, statusFilter);

        setActiveStates((prevStates) => ({
          ...prevStates,
          [id]: newStatus === 1,
        }));
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Failed to update status", "error");
    }
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

  // const fetchAndSortData = async () => {
  //   try {
  //     const response = await Authapi.pageListData();
  //     if (Array.isArray(response.results)) {
  //       // Sort data to have active items first
  //       const sortedData = response.results.sort((a, b) => b.status - a.status);
  //       setFilteredRows(sortedData);
  //       Swal.fire("Success!", "Data fetched and sorted successfully.", "success");
  //     } else {
  //       console.error("Unexpected response format", response.results);
  //       Swal.fire("Error", "Invalid data format received.", "error");
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch data", error);
  //     Swal.fire("Error", "Failed to load data.", "error");
  //   }
  // };

  // useEffect(() => {
  //   fetchAndSortData();
  // }, []);





  // inner Page Multi Active
  const getMultiActive = async (ids) => {
    if (selectedRows.length === 0) {
      Swal.fire(
        "Warning",
        "Please select at least one item to in inner page active.",
        "warning"
      );
      return;
    }
    if (Array.isArray(ids) && ids.length > 0) {

      const newStatus = 1;
      try {
        // const idsToinnerActivate = ids.filter(id => activeStates[id] !== true);
        if (ids.length > 0) {
          const promises = ids.map((id) => Authapi.pageActive(id, newStatus));
          await Promise.all(promises);

          setActiveStates((prevStates) => {
            const newStates = { ...prevStates };
            ids.forEach((id) => {
              newStates[id] = true;
            });
            return newStates;
          });

          fetchData();
          Swal.fire("Success!", "Selected items are now active.", "success");
        } else {
          Swal.fire("Info", "All selected items are already active.", "info");
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update status", "error");
      }
    }
  };

  // multi in active data in inner page
  const getmultiInactive = async (ids) => {
    if (selectedRows.length === 0) {
      Swal.fire(
        "Warning",
        "Please select at least one item to inner page inactive.",
        "warning"
      );
      return;
    }
    if (Array.isArray(ids) && ids.length > 0) {
      const newStatus = 0;
      try {
        //  const idsToDeactivate = ids.filter(id => activeStates[id] !== false);
        if (ids.length > 0) {
          const promises = ids.map((id) => Authapi.pageActive(id, newStatus));
          await Promise.all(promises);

          setActiveStates((prevStates) => {
            const newStates = { ...prevStates };
            ids.forEach((id) => {
              newStates[id] = false;
            });
            return newStates;
          });

          fetchData();
          Swal.fire("Success!", "Selected items are now inactive.", "success");
        } else {
          Swal.fire("Info", "All selected items are already inactive.", "info");
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update status", "error");
      }
    }
  };

  // Handle reordering (used by drag & drop)
  const handleRowReorder = async (newOrderedVisibleRows) => {
    const idToOrdering = new Map();
    newOrderedVisibleRows.forEach((row, index) => {
      idToOrdering.set(row.id, index + 1);
    });

    const updatedAllRows = rows.map((row) =>
      idToOrdering.has(row.id)
        ? { ...row, ordering: idToOrdering.get(row.id) }
        : row
    );

    setRows(updatedAllRows);
    applyFilter(updatedAllRows, statusFilter);

    const payload = Array.from(idToOrdering.entries()).map(
      ([id, ordering]) => ({ id, ordering })
    );

    try {
      await Authapi.pageReorder(payload);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Failed to save new ordering",
        "error"
      );
    }
  };

  // Reorder visible rows array (for drag & drop)
  const reorderVisibleRows = (list, sourceId, targetId) => {
    const updated = [...list];
    const sourceIndex = updated.findIndex((row) => row.id === sourceId);
    const targetIndex = updated.findIndex((row) => row.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) {
      return list;
    }

    const [movedRow] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, movedRow);

    return updated.map((row, index) => ({
      ...row,
      ordering: index + 1,
      sr_no: index + 1,
    }));
  };

  const handleDragStart = (event, rowId) => {
    if (statusFilter === "deleted") return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(rowId));
    setDraggedRowId(rowId);
  };

  const handleDragOver = (event, targetId) => {
    if (!draggedRowId || statusFilter === "deleted") {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect =
      draggedRowId === targetId ? "none" : "move";
  };

  const handleDragEnd = () => {
    setDraggedRowId(null);
  };

  const handleDrop = async (event, targetId) => {
    if (!draggedRowId || statusFilter === "deleted") {
      return;
    }
    event.preventDefault();
    if (draggedRowId === targetId) {
      setDraggedRowId(null);
      return;
    }

    const reorderedRows = reorderVisibleRows(
      filteredRows,
      draggedRowId,
      targetId
    );

    if (reorderedRows === filteredRows) {
      setDraggedRowId(null);
      return;
    }

    setFilteredRows(reorderedRows);

    try {
      await handleRowReorder(reorderedRows);
    } finally {
      setDraggedRowId(null);
    }
  };

  // Add this new function for multi-restore
  const handleMultiRestore = async () => {
    // Ensure selectedRows is an array
    if (!Array.isArray(selectedRows)) {
      Swal.fire(
        "Warning",
        "Please select at least one item to restore.",
        "warning"
      );
      return;
    }

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
        const promises = eligibleForRestore.map((id) => Authapi.restorePageDeletedData(id));
        await Promise.all(promises);
        Swal.fire("Success!", "Selected items have been restored.", "success");

        // Update the state directly instead of re-fetching
        const updatedRows = rows.map((row) => {
          if (eligibleForRestore.includes(row.id)) {
            return { ...row, deleted_at: 0 }; // Update the deleted_at status
          }
          return row;
        });

        setRows(updatedRows);
        applyFilter(updatedRows, statusFilter); // Reapply the current filter
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

  const dragHandleColumn = {
    field: "drag",
    headerName: "",
    width: 70,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderHeader: () => <span>Drag</span>,
    renderCell: (params) => (
      <span
        className={`drag-handle ${draggedRowId === params.row.id ? "dragging" : ""}`}
        draggable={statusFilter !== "deleted"}
        onDragStart={(event) => handleDragStart(event, params.row.id)}
        onDragOver={(event) => handleDragOver(event, params.row.id)}
        onDrop={(event) => handleDrop(event, params.row.id)}
        onDragEnd={handleDragEnd}
        style={{
          cursor: statusFilter === "deleted" ? "not-allowed" : "grab",
          display: "inline-flex",
          alignItems: "center",
        }}
        title="Drag to reorder"
      >
        <MdDragIndicator size={20} />
      </span>
    ),
  };

  const baseColumns = [
    {
      field: "checkboxSelection",
      headerName: "Select",
      width: 100,
      renderHeader: () => (
        <input
          type="checkbox"
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
    {
      field: "sr_no",
      headerName: "Sr.No",
      width: 90,
      flex: 1,
      renderCell: (params) => params.row.sr_no,
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
      flex: 1,
      renderCell: (params) => params.row.page_name || "-",
    },
    {
      field: "image",
      headerName: "Image",
      width: 250,
      flex: 1,
      renderCell: (params) => {
        return params.row.image_url ? (
          <img
            src={params.row.image_url}
            alt="Page"
            className="page-list-image"
          />
        ) : (
          <span>-</span>
        );
      },
    },
    {
      field: "ordering",
      headerName: "Ordering",
      width: 150,
      flex: 1,
      renderCell: (params) => (
        <div
          className="ordering-cell"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <span>{params.row.ordering || "-"}</span>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      flex: 1,
      renderCell: (params) => {
        if (statusFilter === "deleted") {
          return (
            <div className="page-list-action-buttons">
              {params.row.deleted_at === 1 && (
                <Tooltip title="Restore">
                  <IconButton
                    aria-label="restore"
                    color="primary"
                    className="action-button"
                    onClick={() => handleRestore(params.row.id)}
                  >
                    <MdRestore />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          );
        }

        return (
          <div className="page-list-action-buttons">
            <Tooltip title="Update">
              <IconButton
                aria-label="Update"
                className="action-button page-list-action-button"
                onClick={() => handleEdit(params.row.id)}
                color="primary"
              >
                <FaEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                aria-label="delete"
                color="primary"
                className="action-button"
                onClick={() => handleDelete1(params.row.id)}
              >
                <MdDelete />
              </IconButton>
            </Tooltip>
            <Tooltip title="Page Active">
              <Switch
                className="switch-class"
                key={params.row.id}
                checked={Boolean(params.row.status)}
                size="xs"
                onChange={async () => {
                  const confirmToggle = await Swal.fire({
                    title: "Are you sure?",
                    text: "Do you want to change the page active status?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#48AD3B",
                    cancelButtonColor: "#87888a",
                    confirmButtonText: "Yes, change it!",
                  });

                  if (confirmToggle.isConfirmed) {
                    await getSingleActive(params.row.id, params.row.status);
                    Swal.fire(
                      "Success!",
                      "Page active status changed successfully.",
                      "success"
                    );
                  }
                }}
              />
            </Tooltip>
            <Tooltip title="Inner Page Active">
              <Switch
                className="switch-class"
                key={params.row.id}
                checked={Boolean(params.row.page_status)}
                size="xs"
                onChange={async () => {
                  const confirmToggle = await Swal.fire({
                    title: "Are you sure?",
                    text: "Do you want to change the inner page active status?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#48AD3B",
                    cancelButtonColor: "#87888a",
                    confirmButtonText: "Yes, change it!",
                  });

                  if (confirmToggle.isConfirmed) {
                    await getActive1(params.row.id, params.row.page_status);
                    Swal.fire(
                      "Success!",
                      "Inner page active status changed successfully.",
                      "success"
                    );
                  }
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const columns =
    statusFilter !== "deleted"
      ? [baseColumns[0], dragHandleColumn, ...baseColumns.slice(1)]
      : baseColumns;

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

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

  const handleAddNavigate = () => {
    navigate("/page"); // Navigate to the /page route
  };

  const handleStatusFilterChange = (event) => {
    const filterValue = event.target.value;
    console.log("Filter Changed:", filterValue); // Log the filter change
    setStatusFilter(filterValue);
    applyFilter(rows, filterValue);
  };

  return (
    <>
      <Expired />
      <div className="col-md-12">
        <div className="row page-list-container">
          <div className="card-header col-6 page-title-section">
            <h5 className="title">Page</h5>
            <IconButton
              className="page-add-btn mt-1"
              aria-label="add"
              color="primary"
              title="Add New Page"
              onClick={handleAddNavigate}
            >
              <MdAdd />
            </IconButton>
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
                <MenuItem value="page active">Page Active</MenuItem>
                <MenuItem value="page inactive">Page Inactive</MenuItem>
                <MenuItem value="inner page active">Inner Page Active</MenuItem>
                <MenuItem value="inner page inactive">Inner Page Inactive</MenuItem>
                <MenuItem value="deleted">Deleted</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="card-header col-3 ">
            <input
              type="search"
              className="form-control form control navbar-search"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className="card-body table-card-body page-list-table-body">
            <Container className="table-container page-list-table-container">
              <div className="page-list-table-wrapper">
                <div className="page-list-table-inner">
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
                    className="page-list-datagrid"
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
                      className="page-list-action-filter"
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
                          value="page active"
                          onClick={() => getActive(selectedRows)}
                        >
                          Page Active
                        </MenuItem>
                        <MenuItem
                          value="page inactive"
                          onClick={() => getInactive(selectedRows)}
                        >
                          Page Inactive
                        </MenuItem>
                        {/* <MenuItem
                        value="deleted"
                        onClick={() => handleDelete(selectedRows)}
                      >
                        Deleted
                      </MenuItem> */}
                        <MenuItem
                          value="delete"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent double call if inside MUI Select
                            const isPermanent = statusFilter === "deleted"; // dynamic based on current filter
                            handleDelete(selectedRows, isPermanent);
                          }}
                        >
                          {statusFilter === "deleted" ? "Parm Delete" : "Deleted"}
                        </MenuItem>
                        <MenuItem
                          value="restore"
                          onClick={() => handleMultiRestore()}
                        >
                          Restore
                        </MenuItem>
                        <MenuItem
                          value="inner page active"
                          onClick={() => getMultiActive(selectedRows)}
                        >
                          Inner Page Active
                        </MenuItem>
                        <MenuItem
                          value="inner page inactive"
                          onClick={() => getmultiInactive(selectedRows)}
                        >
                          Inner Page Inactive
                        </MenuItem>
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

export default PageList;

