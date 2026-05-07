import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-obsidian text-cream/60 font-body">
      <div className="max-w-8xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <p className="font-display text-2xl text-cream font-light tracking-[0.15em] mb-4">
              SAUGRA <span className="text-gold">·</span>
            </p>
            <p className="text-sm leading-relaxed font-light">
              Rare fragrances crafted from the finest raw materials.
              Each bottle holds a story.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="section-label text-gold mb-4">Navigation</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/"         className="hover:text-cream transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-cream transition-colors">Collection</Link></li>
              <li><Link to="/cart"     className="hover:text-cream transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="section-label text-gold mb-4">Contact</p>
            <ul className="space-y-2 text-sm font-light">
              <li>contact@saugra.ma</li>
              <li>+212 6XX XXX XXX</li>
              <li>Casablanca, Maroc</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col md:flex-row
                        items-center justify-between gap-4 text-xs text-cream/30">
          <p>© {new Date().getFullYear()} Saugra Parfums. All rights reserved.</p>
          <p>Crafted with care · Delivered to your door</p>
        </div>
      </div>
    </footer>
  )
}
