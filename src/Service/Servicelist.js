
import parse from 'html-react-parser';
import React, { useState, useEffect } from 'react'
import "../Service/Service.css"
import '../App.css';
import { BsTrash3 } from 'react-icons/bs';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import Authapi from '../Authapi';

function Servicelist() {

    const [data, setdata] = useState([]);
    const [search, setsearch] = useState("");
    const [filter, setfilter] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const parse = require('html-react-parser').default;

    //=============================== one delete api call=====================================//
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
                    `http://wa_front.localhost.com/api/Servicesdestroy/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.ok) {
                    setfilter((prevData) => prevData.filter((item) => item.id !== id));
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
            name: '#',
            cell: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: " Service Title",
            selector: (row) => row.service_title,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) => parse(row.description),
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <>
                    <Link
                        to={`/EditServiceForm/${row.id}`}
                        className=" btn btn-primary m-2 "
                        id="edit"
                        title="Edit"
                    >
                        <i className="fa fa-edit">
                            <BiEditAlt />
                        </i>
                    </Link>

                    <button className='btnkkk btn-oblong btn-danger btn-sm ' title="Delete"
                        onClick={() =>
                            handleDelete(row.id)
                        }>
                        <i className="fa fa-trash btn-danger">
                            <MdDelete />
                        </i>
                    </button>
                </>
            )
        },
    ]


    // =============================services list api call===================================//

    // const myFunction = async () => {
        // try {
        //     let result = await fetch("http://wa_front.localhost.com/api/serviceslist");
        //     result = await result.json();
        //     setdata(result)
        //     setfilter(result)
        //     // setLoading(false);
        // }
        // catch (error) {
        //     // setError(e.message);
        //     // setLoading(false);
        //     console.error("error fetch data", error);
        // }


       const  eventData = async (e) => {
            let events = await Authapi.durTime();
             console.log(events)
             
            // if (events && events.status === true) {
            //     this.setState({
            //         upcoming: events.data,
            //         filteredEvents: events.data,
            //         count: events.data.length
            //     })
            // }
        }
    // };
    useEffect(() => {
        eventData();
    }, [])
    console.warn("result", data)

    useEffect(() => {
        const result = data.filter((item) => {
            return item.service_title.toLowerCase().match(search.toLocaleLowerCase());
        });

        setfilter(result);
    }, [data, search]);


    //===============================maltipal data delete api call==============================//

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
                    `http://wa_front.localhost.com/api/delete-clients/${selectedIds.join(",")}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (res.ok) {
                    setfilter((prevData) =>
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


    return (
        <>
            <div class="container-fluid panel-header panel-header-sm">
            </div>
            <div className='maincard'>
                <div className="col-md-12 ">
                    <div className="row card" style={{
                        marginLeft: "22%",
                        width: "75%"
                    }}>
                        <div className="card-header" style={{ marginTop: "2%" }}>

                            {/* <h5 className="title">Services list</h5> */}
                            <div class="dt-buttons" id="action_filter1">
                                <button
                                    className="dt-button buttons-html5btn btn btn-primary btnhardik btnkkk"
                                    onClick={handleBulkDelete}
                                >
                                    <BsTrash3 />
                                </button>
                                <Link to="/Addrvices" class="dt-button buttons-html5btn btn btn-primary btnhardik btnkkk" >
                                    <i class="fa fa-plus"><AiOutlinePlusCircle /> </i>
                                </Link>
                            </div>
                        </div>

                        {/* {loading && <div className='text-secondary text-center mt-5'>loading.....</div>}
                        {error && <div>Error: {error}</div>}
                        {!loading && !error && filter.length > 0 && ( */}
                        <div className="card table  table-hover">
                            <DataTable
                                title="Service data"
                                columns={columns}
                                data={filter}
                                selectableRows
                                onSelectedRowsChange={({ selectedRows }) =>
                                    setSelectedRows(selectedRows)
                                }
                                fixedHeader
                                selectableRowsHighlight
                                highlightOnHover
                                subHeader
                                pagination
                                paginationPerPage={5}
                                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                                paginationComponentOptions={{
                                    rowsPerPageText: 'Records per page:',
                                    rangeSeparatorText: 'out of',
                                    noRowsPerPage: false,
                                }}
                                subHeaderComponent={
                                    <input type='text'
                                        className='w-100 form-control'
                                        placeholder='Search'
                                        value={search}
                                        onChange={(e) => setsearch(e.target.value)}
                                    />
                                }
                            />
                        </div>
                        {/* )} */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Servicelist
