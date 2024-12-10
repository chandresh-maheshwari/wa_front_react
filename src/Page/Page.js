import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';
import { TextField, Button, Container, MenuItem, Select, InputLabel, FormControl, Grid, Typography } from '@mui/material';
import Authapi from '../Authapi';

import Expired from '../Login/ExpiredToken';
import { useNavigate } from 'react-router-dom';


const Page = () => {
    const [formData, setFormData] = useState({});
    const [postTitles, setPostTitles] = useState([]);
    const [errors, setErrors] = useState({});
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!formData.page_name) newErrors.page_name = "Page Name is required.";
        if (!formData.page_description) newErrors.page_description = "Page Description is required.";
        if (!formData.ordering) newErrors.ordering = "Ordering is required.";
        if (!formData.image) newErrors.image = "Image is required.";
        if (!formData.post_type) newErrors.post_type = "Post Type is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const form = new FormData();
        form.append('page_name', formData.page_name);
        form.append('page_description', formData.page_description);
        form.append('image', formData.image);
        form.append('ordering', formData.ordering);
        form.append('post_type', formData.post_type);
        try {
            const response = await Authapi.Pagestoredata(form);
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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
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
                                            label="Page Name"
                                            name='page_name'
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            onChange={handleChange}
                                            value={formData.page_name}
                                            error={!!errors.page_name}
                                            helperText={errors.page_name}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Ordering"
                                            type="number"
                                            fullWidth
                                            margin="normal"
                                            name='ordering'
                                            onChange={handleChange}
                                            value={formData.ordering}
                                            error={!!errors.ordering}
                                            helperText={errors.ordering}
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
                                            onChange={handleChange}
                                            error={!!errors.image}
                                            helperText={errors.image}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth style={{ marginBottom: '15px' }}>
                                            <InputLabel>Post Type</InputLabel>
                                            <Select
                                                label="Post Type"
                                                name="post_type"
                                                value={formData.post_type || ''}
                                                onChange={handleChange}
                                                fullWidth
                                                style={{
                                                    backgroundColor: '#f4f6f8',
                                                    borderRadius: '5px'
                                                }}
                                                error={!!errors.post_type}
                                            >
                                                {console.log(postTitles)}
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
                                            {errors.post_type && <Typography color="error">{errors.post_type}</Typography>}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Page Description"
                                            name='page_description'
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={4}
                                            onChange={handleChange}
                                            value={formData.page_description}
                                            error={!!errors.page_description}
                                            helperText={errors.page_description}
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
                                        onClick={()=>navigate('/page-list')}>
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

export default Page;

