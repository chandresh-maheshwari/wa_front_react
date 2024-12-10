import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';
import { Typography, Container, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Radio, RadioGroup } from '@mui/material';
import Authapi from '../Authapi';

import Expired from '../Login/ExpiredToken';
import { useNavigate, useParams } from 'react-router-dom';


const PageEdit = () => {
    const [postTitles, setPostTitles] = useState([]);
    const [formData, setFormData] = useState({

    })
    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchPostTitles = async () => {
            try {
                const response = await Authapi.dynamicListData();
                console.log("API Response:", response);

                if (response && response.results) {
                    console.log("Response Results:", response.results);
                    const titles = response.results;
                    console.log("Post Titles:", titles);


                    if (Array.isArray(titles)) {
                        setPostTitles(titles);

                    } else {
                        console.error("Post titles is not an array:", titles);
                    }
                } else {
                    console.error("Response or results are undefined:", response);
                }
            } catch (error) {
                console.error("Error fetching post titles:", error);
            }
        };

        fetchPostTitles();
    }, []);

    useEffect(() => {
        fetchData(id);
    }, [id]);

    const fetchData = async (id) => {
        try {
            const event = await Authapi.pageEditData(id);
            if (event) {
                setFormData({
                    page_name: event.page_name || '',
                    page_description: event.page_description || '',
                    image_url: event.image_url || '',
                    ordering: event.ordering || '',
                    post_type: event.post_type || '',

                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error!', 'Failed to fetch data. Please try again.', 'error');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();



        const form = new FormData();
        form.append('page_name', formData.page_name);
        form.append('page_description', formData.page_description);
        form.append('image', formData.image);
        form.append('ordering', formData.ordering);
        form.append('post_type', formData.post_type);
        try {
            const response = await Authapi.pageupdatedata(id, form);
            // console.log(response);
            if (response) {
                Swal.fire('Success', ' added successfully!', 'success');
                navigate('/page-list')

            } else {
                Swal.fire('Error', 'Failed to add .', 'error');
            }
        } catch (error) {
            console.error("API Error:", error);
            Swal.fire('Error', 'An error occurred while submitting.', 'error');
        }
    };



    return (
        <>

            <Expired />
            <div className="container-fluid panel-header panel-header-sm"></div>
            <div className="col-md-12">
                <div className="row card mt-4" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">Page</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form encType="multipart/form-data" id="servicesForm" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Page Title"
                                            type="text"
                                            required
                                            fullWidth
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            value={formData.page_name}
                                            onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                                        />
                                    </Grid>
                                   
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Ordering"
                                            type="number"
                                            fullWidth
                                            margin="normal"
                                            name='ordering'
                                            InputLabelProps={{ shrink: true }}
                                            value={formData.ordering}
                                            onChange={(e) => setFormData({ ...formData, ordering: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Page Image"
                                            type="file"
                                            fullWidth
                                            margin="normal"
                                            inputProps={{ accept: 'image/jpeg, image/png, image/jpg' }}
                                            InputLabelProps={{ shrink: true }}
                                            name="image"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setFormData({ ...formData, image: file, image_url: file });
                                            }}
                                        />
                                        {formData.image_url ? (
                                            formData.image_url instanceof File ? (
                                                <div>
                                                    <p>Image: {formData.image_url.name}</p>
                                                    <img
                                                        src={URL.createObjectURL(formData.image_url)}
                                                        alt="Preview"
                                                        width="100"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <img
                                                        src={formData.image_url}
                                                        alt="Current image preview"
                                                        width="100"
                                                    />
                                                    <p>{formData.image_url.split('/').pop()}</p>
                                                </div>
                                            )
                                        ) : null}
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth style={{ marginBottom: '15px' }}>
                                            <InputLabel>Post Type</InputLabel>
                                            <Select
                                                label="Post Type"
                                                name="post_type"
                                                value={formData.post_type || ''}
                                                fullWidth
                                                style={{
                                                    backgroundColor: '#f4f6f8',
                                                    borderRadius: '5px'
                                                }}
                                                onChange={(e) => setFormData({ ...formData, post_type: e.target.value })}
                                            >
                                                {postTitles.length > 0 ? (
                                                    postTitles
                                                        .filter((title) => title.post_type === 'custom_post')
                                                        .map((title) => (
                                                            <MenuItem key={title.id} value={title.id}>
                                                                {title.post_title}
                                                            </MenuItem>
                                                        ))
                                                ) : (
                                                    <MenuItem disabled>No post types available</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Page Description"
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={4}
                                            name='page_description'
                                            InputLabelProps={{ shrink: true }}
                                            value={formData.page_description}
                                            onChange={(e) => setFormData({ ...formData, page_description: e.target.value })}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container justifyContent="flex-start" spacing={2} marginTop={3}>
                                    <Grid item>
                                        <Button variant="contained" color="primary" style={{ backgroundColor: "#2c9dd4" }} type="submit">
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }}
                                            onClick={() => navigate('/page-list')}>
                                            Cancel
                                        </Button>
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

export default PageEdit;

