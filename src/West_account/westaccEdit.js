
import React from 'react'
import { useState, useEffect } from 'react';
import { Container, TextField, Button, Grid } from '@mui/material';
import Authapi from '../Authapi';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';




const WestAccountEdit = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        account_title: '',
        account_description: '',
    })



    useEffect(() => {
        fetchData(id);
    }, [id]);


    const fetchData = async (id) => {
        try {
            const event = await Authapi.westEditData(id);
            if (event) {
                setFormData({
                    name: event.name || '',
                    account_title: event.account_title || '',
                    account_description: event.account_description || '',

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
        formDataToSubmit.append('name', formData.name);
        formDataToSubmit.append('account_title', formData.account_title);
        formDataToSubmit.append('account_description', formData.account_description);
        try {
            const response = await Authapi.westupdate(id, formDataToSubmit);

            if (response) {
                Swal.fire('Success!', 'Choose West Account updated successfully!', 'success');
                navigate('/Westacc');
            } else {
                Swal.fire('Error!', 'Failed to update Choose West Account. Please try again.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
        }
    };




    return (
        <>

            <div className="col-md-12">
                <div className="row card " style={{ marginLeft: "22%", width: "75%", marginBottom: "20px", marginTop: "10%" }}>
                    <div className="card-header">
                        <h5 className="title">choose Waste  Acccount</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form encType="multipart/form-data" id="servicesForm" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Waste  Acccount Name"
                                            type="text"
                                            required
                                            fullWidth
                                            margin="normal"
                                            value={formData.name}
                                            onChange={handleChange}
                                            name='name'

                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Waste  Acccount Title"
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            value={formData.account_title}
                                            onChange={handleChange}
                                            name='account_title'



                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Waste  Acccount Description"
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={4}
                                            value={formData.account_description}
                                            onChange={handleChange}
                                            name='account_description'




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
                                        <Button style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }} onClick={ ()=>  navigate('/WasteList')}>
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

export default WestAccountEdit