import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartService } from '../services'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart]       = useState({ items: [], total: 0, count: 0 })
  const [loading, setLoading] = useState(false)

  // Fetch cart from Laravel session
  const fetchCart = useCallback(async () => {
    try {
      const res = await cartService.get()
      setCart(res.data)
    } catch {
      // Session not found or empty — keep default
    }
  }, [])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true)
    try {
      await cartService.add(productId, quantity)
      await fetchCart() // Refresh cart from server
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    await cartService.updateQuantity(productId, quantity)
    await fetchCart()
  }

  const removeItem = async (productId) => {
    await cartService.remove(productId)
    await fetchCart()
  }

  const clearCart = () => setCart({ items: [], total: 0, count: 0 })

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
