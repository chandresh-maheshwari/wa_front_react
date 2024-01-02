import React, { useState } from 'react';
import './Addrvices.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';


const Testimonial = () => {
    const navigate = useNavigate();
    const [testimonial, settestimonial] = useState('');
    const [add_by, setadd_by] = useState('');
    const [position, setposition] = useState('');
    const [errors, setErrors] = useState({});

    const formData = new FormData();
    formData.append("testimonial", testimonial);
    formData.append("add_by", add_by);
    formData.append("position", position);

    const handleChange = (e, editor) => {
        settestimonial(editor.getData());
    }

    const handlesubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!testimonial.trim()) {
            newErrors.testimonial = " Testimonial is required";
        }

        if (!add_by) {
            newErrors.add_by = " Add_by Is required";
        }

        if (!position) {
            newErrors.position = " Position Is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        console.log(testimonial, add_by, position);

        try {
            // Assuming formData is defined somewhere in your code
            const response = await axios.post('http://wafront.localhost.com/api/Testimonial', formData, {
                headers: {
                    "Content-Type": "application/json",  // Fix typo in "Application/JSON"
                },
                data: {
                    testimonial: testimonial,
                    add_by: add_by,
                    position: position,
                },
            });

            console.log(response);

            // Show SweetAlert success message
            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: "Testimonial data Saved Successfully.",
            });

            navigate("/Testimonial_List");
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
                            <h5 className="title">Add Testimonials</h5>
                        </div>
                        <div className="card-body">
                            <form action="#" encType="multipart/form-data" id="servicesForm">
                                <div>
                                    <label className='inputlabel'>Testimonial</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        onChange={(e, editor) => { handleChange(e, editor) }}
                                    />
                                    {errors.testimonial && (
                                        <p style={{ color: "red" }}>{errors.testimonial}</p>
                                    )}
                                </div>
                                <div class="row mt-4">
                                    <div class="col-md-6 pr-1">
                                        <div class="form-group">
                                            <label className='inputlabel' style={{ marginLeft: "-5%" }}>Added by</label>
                                            <input type="text" class="form-control" name="add_by" onChange={(e) => setadd_by(e.target.value)} id="add_by" autocomplete="off" style={{
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
                                            <input type="text" class="form-control" name="position" onChange={(e) => setposition(e.target.value)} id="position" autocomplete="off" />
                                            {errors.position && (
                                                <p style={{ color: "red" }}>{errors.position}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div id="more_content"></div>
                                <div className="row mt-4">
                                    <div className="col-11">
                                        <button className="btn btn-success" onClick={handlesubmit}  >Submit</button>
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

export default Testimonial;