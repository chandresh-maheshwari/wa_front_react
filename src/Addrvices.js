import React, { useState } from 'react';
import './Addrvices.css';
import './App.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';


const Addrvices = () => {
    const navigate = useNavigate();
    const [description, setdescription] = useState('');
    const [service_title, setservice_title] = useState('')
    const [errors, setErrors] = useState({});

    const formData = new FormData();
    formData.append("service_title", service_title);
    formData.append("description", description);

    const handleChange = (e, editor) => {
        setdescription(editor.getData());
    }


    const handlesubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!service_title.trim()) {
            newErrors.service_title = " service_title is required";
        }

        if (!description) {
            newErrors.description = " description Is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            // Assuming formData is defined somewhere in your code
            const response = await axios.post('http://wafront.localhost.com/api/Services', formData, {
                headers: {
                    "Content-Type": "application/json",  // Fix typo in "Application/JSON"
                },
                data: {
                    service_title: service_title,
                    description: description,
                },
            });
            console.log(response);
            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Data stored successfully!',
            });
            navigate("/Servicelist");
        } catch (error) {
            console.error("Error In Storing Data", error);
            // Show SweetAlert error message
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error in storing data. Please try again.',
            });
        }
    }


    const handleCancel = (e) => {
        navigate("/Servicelist");
    }


    return (
        <>
            <div class="container-fluid panel-header panel-header-sm">
            </div>
            <div className='hhkk'>
                <div className="col-md-12">
                    <div className="row card" style={{
                        marginLeft: "22%",
                        width: "75%"
                    }}>
                        <div className="card-header" style={{ marginTop: "" }}>
                            <h5 className="title">Add Services</h5>
                        </div>
                        <div className="card-body">
                            {/* onSubmit={handlesubmit} */}
                            <form action="#" encType="multipart/form-data" id="servicesForm">
                                <div className="row">
                                    <div className="col-md-12 pr-1">
                                        <div className="form-group">
                                            <label className='inputlabel' style={{ marginLeft: "-3%" }}>Service Title</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setservice_title(e.target.value)}
                                                className="form-control"
                                                name="service_title"
                                                id="service_title"
                                                autoComplete="off"
                                            />
                                            {errors.service_title && (
                                                <p style={{ color: "red" }}>{errors.service_title}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className='inputlabel'>Description</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        onChange={(e, editor) => { handleChange(e, editor) }}
                                    />
                                    {errors.description && (
                                        <p style={{ color: "red" }}>{errors.description}</p>
                                    )}
                                </div>
                                <div id="more_content"></div>
                                <div className="row mt-4">
                                    <div className="col-11">
                                        <button onClick={handlesubmit} className="btn btn-success"  >Submit</button>
                                        <button onClick={handleCancel} type="button" className="btn btn-outline-success m-2">Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Addrvices;