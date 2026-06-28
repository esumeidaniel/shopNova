import { Link } from 'react-router-dom'
import './TrustPage.css'

const pageContent = {
  about: {
    title: 'About SHOPNOVA',
    intro: 'SHOPNOVA is a single-vendor electronics store focused on reliable phones, laptops, accessories, audio devices, smart TVs and everyday tech.',
    cards: [
      ['Curated electronics', 'Products are selected around practical customer needs: work, school, gaming, charging, entertainment and mobile life.'],
      ['One store, clear support', 'Customers buy directly from SHOPNOVA, so support, warranty conversations and delivery updates stay simple.'],
      ['Built for trust', 'The storefront is designed around product clarity, simple navigation and transparent customer service information.'],
    ],
    faqs: [
      ['What does SHOPNOVA sell?', 'SHOPNOVA focuses on phones, laptops, chargers, accessories, audio devices, smart TVs and everyday electronics.'],
      ['Is SHOPNOVA a marketplace?', 'No. The storefront is structured as a single-vendor electronics store.'],
    ],
  },
  contact: {
    title: 'Contact Us',
    intro: 'Need help choosing a device, tracking an order or asking about warranty? Reach the SHOPNOVA support team.',
    cards: [
      ['Email', 'support@shopnova.ng'],
      ['Phone', '+234 801 000 0000'],
      ['WhatsApp', '+234 801 000 0000'],
      ['Location', 'Lagos, Nigeria'],
      ['Opening hours', 'Mon - Sat, 9:00 AM - 6:00 PM'],
    ],
    faqs: [
      ['When should I contact support?', 'Contact support for order tracking, warranty questions, product guidance and delivery concerns.'],
      ['What should I include?', 'Include your order ID, product name and the phone number used at checkout.'],
    ],
  },
  delivery: {
    title: 'Delivery / Shipping Info',
    intro: 'Choose the delivery option that matches your order urgency. Final timelines can depend on location and product availability.',
    cards: [
      ['Standard delivery', 'Best for regular electronics orders within supported cities.'],
      ['Express delivery', 'Faster delivery option for urgent orders and smaller devices.'],
      ['Order tracking', 'Customers can view order progress from processing to shipped and delivered.'],
    ],
    faqs: [
      ['Can I track my order?', 'Yes. Customers can open My Orders to see current order status and delivery progress.'],
      ['Do delivery fees vary?', 'Yes. Delivery fees can depend on city, order size and delivery method.'],
    ],
  },
  returns: {
    title: 'Returns & Warranty',
    intro: 'SHOPNOVA should make post-purchase support clear before the customer checks out.',
    cards: [
      ['Return window', 'Eligible products can be returned within the stated return period if they meet return conditions.'],
      ['Warranty support', 'Warranty information should be shown on product pages and confirmed after purchase.'],
      ['Condition checks', 'Returned products are reviewed for accessories, packaging, damage and serial number match.'],
    ],
    faqs: [
      ['Can opened electronics be returned?', 'Only eligible products that meet return conditions can be accepted after review.'],
      ['How do warranty claims work?', 'Customers should provide order details, product issue description and supporting photos when needed.'],
    ],
  },
}

const TrustPage = ({ type }) => {
  const content = pageContent[type] || pageContent.about
  const isContact = type === 'contact'

  return (
    <main className={`trust-page ${isContact ? 'contact-page' : ''}`}>
      {!isContact && (
        <section className="trust-hero">
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </section>
      )}

      {isContact ? (
        <section className="contact-support-panel">
          <div className="contact-methods">
            {content.cards.map(([title, text]) => (
              <article key={title}>
                <h2>{title}</h2>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
            <input aria-label="Full name" placeholder="Full name" />
            <input aria-label="Email address" placeholder="Email address" />
            <input aria-label="Order ID" placeholder="Order ID (optional)" />
            <textarea aria-label="Message" placeholder="How can we help?" rows="5" />
            <button type="submit">Send Message</button>
          </form>
        </section>
      ) : (
        <section className="trust-card-grid">
          {content.cards.map(([title, text]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </section>
      )}

      <section className="trust-faq">
        <h2>Frequently Asked Questions</h2>
        {content.faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      {!isContact && (
        <section className="trust-cta">
          <h2>Ready to shop electronics?</h2>
          <p>Browse phones, laptops, chargers, audio devices and smart accessories.</p>
          <Link to="/products">Browse Products</Link>
        </section>
      )}
    </main>
  )
}

export default TrustPage
