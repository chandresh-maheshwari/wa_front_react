// import React, { useState } from 'react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios'
// import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import React, { useState } from 'react';


const Navbar = () => {
    // const navigate = useNavigate();
    // const [testimonial, settestimonial] = useState('');
    // const [add_by, setadd_by] = useState('');
    // const [position, setposition] = useState('');
    // const [errors, setErrors] = useState({});

    // const formData = new FormData();
    // formData.append("testimonial", testimonial);
    // formData.append("add_by", add_by);
    // formData.append("position", position);

    // const handleChange = (e, editor) => {
    //     settestimonial(editor.getData());
    // }

    // const handlesubmit = async (e) => {
    //     e.preventDefault();

    //     const newErrors = {};
    //     if (!testimonial.trim()) {
    //         newErrors.testimonial = " Testimonial is required";
    //     }

    //     if (!add_by) {
    //         newErrors.add_by = " Add_by Is required";
    //     }

    //     if (!position) {
    //         newErrors.position = " Position Is required";
    //     }

    //     if (Object.keys(newErrors).length > 0) {
    //         setErrors(newErrors);
    //         return;
    //     }
    //     setErrors({});

    //     console.log(testimonial, add_by, position);

    //     try {

    //         const response = await axios.post('http://wa_front.localhost.com/api/Testimonial', formData, {
    //             headers: {
    //                 "Content-Type": "application/json", 
    //             },
    //             data: {
    //                 testimonial: testimonial,
    //                 add_by: add_by,
    //                 position: position,
    //             },
    //         });

    //         console.log(response);


    //         await Swal.fire({
    //             icon: 'success',
    //             title: 'Success',
    //             text: "Testimonial data Saved Successfully.",
    //         });

    //         navigate("/Testimonial_List");
    //     } catch (error) {
    //         console.error("Error In Storing Data", error);


    //         await Swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text: 'Error in storing data. Please try again.',
    //         });
    //     }
    // }


    // const handleCancel = () => {
    //     navigate("/Testimonial_List");
    // }


    const [menus, setMenus] = useState([{ name: '', link: '' }]);

    const handleMenuChange = (index, event) => {
        const newMenus = [...menus];
        newMenus[index].name = event.target.value;
        setMenus(newMenus);
    };

    const handleLinkChange = (index, event) => {
        const newMenus = [...menus];
        newMenus[index].link = event.target.value;
        setMenus(newMenus);
    };

    const addMenu = () => {
        setMenus([...menus, { name: '', link: '' }]);
    };

    const cancelMenu = () => {
        if (menus.length > 1) {
            setMenus(menus.slice(0, -1)); // Remove the last menu
        }
    };
   



    return (
        <>
            <div class="container-fluid panel-header panel-header-sm">
            </div>

            <div className="col-md-12">
                <div className="row card  mt-4" style={{
                    marginLeft: "22%",
                    width: "75%"
                }}>

                    <div className="card-header">
                        <h5 className="title">NavBar</h5>
                    </div>
                    <div className="card-body">
                        <div className='container'>
                            <form action="#" encType="multipart/form-data" id="servicesForm">
                                <div class="row">
                                    {/* <div class="col-md-12">
                                        <div class="form-floating mb-3">
                                            <input type="text" class="form-control" id="floatingInput" placeholder="" required />
                                            <label for="floatingInput">Nav Menu</label>
                                        </div>
                                        <div class="form-floating mb-3">
                                            <input type="url" class="form-control" id="floatingLink" placeholder="http://example.com" required pattern="https?://.+" />
                                            <label for="floatingLink">Nav Menu Link URL</label>
                                            <small class="form-text text-muted">Please enter a valid URL starting with http:// or https://.</small>
                                        </div>
                                    </div> */}
                                    
                                    <div className="col-md-12">
                                        {menus.map((menu, index) => (
                                            <div key={index}>
                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={menu.name}
                                                        onChange={(event) => handleMenuChange(index, event)}
                                                        required
                                                    />
                                                    <label>Nav Menu</label>
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="url"
                                                        className="form-control"
                                                        value={menu.link}
                                                        onChange={(event) => handleLinkChange(index, event)}
                                                        
                                                        pattern="https?://.+"
                                                    />
                                                    <label>Nav Menu Link URL</label>
                                                    <small className="form-text text-muted">
                                                        Please enter a valid URL starting with http:// or https://.
                                                    </small>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="btn btn-primary" onClick={addMenu}>
                                            Add Menu
                                        </button>
                                        <button className="btn btn-secondary" onClick={cancelMenu}>Cancel Menu</button>
                                    </div>

                                </div><br />

                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="form-floating mb-3">
                                            <input type="text" class="form-control" id="contactButton" placeholder="" style={{ marginLeft: "-6%" }} />
                                            <label for="contactButton">Nav Button Text</label>
                                        </div>

                                    </div>
                                    <div class="col-sm-6">
                                        {/* <div class="form-floating mb-3">
                                            <input type="text" class="form-control" id="loginButton" placeholder="" />
                                            <label for="loginButton">Login Button Text</label>
                                        </div> */}
                                        <div class="form-floating mb-3">
                                            <input type="text" class="form-control" id="loginLink" placeholder="Enter URL" />
                                            <label for="loginLink">Nav Button Link</label>
                                        </div>
                                    </div>

                                </div>
                                <div className="row mt-4">
                                    <div className="col-11">
                                        <button type="button" className="btn btn-primary">Submit</button>
                                        <button type="button" className="btn btn-outline-danger m-2">Cancel</button>
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

export default Navbar;





