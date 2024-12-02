import React, { useState } from 'react';
import { Container, TextField, Button, Grid } from '@mui/material';
import Authapi from '../Authapi';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Expired from '../Login/ExpiredToken';
const Quote = () => {

  const [formData, setFormData] = useState({
    title: '',
    designation: '',
    company_name: '',
  });
  const navigate = useNavigate();




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
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('designation', formData.designation);
    formDataToSubmit.append('company_name', formData.company_name);

    try {
      const response = await Authapi.quotestoredata(formDataToSubmit);
      if (response) {
        Swal.fire('Success', 'Data submitted successfully!', 'success');
        navigate('/QuoteList');
        setFormData({
          title: '',
          designation: '',
          company_name: '',
        })

      }
    } catch (error) {
      console.error('API Error:', error);
      Swal.fire('Error', 'There was an issue with your submission.', 'error');
    }
  };











  return (
    <>
      <Expired />

      <div className="col-md-12">
        <div className="row card" style={{ marginLeft: '22%', width: '75%', marginBottom: '20px', marginTop: '10%' }}>
          <div className="card-header">
            <h5 className="title">Quote Section</h5>
          </div>
          <div className="card-body">
            <Container>
              <form encType="multipart/form-data" id="servicesForm" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Quote Title"
                      type="text"
                      fullWidth
                      margin="normal"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Quote Designation"
                      type="text"
                      fullWidth
                      margin="normal"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Company Name"
                      type="text"
                      fullWidth
                      margin="normal"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Grid container justifyContent="flex-start" spacing={2} marginTop={3}>
                  <Grid item>
                    <Button variant="contained" color="primary" style={{ backgroundColor: '#2c9dd4' }} type="submit">
                      Submit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      style={{ backgroundColor: 'rgb(212 44 42)', color: 'white', marginLeft: "-10px" }}
                      type="button"
                      onClick={() => setFormData({ title: '', designation: '', company_name: '' })}
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

export default Quote;
