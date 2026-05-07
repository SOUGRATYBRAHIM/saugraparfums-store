import { useState, useEffect } from 'react'
import { Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import { orderService } from '../../services'
import { formatPrice, statusConfig } from '../../utils'

const STATUS_OPTIONS = ['pending', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail]   = useState(null) // order being viewed
  const [updating, setUpdating] = useState(null) // order id being updated

  const load = () => {
    setLoading(true)
    orderService.getAll()
      .then(res => setOrders(res.data.data || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await orderService.updateStatus(orderId, status)
      toast.success('Status updated')
      load()
      // If viewing this order, close detail panel
      if (detail?.id === orderId) setDetail(null)
    } catch {
      toast.error('Could not update status')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <p className="section-label text-gold mb-1">Management</p>
          <h1 className="font-display text-4xl font-light">Orders</h1>
        </div>

        <div className="bg-white border border-cream-dark overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-obsidian/30 font-display text-2xl font-light">
              No orders yet
            </div>
          ) : (
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-cream-dark bg-cream/50">
                  {['#', 'Customer', 'City', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs tracking-wider text-obsidian/40 uppercase font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-4 py-4 text-obsidian/40 font-mono text-xs">#{order.id}</td>
                    <td className="px-4 py-4 font-medium">{order.full_name}</td>
                    <td className="px-4 py-4 text-obsidian/60">{order.city || '—'}</td>
                    <td className="px-4 py-4 font-medium">{formatPrice(order.total_price)}</td>
                    <td className="px-4 py-4 uppercase text-xs text-obsidian/50">{order.payment_method}</td>
                    <td className="px-4 py-4">
                      {/* Inline status selector */}
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={`text-xs px-2 py-1 rounded border-0 cursor-pointer font-medium
                          focus:outline-none ${statusConfig[order.status]?.color}`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{statusConfig[s].label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-obsidian/40 text-xs">
                      {order.created_at?.slice(0, 10)}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setDetail(order)}
                        className="p-2 hover:text-gold transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Order Detail Panel ── */}
      {detail && (
        <div className="fixed inset-0 bg-obsidian/60 z-50 flex items-start justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-dark sticky top-0 bg-white z-10">
              <h2 className="font-display text-2xl font-light">Order #{detail.id}</h2>
              <button onClick={() => setDetail(null)} className="hover:text-gold transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 font-body text-sm">

              {/* Customer info */}
              <div>
                <p className="section-label text-gold mb-3">Customer</p>
                <div className="space-y-2 text-obsidian/70">
                  <p><span className="text-obsidian font-medium">Name:</span> {detail.full_name}</p>
                  <p><span className="text-obsidian font-medium">Phone:</span> {detail.phone}</p>
                  <p><span className="text-obsidian font-medium">City:</span> {detail.city || '—'}</p>
                  <p><span className="text-obsidian font-medium">Address:</span> {detail.address}</p>
                  {detail.notes && (
                    <p><span className="text-obsidian font-medium">Notes:</span> {detail.notes}</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="section-label text-gold mb-3">Items</p>
                <div className="space-y-3">
                  {detail.items?.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.product_name}
                          className="w-12 h-14 object-cover bg-cream-dark flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-14 bg-cream-dark flex-shrink-0 flex items-center justify-center">
                          <span className="font-display text-obsidian/10">S</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-obsidian">{item.product_name}</p>
                        <p className="text-obsidian/50 text-xs">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="font-medium">{formatPrice(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total + payment */}
              <div className="border-t border-cream-dark pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-obsidian/50">Payment</span>
                  <span className="uppercase text-xs font-medium">{detail.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-obsidian/50">Total</span>
                  <span className="font-display text-gold text-xl">{formatPrice(detail.total_price)}</span>
                </div>
              </div>

              {/* Update status */}
              <div>
                <p className="section-label text-gold mb-3">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(detail.id, s)}
                      disabled={detail.status === s || updating === detail.id}
                      className={`py-2 px-3 text-xs tracking-wider uppercase font-body border transition-all duration-200
                        ${detail.status === s
                          ? 'bg-obsidian text-cream border-obsidian cursor-default'
                          : 'border-cream-dark text-obsidian/60 hover:border-obsidian hover:text-obsidian'
                        }`}
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
