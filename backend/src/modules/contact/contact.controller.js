import { saveDb } from '../../shared/db.js'
import { sendEmail } from '../../shared/email.js'
import { validateContact } from '../../shared/validation.js'

export async function submitContact(req, res) {
  const validationError = validateContact(req.body)
  if (validationError) return res.status(400).json({ message: validationError })

  req.db.messages ||= []
  const message = {
    id: `msg_${Date.now()}`,
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    orderId: req.body.orderId?.trim() || '',
    message: req.body.message.trim(),
    createdAt: new Date().toISOString(),
    status: 'New',
  }

  req.db.messages.unshift(message)
  await saveDb(req.db)

  await sendEmail({
    to: req.db.settings?.supportEmail || 'support@shopnova.ng',
    subject: `SHOPNOVA support message${message.orderId ? ` for ${message.orderId}` : ''}`,
    text: `${message.name} <${message.email}> wrote:\n\n${message.message}`,
  }).catch(() => {})

  return res.status(201).json({ message: 'Message sent. SHOPNOVA support will respond soon.' })
}
