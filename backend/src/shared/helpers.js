export function slugify(name) {
  return name.toLowerCase().replaceAll('"', '').replaceAll('&', 'and').replaceAll(' ', '-')
}

export function moneyToNumber(value = '') {
  return Number(String(value).replace(/[^\d]/g, '')) || 0
}

export function numberToMoney(value) {
  return `₦${Number(value || 0).toLocaleString('en-NG')}`
}
