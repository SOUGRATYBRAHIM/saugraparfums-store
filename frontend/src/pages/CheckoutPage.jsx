import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import StoreLayout from '../components/layout/StoreLayout'
import { useCart } from '../store/CartContext'
import { orderService } from '../services'
import { formatPrice } from '../utils'

const CITIES = [
  'Casablanca','Rabat','Fès','Marrakech','Tanger','Agadir',
  'Meknès','Oujda','Kénitra','Tétouan','Safi','El Jadida',
]

export default function CheckoutPage() {
  const navigate    = useNavigate()
  const { cart, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    full_name:      '',
    phone:          '',
    address:        '',
    city:           '',
    notes:          '',
    payment_method: 'cod',
  })

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cart.items.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    setLoading(true)
    try {
      const res = await orderService.checkout(form)
      clearCart()
      navigate('/order-success', { state: { order: res.data.order } })
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <StoreLayout>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">

        <Link to="/cart"
          className="inline-flex items-center gap-2 section-label text-obsidian/50 hover:text-obsidian mb-12 transition-colors">
          <ArrowLeft size={12} />
          Back to Cart
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">

          {/* ── Form ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-label text-gold mb-3">Delivery Details</p>
            <h1 className="font-display text-4xl font-light mb-10">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Full name */}
              <div>
                <label className="section-label text-obsidian/50 mb-2 block">Full Name *</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={set('full_name')}
                  placeholder="Your name"
                  required
                  className="input-luxury"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="section-label text-obsidian/50 mb-2 block">Phone Number *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+212 6XX XXX XXX"
                  required
                  className="input-luxury"
                />
              </div>

              {/* City */}
              <div>
                <label className="section-label text-obsidian/50 mb-2 block">City *</label>
                <select
                  value={form.city}
                  onChange={set('city')}
                  required
                  className="input-luxury cursor-pointer"
                >
                  <option value="">Select your city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="section-label text-obsidian/50 mb-2 block">Address *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={set('address')}
                  placeholder="Street, neighbourhood, building..."
                  required
                  className="input-luxury"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="section-label text-obsidian/50 mb-2 block">Delivery Notes</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={set('notes')}
                  placeholder="Floor, landmark, instructions..."
                  className="input-luxury"
                />
              </div>

              {/* Payment method */}
              <div>
                <label className="section-label text-obsidian/50 mb-4 block">Payment Method *</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'cod',    label: 'Cash on Delivery', desc: 'Pay when you receive' },
                    { value: 'online', label: 'Online Payment',   desc: 'Card / Transfer'       },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer border p-4 transition-all duration-200
                        ${form.payment_method === opt.value
                          ? 'border-obsidian bg-obsidian text-cream'
                          : 'border-cream-dark hover:border-obsidian/40'
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.value}
                        checked={form.payment_method === opt.value}
                        onChange={set('payment_method')}
                        className="sr-only"
                      />
                      <p className="font-body text-sm font-medium mb-1">{opt.label}</p>
                      <p className={`text-xs font-light ${form.payment_method === opt.value ? 'text-cream/60' : 'text-obsidian/40'}`}>
                        {opt.desc}
                      </p>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-3 mt-4"
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                  : null
                }
                {loading ? 'Placing Order...' : `Place Order · ${formatPrice(cart.total)}`}
              </button>
            </form>
          </motion.div>

          {/* ── Order recap ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-label text-gold mb-3">Your Order</p>
            <h2 className="font-display text-4xl font-light mb-10">Summary</h2>

            <div className="space-y-4 divide-y divide-cream-dark">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                  <div className="w-16 h-20 bg-cream-dark flex-shrink-0 overflow-hidden">
                    {item.product.image_url
                      ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-xl text-obsidian/10">S</span>
                        </div>
                    }
                  </div>
                  <div className="flex-1 flex justify-between items-start">
                    <div>
                      <p className="font-display text-lg font-light">{item.product.name}</p>
                      <p className="font-body text-sm text-obsidian/40">× {item.quantity}</p>
                    </div>
                    <p className="font-body text-sm">{formatPrice(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-obsidian/10 mt-8 pt-6 flex justify-between items-center">
              <span className="section-label text-obsidian/50">Total</span>
              <span className="font-display text-3xl text-gold">{formatPrice(cart.total)}</span>
            </div>

            <div className="mt-8 p-5 bg-cream-dark text-xs font-body text-obsidian/50 leading-relaxed">
              🔒 Your order is secure. No account needed — we only store your delivery info.
              Cash on delivery available nationwide.
            </div>
          </motion.div>
        </div>
      </div>
    </StoreLayout>
  )
}
