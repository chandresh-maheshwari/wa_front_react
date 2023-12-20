import React, { useEffect, useState } from "react";
// import "./clientform.css";
import axios from "axios";
import './Service.css';
import { useNavigate, useParams } from "react-router-dom";
import Servicenave from './Servicenave';
import Sidebar from "./Sidebar";
import './Addrvices.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';


const EditServiceForm = (props) => {
    const [description, setdescription] = useState('');
    const [service_title, setservice_title] = useState('')
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { id } = useParams();

    // eslint-disable-next-line no-unused-vars
    const data = {
        textEditor: description,
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://wafront.localhost.com/api/serviceedit/${id}`
                );

                if (response.data) {
                    const { service_title, description } = response.data;
                    setservice_title(service_title);
                    setdescription(description);
                    console.log(response.data);
                }
            }
            catch (error) {
                console.error("Error fetching client data:", error);
            }
        };

        fetchData();
    }, [id]);

    const handlesubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!service_title.trim()) {
            newErrors.service_title = " service_title is required";
        }

        if (!description) {
            newErrors.description = " description is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        console.log(service_title, description);

        try {
            const response = await axios.put(`http://wafront.localhost.com/api/update/${id}`, {
                service_title: service_title,
                description: description,
            }, {
                headers: {
                    "Content-Type": "application/json",  // Fix typo in "Application/JSON"
                },
            });

            console.log(response);
            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Service edit Form Saved Successfully.',
            });
            navigate("/Servicelist");
        } catch (error) {
            console.error("Error In Storing Data", error);
            Swal.fire("Error", "Error in storing data. Please try again.", "error");
        }
    };

    const handleCancel = (e) => {
        navigate("/Servicelist");
    }

    return (
        <>
            <Servicenave />
            <Sidebar />

            <div class="container-fluid panel-header panel-header-sm">
            </div>
            <div className='hhkk'>
                <div className="col-md-12">
                    <div className="row card" style={{
                        marginLeft: "22%",
                        width: "75%"
                    }}>
                        <div className="card-header" style={{ marginTop: "2%" }}>
                            <h5 className="title">Edit Services form</h5>
                        </div>
                        <div className="card-body">

                            <form onSubmit={handlesubmit}>
                                <div className="row">
                                    <div className="col-md-12 pr-1">
                                        <div className="form-group">
                                            <label className="inputlabel" style={{ marginLeft: "-3%" }}>Service Title</label>
                                            <input
                                                type="text"
                                                onChange={(e) => setservice_title(e.target.value)}
                                                className="form-control"
                                                name="service_title"
                                                id="service_title"
                                                autoComplete="off"
                                                value={service_title}
                                            />
                                            {errors.service_title && (
                                                <p style={{ color: "red" }}>{errors.service_title}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="inputlabel">Description</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={description}
                                        onReady={(editor) => {
                                            // You can store the "editor" and use when it is needed.
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setdescription((data));
                                        }}
                                    />
                                    {errors.description && (
                                        <p style={{ color: "red" }}>{errors.description}</p>
                                    )}
                                </div>
                                <div id="more_content"></div>
                                <div className="row mt-4">
                                    <div className="col-11">
                                        <button
                                            // onClick={handlesubmit} 
                                            className="btn btn-success"  >Submit</button>
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
};

export default EditServiceForm;


