import React, { useState, useEffect } from 'react';
import Authapi from "../Authapi";
import { Typography, Container, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Radio, RadioGroup } from '@mui/material';
import Expired from '../Login/ExpiredToken';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../Custom.css";

const PostFormDynamic = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [fields, setFields] = useState([]);
    const [errors, setErrors] = useState({});
    const post_title = location.state?.post_title;

    useEffect(() => {
        if (post_title) {
            fetchData();
        }
    }, [post_title]);

    const fetchData = async () => {
        try {
            const response = await Authapi.dynamifieldfetchdata(post_title);
            setFields(response.data?.post_description || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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

    const handleInputChange = (fieldLabel, fieldType) => (event) => {
        let value = event.target.value;

        if (fieldType === 'file') {
            value = event.target.files[0];
        }

        if (fieldType === 'dropdown') {
            value = value.toLowerCase();
        }

        setFormData({
            ...formData,
            [fieldLabel]: value,
        });
    };

    // Convert hex to RGB
    const hexToRgb = (hex) => {
        // Ensure valid hex format
        if (hex.length === 7) {
            let r = parseInt(hex.slice(1, 3), 16);
            let g = parseInt(hex.slice(3, 5), 16);
            let b = parseInt(hex.slice(5, 7), 16);
            return { r, g, b };
        }
        return { r: 0, g: 0, b: 0 };
    };

    // Validation function
    const validate = () => {
        const newErrors = {};
        fields.forEach((field) => {
            const value = formData[field.label] || '';
            if (field.label && !value) {
                newErrors[field.label] = 'This field is required';
            } else if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
                newErrors[field.label] = 'Please enter a valid email address';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        const submitFormData = new FormData();

        Object.keys(formData).forEach(key => {
            submitFormData.append(key, formData[key]);
        });

        try {
            const response = await Authapi.postDynamicstoredata(submitFormData, post_title);
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

    const handleCancel = () => {
        setFormData({});
        setErrors({});
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
                                                    {errors[field.label] && <Typography color="error">{errors[field.label]}</Typography>}
                                                </FormControl>
                                            ) : field.type === 'checkbox' ? (
                                                <div>
                                                    <Typography variant="body1">{field.label}</Typography>
                                                    {field.options && field.options.map((option, idx) => (
                                                        <FormControlLabel
                                                            key={idx}
                                                            control={
                                                                <Checkbox
                                                                    checked={formData[field.label]?.includes(option)}
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
                                            ) : field.type === 'color' ? (
                                                // <div >
                                                //     <TextField
                                                //         label={field.label}
                                                //         type="color"
                                                //         value={formData[field.label] || '#000000'}
                                                //         // style={{ width: "revert"  }}
                                                //         onChange={handleInputChange(field.label, field.type)}
                                                //         fullWidth
                                                //         margin="normal"
                                                //         error={!!errors[field.label]}
                                                //         helperText={errors[field.label] || ''}
                                                //     />
                                                //     {/* Display RGB values */}
                                                //     {formData[field.label] && (
                                                //         <Typography variant="body2" color="textSecondary">
                                                //             RGB: {JSON.stringify(hexToRgb(formData[field.label]))}
                                                //         </Typography>
                                                //     )}
                                                // </div>
                                                <>
                                                    <TextField
                                                        label={field.label}
                                                        type="color"
                                                        value={formData[field.label] || '#000000'}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        fullWidth
                                                        margin="normal"
                                                    />
                                                    {formData[field.label] && (
                                                        <Typography variant="body2" color="textSecondary">
                                                            RGB: {JSON.stringify(hexToRgb(formData[field.label]))}
                                                        </Typography>
                                                    )}
                                                </>
                                            ) : field.type === 'file' ? (
                                                <div>
                                                    <TextField
                                                        label={field.label}
                                                        type="file"
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        fullWidth
                                                        className='mt-5'
                                                        InputLabelProps={{ shrink: true }}
                                                        error={!!errors[field.label]}
                                                    />
                                                    {errors[field.label] && <Typography color="error">{errors[field.label]}</Typography>}
                                                </div>
                                            ) : (
                                                <TextField
                                                    fullWidth
                                                    label={field.label}
                                                    type={field.type}
                                                    variant="outlined"
                                                    value={formData[field.label] || ''}
                                                    onChange={handleInputChange(field.label, field.type)}
                                                    margin="normal"
                                                    error={!!errors[field.label]}
                                                    helperText={errors[field.label] || ''}
                                                />
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

export default PostFormDynamic;
