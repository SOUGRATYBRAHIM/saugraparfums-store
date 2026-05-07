import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '../../store/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { cart }        = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/products', label: 'Collection' },
    { to: '/#about',   label: 'Maison'     },
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-8xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-light tracking-[0.15em] text-obsidian">
            SAUGRA
            <span className="text-gold ml-1">·</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className="section-label text-obsidian/60 hover:text-obsidian transition-colors duration-200"
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:text-gold transition-colors duration-200">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cart.count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-obsidian
                                 text-[10px] font-medium flex items-center justify-center font-body">
                  {cart.count}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setOpen(!open)} className="md:hidden p-2">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-0 right-0 z-40 bg-cream border-b border-cream-dark px-6 py-6 md:hidden"
          >
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block py-3 section-label text-obsidian/60 hover:text-obsidian"
              >
                {l.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
