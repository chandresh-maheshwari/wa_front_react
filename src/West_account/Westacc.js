import { Container, TextField, Button, Grid } from '@mui/material';
import Authapi from '../Authapi';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import Expired from '../Login/ExpiredToken';

const WestAccount = () => {

    const [formData, setFormData] = useState({
        name: '',
        account_title: '',
        account_description: '',
    });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData1 = {
            name: formData.name,
            account_title: formData.account_title,
            account_description: formData.account_description,
        };
        try {
            const res = await Authapi.westStoreData(formData1);
            // console.log(res);
            if (res) {
                Swal.fire('Success', 'Data submitted successfully!', 'success');
                navigate('/WasteList');
                setFormData({
                    name: '',
                    account_title: '',
                    account_description: '',
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
                        <h5 className="title">Choose Waste  Account</h5>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form encType="multipart/form-data" id="servicesForm" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Waste  Account Name"
                                            type="text"
                                            required
                                            fullWidth
                                            margin="normal"
                                            value={formData.name}
                                            onChange={handleChange}
                                            name="name"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Waste  Account Title"
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            value={formData.account_title}
                                            onChange={handleChange}
                                            name="account_title"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Waste  Account Description"
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={4}
                                            value={formData.account_description}
                                            onChange={handleChange}
                                            name="account_description"
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
    );
};

export default WestAccount;
