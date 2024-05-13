import BaseAPI from "./base.api";

const ConsumerAPI = {
    getALLConsumer: () => {
        return BaseAPI.get("/consumer/")
    },

    getConsumerById: (consumerId) => {
        return BaseAPI.get(`/consumer/${consumerId}/`)
    },

    createConsumer: (consumerData) => {
        return BaseAPI.post("/consumer/create/", consumerData)
    },

    editConsumer: (consumerId, consumerData) => {
        return BaseAPI.put(`/consumer/${consumerId}/update/`, consumerData)
    },

    deleteConsumer: (consumerId) => {
        return BaseAPI.delete(`/consumer/${consumerId}/delete/`)
    },
}

export default ConsumerAPI