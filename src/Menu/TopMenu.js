import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    Container,
    TextField,
    Button,
    Grid,
    Typography,
} from '@mui/material';
import Authapi from '../Authapi';
import Topmanuedit from "./TopMenuEdit";
import Expired from '../Login/ExpiredToken';


const Topmanu = () => {
    const [formData, setFormData] = useState({
        site_logo_img: null,
        mts_logo_img: null,
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

    const [filter, setFilter] = useState([]);
    const [list, setList] = useState([]);

    useEffect(() => {
        showData();
    }, []);




    const showData = async () => {
        try {
            const response = await Authapi.durTime();
            const activeResults = response.results.filter(item => !item.isDeleted);
            setList(activeResults);
            setFilter(activeResults);
            if (response.status === true) {

            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setFilter([]);
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
        form.append('contact_us_button_name', formData.contact_us_button_name);
        form.append('contact_us_button_link', formData.contact_us_button_link);
        form.append('contact_us_button_color_code', formData.contact_us_button_color_code);
        form.append('contact_us_button_hover_color_code', formData.contact_us_button_hover_color_code);
        form.append('login_button_name', formData.login_button_name);
        form.append('login_button_link', formData.login_button_link);
        form.append('login_button_color_code', formData.login_button_color_code);
        form.append('login_button_hover_color_code', formData.login_button_hover_color_code);

        try {
            const response = await Authapi.add(form);
            if (response && !response.error) {
                Swal.fire('Success!', 'Data added successfully.', 'success');
                await showData();
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
            contact_us_button_name: '',
            contact_us_button_link: '',
            contact_us_button_color_code: '',
            contact_us_button_hover_color_code: '',
            login_button_name: '',
            login_button_link: '',
            login_button_color_code: '',
            login_button_hover_color_code: '',
        });
    };

    return (
        <>
            {/* {console.log(formData.site_logo_img)} */}
            <Expired />
            {list.length === 0 ? (
                <div className="col-md-12">
                    <div className="row card" style={{ marginLeft: "22%", width: "75%", marginTop: "10%" }}>
                        <div className="card-header">
                            <h5 className="title">Top Menu</h5>
                        </div>
                        <div className="card-body">

                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Container>
                                    <Grid container spacing={3}>
                                        {/* Site Logo Section */}
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h6">Site Logo</Typography>
                                            <input
                                                type="file"
                                                name="site_logo_img"
                                                onChange={handleChange}
                                                accept='.png, .jpeg, .jpg'
                                            />
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

                                        {/* MTS Logo Section */}
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="h6">MTS Logo</Typography>
                                            <input
                                                type="file"
                                                name="mts_logo_img"
                                                onChange={handleChange}
                                                accept='.png, .jpeg, .jpg'
                                            />
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
                                                label="MTS Group Text 1"
                                                name="mts_group_text1"
                                                value={formData.mts_group_text1}
                                                onChange={handleChange}
                                                type="text"
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="MTS Group Text 2"
                                                name="mts_group_text2"
                                                value={formData.mts_group_text2}
                                                onChange={handleChange}
                                                type="text"
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
                                                fullWidth
                                                margin="normal"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Contact Button Color Code"
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
                                                label="Contact Button Hover Color Code"
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

                                    <Grid container spacing={2} marginTop={3}>
                                        <Grid item>
                                            <Button variant="contained" type="submit" style={{ backgroundColor: "#2c9dd4" }}>
                                                Submit
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button style={{ backgroundColor: "rgb(212 44 42)", color: "white" }} onClick={resetForm}>
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Container>
                            </form>

                        </div>
                    </div>
                </div >
            ) : (
                <Topmanuedit />
            )}
        </>
    );
};

export default Topmanu;
