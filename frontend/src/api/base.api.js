import axios from "axios";
import TokenUtil from "../helpers/token.utils";
import { NotificationComponent } from "../components/common/notification.component";
import { TITLE, MESSAGE } from "../messages/main.message";

const BASE_API_URL = process.env.REACT_APP_API_ENDPOINT;

class BaseAPI {
  constructor() {
    axios.defaults.baseURL = BASE_API_URL;
    axios.defaults.headers.common["Authorization"] = TokenUtil.getToken();
  }

  queryParams(params) {
    return Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
  }

  handleResponse(res) {
    if (res?.data?.success === false) {
      // error notification
      NotificationComponent("error", TITLE.WARNING, res?.data?.message, 1);
    }
    return res.data;
  }

  handleError(err) {
    if (!err) return;
    // error notification
    if (err?.response && typeof err?.response?.data?.message == "string") {
      NotificationComponent(
        "error",
        TITLE.ERROR,
        err?.response?.data?.message?.toString(),
        1
      );
    } else {
      NotificationComponent("error", TITLE.ERROR, MESSAGE.HAS_AN_ERROR, 1);
    }
    // handle token authorization error
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      // reset authorization token
      TokenUtil.saveToken("");
      TokenUtil.saveUsername("");
      window.location.assign("/");
    }
  }

  get(path, params) {
    let query = params && this.queryParams(params);
    let url = path;

    if (query) {
      url += "?" + query;
    }
    return axios
      .get(url)
      .then((res) => this.handleResponse(res))
      .catch((err) => this.handleError(err));
  }

  post(path, params) {
    let url = path;
    return axios
      .post(url, params)
      .then((res) => this.handleResponse(res))
      .catch((err) => this.handleError(err));
  }

  put(path, params) {
    let url = path;

    return axios
      .put(url, params)
      .then((res) => this.handleResponse(res))
      .catch((err) => this.handleError(err));
  }

  delete(path, params) {
    let url = path;

    return axios
      .delete(url)
      .then((res) => this.handleResponse(res))
      .catch((err) => this.handleError(err));
  }
}

const BaseAPIInstance = new BaseAPI();
Object.freeze(BaseAPIInstance);

export default BaseAPIInstance;
