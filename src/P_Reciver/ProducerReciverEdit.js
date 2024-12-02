
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Grid } from '@mui/material';
import Authapi from '../Authapi';
import Swal from 'sweetalert2';
import Expired from '../Login/ExpiredToken';





const ReciversrEditForm = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        section_title: '',
        section_image: null,
        producer_title: '',
        producer_description: '',
        receiver_title: '',
        receiver_description: '',
        section_img_url: ''
    });
    const [homeImage, setHomeImage] = useState(null);

    useEffect(() => {
        fetchData(id);
    }, [id]);

    const fetchData = async (id) => {
        try {
            const event = await Authapi.getreciverEdit(id);
            if (event) {
                setFormData({
                    section_title: event.section_title || '',
                    section_img_url: event.section_img_url || '',
                    producer_title: event.producer_title || '',
                    producer_description: event.producer_description || '',
                    receiver_title: event.receiver_title || '',
                    receiver_description: event.receiver_description || '',
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error!', 'Failed to fetch data. Please try again.', 'error');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        if (homeImage) {
            formDataToSend.append('section_image', homeImage);
        }

        try {
            const response = await Authapi.getreciverupdate(id, formDataToSend);
            if (response) {
                Swal.fire('Success!', 'Receiver and Producer Section updated successfully!', 'success');
                navigate('/ProducerForm');
            } else {
                Swal.fire('Error!', 'Failed to update Receiver and Producer Section. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Failed to submit data', error);
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
                <div className="row card" style={{ marginLeft: "22%", width: "75%", marginTop: "10%", marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">Product_Receiver</h5>
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
                                            onChange={handleInputChange("section_title")}

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
                                            onChange={handleFileChange}
                                        />
                                        {homeImage ? (
                                            <div>
                                                <p>Image: {homeImage.name}</p>
                                                <img
                                                    src={URL.createObjectURL(homeImage)}
                                                    alt="Selected preview"
                                                    width="100"
                                                />
                                            </div>
                                        ) : formData.section_img_url ? (
                                            <div>
                                                <p>Current Image:{formData.section_img_url}</p>
                                                <img
                                                    src={formData.section_img_url}
                                                    alt="Current Section imge"
                                                    width="100"
                                                />
                                            </div>
                                        ) : null}
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
                                            onChange={handleInputChange('producer_title')}


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
                                            onChange={handleInputChange("producer_description")}


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
                                            onChange={handleInputChange('receiver_title')}


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
                                            onChange={handleInputChange("receiver_description")}


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
                                            onClick={() => navigate('/ProducerList')}
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
    )



}

export default ReciversrEditForm