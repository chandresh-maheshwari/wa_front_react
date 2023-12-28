import React, { useEffect, useState } from "react";
import Searchbar from "./Searchbar";
import "./clientform.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "./axiosConfig";
import Swal from "sweetalert2";

const EditClientForm = () => {
  const { id } = useParams();
  const [clientname, setClientName] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");
  const [new_partner_logo, setNewPartnerLogo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (imageFile) {
      setNewImagePreview(URL.createObjectURL(imageFile));
    }
  }, [imageFile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://wafront.localhost.com/api/clients/${id}`
        );

        if (response.data) {
          const { partner_name, partner_logo } = response.data;
          setClientName(partner_name);
          setImage(partner_logo);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchData();
  }, [id]);

  const ResetButton = (e) => {
    e.preventDefault();
    navigate("/clist");
  };

  const handleUpdateClick = async (e) => {
    e.preventDefault();

    const requestData = {
      partner_name: clientname,
      old_partner_logo: image,
      image_updated: imageFile ? "true" : "false",
    };

    // Check if imageFile is truthy before sending the request
    if (imageFile) {
      requestData.new_partner_logo = imageFile;
      setNewPartnerLogo(imageFile); // Update new_partner_logo state
    }

    // Set the partner_logo in the requestData
    requestData.partner_logo = imageFile ? imageFile.name : image || "";

    // Only add 'partner_logo' to the request if it's not an empty string
    if (requestData.partner_logo) {
      try {
        const response = await axios.put(
          `http://wafront.localhost.com/api/product/${id}/update`,
          requestData
        );

        console.log(response);

        // Show success alert
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Client updated successfully!",
          customClass: {
            popup: "center-swal", // Add this class for centering
          },
        });

        navigate("/clist");
      } catch (error) {
        console.error("Error In Updating Data", error);

        // Show error alert
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update Client. Please try again.",
          customClass: {
            popup: "center-swal", // Add this class for centering
          },
        });
      }
    } else {
      console.error("Error: 'partner_logo' cannot be null.");
    }
  };

  return (
    <>
      <Searchbar />
      <div className="panel-header panel-header-sm"></div>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h5 className="title">Edit Client</h5>
              </div>
              <div className="card-body">
                <form
                  method="post"
                  action="#"
                  encType="multipart/form-data"
                  id="clientform"
                  onSubmit={handleUpdateClick}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    // height: "20vh",
                  }}
                >
                  <div className="form-row">
                    <div className="col-md-6 pr-1">
                      <div className="form-group">
                        <label>Edit Partner Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="partner_name"
                          id="partner_name"
                          autoComplete="off"
                          value={clientname}
                          onChange={(e) => setClientName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Edit Partner Logo</label>
                        <input
                          type="file"
                          className="form-control"
                          id="new_partner_logo"
                          name="new_partner_logo"
                          onChange={(e) => {
                            const selectedFile = e.target.files[0];
                            setImageFile(selectedFile);
                          }}
                        />
                        <input
                          type="hidden"
                          name="old_partner_logo"
                          value={image}
                        />

                        <input
                          type="hidden"
                          name="new_partner_logo"
                          value={new_partner_logo ? new_partner_logo : {}}
                        />

                        {newImagePreview ? (
                          <img
                            src={newImagePreview}
                            alt="New Partner Logo"
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        ) : (
                          <div className="d-flex align-items-center">
                            {image && (
                              <>
                                <img
                                  src={`http://wafront.localhost.com/images/client/${image}`}
                                  alt="Partner Logo"
                                  style={{
                                    maxWidth: "100px",
                                    maxHeight: "100px",
                                  }}
                                />
                                <span className="ml-2">{image}</span>
                              </>
                            )}
                            {!image && <div>No image selected</div>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div id="more_content"></div>

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

export default EditClientForm;
