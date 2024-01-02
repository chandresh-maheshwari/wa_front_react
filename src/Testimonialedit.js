/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import './Addrvices.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';

const Testimonialedit = () => {
    const [testimonial, settestimonial] = useState('');
    const [add_by, setadd_by] = useState('');
    const [position, setposition] = useState('')
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { id } = useParams();
    const data = {
        textEditor: testimonial,
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://wafront.localhost.com/api/Testimonialedit/${id}`
                );

                if (response.data) {
                    const { position, add_by, testimonial } = response.data;
                    settestimonial(testimonial);
                    setadd_by(add_by);
                    setposition(position);
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
        if (!testimonial.trim()) {
            newErrors.testimonial = "Testimonial is required";
        }

        if (!add_by) {
            newErrors.add_by = "Add_by is required";
        }

        if (!position) {
            newErrors.position = "Position is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        console.log(testimonial, add_by, position);

        try {
            const response = await axios.put(`http://wafront.localhost.com/api/testimonialupdate/${id}`, {
                testimonial: testimonial,
                add_by: add_by,
                position: position,
            }, {
                headers: {
                    "Content-Type": "application/json",  // Fix typo in "Application/JSON"
                },
            });

            console.log(response);
            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: "Testimonial edit Form Saved Successfully.",
            });
            navigate("/Testimonial_List");
        } catch (error) {
            console.error("Error In Storing Data", error);
            Swal.fire("Error", "Error in storing data. Please try again.", "error");
        }
    };

    const handleCancel = () => {
        navigate("/Testimonial_List");
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
                            <h5 className="title">Edit Testimonials form</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handlesubmit}>
                                <div>
                                    <label className='inputlabel'>Testimonial</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={testimonial}
                                        onReady={(editor) => {
                                            // You can store the "editor" and use when it is needed.
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            settestimonial((data));
                                        }}
                                    />
                                    {errors.testimonial && (
                                        <p style={{ color: "red" }}>{errors.testimonial}</p>
                                    )}
                                </div>
                                <div class="row mt-4">
                                    <div class="col-md-6 pr-1">
                                        <div class="form-group">
                                            <label className='inputlabel' style={{ marginLeft: "-5%" }}>Added by</label>
                                            <input type="text" class="form-control" name="add_by" onChange={(e) => setadd_by(e.target.value)} value={add_by} id="add_by" autocomplete="off" style={{
                                                width: "109%",
                                                marginLeft: "-6%"
                                            }} />
                                            {errors.add_by && (
                                                <p style={{ color: "red" }}>{errors.add_by}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label className='inputlabel' style={{ marginLeft: "-3%" }}>Position</label>
                                            <input type="text" class="form-control" name="position" onChange={(e) => setposition(e.target.value)} value={position} id="position" autocomplete="off" />
                                            {errors.position && (
                                                <p style={{ color: "red" }}>{errors.position}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div id="more_content"></div>
                                <div className="row mt-4">
                                    <div className="col-11">
                                        <button className="btn btn-success"   >Submit</button>
                                        <button type="button" className="btn btn-outline-success m-2" onClick={handleCancel}>Cancel</button>
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

export default Testimonialedit;