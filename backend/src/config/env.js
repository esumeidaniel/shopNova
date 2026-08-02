import dotenv from 'dotenv'

dotenv.config()

const cleanMongoUri = (value = '') => value.trim().replace(/^MONGODB_URI=/, '')
const cleanBoolean = (value = '') => String(value).toLowerCase() === 'true'
const isProduction = process.env.NODE_ENV === 'production'

function requiredInProduction(name, value) {
  if (isProduction && !value) {
    throw new Error(`${name} is required in production`)
  }

  return value
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  port: Number(process.env.PORT || 4000),
  clientUrl: requiredInProduction('CLIENT_URL', process.env.CLIENT_URL) || 'http://127.0.0.1:5173',
  mongodbUri: requiredInProduction('MONGODB_URI', cleanMongoUri(process.env.MONGODB_URI)),
  jwtSecret: requiredInProduction('JWT_SECRET', process.env.JWT_SECRET || ''),
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: cleanBoolean(process.env.SMTP_SECURE),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || 'SHOPNOVA <no-reply@shopnova.ng>',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || '',
  paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
  requireEmailVerification: cleanBoolean(process.env.REQUIRE_EMAIL_VERIFICATION),
  allowSeedAccounts: cleanBoolean(process.env.ALLOW_SEED_ACCOUNTS),
}
