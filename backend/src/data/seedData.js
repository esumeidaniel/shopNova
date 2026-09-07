export function slugify(name) {
  return name.toLowerCase().replaceAll('"', '').replaceAll('&', 'and').replaceAll(' ', '-')
}

// Stock images are launch placeholders. Replace them through the local admin upload flow
// with licensed, accurate product photography before publishing the store.
const productImages = {
  phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  accessory: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80',
  audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  display: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
  gaming: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=900&q=80',
  tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80',
}

function seededProduct(name, brand, category, price, imageType, options = {}) {
  const image = options.image || productImages[imageType]
  const stock = options.stock ?? 12
  return {
    id: slugify(name), name, brand, category, price, image, images: [image],
    oldPrice: options.oldPrice || '', discount: options.discount || '', stock,
    featured: Boolean(options.featured), bestSeller: Boolean(options.bestSeller),
    status: stock > 0 ? 'Active' : 'Out of Stock',
    description: options.description || `${name} from the SHOPNOVA electronics collection.`,
    priceSource: options.priceSource || 'Jumia Nigeria reference listing; seed price checked September 2026 and is not a live feed.',
    sourceUrl: options.sourceUrl || '',
    rating: options.rating || 4.6, reviewCount: options.reviewCount || 24,
    createdAt: options.createdAt || '2026-08-20T10:00:00.000Z',
  }
}

export const initialData = {
  users: [
    {
      id: 'user_admin',
      email: 'admin@shopnova.ng',
      password: '$2a$10$daBMtAW3krm.pyi8jnALn.qp6Puat1D.J829EZm/KoZqe8IJfgXM6',
      role: 'admin',
      firstName: 'SHOPNOVA',
      lastName: 'Admin',
      phone: '+234 801 000 0000',
      emailVerified: true,
      addresses: [],
      wishlist: [],
      cart: [],
      notifications: {
        orderUpdates: true,
        promotions: true,
        newArrivals: true,
        whatsapp: true,
        newsletters: true,
      },
    },
  ],
  products: [
    // Jumia Nigeria, Samsung Galaxy A16 4GB/128GB listing checked 2026-09: ₦265,000.
    seededProduct('Samsung Galaxy A16 128GB', 'Samsung', 'Phones', '₦265,000', 'phone', { oldPrice: '₦270,000', discount: '2% OFF', image: '/catalog/samsung-galaxy-a16-128gb.png', stock: 18, featured: true, bestSeller: true, rating: 4.7, reviewCount: 128, sourceUrl: 'https://www.jumia.com.ng/slp/samsung-galaxy-a16-4gb-ram-128gb' }),
    seededProduct('Tecno Spark 30C 128GB', 'Tecno', 'Phones', '₦170,590', 'phone', { oldPrice: '₦185,000', discount: '8% OFF', image: 'https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/62/9711204/1.jpg?7168', stock: 26, bestSeller: true, rating: 4.5, reviewCount: 89, sourceUrl: 'https://www.jumia.com.ng/tecno-spark-30c-6.67-4gb-ram128gb-rom-black-402117926.html' }),
    seededProduct('Infinix Smart 9 128GB', 'Infinix', 'Phones', '₦165,000', 'phone', { image: 'https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/84/1578493/1.jpg?1170', stock: 31, featured: true, sourceUrl: 'https://www.jumia.com.ng/infinix-smart-9-128gb-rom-33gb-ram-4g-5000mah-gold-394875148.html' }),
    seededProduct('itel A80 128GB', 'itel', 'Phones', '₦166,500', 'phone', { image: 'https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/02/2984304/1.jpg?0173', stock: 14, sourceUrl: 'https://www.jumia.com.ng/itel-a80-6.7-3gb-ram128gb-rom-5000mah-4g-android-14-black-403489220.html' }),
    seededProduct('Redmi Note 14 Pro 256GB', 'Xiaomi', 'Phones', '₦433,000', 'phone', { image: '/catalog/redmi-note-14-pro-256gb.png', stock: 11, featured: true, rating: 4.8, reviewCount: 76, sourceUrl: 'https://www.jumia.com.ng/slp/redmi-note-14-8gb-256gb' }),
    seededProduct('Tecno Camon 30 256GB', 'Tecno', 'Phones', '₦429,999', 'phone', { oldPrice: '₦500,000', discount: '14% OFF', image: 'https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/20/0081703/1.jpg?7507', stock: 9, bestSeller: true, sourceUrl: 'https://www.jumia.com.ng/camon-30-6.78-256gb12gb-4g-dual-sim-5000mah-white-tecno-mpg6942075.html' }),
    seededProduct('Samsung Galaxy A56 256GB', 'Samsung', 'Phones', '₦570,000', 'phone', { image: 'https://ng.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/21/8916814/1.jpg?6957', stock: 6, featured: true, rating: 4.8, reviewCount: 51, sourceUrl: 'https://www.jumia.com.ng/samsung-galaxy-a56-dual-sim-8gb-ram-256gb-5g-awesome-graphite-408222160.html' }),
    seededProduct('Infinix Note 40 Pro+ 256GB', 'Infinix', 'Phones', '₦316,800', 'phone', { oldPrice: '₦504,000', discount: '37% OFF', image: 'https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/15/0379914/1.jpg?7720', stock: 8, sourceUrl: 'https://www.jumia.com.ng/renewed-infinix-note-40-pro-5g-6.78-amoled-256gb-rom-12gb-ram-108mp-camera-100w-fast-charge-4600mah-black-419973051.html' }),
    seededProduct('Samsung Galaxy S25 Ultra 512GB', 'Samsung', 'Phones', '₦2,299,999', 'phone', { image: '/catalog/samsung-galaxy-s25-ultra-512gb.png', stock: 3, featured: true, rating: 4.9, reviewCount: 17, sourceUrl: 'https://www.jumia.com.ng/slp/unlocked-samsung-galaxy-s25-ultra-512gb' }),
    seededProduct('Apple iPhone 16 Pro 256GB', 'Apple', 'Phones', '₦1,700,000', 'phone', { image: 'https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/96/1138114/1.jpg?4037', stock: 4, featured: true, bestSeller: true, rating: 4.9, reviewCount: 32, sourceUrl: 'https://www.jumia.com.ng/apple-iphone-16-pro-256gb-8gb-single-sim-5g-natural-titanium-411831169.html' }),

    // Jumia Nigeria listings checked 2026-09; point-in-time seed prices, not a live price feed.
    seededProduct('HP 15 TOUCHSCREEN 12TH GEN INTEL CORE I3 4.4GHZ 8GB RAM 512GB SSD 15.6FHD WINDOWS 11', 'HP', 'Laptops', '₦730,000', 'laptop', { oldPrice: '₦770,500', discount: '5% OFF', image: '/catalog/hp-15s-fq5046nia-i3-8gb-512gb.png', stock: 12, bestSeller: true, sourceUrl: 'https://www.jumia.com.ng/slp/hp-15s-fq5046nia' }),
    seededProduct('Lenovo ThinkPad E14 Gen 7 – Intel® Ultra 5 225U, 16GB RAM, 512GB SSD, 14" WUXGA Display, Backlit Keyboard, Windows 11 Pro', 'Lenovo', 'Laptops', '₦1,600,000', 'laptop', { oldPrice: '₦1,900,000', discount: '16% OFF', image: '/catalog/lenovo-thinkpad-e14-gen-7.png', stock: 10, sourceUrl: 'https://www.jumia.com.ng/lenovo-thinkpad-e14-gen-7-intelr-ultra-5-225u-16gb-ram-512gb-ssd-14-wuxga-display-backlit-keyboard-windows-11-pro-418860416.html' }),
    seededProduct('DELL Latitude 5300 TOUCHSCREEN Intel Core I5/512GB SSD 16GB RAM/BACKLIGHT KEYBOARD-WIN 11PRO+BAG', 'DELL', 'Laptops', '₦430,000', 'laptop', { oldPrice: '₦650,000', discount: '34% OFF', image: '/catalog/dell-latitude-5300-i5-16gb-512gb.png', stock: 7, featured: true, rating: 4.8, reviewCount: 43, sourceUrl: 'https://www.jumia.com.ng/latitude-5300-touchscreen-intel-core-i5512gb-ssd-16gb-rambacklight-keyboard-win-11probag-dell-mpg11419713.html' }),
    seededProduct('HP EliteBook 840 G8 11th Gen Intel Core i5 512GB SSD/16GB RAM Touchscreen Backlit Keyboard/FP Reader Windows 11 Pro + Bag', 'HP', 'Laptops', '₦650,000', 'laptop', { image: '/catalog/hp-elitebook-840-g8-i5-16gb-512gb.png', stock: 5, sourceUrl: 'https://www.jumia.com.ng/elitebook-840-g8-11th-gen-intel-core-i5-512gb-ssd16gb-ram-touchscreen-backlit-keyboardfp-reader-windows-11-pro-bag-hp-mpg11978452.html' }),
    seededProduct('ASUS Vivobook 15 Intel Core i5-12500H 8GB RAM 512GB SSD 15.6 FHD FreeDOS Touch Screen HD Camera with Privacy Shutter Silver X1502ZA', 'ASUS', 'Laptops', '₦639,810', 'laptop', { oldPrice: '₦790,298', discount: '19% OFF', image: '/catalog/asus-vivobook-15-x1502za.png', stock: 8, bestSeller: true, sourceUrl: 'https://www.jumia.com.ng/asus-vivobook-15-intel-core-i5-12500h-8gb-ram-512gb-ssd-15.6-fhd-freedos-touch-screen-hd-camera-with-privacy-shutter-silver-x1502za-419545407.html' }),
    seededProduct('Apple 2024 MacBook Air 15-inch M3 16GB Unified Memory 512GB Midnight', 'Apple', 'Laptops', '₦2,583,001', 'laptop', { image: '/catalog/apple-macbook-air-15-m3-16gb-512gb.png', stock: 4, featured: true, rating: 4.9, reviewCount: 19, sourceUrl: 'https://www.jumia.com.ng/mlp-apple-store/' }),
    seededProduct('DELL Latitude 7490 Intel Core I7/ 32GB RAM 512GB SSD/BACKLIGHT KEYBOARD/WIN 11PRO+BAG', 'DELL', 'Laptops', '₦640,250', 'laptop', { oldPrice: '₦1,113,215', discount: '43% OFF', image: '/catalog/dell-latitude-7490-i7-32gb-512gb.png', stock: 2, featured: true, sourceUrl: 'https://www.jumia.com.ng/dell-latitude-7490-intel-core-i7-32gb-ram-512gb-ssdbacklight-keyboardwin-11probag-270594558.html' }),
    seededProduct('Lenovo LEGION 5 GAMING 14TH GEN INTEL CORE I7 5.2GHZ 16GB RAM 1TB SSD RTX 4060 (8GB) 16WQXGA WINS 11', 'Lenovo', 'Laptops', '₦3,155,000', 'gaming', { oldPrice: '₦3,400,000', discount: '7% OFF', image: '/catalog/lenovo-legion-5-i7-rtx4060.png', stock: 3, bestSeller: true, sourceUrl: 'https://www.jumia.com.ng/lenovo-legion-5-gaming-14th-gen-intel-core-i7-5.2ghz-16gb-ram-1tb-sssd-rtx-4060-8gb-16wqxga-wins-11-401735024.html' }),

    seededProduct('Anker PowerPort Nano 20W USB-C Wall Charger A2631', 'Anker', 'Accessories', '₦25,500', 'accessory', { oldPrice: '₦45,000', discount: '43% OFF', image: '/catalog/anker-powerport-nano-20w.png', stock: 38, bestSeller: true, sourceUrl: 'https://www.jumia.com.ng/slp/anker-20w' }),
    seededProduct('Baseus Laptop Charger PALM 65W 3Port GaN 2C +1U Apple MACBOOK PRO HP Laptop Samsung iPhone Charger Type-C 100W Cable', 'Baseus', 'Accessories', '₦42,950', 'accessory', { oldPrice: '₦70,000', discount: '39% OFF', image: '/catalog/baseus-palm-65w-gan.png', stock: 16, featured: true, sourceUrl: 'https://www.jumia.com.ng/baseus-laptop-charger-palm-65w-3port-gan-2c-1u-apple-macbook-prohplaptop-samsung-iphone-charger-typec-100w-cable-dell-acer-lenovo-laptops-asus-419163732.html' }),
    seededProduct('Oraimo OCD-L32 Type-C Data Cable 2m', 'Oraimo', 'Accessories', '₦7,500', 'accessory', { image: '/catalog/oraimo-typec-cable.png', stock: 45, sourceUrl: 'https://www.jumia.com.ng/slp/oraimo-type-c-cable' }),
    seededProduct('UGREEN 100W USB C to USB C Cable', 'UGREEN', 'Accessories', '₦13,000', 'accessory', { oldPrice: '₦15,000', discount: '13% OFF', image: '/catalog/ugreen-100w-cable.png', stock: 22, sourceUrl: 'https://www.jumia.com.ng/slp/ugreen-100w-usb-c-cable' }),
    seededProduct('Romoss Sense8PF 30000mAh Power Bank, PD 22.5W USB C Fast Charging LED Display', 'Romoss', 'Accessories', '₦29,800', 'accessory', { oldPrice: '₦55,000', discount: '46% OFF', image: '/catalog/romoss-sense8p.png', stock: 11, bestSeller: true, sourceUrl: 'https://www.jumia.com.ng/romoss-sense8pf-30000mah-power-bank-pd-22.5w-usb-c-fast-charging-led-display-272059551.html' }),
    seededProduct('Oraimo Traveler Link 20 20000mAh 12W Power Bank With Cables', 'Oraimo', 'Accessories', '₦56,500', 'accessory', { oldPrice: '₦69,500', discount: '19% OFF', image: '/catalog/oraimo-traveler15.png', stock: 17, sourceUrl: 'https://www.jumia.com.ng/oraimo-traveler-link-20-20000mah-12w-power-bank-with-cables-295484979.html' }),
    seededProduct('Baseus 15W Wireless Charger', 'Baseus', 'Accessories', '₦18,500', 'accessory', { oldPrice: '₦22,000', discount: '16% OFF', image: '/catalog/baseus-wireless15w.png', stock: 13, sourceUrl: 'https://www.jumia.com.ng/slp/baseus-15w-wireless-charger' }),
    seededProduct('UGREEN 45W Dual USB-C Car Charger', 'UGREEN', 'Accessories', '₦16,000', 'accessory', { image: '/catalog/ugreen-car45w.png', stock: 0, sourceUrl: 'https://www.jumia.com.ng/slp/ugreen-45w-car-charger' }),
    seededProduct('Apple 20W USB-C Power Adapter', 'Apple', 'Accessories', '₦20,000', 'accessory', { image: '/catalog/apple-20w-adapter.png', stock: 9, sourceUrl: 'https://www.jumia.com.ng/slp/apple-20w-usb-c-power-adapter' }),

    seededProduct('Oraimo FreePods 4 ANC True Wireless Earbuds', 'Oraimo', 'Audio', '₦39,500', 'audio', { image: '/catalog/oraimo-freepods4.png', stock: 19, featured: true, bestSeller: true, rating: 4.7, reviewCount: 94, sourceUrl: 'https://www.jumia.com.ng/slp/oraimo-freepods-4' }),
    seededProduct('JBL Tune 520BT Wireless On-Ear Headphones', 'JBL', 'Audio', '₦52,000', 'audio', { oldPrice: '₦60,000', discount: '13% OFF', image: '/catalog/jbl-tune520bt.png', stock: 10, sourceUrl: 'https://www.jumia.com.ng/slp/jbl-tune-520bt' }),
    seededProduct('Soundcore R50i True Wireless Earbuds', 'Soundcore', 'Audio', '₦29,000', 'audio', { image: '/catalog/soundcore-r50i.png', stock: 25, sourceUrl: 'https://www.jumia.com.ng/slp/soundcore-r50i' }),
    seededProduct('Sony WH-CH720N Wireless Noise Canceling Headphones', 'Sony', 'Audio', '₦165,000', 'audio', { image: '/catalog/sony-whch720n.png', stock: 5, featured: true, sourceUrl: 'https://www.jumia.com.ng/slp/sony-wh-ch720n' }),
    seededProduct('JBL Go 4 Portable Bluetooth Speaker', 'JBL', 'Audio', '₦48,000', 'audio', { oldPrice: '₦55,000', discount: '13% OFF', image: '/catalog/jbl-go4.png', stock: 14, sourceUrl: 'https://www.jumia.com.ng/slp/jbl-go-4' }),
    seededProduct('Xiaomi Redmi Buds 6 Play', 'Xiaomi', 'Audio', '₦25,000', 'audio', { image: '/catalog/redmi-buds6.png', stock: 0, sourceUrl: 'https://www.jumia.com.ng/slp/redmi-buds-6-play' }),

    seededProduct('Samsung Galaxy Tab A9+ 128GB', 'Samsung', 'Tablets', '₦325,000', 'tablet', { image: '/catalog/galaxy-tab-a9plus.png', stock: 9, featured: true, sourceUrl: 'https://www.jumia.com.ng/slp/samsung-galaxy-tab-a9-plus-128gb' }),
    seededProduct('Apple iPad 10th Generation 64GB', 'Apple', 'Tablets', '₦690,000', 'tablet', { oldPrice: '₦740,000', discount: '7% OFF', image: '/catalog/ipad-10th.png', stock: 6, bestSeller: true, sourceUrl: 'https://www.jumia.com.ng/slp/ipad-10th-generation-64gb' }),
    seededProduct('Xiaomi Redmi Pad SE 128GB', 'Xiaomi', 'Tablets', '₦245,000', 'tablet', { image: '/catalog/redmi-pad-se.png', stock: 12, sourceUrl: 'https://www.jumia.com.ng/slp/redmi-pad-se-128gb' }),

    seededProduct('Samsung Odyssey G3 24-inch 180Hz Gaming Monitor', 'Samsung', 'Monitors', '₦290,000', 'display', { image: '/catalog/samsung-odyssey-g3.png', stock: 7, featured: true, sourceUrl: 'https://www.jumia.com.ng/slp/samsung-odyssey-g3-24-inch' }),
    seededProduct('LG UltraGear 27-inch QHD Gaming Monitor', 'LG', 'Monitors', '₦485,000', 'display', { oldPrice: '₦530,000', discount: '8% OFF', image: '/catalog/lg-ultragear-27.png', stock: 4, sourceUrl: 'https://www.jumia.com.ng/slp/lg-ultragear-27-inch-qhd' }),
    seededProduct('DELL P2422H 24-inch IPS Monitor', 'DELL', 'Monitors', '₦235,000', 'display', { image: '/catalog/dell-p2422h.png', stock: 10, bestSeller: true, sourceUrl: 'https://www.jumia.com.ng/slp/dell-p2422h' }),
    seededProduct('HP 24-inch All-in-One Core i5 Desktop', 'HP', 'Desktops', '₦1,060,000', 'display', { image: '/catalog/hp-aio-24.png', stock: 3, featured: true, sourceUrl: 'https://www.jumia.com.ng/slp/hp-24-inch-all-in-one-core-i5' }),
    seededProduct('Lenovo IdeaCentre AIO 3 Ryzen 5', 'Lenovo', 'Desktops', '₦890,000', 'display', { image: '/catalog/lenovo-aio3.png', stock: 5, sourceUrl: 'https://www.jumia.com.ng/slp/lenovo-ideacentre-aio-3-ryzen-5' }),
    seededProduct('Logitech MK295 Silent Wireless Keyboard and Mouse Combo', 'Logitech', 'Peripherals', '₦38,000', 'accessory', { image: '/catalog/logitech-mk295.png', stock: 21, bestSeller: true, sourceUrl: 'https://www.jumia.com.ng/slp/logitech-mk295' }),
    seededProduct('Logitech G102 LIGHTSYNC Gaming Mouse', 'Logitech', 'Peripherals', '₦28,500', 'gaming', { oldPrice: '₦33,000', discount: '14% OFF', image: '/catalog/logitech-g102.png', stock: 18, sourceUrl: 'https://www.jumia.com.ng/slp/logitech-g102' }),
    seededProduct('Redragon K552 Kumara RGB Mechanical Gaming Keyboard', 'Redragon', 'Peripherals', '₦58,000', 'gaming', { image: '/catalog/redragon-k552.png', stock: 8, sourceUrl: 'https://www.jumia.com.ng/slp/redragon-k552' }),
    seededProduct('Sony PlayStation 5 Slim Digital Edition', 'Sony', 'Gaming', '₦960,000', 'gaming', { image: '/catalog/ps5-slim-digital.png', stock: 3, featured: true, bestSeller: true, rating: 4.9, reviewCount: 29, sourceUrl: 'https://www.jumia.com.ng/slp/playstation-5-slim-digital-edition' }),
    seededProduct('Nintendo Switch OLED Model Console', 'Nintendo', 'Gaming', '₦610,000', 'gaming', { oldPrice: '₦655,000', discount: '7% OFF', image: '/catalog/switch-oled.png', stock: 5, sourceUrl: 'https://www.jumia.com.ng/slp/nintendo-switch-oled' }),
  ],
  categories: [
    'Phones', 'Laptops', 'Accessories', 'Audio', 'Tablets', 'Monitors', 'Desktops', 'Peripherals', 'Gaming',
  ].map((name, index) => ({ id: slugify(name), name, featured: index < 5, visible: true, status: 'Active' })),
  orders: [],
  coupons: [],
  messages: [],
  settings: {
    storeName: 'SHOPNOVA',
    supportEmail: 'support@shopnova.ng',
    phone: '+234 801 000 0000',
    standardDelivery: 'Free',
    expressDelivery: '₦2,500',
    sameDayDelivery: '₦5,000',
    primaryGateway: 'Pay on Delivery',
    bankTransfer: false,
    payOnDelivery: true,
    currency: 'NGN',
    address: '',
    whatsappUrl: '',
    announcement: '',
    heroSlides: [],
    trustItems: [],
    footerDescription: '',
    policyLinks: [],
    newsletterText: '',
  },
  reviews: [],
}
