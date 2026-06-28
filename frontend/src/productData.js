export function productSlug(name) {
  return name.toLowerCase().replaceAll('"', '').replaceAll('&', 'and').replaceAll(' ', '-')
}

const fallbackImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'

const productImages = {
  'iphone-15-pro-max-256gb': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  'tecno-camon-30': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  'iphone-14': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  'iphone-14-pro-128gb': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  'samsung-galaxy-a55': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
  'infinix-hot-40': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
  'xiaomi-redmi-note': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
  'hp-elitebook-840-g8': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  'ipad-10th-gen': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80',
  'android-tablet-10': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80',
  'oraimo-earbuds': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80',
  'bluetooth-earbuds': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80',
  'airpods-pro': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80',
  'jbl-tune-headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  'noise-smart-watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  'smart-watch-9': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  'dell-monitor-27': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
  'hisense-43-smart-tv': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80',
  'smart-tv': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80',
  'wireless-gaming-mouse': 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
  'anker-usb-c-cable': 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=900&q=80',
  'usb-c-adapter': 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=900&q=80',
  'magsafe-case': 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?auto=format&fit=crop&w=900&q=80',
  'screen-guard': 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?auto=format&fit=crop&w=900&q=80',
  'oraimo-power-bank-30000mah': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80',
  'laptop-stand': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  'led-desk-lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  'camera-lens': 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=900&q=80',
}

const productRows = [
  ['iPhone 15 Pro Max 256GB', 'Apple', '₦1,340,000', '₦1,520,000', '-12%'],
  ['HP EliteBook 840 G8', 'HP', '₦620,000', '₦710,000', '-20%'],
  ['iPhone 14 Pro 128GB', 'Apple', '₦840,000', '₦920,000', '-12%'],
  ['Tecno Camon 30', 'Tecno', '₦245,000', '₦280,000', '-20%'],
  ['iPhone 14', 'Apple', '₦780,000', '₦850,000', '-20%'],
  ['Samsung Galaxy A55', 'Samsung', '₦365,000', '₦420,000', '-20%'],
  ['Oraimo Earbuds', 'Oraimo', '₦24,500', '₦32,000', '-20%'],
  ['Infinix Hot 40', 'Infinix', '₦185,000', '₦230,000', '-20%'],
  ['Anker USB-C Cable', 'Anker', '₦9,500', '₦12,000', '-20%'],
  ['Xiaomi Redmi Note', 'Xiaomi', '₦210,000', '₦260,000', '-20%'],
  ['iPad 10th Gen', 'Apple', '₦590,000', '₦650,000', '-20%'],
  ['Android Tablet 10"', 'SHOPNOVA', '₦210,000', '₦260,000', '-12%'],
  ['Noise Smart Watch', 'Noise', '₦41,000', '₦55,000', '-20%'],
  ['Smart Watch 9', 'SHOPNOVA', '₦65,000', '₦80,000', '-20%'],
  ['Laptop Stand', 'SHOPNOVA', '₦21,000', '₦30,000', '-20%'],
  ['LED Desk Lamp', 'SHOPNOVA', '₦18,000', '₦25,000', '-20%'],
  ['Bluetooth Earbuds', 'SHOPNOVA', '₦33,000', '₦45,000', '-20%'],
  ['Camera Lens', 'SHOPNOVA', '₦145,000', '₦180,000', '-20%'],
  ['Smart TV', 'SHOPNOVA', '₦430,000', '₦500,000', '-20%'],
  ['Dell Monitor 27"', 'Dell', '₦180,000', '₦220,000', '-18%'],
  ['Hisense 43" Smart TV', 'Hisense', '₦285,000', '₦340,000', '-16%'],
  ['Wireless Gaming Mouse', 'SHOPNOVA', '₦18,900', '₦25,000', '-24%'],
  ['Oraimo Power Bank 30000mAh', 'Oraimo', '₦31,500', '₦45,000', '-30%'],
  ['MagSafe Case', 'Apple', '₦18,000', '₦24,000', '-20%'],
  ['USB-C Adapter', 'Apple', '₦28,000', '₦35,000', '-20%'],
  ['AirPods Pro', 'Apple', '₦285,000', '₦320,000', '-20%'],
  ['JBL Tune Headphones', 'JBL', '₦55,000', '₦75,000', '-12%'],
  ['Screen Guard', 'Apple', '₦9,500', '₦12,000', '-20%'],
]

export const productsById = Object.fromEntries(
  productRows.map(([name, brand, price, oldPrice, discount]) => [
    productSlug(name),
    {
      id: productSlug(name),
      name,
      brand,
      price,
      oldPrice,
      discount,
      image: productImages[productSlug(name)] || fallbackImage,
    },
  ]),
)

export function getProductById(id) {
  return productsById[id] || productsById['iphone-15-pro-max-256gb']
}

export function getProductImage(name) {
  return productImages[productSlug(name)] || fallbackImage
}
