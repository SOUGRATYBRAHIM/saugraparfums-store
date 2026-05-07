import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '../../store/CartContext'
import { formatPrice } from '../../utils'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart()

  const handleAdd = async (e) => {
    e.preventDefault() // Don't navigate to product page
    try {
      await addToCart(product.id, 1)
      toast.success(`${product.name} added to cart`)
    } catch {
      toast.error('Could not add to cart')
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/products/${product.id}`} className="block">

        {/* Image */}
        <div className="relative overflow-hidden bg-cream-dark aspect-[3/4] mb-4">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            /* Placeholder when no image */
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-4xl text-obsidian/10">S</span>
            </div>
          )}

          {/* Out of stock overlay */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-cream/70 flex items-center justify-center">
              <span className="section-label text-obsidian/50">Out of Stock</span>
            </div>
          )}

          {/* Quick add button — appears on hover */}
          {product.in_stock && (
            <button
              onClick={handleAdd}
              disabled={loading}
              className="absolute bottom-0 left-0 right-0 bg-obsidian text-cream
                         py-3 flex items-center justify-center gap-2
                         translate-y-full group-hover:translate-y-0
                         transition-transform duration-300 font-body text-xs tracking-widest uppercase"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              Add to Cart
            </button>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <p className="text-[11px] tracking-wider text-gold/80 uppercase font-body">
            {product.category?.name}
          </p>
          <h3 className="font-display text-lg font-light text-obsidian leading-tight">
            {product.name}
          </h3>
          <p className="font-body text-sm text-obsidian/70">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
