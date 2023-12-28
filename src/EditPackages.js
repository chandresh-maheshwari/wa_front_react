import React, { useEffect } from "react";
import { useState } from "react";
import Searchbar from "./Searchbar";
import "./clientform.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// import { error } from "jquery";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import swal from 'sweetalert';

const EditPackages = () => {
  const { id } = useParams();
  const [product_title, setPackageTitle] = useState("");
  const [description, setDescription] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  const [additionalInfo, setAdditional_Info] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://wafront.localhost.com/api/packages/${id}`
        );
        const data = await res.json(); // Parse response as JSON
        console.log(data);
        if (data) {
          const { package_title, package_des, package_price, additional_info } =
            data;
          setPackageTitle(package_title);
          setDescription(package_des);
          setPackagePrice(package_price);
          setAdditional_Info(additional_info);
        }
      } catch (e) {
        console.error("Failed To Fetch Data", e);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e, editor) => {
    const data = editor.getData();
    setDescription(data);
  };

  const OnhandleUpdateClick = async (e) => {
    e.preventDefault();
  
    const requestedData = {
      package_title: product_title,
      package_des: description,
      package_price: packagePrice,
      additional_info: additionalInfo,
    };
  
    try {
      const response = await axios.put(`http://wafront.localhost.com/api/package/${id}`, requestedData);
      console.log(response);
      navigate("/package_list");
      // You can customize the SweetAlert success message as needed
      swal("Success", "Package updated successfully", "success");
    } catch (error) {
      console.error("Error in storing data ", error);
      // You can customize the SweetAlert error message as needed
      swal("Error", "Failed to update package. Please try again later.", "error");
    }
  };
  

  const handleCancel = (e) =>{
    navigate("/clist");
  }
/*******************************************************Edit Form Part*******************************************************************/
  return (
    <div>
      <Searchbar />
      <div class="container-fluid panel-header panel-header-sm"></div>
      <div className="hhkk">
        <div className="col-md-12">
          <div
            className="row card"
            style={{
              top: "35px",
              marginLeft: "22%",
              width: "75%",
            }}
          >
            <div className="card-header" style={{ marginTop: "" }}>
              <h5 className="title">Package Title</h5>
            </div>
            <div className="card-body">
              {/* onSubmit={handlesubmit} */}
              <form
                action="#"
                encType="multipart/form-data"
                id="servicesForm"
                onSubmit={OnhandleUpdateClick}
              >
                <div className="row">
                  <div className="col-md-12 pr-1">
                    <div className="form-group">
                      <label
                        className="inputlabel"
                        // style={{ marginLeft: "-3%" }}
                      >
                        Package Title
                      </label>
                      <input
                        type="text"
                        onChange={(e) => setPackageTitle(e.target.value)}
                        className="form-control"
                        name="service_title"
                        value={product_title}
                        id="service_title"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="inputlabel">Package Description</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={description}
                    onReady={(editor) => {}}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setDescription(data);
                    }}
                  />
                </div>

                <div className="row">
                  <div className="col-md-12 pr-1">
                    <div className="form-group">
                      <label
                        className="inputlabel"
                        // style={{ marginLeft: "-3%" }}
                      >
                        Add Package
                      </label>
                      <input
                        type="text"
                        onChange={(e) => setPackagePrice(e.target.value)}
                        value={packagePrice}
                        className="form-control"
                        name="service_title"
                        id="service_title"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="inputlabel">Package Description</label>

                  <CKEditor
                    editor={ClassicEditor}
                    data={additionalInfo}
                    onReady={(editor) => {}}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setAdditional_Info(data);
                    }}
                  />
                </div>
                <div id="more_content"></div>
                <div className="row mt-4">
                  <div className="col-11">
                    <button
                      //  onClick={handlesubmit}
                      className="btn btn-success"
                    >
                      Submit   
                    </button>
                    <button
                      onClick={handleCancel}
                      type="button"
                      className="btn btn-danger m-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
/*******************************************************Edit Form Part********************************************************************/
export default EditPackages;
