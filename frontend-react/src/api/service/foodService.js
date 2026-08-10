import api from "../axiosInstance"

export const fetchAllFoods=async()=>{
    return await api.get("/api/foods");
}

export const fetchFoodById=async(id)=>{
    return await api.get(`/admin/api/foods/${id}`);
}

export const addFood=async(formData)=>{
    return await api.post("/admin/api/foods",formData)
}

export const deleteFood=async(id)=>{
    return await api.delete(`/admin/api/foods/${id}`)
}

export const updateFood=async(id,formData)=>{
    return await api.put(`/admin/api/foods/${id}`,formData)
}

export const fetchFoodsByCategory = async (id)=>{
    return await api.get(`/api/foods/category/${id}`)
}

export const fetchFoodsByKeyword = async (keyword)=>{
    return await api.get(`/api/foods/search?keyword=${keyword}`)
}