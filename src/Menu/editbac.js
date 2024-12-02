import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';


import {
    Container,
    TextField,
    Button,
    Grid,
    Typography,
} from '@mui/material';
import { useParams } from "react-router-dom";
import Authapi from '../Authapi';
import { Link } from "react-router-dom";
const Topmanuedit = () => {

    const [formData, setFormData] = useState({
        site_logo_img: '',
        mts_logo_img: '',
        site_logo_img_link: '',
        mts_logo_img_link: '',
        mts_group_text1: '',
        mts_group_text2: '',
    });

    const [editMode, setEditMode] = useState(false);
    const { id } = useParams();



    useEffect(() => {
        if (id) {
            showdata();
        }
    }, [id]);

    const showdata = async () => {
        try {
            const event = await Authapi.getItemById(id);
            
            console.log(event.results);
            setFormData({
                site_logo_img: null,
                mts_logo_img: null,
                site_logo_img_link: event.site_logo_img_link || '',
                mts_logo_img_link: event.mts_logo_img_link || '',
                mts_group_text1: event.mts_group_text1 || '',
                mts_group_text2: event.mts_group_text2 || '',
            });
            setEditMode(true);
        } catch (error) {
            console.error("Error fetching data:", error);
            Swal.fire('Error!', 'Failed to fetch data. Please try again.', 'error');
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
        //  console.log(form)
        try {
            let response;
            if (editMode) {
                response = await Authapi.update(id, form);

                console.log(response)
            } else {
                // response = await Authapi.add(form);
            }

            if (response && !response.error) {
                Swal.fire('Success!', `Data ${editMode ? 'updated' : 'added'} successfully.`, 'success').then(function () {
                    window.location = "/TopMenu";
                });;

            } else {
                throw new Error(response.message || 'Failed to store data');
            }
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire('Error!', `Failed to ${editMode ? 'update' : 'save'} data. Please try again.`, 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            site_logo_img: '',
            mts_logo_img: '',
            site_logo_img_link: '',
            mts_logo_img_link: '',
            mts_group_text1: '',
            mts_group_text2: '',
        });
        setEditMode(false);
    };

    return (
        <>
            <div className="container-fluid panel-header panel-header-sm"></div>
            <div className="col-md-12">
                <div className="row card mt-4" style={{ marginLeft: "22%", width: "75%" }}>
                    <div className="card-header">
                        <h5 className="title">Edit Menu</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6">Site Logo</Typography>
                                        <input type="file" name="site_logo_img" onChange={handleChange} />
                                        <TextField
                                            label="Site Logo Link"
                                            name="site_logo_img_link"
                                            value={formData.site_logo_img_link}
                                            onChange={handleChange}
                                            type="url"
                                            placeholder="http://example.com"
                                            fullWidth

                                            inputProps={{ pattern: "https?://.+" }}
                                            helperText="Please enter a valid URL starting with http:// or https://."
                                            margin="normal"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6">MTS Logo</Typography>
                                        <input type="file" name="mts_logo_img" onChange={handleChange} />
                                        <TextField
                                            label="MTS Logo Link"
                                            name="mts_logo_img_link"
                                            value={formData.mts_logo_img_link}
                                            onChange={handleChange}
                                            type="url"
                                            placeholder="http://example.com"
                                            fullWidth

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
                                <Grid container justifyContent="flex-start" spacing={2} marginTop={3}>
                                    <Grid item>
                                        <Button variant="contained" style={{ backgroundColor:"#2c9dd4" }} type="submit">
                                            {editMode ? 'Submit' : 'Add'}
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        

                                        <Link to="/topmenu">
                                            <Button  style={{ backgroundColor:"#2c9dd4",color:"white" }}>
                                                Cancel
                                            </Button>
                                        </Link>


                                    </Grid>
                                </Grid>
                            </form>
                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Topmanuedit;
