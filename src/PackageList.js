import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Searchbar from "./Searchbar";
import "./clientform.css";
import "./clientlist.css";
import { Link } from "react-router-dom";
import { BsTrash3 } from "react-icons/bs";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import parse from "html-react-parser";

const PackageList = () => {
  // const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState("");
  // const parse = require('html-react-parser').default;
  
  /************************************************Search & Filter Data *******************************************************************/
  useEffect(() => {
    const result = data.filter((item) => {
      return item.package_title.toLowerCase().match(search.toLocaleLowerCase());
    });
    setFilter(result);
  }, [data, search]);

  /*******************************************************API LISTING***********************************************************************/
  useEffect(() => {
    const ProductListing = async () => {
      try {
        const res = await fetch(`http://wafront.localhost.com/api/lists`);
        if (!res.ok) {
          throw new Error("Error In Fetching Data");
        }
        const ApiData = await res.json();
        setData(ApiData);
        setFilter(ApiData);
        navigate("/package_list");
      } catch (error) {
        console.error("Error In Fetching data", error);
      }
    };
    ProductListing();
  }, []);

  //*********************************************************Delete Data ID Wise*********************************************************//

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
          `http://wafront.localhost.com/api/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          Swal.fire("Deleted!", "Your rows have been deleted.", "success");
          setFilter((prevData) => prevData.filter((item) => item.id !== id));
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
  /**********************************************Bulk Delete******************************************************************************/
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

  //***********************************************************Table-Fields*************************************************************/
  const columns = [
    {
      name: '#',
      cell: (row, index) => index + 1  //RDT provides index by default
    },
    // {
    //   name: "ID",
    //   selector: "id",
    //   sortable: true,
    //   // width: "150px",
    // },

    {
      name: "Package Title",
      selector: (row) => row.package_title,
      sortable: true,
      // width: "150px",
    },
    {
      name: "Package Description",
      selector: (row) => (row.package_des ? parse(row.package_des) : ""),
      sortable: true,
      // width: "150px",
    },
    {
      name: "Package Price",
      selector: (row) => row.package_price,
      sortable: true,
      // width: "150px",
    },
    {
      name: "Additional Info",
      selector: (row) =>
        row.additional_info ? parse(row.additional_info) : "",
      sortable: true,
      // width: "150px",
    },
    {
      name: "ACTION",
      cell: (row) => (
        <>
          <Link
            to={`/edit_client/${row.id}`}
            className="btnkkk btn-oblong btn-primary btn-sm"
            id="edit"
            title="Edit"
          >
              <i className="fa fa-edit">
               {/* <BiEditAlt />  */}  
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

  /********************************************************************************************************/
  return (
    <>
      <Searchbar />
      <div className="container-fluid panel-header panel-header-sm"></div>
      <div className="hhkk">
        <div className="col-md-12">
          <div
            className="row card"
            style={{
              top: "30px",
              marginLeft: "22%",
              width: "75%",
              height: "50vh",
            }}
          >
            <div className="card-header" style={{ marginTop: "2%" }}>
              <div className="dt-buttons mt-4" id="action_filter1">
                <Link
                  className="dt-button buttons-html5btn btn btn-primary btnhardik btnkkk"
                  id="delete_record"
                  onClick={handleBulkDelete}
                >
                  <i className="fa fa-trash">
                    {/* <BsTrash3 /> */}
                  </i>
                </Link>

                <Link
                  to="/add_package"
                  className="dt-button buttons-html5btn btn btn-primary btnhardik btnkkk"
                >
                  <i className="fa fa-plus">
                    {/* <AiOutlinePlusCircle /> */}
                  </i>
                </Link>
              </div>
            </div>
            <div className="card table  table-hover">
              <DataTable
                key={JSON.stringify(data)}
                title="Product List"
                columns={columns}
                data={filter}
                selectableRows
                fixedHeader
                selectableRowsHighlight
                onSelectedRowsChange={({ selectedRows }) =>
                  setSelectedRows(selectedRows)
                }
                highlightOnHover
                subHeader
                pagination
                paginationPerPage={10} // Set the number of rows per page
                paginationRowsPerPageOptions={[10, 20, 30]} // Specify the options for rows per page
                paginationComponentOptions={{
                  rowsPerPageText: "Rows per page:", // Customize the pagination text
                  rangeSeparatorText: " Out of", // Customize the range separator text
                  noRowsPerPage: false,
                  // paginationPart: {
                  //   width: "100%",
                  // }, // Hide the rows per page dropdown
                }}
                subHeaderComponent={
                  <input
                    type="text"
                    className="w-100 form-control"
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

export default PackageList;
