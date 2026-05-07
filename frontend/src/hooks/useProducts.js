import { useState, useEffect } from 'react'
import { productService } from '../services'

/**
 * Fetches paginated products from the API.
 * Supports category filter and sorting.
 */
export function useProducts(params = {}) {
  const [products, setProducts] = useState([])
  const [meta, setMeta]         = useState(null) // pagination info
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    productService.getAll(params)
      .then(res => {
        setProducts(res.data.data)
        setMeta(res.data.meta || res.data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])

  return { products, meta, loading, error }
}
