import api from "../axiosInstance";

export const createPaymentOrderApi = (amount) => {

    return api.post("/api/payment/create-order",{
        amount
    });

};

export const verifyPaymentApi = (request) => {

    return api.post("/api/payment/verify",request);

};