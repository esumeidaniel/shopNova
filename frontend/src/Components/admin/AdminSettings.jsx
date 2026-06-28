import { useEffect, useState } from 'react'
import { api } from '../../api'

const AdminSettings = () => {
  const [settings, setSettings] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.adminSettings()
      .then(({ settings }) => setSettings(settings))
      .catch((error) => setMessage(error.message))
  }, [])

  const updateSetting = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }))
  }

  const saveSettings = async () => {
    const { settings: savedSettings } = await api.updateAdminSettings(settings)
    setSettings(savedSettings)
    setMessage('Settings saved')
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h2>Settings</h2>
          <p>Control store identity, delivery fees, support details, and payment labels.</p>
        </div>
        <button className="admin-primary-action" type="button" onClick={saveSettings}>Save Settings</button>
      </div>
      {message && <p>{message}</p>}

      <div className="admin-settings-grid">
        <article className="admin-panel">
          <h3>Store Details</h3>
          <label>
            Store name
            <input value={settings.storeName || ''} onChange={(event) => updateSetting('storeName', event.target.value)} />
          </label>
          <label>
            Support email
            <input value={settings.supportEmail || ''} onChange={(event) => updateSetting('supportEmail', event.target.value)} />
          </label>
          <label>
            Phone number
            <input value={settings.phone || ''} onChange={(event) => updateSetting('phone', event.target.value)} />
          </label>
        </article>

        <article className="admin-panel">
          <h3>Delivery</h3>
          <label>
            Standard delivery
            <input value={settings.standardDelivery || ''} onChange={(event) => updateSetting('standardDelivery', event.target.value)} />
          </label>
          <label>
            Express delivery
            <input value={settings.expressDelivery || ''} onChange={(event) => updateSetting('expressDelivery', event.target.value)} />
          </label>
          <label>
            Same-day delivery
            <input value={settings.sameDayDelivery || ''} onChange={(event) => updateSetting('sameDayDelivery', event.target.value)} />
          </label>
        </article>

        <article className="admin-panel">
          <h3>Payments</h3>
          <label>
            Primary gateway
            <input value={settings.primaryGateway || ''} onChange={(event) => updateSetting('primaryGateway', event.target.value)} />
          </label>
          <label>
            Bank transfer
            <input value={settings.bankTransfer ? 'Enabled' : 'Disabled'} onChange={(event) => updateSetting('bankTransfer', event.target.value === 'Enabled')} />
          </label>
          <label>
            Pay on delivery
            <input value={settings.payOnDelivery ? 'Enabled' : 'Disabled'} onChange={(event) => updateSetting('payOnDelivery', event.target.value === 'Enabled')} />
          </label>
        </article>
      </div>
    </section>
  )
}

export default AdminSettings
