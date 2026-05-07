import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import StoreLayout from '../components/layout/StoreLayout'
import { useCart } from '../store/CartContext'
import { formatPrice } from '../utils'

export default function CartPage() {
  const { cart, updateQuantity, removeItem } = useCart()

  const handleQty = async (productId, qty) => {
    if (qty < 1) return
    try {
      await updateQuantity(productId, qty)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update quantity')
    }
  }

  const handleRemove = async (productId, name) => {
    try {
      await removeItem(productId)
      toast.success(`${name} removed`)
    } catch {
      toast.error('Could not remove item')
    }
  }

  if (cart.items.length === 0) {
    return (
      <StoreLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6">
          <ShoppingBag size={48} strokeWidth={1} className="text-obsidian/20" />
          <p className="font-display text-3xl font-light text-obsidian/50">Your cart is empty</p>
          <Link to="/products" className="btn-primary">Explore Collection</Link>
        </div>
      </StoreLayout>
    )
  }

  return (
    <StoreLayout>
      <div className="max-w-8xl mx-auto px-6 lg:px-12 py-16">

        <div className="mb-12">
          <p className="section-label text-gold mb-3">Your Selection</p>
          <h1 className="font-display text-5xl font-light">Shopping Cart</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">

          {/* ── Items ── */}
          <div className="lg:col-span-2 space-y-0 divide-y divide-cream-dark">
            <AnimatePresence>
              {cart.items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-6 py-8"
                >
                  {/* Image */}
                  <Link to={`/products/${item.product.id}`} className="flex-shrink-0">
                    <div className="w-24 h-28 bg-cream-dark overflow-hidden">
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.name}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-2xl text-obsidian/10">S</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/products/${item.product.id}`}>
                        <h3 className="font-display text-xl font-light hover:text-gold transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="font-body text-sm text-obsidian/50 mt-1">
                        {formatPrice(item.product.price)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border border-obsidian/15">
                        <button
                          onClick={() => handleQty(item.product.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-cream-dark transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-9 h-9 flex items-center justify-center font-body text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQty(item.product.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-cream-dark transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-body font-medium text-obsidian">
                          {formatPrice(item.subtotal)}
                        </p>
                        <button
                          onClick={() => handleRemove(item.product.id, item.product.name)}
                          className="text-obsidian/30 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Order Summary ── */}
          <div>
            <div className="bg-obsidian p-8 sticky top-28">
              <h2 className="font-display text-cream text-2xl font-light mb-8">Order Summary</h2>

              <div className="space-y-3 mb-8 font-body text-sm">
                {cart.items.map(item => (
                  <div key={item.id} className="flex justify-between text-cream/60">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-cream/10 pt-6 mb-8">
                <div className="flex justify-between font-body">
                  <span className="text-cream/60 text-sm tracking-wider uppercase">Total</span>
                  <span className="font-display text-gold text-2xl">{formatPrice(cart.total)}</span>
                </div>
              </div>

              <Link to="/checkout" className="block">
                <button className="w-full btn-primary bg-gold text-obsidian hover:bg-cream
                                   flex items-center justify-center gap-3">
                  Proceed to Checkout
                  <ArrowRight size={14} />
                </button>
              </Link>

              <Link to="/products"
                className="block text-center mt-4 section-label text-cream/40 hover:text-cream transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
