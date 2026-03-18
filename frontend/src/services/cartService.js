import { api } from './api';

export const fetchCart = () => api.get('/cart');
export const addToCart = (productId, quantity) => api.post('/cart/add', { productId, quantity });
export const removeFromCart = (productId) => api.delete('/cart/remove', { data: { productId } });

// Admin cart management
export const getAdminCarts = () => api.get('/cart/admin');
export const getAdminCart = (cartId) => api.get(`/cart/admin/${cartId}`);
export const adminAddToCart = (cartId, productId, quantity) =>
  api.post(`/cart/admin/${cartId}/add`, { productId, quantity });
export const adminRemoveFromCart = (cartId, productId) =>
  api.delete(`/cart/admin/${cartId}/remove`, { data: { productId } });
