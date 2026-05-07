import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '../../store/AuthContext'

export default function AdminLoginPage() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const set = (f) => (e) => setForm(v => ({ ...v, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <p className="font-display text-cream text-3xl tracking-[0.2em]">SAUGRA</p>
          <p className="section-label text-gold mt-2">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="section-label text-cream/40 mb-2 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="admin@saugra.ma"
              required
              className="w-full border-b border-cream/20 bg-transparent py-3 text-cream
                         placeholder:text-cream/20 font-body font-light text-sm
                         focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="section-label text-cream/40 mb-2 block">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              required
              className="w-full border-b border-cream/20 bg-transparent py-3 text-cream
                         placeholder:text-cream/20 font-body font-light text-sm
                         focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gold text-obsidian font-body font-medium
                       tracking-widest uppercase text-xs hover:bg-gold-light
                       transition-colors duration-300 flex items-center justify-center gap-2"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
              : 'Enter'
            }
          </button>
        </form>
      </motion.div>
    </div>
  )
}
