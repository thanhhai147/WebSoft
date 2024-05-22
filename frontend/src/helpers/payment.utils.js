import PaymentAPI from "../api/payment.api"

export default class PaymentUtil {
    static async getAllPayment() {
        const response = await PaymentAPI.getAllPayment()

        if (response === null || response === undefined) return
        
        const paymentData = Object.values(response.data).flatMap(ele => ({
            key: ele.PaymentId,
            ...ele
        }))
        return paymentData
    }

    static async getPaymentDetail(paymentId) {
        const response = await PaymentAPI.getPaymentDetail(paymentId)

        if (response === null || response === undefined) return

        let paymentData = response.data
        paymentData.key = paymentData.PaymentId

        return paymentData
    }

    static async createPayment(paymentData) {
        const response = await PaymentAPI.createPayment(paymentData)
        return response
    }
}