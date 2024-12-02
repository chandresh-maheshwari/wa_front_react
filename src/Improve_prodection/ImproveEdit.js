

import React from 'react'
import { useState, useEffect } from 'react';
import { Container, TextField, Button, Grid } from '@mui/material';
import Authapi from '../Authapi';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';


const ImpoveDataEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        protections_description: '',
        button_name: '',
        button_link: '',
    })

    useEffect(() => {
        fetchData(id);
    }, [id]);


    const fetchData = async (id) => {
        try {
            const event = await Authapi.improveEditData(id);
            if (event) {
                setFormData({
                    protections_description: event.protections_description || '',
                    button_name: event.button_name || '',
                    button_link: event.button_link || '',
                });
            }
        } catch (error) {
            Swal.fire('Error!', 'Failed to fetch data. Please try again.', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('protections_description', formData.protections_description);
        formDataToSubmit.append('button_name', formData.button_name);
        formDataToSubmit.append('button_link', formData.button_link);
        try {
            const response = await Authapi.improveupdate(id, formDataToSubmit);

            if (response) {
                Swal.fire('Success!', 'Improve envirmental Protection updated successfully!', 'success');
                navigate('/Improve');
            } else {
                Swal.fire('Error!', 'Failed to update Improve envirmental Protection. Please try again.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
        }
    };




    return (
        <>
            <div className="col-md-12">
                <div className="row card" style={{ marginLeft: '22%', width: '75%', marginBottom: '20px', marginTop: '10%' }}>

                    <div className="card-header">
                        <h5 className="title">Improve envirmental Protection </h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form encType="multipart/form-data" id="servicesForm"
                                onSubmit={handleSubmit}
                            >
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Protections Description"
                                            type="text"
                                            required
                                            fullWidth
                                            multiline
                                            rows={4}
                                            margin="normal"
                                            value={formData.protections_description}
                                            onChange={handleChange}
                                            name="protections_description"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Button Name"
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            value={formData.button_name}
                                            onChange={handleChange}
                                            name="button_name"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>

                                        <TextField
                                            label="Button Link "
                                            type="url"
                                            placeholder="http://example.com"
                                            fullWidth
                                            margin="normal"
                                            name="button_link"
                                            value={formData.button_link}
                                            onChange={handleChange}
                                            inputProps={{
                                                pattern: "https?://.+",
                                            }}
                                            helperText="Please enter a valid URL starting with http:// or https://."
                                        />
                                    </Grid>
                                </Grid>


                                <Grid container justifyContent="flex-start" spacing={2} marginTop={3}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ backgroundColor: '#2c9dd4' }}
                                            type="submit"
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }}
                                            onClick={() => navigate('/ImproveList')}>

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
    )
}

export default ImpoveDataEdit 