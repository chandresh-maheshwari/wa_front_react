import { Container, TextField, Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import Authapi from '../Authapi';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


import Expired from '../Login/ExpiredToken';
const ProducerForm = () => {

    const [formData, setFormData] = useState({
        section_title: '',
        section_image: null,
        producer_title: '',
        producer_description: '',
        receiver_title: '',
        receiver_description: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0]
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { section_title, section_image, producer_title, producer_description, receiver_title, receiver_description } = formData;
        const formPayload = new FormData();
        formPayload.append('section_title', section_title);
        formPayload.append('section_image', section_image);
        formPayload.append('producer_title', producer_title);
        formPayload.append('producer_description', producer_description);
        formPayload.append('receiver_title', receiver_title);
        formPayload.append('receiver_description', receiver_description);

        try {
            const response = await Authapi.p_reciverstore(formPayload);
            if (response) {
                Swal.fire('Success', 'Data submitted successfully!', 'success');
                navigate('/producerList');
                setFormData({
                    section_title: '',
                    section_image: null,
                    producer_title: '',
                    producer_description: '',
                    receiver_title: '',
                    receiver_description: '',
                });
                // section_title:'',
            }
        } catch (error) {
            console.error("API Error:", error);
            Swal.fire('Error', 'There was an issue with your submission.', 'error');
        }
    };





    return (
        <>
            <Expired />
            <div className="col-md-12">
                <div className="row card" style={{ marginLeft: "22%", width: "75%", marginTop: "10%", marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">Product Receiver</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form encType="multipart/form-data" id="servicesForm" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Section Title"
                                            type="text"
                                            required
                                            fullWidth
                                            margin="normal"
                                            name="section_title"
                                            value={formData.section_title}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Section Image"
                                            type="file"
                                            fullWidth
                                            margin="normal"
                                            inputProps={{ accept: 'image/jpeg, image/png, image/jpg' }}
                                            InputLabelProps={{ shrink: true }}
                                            name="section_image"
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Producer Title"
                                            type="text"
                                            required
                                            fullWidth
                                            margin="normal"
                                            name="producer_title"
                                            value={formData.producer_title}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Producer Description"
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            name="producer_description"
                                            value={formData.producer_description}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Receiver Title"
                                            type="text"
                                            required
                                            fullWidth
                                            margin="normal"
                                            name="receiver_title"
                                            value={formData.receiver_title}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Receiver Description"
                                            type="text"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            name="receiver_description"
                                            value={formData.receiver_description}
                                            onChange={handleChange}
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
                                        <Button
                                            style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }}
                                            onClick={() => setFormData({
                                                section_title: '',
                                                section_image: null,
                                                producer_title: '',
                                                producer_description: '',
                                                receiver_title: '',
                                                receiver_description: ''
                                            })}
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
        </>
    );
};

export default ProducerForm;
