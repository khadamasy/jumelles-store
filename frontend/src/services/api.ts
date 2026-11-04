import axios from 'axios';

const resolveApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // En mode navigateur (PC ou téléphone mobile connecté en Wi-Fi 192.168.x.x) :
  // Utiliser le chemin relatif '/api' qui passe par le proxy Vite et résout automatiquement l'IP du serveur
  if (typeof window !== 'undefined' && window.location) {
    return '/api';
  }
  return 'http://localhost:4000/api';
};

export const API_URL = resolveApiUrl();

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur : jeton de session ajouté uniquement pour les appels vers notre API
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jumelles_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Session expirée ou révoquée : purge locale et retour à l'écran de connexion
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginCall = String(error.config?.url || '').includes('/auth/admin/login');
    if (error.response?.status === 401 && !isLoginCall && localStorage.getItem('jumelles_token')) {
      localStorage.removeItem('jumelles_token');
      localStorage.removeItem('jumelles_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

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

