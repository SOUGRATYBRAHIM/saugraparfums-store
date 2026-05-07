import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'
import StoreLayout from '../components/layout/StoreLayout'
import { formatPrice } from '../utils'

export default function OrderSuccessPage() {
  const { state } = useLocation()
  const order     = state?.order

  return (
    <StoreLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <CheckCircle size={64} strokeWidth={1} className="text-gold" />
          </motion.div>

          <p className="section-label text-gold mb-4">Order Confirmed</p>
          <h1 className="font-display text-5xl font-light mb-4">
            Thank You
          </h1>
          <div className="w-12 h-px bg-gold mx-auto mb-6" />

          {order && (
            <div className="bg-cream-dark p-6 mb-8 text-left space-y-3">
              <div className="flex justify-between font-body text-sm">
                <span className="text-obsidian/50">Order #</span>
                <span className="font-medium">{order.id}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-obsidian/50">Name</span>
                <span>{order.full_name}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-obsidian/50">Total</span>
                <span className="text-gold font-medium">{formatPrice(order.total_price)}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-obsidian/50">Status</span>
                <span className="capitalize">{order.status}</span>
              </div>
            </div>
          )}

          <p className="font-body font-light text-obsidian/60 text-sm leading-relaxed mb-10">
            Your order has been placed successfully. Our team will contact you shortly to confirm delivery.
          </p>

          <Link to="/products" className="btn-primary inline-flex items-center gap-3">
            Continue Shopping
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </StoreLayout>
  )
}
