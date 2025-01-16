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
    const [errors, setErrors] = useState({});
    const post_title = location.state?.post_title;
    const [isModified, setIsModified] = useState(false);

    useEffect(() => {
        fetchData();
    }, [post_title]);
    
    useEffect(() => {
        fetchEditData(id);
    }, [id]);


    const fetchData = async () => {
        try {
            const response = await Authapi.dynamifieldfetchdata(post_title);
            setFields(response.data?.post_description || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchEditData = async (id) => {
        // console.log("Fetching edit data for ID:", id);
        try {
            const response = await Authapi.postdynamicEditData(id);
            console.log(response.data.data)
            setTimeout(() => {
                setFormData(response.data.data || {});
            }, 500);
        } catch (error) {
            console.error('Error fetching edit data:', error);
        }
    }

    useEffect(() => {
        if (fields.length > 0) {
            const initialFormData = fields.reduce((acc, field) => {
                acc[field.label] = field.value || '';
                return acc;
            }, {});
            setFormData(initialFormData);
        }
    }, [fields]);
    // const handleInputChange = (fieldLabel, fieldType) => (event, option) => {
    //     let value = event.target.value;

    //     if (fieldType === 'file') {
    //         value = event.target.files[0];
    //     }

    //     if (fieldType === 'dropdown') {
    //         value = event.target.value.toLowerCase();
    //     }

    //     if (fieldType === 'checkbox') {
    //         const currentValues = formData[fieldLabel] || [];
    //         if (currentValues.includes(option)) {
    //             value = currentValues.filter(item => item !== option);
    //         } else {
    //             value = [...currentValues, option];
    //         }
    //     }

    //     setFormData(prevData => ({
    //         ...prevData,
    //         [fieldLabel]: value,
    //     }));
    // };
    const handleInputChange = (fieldLabel, fieldType) => (event, option) => {
        let value = event.target.value;

        // Update the isModified state to true when any field changes
        setIsModified(true);

        if (fieldType === 'file') {
            const file = event.target.files[0];
            if (file) {
                const fileType = file.type;
                const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/svg', 'image/webp'];

                if (!allowedImageTypes.includes(fileType)) {
                    // Check if the file is not an image (for example, PDF or video)
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        [fieldLabel]: 'Please upload a valid image file (JPEG, PNG, GIF).'
                    }));
                    return;
                }


                const img = new Image();
                const reader = new FileReader();
                reader.onload = () => {
                    img.src = reader.result;
                    img.onload = () => {
                        const { width, height } = img;
                        console.log(width)
                        console.log(height)

                        if (width >= 40 && height >= 40 && width <= 1700 && height <= 1700) {
                            setErrors(prevErrors => ({
                                ...prevErrors,
                                [fieldLabel]: ''
                            }));
                            setFormData({
                                ...formData,
                                [fieldLabel]: file
                            });
                        } else {
                            setErrors(prevErrors => ({
                                ...prevErrors,
                                [fieldLabel]: 'Image must be between 40px and 1700px in both width and height.'
                            }));
                        }
                    };
                };
                reader.readAsDataURL(file);
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [fieldLabel]: 'Please select a valid image file.',
                }));
            }
        } else if (fieldType === 'dropdown') {
            value = value.toLowerCase();
        } else if (fieldType === 'checkbox') {
            const currentValues = formData[fieldLabel] || [];
            if (currentValues.includes(option)) {
                setFormData({
                    ...formData,
                    [fieldLabel]: currentValues.filter(item => item !== option),
                });
            } else {
                setFormData({
                    ...formData,
                    [fieldLabel]: [...currentValues, option],
                });
            }
            return;
        }

        setFormData({
            ...formData,
            [fieldLabel]: value,
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitFormData = new FormData();
        // Create a new object to hold only modified fields
        const modifiedData = {};

        Object.keys(formData).forEach(key => {
            // Check if the field has been modified
            if (isModified) {
                const value = Array.isArray(formData[key]) ? [...new Set(formData[key])] : formData[key];
                modifiedData[key] = value; // Store only modified fields
            }
        });

        // Append only modified fields to FormData
        Object.keys(modifiedData).forEach(key => {
            submitFormData.append(key, modifiedData[key]);
        });

        // Only submit if there are modifications
        if (isModified) {
            try {
                const response = await Authapi.postdynamicupdatedata(id, submitFormData);
                if (response.status === true) {
                    Swal.fire('Success', 'Data submitted successfully!', 'success');
                    setFormData({});
                    setIsModified(false); // Reset the modified state
                    navigate('/post-list', { state: { post_title } });
                }
            } catch (error) {
                Swal.fire('Error', 'There was an issue with your submission.', 'error');
                console.error('Error submitting data:', error);
            }
        } else {
            Swal.fire('Success', 'Data submitted successfully!', 'success');
            navigate('/post-list', { state: { post_title } });
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
                                                <FormControl fullWidth margin="normal" >
                                                    <InputLabel>{field.label}</InputLabel>
                                                    <Select
                                                        value={formData[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        variant="outlined"

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
                                            ) : field.type === 'date' ? (
                                                <TextField
                                                    label={field.label}
                                                    type='date'
                                                    value={formData[field.label] || ''}
                                                    onChange={handleInputChange(field.label, field.type)}
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
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
                                                        error={!!errors[field.label]}
                                                    />
                                                    {errors[field.label] && <Typography color="error">{errors[field.label]}</Typography>}
                                                    {formData[field.label] instanceof File ? (
                                                        <img
                                                            src={URL.createObjectURL(formData[field.label])}
                                                            alt="Preview"
                                                            width="100"
                                                        />
                                                    ) : formData[field.label] ? (
                                                        <>
                                                            <p>Current image: {formData[field.label].split('/').pop()} </p>
                                                            <img
                                                                src={formData[field.label]}
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
                                                        type="text"
                                                        value={formData[field.label] || '#000000'}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        margin="normal"
                                                        style={{ width: '100%', marginRight: '10px' }}
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

                                                    <TextField
                                                        fullWidth
                                                        label={field.label}
                                                        type={field.type}
                                                        variant="outlined"
                                                        value={formData[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        margin="normal"

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
