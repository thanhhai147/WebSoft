import BaseAPI from "./base.api";

const ReportAPI = {
    getStorageReport: (dateData) => {
        return BaseAPI.post("/storage/reports", dateData)
    },
}

export default ReportAPI