
import React from 'react'
import { useState, useEffect } from 'react';
import { Container, TextField, Button, Grid } from '@mui/material';
import Authapi from '../Authapi';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

import Expired from '../Login/ExpiredToken';


const QuoteEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        designation: '',
        company_name: '',
    })

    useEffect(() => {
        fetchData(id);
    }, [id]);


    const fetchData = async (id) => {
        try {
            const event = await Authapi.quoteEditData(id);
            if (event) {
                setFormData({
                    title: event.title || '',
                    designation: event.designation || '',
                    company_name: event.company_name || '',

                });
            }
        } catch (error) {
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
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('title', formData.title);
        formDataToSubmit.append('designation', formData.designation);
        formDataToSubmit.append('company_name', formData.company_name);
        try {
            const response = await Authapi.getquoteupdate(id, formDataToSubmit);

            if (response) {
                Swal.fire('Success!', 'Quote Section updated successfully!', 'success');
                navigate('/Quote');
            } else {
                Swal.fire('Error!', 'Failed to update Quote Section. Please try again.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
        }
    };





    return (
        <>
        <Expired/>

            <div className="col-md-12">
                <div className="row card " style={{ marginLeft: "22%", width: "75%", marginBottom: "20px", marginTop: "10%" }}>
                    <div className="card-header">
                        <h5 className="title">Quote Section</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form encType="multipart/form-data" id="servicesForm" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label=" Quote  Title"
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            value={formData.title}
                                            onChange={handleInputChange('title')}

                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Quote Designation "
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            value={formData.designation}
                                            onChange={handleInputChange('designation')}


                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Company Name"
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            value={formData.company_name}
                                            onChange={handleInputChange('company_name')}

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
                                            onClick={() => navigate('/QuoteList')}>
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

export default QuoteEditForm