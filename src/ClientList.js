import React, { useState, useEffect } from "react";

import Searchbar from "./Searchbar";
import "./clientform.css";
import "./clientlist.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BsTrash3 } from "react-icons/bs";
import { AiOutlinePlusCircle } from "react-icons/ai";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";

const ClientList = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // state for bulk-delete row delete
  const [data, setData] = useState([]); // state for data listing...
  // const [key, setKey] = useState(0);
  const [filter, setFilter] = useState([]); // state for search filter data
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  /************************************************************Search&Filtering Of Data**************************************************/

  useEffect(() => {
    const result = data.filter((item) => {
      return item.partner_name.toLowerCase().match(search.toLocaleLowerCase());
    });
    setFilter(result);
  }, [data, search]);

  /****************************************************************API DATA LISTING*****************************************************/
  useEffect(() => {          
    const fetchData = async () => {
      try {
        const response = await fetch("http://wafront.localhost.com/api/list");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const ApiData = await response.json();
        setData(ApiData);
        setFilter(ApiData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  /*****************************************************Select ID's And Bulk Delete*********************************************************/

  const handleBulkDelete = async () => {
    const selectedIds = selectedRows.map((row) => row.id);

    // Check if no rows are selected
    if (selectedIds.length === 0) {
      Swal.fire("No Rows Selected", "Please select rows to delete", "warning");
      return;
    }

    try {
      const BulkDelete = await Swal.fire({
        title: "Are you sure?",
        text: "Delete Data",

        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      });

      if (BulkDelete.isConfirmed) {
        const res = await fetch(
          `http://wafront.localhost.com/api/delete-clients/${selectedIds.join(
            ","
          )}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          setFilter((prevData) =>
            prevData.filter((item) => !selectedIds.includes(item.id))
          );
          Swal.fire("Deleted!", "Selected rows have been deleted.", "success");
        } else {
          throw new Error("Network Response was not ok");
        }
      } else {
        console.log("Delete Cancelled");
      }
    } catch (error) {
      console.error("Error in deleting data", error);
    }
  };

  /******************************************************Cancel Button ************************************************/

  const CancelledButton = () => {
    navigate("/clist");
  };
  /*****************************************************Delete Id *************************************************************************/

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Delete Data",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `http://wafront.localhost.com/api/destroy/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.ok) {
          setFilter((prevData) => prevData.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "Your rows have been deleted.", "success");
        } else {
          throw new Error("Network Response was not ok");
        }
      } else {
        // Handle cancellation here, if needed
        console.log("Deletion canceled");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const columns = [
    {
      name: "#",
      cell: (row, index) => index + 1,
    },
    // {
    //   name: "ID",
    //   selector: "id",
    //   sortable: true,
    //   // width: "150px",
    // },

    {
      name: "PARTNER NAME",
      selector: "partner_name",
      sortable: true,
      // width: "200px",
    },
    {
      name: "PARTNER LOGO",
      cell: (row) => (
        <img
          src={`http://wafront.localhost.com/images/client/${
            row.partner_logo
          }?${Date.now()}`}
          width={50}
          style={{ width: "40%" }}
          alt="logo"
        />
      ),
      // width: "200px",
    },
    {
      name: "ACTION",
      cell: (row) => (
        <>
          <Link
            to={`/editform/${row.id}`}
            className="btnkkk btn-oblong btn-primary btn-sm"
            id="edit"
            title="Edit"
          >
            <i className="fa fa-edit">
              {/* <BiEditAlt /> */}
            </i>
          </Link>
          <button
            className="btnkkk btn-oblong btn-danger btn-sm"
            title="Delete"
            onClick={() => handleDelete(row.id)}
          >
            <i className="fa fa-trash btn-danger">
              {/* <MdDelete /> */}
            </i>
          </button>
        </>
      ),
      // width: "120px",
    },
  ];
  return (
    <>
      <Searchbar />
      <div className="container-fluid panel-header panel-header-sm"></div>
      <div className="hhkk">
        <div className="col-md-12">
          <div className="row card" style={{ marginLeft: "22%", width: "75%" }}>
            <div className="card-header" style={{ marginTop: "2%" }}>
              <div className="dt-buttons" id="action_filter1">
                <button
                  className="dt-button buttons-html5btn btn btn-primary btnhardik btnkkk"
                  onClick={handleBulkDelete}
                >
                  <BsTrash3 />
                </button>
                <Link
                  to="/add_client"
                  className="dt-button buttons-html5btn btn btn-primary btnhardik btnkkk"
                  onClick={CancelledButton}
                >
                  <i class="fa fa-plus">
                    {/* <AiOutlinePlusCircle /> */}
                  </i>
                </Link>
              </div>
            </div>
            <div className="card-body table-responsive">
              <DataTable
                title="Client List"
                columns={columns}
                data={filter}
                selectableRows
                onSelectedRowsChange={({ selectedRows }) =>
                  setSelectedRows(selectedRows)
                }
                selectableRowsHighlight
                highlightOnHover
                subHeader
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30]}
                paginationComponentOptions={{
                  rowsPerPageText: "Rows per page:",
                  rangeSeparatorText: "Out of",
                  noRowsPerPage: false,
                }}
                subHeaderComponent={
                  <input
                    type="text"
                    className="w-100 form-control mb-2"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientList;
