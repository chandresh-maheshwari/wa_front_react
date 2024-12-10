// import config from "../../Config";
import Config from "./Config";
import axios from "axios";
import ls from "local-storage";
// import moment from 'moment-timezone';
// import jsPDF from "jspdf";
// import swal from "sweetalert";

// eslint-disable-next-line import/no-anonymous-default-export
export default new (class AuthApi {
  setHeaders(type) {
    let authToken =
      ls.get("authToken") &&
        ls.get("authToken") !== null &&
        ls.get("authToken") !== false
        ? ls.get("authToken")
        : "";
    axios.defaults.headers[type]["Content-Type"] = "multipart/form-data";
    // axios.defaults.headers[type]['Content-Type'] = 'application/json;charset=utf-8';
    axios.defaults.headers[type]["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers[type]["Authorization"] = `Bearer ${authToken}`;
  }


  async loginData(formData) {
    // console.log(formData)
    try {
      const url = Config.apiurl + Config.apis.login;
      // console.log(url);
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error  Login Data:", error);
      throw new Error("Failed to Login Data");
    }
  }






  async refreshToken1(formData) {
    // console.log()
    try {
      const url = Config.apiurl + Config.apis.LoginExToken;
      const token = ls('Token');
      // console.log(token);
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new Error("Failed to refresh token");
    }
  }




  async durTime() {
    try {
      const url = Config.apiurl + Config.apis.userList;
      const token = ls('Token');
      this.setHeaders("get");
      let data = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } catch (error) {
      return false;
    }
  }


  async getById(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.getById}${id}`;


      this.setHeaders("get");
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }






  async add(formData) {
    // console.log(formData)
    try {
      const url = Config.apiurl + Config.apis.add;
      const token = ls('Token');
      console.log(token);
      this.setHeaders("post");

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return false;
    }
  }

  async getItemById() {
    try {
      const url = `${Config.apiurl}${Config.apis.getItemById}`;
      const token = ls('Token');

      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        },
      });
      return response.data.results;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }






  async update(formData, blobData) {
    // console.log(formData);
    try {
      const url = `${Config.apiurl}${Config.apis.update}`;
      const token = ls('Token');


      if (blobData) {
        formData.append('file', blobData, 'fileName.jpg');
      }


      this.setHeaders("post");

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }




  async status(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.active}${id}`;
      const token = ls('Token');

      this.setHeaders("post");
      const response = await axios.post(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async softDelete(id) {
    try {
      const url = Config.apiurl + Config.apis.softdelete + id;
      const token = ls('Token');

      this.setHeaders("delete");
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async navbarstore(formData) {
    try {
      const url = Config.apiurl + Config.apis.navbaradd;
      const token = ls('Token');

      this.setHeaders("post");

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return false;
    }
  }


  async getDataList() {
    try {
      const url = Config.apiurl + Config.apis.navbarList;
      const token = ls('Token');

      this.setHeaders("get");
      let data = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
        )
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } catch (error) {
      return false;
    }
  }





  async navbarstatus(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.navbarActive}${id}`;
      const token = ls('Token');
      console.log("massge tokan ", token)
      this.setHeaders("post");
      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }


  async getDelete(id) {
    try {
      const url = Config.apiurl + Config.apis.navbarDelet + id;
      const token = ls('Token');

      this.setHeaders("delete");
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getEditData(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.navbarEdit}${id}`;
      const token = ls('Token');

      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async getupdate(id, formData) {
    const token = ls('Token');
    try {
      const url = `${Config.apiurl}${Config.apis.navbarupdate}${id}`;

      this.setHeaders("post");
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }



  async homestore(formData) {
    try {
      const url = Config.apiurl + Config.apis.homeinsert;
      const token = ls('Token');

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(`Failed to store home data: ${error.message}`);
    }
  }


  async gethomeList() {
    try {
      const url = Config.apiurl + Config.apis.homepagelist;
      const token = ls('Token');
      // console.log("massge tokan ", token)
      this.setHeaders("get");
      let data = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } catch (error) {
      return false;
    }
  }

  async homestatus(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.homeActive}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }




  async homeEditData(id) {
    // console.log(id);
    try {
      const url = `${Config.apiurl}${Config.apis.homeEdit}${id}`;
      const token = ls('Token');
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async homegetupdate(id, formData) {

    try {
      const url = `${Config.apiurl}${Config.apis.Homeupdate}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }



  async homegetDelete(id) {
    try {
      const url = Config.apiurl + Config.apis.homeDelete + id;
      const token = ls('Token');
      this.setHeaders("delete");
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async getreciverList() {
    try {
      const url = Config.apiurl + Config.apis.p_reciverListing;
      const token = ls('Token');
      this.setHeaders("get");
      let data = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } catch (error) {
      return false;
    }
  }



  async p_reciverstore(formData) {
    // console.log(formData);
    try {
      const url = Config.apiurl + Config.apis.p_reciverinsert;
      const token = ls('Token');
      this.setHeaders("post");

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return false;
    }
  }




  async getreciverDelete(id) {
    try {
      const url = Config.apiurl + Config.apis.p_reciverDelete + id;
      const token = ls('Token');
      this.setHeaders("delete");
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }



  async getreciverEdit(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.p_reciverEdit}${id}`;
      const token = ls('Token');
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }



  async getreciverupdate(id, formData) {

    try {
      const url = `${Config.apiurl}${Config.apis.p_reciverUpdate}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }


  async producerstatus(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.p_reciverActive}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }



  async quotestoredata(formData) {
    console.log(formData)
    try {
      const url = Config.apiurl + Config.apis.quotestore;
      const token = ls('Token');
      this.setHeaders("post");

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return false;
    }
  }






  async quoteListData() {
    try {
      const url = Config.apiurl + Config.apis.quotesListing;
      const token = ls('Token');
      this.setHeaders("get");
      let data = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } catch (error) {
      return false;
    }
  }



  async quoteDelete(id) {
    try {
      const url = Config.apiurl + Config.apis.quotesDelete + id;
      const token = ls('Token');
      this.setHeaders("delete");
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }





  async quoteEditData(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.quotesEdit}${id}`;
      const token = ls('Token');
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }



  async getquoteupdate(id, formData) {

    try {
      const url = `${Config.apiurl}${Config.apis.quotesUpdate}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }




  async forgetSendotp(email) {

    try {
      const url = Config.apiurl + Config.apis.forgetPassSendotp;
      // console.log(url)
      this.setHeaders("post");

      const response = await axios.post(url, email, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return false;
    }
  }




  async forgetverifyotp(otp, email) {

    try {
      const url = Config.apiurl + Config.apis.forgetPassvarify;
      // console.log(url)
      this.setHeaders("post");

      const response = await axios.post(url, otp, email, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return false;
    }
  }



  async forgeresetpass(email, otp, password, password_confirmation) {

    try {
      const url = Config.apiurl + Config.apis.forgetPassreset;
      // console.log(url)
      this.setHeaders("post");

      const response = await axios.post(url, email, otp, password, password_confirmation, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return false;
    }
  }




  async westStoreData(formData) {
    // console.log(formData);
    try {
      const url = Config.apiurl + Config.apis.weststore;
      const token = ls('Token');
      console.log(url)
      this.setHeaders("post");

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return false;
    }
  }




  async westListData() {
    try {
      const url = Config.apiurl + Config.apis.westListing;
      const token = ls('Token');
      this.setHeaders("get");
      let data = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } catch (error) {
      return false;
    }
  }


  async westDeleteData(id) {
    try {
      const url = Config.apiurl + Config.apis.westDelete + id;
      const token = ls('Token');
      this.setHeaders("delete");
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }




  async westEditData(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.westEdit}${id}`;
      const token = ls('Token');
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }



  async westupdate(id, formData) {

    try {
      const url = `${Config.apiurl}${Config.apis.westupdate}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }




  async weststatus(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.westActive}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }


  async improveStoreData(formData) {
    // console.log(formData);
    try {
      const url = Config.apiurl + Config.apis.improvestore;
      const token = ls('Token');
      console.log(url)
      this.setHeaders("post");

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return false;
    }
  }




  async improveListData() {
    try {
      const url = Config.apiurl + Config.apis.improveListData;
      const token = ls('Token');
      this.setHeaders("get");
      let data = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } catch (error) {
      return false;
    }
  }


  async improveDeleteData(id) {
    try {
      const url = Config.apiurl + Config.apis.improveDelete + id;
      const token = ls('Token');
      this.setHeaders("delete");
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }




  async improveEditData(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.impoveEdit}${id}`;
      const token = ls('Token');
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }



  async improveupdate(id, formData) {

    try {
      const url = `${Config.apiurl}${Config.apis.improveUpdate}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }




  async improvestatus(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.improveActive}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }



  async poststore(formData) {
    try {
      const url = Config.apiurl + Config.apis.postStore;
      const token = ls('Token');

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(`Failed to store home data: ${error.message}`);
    }
  }






  async postList() {
    try {
      const url = Config.apiurl + Config.apis.postListingData;
      const token = ls('Token');
      this.setHeaders("get");
      let data = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } catch (error) {
      return false;
    }
  }



  async postDeleteData(id) {
    try {
      const url = Config.apiurl + Config.apis.PostDelete + id;
      const token = ls('Token');
      this.setHeaders("delete");
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async Poststatus(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.postActive}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async postEditData(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.postEdit}${id}`;
      const token = ls('Token');
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }


  async postupdate(id, formData) {

    try {
      const url = `${Config.apiurl}${Config.apis.postUpdate}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }




  async Dynamicstoredata(formData) {
    try {
      const url = Config.apiurl + Config.apis.dynamicstore;
      const token = ls('Token');

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(`Failed to store home data: ${error.message}`);
    }
  }



  async dynamicListData() {
    try {
      const url = Config.apiurl + Config.apis.dynamicList;
      const token = ls('Token');
      this.setHeaders("get");
      let data = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } catch (error) {
      return false;
    }
  }






  async dynamicEditData(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.dynamicEdit}${id}`;
      const token = ls('Token');
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }


  async dynamicupdatedata(id, formData) {

    try {
      const url = `${Config.apiurl}${Config.apis.dynamicUpdate}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }



  async dynamicstatus(id) {
    console.log(id)
    try {
      const url = `${Config.apiurl}${Config.apis.dynamicActive}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }


  async dynamicDeleteData(id) {
    try {
      const url = Config.apiurl + Config.apis.dynamicDelete + id;
      console.log(url)
      const token = ls('Token');
      this.setHeaders("delete");
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async dynamifieldfetchdata(post_title) {
    // console.log(post_title)
    try {
      const url = Config.apiurl + Config.apis.dynamicFieldfetch + post_title;
      // console.log()
      const token = ls('Token');
      this.setHeaders("get");
      let data = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': post_title instanceof FormData ? 'multipart/form-data' : 'application/json',
          },
        })
        .then((res) => {
          // console.log(res.data)
          return res.data;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } catch (error) {
      return false;
    }
  }






  async postDynamicstoredata(formData, post_title) {
    console.log(formData, post_title)
    try {
      const url = Config.apiurl + Config.apis.postDynamicstore + post_title;
      console.log(url)
      const token = ls('Token');

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
          // 'Content-Type': 'application/json',

        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(`Failed to store home data: ${error.message}`);
    }
  }



  async postdynamicListData(post_name) {
    // console.log(post_name)
    try {
      const url = Config.apiurl + Config.apis.postDynamiclist + post_name;
      const token = ls('Token');
      this.setHeaders("get");
      let data = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } catch (error) {
      return false;
    }
  }



  async postdynamicEditData(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.postDynamicEdit}${id}`;
      const token = ls('Token');
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }


  async postdynamicupdatedata(id, formData) {

    try {
      const url = `${Config.apiurl}${Config.apis.postDynamicUpdate}${id}`;
      console.log(url);
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }

  }



  async postdynamicDeleteData(id) {
    console.log(id)
    try {
      const url = Config.apiurl + Config.apis.postDynamicDelete + id;
      const token = ls('Token');
      this.setHeaders("delete");
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }



  async postdynamicstatus(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.postDynamicActive}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }






  async Pagestoredata(formData) {
    try {
      const url = Config.apiurl + Config.apis.pageStore;
      const token = ls('Token');

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(`Failed to store home data: ${error.message}`);
    }
  }


  async pageListData() {
    try {
      const url = Config.apiurl + Config.apis.pageList;
      const token = ls('Token');
      this.setHeaders("get");
      let data = await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return false;
        });
      return data;
    } catch (error) {
      return false;
    }
  }



  async pageEditData(id) {
    try {
      const url = `${Config.apiurl}${Config.apis.pageEdit}${id}`;
      const token = ls('Token');
      this.setHeaders("get");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.results;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }




  async pageupdatedata(id, formData) {

    try {
      const url = `${Config.apiurl}${Config.apis.pageUpdate}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
          'Content-Type': formData instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }


  async pageDeleteData(id) {
    try {
      const url = Config.apiurl + Config.apis.pageDelele + id;
      console.log(url)
      const token = ls('Token');
      this.setHeaders("delete");
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async pagestatus(id) {
    console.log(id)
    try {
      const url = `${Config.apiurl}${Config.apis.pageActie}${id}`;
      const token = ls('Token');
      this.setHeaders("post");
      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

})();
