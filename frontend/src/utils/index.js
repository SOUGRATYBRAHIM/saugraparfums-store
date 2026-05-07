/**
 * Format a number as Moroccan Dirham
 * e.g. 299 → "299,00 MAD"
 */
export const formatPrice = (amount) =>
  new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
  }).format(amount)

/**
 * Truncate text to a max length
 */
export const truncate = (text, max = 80) =>
  text?.length > max ? text.slice(0, max) + '…' : text

/**
 * Order status → display label + color
 */
export const statusConfig = {
  pending:   { label: 'Pending',   color: 'text-amber-600 bg-amber-50' },
  shipped:   { label: 'Shipped',   color: 'text-blue-600 bg-blue-50'   },
  delivered: { label: 'Delivered', color: 'text-green-600 bg-green-50' },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50'     },
}
