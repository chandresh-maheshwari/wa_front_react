
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Container, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Authapi from '../Authapi';
import Expired from '../Login/ExpiredToken';
import { useParams, useNavigate } from 'react-router-dom';

const PostEditdata = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        image_url: '',
        post_type: '',
        ordering: '',
    });




    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0],
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    useEffect(() => {
        fetchData(id);
    }, [id]);

    const fetchData = async (id) => {
        try {
            const event = await Authapi.postEditData(id);
            if (event) {
                setFormData({
                    title: event.title || '',
                    description: event.description || '',
                    image_url: event.image_url || '',
                    post_type: event.post_type || '',
                    ordering: event.ordering || '',
                });
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to fetch data. Please try again.', 'error');
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('title', formData.title);
        formDataToSubmit.append('description', formData.description);
        formDataToSubmit.append('image', formData.image);
        formDataToSubmit.append('post_type', formData.post_type);
        formDataToSubmit.append('ordering', formData.ordering);

        try {
            const response = await Authapi.postupdate(id, formDataToSubmit);
            if (response) {
                Swal.fire('Success!', 'Home menu updated successfully!', 'success');
                navigate('/PostList');
            } else {
                Swal.fire('Error!', 'Failed to update Home menu. Please try again.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
        }
    };






    return (
        <>
            <Expired />
            <div className="container-fluid panel-header panel-header-sm"></div>
            <div className="col-md-12">
                <div className="row card mt-4" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">Post Edit</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form encType="multipart/form-data" id="servicesForm"
                                onSubmit={handleSubmit}
                            >
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label=" Title"
                                            type="text"
                                            required
                                            fullWidth
                                            margin="normal"
                                            name='title'
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label=" Image"
                                            type="file"
                                            fullWidth
                                            margin="normal"
                                            inputProps={{ accept: 'image/jpeg, image/png, image/jpg' }}
                                            InputLabelProps={{ shrink: true }}
                                            name='image'
                                            onChange={handleChange}
                                        />
                                        {console.log(formData.image_url)}
                                        {formData.image_url ? (
                                            formData.image_url instanceof File ? (
                                                <div>
                                                    <p>image: {formData.image_url}</p>

                                                </div>
                                            ) : (
                                                <div>
                                                    <p>Current image:{formData.image} </p>
                                                    <img
                                                        src={formData.image_url}
                                                        alt="Current image preview"
                                                        
                                                    />
                                                </div>
                                            )
                                        ) : null}
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label=" Description"
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            name='description'
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Ordering"
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            name='ordering'
                                            value={formData.ordering}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>Post_Type</InputLabel>
                                            <Select
                                                label="Post_Type"
                                                name='post_type'
                                                value={formData.post_type}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="normal_post">Normal Post</MenuItem>
                                                <MenuItem value="custom_post">Custom Post</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid container justifyContent="flex-start" spacing={2} marginTop={3}>
                                    <Grid item>
                                        <Button variant="contained" color="primary" style={{ backgroundColor: "#2c9dd4" }} type="submit">
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }} type="button" onClick={() => navigate('/PostList')}>
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
}

export default PostEditdata