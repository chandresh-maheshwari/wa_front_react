import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Container, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Authapi from '../Authapi';
import Expired from '../Login/ExpiredToken';
import { useNavigate } from 'react-router-dom';

const PostDataForm = () => {

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        post_type: '',
        ordering: '',
        is_active: 1
    });

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = new FormData();
        form.append('title', formData.title);
        form.append('description', formData.description);
        form.append('ordering', formData.ordering);
        form.append('post_type', formData.post_type);
        form.append('is_active', formData.is_active);
        if (formData.image) {
            form.append('image', formData.image);
        }
        try {
            const res = await Authapi.poststore(form);

            if (res.status === true) {
                Swal.fire('Success', 'Data submitted successfully!', 'success');
                navigate('/PostList');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            Swal.fire('Error', 'There was an issue with your submission.', 'error');
        }
    };

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

    return (
        <>
            <Expired />
            <div className="container-fluid panel-header panel-header-sm"></div>
            <div className="col-md-12">
                <div className="row card mt-4" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">Post</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form encType="multipart/form-data" id="servicesForm" onSubmit={handleSubmit}>
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
                                        <Button style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }} type="button">
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

export default PostDataForm;
