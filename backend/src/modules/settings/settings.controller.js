import { getDb } from '../../shared/db.js'
import { env } from '../../config/env.js'

export async function getPublicSettings(_req, res) {
  const db = await getDb()
  const settings = db.settings || {}
  res.json({
    settings: {
      storeName: settings.storeName || 'SHOPNOVA',
      logo: settings.logo || '',
      favicon: settings.favicon || '',
      supportEmail: settings.supportEmail || '',
      phone: settings.phone || '',
      whatsappUrl: settings.whatsappUrl || '',
      address: settings.address || '',
      socialLinks: settings.socialLinks || {},
      currency: settings.currency || 'NGN',
      announcement: settings.announcement || '',
      heroSlides: (settings.heroSlides || []).filter((slide) => slide.active !== false).sort((a, b) => Number(a.order) - Number(b.order)),
      trustItems: settings.trustItems || [],
      footerDescription: settings.footerDescription || '',
      policyLinks: settings.policyLinks || [],
      newsletterText: settings.newsletterText || '',
      standardDelivery: settings.standardDelivery || '',
      expressDelivery: settings.expressDelivery || '',
      sameDayDelivery: settings.sameDayDelivery || '',
      payOnDelivery: settings.payOnDelivery !== false,
      paystackEnabled: Boolean(env.paystackSecretKey),
    },
  })
}
