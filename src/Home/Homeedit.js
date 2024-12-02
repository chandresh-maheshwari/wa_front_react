import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, TextField, Button, Grid } from '@mui/material';
import Authapi from '../Authapi';
import Expired from '../Login/ExpiredToken';

const HomeEditform = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        home_section_title: '',
        home_section_description: '',
        home_section_button_name: '',
        home_section_button_name_link: '',
        home_section_img: '',
        home_section_img_url: '',
    });
    const [homeImage, setHomeImage] = useState(null);

    useEffect(() => {
        fetchNavbar(id);
    }, [id]);

    const fetchNavbar = async (id) => {
        try {
            const event = await Authapi.homeEditData(id);
            if (event) {
                setFormData({
                    home_section_img_url: event.home_section_img_url || '',
                    home_section_title: event.home_section_title || '',
                    home_section_description: event.home_section_description || '',
                    home_section_button_name: event.home_section_button_name || '',
                    home_section_button_name_link: event.home_section_button_name_link || '',
                });
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to fetch data. Please try again.', 'error');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('home_section_img', homeImage);
        formDataToSubmit.append('home_section_title', formData.home_section_title);
        formDataToSubmit.append('home_section_description', formData.home_section_description);
        formDataToSubmit.append('home_section_button_name', formData.home_section_button_name);
        formDataToSubmit.append('home_section_button_name_link', formData.home_section_button_name_link);

        try {
            const response = await Authapi.homegetupdate(id, formDataToSubmit);
            if (response) {
                Swal.fire('Success!', 'Home menu updated successfully!', 'success');
                navigate('/HomeList');
            } else {
                Swal.fire('Error!', 'Failed to update Home menu. Please try again.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (file && allowedTypes.includes(file.type)) {
            setHomeImage(file);
        } else {
            Swal.fire('Error', 'Please upload a valid image file (JPG, JPEG, or PNG).', 'error');
            e.target.value = '';
        }
    };

    const handleInputChange = (field) => (event) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: event.target.value,
        }));
    };

    return (
        <>
            <Expired />
            <div className="col-md-12">
                <div className="row card " style={{ marginLeft: "22%", width: "75%", marginTop: '10%', marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">Edit Menu</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Home Image"
                                            type="file"
                                            fullWidth
                                            margin="normal"
                                            className="form-control-file"
                                            onChange={handleFileChange}
                                            inputProps={{ accept: 'image/jpeg, image/png, image/jpg' }}
                                        />
                                        {formData.home_section_img_url ? (
                                            formData.home_section_img_url instanceof File ? (
                                                <div>
                                                    <p>Image: {formData.home_section_img_url.name}</p>

                                                </div>
                                            ) : (
                                                <div>
                                                    <p>Current Image: </p>
                                                    <img
                                                        src={formData.home_section_img_url}
                                                        alt="Current image preview"
                                                        width="100"
                                                    />
                                                </div>
                                            )
                                        ) : null}
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Home Title"
                                            type="text"
                                            required
                                            fullWidth
                                            value={formData.home_section_title}
                                            onChange={handleInputChange('home_section_title')}
                                            margin="normal"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Home Description"
                                            type="text"
                                            fullWidth
                                            value={formData.home_section_description}
                                            onChange={handleInputChange('home_section_description')}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Home Button Name"
                                            type="text"
                                            fullWidth
                                            value={formData.home_section_button_name}
                                            onChange={handleInputChange('home_section_button_name')}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Home Button Link URL"
                                            type="url"
                                            placeholder="http://example.com"
                                            fullWidth
                                            value={formData.home_section_button_name_link}
                                            onChange={handleInputChange('home_section_button_name_link')}
                                            inputProps={{
                                                pattern: "https?://.+",
                                            }}
                                            helperText="Please enter a valid URL starting with http:// or https://."
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
                                            onClick={() => navigate('/HomeList')}>
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

export default HomeEditform;
