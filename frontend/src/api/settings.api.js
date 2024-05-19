import BaseAPI from "./base.api";

const SettingAPI = {
    getALLSetting: () => {
        return BaseAPI.get("/settings")
    },

    getSettingById: (parameterName) => {
        return BaseAPI.get(`/settings/${parameterName}`)
    },

    editSetting: (parameterName, parameterData) => {
        return BaseAPI.put(`/settings/${parameterName}/edit`, parameterData)
    },

    deleteSetting: (parameterName) => {
        return BaseAPI.delete(`/settings/${parameterName}/delete`)
    },
}

export default SettingAPI