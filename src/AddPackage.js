import React, { useState } from "react";
import Searchbar from "./Searchbar";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import Swal from "sweetalert2";

const AddPackage = () => {
  /*********************************************USE-STATES USED**********************************************************************/
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [package_title, setPackage_title] = useState("");
  const [packagePrice, setPackage_Price] = useState("");
  const [errors, setErrors] = useState({});
  const [additional_info, setAdditional_Info] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);


  const formData = new FormData();
  formData.append("package_title", package_title);
  formData.append("package_des", description);
  formData.append("package_price", packagePrice);
  formData.append("additional_info", additional_info);

  const handleChange = (e, editor) => {
    setDescription(editor.getData());
  };

  /*******************************************************INSERT API DATA CALL PART START**********************************************/
  const handlesubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!package_title.trim()) {
      newErrors.package_title = "Package Title Field Cannot Be Blank";
    }
    if (!description.trim()) {
      newErrors.description = "Description Field Cannot Be Blank";
    }
    if (!packagePrice.trim()) {
      newErrors.packagePrice = "Package Price Field Cannot Be Blank";
    }
    if (!additional_info.trim()) {
      newErrors.additional_info = "Additional Info Field Cannot Be Blank";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    axios
      .post("http://wafront.localhost.com/api/package", formData)
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data stored successfully!",
          showCancelButton: true,
          // confirmButtonText: "Go to Package List", 
          // cancelButtonText: "Close",
        }).then((result) => {
          if (result.isConfirmed) {
            // If the user clicks "Go to Package List"
            navigate("/package_list");
          }
        });
      })
      .catch((error) => {
        console.error("Error In Storing Data", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to store data. Please try again.",
          customClass: {
            popup: "center-swal", // Add this class for centering
          },
        });
      });
  };
/****************************************************Insert Api Call Ending*************************************************************/

/*****************************************************Cancel Button************************************************************************/

  const handleCancel = () => {
    navigate("/clist");
  };
/*********************************************************FORM UI PART START**************************************************************/
  return (
    <>
      <Searchbar
            isSidebarOpen={isSidebarOpen}
            // toggleSidebar={toggleSidebar}
          />
          ;
      <div className="container-fluid panel-header panel-header-sm"></div>
      <div className="hhkk">
        <div className="col-md-12">
          <div
            className="row card"
            style={{
              marginLeft: "22%",
              width: "75%",
            }}
          >
            <div className="card-header" style={{ marginTop: "5%" }}>
              <h5 className="title">Add Package</h5>
            </div>
            <div className="card-body">
              <form
                action="#"
                encType="multipart/form-data"
                id="servicesForm"
                onSubmit={handlesubmit}
              >
                <div className="row">
                  <div className="col-md-12 pr-1">
                    <div className="form-group">
                      <label
                        className="inputlabel"
                        style={{ marginLeft: "0%" }}
                      >
                        Package Title
                      </label>
                      <input
                        type="text"
                        onChange={(e) => setPackage_title(e.target.value)}
                        className="form-control"
                        name="package_title"
                        id="package_title"
                        autoComplete="off"
                      />
                      {errors.package_title && (
                        <p style={{ color: "red" }}>{errors.package_title}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="inputlabel">Package Description</label>
                  <CKEditor
                    editor={ClassicEditor}
                    onChange={(e, editor) => {
                      handleChange(e, editor);
                    }}
                  />
                  {errors.description && (
                    <p style={{ color: "red" }}>{errors.description}</p>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-12 pr-1">
                    <div className="form-group">
                      <label
                        className="inputlabel"
                        style={{ marginLeft: "-1%" }}
                      >
                        Package Price
                      </label>
                      <input
                        type="text"
                        onChange={(e) => setPackage_Price(e.target.value)}
                        className="form-control"
                        name="package_price"
                        id="package_price"
                        autoComplete="off"
                      />
                      {errors.packagePrice && (
                        <p style={{ color: "red" }}>{errors.packagePrice}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="inputlabel">Additional Info</label>
                  <CKEditor
                    editor={ClassicEditor}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setAdditional_Info(data);
                    }}
                  />
                  {errors.additional_info && (
                    <p style={{ color: "red" }}>{errors.additional_info}</p>
                  )}
                </div>
                <div id="more_content"></div>
                <div className="row mt-4">
                  <div className="col-11">
                    <button className="btn btn-success" type="submit">
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
    </>
  );
};
/********************************************************FORM UI ENDING*******************************************************************/
export default AddPackage;
