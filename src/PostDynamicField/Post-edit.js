import React, { useState, useEffect } from 'react';
import Authapi from "../Authapi";
import { Typography, IconButton, Tooltip, Container, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Radio, RadioGroup, InputAdornment } from '@mui/material';
import Expired from '../Login/ExpiredToken';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../Custom.css";
import { MdDelete, MdVisibility, MdVisibilityOff, MdFileDownload } from "react-icons/md";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FaPlusCircle, FaCirclePlus } from 'react-icons/fa';

const PostDynamicEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({});
    const [standaloneFields, setStandaloneFields] = useState([]);
    const [sections, setSections] = useState([]);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState({});
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

            const isImageUrl = (url) => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url);

            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                    // Section fields
                    Object.entries(value).forEach(([fieldLabel, fieldValue]) => {
                        if (typeof fieldValue === 'string' && isImageUrl(fieldValue)) {
                            // Set both the field and old_<fieldLabel>
                            if (!sectionsData[key]) sectionsData[key] = {};
                            sectionsData[key][fieldLabel] = fieldValue;
                            sectionsData[key][`old_${fieldLabel}`] = fieldValue;
                        } else {
                            if (!sectionsData[key]) sectionsData[key] = {};
                            sectionsData[key][fieldLabel] = fieldValue;
                        }
                    });
                } else {
                    // Standalone fields
                    if (typeof value === 'string' && isImageUrl(value)) {
                        standaloneData[key] = value;
                        standaloneData[`old_${key}`] = value;
                    } else {
                        standaloneData[key] = value;
                    }
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

    const getFieldError = (field, value) => {
        if (field.required) {
            if (field.type === 'file') {
                // Check for new or old image
                const oldImage = formData[`old_${field.label}`];
                if (
                    (!value || value === '') &&
                    !(value instanceof File) &&
                    (!oldImage || oldImage === '')
                ) {
                    return 'This field is required.';
                }
            } else if (
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
                } else if (String(value).length > 10) {
                    return 'Maximum 10 digits allowed.';
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
                const urlRegex = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|https?:\/\/localhost(:\d+)?(\/[^\s]*)?)$/i;
                console.log('Validating URL:', value);
                if (!urlRegex.test(value)) {
                    return 'Please enter a valid URL.';
                }
            }
            if (field.type === 'file') {
                if (value instanceof File) {
                    if (field.allowedFileTypes && field.allowedFileTypes.length > 0) {
                        const fileExtension = '.' + value.name.split('.').pop().toLowerCase();
                        if (!field.allowedFileTypes.includes(fileExtension)) {
                            return `Only ${field.allowedFileTypes.join(', ')} files are allowed.`;
                        }
                    }
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

    const handleBlur = (field, value, sectionTitle = '') => {
        setTouched(prev => ({
            ...prev,
            [field.label]: prev[field.label] ? prev[field.label] + 1 : 1
        }));
        validateField(field, value, sectionTitle);
    };

    const handleInputChange = (fieldLabel, fieldType, sectionTitle = '') => (event, param2) => {
        let value;

        // console.log('handleInputChange called for:', { fieldLabel, fieldType, sectionTitle });

        if (fieldType === 'checkbox') {
            // For checkbox, param2 is the option
            const currentValues = sectionTitle ? (formData[sectionTitle]?.[fieldLabel] || []) : (formData[fieldLabel] || []);
            const option = param2;
            value = currentValues.includes(option)
                ? currentValues.filter(item => item !== option)
                : [...currentValues, option];
        } else if (fieldType === 'file') {
            value = event.target.files[0];
        } else if (fieldType === 'ckeditor') {
            // For CKEditor, param2 is the editor instance
            const editor = param2;
            value = editor.getData();
            console.log('CKEditor data:', value);
        } else {
            // For other input types (text, number, dropdown, radio, date, password, textarea, color)
            value = event.target.value;
        }

        // Find the field definition (still needed for validation, though validation happens on blur/submit too)
        let field;
        if (sectionTitle) {
            const section = sections.find(s => s.title === sectionTitle);
            field = section?.fields.find(f => f.label === fieldLabel);
        } else {
            field = standaloneFields.find(f => f.label === fieldLabel);
        }

        if (field) {
            // We can call validateField here for instant feedback if needed, or rely on blur/submit validation
            validateField(field, value, sectionTitle); // Keep instant validation on change
        }

        // Update form data state
        if (sectionTitle) {
            setFormData(prevFormData => {
                console.log('Updating section state for', sectionTitle, fieldLabel, ':', value);
                return {
                    ...prevFormData,
                    [sectionTitle]: {
                        ...prevFormData[sectionTitle],
                        [fieldLabel]: value,
                    },
                }
            });
        } else {
            setFormData(prevFormData => {
                console.log('Updating standalone state for', fieldLabel, ':', value);
                return {
                    ...prevFormData,
                    [field.label]: value,
                }
            });
        }
    };

    const isEmpty = (value, type) => {
        if (type === 'checkbox') {
            return !Array.isArray(value) || value.length === 0;
        }
        if (type === 'file') {
            // Accept if value is a File object or a non-empty string (URL)
            return !(value instanceof File) && (!value || value === '');
        }
        // For all other types, check for empty string or null/undefined
        return value === undefined || value === null || value === '';
    };

    const validate = () => {
        let valid = true;
        const newErrors = {};
        // Validate standalone fields
        for (const field of standaloneFields) {
            const value = formData[field.label];
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
                } else if (!value && formData[section.title]?.[`old_${field.label}`]) {
                    // If no new file is selected and old file exists, use the old image name or URL
                    value = formData[section.title]?.[`old_${field.label}`];
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

    const renderLabel = (label, required) => {
        if (!required) return label;
        return label.trim().endsWith('*') ? label : <>{label}<span className='required-span'>*</span></>;
    };

    const handleClickShowPassword = (fieldLabel) => {
        setShowPassword(prev => ({
            ...prev,
            [fieldLabel]: !prev[fieldLabel]
        }));
    };

    // extention of file and textarea
      const isImageFile = (url) => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(
        typeof url === 'string' ? url : (url?.name || '')
    );
 
    // const isDocFile = (url) => /\.(docx?|xlsx?|pptx?)$/i.test(url);
    // const getViewUrl = (url) =>
    //   isDocFile(url)
    //     ? `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    //     : url;
 
    const getFileNameFromUrl = (url) => {
        if (!url) return '';
        if (typeof url === 'string') {
            return url.split('/').pop();
        }
        if (typeof url === 'object' && url.name) {
            return url.name;
        }
        return '';
    };
 
    // const getFileType = (urlOrFile) => {
    //     const name = typeof urlOrFile === 'string' ? urlOrFile : (urlOrFile?.name || '');
    //     const ext = name.split('.').pop().toLowerCase();
    //     if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'image';
    //     if (['pdf'].includes(ext)) return 'pdf';
    //     if (['doc', 'docx'].includes(ext)) return 'doc';
    //     if (['xls', 'xlsx'].includes(ext)) return 'excel';
    //     if (['txt'].includes(ext)) return 'txt';
    //     return 'other';
    // };
 
    const sanitize = str => str.replace(/\s+/g, '_');
 
    const handleDownload = async (filename) => {
        try {
            await Authapi.downloadFile(filename);
        } catch (error) {
            alert("Download failed!");
        }
    };
 

    return (
        <>
            <Expired />
            <div className="col-md-12">
                <div className="row post-edit-wrapper">
                    <div className="card-header Form-main-title">
                        <Typography variant="h6" className="title" align="center">Edit Post</Typography>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    {standaloneFields.map((field, index) => (
                                        <Grid item xs={12} sm={field.type === 'ckeditor' ? 12 : 6} key={index}>
                                            {field.type === 'dropdown' ? (
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel>{renderLabel(field.label, field.required)}</InputLabel>
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
                                                    {errors[field.label] && <div className="error-text">{errors[field.label]}</div>}
                                                </FormControl>
                                            ) : field.type === 'checkbox' ? (
                                                <div>
                                                    <Typography variant="body1">{renderLabel(field.label, field.required)}</Typography>
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
                                                    {errors[field.label] && <div className="error-text">{errors[field.label]}</div>}
                                                </div>
                                            ) : field.type === 'radio' ? (
                                                <div>
                                                    <Typography variant="body1">{renderLabel(field.label, field.required)}</Typography>
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
                                                    {errors[field.label] && <div className="error-text">{errors[field.label]}</div>}
                                                </div>
                                            ) : (field.type === 'color') ? (
                                                <div className="post-form-color-wrapper">
                                                    <TextField
                                                        label={renderLabel(field.label, field.required)}
                                                        type="text"
                                                        value={formData[field.label] || '#000000'}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        margin="normal"
                                                        error={!!errors[field.label]}
                                                        helperText={errors[field.label] || ''}
                                                        className="post-form-color-text-field"
                                                    />
                                                    <TextField
                                                        type="color"
                                                        value={formData[field.label] || '#000000'}
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        className="post-form-color-picker"
                                                    />
                                                </div>
                                            ) : field.type === 'file' ? (
                                                <div>
                                                    <TextField
                                                        label={renderLabel(field.label, field.required)}
                                                        type="file"
                                                        onChange={handleInputChange(field.label, field.type)}
                                                        fullWidth
                                                        className='mt-5'
                                                        InputLabelProps={{ shrink: true }}
                                                        error={!!errors[field.label]}
                                                        inputProps={{
                                                            accept: field.allowedFileTypes ? field.allowedFileTypes.join(',') : ''
                                                        }}
                                                    />
                                                    {formData[field.label] && formData[field.label] !== "" && formData[field.label] !== null ? (
                                                        isImageFile(formData[field.label]) ? (
                                                            <div className="post-edit-file-preview">
                                                                <span className="post-edit-file-name">
                                                                    {getFileNameFromUrl(formData[field.label])}
                                                                </span>
                                                                <div className="post-edit-file-row">
                                                                    <img
                                                                        src={typeof formData[field.label] === 'string'
                                                                            ? formData[field.label]
                                                                            : URL.createObjectURL(formData[field.label])}
                                                                        alt="Current File"
                                                                        width="100"
                                                                        className="post-edit-file-image"
                                                                    />
                                                                    <IconButton
                                                                        onClick={() => handleDelete1(id, field.label)}
                                                                        color="error"
                                                                        className="action-button post-edit-delete-btn"
                                                                        title="Delete File"
                                                                    >
                                                                        <MdDelete />
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="post-edit-file-preview">
                                                                <span className="post-edit-file-name">
                                                                    {getFileNameFromUrl(formData[field.label])}
                                                                </span>
                                                                <div className="action-buttons-row">
                                                                    <IconButton
                                                                        onClick={() => handleDownload(getFileNameFromUrl(formData[field.label]))}
                                                                        color="primary"
                                                                        className="action-button action-button-download"
                                                                        title="Download File"
                                                                    >
                                                                        <MdFileDownload />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() => handleDelete1(id, field.label)}
                                                                        color="error"
                                                                        className="action-button post-edit-delete-btn"
                                                                        title="Delete File"
                                                                    >
                                                                        <MdDelete />
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                        )
                                                    ) : formData[`old_${field.label}`] ? (
                                                        <div className="post-edit-file-row">
                                                            <p>Old image</p>
                                                            <img
                                                                src={formData[`old_${field.label}`]}
                                                                alt="Old Image"
                                                                width="100"
                                                                className="post-edit-file-image"
                                                            />
                                                            <IconButton
                                                                onClick={() => handleDelete1(id, field.label)}
                                                                color="error"
                                                                className="action-button post-edit-delete-btn"
                                                                title="Delete File"
                                                            >
                                                                <MdDelete />
                                                            </IconButton>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ) : field.type === 'textarea' ? (
                                                <TextField
                                                    label={renderLabel(field.label, field.required)}
                                                    value={formData[field.label] || ''}
                                                    onChange={handleInputChange(field.label, field.type)}
                                                    multiline
                                                    rows={4}
                                                    fullWidth
                                                    variant="outlined"
                                                    margin="normal"
                                                    error={!!errors[field.label]}
                                                    helperText={errors[field.label] || ''}
                                                    inputProps={{ maxLength: field.value ? parseInt(field.value) : undefined }}
                                                />
                                            ) : field.type === 'date' ? (
                                                <TextField
                                                    label={renderLabel(field.label, field.required)}
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
                                            ) : field.type === 'password' ? (
                                                <TextField
                                                    fullWidth
                                                    label={renderLabel(field.label, field.required)}
                                                    type={showPassword[field.label] ? 'text' : 'password'}
                                                    autoComplete="new-password"
                                                    variant="outlined"
                                                    value={formData[field.label] || ''}
                                                    onChange={handleInputChange(field.label, field.type)}
                                                    margin="normal"
                                                    error={!!errors[field.label]}
                                                    helperText={errors[field.label] || ''}
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
                                            ) : field.type === 'ckeditor' ? (
                                                <div className="ckeditor-container">
                                                    <Typography variant="body1" className="post-form-ckeditor-label">{renderLabel(field.label, field.required)}</Typography>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        key={`${field.label}`}
                                                        data={formData[field.label] || ''}
                                                        config={{
                                                            minHeight: '500px',
                                                            toolbar: [
                                                                'heading',
                                                                '|',
                                                                'bold',
                                                                'italic',
                                                                'link',
                                                                'bulletedList',
                                                                'numberedList',
                                                                '|',
                                                                'outdent',
                                                                'indent',
                                                                '|',
                                                                'blockQuote',
                                                                'insertTable',
                                                                'undo',
                                                                'redo'
                                                            ]
                                                        }}
                                                        onChange={(event, editor) => handleInputChange(field.label, field.type)(event, editor)}
                                                    />
                                                    {errors[field.label] && (
                                                        <Typography
                                                            className="post-form-error-text"
                                                            variant="body2"
                                                        >
                                                            {errors[field.label]}
                                                        </Typography>
                                                    )}
                                                </div>
                                            ) : (
                                                <TextField
                                                    fullWidth
                                                    label={renderLabel(field.label, field.required)}
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
                                            <div className="post-edit-section-wrapper">
                                                    <Typography variant="h6" className='post-form-section-header'>{section.title}</Typography>
                                                   
                                                <Grid container spacing={3}>
                                                    {section.fields.map((field, index) => (
                                                        <Grid item xs={12} sm={field.type === 'ckeditor' ? 12 : 6} key={index}>
                                                            {field.type === 'dropdown' ? (
                                                                <FormControl fullWidth margin="normal">
                                                                    <InputLabel>{renderLabel(field.label, field.required)}</InputLabel>
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
                                                                    {errors[field.label] && <div className="error-text">{errors[field.label]}</div>}
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
                                                                                    value={option}
                                                                                />
                                                                            }
                                                                            label={option}
                                                                        />
                                                                    ))}
                                                                    {errors[field.label] && <div className="error-text">{errors[field.label]}</div>}
                                                                </div>
                                                            ) : field.type === 'radio' ? (
                                                                <div>
                                                                    <Typography variant="body1">{renderLabel(field.label, field.required)}</Typography>
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
                                                                    {errors[field.label] && <div className="error-text">{errors[field.label]}</div>}
                                                                </div>
                                                            ) : field.type === 'color' ? (
                                                                <div className="post-form-color-wrapper">
                                                                    <TextField
                                                                        label={renderLabel(field.label, field.required)}
                                                                        type="text"
                                                                        value={formData[section.title]?.[field.label] || '#000000'}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        margin="normal"
                                                                        error={!!errors[field.label]}
                                                                        helperText={errors[field.label] || ''}
                                                                        className="post-form-color-text-field"
                                                                    />
                                                                    <TextField
                                                                        type="color"
                                                                        value={formData[section.title]?.[field.label] || '#000000'}
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        className="post-form-color-picker"
                                                                    />
                                                                </div>
                                                            ) : field.type === 'file' ? (
                                                                <div>
                                                                    <TextField
                                                                        label={renderLabel(field.label, field.required)}
                                                                        type="file"
                                                                        onChange={handleInputChange(field.label, field.type, section.title)}
                                                                        fullWidth
                                                                        className='mt-5'
                                                                        InputLabelProps={{ shrink: true }}
                                                                        error={!!errors[field.label]}
                                                                        inputProps={{
                                                                            accept: field.allowedFileTypes ? field.allowedFileTypes.join(',') : ''
                                                                        }}
                                                                    />
                                                                    {errors[field.label] && <div className="error-text">{errors[field.label]}</div>}
                                                                    {formData[section.title]?.[field.label] && formData[section.title][field.label] !== "" && formData[section.title][field.label] !== null ? (
                                                                        isImageFile(formData[section.title][field.label]) ? (
                                                                            <div className="post-edit-file-preview">
                                                                                <span className="post-edit-file-name">
                                                                                    {getFileNameFromUrl(formData[section.title][field.label])}
                                                                                </span>
                                                                                <div className="post-edit-file-row">
                                                                                    <img
                                                                                        src={typeof formData[section.title][field.label] === 'string'
                                                                                            ? formData[section.title][field.label]
                                                                                            : URL.createObjectURL(formData[section.title][field.label])}
                                                                                        alt="Current File"
                                                                                        width="100"
                                                                                        className="post-edit-file-image"
                                                                                    />
                                                                                    <IconButton
                                                                                        onClick={() => handleDelete1(id, `${sanitize(section.title)}.${field.label}`)}
                                                                                        color="error"
                                                                                        className="action-button post-edit-delete-btn"
                                                                                        title="Delete File"
                                                                                    >
                                                                                        <MdDelete />
                                                                                    </IconButton>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="post-edit-file-preview">
                                                                                <span className="post-edit-file-name">
                                                                                    {getFileNameFromUrl(formData[section.title][field.label])}
                                                                                </span>
                                                                                <div className="action-buttons-row">
                                                                                    <IconButton
                                                                                        onClick={() => handleDownload(getFileNameFromUrl(formData[section.title][field.label]))}
                                                                                        color="primary"
                                                                                        className="action-button action-button-download"
                                                                                        title="Download File"
                                                                                    >
                                                                                        <MdFileDownload />
                                                                                    </IconButton>
                                                                                    <IconButton
                                                                                        onClick={() => handleDelete1(id, `${sanitize(section.title)}.${field.label}`)}
                                                                                        color="error"
                                                                                        className="action-button post-edit-delete-btn"
                                                                                        title="Delete File"
                                                                                    >
                                                                                        <MdDelete />
                                                                                    </IconButton>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    ) : formData[section.title]?.[`old_${field.label}`] ? (
                                                                        <div className="post-edit-file-row">
                                                                            <p>Old image</p>
                                                                            <img
                                                                                src={formData[section.title][`old_${field.label}`]}
                                                                                alt="Old Image"
                                                                                width="100"
                                                                                className="post-edit-file-image"
                                                                            />
                                                                            <IconButton
                                                                                onClick={() => handleDelete1(id, `${sanitize(section.title)}.${field.label}`)}
                                                                                color="error"
                                                                                className="action-button post-edit-delete-btn"
                                                                                title="Delete File"
                                                                            >
                                                                                <MdDelete />
                                                                            </IconButton>
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            ) : field.type === 'textarea' ? (
                                                                <TextField
                                                                    label={renderLabel(field.label, field.required)}
                                                                    value={formData[section.title]?.[field.label] || ''}
                                                                    onChange={handleInputChange(field.label, field.type, section.title)}
                                                                    multiline
                                                                    rows={4}
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    margin="normal"
                                                                    error={!!errors[field.label]}
                                                                    helperText={errors[field.label] || ''}
                                                                    inputProps={{ maxLength: field.value ? parseInt(field.value) : undefined }}
                                                                />
                                                            ) : field.type === 'date' ? (
                                                                <TextField
                                                                    label={renderLabel(field.label, field.required)}
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
                                                            ) : field.type === 'password' ? (
                                                                <TextField
                                                                    fullWidth
                                                                    label={renderLabel(field.label, field.required)}
                                                                    type={showPassword[field.label] ? 'text' : 'password'}
                                                                    autoComplete="new-password"
                                                                    variant="outlined"
                                                                    value={formData[section.title]?.[field.label] || ''}
                                                                    onChange={handleInputChange(field.label, field.type, section.title)}
                                                                    margin="normal"
                                                                    error={!!errors[field.label]}
                                                                    helperText={errors[field.label] || ''}
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
                                                            ) : field.type === 'ckeditor' ? (
                                                                <div className="ckeditor-container">
                                                                    <Typography variant="body1" className="post-form-ckeditor-label">{renderLabel(field.label, field.required)}</Typography>
                                                                    <CKEditor
                                                                        editor={ClassicEditor}
                                                                        key={`${section.title}-${field.label}`}
                                                                        data={formData[section.title]?.[field.label] || ''}
                                                                        config={{
                                                                            minHeight: '500px',
                                                                            toolbar: [
                                                                                'heading',
                                                                                '|',
                                                                                'bold',
                                                                                'italic',
                                                                                'link',
                                                                                'bulletedList',
                                                                                'numberedList',
                                                                                '|',
                                                                                'outdent',
                                                                                'indent',
                                                                                '|',
                                                                                'blockQuote',
                                                                                'insertTable',
                                                                                'undo',
                                                                                'redo'
                                                                            ]
                                                                        }}
                                                                        onChange={(event, editor) => handleInputChange(field.label, field.type, section.title)(event, editor)}
                                                                    />
                                                                    {errors[field.label] && (
                                                                        <Typography
                                                                            className="post-form-error-text"
                                                                            variant="body2"
                                                                        >
                                                                            {errors[field.label]}
                                                                        </Typography>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <TextField
                                                                    fullWidth
                                                                    label={renderLabel(field.label, field.required)}
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

                                <Grid container justifyContent="flex-start" spacing={2} className="post-form-action-buttons">
                                    <Grid item>
                                        <Button
                                            className='submit-btn'
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            className='cancel-btn'
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

