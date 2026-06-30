const LOCAL_ORDERS_KEY = 'shopnova-local-orders'

function readLocalOrders() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]')
  } catch {
    return []
  }
}

export function getLocalOrders() {
  return readLocalOrders()
}

export function getLocalOrder(id) {
  return readLocalOrders().find((order) => order.id === id) || null
}

export function saveLocalOrder(order) {
  const orders = readLocalOrders()
  const nextOrders = [order, ...orders.filter((item) => item.id !== order.id)]
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(nextOrders))
  return order
}

