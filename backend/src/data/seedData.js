export function slugify(name) {
  return name.toLowerCase().replaceAll('"', '').replaceAll('&', 'and').replaceAll(' ', '-')
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
  products: [],
  categories: [],
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
