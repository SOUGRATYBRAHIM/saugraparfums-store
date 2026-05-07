import { useState, useEffect } from 'react'
import { Package, ShoppingCart, TrendingUp, Clock } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, CartesianGrid,
} from 'recharts'
import AdminLayout from '../../components/admin/AdminLayout'
import { orderService, productService } from '../../services'
import { formatPrice, statusConfig } from '../../utils'

export default function AdminDashboard() {
  const [orders, setOrders]     = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      orderService.getAll(),
      productService.getAll(),
    ]).then(([ord, prod]) => {
      setOrders(ord.data.data  || [])
      setProducts(prod.data.data || [])
    }).finally(() => setLoading(false))
  }, [])

  // ── Derived stats ──────────────────────────────────────────────
  const totalRevenue  = orders.reduce((s, o) => s + parseFloat(o.total_price), 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const lowStock      = products.filter(p => p.stock <= 5).length

  // ── Revenue per day (last 7) ───────────────────────────────────
  const revenueByDay = (() => {
    const map = {}
    orders.forEach(o => {
      const day = o.created_at?.slice(0, 10)
      if (day) map[day] = (map[day] || 0) + parseFloat(o.total_price)
    })
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([date, total]) => ({ date: date.slice(5), total }))
  })()

  // ── Orders by status ──────────────────────────────────────────
  const statusData = ['pending','shipped','delivered','cancelled'].map(s => ({
    status: s,
    count: orders.filter(o => o.status === s).length,
  }))

  const StatCard = ({ icon: Icon, label, value, sub, color = 'text-gold' }) => (
    <div className="bg-white border border-cream-dark p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded ${color === 'text-gold' ? 'bg-gold/10' : 'bg-red-50'}`}>
          <Icon size={18} className={color} strokeWidth={1.5} />
        </div>
      </div>
      <p className="font-display text-3xl font-light text-obsidian mb-1">{value}</p>
      <p className="font-body text-sm text-obsidian/50">{label}</p>
      {sub && <p className="font-body text-xs text-obsidian/30 mt-1">{sub}</p>}
    </div>
  )

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <p className="section-label text-gold mb-1">Overview</p>
          <h1 className="font-display text-4xl font-light text-obsidian">Dashboard</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={ShoppingCart} label="Total Orders"   value={orders.length} />
              <StatCard icon={TrendingUp}   label="Total Revenue"  value={formatPrice(totalRevenue)} />
              <StatCard icon={Clock}        label="Pending Orders" value={pendingOrders} />
              <StatCard icon={Package}      label="Low Stock Items" value={lowStock}
                color={lowStock > 0 ? 'text-red-500' : 'text-gold'} />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">

              {/* Revenue chart */}
              <div className="bg-white border border-cream-dark p-6">
                <h2 className="font-display text-xl font-light text-obsidian mb-6">Revenue (Last 7 Days)</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE0" />
                    <XAxis dataKey="date" tick={{ fontFamily: 'Jost', fontSize: 11 }} />
                    <YAxis tick={{ fontFamily: 'Jost', fontSize: 11 }} />
                    <Tooltip
                      formatter={(v) => [formatPrice(v), 'Revenue']}
                      contentStyle={{ fontFamily: 'Jost', fontSize: 12, border: '1px solid #F0EAE0' }}
                    />
                    <Line type="monotone" dataKey="total" stroke="#C9A84C" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Orders by status */}
              <div className="bg-white border border-cream-dark p-6">
                <h2 className="font-display text-xl font-light text-obsidian mb-6">Orders by Status</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE0" />
                    <XAxis dataKey="status" tick={{ fontFamily: 'Jost', fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontFamily: 'Jost', fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontFamily: 'Jost', fontSize: 12, border: '1px solid #F0EAE0' }} />
                    <Bar dataKey="count" fill="#C9A84C" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent orders table */}
            <div className="bg-white border border-cream-dark">
              <div className="px-6 py-4 border-b border-cream-dark">
                <h2 className="font-display text-xl font-light">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full font-body text-sm">
                  <thead>
                    <tr className="border-b border-cream-dark">
                      {['#', 'Customer', 'City', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs tracking-wider text-obsidian/40 uppercase font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-dark">
                    {orders.slice(0, 8).map(o => (
                      <tr key={o.id} className="hover:bg-cream/50 transition-colors">
                        <td className="px-6 py-4 text-obsidian/50">#{o.id}</td>
                        <td className="px-6 py-4 font-medium">{o.full_name}</td>
                        <td className="px-6 py-4 text-obsidian/60">{o.city || '—'}</td>
                        <td className="px-6 py-4">{formatPrice(o.total_price)}</td>
                        <td className="px-6 py-4 uppercase text-xs text-obsidian/50">{o.payment_method}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig[o.status]?.color}`}>
                            {statusConfig[o.status]?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-obsidian/40 text-xs">{o.created_at?.slice(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
