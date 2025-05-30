import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, Tooltip, Container, MenuItem, Select, InputLabel, FormControl, Grid, Typography, Collapse, Switch, Alert } from '@mui/material';
import Expired from '../Login/ExpiredToken';
import { FaPlusCircle, FaCheckCircle, FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Authapi from '../Authapi';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import "../Custom.css";

const DynamicEditForm = ({ existingData }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [standaloneFields, setStandaloneFields] = useState([]);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);

    const [formData, setFormData] = useState({
        post_title: '',
        post_type: '',
        ordering: '',
    });

    const [sections, setSections] = useState([]);

    useEffect(() => {
        const init = async () => {
            if (existingData) {
                setFormData(existingData.formData);
                transformSections(existingData.post_description);
                // console.log("IFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
                // console.log(existingData.formData);
                // await checkExistingPosts(existingData.formData.post_title);
                await checkExistingPosts(existingData.formData.id);
            } else if (id) {
                const response = await Authapi.dynamicEditData(id);
                setFormData(response);
                // console.log("ELSEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
                // console.log(response);

                transformSections(response.post_description);
                // await checkExistingPosts(response.post_title);
                await checkExistingPosts(response.id);
            }
        };
        init();
    }, [id, existingData]);

    const checkExistingPosts = async (post_id) => {
        try {
            console.log("Checking posts for title:", post_id);
            if (!post_id) {
                console.log('No post_id available');
                return;
            }
            const response = await Authapi.postData(post_id);
            console.log("API Response:", response);
            if (response && response.status === true && Array.isArray(response.results)) {
                // If we're editing an existing post (have an id), we should count other posts
                const otherPosts = response.results.filter(post => post.id !== Number(id));
                console.log("Other posts count:", otherPosts.length);
                setButtonsDisabled(otherPosts.length > 0);
            } else {
                setButtonsDisabled(false);
            }
        } catch (error) {
            console.log('Error checking posts:', error);
            setButtonsDisabled(false);
        }
    };

    // Add this effect to handle post_title changes
    // useEffect(() => {
    //     if (formData.post_title) {
    //         checkExistingPosts(formData.post_title);
    //     }
    // }, [formData.post_title]);

    const transformSections = (postDescription) => {
        const standaloneFields = [];
        const sections = [];

        Object.entries(postDescription).forEach(([key, value], index) => {
            if (isNaN(key)) {
                // This is a section
                let fields = [];
                let enabled = false;
                if (value && typeof value === 'object') {
                    enabled = value.enabled || false;
                    // Only collect numeric keys as fields
                    fields = Object.entries(value)
                        .filter(([k, v]) => !isNaN(k))
                        .map(([k, v]) => v);
                }
                sections.push({
                    id: Date.now() + index,
                    isOpen: true,
                    title: key,
                    enabled: enabled,
                    fields: fields.map((field, fieldIndex) => ({
                        id: Date.now() + fieldIndex,
                        label: field.label || '',
                        type: field.type || 'text',
                        value: field.value || '',
                        options: field.options || [],
                        required: field.required || false,
                        allowedFileTypes: field.allowedFileTypes || []
                    })),
                    isEditing: false
                });
            } else {
                // This is a standalone field
                standaloneFields.push({
                    id: Date.now() + index,
                    label: value.label || '',
                    type: value.type || 'text',
                    value: value.value || '',
                    options: value.options || [],
                    required: value.required || false,
                    allowedFileTypes: value.allowedFileTypes || []
                });
            }
        });

        setStandaloneFields(standaloneFields);
        setSections(sections);
    };

    const handleAddField = (sectionId, fieldId) => {
        setSections(
            sections.map((section) => {
                if (section.id === sectionId) {
                    const newField = { 
                        id: Date.now(), 
                        label: "", 
                        type: "text", 
                        value: "", 
                        options: [], 
                        required: false,
                        allowedFileTypes: []
                    };
                    const fieldIndex = section.fields.findIndex((field) => field.id === fieldId);
                    const updatedFields = [
                        ...section.fields.slice(0, fieldIndex + 1),
                        newField,
                        ...section.fields.slice(fieldIndex + 1),
                    ];
                    return { ...section, fields: updatedFields };
                }
                return section;
            })
        );
    };

    const handleInputChange = (e, sectionId, fieldId) => {
        const { name, value } = e.target;
        setSections(sections.map(section =>
            section.id === sectionId
                ? {
                    ...section,
                    fields: section.fields.map(field =>
                        field.id === fieldId ? { ...field, [name]: value } : field
                    )
                }
                : section
        ));
    };

    const handleTypeChange = (e, sectionId, fieldId) => {
        const { value } = e.target;
        setSections(sections.map(section =>
            section.id === sectionId
                ? {
                    ...section,
                    fields: section.fields.map(field =>
                        field.id === fieldId ? { ...field, type: value, value: '', options: [] } : field
                    )
                }
                : section
        ));
    };

    const handleRemoveField = (sectionId, fieldId) => {
        if (sectionId === null) {
            // Handle standalone fields
            setStandaloneFields((prevFields) => prevFields.filter((field) => field.id !== fieldId));
        } else {
            // Handle fields within sections
            setSections(
                sections.map((section) =>
                    section.id === sectionId
                        ? { ...section, fields: section.fields.filter((field) => field.id !== fieldId) }
                        : section
                )
            );
        }
    };

    const handleTitleChange = (e, sectionId) => {
        const { value } = e.target;
        setSections(sections.map(section =>
            section.id === sectionId ? { ...section, title: value } : section
        ));
    };

    const handleOptionChange = (e, sectionId, fieldId) => {
        const { value } = e.target;
      
        if (sectionId === null) {
          // Update standalone fields
          setStandaloneFields((prevFields) =>
            prevFields.map((field) =>
              field.id === fieldId ? { ...field, options: value.split(",") } : field
            )
          );
        } else {
          // Update fields within sections
          setSections(
            sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    fields: section.fields.map((field) =>
                      field.id === fieldId ? { ...field, options: value.split(",") } : field
                    ),
                  }
                : section
            )
          );
        }
      };

    const handleToggleSection = (sectionId) => {
        setSections(sections.map(section =>
            section.id === sectionId ? { ...section, isOpen: !section.isOpen } : section
        ));
    };

    const handleRemoveSection = (sectionId) => {
        setSections(sections.filter(section => section.id !== sectionId));
    };

    const handleAddSection = (currentSectionId) => {
        setSections((prevSections) => {
            const newSection = {
                id: Date.now(),
                isOpen: true,
                title: `Section ${prevSections.length + 1}`,
                isEditing: false,
                isOpen: true,  // New section starts open by default
                fields: [
                    {
                        id: Date.now(),
                        label: "",
                        type: "text",
                        value: "",
                        options: [],
                    },
                ],
            };

            const currentIndex = prevSections.findIndex(section => section.id === currentSectionId);
            const updatedSections = [
                ...prevSections.slice(0, currentIndex + 1),
                newSection,
                ...prevSections.slice(currentIndex + 1),
            ];

            return updatedSections;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare standalone fields
        const standaloneFieldsData = standaloneFields.map((field) => ({
            label: field.label,
            type: field.type,
            value: field.value,
            options: field.options,
            required: field.required,
            allowedFileTypes: field.allowedFileTypes || [],
        }));

        // Prepare section fields
        const sectionFields = sections.reduce((acc, section, index) => {
            const sectionTitle = section.title || `Section ${index + 1}`;
            const sectionObj = { enabled: section.enabled };
            section.fields.forEach((field, idx) => {
                sectionObj[idx] = {
                    label: field.label,
                    type: field.type,
                    value: field.value,
                    options: field.options,
                    required: field.required,
                    allowedFileTypes: field.allowedFileTypes || [],
                };
            });
            acc[sectionTitle] = sectionObj;
            return acc;
        }, {});

        // Combine standalone fields directly with section fields
        const postDescription = {
            ...standaloneFields.reduce((acc, field, idx) => {
                acc[idx] = {
                    label: field.label,
                    type: field.type,
                    value: field.value,
                    options: field.options,
                    required: field.required,
                    allowedFileTypes: field.allowedFileTypes || [],
                };
                return acc;
            }, {}),
            ...sectionFields,
        };

        const submitFormData = {
            post_title: formData.post_title,
            post_type: formData.post_type,
            ordering: formData.ordering,
            post_description: postDescription,
        };

        try {
            let response;
            if (id) {
                // If an ID exists, update the existing entry
                response = await Authapi.dynamicupdatedata(id, submitFormData);
            } else {
                // Otherwise, create a new entry
                response = await Authapi.Dynamicstoredata(submitFormData);
            }

            if (response) {
                Swal.fire("Success", "Data submitted successfully!", "success");
                navigate("/dynamic-list-data");
            }
        } catch (error) {
            console.log("Error submitting data:", error);
            Swal.fire("Error", "There was an issue with your submission.", "error");
        }
    };

    const handleEditSection = (sectionId) => {
        setSections(sections.map(section =>
            section.id === sectionId ? { ...section, isEditing: !section.isEditing } : section
        ));
    };

    const handleSwitchChange = (sectionId) => {
        setSections(sections.map(section =>
            section.id === sectionId ? { ...section, enabled: !section.enabled } : section
        ));
    };

    const handleFormDataChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddStandaloneField = () => {
        const newField = { 
            id: Date.now(), 
            label: "", 
            type: "text", 
            value: "", 
            options: [], 
            required: false,
            allowedFileTypes: []
        };
        setStandaloneFields([...standaloneFields, newField]);
    };

    const handleAddFieldAfter = (fieldId) => {
        const newField = { id: Date.now(), label: "", type: "text", value: "", options: [], required: false };
        setStandaloneFields((prevFields) => {
            const index = prevFields.findIndex((f) => f.id === fieldId);
            return [
                ...prevFields.slice(0, index + 1),
                newField,
                ...prevFields.slice(index + 1),
            ];
        });
    };

    // Handler for required checkbox for standalone fields
    const handleRequiredChangeStandalone = (fieldId) => {
        setStandaloneFields((prevFields) =>
            prevFields.map((f) => (f.id === fieldId ? { ...f, required: !f.required } : f))
        );
    };

    // Handler for required checkbox for section fields
    const handleRequiredChangeSection = (sectionId, fieldId) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        fields: section.fields.map((field) =>
                            field.id === fieldId ? { ...field, required: !field.required } : field
                        ),
                    }
                    : section
            )
        );
    };

    // Add handler for file type changes
    const handleFileTypeChange = (fileType, sectionId, fieldId) => {
        if (sectionId === null) {
            // Handle standalone fields
            setStandaloneFields((prevFields) =>
                prevFields.map((field) =>
                    field.id === fieldId
                        ? {
                            ...field,
                            allowedFileTypes: field.allowedFileTypes?.includes(fileType)
                                ? field.allowedFileTypes.filter((type) => type !== fileType)
                                : [...(field.allowedFileTypes || []), fileType],
                        }
                        : field
                )
            );
        } else {
            // Handle fields within sections
            setSections(
                sections.map((section) =>
                    section.id === sectionId
                        ? {
                            ...section,
                            fields: section.fields.map((field) =>
                                field.id === fieldId
                                    ? {
                                        ...field,
                                        allowedFileTypes: field.allowedFileTypes?.includes(fileType)
                                            ? field.allowedFileTypes.filter((type) => type !== fileType)
                                            : [...(field.allowedFileTypes || []), fileType],
                                    }
                                    : field
                            ),
                        }
                        : section
                )
            );
        }
    };

    return (
        <>
            <Expired />
            <div className="col-md-12">
                <div className="row mt-4" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px" }}>
                    {buttonsDisabled && (
                        <Alert severity="info" sx={{ width: '100%', marginBottom: '20px' }}>
                            This form's add/delete buttons are disabled because posts have already been created using this form structure. To maintain data consistency, structural modifications are not allowed.
                        </Alert>
                    )}
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
                                            onChange={handleFormDataChange}
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
                                            className="field-of-dynamic-from"
                                            fullWidth
                                            value={formData.ordering}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Allow only positive numbers or empty string
                                                if (value === '' || /^[+]?\d+(\.\d+)?$/.test(value)) {
                                                    handleFormDataChange(e);
                                                }
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
                                                onChange={handleFormDataChange}
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

                                <Grid container justifyContent="flex-end" style={{ marginBottom: "40px" }}>
                                    <Grid item>
                                        <Tooltip title={buttonsDisabled ? "Button disabled due to existing posts" : "Add New Field"}>
                                            <span>
                                                <IconButton
                                                    aria-label="add-new-field"
                                                    color="primary"
                                                    className='action-button'
                                                    onClick={handleAddStandaloneField}
                                                    style={{ marginBottom: "15px", opacity: buttonsDisabled ? 0.5 : 1 }}
                                                    disabled={buttonsDisabled}
                                                >
                                                    <FaCirclePlus />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                {standaloneFields.map((field) => (
                                    <Grid container spacing={3} key={field.id} style={{ marginTop: "10px", marginBottom: "20px" }}>
                                        <Grid item xs={12} sm={5}>
                                            <TextField
                                                label="Label"
                                                name="label"
                                                value={field.label}
                                                onChange={(e) => {
                                                    const { name, value } = e.target;
                                                    setStandaloneFields((prevFields) =>
                                                        prevFields.map((f) => (f.id === field.id ? { ...f, [name]: value } : f))
                                                    );
                                                }}
                                                fullWidth
                                                style={{
                                                    marginBottom: "15px",
                                                    backgroundColor: "#f4f6f8",
                                                    borderRadius: "5px",
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={5}>
                                            <FormControl fullWidth style={{ marginBottom: "15px" }}>
                                                <InputLabel>Field Type</InputLabel>
                                                <Select
                                                    label="Field Type"
                                                    name="type"
                                                    value={field.type}
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        setStandaloneFields((prevFields) =>
                                                            prevFields.map((f) => (f.id === field.id ? { ...f, type: value } : f))
                                                        );
                                                    }}
                                                    fullWidth
                                                    style={{
                                                        backgroundColor: "#f4f6f8",
                                                        borderRadius: "5px",
                                                    }}
                                                >
                                                    <MenuItem value="text">Text</MenuItem>
                                                    <MenuItem value="file">File</MenuItem>
                                                    <MenuItem value="textarea">Textarea</MenuItem>
                                                    <MenuItem value="number">Number</MenuItem>
                                                    <MenuItem value="checkbox">Checkbox</MenuItem>
                                                    <MenuItem value="radio">Radio</MenuItem>
                                                    <MenuItem value="date">Date</MenuItem>
                                                    <MenuItem value="email">Email</MenuItem>
                                                    <MenuItem value="password">Password</MenuItem>
                                                    <MenuItem value="url">Url</MenuItem>
                                                    <MenuItem value="dropdown">Dropdown</MenuItem>
                                                    <MenuItem value="color">Color</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {(field.type === 'textarea') && (
                                                <TextField
                                                    label="Max Char Limit"
                                                    name="value"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        if (/^[0-9]*$/.test(value)) {
                                                            setStandaloneFields((prevFields) =>
                                                                prevFields.map((f) => (f.id === field.id ? { ...f, value: value } : f))
                                                            );
                                                        }
                                                    }}
                                                    fullWidth
                                                    style={{
                                                        marginTop: '15px',
                                                        backgroundColor: '#f4f6f8',
                                                        borderRadius: '5px'
                                                    }}
                                                />
                                            )}
                                        </Grid>

                                        {/* Required Checkbox */}
                                        <Grid item xs={12} sm={2} style={{ display: "flex", alignItems: "center" }}>
                                            <Tooltip title="Make this field required">
                                                <FormControl>
                                                    <div className="checkbox-wrapper">
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                checked={field.required}
                                                                onChange={() => handleRequiredChangeStandalone(field.id)}
                                                            />
                                                            <span className="checkbox"></span>
                                                        </label>
                                                    </div>
                                                </FormControl>
                                            </Tooltip>
                                            <Tooltip title={buttonsDisabled ? "Button disabled due to existing posts" : "Add New Field"}>
                                                {/* <span> */}
                                                    <IconButton
                                                        aria-label="add-field"
                                                        color="primary"
                                                        className='action-button add-new-field'
                                                        onClick={() => handleAddFieldAfter(field.id)}
                                                        style={{ opacity: buttonsDisabled ? 0.5 : 1 }}
                                                        disabled={buttonsDisabled}
                                                    >
                                                        <FaCirclePlus />
                                                    </IconButton>
                                                {/* </span> */}
                                            </Tooltip>
                                            <Tooltip title={buttonsDisabled ? "Button disabled due to existing posts" : "Delete Field"}>
                                                {/* <span> */}
                                                    <IconButton
                                                        aria-label="delete-field"
                                                        color="primary"
                                                        className='action-button delete-field'
                                                        onClick={() => handleRemoveField(null, field.id)}
                                                        style={{ opacity: buttonsDisabled ? 0.5 : 1 }}
                                                        disabled={buttonsDisabled}
                                                    >
                                                        <MdDelete />
                                                    </IconButton>
                                                {/* </span> */}
                                            </Tooltip>
                                        </Grid>
                                        {(field.type === 'dropdown' || field.type === 'checkbox' || field.type === 'radio') && (
                                            <Grid item xs={12} sm={10}>
                                                <TextField
                                                    label={`${field.type.charAt(0).toUpperCase() + field.type.slice(1)} Options (comma-separated)`}
                                                    value={field.options.join(',')}
                                                    className='field-of-dynamic-from'
                                                    onChange={(e) => handleOptionChange(e, null, field.id)}
                                                    fullWidth
                                                    style={{
                                                        marginBottom: '15px',
                                                        backgroundColor: '#f4f6f8',
                                                        borderRadius: '5px'
                                                    }}
                                                />
                                            </Grid>
                                        )}
                                        {(field.type === 'file') && (
                                            <Grid item xs={12} sm={10}>
                                                <div style={{ marginBottom: '15px', backgroundColor: '#f4f6f8', padding: '15px', borderRadius: '5px' }}>
                                                    <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Allowed File Types:</Typography>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                        {['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'].map((fileType) => (
                                                            <label key={fileType} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={field.allowedFileTypes?.includes(fileType)}
                                                                    onChange={() => handleFileTypeChange(fileType, null, field.id)}
                                                                    style={{ marginRight: '5px' }}
                                                                />
                                                                {fileType}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Grid>
                                        )}
                                    </Grid>
                                ))}
                                {sections.map((section, index) => (
                                    <div key={section.id} style={{ marginBottom: "20px", border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }} className="section-part">
                                        <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 10px", backgroundColor: "#f4f6f8", borderRadius: "8px" }}>
                                            {section.isEditing ? (
                                                <TextField
                                                    label="Section Title"
                                                    value={section.title}
                                                    onChange={(e) => handleTitleChange(e, section.id)}
                                                    style={{ width: "200px", marginRight: "10px" }}
                                                />
                                            ) : (
                                                <Typography variant="h6" style={{ margin: "0" }}>{section.title}</Typography>
                                            )}
                                            <div>
                                                <Switch
                                                    checked={section.enabled === true}
                                                    onChange={() => handleSwitchChange(section.id)}
                                                    color="primary"
                                                    className="section-switch"
                                                    title={section.enabled === true ? "Hide Section" : "Show Section"}
                                                />
                                                <Tooltip title={section.isEditing ? "Save Title" : "Edit Section"}>
                                                    <IconButton
                                                        aria-label="edit-section"
                                                        color="primary"
                                                        className="action-button"
                                                        onClick={() => handleEditSection(section.id)}
                                                    >
                                                        {section.isEditing ? <FaCheckCircle /> : <FaEdit />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={section.isOpen ? "Collapse Section" : "Expand Section"}>
                                                    <IconButton
                                                        aria-label="toggle-section"
                                                        color="primary"
                                                        className="action-button"
                                                        onClick={() => handleToggleSection(section.id)}
                                                    >
                                                        {section.isOpen ? <FaChevronUp /> : <FaChevronDown />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={buttonsDisabled ? "Button disabled due to existing posts" : "Add New Section"}>
                                                    <span>
                                                        <IconButton
                                                            aria-label="add-section"
                                                            color="primary"
                                                            className='action-button'
                                                            onClick={() => handleAddSection(section.id)}
                                                            style={{ opacity: buttonsDisabled ? 0.5 : 1 }}
                                                            disabled={buttonsDisabled}
                                                        >
                                                            <FaPlusCircle />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                                {index !== 0 && (
                                                    <Tooltip title={buttonsDisabled ? "Button disabled due to existing posts" : "Delete Section"}>
                                                        <span>
                                                            <IconButton
                                                                aria-label="delete-section"
                                                                color="primary"
                                                                className="action-button"
                                                                onClick={() => handleRemoveSection(section.id)}
                                                                style={{ marginLeft: "10px", opacity: buttonsDisabled ? 0.5 : 1 }}
                                                                disabled={buttonsDisabled}
                                                            >
                                                                <MdDelete />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </div>

                                        <Collapse in={section.isOpen}>
                                            <div style={{ padding: "10px" }}>
                                                {section.fields.map((field, fieldIndex) => (
                                                    <Grid container spacing={3} key={field.id} style={{ marginTop: "10px" }}>
                                                        <Grid item xs={12} sm={5}>
                                                            <TextField
                                                                label="Label"
                                                                name="label"
                                                                className="field-of-dynamic-from"
                                                                value={field.label}
                                                                onChange={(e) => handleInputChange(e, section.id, field.id)}
                                                                fullWidth
                                                                style={{
                                                                    marginBottom: "15px",
                                                                    backgroundColor: "#f4f6f8",
                                                                    borderRadius: "5px",
                                                                }}
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} sm={5}>
                                                            <FormControl fullWidth style={{ marginBottom: "15px" }}>
                                                                <InputLabel>Field Type</InputLabel>
                                                                <Select
                                                                    label="Field Type"
                                                                    name="type"
                                                                    className="field-of-dynamic-from"
                                                                    value={field.type}
                                                                    onChange={(e) => handleTypeChange(e, section.id, field.id)}
                                                                    fullWidth
                                                                    style={{
                                                                        backgroundColor: "#f4f6f8",
                                                                        borderRadius: "5px",
                                                                    }}
                                                                >
                                                                    <MenuItem value="text">Text</MenuItem>
                                                                    <MenuItem value="file">File</MenuItem>
                                                                    <MenuItem value="textarea">Textarea</MenuItem>
                                                                    <MenuItem value="number">Number</MenuItem>
                                                                    <MenuItem value="checkbox">Checkbox</MenuItem>
                                                                    <MenuItem value="radio">Radio</MenuItem>
                                                                    <MenuItem value="date">Date</MenuItem>
                                                                    <MenuItem value="email">Email</MenuItem>
                                                                    <MenuItem value="password">Password</MenuItem>
                                                                    <MenuItem value="url">Url</MenuItem>
                                                                    <MenuItem value="dropdown">Dropdown</MenuItem>
                                                                    <MenuItem value="color">Color</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                            {(field.type === 'textarea') && (
                                                                <TextField
                                                                    label="Max Char Limit"
                                                                    name="value"
                                                                    value={field.value}
                                                                    onChange={(e) => {
                                                                        const { value } = e.target;
                                                                        if (/^[0-9]*$/.test(value)) {
                                                                            handleInputChange(e, section.id, field.id);
                                                                        }
                                                                    }}
                                                                    fullWidth
                                                                    style={{
                                                                        marginTop: '15px',
                                                                        backgroundColor: '#f4f6f8',
                                                                        borderRadius: '5px'
                                                                    }}
                                                                />
                                                            )}
                                                        </Grid>

                                                        {/* Required Checkbox */}
                                                        <Grid item xs={12} sm={2} style={{ display: "flex", alignItems: "center" }}>
                                                            <Tooltip title="Make this field required">
                                                                <FormControl>
                                                                    <div className="checkbox-wrapper">
                                                                        <label>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={field.required}
                                                                                onChange={() => handleRequiredChangeSection(section.id, field.id)}
                                                                            />
                                                                            <span className="checkbox"></span>
                                                                        </label>
                                                                    </div>
                                                                </FormControl>
                                                            </Tooltip>
                                                            <Tooltip title={buttonsDisabled ? "Button disabled due to existing posts" : "Add New Field"}>
                                                                {/* <span> */}
                                                                    <IconButton
                                                                        aria-label="add-field"
                                                                        color="primary"
                                                                        className="action-button add-new-field"
                                                                        onClick={() => handleAddField(section.id, field.id)}
                                                                        style={{ opacity: buttonsDisabled ? 0.5 : 1 }}
                                                                        disabled={buttonsDisabled}
                                                                    >
                                                                        <FaCirclePlus />
                                                                    </IconButton>
                                                                {/* </span> */}
                                                            </Tooltip>
                                                            {fieldIndex !== 0 && (
                                                                <Tooltip title={buttonsDisabled ? "Button disabled due to existing posts" : "Delete Field"}>
                                                                    {/* <span> */}
                                                                        <IconButton
                                                                            aria-label="delete"
                                                                            color="primary"
                                                                            className="action-button delete-field"
                                                                            onClick={() => handleRemoveField(section.id, field.id)}
                                                                            style={{ opacity: buttonsDisabled ? 0.5 : 1 }}
                                                                            disabled={buttonsDisabled}
                                                                        >
                                                                            <MdDelete />
                                                                        </IconButton>
                                                                    {/* </span> */}
                                                                </Tooltip>
                                                            )}
                                                        </Grid>
                                                        {(field.type === 'dropdown' || field.type === 'checkbox' || field.type === 'radio') && (
                                                            <Grid item xs={12} sm={10}>
                                                                <TextField
                                                                    label={`${field.type.charAt(0).toUpperCase() + field.type.slice(1)} Options (comma-separated)`}
                                                                    value={field.options.join(',')}
                                                                    className='field-of-dynamic-from'
                                                                    onChange={(e) => handleOptionChange(e, section.id, field.id)}
                                                                    fullWidth
                                                                    style={{
                                                                        marginBottom: '15px',
                                                                        backgroundColor: '#f4f6f8',
                                                                        borderRadius: '5px'
                                                                    }}
                                                                />
                                                            </Grid>
                                                        )}
                                                        {(field.type === 'file') && (
                                                            <Grid item xs={12} sm={10}>
                                                                <div style={{ marginBottom: '15px', backgroundColor: '#f4f6f8', padding: '15px', borderRadius: '5px' }}>
                                                                    <Typography variant="subtitle1" style={{ marginBottom: '10px' }}>Allowed File Types:</Typography>
                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                                        {['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'].map((fileType) => (
                                                                            <label key={fileType} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={field.allowedFileTypes?.includes(fileType)}
                                                                                    onChange={() => handleFileTypeChange(fileType, section.id, field.id)}
                                                                                    style={{ marginRight: '5px' }}
                                                                                />
                                                                                {fileType}
                                                                            </label>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                ))}
                                            </div>
                                        </Collapse>
                                    </div>
                                ))}

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

export default DynamicEditForm;
