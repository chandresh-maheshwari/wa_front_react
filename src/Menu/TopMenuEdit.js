import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    Container,
    TextField,
    Button,
    Grid,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Authapi from '../Authapi';
import { Link } from "react-router-dom";
import Expired from '../Login/ExpiredToken';

const Topmanuedit = () => {
    const [formData, setFormData] = useState({
        site_logo_img: '',
        site_logo_img_url: '',
        mts_logo_img_url: '',
        mts_logo_img: '',
        site_logo_img_link: '',
        mts_logo_img_link: '',
        mts_group_text1: '',
        mts_group_text2: '',
        contact_us_button_name: '',
        contact_us_button_link: '',
        contact_us_button_color_code: '',
        contact_us_button_hover_color_code: '',
        login_button_name: '',
        login_button_link: '',
        login_button_color_code: '',
        login_button_hover_color_code: '',
    });

    const [editMode, setEditMode] = useState(false);
    const [homeImage, setHomeImage] = useState(null);
    const [mtsImage, setMtsImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        showData();
    }, []);

    const showData = async () => {
        try {
            const event = await Authapi.getItemById();
            setFormData({
                site_logo_img_url: event.site_logo_img_url || '',
                mts_logo_img_url: event.mts_logo_img_url || '',
                site_logo_img_link: event.site_logo_img_link || '',
                mts_logo_img_link: event.mts_logo_img_link || '',
                mts_group_text1: event.mts_group_text1 || '',
                mts_group_text2: event.mts_group_text2 || '',
                contact_us_button_name: event.contact_us_button_name || '',
                contact_us_button_link: event.contact_us_button_link || '',
                contact_us_button_color_code: event.contact_us_button_color_code || '',
                contact_us_button_hover_color_code: event.contact_us_button_hover_color_code || '',
                login_button_name: event.login_button_name || '',
                login_button_link: event.login_button_link || '',
                login_button_color_code: event.login_button_color_code || '',
                login_button_hover_color_code: event.login_button_hover_color_code || '',

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

    const handleFileChange = (e, setImage, fieldName) => {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (file && allowedTypes.includes(file.type)) {
            setImage(file);
            setFormData(prev => ({
                ...prev,
                [fieldName]: file
            }));
        } else {
            Swal.fire('Error', 'Please upload a valid image file (JPG, JPEG, or PNG).', 'error');
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        // console.log(form);


        Object.keys(formData).forEach(key => {

            if (key === 'site_logo_img' && homeImage) {
                form.append(key, homeImage);
            } else if (key === 'mts_logo_img' && mtsImage) {
                form.append(key, mtsImage);
            } else {
                form.append(key, formData[key]);
            }
        });

        try {
            let response;

            if (editMode) {
                response = await Authapi.update(form, homeImage || mtsImage);
            }

            if (response && !response.error) {
                Swal.fire('Success!', `Data ${editMode ? 'updated' : 'added'} successfully.`, 'success')
                    .then(() => navigate('/topmenu'));
            } else {
                throw new Error(response.message || 'Failed to store data');
            }
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire('Error!', `Failed to ${editMode ? 'update' : 'save'} data. Please try again.`, 'error');
        }
    };


    return (
        <>
            <Expired />
            <div className="col-md-12">
                <div className="row card" style={{ marginLeft: "22%", width: "75%", marginTop: "10%", marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">Top Edit Menu</h5>
                    </div>
                    <div className="card-body">

                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <Container>
                                <Grid container spacing={3}>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Site Logo"
                                            type="file"
                                            fullWidth
                                            margin="normal"
                                            onChange={(e) => handleFileChange(e, setHomeImage, 'site_logo_img')}
                                            inputProps={{ accept: 'image/jpeg, image/png, image/jpg' }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        {(homeImage || formData.site_logo_img_url) && (
                                            <div>
                                                <p>Current Image:</p>
                                                <img
                                                    src={homeImage ? URL.createObjectURL(homeImage) : formData.site_logo_img_url}
                                                    alt="Site logo preview"
                                                    width="100"
                                                />
                                            </div>
                                        )}
                                    </Grid>


                                    <Grid item xs={12} sm={6}>
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
                                        <TextField
                                            label="MTS Logo"
                                            type="file"
                                            fullWidth
                                            margin="normal"
                                            onChange={(e) => handleFileChange(e, setMtsImage, 'mts_logo_img')}
                                            inputProps={{ accept: 'image/jpeg, image/png, image/jpg' }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        {(mtsImage || formData.mts_logo_img_url) && (
                                            <div>
                                                <p>Current Image:</p>
                                                <img
                                                    src={mtsImage ? URL.createObjectURL(mtsImage) : formData.mts_logo_img_url}
                                                    alt="MTS logo preview"
                                                    width="100"
                                                />
                                            </div>
                                        )}
                                    </Grid>


                                    <Grid item xs={12} sm={6}>
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
                            </Container>
                            <div className="card-header  mb-5" style={{ marginTop: "5%" }}>
                                <h5 className="title">Navbar Button Menu</h5>
                            </div>
                            <Container>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Contact Button Name"
                                            name="contact_us_button_name"
                                            value={formData.contact_us_button_name}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Enter text"
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Contact Button Link"
                                            name="contact_us_button_link"
                                            value={formData.contact_us_button_link}
                                            onChange={handleChange}
                                            type="url"
                                            placeholder="http://example.com"
                                            inputProps={{ pattern: "https?://.+" }}
                                            helperText="Please enter a valid URL starting with http:// or https://."
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Contact Button Colour Code"
                                            name="contact_us_button_color_code"
                                            value={formData.contact_us_button_color_code}
                                            onChange={handleChange}
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Contact Button Hover Colour Code"
                                            name="contact_us_button_hover_color_code"
                                            value={formData.contact_us_button_hover_color_code}
                                            onChange={handleChange}
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Login Button Name"
                                            name="login_button_name"
                                            value={formData.login_button_name}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Enter text"
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Login Button Link"
                                            name="login_button_link"
                                            value={formData.login_button_link}
                                            onChange={handleChange}
                                            type="url"
                                            placeholder="http://example.com"
                                            inputProps={{ pattern: "https?://.+" }}
                                            helperText="Please enter a valid URL starting with http:// or https://."
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Login Button Colour Code"
                                            name="login_button_color_code"
                                            value={formData.login_button_color_code}
                                            onChange={handleChange}
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Login Button Hover Colour Code"
                                            name="login_button_hover_color_code"
                                            value={formData.login_button_hover_color_code}
                                            onChange={handleChange}
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container justifyContent="flex-start" spacing={2} marginTop={3}>
                                    <Grid item>
                                        <Button variant="contained" style={{ backgroundColor: "#2c9dd4" }} type="submit">
                                            {editMode ? 'Submit' : 'Add'}
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Link to="/topmenu">
                                            <Button style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }}>
                                                Cancel
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Container>
                        </form>

                    </div>
                </div>
            </div >
        </>
    );
};

export default Topmanuedit;
