import { Container, TextField, Button, Grid, Box } from '@mui/material';
import Authapi from '../Authapi';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Expired from '../Login/ExpiredToken';

const ImpoveData = () => {

    const [formData, setFormData] = useState({
        protections_description: '',
        button_name: '',
        button_link: '',
    });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData1 = {
            protections_description: formData.protections_description,
            button_name: formData.button_name,
            button_link: formData.button_link,
        };
        try {
            const res = await Authapi.improveStoreData(formData1);
            console.log(res);
            if (res) {
                Swal.fire('Success', 'Data submitted successfully!', 'success');
                navigate('/ImpoveDataList');
                setFormData({
                    protections_description: '',
                    button_name: '',
                    button_link: '',
                })
            }
        } catch (error) {
            console.error('Error saving data:', error);
            Swal.fire('Error', 'There was an issue with your submission.', 'error');
        }
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setFormData({
            name: '',
            account_title: '',
            account_description: '',
        });
    };




    return (
        <>
            <Expired />

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
                                            style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }} s
                                            onClick={handleCancel}
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

export default ImpoveData 