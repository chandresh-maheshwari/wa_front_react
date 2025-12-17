import {
  Container,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Authapi from "../Authapi";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdAdd, MdRestore, MdDragIndicator } from "react-icons/md";
import "../Custom.css";
import Switch from "@mui/material/Switch";
import Expired from "../Login/ExpiredToken";
import { useNavigate } from "react-router-dom";

const DynamicList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStates, setActiveStates] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [draggedRowId, setDraggedRowId] = useState(null);
  const [dragOverRowId, setDragOverRowId] = useState(null);
  const gridRef = useRef(null);
  const MAX_PAGE_SIZE = 100; // MUI DataGrid (MIT) hard limit
  const allPageSize = useMemo(() => {
    const total = filteredRows.length || rows.length || 0;
    const safeTotal = Math.max(total, 1); // DataGrid requires at least 1
    return Math.min(safeTotal, MAX_PAGE_SIZE);
  }, [filteredRows.length, rows.length]);

  const pageSizeOptions = useMemo(
    () => [5, 10, 20, 50, { value: allPageSize, label: "All" }],
    [allPageSize]
  );

  const paginationModel = useMemo(
    () => ({ page, pageSize }),
    [page, pageSize]
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedRows([]); // Clear selected rows when statusFilter changes
  }, [statusFilter]);


  const fetchData = async () => {
    setLoading(true);
    try {
      // console.log('dynamic-list-data');
      const response = await Authapi.dynamicListData();
      console.log("API Response:", response); // Log the API response

      if (Array.isArray(response.results)) {
        const formattedData = response.results.map((item, index) => ({
          id: item.id,
          sr_no: index + 1,
          post_title: item.post_title,
          post_type: item.post_type,
          ordering: item.ordering,
          status: item.status,
          deleted_at: item.deleted_at, // Ensure this field is included
        }));

        formattedData.sort((a, b) => {
          if (a.ordering === b.ordering) {
            return a.id - b.id;
          }
          return (a.ordering || 0) - (b.ordering || 0);
        });

        console.log("Formatted Data:", formattedData); // Log the formatted data

        setRows(formattedData); // Set all data, including deleted
        applyFilter(formattedData, statusFilter);
      } else {
        console.error("Unexpected response format", response.results);
        Swal.fire("Error", "Invalid data format received.", "error");
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      Swal.fire("Error", "Failed to load data.", "error");
    } finally {
      setLoading(false);
    }
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
        filteredData = data.filter((row) => row.deleted_at === 0);
    }

    filteredData = filteredData
      .sort((a, b) => {
        if (a.ordering === b.ordering) {
          return a.id - b.id;
        }
        return (a.ordering || 0) - (b.ordering || 0);
      })
      .map((row, index) => ({
        ...row,
        sr_no: index + 1,
      }));

    setFilteredRows(filteredData);
    console.log("Filtered Rows:", filteredData);
  };

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
      await Authapi.dynamicPostReorder(payload);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Failed to save new ordering",
        "error"
      );
      fetchData();
    }
  };

  const handleStatusFilterChange = (event) => {
    const filterValue = event.target.value;
    console.log("Filter Changed:", filterValue);
    setStatusFilter(filterValue);
    applyFilter(rows, filterValue);
  };

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
    setDragOverRowId(null);
  };

  const handleDragOver = (event, targetId) => {
    if (!draggedRowId || statusFilter === "deleted") {
      return;
    }
    event.preventDefault();
    const isSame = draggedRowId === targetId;
    event.dataTransfer.dropEffect = isSame ? "none" : "move";
    setDragOverRowId(isSame ? null : targetId);
  };

  const handleDragEnd = () => {
    setDraggedRowId(null);
    setDragOverRowId(null);
  };

  const handlePaginationModelChange = (model) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(0); // reset to first page when page size changes
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
      setDragOverRowId(null);
    }
  };

  // Allow dropping on any row area (not just handle)
  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const scroller = gridElement.querySelector(".MuiDataGrid-virtualScroller");
    if (!scroller) return;

    const handleRowDragOver = (event) => {
      if (!draggedRowId || statusFilter === "deleted") return;
      const rowEl = event.target.closest("[data-id]");
      if (!rowEl) return;

      const targetId = Number(rowEl.getAttribute("data-id"));
      if (!targetId || targetId === draggedRowId) {
        setDragOverRowId(null);
        return;
      }

      event.preventDefault();
      setDragOverRowId(targetId);
    };

    const handleRowDrop = (event) => {
      if (!draggedRowId || statusFilter === "deleted") return;
      const rowEl = event.target.closest("[data-id]");
      if (!rowEl) return;

      const targetId = Number(rowEl.getAttribute("data-id"));
      if (!targetId || targetId === draggedRowId) return;

      event.preventDefault();
      handleDrop(event, targetId);
    };

    const handleRowDragLeave = (event) => {
      if (!draggedRowId) return;
      const nextRow = event.relatedTarget?.closest?.("[data-id]");
      if (!nextRow) {
        setDragOverRowId(null);
      }
    };

    scroller.addEventListener("dragover", handleRowDragOver);
    scroller.addEventListener("drop", handleRowDrop);
    scroller.addEventListener("dragleave", handleRowDragLeave);

    return () => {
      scroller.removeEventListener("dragover", handleRowDragOver);
      scroller.removeEventListener("drop", handleRowDrop);
      scroller.removeEventListener("dragleave", handleRowDragLeave);
    };
  }, [draggedRowId, statusFilter]);

  // Preview reorder is disabled (use filteredRows directly to avoid flicker)


  // multi deleted Data

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
  //       const promises = ids.map((id) => Authapi.dynamicDeleteData(id));
  //       await Promise.all(promises);
  //       Swal.fire("Success!", "Selected items marked as deleted.", "success");
  //       fetchData();
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
//   const handleDelete = async (ids, isPermanent) => {
//   if (ids.length === 0) {
//     Swal.fire("Warning", "Please select at least one item.", "warning");
//     return;
//   }

//   const confirmDelete = await Swal.fire({
//     title: isPermanent ? "Permanent Delete?" : "Soft Delete?",
//     text: isPermanent 
//       ? "This will permanently delete selected items!"
//       : "This will mark items as deleted!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonText: isPermanent ? "Yes, delete permanently!" : "Yes, delete!",
//   });

//   if (!confirmDelete.isConfirmed) return;

//   try {

//     const promises = ids.map((id) =>
//       Authapi.dynamicDeleteData(id, { isPermanent })
//     );
//     await Promise.all(promises);

//     Swal.fire(
//       "Success!",
//       isPermanent
//         ? "Items permanently deleted."
//         : "Items soft deleted.",
//       "success"
//     );

//     fetchData();
//     setSelectedRows([]);
//   } catch (error) {
//     console.log(error);
//     Swal.fire("Error", "Delete failed!", "error");
//   }
// };
 const handleDelete = async (ids, isPermanent = false) => {
  if (!ids.length) {
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
    const response = await Authapi.dynamicDeleteData(
      ids.join(","), 
      { isPermanent }
    );

    console.log("DELETE RESPONSE:", response);

    Swal.fire(
      "Success!",
      response.message || 
        (isPermanent ? "Items permanently deleted." : "Items soft deleted."),
      "success"
    );

    fetchData();
    setSelectedRows([]);
  } catch (error) {
    console.log("DELETE ERROR:", error?.response?.data);

    Swal.fire(
      "Error",
      error?.response?.data?.message || "Delete failed!",
      "error"
    );
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

    try {
      const promises = ids.map((id) => Authapi.restoreDynamicPostDeletedData(id));
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

 

  // Function to handle single restore
  const handleSingleRestore = async (id) => {
    try {
      await Authapi.restoreDynamicPostDeletedData(id); // Directly call the API for single restore
      Swal.fire("Success!", "Item restored successfully.", "success");
      fetchData(); // Refresh data
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

  // Example of calling handleRestore with multiple IDs
  const handleMultiRestore = async () => {
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
        await handleRestore(eligibleForRestore);
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

  const handleEdit = async (id) => {
    navigate(`/dynamic-edit/${id}`);
  };
  // single Delelete Data
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
        const response = await Authapi.dynamicDeleteData(id);
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

        const event = new CustomEvent("dynamicPostStatusChanged", {
          detail: { id, status: newStatus },
        });
        window.dispatchEvent(event);

        fetchData();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };
  // multi inactive data
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
        // Filter out items that are already inactive
        const idsToDeactivate = ids.filter(id => {
          const row = filteredRows.find(row => row.id === id);
          return row && row.status === 1;
        });

        if (idsToDeactivate.length > 0) {
          const promises = idsToDeactivate.map((id) => Authapi.dynamicstatus(id, newStatus));
          await Promise.all(promises);

          setActiveStates((prevStates) => {
            const newStates = { ...prevStates };
            idsToDeactivate.forEach((id) => {
              newStates[id] = false;
            });
            return newStates;
          });
          const event = new CustomEvent("dynamicPostStatusChanged", {
            detail: { ids: idsToDeactivate, status: newStatus },
          });
          window.dispatchEvent(event);
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

  // multi active data
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
        // Get all rows from the current filter
        const currentRows = statusFilter === "all" ? rows.filter(row => row.deleted_at === 0) : filteredRows;

        // Filter out items that are already active
        const idsToActivate = ids.filter(id => {
          const row = currentRows.find(row => row.id === id);
          return row && row.status === 0;
        });

        if (idsToActivate.length > 0) {
          const promises = idsToActivate.map((id) =>
            Authapi.dynamicstatus(id, newStatus)
          );
          await Promise.all(promises);

          setActiveStates((prevStates) => {
            const newStates = { ...prevStates };
            idsToActivate.forEach((id) => {
              newStates[id] = true;
            });
            return newStates;
          });
          const event = new CustomEvent("dynamicPostStatusChanged", {
            detail: { ids: idsToActivate, status: newStatus },
          });
          window.dispatchEvent(event);
          fetchData();
          Swal.fire("Success!", "Selected items are now active.", "success");
        } else {
          Swal.fire("Info", "All selected items are already active.", "info");
        }
      } catch (error) {
        console.error("Error activating items:", error);
        Swal.fire("Error", "Failed to update status", "error");
      }
    }
  };

  const handleActionFilterChange = (event) => {
    const filterValue = event.target.value;
    setActionFilter(filterValue);

    // Check for "deleted" status filter
    if (statusFilter === "deleted") {
      // Apply the current action on only the deleted rows
      if (filterValue === "deleted") {
        handleDelete(selectedRows); // Only delete the rows currently marked as deleted
      } else if (filterValue === "restore") {
        handleMultiRestore(); // Restore only deleted rows
      }
    } else {
      // Reset the selected rows if action filter is clicked
      setSelectedRows([]);
    }
  };

  const dragHandleColumn = {
    field: "drag",
    headerName: "",
    width: 100,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderHeader: () => <span>Ordering</span>,
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
          className="action-checkbox"
          checked={selectedRows.length === rows.length}
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
    { field: "post_title", headerName: "Title", width: 150, flex: 1 },
    { field: "post_type", headerName: "Post Type", width: 150, flex: 1 },
    // {
    //   field: "ordering",
    //   headerName: "Ordering",
    //   width: 150,
    //   flex: 1,
    //   renderCell: (params) => (
    //     <div className="ordering-cell" style={{ display: "flex", alignItems: "center", gap: 8 }}>
    //       <span>{params.row.ordering || "-"}</span>
    //     </div>
    //   ),
    // },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      flex: 1,
      renderCell: (params) => (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            gap: 4,
          }}
        >
          {statusFilter !== "deleted" ? (
            <>
              <Tooltip title="Update">
                <IconButton
                  aria-label="Update"
                  onClick={() => handleEdit(params.row.id)}
                  color="primary"
                  className="action-button"
                // style={{ margin: "1px" }}
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
              <Tooltip title={params.row.status ? 'Inactive' : 'Active'}>
                <Switch
                  className="action-button switch-class"
                  key={params.row.id}
                  checked={
                    activeStates[params.row.id] !== undefined
                      ? Boolean(activeStates[params.row.id])
                      : Boolean(params.row.status)
                  }
                  size="xs"
                  onChange={async () => {
                    const confirmToggle = await Swal.fire({
                      title: "Are you sure?",
                      text: "Do you want to change the active status?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#48AD3B",
                      cancelButtonColor: "#87888a",
                      confirmButtonText: "Yes, change it!",
                    });

                    if (confirmToggle.isConfirmed) {
                      const currentStatus =
                        activeStates[params.row.id] !== undefined
                          ? activeStates[params.row.id] ? 1 : 0
                          : params.row.status;
                      await getSingleActive(
                        params.row.id,
                        currentStatus
                      );
                      Swal.fire(
                        "Success!",
                        "Active status changed successfully.",
                        "success"
                      );
                    }
                  }}
                />
              </Tooltip>
            </>
          ) : (
              <Tooltip title="Restore">
                <IconButton
                  aria-label="restore"
                  color="primary"
                  className="action-button"
                  onClick={() => handleSingleRestore(params.row.id)}
                >
                  <MdRestore />
                </IconButton>
              </Tooltip>
          )}
        </div>
      ),
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
    navigate("/dynamic-form");
  };

  return (
    <>
      <Expired />
      <div className="col-md-12">
        <div className="row dynamic-list-main-row">
          <div className="card-header col-6 dynamic-post-section">
            <h5 className="title">Post</h5>
            <IconButton
              className="dynamic-post-add-btn"
              aria-label="add"
              color="primary"
              onClick={handleAddNavigate}
              title="Add New Post"
            >
              <MdAdd />
            </IconButton>
          </div>
          <div className="card-header col-3">
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                className="filter_dropdown_of_main_page"
                onChange={handleStatusFilterChange}
                label="Status Filter"
              >
                <MenuItem value="all" >
                  All
                </MenuItem>
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
          <div className="card-body table-card-body dynamic-list-card-body">
            <Container className="table-container dynamic-list-container">
              <div className="dynamic-list-inner" ref={gridRef}>
                <DataGrid
                  rows={filteredRows}
                  columns={columns}
                  paginationModel={paginationModel}
                  pageSizeOptions={pageSizeOptions}
                  loading={loading}
                  style={{ height: "100%", width: "100%" }}
                  onPaginationModelChange={handlePaginationModelChange}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#113b4f",
                  color: "white",
                },
                "& .row-dragging": {
                  backgroundColor: "#f5faff",
                  boxShadow: "0 3px 12px rgba(25,118,210,0.14)",
                  transition:
                    "background-color 120ms ease, box-shadow 120ms ease, transform 120ms ease",
                  transform: "scale(1.003)",
                  position: "relative",
                },
                "& .row-dragging::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  backgroundColor: "#1976d2",
                  opacity: 0.9,
                },
                "& .row-drag-over": {
                  position: "relative",
                  backgroundColor: "#f9fcff",
                  boxShadow: "0 0 0 1px #b3e5fc",
                },
                "& .drag-handle.dragging": { color: "#1976d2" },
              }}
                  selectionModel={selectedRows}
                  onSelectionModelChange={handleSelectionChange}
              getRowClassName={(params) => {
                if (params.id === draggedRowId) return "row-dragging";
                if (params.id === dragOverRowId) return "row-drag-over";
                return "";
              }}
                  onCellClick={(params, event) => {
                    if (event.target.closest(".MuiCheckbox-root")) {
                      return;
                    }
                    event.stopPropagation();
                  }}
                />
                <FormControl
                  fullWidth
                  className="dynamic-list-action-filter"
                >
                  <InputLabel>Action Filter</InputLabel>
                  <Select
                    value={actionFilter}
                    className="filter_dropdown_of_main_page"
                    onChange={handleActionFilterChange}
                    label="Status Filter"
                  >
                    <MenuItem value="all" disabled>
                      All
                    </MenuItem>
                    <MenuItem
                      value="active"
                      onClick={() => getActive(selectedRows)}
                    >
                      Active
                    </MenuItem>
                    <MenuItem
                      value="inactive"
                      onClick={() => getInactive(selectedRows)}
                    >
                      Inactive
                    </MenuItem>
                    {/* <MenuItem
                      value="deleted"
                      onClick={() => handleDelete(selectedRows)}
                    >
                      Deleted
                    </MenuItem> */}
                    {/* <MenuItem
                      value="deleted"
                      onClick={() => {
                        const isPermanent = (statusFilter === "deleted");
                        handleDelete(selectedRows, isPermanent);
                      }}
                    >
                      {statusFilter === "deleted" ? "Parm Delete" : "Deleted"}
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
                  </Select>
                </FormControl>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};


export default DynamicList;
