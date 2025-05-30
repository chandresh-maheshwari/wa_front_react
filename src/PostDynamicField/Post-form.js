import React, { useState, useEffect } from 'react';
import Authapi from "../Authapi";
import { Typography, Container, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Radio, RadioGroup, InputAdornment, IconButton } from '@mui/material';
import Expired from '../Login/ExpiredToken';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../Custom.css";
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const PostFormDynamic = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [standaloneFields, setStandaloneFields] = useState([]);
    const [sections, setSections] = useState([]);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState({});
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

    const getFieldError = (field, value) => {
        if (field.required) {
            if (
                value === undefined ||
                value === null ||
                value === '' ||
                (Array.isArray(value) && value.length === 0)
            ) {
                return 'This field is required.';
            }
        }
        if (value) {
            if (field.type === 'number') {
                const digitsOnly = /^\d+$/;
                if (!digitsOnly.test(value)) {
                    return 'Only digits are allowed.';
                } else if (String(value).length > 11) {
                    return 'Maximum 11 digits allowed.';
                }
            }
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Please enter a valid email address.';
                }
            }
            if (field.type === 'password') {
                if (!value || value === '') {
                    return 'This field is required.';
                } else if (value.length !== 8) {
                    return 'Input must be exactly 8 characters long.';
                } else if (!/[A-Z]/.test(value)) {
                    return 'Input must contain at least one uppercase letter.';
                } else if (!/[a-z]/.test(value)) {
                    return 'Input must contain at least one lowercase letter.';
                } else if (!/\d/.test(value)) {
                    return 'Input must contain at least one number.';
                } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
                    return 'Input must contain at least one special character.';
                }
            }
            if (field.type === 'url') {
                const urlRegex = /^(https?:\/\/)(localhost(:\d+)?|([\w\-]+\.)+[\w\-]+)(\/[\w\-./?%&=]*)?$/i;
                if (!urlRegex.test(value)) {
                    return 'Please enter a valid URL.';
                }
            }
        }
        return '';
    };

    const validateField = (field, value, sectionTitle = '') => {
        const error = getFieldError(field, value);
        setErrors(prevErrors => ({
            ...prevErrors,
            [field.label]: error,
        }));
        return error === '';
    };

    const handleInputChange = (fieldLabel, fieldType, sectionTitle = '') => (event, option) => {
        let value;
        if (fieldType === 'checkbox') {
            const currentValues = formData[sectionTitle]?.[fieldLabel] || [];
            value = currentValues.includes(option)
                ? currentValues.filter(item => item !== option)
                : [...currentValues, option];
        } else if (fieldType === 'radio' || fieldType === 'dropdown' || fieldType === 'number') {
            value = event.target.value;
        } else if (fieldType === 'file') {
            value = event.target.files[0];
        } else {
            value = event.target.value;
        }
        setFormData(prevFormData => ({
            ...prevFormData,
            [sectionTitle]: {
                ...prevFormData[sectionTitle],
                [fieldLabel]: value,
            },
        }));
        // Find the field definition
        let field;
        if (sectionTitle === '') {
            field = standaloneFields.find(f => f.label === fieldLabel);
        } else {
            const section = sections.find(s => s.title === sectionTitle);
            field = section?.fields.find(f => f.label === fieldLabel);
        }
        if (field) {
            validateField(field, value, sectionTitle);
        }
    };

    const handleBlur = (field, value, sectionTitle = '') => {
        setTouched(prev => ({
            ...prev,
            [field.label]: prev[field.label] ? prev[field.label] + 1 : 1
        }));
        validateField(field, value, sectionTitle);
    };

    const validate = () => {
        let valid = true;
        const newErrors = {};

        // Validate standalone fields
        for (const field of standaloneFields) {
            const value = formData['']?.[field.label];
            const error = getFieldError(field, value);
            if (error) {
                newErrors[field.label] = error;
                valid = false;
            }
        }

        // Validate section fields
        for (const section of sections) {
            const sectionFields = formData[section.title] || {};
            for (const field of section.fields) {
                const value = sectionFields[field.label];
                const error = getFieldError(field, value);
                if (error) {
                    newErrors[field.label] = error;
                    valid = false;
                }
            }
        }

        setErrors(newErrors);

        // Mark all fields as touched so errors show up
        const allTouched = {};
        standaloneFields.forEach(field => {
            allTouched[field.label] = 2;
        });
        sections.forEach(section => {
            section.fields.forEach(field => {
                allTouched[field.label] = 2;
            });
        });
        setTouched(allTouched);

        return valid;
    };

    const convertToBase64 = (file) => {
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
            let value = formData['']?.[field.label] || '';
    
            if (field.type === 'file' && value instanceof File) {
                try {
                    value = await convertToBase64(value);
                } catch (error) {
                    console.error('Error converting file to base64', error);
                    value = '';  
                }
            }
    
            submitData[field.label] = value;
        }
    
        for (const section of sections) {
            const sectionData = {};
            const sectionFields = formData[section.title] || {};
    
            for (const field of section.fields) {
                let value = sectionFields[field.label] || '';  
    
                if (field.type === 'file' && value instanceof File) {
                    try {
                        value = await convertToBase64(value);
                    } catch (error) {
                        console.error('Error converting file to base64', error);
                        value = ''; 
                    }
                }
    
                sectionData[field.label] = value;
            }
    
            submitData[section.title] = sectionData;
        }
    
        console.log('Submitting JSON data:', submitData);
    
        try {
            const response = await Authapi.postDynamicstoredata(submitData, post_title);
            if (response.status === true) {
                Swal.fire('Success', 'Data submitted successfully!', 'success');
                // setFormData({});  // Optionally reset the form
                navigate('/post-list', { state: { post_title } });
            } else {
                Swal.fire('Error', response.message || 'Submission failed. Please try again.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'There was an issue with your submission.', 'error');
            console.error('Error submitting data:', error);
        }
    };

    // Helper to render label with one red asterisk if required and not already present
    const renderLabel = (label, required) => {
        if (!required) return label;
        return label.trim().endsWith('*') ? label : <>{label}<span style={{color: 'red'}}>*</span></>;
    };

    const handleClickShowPassword = (fieldLabel) => {
        setShowPassword(prev => ({
            ...prev,
            [fieldLabel]: !prev[fieldLabel]
        }));
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
                                                <FormControl fullWidth margin="normal" error={!!errors[field.label]}>
                                                    <InputLabel>{renderLabel(field.label, field.required)}</InputLabel>
                                                    <Select
                                                        value={formData['']?.[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type, '')}
                                                        onBlur={() => handleBlur(field, formData['']?.[field.label] || '', '')}
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
                                                    <Typography variant="body1">{renderLabel(field.label, field.required)}</Typography>
                                                    {field.options && field.options.map((option, idx) => (
                                                        <FormControlLabel
                                                            key={idx}
                                                            control={
                                                                <Checkbox
                                                                    checked={formData['']?.[field.label]?.includes(option)}
                                                                    onChange={(e) => handleInputChange(field.label, field.type, '')(e, option)}
                                                                    onBlur={() => handleBlur(field, formData['']?.[field.label] || [], '')}
                                                                    value={option}
                                                                />
                                                            }
                                                            label={option}
                                                        />
                                                    ))}
                                                </div>
                                            ) : field.type === 'radio' ? (
                                                <div>
                                                    <Typography variant="body1">{renderLabel(field.label, field.required)}</Typography>
                                                    <RadioGroup
                                                        value={formData['']?.[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type, '')}
                                                        onBlur={() => handleBlur(field, formData['']?.[field.label] || '', '')}
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
                                            ) : (field.type === 'color') ? (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <TextField
                                                        label={renderLabel(field.label, field.required)}
                                                        type="text"
                                                        value={formData['']?.[field.label] || '#000000'}
                                                        onChange={handleInputChange(field.label, field.type, '')}
                                                        onBlur={() => handleBlur(field, formData['']?.[field.label] || '', '')}
                                                        margin="normal"
                                                        error={!!errors[field.label]}
                                                        style={{ width: '100%', marginRight: '10px' }}
                                                    />
                                                    <TextField
                                                        type="color"
                                                        value={formData['']?.[field.label] || '#000000'}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        onBlur={() => handleBlur(field, formData['']?.[field.label] || '', '')}
                                                        style={{
                                                            width: '50px', height: '50px', padding: '0', border: 'none', marginLeft: "-60px", marginTop: "-17px"
                                                        }}
                                                        className='color-code'
                                                    />
                                                </div>
                                            ) : field.type === 'file' ? (
                                                <div>
                                                    <TextField
                                                        label={renderLabel(field.label, field.required)}
                                                        type="file"
                                                        onChange={handleInputChange(field.label, field.type, '')}
                                                        onBlur={() => handleBlur(field, formData['']?.[field.label] || '', '')}
                                                        fullWidth
                                                        className='mt-5'
                                                        InputLabelProps={{ shrink: true }}
                                                        error={!!errors[field.label]}
                                                    />
                                                </div>
                                            ) : field.type === 'textarea' ? (
                                                <>
                                                    {console.log('Textarea field:', field)}
                                                    <TextField
                                                        label={renderLabel(field.label, field.required)}
                                                        value={formData['']?.[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type, '')}
                                                        onBlur={() => handleBlur(field, formData['']?.[field.label] || '', '')}
                                                        multiline
                                                        rows={4}
                                                        fullWidth
                                                        variant="outlined"
                                                        margin="normal"
                                                        error={!!errors[field.label]}
                                                        inputProps={{ maxLength: field.value ? parseInt(field.value) : undefined }}
                                                    />
                                                </>
                                            ) : field.type === 'date' ? (
                                                <TextField
                                                    label={renderLabel(field.label, field.required)}
                                                    type='date'
                                                    value={formData['']?.[field.label] || ''}
                                                    onChange={handleInputChange(field.label, field.type, '')}
                                                    onBlur={() => handleBlur(field, formData['']?.[field.label] || '', '')}
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                    variant="outlined"
                                                    margin="normal"
                                                    error={!!errors[field.label]}
                                                />
                                            )
                                                : field.type === 'number' ? (
                                                    <TextField
                                                        label={renderLabel(field.label, field.required)}
                                                        type='number'
                                                        value={formData['']?.[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type, '')}
                                                        onBlur={() => handleBlur(field, formData['']?.[field.label] || '', '')}
                                                        fullWidth
                                                        InputLabelProps={{ shrink: true }}
                                                        variant="outlined"
                                                        margin="normal"
                                                        error={!!errors[field.label]}
                                                    />
                                                ) : field.type === 'password' ? (
                                                    <TextField
                                                        fullWidth
                                                        label={renderLabel(field.label, field.required)}
                                                        type={showPassword[field.label] ? 'text' : 'password'}
                                                        autoComplete="new-password"
                                                        variant="outlined"
                                                        value={formData['']?.[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type, '')}
                                                        onBlur={() => handleBlur(field, formData['']?.[field.label] || '', '')}
                                                        margin="normal"
                                                        error={!!errors[field.label]}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="toggle password visibility"
                                                                        onClick={() => handleClickShowPassword(field.label)}
                                                                        edge="end"
                                                                    >
                                                                        {showPassword[field.label] ? <MdVisibilityOff /> : <MdVisibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                ) : (
                                                    <TextField
                                                        fullWidth
                                                        label={renderLabel(field.label, field.required)}
                                                        type={field.type}
                                                        autoComplete={field.type === 'password' ? 'new-password' : field.type === 'email' ? 'off' : undefined}
                                                        variant="outlined"
                                                        value={formData['']?.[field.label] || ''}
                                                        onChange={handleInputChange(field.label, field.type, '')}
                                                        onBlur={() => handleBlur(field, formData['']?.[field.label] || '', '')}
                                                        margin="normal"
                                                        error={!!errors[field.label]}
                                                    />
                                                )}
                                            {errors[field.label] && (
                                                <Typography
                                                    style={{ color: '#d32f2f', marginTop: 4 }}
                                                    variant="body2"
                                                >
                                                    {errors[field.label]}
                                                </Typography>
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
                                                                <FormControl fullWidth margin="normal" error={!!errors[field.label]}>
                                                                    <InputLabel>{renderLabel(field.label, field.required)}</InputLabel>
                                                                    <Select
                                                                        value={formData[section.title]?.[field.label] || ''}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        onBlur={() => handleBlur(field, formData[section.title]?.[field.label] || '', section.title)}
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
                                                                    <Typography variant="body1">{renderLabel(field.label, field.required)}</Typography>
                                                                    {field.options && field.options.map((option, idx) => (
                                                                        <FormControlLabel
                                                                            key={idx}
                                                                            control={
                                                                                <Checkbox
                                                                                    checked={formData[section.title]?.[field.label]?.includes(option)}
                                                                                    onChange={(e) => handleInputChange(field.label, field.type, section.title)(e, option)}
                                                                                    onBlur={() => handleBlur(field, formData[section.title]?.[field.label] || '', section.title)}
                                                                                    value={option}
                                                                                />
                                                                            }
                                                                            label={option}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            ) : field.type === 'radio' ? (
                                                                <div>
                                                                    <Typography variant="body1">{renderLabel(field.label, field.required)}</Typography>
                                                                    <RadioGroup
                                                                        value={formData[section.title]?.[field.label] || ''}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        onBlur={() => handleBlur(field, formData[section.title]?.[field.label] || '', section.title)}
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
                                                            ) : (field.type === 'color') ? (
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <TextField
                                                                        label={renderLabel(field.label, field.required)}
                                                                        type="text"
                                                                        value={formData[section.title]?.[field.label] || '#000000'}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        onBlur={() => handleBlur(field, formData[section.title]?.[field.label] || '', section.title)}
                                                                        margin="normal"
                                                                        error={!!errors[field.label]}
                                                                        style={{ width: '100%', marginRight: '10px' }}
                                                                    />
                                                                    <TextField
                                                                        type="color"
                                                                        value={formData[section.title]?.[field.label] || '#000000'}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        onBlur={() => handleBlur(field, formData[section.title]?.[field.label] || '', section.title)}
                                                                        style={{
                                                                            width: '50px', height: '50px', padding: '0', border: 'none', marginLeft: "-60px", marginTop: "-17px"
                                                                        }}
                                                                        className='color-code'
                                                                    />
                                                                </div>
                                                            ) : field.type === 'file' ? (
                                                                <div>
                                                                    <TextField
                                                                        label={renderLabel(field.label, field.required)}
                                                                        type="file"
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        onBlur={() => handleBlur(field, formData[section.title]?.[field.label] || '', section.title)}
                                                                        fullWidth
                                                                        className='mt-5'
                                                                        InputLabelProps={{ shrink: true }}
                                                                        error={!!errors[field.label]}
                                                                    />
                                                                </div>
                                                            ) : field.type === 'textarea' ? (
                                                                <>
                                                                    {console.log('Textarea field:', field)}
                                                                    <TextField
                                                                        label={renderLabel(field.label, field.required)}
                                                                        value={formData[section.title]?.[field.label] || ''}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        onBlur={() => handleBlur(field, formData[section.title]?.[field.label] || '', section.title)}
                                                                        multiline
                                                                        rows={4}
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        error={!!errors[field.label]}
                                                                        inputProps={{ maxLength: field.value ? parseInt(field.value) : undefined }}
                                                                    />
                                                                </>
                                                            ) : field.type === 'date' ? (
                                                                <TextField
                                                                    label={renderLabel(field.label, field.required)}
                                                                    type='date'
                                                                    value={formData[section.title]?.[field.label] || ''}
                                                                    onChange={handleInputChange(field.label, field.type, section.title)}
                                                                    onBlur={() => handleBlur(field, formData[section.title]?.[field.label] || '', section.title)}
                                                                    fullWidth
                                                                    InputLabelProps={{ shrink: true }}
                                                                    variant="outlined"
                                                                    margin="normal"
                                                                    error={!!errors[field.label]}
                                                                />
                                                            )
                                                                : field.type === 'password' ? (
                                                                    <TextField
                                                                        fullWidth
                                                                        label={renderLabel(field.label, field.required)}
                                                                        type={showPassword[field.label] ? 'text' : 'password'}
                                                                        autoComplete="new-password"
                                                                        variant="outlined"
                                                                        value={formData[section.title]?.[field.label] || ''}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        onBlur={() => handleBlur(field, formData[section.title]?.[field.label] || '', section.title)}
                                                                        margin="normal"
                                                                        error={!!errors[field.label]}
                                                                        InputProps={{
                                                                            endAdornment: (
                                                                                <InputAdornment position="end">
                                                                                    <IconButton
                                                                                        aria-label="toggle password visibility"
                                                                                        onClick={() => handleClickShowPassword(field.label)}
                                                                                        edge="end"
                                                                                    >
                                                                                        {showPassword[field.label] ? <MdVisibilityOff /> : <MdVisibility />}
                                                                                    </IconButton>
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <TextField
                                                                        fullWidth
                                                                        label={renderLabel(field.label, field.required)}
                                                                        type={field.type}
                                                                        autoComplete={field.type === 'password' ? 'new-password' : field.type === 'email' ? 'off' : undefined}
                                                                        variant="outlined"
                                                                        value={formData[section.title]?.[field.label] || ''}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        onBlur={() => handleBlur(field, formData[section.title]?.[field.label] || '', section.title)}
                                                                        margin="normal"
                                                                        error={!!errors[field.label]}
                                                                    />
                                                                )}
                                                            {errors[field.label] && (
                                                                <Typography
                                                                    style={{ color: '#d32f2f', marginTop: 4 }}
                                                                    variant="body2"
                                                                >
                                                                    {errors[field.label]}
                                                                </Typography>
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

