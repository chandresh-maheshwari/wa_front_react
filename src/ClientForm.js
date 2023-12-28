import React, { useState } from "react";
import Searchbar from "./Searchbar";
import "./clientform.css"; // Import your CSS file
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const ClientForm = () => {
  const [clientname, setClientName] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const ResetButton = (e) => {
    e.preventDefault();
    navigate("/clist");
  };
  /***********************************************************Delete Data ID WISE **********************************************************/
  const HandleForm = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!clientname.trim()) {
      newErrors.partner_name = "Partner name is required";
    }

    if (!image) {
      newErrors.partnerLogo = "Partner Logo Is required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const formData = new FormData();

    formData.append("partner_name", clientname);
    formData.append("partner_logo", image);

    try {
      const response = await axios.post(
        "http://wafront.localhost.com/api/addnew",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      // Show success alert
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data stored successfully!",
        customClass: {
          popup: "center-swal", // Add this class for centering
        },
      });

      // Redirect to the listing page
      navigate("/clist");
    } catch (error) {
      console.error("Error In Storing Data", error);

      // Show error alert
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to store data. Please try again.",
        customClass: {
          popup: "center-swal", // Add this class for centering
        },
      });
    }
  };
  /****************************************************************************************************************************/
  return (
    <>
      <Searchbar />

      <div className="panel-header panel-header-sm"></div>

      <div className="content">
        <div className="col-md-12">
          <div className="row">
            <div className="card-test">
              <div className="card-header">
                <h5 className="title">Add Client</h5>
              </div>
              <div className="card-body-1">
                <form
                  onSubmit={HandleForm}
                  method="post"
                  action="#"
                  encType="multipart/form-data"
                  id="clientform"
                >
                  <div className="row">
                    <div className="col-md-5 pr-md-1">
                      <div className="form-group-1">
                        <label>Add Partner Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="partner_name"
                          id="partner_name"
                          autoComplete="off"
                          onChange={(e) => setClientName(e.target.value)}
                        />
                        {errors.partner_name && (
                          <p style={{ color: "red" }}>{errors.partner_name}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="form-group-1">
                        <label>Add Partner Logo</label>
                        <input
                          type="file"
                          className="form-control"
                          id="partner_logo"
                          name="partner_logo"
                          onChange={(e) => setImage(e.target.files[0])}
                        />
                        {errors.partnerLogo && (
                          <p style={{ color: "red" }}>{errors.partnerLogo}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <input
                          type="submit"
                          className="btn btn-outline-success"
                          value="Submit"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger m-2"
                          onClick={ResetButton}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientForm;
