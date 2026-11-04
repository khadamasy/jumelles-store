import axios from 'axios';

const resolveApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    return '/api';
  }
  return 'http://localhost:4000/api';
};

export const API_URL = resolveApiUrl();

/**
 * Client HTTP sécurisé :
 * - Authentification par cookie HttpOnly (aucun token stocké dans localStorage / sessionStorage)
 * - En-tête anti-CSRF X-Requested-With envoyé sur chaque requête
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'JumellesStore',
  },
});

// Services Produits
export const ProductService = {
  getAll: (params?: { category?: string; type?: string; shoeSize?: string; color?: string; search?: string; featured?: boolean }) =>
    apiClient.get('/products', { params }),
  getByIdOrSlug: (idOrSlug: string) => apiClient.get(`/products/${idOrSlug}`),
  getShoeSizes: () => apiClient.get('/products/shoe-sizes'),
  create: (data: any) => apiClient.post('/products', data),
  update: (id: string, data: any) => apiClient.put(`/products/${id}`, data),
  delete: (id: string) => apiClient.delete(`/products/${id}`),
  replenishStock: (data: { productId: string; variantId: string; quantityToAdd?: number; newStockQuantity?: number }) =>
    apiClient.post('/products/stock/replenish', data),
  addVariant: (productId: string, data: any) =>
    apiClient.post(`/products/${productId}/variants`, data),
};

// Services Catégories
export const CategoryService = {
  getAll: (type?: 'SAC' | 'CHAUSSURE') => apiClient.get('/categories', { params: { type } }),
  getBySlug: (slug: string) => apiClient.get(`/categories/${slug}`),
};

// Services Commandes
export const OrderService = {
  create: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    shippingCity: string;
    items: { productVariantId: string; quantity: number }[];
  }) => apiClient.post('/orders', orderData),
  track: (orderNumber: string, phone: string) =>
    apiClient.get('/orders/track', { params: { orderNumber, phone } }),
  getAllAdmin: () => apiClient.get('/orders/admin/all'),
  getStats: () => apiClient.get('/orders/admin/dashboard-stats'),
  updateStatus: (id: string, status: string) => apiClient.patch(`/orders/admin/${id}/status`, { status }),
};

// Services Upload Médias (MinIO)
export const UploadService = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/upload/product-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Services Téléphonie & Assistance Directe
export const PhoneService = {
  getInfo: () => apiClient.get('/phone/info'),
  requestCallback: (data: { customerName?: string; customerPhone: string; productInterest?: string; notes?: string }) =>
    apiClient.post('/phone/callback-request', data),
  getCallbacks: () => apiClient.get('/phone/admin/callbacks'),
  updateCallbackStatus: (id: string, status: 'PENDING' | 'CALLED') =>
    apiClient.patch(`/phone/admin/callbacks/${id}/status`, { status }),
};
