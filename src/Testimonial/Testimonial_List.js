/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line no-unused-vars
import parse from 'html-react-parser';
import React, { useState, useEffect } from 'react'
import '../Service/Service.css';
import { BsTrash3 } from 'react-icons/bs';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';

// import { error } from 'jquery';

function Testimonial_List() {

    // e.preventDefault();
    const [data, setdata] = useState([]);
    const [search, setsearch] = useState('');
    const [filter, setfilter] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const parse = require('html-react-parser').default;


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
                    `http://wa_front.localhost.com/api/destroy/${id}`,
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
            cell: (row, index) => index + 1,  //RDT provides index by default
            sortable: true,
        },
        {
            name: " Testimonial",
            selector: (row) => parse(row.testimonial),
            sortable: true,
        },
        {
            name: "Added By",
            selector: (row) => row.add_by,
            sortable: true,
        },
        {
            name: "Position",
            selector: (row) => row.position,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <>
                    <Link
                        to={`/Testimonialedit/${row.id}`}
                        className=" btn btn-primary m-2 "
                        id="edit"
                        title="Edit"
                    >
                        <i className="fa fa-edit"><BiEditAlt /></i>
                    </Link>

                    <button className='btn btn-danger ' title="Delete"
                        onClick={() =>
                            handleDelete(row.id)
                        }
                    >
                        <MdDelete />
                    </button>
                </>
            )
        },
    ]

    const myFunction = async () => {
        try {
            let result = await fetch("http://wa_front.localhost.com/api/Testimoniallist");
            result = await result.json();
            console.log("API response:", result); // Log the response
            setdata(result);
            setfilter(result);
        } catch (error) {
            console.error("error fetch data", error);
        }
    };
    
    useEffect(() => {
        myFunction();
    }, [])
    console.warn("result", data)

    useEffect(() => {
        const result = data.filter((item) => {
            return item.testimonial.toLowerCase().match(search.toLocaleLowerCase());
        });
        setfilter(result);
    }, [search]);


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
                    `http://wa_front.localhost.com/api/delete-Testimonial/${selectedIds.join(",")}`,
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
            <div className='maincard '>
                <div className="col-md-12">
                    <div className="row card" style={{
                        marginLeft: "22%",
                        width: "75%"
                    }}>
                        <div className="card-header" style={{ marginTop: "2%" }}>

                            {/* <h5 className="title">Testimonial List</h5> */}
                            <div class="dt-buttons" id="action_filter1">
                                <button class="dt-button buttons-html5btn btn btn-primary bulkdeletebtn btnkkk" onClick={handleBulkDelete} >
                                    <BsTrash3 />
                                </button>

                                <Link to="/Testimonial" class="dt-button buttons-html5btn btn btn-primary bulkdeletebtn btnkkk" >
                                    <i class="fa fa-plus"><AiOutlinePlusCircle /> </i>

                                </Link>
                            </div>
                        </div>
                        {/* {loading && <div className='text-secondary text-center mt-5'>loading.....</div>}
                        {error && <div>Error: {error}</div>}
                        {!loading && !error && filter.length > 0 && ( */}
                        <div className="card table  table-hover">
                            <DataTable
                                title="Testimonial List"
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

export default Testimonial_List



