import api from './api'

// ─── Products ─────────────────────────────────────────────────────
export const productService = {
  getAll:    (params) => api.get('/products', { params }),
  getById:   (id)     => api.get(`/products/${id}`),
  create:    (data)   => api.post('/admin/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:    (id, data) => api.post(`/admin/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:    (id)     => api.delete(`/admin/products/${id}`),
}

// ─── Categories ───────────────────────────────────────────────────
export const categoryService = {
  getAll:  ()     => api.get('/categories'),
  create:  (data) => api.post('/admin/categories', data),
  delete:  (id)   => api.delete(`/admin/categories/${id}`),
}

// ─── Cart ─────────────────────────────────────────────────────────
export const cartService = {
  get:            ()                   => api.get('/cart'),
  add:            (product_id, quantity) => api.post('/cart/add', { product_id, quantity }),
  updateQuantity: (productId, quantity)  => api.patch(`/cart/${productId}`, { quantity }),
  remove:         (productId)            => api.delete(`/cart/${productId}`),
}

// ─── Orders ───────────────────────────────────────────────────────
export const orderService = {
  checkout:     (data) => api.post('/orders', data),
  getAll:       ()     => api.get('/admin/orders'),
  getById:      (id)   => api.get(`/admin/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
}

// ─── Auth ─────────────────────────────────────────────────────────
export const authService = {
  login: (email, password) => api.post('/admin/login', { email, password }),
    
  logout:()=> api.post('/admin/logout'),
  me:()=> api.get('/admin/me'),
}
