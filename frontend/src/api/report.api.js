import BaseAPI from "./base.api";

const ReportAPI = {
    getStorageReport: (dateData) => {
        return BaseAPI.post("/storage/reports", dateData)
    },

    getDebtReport: (dateData) => {
        return BaseAPI.post("/consumer/debtReport", dateData)
    }
}

export default ReportAPI