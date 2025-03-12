import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { TextField, Button, Container, MenuItem, Select, InputLabel, FormControl, Grid, Typography, Tooltip, IconButton, Collapse } from '@mui/material';
import Authapi from '../Authapi';
import Expired from '../Login/ExpiredToken';
import { useNavigate } from 'react-router-dom';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const Page = () => {
    const [formData, setFormData] = useState({});
    const [postTitles, setPostTitles] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

    useEffect(() => {
        const fetchPostTitles = async () => {
            try {
                const response = await Authapi.dynamicListData();
                // console.log(response)
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

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     setErrors({});

    //     const newErrors = {};
    //     if (!formData.page_name) newErrors.page_name = "Page Name is required.";
    //     if (!formData.image) newErrors.image = "Image is required.";

    //     if (Object.keys(newErrors).length > 0) {
    //         setErrors(newErrors);
    //         return;
    //     }

    //     const form = new FormData();
    //     form.append('page_name', formData.page_name);
    //     form.append('page_description', formData.page_description);
    //     form.append('image', formData.image);
    //     form.append('ordering', formData.ordering);
    //     form.append('post_type', formData.post_type);

    //     try {
    //         const response = await Authapi.Pagestoredata(form);
    //         if (response) {
    //             Swal.fire('Success', ' added successfully!', 'success');
    //             navigate('/page-list')
    //         } else {
    //             Swal.fire('Error', 'Failed to add .', 'error');
    //         }
    //     } catch (error) {
    //         console.error("API Error:", error);
    //         Swal.fire('Error', 'An error occurred while submitting.', 'error');
    //     }
    // };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});

        const newFormData = { ...formData };

        // if (!newFormData.page_name) newFormData.page_name = '-';
        // if (!newFormData.ordering) newFormData.ordering = '-';  
        // if (!newFormData.image) newFormData.image = '-';  
        // if (!newFormData.page_description) newFormData.page_description = '-'; 
        // if (!newFormData.post_type) newFormData.post_type = '-';  



        const newErrors = {};
        if (!newFormData.page_name) newErrors.page_name = "Page Name is required.";
        if (!newFormData.image) newErrors.image = "Image is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const form = new FormData();
        form.append('page_name', newFormData.page_name);
        form.append('page_description', newFormData.page_description || "");
        form.append('image', newFormData.image);
        form.append('ordering', newFormData.ordering || " ");
        form.append('post_type', newFormData.post_type || " ");
        form.append('button_name', newFormData.button_name || " ");
        form.append('button_link', newFormData.button_link || " ");

        try {
            const response = await Authapi.Pagestoredata(form);
            if (response) {
                Swal.fire('Success', ' added successfully!', 'success');
                navigate('/page-list');
            } else {
                Swal.fire('Error', 'Failed to add .', 'error');
            }
        } catch (error) {
            console.error("API Error:", error);
            Swal.fire('Error', 'An error occurred while submitting.', 'error');
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
            <div className="col-md-12">
                <div
                    className="row "
                    style={{
                        marginLeft: "20%",
                        width: "80%",
                        marginBottom: "20px",
                        marginTop: "1%",
                    }}
                >
                    <div className="card-header Form-main-title">
                        {/* <h5 className="title">Page</h5> */}
                        <Typography variant="h6" className="title" align="center">
                            Add Page
                        </Typography>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form encType="multipart/form-data" id="servicesForm" onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Page Name"
                                            name='page_name'
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            onChange={handleChange}
                                            value={formData.page_name}
                                            error={!!errors.page_name}
                                            helperText={errors.page_name}
                                        />
                                    </Grid>


                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Ordering"
                                            type="Ordering"
                                            fullWidth
                                            margin="normal"
                                            min="0"
                                            onKeyPress={preventTextAndMinus}
                                            name="ordering"
                                            onChange={handleChange}
                                            value={formData.ordering}
                                            error={!!errors.ordering}
                                            helperText={errors.ordering}
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
                                            onChange={handleChange}
                                            error={!!errors.image}
                                            helperText={errors.image}
                                        />
                                        {errors[!!errors.image] && <Typography color="error">{errors[!!errors.image]}</Typography>}
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth style={{ marginTop: '15px' }}>
                                            <InputLabel>Post Type</InputLabel>
                                            <Select
                                                label="Post Type"
                                                name="post_type"
                                                value={formData.post_type || ''}
                                                onChange={handleChange}
                                                fullWidth
                                                style={{
                                                    backgroundColor: '#f4f6f8',
                                                    borderRadius: '5px'
                                                }}
                                                error={!!errors.post_type}
                                            >
                                                {postTitles.length > 0 ? (
                                                    postTitles
                                                        .filter((title) => title.post_type === 'custom_post' && title.status === 1 && title.deleted_at === 0)
                                                        .map((title) => (
                                                            <MenuItem key={title.id} value={title.id}>
                                                                {title.post_title}
                                                            </MenuItem>
                                                        ))
                                                ) : (
                                                    <MenuItem disabled>No post types available</MenuItem>
                                                )}
                                            </Select>
                                            {errors.post_type && <Typography color="error">{errors.post_type}</Typography>}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Page Description"
                                            name='page_description'
                                            type="text"
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={4}
                                            onChange={handleChange}
                                            value={formData.page_description}
                                            error={!!errors.page_description}
                                            helperText={errors.page_description}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Page Settings Section */}
                                <div style={{ 
                                    marginTop: '20px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '15px',  // Added padding to create space between border and content
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        backgroundColor: 'rgb(244, 246, 248)',
                                        padding: '15px',
                                        borderRadius: '8px'
                                    }}>
                                        <Typography 
                                            variant="h6" 
                                            // style={{ 
                                            //     color: '#333',
                                            //     fontSize: '16px',
                                            //     fontWeight: '500'
                                            // }}
                                        >
                                            Page Settings
                                        </Typography>
                                        <Tooltip title={isSettingsExpanded ? "Collapse Section" : "Expand Section"}>
                                            <IconButton
                                                aria-label="toggle-section"
                                                onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
                                                // size="small"
                                                style={{ color: '#113B4F' }}
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

export default Page;

