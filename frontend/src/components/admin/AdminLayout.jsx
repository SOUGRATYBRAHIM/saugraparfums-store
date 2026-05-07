import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products',  icon: Package},
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart},
]

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth()
  const navigate= useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="min-h-screen flex bg-cream font-body">
      <Toaster position="top-right" />

      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-cream-dark flex flex-col">

        {/* Logo */}
        <div className="px-6 py-6 border-b border-cream-dark">
          <p className="font-display text-xl text-obsidian tracking-widest">SAUGRA</p>
          <p className="section-label text-gold mt-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-6 py-5 border-t border-cream-dark">
          <p className="text-xs font-body text-obsidian/40 mb-3 truncate">{admin?.email}</p>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-obsidian/50 hover:text-red-500 transition-colors">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
