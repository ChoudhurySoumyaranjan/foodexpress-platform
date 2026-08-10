import api from "../axiosInstance"

export const addCategory= async (formData)=>{
    return await api.post("/admin/api/categories",formData)
}

export const getCategories=async ()=>{
    return await api.get("/admin/api/categories")
}

export const deleteCategory=async(id)=>{
    return await api.delete(`/admin/api/categories/${id}`);
}

export const editCategory=async(id, formData)=>{
    return await api.put(`/admin/api/categories/${id}`,formData);
}

export const getCatgeoryById = async(id)=>{
    return await api.get(`/admin/api/categories/${id}`)
}