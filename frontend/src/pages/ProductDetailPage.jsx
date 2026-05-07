import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import StoreLayout from '../components/layout/StoreLayout'
import Skeleton from '../components/ui/Skeleton'
import { productService } from '../services'
import { useCart } from '../store/CartContext'
import { formatPrice } from '../utils'

export default function ProductDetailPage() {
  const { id }           = useParams()
  const { addToCart }    = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQty]    = useState(1)
  const [adding, setAdding]   = useState(false)

  useEffect(() => {
    setLoading(true)
    productService.getById(id)
      .then(res => setProduct(res.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = async () => {
    setAdding(true)
    try {
      await addToCart(product.id, quantity)
      toast.success(`${product.name} added to cart`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart')
    } finally {
      setAdding(false)
    }
  }

  return (
    <StoreLayout>
      <div className="max-w-8xl mx-auto px-6 lg:px-12 py-16">

        {/* Back link */}
        <Link to="/products"
          className="inline-flex items-center gap-2 section-label text-obsidian/50 hover:text-obsidian mb-12 transition-colors">
          <ArrowLeft size={12} />
          Back to Collection
        </Link>

        {loading ? (
          /* ── Loading skeleton ── */
          <div className="grid md:grid-cols-2 gap-16">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        ) : product ? (
          /* ── Product detail ── */
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="aspect-square bg-cream-dark overflow-hidden"
            >
              {product.image_url ? (
                <img src={product.image_url} alt={product.name}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-9xl text-obsidian/5">S</span>
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col justify-center"
            >
              <p className="section-label text-gold mb-3">{product.category?.name}</p>

              <h1 className="font-display text-5xl md:text-6xl font-light text-obsidian leading-none mb-6">
                {product.name}
              </h1>

              <div className="w-12 h-px bg-gold mb-6" />

              <p className="font-display text-3xl font-light text-obsidian mb-8">
                {formatPrice(product.price)}
              </p>

              <p className="font-body font-light text-obsidian/70 leading-relaxed mb-10 text-sm">
                {product.description}
              </p>

              {/* Stock status */}
              <p className={`section-label mb-6 ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
                {product.in_stock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </p>

              {product.in_stock && (
                <>
                  {/* Quantity selector */}
                  <div className="flex items-center gap-0 mb-6 w-fit border border-obsidian/20">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-cream-dark transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 h-12 flex items-center justify-center font-body text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-cream-dark transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="btn-primary flex items-center justify-center gap-3 w-full md:w-auto"
                  >
                    {adding ? (
                      <span className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                    ) : (
                      <ShoppingBag size={16} strokeWidth={1.5} />
                    )}
                    {adding ? 'Adding...' : 'Add to Cart'}
                  </button>
                </>
              )}

              {/* Shipping note */}
              <p className="font-body text-xs text-obsidian/40 mt-6 tracking-wide">
                Free shipping on orders over 500 MAD · Cash on delivery available
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-display text-3xl text-obsidian/30">Product not found</p>
            <Link to="/products" className="btn-ghost mt-8 inline-block">Back to Collection</Link>
          </div>
        )}
      </div>
    </StoreLayout>
  )
}
