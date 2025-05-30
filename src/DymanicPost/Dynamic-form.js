import React, { useState } from 'react';
import { TextField, IconButton, Tooltip, Button, Container, MenuItem, Select, InputLabel, FormControl, Grid, Typography, Collapse, Switch } from '@mui/material';
import { MdDelete } from "react-icons/md";
import { FaPlusCircle, FaCheckCircle, FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";  // Added the collapse icons
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Authapi from "../Authapi";
import Expired from "../Login/ExpiredToken";
import { FaCirclePlus } from "react-icons/fa6";
import "../Custom.css";

const DynamicForm = () => {
  const [sections, setSections] = useState([
    {
      id: Date.now(),
      isOpen: true,
      switchEnabled: false,
      title: "Section 1",
      fields: [
        {
          id: Date.now(),
          label: "",
          type: "text",
          value: "",
          options: [],
          required: false,
          allowedFileTypes: [],
        },
      ],
    },
  ]);

  const [standaloneFields, setStandaloneFields] = useState([]);

  const [formData, setFormData] = useState({
    post_title: "",
    post_type: "",
    ordering: "",
  });

  const navigate = useNavigate();

  // const handleAddSection = () => {
  //   setSections([
  //     ...sections,
  //     {
  //       id: Date.now(),
  //       isOpen: true,  // New section starts open by default
  //       fields: [
  //         {
  //           id: Date.now(),
  //           label: "",
  //           type: "text",
  //           value: "",
  //           options: [],
  //         },
  //       ],
  //     },
  //   ]);
  // };

  const handleAddSection = (currentSectionId) => {
    setSections((prevSections) => {
      const newSection = {
        id: Date.now(),
        isOpen: true,
        title: `Section ${prevSections.length + 1}`,
        isEditing: false,
        fields: [
          {
            id: Date.now(),
            label: "",
            type: "text",
            value: "",
            options: [],
            required: false,
            allowedFileTypes: [],
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

  // const handleAddField = (sectionId) => {
  //   const newField = {
  //     id: Date.now(),
  //     label: "",
  //     type: "text",
  //     value: "",
  //     options: [],
  //   };

  //   setSections(
  //     sections.map((section) =>
  //       section.id === sectionId
  //         ? { ...section, fields: [...section.fields, newField] }
  //         : section
  //     )
  //   );
  // };

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
    if (sectionId === null) {
      setStandaloneFields((prevFields) =>
        prevFields.map((field) =>
          field.id === fieldId ? { ...field, [name]: value } : field
        )
      );
    } else {
      setSections(
        sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                fields: section.fields.map((field) =>
                  field.id === fieldId ? { ...field, [name]: value } : field
                ),
              }
            : section
        )
      );
    }
  };

  const handleTypeChange = (e, sectionId, fieldId) => {
    const { value } = e.target;
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            fields: section.fields.map((field) =>
              field.id === fieldId
                ? { ...field, type: value, value: "", options: [], allowedFileTypes: [] }
                : field
            ),
          }
          : section
      )
    );
  };

  const handleRemoveField = (sectionId, fieldId) => {
    // setSections(
    //   sections.map((section) =>
    //     section.id === sectionId
    //       ? {
    //         ...section,
    //         fields: section.fields.filter((field) => field.id !== fieldId),
    //       }
    //       : section
    //   )
    // );
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

  // const handleOptionChange = (e, sectionId, fieldId) => {
  //   const { value } = e.target;
  //   setSections(
  //     sections.map((section) =>
  //       section.id === sectionId
  //         ? {
  //           ...section,
  //           fields: section.fields.map((field) =>
  //             field.id === fieldId ? { ...field, options: value.split(",") } : field
  //           ),
  //         }
  //         : section
  //     )
  //   );
  // };

  const handleOptionChange = (e, sectionId, fieldId) => {
    const { value } = e.target;
  
    // console.log("Field options before update:", value);
  
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
  
  
  
  

  const handleTitleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleSection = (sectionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, isOpen: !section.isOpen } : section
      )
    );
  };

  const handleRemoveSection = (sectionId) => {
    setSections((prevSections) => {
      const updatedSections = prevSections.filter((section) => section.id !== sectionId);
      return updatedSections.map((section, index) => ({
        ...section,
        id: section.id,  // Keep existing IDs for fields
      }));
    });
  };


  // Handle Section Title Change function (called when editing section title)
  const handleSectionTitleChange = (e, sectionId) => {
    const { value } = e.target;
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, title: value } : section
      )
    );
  };

  // Handle toggling title edit mode
  const handleEditTitle = (sectionId) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, isEditingTitle: !section.isEditingTitle }
          : section
      )
    );
  };

  const handleSwitchChange = (sectionId) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, switchEnabled: !section.switchEnabled } : section
    ));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Prepare the SubmitformData object
  //   const SubmitformData = {
  //     post_title: formData.post_title,
  //     post_type: formData.post_type,
  //     ordering: formData.ordering,
  //     post_description: {},
  //   };

  //   // Dynamically check section titles and order them accordingly
  //   sections.forEach((section, index) => {
  //     // Check the title of each section, if modified use the modified title, otherwise default to "Section N"
  //     const sectionTitle = section.title || `Section ${index + 1}`;

  //     // Add the section data to the post_description
  //     SubmitformData.post_description[sectionTitle] = {
  //       enabled: section.switchEnabled ? 1 : 0, // Add switch value to submission
  //       fields: section.fields.map((field) => ({
  //         label: field.label,
  //         type: field.type,
  //         value: field.value,
  //         options: field.options,
  //       })),
  //     };
  //   });

  //   // Submit the form data
  //   try {
  //     const response = await Authapi.Dynamicstoredata(SubmitformData);
  //     if (response) {
  //       Swal.fire("Success", "Data submitted successfully!", "success");
  //       navigate("/dynamic-list-data");
  //     }
  //   } catch (error) {
  //     console.log("Error submitting data:", error);
  //     Swal.fire("Error", "There was an issue with your submission.", "error");
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Add standalone fields as "0", "1", ... at root
    let postDescription = {};
    standaloneFields.forEach((field, idx) => {
      postDescription[idx] = {
        label: field.label,
        type: field.type,
        value: field.value,
        options: field.options,
        required: field.required,
        allowedFileTypes: field.allowedFileTypes || [],
        [`Field_Slug_${field.label.replace(/\s+/g, '')}`]: field.label.replace(/\s+/g, '')
      };
    });

    // 2. Add sections by title, with fields as "0", "1", ... and enabled
    sections.forEach((section) => {
      const sectionTitle = section.title || "Section";
      let sectionObj = { enabled: section.switchEnabled };
      section.fields.forEach((field, fieldIdx) => {
        sectionObj[fieldIdx] = {
          label: field.label,
          type: field.type,
          value: field.value,
          options: field.options,
          required: field.required,
          allowedFileTypes: field.allowedFileTypes || [],
          [`Field_Slug_${field.label.replace(/\s+/g, '')}`]: field.label.replace(/\s+/g, '')
        };
      });
      postDescription[sectionTitle] = sectionObj;
    });

    const SubmitformData = {
      post_title: formData.post_title,
      post_type: formData.post_type,
      ordering: formData.ordering,
      post_description: postDescription,
    };

    try {
      const response = await Authapi.Dynamicstoredata(SubmitformData);
      if (response) {
        Swal.fire("Success", "Data submitted successfully!", "success");
        // navigate("/dynamic-list-data");
      }
    } catch (error) {
      console.log("Error submitting data:", error);
      Swal.fire("Error", "There was an issue with your submission.", "error");
    }
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

  const handleEditSection = (sectionId) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, isEditing: !section.isEditing } : section
    ));
  };

  // Add handler for required checkbox for standalone fields
  const handleRequiredChangeStandalone = (fieldId) => {
    setStandaloneFields((prevFields) =>
      prevFields.map((f) => (f.id === fieldId ? { ...f, required: !f.required } : f))
    );
  };

  // Add handler for required checkbox for section fields
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

  // Add new handler for file type changes
  const handleFileTypeChange = (fileType, sectionId, fieldId) => {
    if (sectionId === null) {
      // Handle standalone fields
      setStandaloneFields((prevFields) =>
        prevFields.map((field) =>
          field.id === fieldId
            ? {
                ...field,
                allowedFileTypes: field.allowedFileTypes.includes(fileType)
                  ? field.allowedFileTypes.filter((type) => type !== fileType)
                  : [...field.allowedFileTypes, fileType],
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
                        allowedFileTypes: field.allowedFileTypes.includes(fileType)
                          ? field.allowedFileTypes.filter((type) => type !== fileType)
                          : [...field.allowedFileTypes, fileType],
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
          <div className="card-header Form-main-title">
            <Typography variant="h6" className="title" align="center">Add Dynamic Post</Typography>
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
                      onChange={(e) => handleTitleChange(e, null)}
                      style={{
                        marginBottom: '15px',
                        backgroundColor: '#f4f6f8',
                        borderRadius: '5px'
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      label="Ordering"
                      name="ordering"
                      className='field-of-dynamic-from'
                      fullWidth
                      min="0"
                      value={formData.ordering}
                      onChange={(e) => handleTitleChange(e, null)}
                      style={{
                        marginBottom: '15px',
                        backgroundColor: '#f4f6f8',
                        borderRadius: '5px'
                      }}
                    />
                  </Grid> */}
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
                          handleTitleChange(e, null);
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
                        onChange={(e) => handleTitleChange(e, null)}
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

                {/* <TextField
                  label="Title"
                  name="post_title"
                  className='field-of-dynamic-from mt-3'
                  fullWidth
                  // value={formData.post_title}
                  // onChange={(e) => handleTitleChange(e, null)}
                  style={{
                    marginBottom: '15px',
                    backgroundColor: '#f4f6f8',
                    borderRadius: '5px'
                  }}
                />
                <textarea
                  className='form-control'
                  // name={`field${index}`}
                  rows="4"
                // onChange={(e) => handleInputChange(e, index)}
                /> */}

                <Grid container justifyContent="flex-end" style={{ marginBottom: "40px" }}>
                  <Grid item>
                    <Tooltip title="Add New Field">
                      <IconButton
                        aria-label="add-new-field"
                        color="primary"
                        className='action-button'
                        onClick={handleAddStandaloneField}
                        style={{ marginBottom: "15px" }}
                      >
                        <FaCirclePlus />
                      </IconButton>
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
                          {/* <MenuItem value="button">Button</MenuItem> */}
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
                              handleInputChange(e, null, field.id);
                            }
                          }}
                          fullWidth
                          style={{
                            marginBottom: '15px',
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
                              // title='Make a field required'
                              checked={field.required}
                              onChange={() => handleRequiredChangeStandalone(field.id)}
                            />
                            <span className="checkbox"></span>
                          </label>
                        </div>
                      </FormControl>
                      </Tooltip>
                      <Tooltip title="Add New Field">
                        <IconButton
                          aria-label="add-field"
                          color="primary"
                          className='action-button add-new-field'
                          onClick={() => handleAddFieldAfter(field.id)}
                        
                        >
                          <FaCirclePlus />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Field">
                        <IconButton
                          aria-label="delete-field"
                          color="primary"
                          className='action-button delete-field'
                          onClick={() => handleRemoveField(null, field.id)}
                        >
                          <MdDelete />
                        </IconButton>
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
                                  checked={field.allowedFileTypes.includes(fileType)}
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
                      {section.isEditingTitle ? (
                        // Inline editing when isEditingTitle is true
                        <TextField
                          label="Section Title"
                          value={section.title || `Section ${index + 1}`} // Default title if no custom title is provided
                          onChange={(e) => handleSectionTitleChange(e, section.id)} // Updated function name
                          // fullWidth
                          variant="outlined"
                          style={{
                            marginBottom: "15px",
                            backgroundColor: "#f4f6f8",
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        // Display the section title
                        <Typography variant="h6">
                          {section.title || `Section ${index + 1}`}
                        </Typography>
                      )}
                      <div>
                        <Switch
                          checked={section.switchEnabled}
                          onChange={() => handleSwitchChange(section.id)}
                          className='action-button'
                          color="primary"
                          title={section.switchEnabled ? "Hide Section" : "Show Section"}
                        />
                        <Tooltip title={section.isEditingTitle ? "Save Title" : "Edit Section"}>
                          <IconButton
                            aria-label="edit-section"
                            color="primary"
                            className='action-button'
                            onClick={() => handleEditTitle(section.id)}
                          >
                            {section.isEditingTitle ? <FaCheckCircle /> : <FaEdit />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={section.isOpen ? "Collapse Section" : "Expand Section"}>
                          <IconButton
                            aria-label="toggle-section"
                            color="primary"
                            className='action-button'
                            onClick={() => handleToggleSection(section.id)}
                          >
                            {section.isOpen ? <FaChevronUp /> : <FaChevronDown />}
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title="Add Section">
                          <IconButton
                            aria-label="add-section"
                            color="primary"
                            className='action-button'
                            onClick={handleAddSection}
                            style={{ marginLeft: "10px" }}
                          >
                            <FaPlusCircle />
                          </IconButton>
                        </Tooltip> */}
                        <Tooltip title="Add New Section">
                          <IconButton
                            aria-label="add-section"
                            color="primary"
                            className='action-button'
                            onClick={() => handleAddSection(section.id)}
                          >
                            <FaPlusCircle />
                          </IconButton>
                        </Tooltip>



                        {index !== 0 && (
                          <Tooltip title="Delete Section">
                            <IconButton
                              aria-label="delete-section"
                              color="primary"
                              className="action-button"
                              onClick={() => handleRemoveSection(section.id)}
                              style={{ marginLeft: "10px" }}
                            >
                              <MdDelete />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    <Collapse in={section.isOpen}>
                      <div style={{ padding: "10px" }}>
                        {/* <Tooltip title="Add New Field">
                          <IconButton
                            aria-label="add-field"
                            color="primary"
                            className='action-button'
                            onClick={() => handleAddField(section.id)}
                            style={{ marginRight: "10px" }}
                          >
                            <FaCirclePlus />
                          </IconButton>
                        </Tooltip> */}

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
                                  {/* <MenuItem value="button">Button</MenuItem> */}
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
                              <Tooltip title="Add New Field">
                                <IconButton
                                  aria-label="add-field"
                                  color="primary"
                                  className="action-button add-new-field"
                                  onClick={() => handleAddField(section.id, field.id)}
                                  
                                >
                                  <FaCirclePlus />
                                </IconButton>
                              </Tooltip>

                              {/* Conditionally render the Delete button for all fields except the first one */}
                              {fieldIndex !== 0 && (
                                <Tooltip title="Delete Field">
                                  <IconButton
                                    aria-label="delete"
                                    color="primary"
                                    className="action-button delete-field"
                                    onClick={() => handleRemoveField(section.id, field.id)}
                                  >
                                    <MdDelete />
                                  </IconButton>
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
                                          checked={field.allowedFileTypes.includes(fileType)}
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

                {/* <Tooltip title="Add Section">
                  <IconButton
                    aria-label="add-section"
                    color="primary"
                    className='action-button'
                    onClick={handleAddSection}
                    style={{ marginLeft: "10px" }}
                  >
                    <FaPlusCircle />
                  </IconButton>
                </Tooltip> */}
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


export default DynamicForm;
