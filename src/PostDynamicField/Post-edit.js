import React, { useState, useEffect } from 'react';
import Authapi from "../Authapi";
import { Typography, IconButton, Tooltip, Container, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Radio, RadioGroup } from '@mui/material';
import Expired from '../Login/ExpiredToken';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../Custom.css";
import { MdDelete } from "react-icons/md";

const PostDynamicEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({});
    const [standaloneFields, setStandaloneFields] = useState([]);
    const [sections, setSections] = useState([]);
    const [errors, setErrors] = useState({});
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
            const postDescription = response.data?.post_description || {};

            const standalone = [];
            const sectioned = [];

            Object.entries(postDescription).forEach(([key, value]) => {
                if (isNaN(key)) {
                    if (value.enabled) {
                        const fields = Object.values(value).filter(field => field.label);
                        // const modifiedTitle = key.replace(/\s+/g, '_');
                        console.error('modified title==:', key);
                        sectioned.push({ title: key, fields });
                    }
                } else {
                    standalone.push(value);
                }
            });

            setStandaloneFields(standalone);
            setSections(sectioned);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchEditData = async (id) => {
        try {
            const response = await Authapi.postdynamicEditData(id);
            const data = response.data.data || {};

            if (!data || typeof data !== 'object') {
                console.error('Invalid data format:', data);
                return;
            }

            const standaloneData = {};
            const sectionsData = {};

            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                    // const modifiedKey = key.replace(/\s+/g, '_');
                    sectionsData[key] = value;
                } else {
                    standaloneData[key] = value;
                }
            });

            setFormData({
                ...standaloneData,
                ...sectionsData,
            });

        } catch (error) {
            console.error('Error fetching edit data:', error);
        }
    };

    const handleDelete1 = async (id, name) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "This will mark the item as deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, mark it!'
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await Authapi.imgdelete(id, name);

                if (response && response.status) {
                    Swal.fire('Success!', 'Item marked as deleted.', 'success').then(() => {
                        fetchData();
                        window.location.reload();
                    });
                } else {
                    throw new Error(response?.message || 'Failed to delete item');
                }
            } catch (error) {
                console.error("Error deleting item:", error);
                Swal.fire('Error!', error.response?.data?.message || error.message || 'Failed to delete item', 'error');
            }
        }
    };

    const handleInputChange = (fieldLabel, fieldType, sectionTitle = '') => (event, option) => {
        let value;

        if (fieldType === 'checkbox') {
            const currentValues = Array.isArray(sectionTitle ? formData[sectionTitle]?.[fieldLabel] : formData[fieldLabel])
                ? sectionTitle ? formData[sectionTitle]?.[fieldLabel] : formData[fieldLabel]
                : [];

            value = currentValues.includes(option)
                ? currentValues.filter(item => item !== option)
                : [...currentValues, option];
        } else if (fieldType === 'radio' || fieldType === 'dropdown' || fieldType === 'number') {
            value = event.target.value;
            if (fieldType === 'number') {
                if (value < 0) {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        [fieldLabel]: 'Please enter a positive number.',
                    }));
                    return;
                }
                if (value.length > 11) {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        [fieldLabel]: 'Number cannot exceed 11 characters.',
                    }));
                    return;
                }
            }
        } else if (fieldType === 'file') {
            value = event.target.files[0];
        } else {
            value = event.target.value;
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldLabel]: '',
        }));

        if (sectionTitle) {
            setFormData(prevFormData => ({
                ...prevFormData,
                [sectionTitle]: {
                    ...prevFormData[sectionTitle],
                    [fieldLabel]: value,
                },
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [fieldLabel]: value,
            }));
        }
    };

    const validate = () => {
        return true;
    };

    const convertToBase64 = (file) => {
        console.log("Converting file to base64");
    
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
    
            reader.onload = () => {
                resolve(reader.result); 
            };
    
            reader.onerror = (error) => {
                reject(error);  
            };
        });
    };
    
    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
        console.log('Validation failed');
        return;
    }

    const submitData = {};

    for (const field of standaloneFields) {
        let value = formData[field.label] || ''; // Get the value from formData

        // If the field is a file, check if it has been changed
        if (field.type === 'file') {
            // Assuming the old image URL or Base64 is stored as `old_<field.label>`
            const oldImage = formData[`old_${field.label}`]; // Check if the old image URL exists

            if (value instanceof File) {
                // If a new file is selected, convert it to Base64
                try {
                    value = await convertToBase64(value);
                    console.log("New Base64 value for file:", value);
                } catch (error) {
                    console.error('Error converting image to base64', error);
                    value = ''; // Handle error gracefully
                }
            } else if (!value && oldImage) {
                // If no new image is selected (value is empty), pass the old image URL or name
                value = oldImage;
                console.log("Using old image:", value);
            }

            console.log("Sending image for", field.label, value);
        }

        submitData[field.label] = value;
    }

    // Handle sections
    for (const section of sections) {
        const sectionData = {};
        const sectionFields = formData[section.title] || {};

        for (const field of section.fields) {
            let value = sectionFields[field.label] || '';

            if (field.type === 'file' && value instanceof File) {
                console.log("Received file for field:", field.label);

                try {
                    value = await convertToBase64(value);
                    console.log("Base64 value for file field:", value);
                } catch (error) {
                    console.error('Error converting file to base64', error);
                    value = ''; // Handle error gracefully
                }
            } else if (!value && formData[`old_${field.label}`]) {
                // If no new file is selected and old file exists, use the old image name or URL
                value = formData[`old_${field.label}`];
                console.log("Using old image for section field:", field.label, value);
            }

            sectionData[field.label] = value;
        }

        submitData[section.title] = sectionData;
    }

    console.log('Submitting JSON data:', submitData);

    try {
        // Assuming `Authapi.postdynamicupdatedata` expects the `id` and `submitData` as arguments
        const response = await Authapi.postdynamicupdatedata(id, submitData);
        if (response.status === true) {
            Swal.fire('Success', 'Data submitted successfully!', 'success');
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
                        <Typography variant="h6" className="title" align="center">Edit Post</Typography>
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
                                                    {errors[field.label] && <Typography color="error">{errors[field.label]}</Typography>}
                                                </div>
                                            ) : (field.type === 'color') ? (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <TextField
                                                        label={field.label}
                                                        type="text"
                                                        value={formData[field.label] || '#000000'}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        margin="normal"
                                                        error={!!errors[field.label]}
                                                        helperText={errors[field.label] || ''}
                                                        style={{ width: '100%', marginRight: '10px' }}
                                                    />
                                                    <TextField
                                                        type="color"
                                                        value={formData[field.label] || '#000000'}
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
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        fullWidth
                                                        className='mt-5'
                                                        InputLabelProps={{ shrink: true }}
                                                        error={!!errors[field.label]}
                                                    />
                                                    {errors[field.label] && <Typography color="error">{errors[field.label]}</Typography>}
                                                    {formData[field.label] instanceof File ? (
                                                        <>
                                                            <p>New image</p>
                                                            {/* <p>New Selected image: {formData[field.label].name} </p> */}
                                                            <img
                                                                src={URL.createObjectURL(formData[field.label])}
                                                                alt="Preview"
                                                                width="100"
                                                            />
                                                        </>
                                                    ) : formData[field.label] ? (
                                                        <>
                                                            <p>Current image</p>
                                                            {/* <p>Old image: {formData[field.label]?.split('/').pop()} </p> */}
                                                            <img
                                                                src={formData[field.label]}
                                                                alt="Current Image"
                                                                width="100"
                                                                style={{ marginRight: '10px' }}
                                                            />
                                                            <Tooltip title="Delete">
                                                                <IconButton aria-label="delete" className='action-button' color="primary" onClick={() => handleDelete1(id, formData[field.label]?.split('/').pop())}>
                                                                    <MdDelete />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    ) : null}
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
                                                    error={!!errors[field.label]}
                                                    helperText={errors[field.label] || ''}
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
                                                        value={formData[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type)}
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
                                                    {/* {section.title} */}
                                                    {section.title.replace(/_/g, ' ')}

                                                </Typography>
                                                <Grid container spacing={3}>
                                                    {section.fields.map((field, index) => (
                                                        <Grid item xs={12} sm={6} key={index}>
                                                            {/* {console.log(section)} */}
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
                                                                                    checked={formData[section.title]?.[field.label]?.includes(option) || false}
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
                                                            ) : field.type === 'color' ? (
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
                                                                    {console.log(section.title.replace(/\s+/g, '_'))}
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
                                                                    {formData[section.title]?.[field.label] instanceof File ? (
                                                                        <>
                                                                            {/* <p>New Selected image: {formData[section.title][field.label].name} </p> */}
                                                                            <p>New image</p>
                                                                            <img
                                                                                src={URL.createObjectURL(formData[section.title][field.label])}
                                                                                alt="Preview"
                                                                                width="100"
                                                                            />
                                                                        </>
                                                                    ) : formData[section.title]?.[field.label] ? (
                                                                        <>
                                                                            {/* <p>Old image: {formData[section.title][field.label]?.split('/').pop()} </p> */}
                                                                            <p>Current image</p>
                                                                            <img
                                                                                src={formData[section.title][field.label]}
                                                                                alt="Current Image"
                                                                                width="100"
                                                                                style={{ marginRight: '10px' }}
                                                                            />
                                                                            <Tooltip title="Delete">
                                                                                <IconButton aria-label="delete" className='action-button' color="primary" onClick={() => handleDelete1(id, formData[section.title][field.label]?.split('/').pop())}>
                                                                                    <MdDelete />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </>
                                                                    ) : null}
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
                                                            ) : (
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

export default PostDynamicEdit;

