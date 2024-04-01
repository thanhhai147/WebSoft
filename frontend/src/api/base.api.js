import axios from "axios";
import TokenUtil from "../helpers/token.utils";

const BASE_API_URL = process.env.REACT_APP_API_ENDPOINT

class BaseAPI {
    constructor() {
        axios.defaults.baseURL = BASE_API_URL
        axios.defaults.headers.common['Authorization'] = TokenUtil.getToken()
    }

    queryParams(params) {
        return Object.keys(params)
                .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
                .join("&")
    }

    handleResponse(res) {
        if(res.data.success === false) {
            // error notification
            console.log(res.data.message)
        }
        return res.data
    }

    handleError(err) {
        if(!err) return
        // error notification
        console.log(err.data.message)
        // handle token authorization error
        if(err.status === 401 || err.status === 403) {
            // reset authorization token
            TokenUtil.saveToken("")
            window.location.replace("/")
        }
    }

    get(path, params) {
        let query = this.queryParams(params)
        let url = path

        if(query) {
            url += "?" + query
        }
        return axios
                .get(url)
                .then(res => this.handleResponse(res))
                .catch(err => this.handleError(err))
    }

    post(path, params) {
        let url = path
        return axios
                .post(url, params)
                .then(res => this.handleResponse(res))
                .catch(err => this.handleError(err))
    }

    put(path, params) {
        let url = path

        return axios
                .post(url, params)
                .then(res => this.handleResponse(res))
                .catch(err => this.handleError(err))
    }

    delete(path, params) {
        let url = path

        return axios
                .delete(url)
                .then(res => this.handleResponse(res))
                .catch(err => this.handleError(err))
    }
}

const BaseAPIInstance = new BaseAPI()
Object.freeze(BaseAPIInstance)

export default BaseAPIInstance