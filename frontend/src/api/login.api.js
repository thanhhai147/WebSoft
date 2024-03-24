import BaseAPI from "./base.api"

export default {
    handleLogin: (data) => {
        return BaseAPI.post("/account/log-in/", data)
    },

    handleLogout: () => {
        return BaseAPI.put("/account/log-out/", {})
    }
}