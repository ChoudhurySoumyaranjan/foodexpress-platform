import api from "../axiosInstance"

export const registerUser= async (jsonData)=>{
    return await api.post("/api/auth/register",jsonData)
}

export const loginUser = async (jsonData)=>{
    return await api.post("/api/auth/login",jsonData);
}

export const logoutUser = async ()=>{
    return await api.post("/api/auth/logout")
}

export const refreshToken = async ()=>{
    return await api.post("/api/auth/refresh-token")
}

export const forgotPassword= async(jsonData)=>{
    return api.post("/api/auth/forgot-password",jsonData)
}

export const resetPassword = async (jsonData)=>{
    return api.post("/api/auth/reset-password",jsonData)
}