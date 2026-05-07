import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import { CartProvider } from './store/CartContext'
import ProtectedRoute from './components/ui/ProtectedRoute'

// ── Lazy load pages for performance (code splitting) ──────────────
const HomePage          = lazy(() => import('./pages/HomePage'))
const ProductsPage      = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CartPage          = lazy(() => import('./pages/CartPage'))
const CheckoutPage      = lazy(() => import('./pages/CheckoutPage'))
const OrderSuccessPage  = lazy(() => import('./pages/OrderSuccessPage'))
const AdminLoginPage    = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts     = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders       = lazy(() => import('./pages/admin/AdminOrders'))

// Simple full-screen loader shown while chunks load
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream">
    <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>

              {/* ── Public store ─────────────────────────────── */}
              <Route path="/"              element={<HomePage />} />
              <Route path="/products"      element={<ProductsPage />} />
              <Route path="/products/:id"  element={<ProductDetailPage />} />
              <Route path="/cart"          element={<CartPage />} />
              <Route path="/checkout"      element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />

              {/* ── Admin auth ───────────────────────────────── */}
              <Route path="/admin/login"   element={<AdminLoginPage />} />

              {/* ── Admin protected ──────────────────────────── */}
              <Route path="/admin" element={
                <ProtectedRoute><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute><AdminProducts /></ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute><AdminOrders /></ProtectedRoute>
              } />

            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
