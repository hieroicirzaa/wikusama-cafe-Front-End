const myToken = localStorage.getItem('token')

export const config = {
    headers: { Authorization: `Bearer ${myToken}` }
  };
export const LOCAL_STORAGE_USER = "wikusamaCafe/user";

export const baseURL = "http://localhost:8000"
export const imageURL = baseURL + "/gambar/"