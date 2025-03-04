import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';
import { Typography, Container, IconButton, Tooltip, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Radio, RadioGroup, Collapse } from '@mui/material';
import Authapi from '../Authapi';

import Expired from '../Login/ExpiredToken';
import { useNavigate, useParams } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';



const PageEdit = () => {
    const [postTitles, setPostTitles] = useState([]);
    const [formData, setFormData] = useState({

    })
    const { id } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})
    const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);


    useEffect(() => {
        const fetchPostTitles = async () => {
            try {
                const response = await Authapi.dynamicListData();
                // console.log("API Response:", response);
                if (response && response.results) {
                    const titles = response.results;
                    if (Array.isArray(titles)) {
                        setPostTitles(titles);
                    } else {
                        console.error("Post titles is not an array:", titles);
                    }
                } else {
                    console.error("Response or results are undefined:", response);
                }
            } catch (error) {
                console.error("Error fetching post titles:", error);
            }
        };

        fetchPostTitles();
    }, []);

    useEffect(() => {
        fetchData(id);
    }, [id]);

    const fetchData = async (id) => {
        try {
            const event = await Authapi.pageEditData(id);
            if (event) {
                setFormData({
                    page_name: event.page_name || '',
                    page_description: event.page_description || '',
                    image: event.image || '',
                    ordering: event.ordering || '',
                    post_type: event.post_type || '',
                    button_name: event.button_name || '',
                    button_link: event.button_link || '',
                });
                
                // Set isSettingsExpanded to true only if button_name or button_link has data
                setIsSettingsExpanded(!!(event.button_name || event.button_link));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error!', 'Failed to fetch data. Please try again.', 'error');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = new FormData();
        form.append('page_name', formData.page_name);
        form.append('page_description', formData.page_description);
        form.append('image', formData.image);
        form.append('ordering', formData.ordering);
        form.append('post_type', formData.post_type);
        form.append('button_name', formData.button_name);
        form.append('button_link', formData.button_link);
        try {
            const response = await Authapi.pageupdatedata(id, form);
            if (response) {
                Swal.fire('Success', ' added successfully!', 'success');
                navigate('/page-list')
            } else {
                Swal.fire('Error', 'Failed to add .', 'error');
            }
        } catch (error) {
            console.error("API Error:", error);
            Swal.fire('Error', 'An error occurred while submitting.', 'error');
        }
    };




    const handleDelete1 = async (id) => {
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
                const response = await Authapi.imgdeletepage(id);
                console.log("Delete response:", response); // Log the response for debugging

                if (response && response.status) {
                    Swal.fire('Success!', 'Item marked as deleted.', 'success').then(() => {
                        // Fetch updated data to ensure state is in sync with backend
                        fetchData(); // Fetch data again to ensure state is updated
                        window.location.reload(); // Reload the page (optional based on your state management)
                    });
                } else {
                    throw new Error(response?.message || 'Failed to delete item');
                }
            } catch (error) {
                console.error("Error deleting item:", error); // Log the error for debugging
                Swal.fire('Error!', error.response?.data?.message || error.message || 'Failed to delete item', 'error');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'image' && files && files[0]) {
            const file = files[0];
            if (file && file.type.startsWith('image')) {
                const img = new Image();
                const reader = new FileReader();

                reader.onload = () => {
                    img.src = reader.result;
                    img.onload = () => {
                        const { width, height } = img;
                        if (width >= 50 && height >= 50 && width <= 1600 && height <= 1600) {
                            setErrors((prev) => ({
                                ...prev,
                                image: '',
                            }));
                            setFormData((prev) => ({
                                ...prev,
                                [name]: file,
                            }));
                        } else {
                            setErrors((prev) => ({
                                ...prev,
                                image: 'Image dimensions must be between 50px and 1600px for both width and height.',
                            }));
                        }
                    };
                };
                reader.readAsDataURL(file);
            } else {
                setErrors((prev) => ({
                    ...prev,
                    image: 'Please select a valid image file (e.g., PNG, JPG, GIF).',
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: files ? files[0] : value,
            }));
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
            {/* <div className="container-fluid panel-header panel-header-sm"></div> */}
            <div className="col-md-12">
                <div className="row mt-4" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px" }}>
                    <div className="card-header Form-main-title">
                        {/* <h5 className="title">Page</h5> */}
                        <Typography variant="h6" className="title" align="center">
                            Update Page
                        </Typography>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form encType="multipart/form-data" id="servicesForm" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Page Title"
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            value={formData.page_name}
                                            onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                                        />
                                    </Grid>


                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Ordering"
                                            type="Ordering"
                                            fullWidth
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            min="0"
                                            onKeyPress={preventTextAndMinus}
                                            name="ordering"
                                            onChange={handleChange}
                                            value={formData.ordering}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Page Image"
                                            type="file"
                                            fullWidth
                                            margin="normal"
                                            inputProps={{ accept: 'image/jpeg, image/png, image/jpg' }}
                                            InputLabelProps={{ shrink: true }}
                                            name="image"
                                            // onChange={(e) => {
                                            //     const file = e.target.files[0];
                                            //     setFormData({ ...formData, image: file, image: file });
                                            // }}
                                            onChange={handleChange}
                                            error={!!errors.image}
                                            helperText={errors.image}
                                        />
                                        {formData.image ? (
                                            formData.image instanceof File ? (
                                                <div>
                                                    {/* <p>Image: {formData.image.name}</p> */}
                                                    <p>New Image</p>
                                                    <img
                                                        src={URL.createObjectURL(formData.image)}
                                                        alt="Preview"
                                                        width="100"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <p>Current Image</p>
                                                    {/* <p>{formData.image.split('/').pop()}</p> */}
                                                    <img
                                                        src={formData.image}
                                                        alt="Current image preview"
                                                        width="100"
                                                    />
                                                    <Tooltip title="Delete">
                                                        <IconButton aria-label="delete" className='action-button' color="primary" onClick={() => handleDelete1(id, formData.image.split('/').pop())}>
                                                            <MdDelete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            )
                                        ) : null}
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth style={{ marginBottom: '15px' }}>
                                            <InputLabel>Post Type</InputLabel>
                                            <Select
                                                label="Post Type"
                                                name="post_type"
                                                value={formData.post_type || ''}
                                                fullWidth
                                                style={{
                                                    backgroundColor: '#f4f6f8',
                                                    borderRadius: '5px'
                                                }}
                                                onChange={(e) => setFormData({ ...formData, post_type: e.target.value })}
                                            >
                                                {postTitles.length > 0 ? (
                                                    postTitles
                                                        .filter((title) => title.post_type === 'custom_post' && title.status === 1  && title.deleted_at === 0)
                                                        .map((title) => (
                                                            <MenuItem key={title.id} value={title.id}>
                                                                {title.post_title}
                                                            </MenuItem>
                                                        ))
                                                ) : (
                                                    <MenuItem disabled>No post types available</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Page Description"
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={4}
                                            name='page_description'
                                            InputLabelProps={{ shrink: true }}
                                            value={formData.page_description}
                                            onChange={(e) => setFormData({ ...formData, page_description: e.target.value })}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Page Settings Section */}
                                <div style={{ 
                                    marginTop: '20px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '15px',
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        backgroundColor: '#f4f4f4',
                                        padding: '15px',
                                        borderRadius: '4px',
                                    }}>
                                        <Typography 
                                            variant="h6" 
                                            style={{ 
                                                color: '#333',
                                                fontSize: '16px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Page Settings
                                        </Typography>
                                        <Tooltip title={isSettingsExpanded ? "Collapse Section" : "Expand Section"}>
                                            <IconButton
                                                aria-label="toggle-section"
                                                onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                                                size="small"
                                                style={{ color: '#0f4c75' }}
                                            >
                                                {isSettingsExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                    
                                    <Collapse in={isSettingsExpanded}>
                                        <div style={{ padding: '15px', marginTop: '20px' }}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Button Name"
                                                        name="button_name"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        onChange={handleChange}
                                                        value={formData.button_name || ''}
                                                        InputProps={{
                                                            style: { 
                                                                backgroundColor: 'white',
                                                                border: '1px solid #ddd'
                                                            }
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: '#ddd',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: '#bbb',
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Button Link"
                                                        name="button_link"
                                                        type="url"
                                                        fullWidth
                                                        variant="outlined"
                                                        onChange={handleChange}
                                                        value={formData.button_link || ''}
                                                        InputProps={{
                                                            style: { 
                                                                backgroundColor: 'white',
                                                                border: '1px solid #ddd'
                                                            }
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: '#ddd',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: '#bbb',
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Collapse>
                                </div>

                                <Grid container justifyContent="flex-start" spacing={2} marginTop={3}>
                                    <Grid item>
                                        <Button className='submit-btn' variant="contained" color="primary" style={{ backgroundColor: "#2c9dd4" }} type="submit">
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button className='cancel-btn' style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }}
                                            onClick={() => navigate('/page-list')}>
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

export default PageEdit;


