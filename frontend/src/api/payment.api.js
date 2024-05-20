import BaseAPI from "./base.api";

const PaymentAPI = {
    getAllPayment: () => {
        return BaseAPI.get("/payment/")
    },

    getPaymentDetail: (paymentId) => {
        return BaseAPI.get(`/payment/${paymentId}/`)
    },

    createPayment: (paymentData) => {
        return BaseAPI.post("/payment/create/", paymentData)
    }
}

export default PaymentAPI