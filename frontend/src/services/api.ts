import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter automatiquement le Token Keycloak
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jumelles_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
  getByIdOrNumber: (idOrNumber: string) => apiClient.get(`/orders/${idOrNumber}`),
  getMyOrders: (email: string) => apiClient.get('/orders/my-orders', { params: { email } }),
  getAllAdmin: () => apiClient.get('/orders/admin/all'),
  getStats: () => apiClient.get('/orders/admin/dashboard-stats'),
  updateStatus: (id: string, status: string) => apiClient.patch(`/orders/admin/${id}/status`, { status }),
};

// Services Paiement (Wave & Orange Money)
export const PaymentService = {
  initiate: (data: { orderId: string; provider: 'WAVE' | 'ORANGE_MONEY'; customerPhone?: string }) =>
    apiClient.post('/payments/initiate', data),
  simulateSuccess: (orderId: string) => apiClient.post('/payments/simulate-success', { orderId }),
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

