import React, { useState } from 'react';

import Swal from 'sweetalert2';
import { Container, TextField, Button, Grid } from '@mui/material';
import Authapi from '../Authapi';
import './Navbar.css';
import Expired from '../Login/ExpiredToken';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const [navTitle, setNavTitle] = useState('');
    const [navUrl, setNavUrl] = useState('');
    const [ordering, setOrdering] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();

        const navbarData = {
            nav_menu_name: navTitle,
            nav_menu_link: navUrl,
            menu_ordering: ordering,
        };

        try {
            const response = await Authapi.navbarstore(navbarData);
            console.log(response);
            if (response) {
                Swal.fire('Success', 'NavBar item added successfully!', 'success');
                navigate('/NabarList');
                // fetchData();
            } else {
                Swal.fire('Error', 'Failed to add NavBar item.', 'error');
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
                        <h5 className="title">NavBar</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form onSubmit={handleSubmit} encType="multipart/form-data" id="servicesForm">
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Nav Menu Title"
                                            type="text"
                                            required
                                            fullWidth
                                            margin="normal"
                                            value={navTitle}
                                            onChange={(e) => setNavTitle(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Nav Menu Title Link URL"
                                            type="url"
                                            placeholder="http://example.com"
                                            fullWidth
                                            margin="normal"
                                            value={navUrl}
                                            onChange={(e) => setNavUrl(e.target.value)}
                                            inputProps={{
                                                pattern: "https?://.+",
                                            }}
                                            helperText="Please enter a valid URL starting with http:// or https://."
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Ordering"
                                        type="text"
                                        fullWidth
                                        margin="normal"
                                        value={ordering}
                                        onChange={(e) => setOrdering(e.target.value)}
                                    />
                                </Grid>
                                <Grid container justifyContent="flex-start" spacing={2} marginTop={3}>
                                    <Grid item>
                                        <Button variant="contained" color="primary" style={{ backgroundColor: "#2c9dd4" }} type="submit">
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }}>
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

export default Navbar;

