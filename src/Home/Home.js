import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Container, TextField, Button, Grid } from '@mui/material';
import Authapi from '../Authapi';
import Expired from '../Login/ExpiredToken';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const [homeImage, setHomeImage] = useState(null);
    const [homeTitle, setHomeTitle] = useState('');
    const [homeDescription, setHomeDescription] = useState('');
    const [homeButtonName, setHomeButtonName] = useState('');
    const [homeButtonUrl, setHomeButtonUrl] = useState('');
    const navigate = useNavigate();


    // console.log(homeImage);
    // console.log(homeTitle);
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('home_section_img', homeImage);
        formData.append('home_section_title', homeTitle);
        formData.append('home_section_description', homeDescription);
        formData.append('home_section_button_name', homeButtonName);
        formData.append('home_section_button_name_link', homeButtonUrl);

        // console.log(homeImage);
        try {
            const response = await Authapi.homestore(formData);
            console.log(formData);
            if (response) {
                Swal.fire('Success', 'Data submitted successfully!', 'success');
                navigate('/HomeList');
            }
        } catch (error) {
            console.error("API Error:", error);
            Swal.fire('Error', 'There was an issue with your submission.', 'error');
        }
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (file && allowedTypes.includes(file.type)) {
            setHomeImage(file);
        } else {
            Swal.fire('Error', 'Please upload a valid image file (JPG, JPEG, or PNG).', 'error');
            e.target.value = '';
        }
    };




    return (
        <>
            {/* {console.log(homeImage)} */}
            <Expired />
            <div className="container-fluid panel-header panel-header-sm"></div>
            <div className="col-md-12">
                <div className="row card mt-4" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px" }}>
                    <div className="card-header">
                        <h5 className="title">Home</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form encType="multipart/form-data" id="servicesForm" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Home Image"
                                            type="file"
                                            fullWidth
                                            margin="normal"
                                            inputProps={{ accept: 'image/jpeg, image/png, image/jpg' }}
                                            onChange={handleImageChange}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Home Title"
                                            type="text"
                                            required
                                            fullWidth
                                            margin="normal"
                                            value={homeTitle}
                                            onChange={(e) => setHomeTitle(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>

                                        <TextField
                                            label="Home Description"
                                            type="text"
                                            fullWidth
                                            value={homeDescription}
                                            onChange={(e) => setHomeDescription(e.target.value)}
                                            multiline
                                            rows={4}
                                        />


                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Home Button Name"
                                            type="text"
                                            fullWidth
                                            value={homeButtonName}
                                            onChange={(e) => setHomeButtonName(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Home Button Link URL"
                                            type="url"
                                            placeholder="http://example.com"
                                            fullWidth
                                            value={homeButtonUrl}
                                            onChange={(e) => setHomeButtonUrl(e.target.value)}
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
                                        <Button style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }} >
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

export default Home;
