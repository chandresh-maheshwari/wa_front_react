import React, { useState } from 'react';
import { TextField, IconButton, Tooltip, Button, Container, MenuItem, Select, InputLabel, FormControl, Grid, Typography } from '@mui/material';
import { MdDelete } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Authapi from "../Authapi";
import Expired from "../Login/ExpiredToken";
import "../Custom.css";
import Link from '@mui/material';

const DynamicForm = () => {
  const [fields, setFields] = useState([
    {
      id: Date.now(),
      label: "",
      type: "",
      value: "",
      options: [],
    },
  ]);
  const [formData, setFormData] = useState({
    post_title: "",
    post_type: "",
    ordering: "",
  });

  const navigate = useNavigate();

  const handleAddField = () => {
    setFields([
      ...fields,
      { id: Date.now(), label: "", type: "", value: "", options: [] },
    ]);
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

        const SubmitformData = {
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
            const response = await Authapi.Dynamicstoredata(SubmitformData);
            // console.log('Data submitted successfully:', response);
            if (response) {
                Swal.fire('Success', 'Data submitted successfully!', 'success');
                navigate('/dynamic-list-data');
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
                <div className="row card" style={{ marginLeft: "22%", width: "75%", marginBottom: "20px", marginTop: "10%" }}>
                    <div className="card-header">
                        <Typography variant="h5" className="title" align="center">Post</Typography>
                    </div>
                    <div className="card-body">
                        <Container>
                            <form onSubmit={handleSubmit} encType="multipart/form-data" className='dynamicCreateForm'>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Post Title"
                                            name="post_title"
                                            value={formData.post_title}
                                            onChange={handleTitleChange}
                                            fullWidth
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
                                            // type='number'
                                            value={formData.ordering}
                                            min="0"
                                            onKeyPress={preventTextAndMinus}
                                            onChange={handleTitleChange}
                                            fullWidth
                                            style={{
                                                marginBottom: '15px',
                                                backgroundColor: '#f4f6f8',
                                                borderRadius: '5px'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth style={{ marginBottom: '15px' }}>
                                            <InputLabel>Post Type</InputLabel>
                                            <Select
                                                label="Post Type"
                                                className='dropdown-css-change'
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
                                    <div key={field.id} style={{ marginBottom: '30px' }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={5}>
                                                <TextField
                                                    label="Label"
                                                    name="label"
                                                    value={field.label}
                                                    onChange={(e) => handleInputChange(e, field.id)}
                                                    fullWidth
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
                                                        className='dropdown-css-change'
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

                                                {/* <Grid item xs={12} sm={1}> */}
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

                                        {(field.type === 'dropdown' || field.type === 'checkbox' || field.type === 'radio') && (
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    label={`${field.type.charAt(0).toUpperCase() + field.type.slice(1)} Options (comma-separated)`}
                                                    value={field.options.join(',')}
                                                    onChange={(e) => handleOptionChange(e, field.id)}
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
                                        <Button variant="contained" color="primary" className='submit-btn' style={{ backgroundColor: "#2c9dd4" }} type="submit">
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button className='cancel-btn' style={{ backgroundColor: "rgb(212 44 42)", color: "white", marginLeft: "-10px" }}
                                            onClick={() => navigate('/dynamic-list-data')}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Container>
                    </div>
                </div>
            </div >
        </>
    );
  };

  const handleTypeChange = (e, id) => {
    const { value } = e.target;
    setFields(
      fields.map((field) =>
        field.id === id
          ? { ...field, type: value, value: "", options: [] }
          : field
      )
    );
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleTitleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (e, id) => {
    const { value } = e.target;
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, options: value.split(",") } : field
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const SubmitformData = {
      post_title: formData.post_title,
      post_type: formData.post_type,
      ordering: formData.ordering,
      post_description: fields.map((field) => ({
        label: field.label,
        type: field.type,
        value: field.value,
        options: field.options,
      })),
    };

    try {
      const response = await Authapi.Dynamicstoredata(SubmitformData);
      // console.log('Data submitted successfully:', response);
      if (response) {
        Swal.fire("Success", "Data submitted successfully!", "success");
        navigate("/dynamic-list-data");
      }
    } catch (error) {
      console.log("Error submitting data:", error);
      Swal.fire("Error", "There was an issue with your submission.", "error");
    }
  };
  const preventTextAndMinus = (e) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Enter",
      "NumpadAdd",
      "NumpadSubtract",
    ];

    if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
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
          <div className="card-header">
            <Typography variant="h5" className="title" align="center">
              Post
            </Typography>
          </div>
          <div
            className="card-body"
            style={{ height: "calc(115vh - 200px)", width: "80%" }}
          >
            <Container style={{ height: "100%" }}>
              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="createForm"
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Post Title"
                      name="post_title"
                      value={formData.post_title}
                      onChange={handleTitleChange}
                      fullWidth
                      style={{
                        marginBottom: "15px",
                        backgroundColor: "#f4f6f8",
                        borderRadius: "5px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Ordering"
                      name="ordering"
                      // type='number'
                      value={formData.ordering}
                      min="0"
                      onKeyPress={preventTextAndMinus}
                      onChange={handleTitleChange}
                      fullWidth
                      style={{
                        marginBottom: "15px",
                        backgroundColor: "#f4f6f8",
                        borderRadius: "5px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth style={{ marginBottom: "15px" }}>
                      <InputLabel>Post Type</InputLabel>
                      <Select
                        label="Post Type"
                        name="post_type"
                        value={formData.post_type}
                        onChange={handleTitleChange}
                        fullWidth
                        style={{
                          backgroundColor: "#f4f6f8",
                          borderRadius: "5px",
                        }}
                      >
                        <MenuItem value="custom_post">Custom Post</MenuItem>
                        <MenuItem value="normal_post">Normal Post</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {fields.map((field) => (
                  <div key={field.id} style={{ marginBottom: "30px" }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Label"
                          name="label"
                          value={field.label}
                          onChange={(e) => handleInputChange(e, field.id)}
                          fullWidth
                          style={{
                            marginBottom: "15px",
                            backgroundColor: "#f4f6f8",
                            borderRadius: "5px",
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth style={{ marginBottom: "15px" }}>
                          <InputLabel>Field Type</InputLabel>
                          <Select
                            label="Field Type"
                            name="type"
                            value={field.type}
                            onChange={(e) => handleTypeChange(e, field.id)}
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
                            <MenuItem value="button">Button</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="password">Password</MenuItem>
                            <MenuItem value="url">Url</MenuItem>
                            <MenuItem value="dropdown">Dropdown</MenuItem>
                            <MenuItem value="color">Color</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleRemoveField(field.id)}
                          style={{
                            marginTop: "15px",
                            fontSize: "larger",
                            backgroundColor: "#d32f2f",
                            "&:hover": {
                              backgroundColor: "#c62828",
                            },
                          }}
                        >
                          <MdDelete />
                        </Button>
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Button
                          variant="contained"
                          onClick={() => handleAddFieldAfter(field.id)}
                          style={{
                            marginTop: "15px",
                            fontSize: "larger",
                            backgroundColor: "#2c9dd4",
                            "&:hover": {
                              backgroundColor: "#1565c0",
                            },
                          }}
                        >
                          <FaCirclePlus />
                        </Button>
                      </Grid>
                    </Grid>

                    {(field.type === "dropdown" ||
                      field.type === "checkbox" ||
                      field.type === "radio") && (
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label={`${
                            field.type.charAt(0).toUpperCase() +
                            field.type.slice(1)
                          } Options (comma-separated)`}
                          value={field.options.join(",")}
                          onChange={(e) => handleOptionChange(e, field.id)}
                          fullWidth
                          style={{
                            marginBottom: "15px",
                            backgroundColor: "#f4f6f8",
                            borderRadius: "5px",
                          }}
                        />
                      </Grid>
                    )}
                  </div>
                ))}

                <Button
                  variant="contained"
                  onClick={handleAddField}
                  style={{
                    marginLeft: "40%",
                    fontSize: "larger",
                    backgroundColor: "#2c9dd4",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                >
                  <FaCirclePlus />
                </Button>

                <Grid
                  container
                  justifyContent="flex-start"
                  spacing={2}
                  marginTop={3}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      className="submit-btn"
                      style={{ backgroundColor: "#2c9dd4" }}
                      type="submit"
                    >
                      Submit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      className="cancel-btn"
                      style={{
                        backgroundColor: "rgb(212 44 42)",
                        color: "white",
                        marginLeft: "-10px",
                      }}
                      onClick={() => navigate("/dynamic-list-data")}
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

export default DynamicForm;
