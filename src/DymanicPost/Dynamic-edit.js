import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, Tooltip, Container, MenuItem, Select, InputLabel, FormControl, Grid, Typography } from '@mui/material';
import Expired from '../Login/ExpiredToken';
import Authapi from '../Authapi';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import "../Custom.css";

const DynamicEditForm = ({ existingData }) => {
    const { id } = useParams();
    const [fields, setFields] = useState([{
        id: Date.now(),
        label: '',
        type: '',
        value: '',
        options: []
    }]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        post_title: '',
        post_type: '',
        ordering: '',
    })


    useEffect(() => {

        if (existingData) {
            setFormData(existingData.formData);
            setFields(existingData.post_description.map((desc, index) => ({
                id: index,
                label: desc.label,
                type: desc.type,
                value: desc.value || '',
                options: desc.options


            })));
        } else if (id) {

            const fetchData = async () => {
                try {
                    const response = await Authapi.dynamicEditData(id);
                    setFormData(response);
                    setFields(response.post_description.map((desc, index) => ({
                        id: index,
                        label: desc.label,
                        type: desc.type,
                        value: desc.value || '',
                        options: desc.options
                    })));
                } catch (error) {
                    console.log('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [id, existingData]);

    const handleAddField = () => {
        setFields([...fields, { id: Date.now(), label: '', type: '', value: '', options: [] }]);
    };


    const handleAddFieldAfter = (id) => {
        const newField = { id: Date.now(), label: '', type: '', value: '', options: [] };
        const index = fields.findIndex(field => field.id === id);
        setFields([
            ...fields.slice(0, index + 1),
            newField,
            ...fields.slice(index + 1)
        ]);
    };

    const handleInputChange = (e, id) => {
        const { name, value } = e.target;
        setFields(fields.map(field => (field.id === id ? { ...field, [name]: value } : field)));
    };

    const handleTypeChange = (e, id) => {
        const { value } = e.target;
        setFields(fields.map(field => (field.id === id ? { ...field, type: value, value: '', options: [] } : field)));
    };

    const handleRemoveField = (id) => {
        setFields(fields.filter(field => field.id !== id));
    };

    const handleTitleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOptionChange = (e, id) => {
        const { value } = e.target;
        setFields(fields.map(field => (field.id === id ? { ...field, options: value.split(',') } : field)));
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitformData = {
            post_title: formData.post_title,
            post_type: formData.post_type,
            ordering: formData.ordering,

            post_description: fields.map(field => ({
                label: field.label,
                type: field.type,
                value: field.value,
                options: field.options

            }))
        };

        try {
            const response = await Authapi.dynamicupdatedata(id, submitformData);
            if (response) {
                Swal.fire('Success', 'Data submitted successfully!', 'success');
                navigate('/dynamic-list-data');
                // fetchData();
            }
        } catch (error) {
            console.log('Error submitting data:', error);
            Swal.fire('Error', 'There was an issue with your submission.', 'error');
        }
    };

    const preventTextAndMinus = (e) => {

        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter', 'NumpadAdd', 'NumpadSubtract'];

        if (
            !/^[0-9]$/.test(e.key) &&
            !allowedKeys.includes(e.key)
        ) {
            e.preventDefault();
        }
    };

    return (
        <>
            <Expired />
            <div className="col-md-12">
            <div className="row mt-4" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px" }}>
                    <div className="card-header Form-main-title">
                        <Typography variant="h6" className="title" align="center">Update Dynamic Post</Typography>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form encType="multipart/form-data" onSubmit={handleSubmit} className='dynamicEditForm'>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Post Title"
                                            name="post_title"
                                            className='field-of-dynamic-from'
                                            fullWidth
                                            value={formData.post_title}
                                            onChange={handleTitleChange}
                                            style={{
                                                marginBottom: '15px',
                                                backgroundColor: '#f4f6f8',
                                                borderRadius: '5px'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Ordering"
                                            name="ordering"
                                            className='field-of-dynamic-from'
                                            fullWidth
                                            min="0"
                                            onKeyPress={preventTextAndMinus}
                                            value={formData.ordering}
                                            onChange={handleTitleChange}
                                            style={{
                                                marginBottom: '15px',
                                                backgroundColor: '#f4f6f8',
                                                borderRadius: '5px'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth style={{ marginTop: '15px' }}>
                                            <InputLabel>Post Type</InputLabel>
                                            <Select
                                                label="Post Type"
                                                className='dropdown-css-change field-of-dynamic-from'
                                                name="post_type"
                                                value={formData.post_type}
                                                onChange={handleTitleChange}
                                                fullWidth
                                                style={{
                                                    backgroundColor: '#f4f6f8',
                                                    borderRadius: '5px'
                                                }}
                                            >
                                                <MenuItem value="custom_post">Custom Post</MenuItem>
                                                <MenuItem value="normal_post">Normal Post</MenuItem>

                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                {fields.map((field) => (
                                    <div key={field.id} style={{ marginBottom: '30px', marginTop: '30px' }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={5}>
                                                <TextField
                                                    label="Label"
                                                    name="label"
                                                    className='field-of-dynamic-from'
                                                    fullWidth
                                                    value={field.label}
                                                    onChange={(e) => handleInputChange(e, field.id)}
                                                    style={{
                                                        marginBottom: '15px',
                                                        backgroundColor: '#f4f6f8',
                                                        borderRadius: '5px'
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={5}>
                                                <FormControl fullWidth style={{ marginBottom: '15px' }}>
                                                    <InputLabel>Field Type</InputLabel>
                                                    <Select
                                                        label="Field Type"
                                                        className='dropdown-css-change field-of-dynamic-from'
                                                        name="type"
                                                        value={field.type}
                                                        onChange={(e) => handleTypeChange(e, field.id)}
                                                        fullWidth
                                                        style={{
                                                            backgroundColor: '#f4f6f8',
                                                            borderRadius: '5px'
                                                        }}
                                                    >
                                                        <MenuItem value="text">Text</MenuItem>
                                                        <MenuItem value="file">File</MenuItem>
                                                        <MenuItem value="textarea">Textarea</MenuItem>
                                                        <MenuItem value="number">Number</MenuItem>
                                                        <MenuItem value="checkbox">Checkbox</MenuItem>
                                                        <MenuItem value="radio">Radio</MenuItem>
                                                        <MenuItem value="date">Date</MenuItem>
                                                        <MenuItem value="button">Button</MenuItem>
                                                        <MenuItem value="email">Email</MenuItem>
                                                        <MenuItem value="password">Password</MenuItem>
                                                        <MenuItem value="url">Url</MenuItem>
                                                        <MenuItem value="dropdown">Dropdown</MenuItem>
                                                        <MenuItem value="color">Color</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={12} sm={2} className='dynamic-field-two-btns'>
                                                {/* <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleRemoveField(field.id)}
                                                    style={{
                                                        marginTop: '15px',
                                                        fontSize: "larger",
                                                        backgroundColor: '#d32f2f',
                                                        '&:hover': {
                                                            backgroundColor: '#c62828'
                                                        }
                                                    }}
                                                >
                                                    <MdDelete />
                                                </Button> */}
                                                <Tooltip title="Delete" className='dynamic-field-delete-btn mt-2'>
                                                    <IconButton aria-label="delete" color='primary'>
                                                        <MdDelete onClick={() => handleRemoveField(field.id)} />
                                                    </IconButton>
                                                </Tooltip>
                                                {/* </Grid> */}
                                                {/* <Grid item xs={12} sm={2}> */}
                                                {/* <Button
                                                    variant="contained"
                                                    onClick={() => handleAddFieldAfter(field.id)}
                                                    style={{
                                                        marginTop: '15px',
                                                        fontSize: "larger",
                                                        backgroundColor: '#2c9dd4',
                                                        '&:hover': {
                                                            backgroundColor: '#1565c0'
                                                        }
                                                    }}
                                                >
                                                    <FaCirclePlus />
                                                </Button> */}
                                                <Tooltip title="Add New Field" className='dynamic-field-add-btn mt-2'>
                                                    <IconButton aria-label="add" color='primary'>
                                                        <FaCirclePlus onClick={() => handleAddFieldAfter(field.id)} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                        {/* Handle Dropdown, Checkbox, Radio options */}
                                        {(field.type === 'dropdown' || field.type === 'checkbox' || field.type === 'radio') && (
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label={`${field.type.charAt(0).toUpperCase() + field.type.slice(1)} Options (comma-separated)`}
                                                    value={field.options.join(',')}
                                                    onChange={(e) => handleOptionChange(e, field.id)}
                                                    className='field-of-dynamic-from'
                                                    fullWidth
                                                    style={{
                                                        marginBottom: '15px',
                                                        backgroundColor: '#f4f6f8',
                                                        borderRadius: '5px'
                                                    }}
                                                />
                                            </Grid>
                                        )}
                                    </div>
                                ))}

                                 {/*  Working code for add field btn 21-01-25 START  */}
                                {/* <Button
                                    variant="contained"
                                    onClick={handleAddField}
                                    style={{
                                        marginLeft: '40%',
                                        fontSize: 'larger',
                                        backgroundColor: '#2c9dd4',
                                        '&:hover': {
                                            backgroundColor: '#1565c0'
                                        }
                                    }}
                                >
                                    <FaCirclePlus />
                                </Button> */}
                                {/*  Working code for add field btn 21-01-25 END  */}

                                <Grid container justifyContent="flex-start" spacing={2} marginTop={3}>
                                    <Grid item>
                                        <Button variant="contained" className='submit-btn' color="primary" style={{ backgroundColor: "#2c9dd4" }} type="submit">
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button className='cancel-btn' style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }}
                                            onClick={() => navigate('/dynamic-list-data')}>
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

export default DynamicEditForm
