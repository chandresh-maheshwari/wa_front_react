import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MdOutlineCancel } from "react-icons/md";
import {
    Container,
    TextField,
    Button,
    Grid,
    Typography,
} from '@mui/material';
import Authapi from '../Authapi';
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

const Topmanu = ({ rows = [] }) => {
    const [formData, setFormData] = useState({
        site_logo_img: null,
        mts_logo_img: null,
        site_logo_img_link: '',
        mts_logo_img_link: '',
        mts_group_text1: '',
        mts_group_text2: '',
    });

    const [search, setsearch] = useState("");
    const [filter, setfilter] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const parse = require('html-react-parser').default;
    const [list, setList] = useState([]);

    const [searchVal, setSearchVal] = useState("");
    const [activeStates, setActiveStates] = useState(
        Array.isArray(rows) ? rows.reduce((acc, row) => ({ ...acc, [row.id]: false }), {}) : {}
    );




    useEffect(() => {
        showdata();
    }, []);


    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchVal(value);
        const filteredData = list.filter(item => {
            return Object.values(item).some(val =>
                typeof val === 'string' && val.toLowerCase().includes(value.toLowerCase())
            );
        });
        setList(filteredData);
    };

    const handleCancel = () => {
        setSearchVal('')
        showdata()
    }

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#2c9dd4',
                color: 'white',
            },
        },
        headCells: {
            style: {
                color: 'white',
            },
        },
        cells: {
            style: {
                padding: '8px',
            },
        },
    };
    const showdata = async () => {
        try {
            let events = await Authapi.durTime();
            const results = events.results;
            const activeResults = results.filter(item => !item.isDeleted);
            setList(activeResults);
            setfilter(activeResults);
        } catch (error) {
            console.error("Error fetching data:", error);
            setfilter([]);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('site_logo_img', formData.site_logo_img);
        form.append('mts_logo_img', formData.mts_logo_img);
        form.append('site_logo_img_link', formData.site_logo_img_link);
        form.append('mts_logo_img_link', formData.mts_logo_img_link);
        form.append('mts_group_text1', formData.mts_group_text1);
        form.append('mts_group_text2', formData.mts_group_text2);

        try {
            const response = await Authapi.add(form);
            if (response && !response.error) {
                Swal.fire('Success!', 'Data added successfully.', 'success');
                await showdata();
                resetForm();
            } else {
                throw new Error(response.message || 'Failed to store data');
            }
        } catch (error) {
            console.error("Submission Error:", error.response ? error.response.data : error);
            Swal.fire('Error!', 'Failed to save data. Please try again.', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            site_logo_img: null,
            mts_logo_img: null,
            site_logo_img_link: '',
            mts_logo_img_link: '',
            mts_group_text1: '',
            mts_group_text2: '',
        });
    };

    const handleSoftDelete = async (id) => {
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
                const response = await Authapi.softDelete(id);

                if (response) {
                    Swal.fire('Success!', 'Item marked as deleted.', 'success');
                    showdata();
                } else {
                    throw new Error(response?.message || 'Failed to delete item');
                }
            } catch (error) {
                Swal.fire('Error!',
                    error.response?.data?.message || error.message || 'Failed to delete item',
                    'error'
                );
            }
        }
    };


    const getActive = async (id) => {
        try {
            const response = await Authapi.status(id);
            setActiveStates(prevStates => ({
                ...prevStates,
                [id]: !prevStates[id]
            }));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const columns = [
        {
            name: "Site Logo Image",
            selector: (row) => row.site_logo_img,
            sortable: true,


        },
        {
            name: "MTS Logo Image",
            selector: (row) => parse(row.mts_logo_img),
            sortable: true,
        },
        {
            name: "Site Logo Link",
            selector: (row) => parse(row.site_logo_img_link),
            sortable: true,
        },
        {
            name: "MTS Logo Link",
            selector: (row) => parse(row.mts_logo_img_link),
            sortable: true,
        },
        {
            name: "MTS Group Text 1",
            selector: (row) => parse(row.mts_group_text1),
            sortable: true,
        },
        {
            name: "MTS Group Text 2",
            selector: (row) => parse(row.mts_group_text2),
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <>
                    <Link
                        to={`/Topmanuedit/${row.id}`}
                        className="btn btn-primary m-2"
                        style={{ backgroundColor: "#113b4f" }}
                        id="edit"
                        title="Edit"                    >
                        <BiEditAlt />
                    </Link>
                    <button className='btnkkk btn-oblong btn-danger btn-sm' title="Soft Delete"
                        onClick={() => handleSoftDelete(row.id)}>
                        <MdDelete />
                    </button>
                    <BootstrapSwitchButton
                        key={row.id}
                        checked={activeStates[row.id]}
                        size="xs"
                        onChange={() => getActive(row.id)}
                    />

                </>
            )
        },
    ];

    return (
        <>
            <div className="container-fluid panel-header panel-header-sm"></div>
            <div className="col-md-12">
                <div className="row card mt-4" style={{ marginLeft: "22%", width: "75%" }}>
                    <div className="card-header">
                        <h5 className="title">Top Menu </h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6">Site Logo</Typography>
                                        <input type="file" name="site_logo_img" onChange={handleChange} accept='.png, .jpeg, .jpg' />
                                        <TextField
                                            label="Site Logo Link"
                                            name="site_logo_img_link"
                                            value={formData.site_logo_img_link}
                                            onChange={handleChange}
                                            type="url"
                                            placeholder="http://example.com"
                                            fullWidth
                                            required
                                            inputProps={{ pattern: "https?://.+" }}
                                            helperText="Please enter a valid URL starting with http:// or https://."
                                            margin="normal"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6">MTS Logo</Typography>
                                        <input type="file" name="mts_logo_img" onChange={handleChange} accept='.png, .jpeg, .jpg' />
                                        <TextField
                                            label="MTS Logo Link"
                                            name="mts_logo_img_link"
                                            value={formData.mts_logo_img_link}
                                            onChange={handleChange}
                                            type="url"
                                            placeholder="http://example.com"
                                            fullWidth
                                            required
                                            inputProps={{ pattern: "https?://.+" }}
                                            helperText="Please enter a valid URL starting with http:// or https://."
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="MTS group text 1"
                                            name="mts_group_text1"
                                            value={formData.mts_group_text1}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Enter text"
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="MTS group text 2"
                                            name="mts_group_text2"
                                            value={formData.mts_group_text2}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Enter text"
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} marginTop={3}>
                                    <Grid item>
                                        <Button variant="contained" type="submit" style={{ backgroundColor: "#2c9dd4" }} >
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button style={{ backgroundColor: "#2c9dd4", color: "white" }} onClick={resetForm}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>




                            </form>

                            <div className="card table table-hover mt-5 container">
                                <DataTable
                                    title="Top Menu Listing"
                                    columns={columns}
                                    data={list}
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
                                        <div>
                                            <input
                                                type='text'
                                                className='form-control form control'
                                                placeholder='Search'
                                                value={searchVal}
                                                onChange={handleSearch}
                                            />
                                            <Button className='text-dark' style={{ marginTop: "-65px" }} onClick={handleCancel}>
                                                <MdOutlineCancel style={{ marginLeft: "30px" }} />
                                            </Button>
                                        </div>
                                    }
                                    customStyles={customStyles}
                                />
                            </div>
                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Topmanu;
