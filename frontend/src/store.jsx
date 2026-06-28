import { useEffect, useMemo, useState } from 'react'
import { api } from './api'
import { getProductById, productSlug } from './productData'
import { StoreContext } from './storeContext'
import { useAuth } from './useAuth'

const CART_KEY = 'shopnova-cart'
const WISHLIST_KEY = 'shopnova-wishlist'

function readStorage(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : fallback
  } catch {
    return fallback
  }
}

function moneyToNumber(value = '') {
  return Number(String(value).replace(/[^\d]/g, '')) || 0
}

function numberToMoney(value) {
  return `₦${value.toLocaleString('en-NG')}`
}

function normalizeProduct(productInput) {
  if (typeof productInput === 'string') return getProductById(productInput)
  if (Array.isArray(productInput)) return getProductById(productSlug(productInput[0]))
  if (productInput?.id) return {
    ...getProductById(productInput.id),
    ...productInput,
  }
  return getProductById(productSlug(productInput?.name || 'iPhone 15 Pro Max 256GB'))
}

function cartKey(productId, options = {}) {
  return `${productId}:${Object.entries(options)
    .map(([key, value]) => `${key}-${value}`)
    .join('|')}`
}

export function StoreProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [cartItems, setCartItems] = useState(() => readStorage(CART_KEY, []))
  const [wishlistItems, setWishlistItems] = useState(() => readStorage(WISHLIST_KEY, []))
  const [storeLoading, setStoreLoading] = useState(false)
  const [storeError, setStoreError] = useState('')
  const [remoteLoaded, setRemoteLoaded] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      setRemoteLoaded(false)
      return
    }

    let cancelled = false
    setStoreLoading(true)
    setStoreError('')

    Promise.all([api.cart(), api.wishlist()])
      .then(async ([cartData, wishlistData]) => {
        if (cancelled) return

        const wishlistProducts = await Promise.all((wishlistData.wishlist || []).map(async (productId) => {
          try {
            return (await api.product(productId)).product
          } catch {
            return getProductById(productId)
          }
        }))

        setCartItems(cartData.cart || [])
        setWishlistItems(wishlistProducts)
        setRemoteLoaded(true)
      })
      .catch((error) => setStoreError(error.message))
      .finally(() => {
        if (!cancelled) setStoreLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isLoggedIn])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
    if (isLoggedIn && remoteLoaded) {
      api.saveCart(cartItems).catch((error) => setStoreError(error.message))
    }
  }, [cartItems, isLoggedIn, remoteLoaded])

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToCart = (productInput, options = {}, quantity = 1) => {
    const product = normalizeProduct(productInput)
    const key = cartKey(product.id, options)

    setCartItems((items) => {
      const existingItem = items.find((item) => item.key === key)
      if (existingItem) {
        return items.map((item) => (
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        ))
      }

      return [
        ...items,
        {
          key,
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          options,
          quantity,
        },
      ]
    })
  }

  const updateCartQuantity = (key, nextQuantity) => {
    if (nextQuantity <= 0) {
      setCartItems((items) => items.filter((item) => item.key !== key))
      return
    }

    setCartItems((items) => items.map((item) => (
      item.key === key ? { ...item, quantity: nextQuantity } : item
    )))
  }

  const removeFromCart = (key) => {
    setCartItems((items) => items.filter((item) => item.key !== key))
  }

  const clearCart = () => setCartItems([])

  const toggleWishlist = (productInput) => {
    const product = normalizeProduct(productInput)
    const exists = wishlistItems.some((item) => item.id === product.id)

    if (exists) {
      setWishlistItems((items) => items.filter((item) => item.id !== product.id))
      if (isLoggedIn) api.removeWishlist(product.id).catch((error) => setStoreError(error.message))
      return false
    }

    setWishlistItems((items) => [
      ...items,
      {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        oldPrice: product.oldPrice,
        discount: product.discount,
        image: product.image,
      },
    ])
    if (isLoggedIn) api.addWishlist(product.id).catch((error) => setStoreError(error.message))
    return true
  }

  const removeFromWishlist = (id) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id))
    if (isLoggedIn) api.removeWishlist(id).catch((error) => setStoreError(error.message))
  }

  const cartSummary = useMemo(() => {
    const subtotal = cartItems.reduce((total, item) => total + moneyToNumber(item.price) * item.quantity, 0)
    const discount = subtotal > 0 ? Math.min(45000, Math.round(subtotal * 0.03)) : 0
    const deliveryFee = subtotal > 0 ? 2500 : 0
    const total = subtotal - discount + deliveryFee

    return {
      count: cartItems.reduce((total, item) => total + item.quantity, 0),
      subtotal,
      discount,
      deliveryFee,
      total,
      formattedSubtotal: numberToMoney(subtotal),
      formattedDiscount: `-${numberToMoney(discount)}`,
      formattedDeliveryFee: numberToMoney(deliveryFee),
      formattedTotal: numberToMoney(total),
    }
  }, [cartItems])

  const value = {
    cartItems,
    wishlistItems,
    cartSummary,
    storeError,
    storeLoading,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    removeFromWishlist,
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}
