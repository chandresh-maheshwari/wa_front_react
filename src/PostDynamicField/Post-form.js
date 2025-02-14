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
    const [standaloneFields, setStandaloneFields] = useState([]);
    const [sections, setSections] = useState([]);
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
            const postDescription = response.data?.post_description || {};

            const standalone = [];
            const sectioned = [];

            Object.entries(postDescription).forEach(([key, value]) => {
                if (isNaN(key)) {
                    // This is a section
                    if (value.enabled) {
                        const fields = Object.values(value).filter(field => field.label);
                        sectioned.push({ title: key, fields });
                    }
                } else {
                    // This is a standalone field
                    standalone.push(value);
                }
            });

            setStandaloneFields(standalone);
            setSections(sectioned);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (fieldLabel, fieldType, sectionTitle = '') => (event, option) => {
        let value;

        // console.log('sss');
        // console.log(formData);
        if (fieldType === 'checkbox') {
            const currentValues = formData[sectionTitle]?.[fieldLabel] || [];
            value = currentValues.includes(option)
                ? currentValues.filter(item => item !== option)
                : [...currentValues, option];
        } else if (fieldType === 'radio' || fieldType === 'dropdown') {
            value = event.target.value;
        } else if (fieldType === 'file') {
            value = event.target.files[0];
        } else {
            value = event.target.value;
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldLabel]: '',
        }));

        if (fieldType === 'file') {
            const file = event.target.files[0];
            if (file) {
                const fileType = file.type;
                const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/svg', 'image/webp'];
                if (!allowedImageTypes.includes(fileType)) {
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

    const validate = () => {
        // Always return true to bypass validation
        return true;
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log('Form data on submit:', formData);
    //     if (!validate()) {
    //         console.log('Validation failed');
    //         return;
    //     }

    //     const submitFormData = new FormData();

    //     // Handle standalone fields
    //     standaloneFields.forEach(field => {
    //         let value = formData['']?.[field.label] || '';
    //         if (field.type === 'file' && value instanceof File) {
    //             // Extract the file name
    //             value = value.name;
    //         }
    //         submitFormData.append(field.label, value);
    //     });

    //     // Handle section fields
    //     sections.forEach(section => {
    //         const sectionData = {};
    //         section.fields.forEach(field => {
    //             let value = formData[section.title]?.[field.label] || '';
    //             if (field.type === 'file' && value instanceof File) {
    //                 // Extract the file name
    //                 value = value.name;
    //             }
    //             sectionData[field.label] = value;
    //         });
    //         // Debugging: Log section data to ensure it's structured correctly
    //         console.log(`Section: ${section.title}`, sectionData);
    //         // Append the section data as a JSON object
    //         submitFormData.append(section.title, JSON.stringify(sectionData));
    //     });

    //     try {
    //         const response = await Authapi.postDynamicstoredata(submitFormData, post_title);
    //         if (response.status === true) {
    //             Swal.fire('Success', 'Data submitted successfully!', 'success');
    //             setFormData({});
    //             navigate('/post-list', { state: { post_title } });
    //         } else {
    //             Swal.fire('Error', response.message || 'Submission failed. Please try again.', 'error');
    //         }
    //     } catch (error) {
    //         Swal.fire('Error', 'There was an issue with your submission.', 'error');
    //         console.error('Error submitting data:', error);
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('Form data on submit:', formData); // Add this log for debugging

        if (!validate()) {
            console.log('Validation failed');
            return;
        }

        const submitFormData = new FormData();

        // Handle standalone fields
        standaloneFields.forEach(field => {
            let value = formData['']?.[field.label] || '';
            if (field.type === 'file' && value instanceof File) {
                // Extract the file name
                // value = value.name;
            }
            submitFormData.append(field.label, value);
        });

        // Handle section fields
        sections.forEach(section => {
            const sectionData = {};

            // Ensure section data is properly set
            const sectionFields = formData[section.title] || {};
            // console.log(`Section ${section.title} fields before processing:`, sectionFields);

            section.fields.forEach(field => {
                let value = sectionFields[field.label] || '';  // Get field value from formData

                // Debugging: Check if values are being correctly fetched
                // console.log(`Field ${field.label} value before processing:`, value);

                if (field.type === 'file' && value instanceof File) {
                    value = value.name;  // For file inputs, extract file name
                }

                sectionData[field.label] = value; // Set the field value in section data
            });

            // console.log(`Final Section Data for ${section.title}:`, sectionData);
            submitFormData.append(section.title, JSON.stringify(sectionData));  // Append as JSON
        });

            sections.forEach(section => {
                // const sectionData = {};
                const sectionFields = formData[section.title] || {};

                section.fields.forEach(field => {
                    let value = sectionFields[field.label] || '';

                    if (field.type === 'file' && value instanceof File) {
                        submitFormData.append(`Section_image_${section.title}_${field.label}`, value); // Append file directly with section prefix
                    }
                });

                // Append section data to form data as JSON string
                // submitFormData.append(section.title, JSON.stringify(sectionData));
            });

        try {
            const response = await Authapi.postDynamicstoredata(submitFormData, post_title);
            if (response.status === true) {
                Swal.fire('Success', 'Data submitted successfully!', 'success');
                // setFormData({});
                navigate('/post-list', { state: { post_title } });
            } else {
                Swal.fire('Error', response.message || 'Submission failed. Please try again.', 'error');
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
                <div className="row" style={{ marginLeft: "20%", width: "80%", marginBottom: "20px", marginTop: "1%" }}>
                    <div className="card-header Form-main-title">
                        <Typography variant="h6" className="title" align="center">Add Post</Typography>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    {standaloneFields.map((field, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            {field.type === 'dropdown' ? (
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel>{field.label}</InputLabel>
                                                    <Select
                                                        value={formData['']?.[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type, '')}
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
                                                                    checked={formData['']?.[field.label]?.includes(option)}
                                                                    onChange={(e) => handleInputChange(field.label, field.type, '')(e, option)}
                                                                    value={option}
                                                                />
                                                            }
                                                            label={option}
                                                        />
                                                    ))}
                                                    {errors[field.label] && <Typography color="error">{errors[field.label]}</Typography>}
                                                </div>
                                            ) : field.type === 'radio' ? (
                                                <div>
                                                    <Typography variant="body1">{field.label}</Typography>
                                                    <RadioGroup
                                                        value={formData['']?.[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type, '')}
                                                    >
                                                        {field.options && field.options.map((option, idx) => (
                                                            <FormControlLabel
                                                                key={idx}
                                                                control={<Radio value={option} />}
                                                                label={option}
                                                            />
                                                        ))}
                                                    </RadioGroup>
                                                    {errors[field.label] && <Typography color="error">{errors[field.label]}</Typography>}
                                                </div>
                                            ) : (field.type === 'color') ? (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <TextField
                                                        label={field.label}
                                                        type="text"
                                                        value={formData['']?.[field.label] || '#000000'}
                                                        onChange={handleInputChange(field.label, field.type, '')}
                                                        margin="normal"
                                                        error={!!errors[field.label]}
                                                        helperText={errors[field.label] || ''}
                                                        style={{ width: '100%', marginRight: '10px' }}
                                                    />
                                                    <TextField
                                                        type="color"
                                                        value={formData['']?.[field.label] || '#000000'}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        style={{
                                                            width: '50px', height: '50px', padding: '0', border: 'none', marginLeft: "-60px", marginTop: "-17px"
                                                        }}
                                                        className='color-code'
                                                    />
                                                </div>
                                            ) : field.type === 'file' ? (
                                                <div>
                                                    <TextField
                                                        label={field.label}
                                                        type="file"
                                                        onChange={handleInputChange(field.label, field.type, '')}
                                                        fullWidth
                                                        className='mt-5'
                                                        InputLabelProps={{ shrink: true }}
                                                        error={!!errors[field.label]}
                                                    />
                                                    {errors[field.label] && <Typography color="error">{errors[field.label]}</Typography>}
                                                </div>
                                            ) : field.type === 'textarea' ? (
                                                <TextField
                                                    label={field.label}
                                                    value={formData['']?.[field.label] || ''}
                                                    onChange={handleInputChange(field.label, field.type, '')}
                                                    multiline
                                                    rows={4}
                                                    fullWidth
                                                    variant="outlined"
                                                    margin="normal"
                                                    error={!!errors[field.label]}
                                                    helperText={errors[field.label] || ''}
                                                />
                                            ) : field.type === 'date' ? (
                                                <TextField
                                                    label={field.label}
                                                    type='date'
                                                    value={formData['']?.[field.label] || ''}
                                                    onChange={handleInputChange(field.label, field.type, '')}
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                    variant="outlined"
                                                    margin="normal"
                                                    error={!!errors[field.label]}
                                                    helperText={errors[field.label] || ''}
                                                />
                                            )
                                                : (
                                                    <TextField
                                                        fullWidth
                                                        label={field.label}
                                                        type={field.type}
                                                        variant="outlined"
                                                        value={formData['']?.[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type, '')}
                                                        margin="normal"
                                                        error={!!errors[field.label]}
                                                        helperText={errors[field.label] || ''}
                                                    />
                                                )}
                                        </Grid>
                                    ))}
                                    {sections.map((section, sectionIndex) => (
                                        <Grid item xs={12} key={sectionIndex}>
                                            <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }}>
                                                <Typography variant="h6" style={{ backgroundColor: "#f4f6f8", padding: "10px", borderRadius: "8px" }}>
                                                    {section.title}
                                                </Typography>
                                                <Grid container spacing={3}>
                                                    {section.fields.map((field, index) => (
                                                        <Grid item xs={12} sm={6} key={index}>
                                                            {field.type === 'dropdown' ? (
                                                                <FormControl fullWidth margin="normal">
                                                                    <InputLabel>{field.label}</InputLabel>
                                                                    <Select
                                                                        value={formData[section.title]?.[field.label] || ''}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
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
                                                                                    checked={formData[section.title]?.[field.label]?.includes(option)}
                                                                                    onChange={(e) => handleInputChange(field.label, field.type, section.title)(e, option)}
                                                                                    value={option}
                                                                                />
                                                                            }
                                                                            label={option}
                                                                        />
                                                                    ))}
                                                                    {errors[field.label] && <Typography color="error">{errors[field.label]}</Typography>}
                                                                </div>
                                                            ) : field.type === 'radio' ? (
                                                                <div>
                                                                    <Typography variant="body1">{field.label}</Typography>
                                                                    <RadioGroup
                                                                        value={formData[section.title]?.[field.label] || ''}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                    >
                                                                        {field.options && field.options.map((option, idx) => (
                                                                            <FormControlLabel
                                                                                key={idx}
                                                                                control={<Radio value={option} />}
                                                                                label={option}
                                                                            />
                                                                        ))}
                                                                    </RadioGroup>
                                                                    {errors[field.label] && <Typography color="error">{errors[field.label]}</Typography>}
                                                                </div>
                                                            ) : (field.type === 'color') ? (
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <TextField
                                                                        label={field.label}
                                                                        type="text"
                                                                        value={formData[section.title]?.[field.label] || '#000000'}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        margin="normal"
                                                                        error={!!errors[field.label]}
                                                                        helperText={errors[field.label] || ''}
                                                                        style={{ width: '100%', marginRight: '10px' }}
                                                                    />
                                                                    <TextField
                                                                        type="color"
                                                                        value={formData[section.title]?.[field.label] || '#000000'}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        style={{
                                                                            width: '50px', height: '50px', padding: '0', border: 'none', marginLeft: "-60px", marginTop: "-17px"
                                                                        }}
                                                                        className='color-code'
                                                                    />
                                                                </div>
                                                            ) : field.type === 'file' ? (
                                                                <div>
                                                                    <TextField
                                                                        label={field.label}
                                                                        type="file"
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        fullWidth
                                                                        className='mt-5'
                                                                        InputLabelProps={{ shrink: true }}
                                                                        error={!!errors[field.label]}
                                                                    />
                                                                    {errors[field.label] && <Typography color="error">{errors[field.label]}</Typography>}
                                                                </div>
                                                            ) : field.type === 'textarea' ? (
                                                                <TextField
                                                                    label={field.label}
                                                                    value={formData[section.title]?.[field.label] || ''}
                                                                    onChange={handleInputChange(field.label, field.type, section.title)}
                                                                    multiline
                                                                    rows={4}
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    margin="normal"
                                                                    error={!!errors[field.label]}
                                                                    helperText={errors[field.label] || ''}
                                                                />
                                                            ) : field.type === 'date' ? (
                                                                <TextField
                                                                    label={field.label}
                                                                    type='date'
                                                                    value={formData[section.title]?.[field.label] || ''}
                                                                    onChange={handleInputChange(field.label, field.type, section.title)}
                                                                    fullWidth
                                                                    InputLabelProps={{ shrink: true }}
                                                                    variant="outlined"
                                                                    margin="normal"
                                                                    error={!!errors[field.label]}
                                                                    helperText={errors[field.label] || ''}
                                                                />
                                                            )
                                                                : (
                                                                    <TextField
                                                                        fullWidth
                                                                        label={field.label}
                                                                        type={field.type}
                                                                        variant="outlined"
                                                                        value={formData[section.title]?.[field.label] || ''}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        margin="normal"
                                                                        error={!!errors[field.label]}
                                                                        helperText={errors[field.label] || ''}
                                                                    />
                                                                )}
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </div>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Grid container justifyContent="flex-start" spacing={2} marginTop={3}>
                                    <Grid item>
                                        <Button
                                            className='submit-btn'
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
                                            className='cancel-btn'
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

export default PostFormDynamic;
