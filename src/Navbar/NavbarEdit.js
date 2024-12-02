import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, TextField, Button, Grid } from '@mui/material';
import Authapi from '../Authapi';

const NavbarEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nav_menu_name: '',
        nav_menu_link: '',
        menu_ordering: '',
    });

    useEffect(() => {
        fetchNavbar(id);
    }, [id]);

    const fetchNavbar = async (id) => {
        try {
            const event = await Authapi.getEditData(id);
            if (event) {
                setFormData({
                    nav_menu_name: event.nav_menu_name || '',
                    nav_menu_link: event.nav_menu_link || '',
                    menu_ordering: event.menu_ordering || '',
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error!', 'Failed to fetch data. Please try again.', 'error');
        }
    };

    const handleInputChange = (field) => (event) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: event.target.value,
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await Authapi.getupdate(id, formData);
            if (response) {
                Swal.fire('Success!', 'Navbar menu updated successfully!', 'success');
                navigate('/NabarList');
            } else {
                Swal.fire('Error!', 'Failed to update navbar menu. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Failed to submit data', error);
            Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
        }
    };

    return (
        <div>

            <div className="col-md-12">
                <div className="row card " style={{ marginLeft: "22%", width: "75%", marginBottom: "20px", marginTop: "10%" }}>
                    <div className="card-header">
                        <h5 className="title">Navbar Edit Menu</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Nav Menu Title"
                                            type="text"
                                            required
                                            fullWidth
                                            margin="normal"
                                            value={formData.nav_menu_name}
                                            onChange={handleInputChange('nav_menu_name')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Nav Menu Title Link URL"
                                            type="url"
                                            placeholder="http://example.com"
                                            fullWidth
                                            margin="normal"
                                            value={formData.nav_menu_link}
                                            onChange={handleInputChange('nav_menu_link')}
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
                                        value={formData.menu_ordering}
                                        onChange={handleInputChange('menu_ordering')}
                                    />
                                </Grid>
                                <Grid container justifyContent="flex-start" spacing={2} marginTop={3}>
                                    <Grid item>
                                        <Button variant="contained" color="primary" type="submit">
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }}
                                            onClick={() => navigate('/NabarList')}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavbarEdit;
