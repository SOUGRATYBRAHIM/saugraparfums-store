import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import StoreLayout from '../components/layout/StoreLayout'
import ProductCard from '../components/product/ProductCard'
import { ProductCardSkeleton } from '../components/ui/Skeleton'
import { useProducts } from '../hooks/useProducts'

// ─── Fade-up animation variant ────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.12 } },
}

// ─── Testimonials data ────────────────────────────────────────────
const testimonials = [
  { name: 'Leila M.',   text: 'The most refined oud I have ever experienced. Saugra is something else entirely.' },
  { name: 'Youssef K.', text: 'Elegant packaging, extraordinary scent. I receive compliments every day.' },
  { name: 'Nadia R.',   text: 'Finally, a Moroccan perfume brand that competes with the great French houses.' },
]

export default function HomePage() {
  const { products, loading } = useProducts({ per_page: 4 })

  return (
    <StoreLayout>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-obsidian">

        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #C9A84C 0%, transparent 60%)' }}
        />

        <div className="relative z-10 max-w-8xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-2xl">

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="section-label text-gold mb-6"
            >
              Maison de Parfums · Maroc
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
              className="font-display text-cream text-6xl md:text-8xl font-light leading-none mb-8"
            >
              The Art of<br />
              <em className="text-gold">Scent.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="font-body font-light text-cream/60 text-lg leading-relaxed mb-12 max-w-md"
            >
              Rare fragrances drawn from the soul of Morocco.
              Crafted for those who refuse the ordinary.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/products" className="btn-primary bg-gold text-obsidian hover:bg-cream inline-flex items-center gap-3">
                Explore Collection
                <ArrowRight size={14} />
              </Link>
              <Link to="/#about" className="btn-ghost border-cream/30 text-cream hover:bg-cream/10 hover:text-cream">
                Our Story
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative gold line */}
        <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-center gap-4">
          <div className="w-px h-20 bg-gold/40" />
          <span className="section-label text-gold/40 rotate-90 origin-center translate-y-8">Scroll</span>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────── */}
      <section className="max-w-8xl mx-auto px-6 lg:px-12 py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <p className="section-label text-gold mb-3">New Arrivals</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-obsidian">
            Featured Fragrances
          </h2>
          <span className="gold-line" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {loading
            ? Array(4).fill(0).map((_, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <ProductCardSkeleton />
                </motion.div>
              ))
            : products.map(p => (
                <motion.div key={p.id} variants={fadeUp}>
                  <ProductCard product={p} />
                </motion.div>
              ))
          }
        </motion.div>

        <div className="text-center mt-14">
          <Link to="/products" className="btn-ghost inline-flex items-center gap-3">
            View All
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── ABOUT STRIP ───────────────────────────────────────────── */}
      <section id="about" className="bg-obsidian py-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <p className="section-label text-gold mb-4">Notre Maison</p>
              <h2 className="font-display text-cream text-4xl md:text-5xl font-light leading-tight mb-6">
                Rooted in Moroccan<br />
                <em className="text-gold">Heritage.</em>
              </h2>
              <p className="font-body font-light text-cream/60 leading-relaxed mb-8">
                Saugra Parfums was born from a passion for rare, authentic fragrances.
                We source the finest oud, rose, and amber from across the Arab world,
                transforming them into compositions that transcend time.
              </p>
              <Link to="/products" className="btn-primary bg-gold text-obsidian hover:bg-cream inline-flex items-center gap-3">
                Discover More
                <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 gap-8"
            >
              {[
                { n: '100+', label: 'Unique Formulas'   },
                { n: '5★',   label: 'Customer Rating'   },
                { n: '24h',  label: 'Express Delivery'  },
                { n: '100%', label: 'Authentic Oud'     },
              ].map(stat => (
                <motion.div key={stat.label} variants={fadeUp} className="border border-cream/10 p-8">
                  <p className="font-display text-gold text-5xl font-light mb-2">{stat.n}</p>
                  <p className="section-label text-cream/40">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-24 bg-cream-dark">
        <div className="max-w-8xl mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="section-label text-gold mb-3">Testimonials</p>
            <h2 className="font-display text-4xl font-light">What They Say</h2>
            <span className="gold-line" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map(t => (
              <motion.div key={t.name} variants={fadeUp} className="bg-cream p-8 border border-cream-dark">
                <p className="font-display text-lg font-light italic text-obsidian/80 leading-relaxed mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-gold" />
                  <span className="section-label text-obsidian/50">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────── */}
      <section className="py-20 bg-gold">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center"
        >
          <h2 className="font-display text-obsidian text-4xl md:text-5xl font-light mb-6">
            Find Your Signature Scent
          </h2>
          <Link to="/products" className="btn-primary bg-obsidian text-cream hover:bg-obsidian/80 inline-flex items-center gap-3">
            Shop Now
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>

    </StoreLayout>
  )
}
