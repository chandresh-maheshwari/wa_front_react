import React, { useState, useEffect } from 'react';
import Authapi from "../Authapi";
import { Typography, Container, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Radio, RadioGroup } from '@mui/material';
import Expired from '../Login/ExpiredToken';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../Custom.css";

const PostDynamicEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({});
    const [fields, setFields] = useState([]);
    const post_title = location.state?.post_title;

    useEffect(() => {
        fetchData();
    }, [post_title]);

    useEffect(() => {

        fetchEditData(id);

    }, [id]);


    const fetchData = async () => {
        try {
            const response = await Authapi.dynamifieldfetchdata(post_title);
            console.log("Fetched Fields:", response.data);
            setFields(response.data?.post_description || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // const fetchEditData = async (id) => {
    //     try {
    //         const response = await Authapi.postdynamicEditData(id);
    //         console.log("Fetched Edit Data:", response.data || {});
    //         setFormData(response.data  || {});
    //     } catch (error) {
    //         console.error('Error fetching edit data:', error);
    //     }
    // }
    const fetchEditData = async (id) => {
        console.log("Fetching edit data for ID:", id);
        try {
            const response = await Authapi.postdynamicEditData(id);
            setTimeout(() => {
                setFormData(response.data || {});
            }, 500);
            console.log("Fetched Edit Data:", response.data);
            console.log("Fetched Edit Data:", formData);

        } catch (error) {
            console.error('Error fetching edit data:', error);
        }
    }



    const hexToRgb = (hex) => {
        if (hex.length === 7) {
            let r = parseInt(hex.slice(1, 3), 16);
            let g = parseInt(hex.slice(3, 5), 16);
            let b = parseInt(hex.slice(5, 7), 16);
            return { r, g, b };
        }
        return { r: 0, g: 0, b: 0 };
    };

    useEffect(() => {
        if (fields.length > 0) {
            const initialFormData = fields.reduce((acc, field) => {
                acc[field.label] = field.value || '';
                return acc;
            }, {});
            setFormData(initialFormData);
        }
    }, [fields]);

    const handleInputChange = (fieldLabel, fieldType) => (event, option) => {
        let value = event.target.value;

        if (fieldType === 'file') {
            value = event.target.files[0];
        }

        if (fieldType === 'dropdown') {
            value = event.target.value.toLowerCase();
        }

        if (fieldType === 'checkbox') {
            const currentValues = formData[fieldLabel] || [];
            if (currentValues.includes(option)) {
                value = currentValues.filter(item => item !== option);
            } else {
                value = [...currentValues, option];
            }
        }

        setFormData(prevData => ({
            ...prevData,
            [fieldLabel]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitFormData = {
            ...formData
        }

        try {
            const response = await Authapi.postdynamicupdatedata(id, submitFormData);
            // console.log(response);
            if (response.status === true) {
                Swal.fire('Success', 'Data submitted successfully!', 'success');
                setFormData({});
                navigate('/post-list', { state: { post_title } });
            }
        } catch (error) {
            Swal.fire('Error', 'There was an issue with your submission.', 'error');
            console.error('Error submitting data:', error);
        }
    };


    return (
        <>
            <Expired />
            <div className="col-md-12">
                <div className="row card" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px", marginTop: "10%" }}>
                    <div className="card-header">
                        <Typography variant="h5" className="title" align="center">Post</Typography>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    {fields.map((field, index) => (
                                        <Grid item xs={12} sm={field.column || 6} key={index}>
                                            {field.type === 'dropdown' ? (
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel>{field.label}</InputLabel>
                                                    <Select
                                                        value={formData[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                    >
                                                        {field.options && field.options.map((option, idx) => (
                                                            <MenuItem key={idx} value={option.trim()}>
                                                                {option.trim()}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : field.type === 'checkbox' ? (
                                                <div>
                                                    <Typography variant="body1">{field.label}</Typography>
                                                    {field.options && field.options.map((option, idx) => (
                                                        <FormControlLabel
                                                            key={idx}
                                                            control={
                                                                <Checkbox
                                                                    checked={formData[field.label]?.includes(option) || false}
                                                                    onChange={(e) => handleInputChange(field.label, field.type)(e, option)}
                                                                    value={option}
                                                                />
                                                            }
                                                            label={option}
                                                        />
                                                    ))}
                                                </div>
                                            ) : field.type === 'radio' ? (
                                                <div>
                                                    <Typography variant="body1">{field.label}</Typography>
                                                    <RadioGroup
                                                        value={formData[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                    >
                                                        {field.options && field.options.map((option, idx) => (
                                                            <FormControlLabel
                                                                key={idx}
                                                                control={<Radio value={option} />}
                                                                label={option}
                                                            />
                                                        ))}
                                                    </RadioGroup>
                                                </div>
                                            ) : field.type === 'textarea' ? (
                                                <TextField
                                                    label={field.label}
                                                    value={formData[field.label] || ''}
                                                    onChange={handleInputChange(field.label, field.type)}
                                                    multiline
                                                    rows={4}
                                                    fullWidth
                                                    variant="outlined"
                                                    margin="normal"
                                                />
                                            ) : field.type === 'file' ? (
                                                // <div>
                                                //     <TextField
                                                //         label={field.label}
                                                //         type="file"
                                                //         onChange={handleInputChange(field.label, field.type)}
                                                //         fullWidth
                                                //         className='mt-5'
                                                //         InputLabelProps={{ shrink: true }}
                                                //     />
                                                //     {formData[field.label] instanceof File ? (
                                                //         <img
                                                //             src={URL.createObjectURL(formData[field.label])}
                                                //             alt="Preview"
                                                //             width="100"
                                                //         />
                                                //     ) : formData[field.label] ? (
                                                //         <>
                                                //             <p>Current image: {formData[field.label].split('/').pop()} </p>
                                                //             <img
                                                //                 src={formData[field.label]}
                                                //                 alt="Current Image"
                                                //                 width="100"
                                                //             />
                                                //         </>
                                                //     ) : null}
                                                // </div>
                                                <div>
                                                    <TextField
                                                        label={field.label}
                                                        type="file"
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        fullWidth
                                                        className='mt-5'
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                    {formData[field.label]?.image instanceof File ? ( // Check if the image is a File object
                                                        <img
                                                            src={URL.createObjectURL(formData[field.label].image)} // Use the image object for preview
                                                            alt="Preview"
                                                            width="100"
                                                        />
                                                    ) : typeof formData[field.label]?.image === 'string' ? ( // Check if the image is a string (URL)
                                                        <>
                                                            <p>Current image: {formData[field.label].image.split('/').pop()} </p>
                                                            <img
                                                                src={formData[field.label].image}
                                                                alt="Current Image"
                                                                width="100"
                                                            />
                                                        </>
                                                    ) : null}
                                                </div>
                                            ) : field.type === 'color' ? (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <TextField
                                                        label={field.label}
                                                        type="text" // Keep as text to show hex value
                                                        value={formData[field.label] || '#000000'}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        margin="normal"
                                                        style={{ width: '100%', marginRight: '10px' }}
                                                    // className='color-code'   


                                                    />
                                                    <TextField
                                                        type="color"
                                                        value={formData[field.label] || '#000000'}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        style={{
                                                            width: '50px', height: '50px', padding: '0', border: 'none', marginLeft: "-60px"
                                                        }}
                                                        className='color-code'
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    {console.log(formData[field.label]) || ''}
                                                    <TextField
                                                        fullWidth
                                                        label={field.label}
                                                        type={field.type}
                                                        variant="outlined"
                                                        value={formData[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        margin="normal"
                                                    // InputLabelProps={{ shrink: true }}
                                                    />
                                                </>
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>

                                <Grid container justifyContent="flex-start" spacing={2} marginTop={3}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ backgroundColor: "#2c9dd4" }}
                                            type="submit"
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }}
                                            type="button"
                                            onClick={() => (navigate('/post-list', { state: { post_title } }))}
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

export default PostDynamicEdit;
