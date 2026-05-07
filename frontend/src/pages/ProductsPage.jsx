import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import StoreLayout from '../components/layout/StoreLayout'
import ProductCard from '../components/product/ProductCard'
import { ProductCardSkeleton } from '../components/ui/Skeleton'
import { useProducts } from '../hooks/useProducts'
import { categoryService } from '../services'

const SORT_OPTIONS = [
  { value: 'latest',      label: 'Latest'       },
  { value: 'price_asc',   label: 'Price: Low-High' },
  { value: 'price_desc',  label: 'Price: High-Low' },
]

export default function ProductsPage() {
  const [categories, setCategories]       = useState([])
  const [selectedCategory, setCategory]   = useState('')
  const [sort, setSort]                   = useState('latest')
  const [showFilters, setShowFilters]     = useState(false)
  const [page, setPage]                   = useState(1)

  // Build query params based on filters
  const params = {
    ...(selectedCategory && { category_id: selectedCategory }),
    ...(sort === 'price_asc'  && { sort: 'price', order: 'asc'  }),
    ...(sort === 'price_desc' && { sort: 'price', order: 'desc' }),
    page,
    per_page: 12,
  }

  const { products, meta, loading } = useProducts(params)

  // Load categories once
  useEffect(() => {
    categoryService.getAll().then(res => setCategories(res.data))
  }, [])

  const clearFilters = () => {
    setCategory('')
    setSort('latest')
    setPage(1)
  }

  return (
    <StoreLayout>
      <div className="max-w-8xl mx-auto px-6 lg:px-12 py-16">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-label text-gold mb-3">All Fragrances</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-obsidian">
            The Collection
          </h1>
          <span className="gold-line" />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-10 gap-4 flex-wrap">

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 section-label text-obsidian/60 hover:text-obsidian transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          {/* Active filter tags */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategory && (
              <span className="flex items-center gap-1 bg-obsidian text-cream
                               text-[11px] tracking-wider uppercase px-3 py-1.5 font-body">
                {categories.find(c => c.id == selectedCategory)?.name}
                <button onClick={() => setCategory('')} className="ml-1 hover:text-gold">
                  <X size={10} />
                </button>
              </span>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1) }}
            className="input-luxury w-auto text-sm cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 pb-10 border-b border-cream-dark"
          >
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setCategory(''); setPage(1) }}
                className={`px-4 py-2 text-xs tracking-wider uppercase font-body border transition-all duration-200
                  ${!selectedCategory
                    ? 'bg-obsidian text-cream border-obsidian'
                    : 'border-obsidian/20 text-obsidian/60 hover:border-obsidian hover:text-obsidian'
                  }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setCategory(cat.id); setPage(1) }}
                  className={`px-4 py-2 text-xs tracking-wider uppercase font-body border transition-all duration-200
                    ${selectedCategory == cat.id
                      ? 'bg-obsidian text-cream border-obsidian'
                      : 'border-obsidian/20 text-obsidian/60 hover:border-obsidian hover:text-obsidian'
                    }`}
                >
                  {cat.name}
                  <span className="ml-1 text-gold/60">({cat.products_count})</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {loading
            ? Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.length === 0
              ? (
                <div className="col-span-full text-center py-24">
                  <p className="font-display text-3xl text-obsidian/30 mb-4">No fragrances found</p>
                  <button onClick={clearFilters} className="btn-ghost">Clear Filters</button>
                </div>
              )
              : products.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))
          }
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 text-sm font-body border transition-all duration-200
                  ${page === p
                    ? 'bg-obsidian text-cream border-obsidian'
                    : 'border-cream-dark text-obsidian/50 hover:border-obsidian hover:text-obsidian'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

      </div>
    </StoreLayout>
  )
}
