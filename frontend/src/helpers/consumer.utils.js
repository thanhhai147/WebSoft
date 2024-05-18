import ConsumerAPI from "../api/consumer.api"

export default class ConsumerUtil {
    static async getAllConsumer() {
        const response = await ConsumerAPI.getALLConsumer()

        if (response === null || response === undefined) return

        const consumerData = Object.values(response.data).flatMap(ele => ({
            key: ele.ConsumerId,
            ...ele
        }))
        return consumerData
    }

    static async createConsumer(consumerData) {
        const response = await ConsumerAPI.createConsumer(consumerData)
        return response
    }

    static async editConsumer(consumerId, consumerData) {
        const response = await ConsumerAPI.editConsumer(consumerId, consumerData)
        return response
    }

    static async deleteConsumer(consumerIdList) {
        const response = await Promise.all(consumerIdList.map(id => ConsumerAPI.deleteConsumer(id)))
        return response
    }
}