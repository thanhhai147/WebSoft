import SettingAPI from "../api/settings.api"

export default class SettingUtil {
    static async getAllSetting() {
        const response = await SettingAPI.getALLSetting()

        if (response === null || response === undefined) return

        const settingData = Object.values(response.data).flatMap(ele => ({
            key: ele.ParameterName,
            ...ele
        }))
        return settingData
    }

    static async editSetting(parameterName, settingData) {
        const response = await SettingAPI.editSetting(parameterName, settingData)
        return response
    }

    static async deleteSetting(parameterNameList) {
        const response = await Promise.all(parameterNameList.map(parameterName => SettingAPI.deleteSetting(parameterName)))
        return response
    }
}