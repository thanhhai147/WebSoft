import BaseAPI from "./base.api"

const LoginAPI = {
    handleLogin: (data) => {
        return BaseAPI.post("/account/log-in/", data)
    },

    handleLogout: () => {
        return BaseAPI.put("/account/log-out/", {})
    }
}

export default LoginAPI