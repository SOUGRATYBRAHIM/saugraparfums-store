import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, ImagePlus } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/admin/AdminLayout'
import { productService, categoryService } from '../../services'
import { formatPrice } from '../../utils'

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', category_id: '', image: null }

export default function AdminProducts() {
  const [products, setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)
  const [editing, setEditing]     = useState(null) // null = create, object = edit
  const [form, setForm]           = useState(EMPTY_FORM)
  const [preview, setPreview]     = useState(null)
  const [saving, setSaving]       = useState(false)
  const fileRef = useRef()

  const load = () => {
    setLoading(true)
    Promise.all([productService.getAll(), categoryService.getAll()])
      .then(([p, c]) => {
        setProducts(p.data.data || [])
        setCategories(c.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setPreview(null)
    setModal(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setForm({
      name:        product.name,
      description: product.description,
      price:       product.price,
      stock:       product.stock,
      category_id: product.category?.id || '',
      image:       null,
    })
    setPreview(product.image_url)
    setModal(true)
  }

  const set = (f) => (e) => setForm(v => ({ ...v, [f]: e.target.value }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm(v => ({ ...v, image: file }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Build FormData for file upload
      const fd = new FormData()
      fd.append('name',        form.name)
      fd.append('description', form.description)
      fd.append('price',       form.price)
      fd.append('stock',       form.stock)
      fd.append('category_id', form.category_id)
      if (form.image) fd.append('image', form.image)

      if (editing) {
        await productService.update(editing.id, fd)
        toast.success('Product updated')
      } else {
        await productService.create(fd)
        toast.success('Product created')
      }
      setModal(false)
      load()
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).flat().forEach(msg => toast.error(msg))
      } else {
        toast.error('Something went wrong')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    try {
      await productService.delete(product.id)
      toast.success('Product deleted')
      load()
    } catch {
      toast.error('Could not delete product')
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-label text-gold mb-1">Inventory</p>
            <h1 className="font-display text-4xl font-light">Products</h1>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={14} />
            New Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-cream-dark overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-cream-dark bg-cream/50">
                  {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs tracking-wider text-obsidian/40 uppercase font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-14 bg-cream-dark flex-shrink-0 overflow-hidden">
                          {p.image_url
                            ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center">
                                <span className="font-display text-obsidian/10">S</span>
                              </div>
                          }
                        </div>
                        <div>
                          <p className="font-medium text-obsidian">{p.name}</p>
                          <p className="text-xs text-obsidian/40 mt-0.5 line-clamp-1 max-w-[200px]">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-obsidian/60">{p.category?.name || '—'}</td>
                    <td className="px-6 py-4 font-medium">{formatPrice(p.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${p.stock <= 5 ? 'text-red-500' : 'text-obsidian'}`}>
                        {p.stock}
                        {p.stock <= 5 && <span className="text-xs text-red-400 ml-1">Low</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)}
                          className="p-2 hover:text-gold transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p)}
                          className="p-2 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Create/Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-obsidian/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-dark">
              <h2 className="font-display text-2xl font-light">
                {editing ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => setModal(false)} className="hover:text-gold transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">

              {/* Image upload */}
              <div>
                <label className="section-label text-obsidian/50 mb-2 block">Product Image</label>
                <div
                  onClick={() => fileRef.current.click()}
                  className="cursor-pointer border-2 border-dashed border-cream-dark hover:border-gold
                             transition-colors aspect-[4/3] flex items-center justify-center overflow-hidden"
                >
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-obsidian/30">
                      <ImagePlus size={32} className="mx-auto mb-2" strokeWidth={1} />
                      <p className="text-xs font-body">Click to upload</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div>
                <label className="section-label text-obsidian/50 mb-2 block">Name *</label>
                <input type="text" value={form.name} onChange={set('name')} required className="input-luxury" />
              </div>

              {/* Description */}
              <div>
                <label className="section-label text-obsidian/50 mb-2 block">Description *</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={3}
                  required
                  className="input-luxury resize-none"
                />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="section-label text-obsidian/50 mb-2 block">Price (MAD) *</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required className="input-luxury" />
                </div>
                <div>
                  <label className="section-label text-obsidian/50 mb-2 block">Stock *</label>
                  <input type="number" min="0" value={form.stock} onChange={set('stock')} required className="input-luxury" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="section-label text-obsidian/50 mb-2 block">Category *</label>
                <select value={form.category_id} onChange={set('category_id')} required className="input-luxury cursor-pointer">
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving && <span className="w-3 h-3 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />}
                  {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
