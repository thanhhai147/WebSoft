import BaseAPI from "./base.api";

const ConsumerAPI = {
    handleGetALLConsumer: () => {
        return BaseAPI.get("/consumer/")
    },

    handleGetConsumerById: (consumerId) => {
        return BaseAPI.get(`/consumer/${consumerId}/`)
    },

    handleCreateConsumer: (consumerData) => {
        return BaseAPI.post("/consumer/create/", consumerData)
    },

    handleCreateConsumer: (consumerId, consumerData) => {
        return BaseAPI.put(`/consumer/${consumerId}/update/`, consumerData)
    },

    handleDeleteConsumer: (consumerId) => {
        return BaseAPI.delete(`/consumer/${consumerId}/delete/`)
    },
}

export default ConsumerAPI