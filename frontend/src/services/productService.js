import { api } from './api';

export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);

const toFormData = (payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    formData.append(key, value);
  });
  return formData;
};

export const createProduct = (payload) =>
  api.post('/products', toFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct = (id, payload) =>
  api.put(`/products/${id}`, toFormData(payload), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProduct = (id) => api.delete(`/products/${id}`);
