import Axios from "axios";
Axios.defaults.withCredentials = true;
const axios = Axios.create({
  baseURL: process.env.REACT_APP_API_URI + "/api/"
});
export default axios;
