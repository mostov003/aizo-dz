// Notification composable — Telegram / WhatsApp (CallMeBot) / EmailJS
export function useNotifications() {
  const CONFIG = {
    telegram: {
      enabled: false,
      botToken: 'YOUR_TELEGRAM_BOT_TOKEN',
      chatId: 'YOUR_TELEGRAM_CHAT_ID'
    },
    emailjs: {
      enabled: false,
      serviceId: 'YOUR_EMAILJS_SERVICE_ID',
      templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
      publicKey: 'YOUR_EMAILJS_PUBLIC_KEY'
    },
    whatsapp: {
      enabled: true,
      phone: '+213655349311',
      apiKey: 'YOUR_CALLMEBOT_API_KEY'
    }
  }

  async function sendTelegram(order) {
    if (!CONFIG.telegram.enabled) return
    const { botToken: token, chatId } = CONFIG.telegram
    if (!token || token === 'YOUR_TELEGRAM_BOT_TOKEN') return
    const itemsText = order.items.map(i => `- ${i.name} (${i.size}) x${i.quantity}`).join('\n')
    const message = `🔔 *طلب جديد وارد!*\n📦 *رقم الطلب:* #${order.id}\n👤 *العميل:* ${order.customer.name}\n📞 *الهاتف:* ${order.customer.phone}\n📍 *الولاية:* ${order.customer.wilaya}\n🚚 *التوصيل:* ${order.customer.delivery}\n🛒 *المنتجات:*\n${itemsText}\n💰 *الإجمالي:* ${order.total.toLocaleString()} DZD`
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
      })
    } catch (e) { console.error('Telegram error:', e) }
  }

  async function sendWhatsApp(order) {
    if (!CONFIG.whatsapp.enabled) return
    const { phone, apiKey } = CONFIG.whatsapp
    if (!apiKey || apiKey === 'YOUR_CALLMEBOT_API_KEY') return
    const itemsText = order.items.map((i, idx) =>
      `${idx + 1}. *${i.name}* (${i.size}) - x${i.quantity} - ${(i.price * i.quantity).toLocaleString()} DZD`
    ).join('\n')
    const message = `🔔 *طلب جديد وارد من الموقع!*\n📌 *رقم الطلب:* #${order.id}\n👤 *العميل:* ${order.customer.name}\n📞 *الهاتف:* ${order.customer.phone}\n📍 *الولاية:* ${order.customer.wilaya}\n🚚 *التوصيل:* ${order.customer.delivery}\n📦 *المنتجات:*\n${itemsText}\n💵 *المجموع الفرعي:* ${order.subtotal.toLocaleString()} DZD\n🚚 *تكلفة الشحن:* ${order.shipping.toLocaleString()} DZD\n💰 *الإجمالي الكلي:* *${order.total.toLocaleString()} DZD*`
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`
    try {
      await fetch(url, { method: 'GET', mode: 'no-cors' })
    } catch (e) { console.error('WhatsApp error:', e) }
  }

  async function sendEmailJS(order) {
    if (!CONFIG.emailjs.enabled) return
    const { serviceId, templateId, publicKey } = CONFIG.emailjs
    if (!serviceId || serviceId === 'YOUR_EMAILJS_SERVICE_ID') return
    const itemsText = order.items.map(i => `${i.name} (${i.size}) x${i.quantity}`).join(', ')
    const params = {
      order_id: order.id, customer_name: order.customer.name,
      customer_phone: order.customer.phone, customer_wilaya: order.customer.wilaya,
      delivery_type: order.customer.delivery, order_items: itemsText,
      total_price: `${order.total.toLocaleString()} DZD`
    }
    try {
      if (window.emailjs) {
        window.emailjs.init({ publicKey })
        await window.emailjs.send(serviceId, templateId, params)
      }
    } catch (e) { console.error('EmailJS error:', e) }
  }

  async function sendAll(order) {
    await Promise.allSettled([
      sendTelegram(order),
      sendWhatsApp(order),
      sendEmailJS(order)
    ])
  }

  return { sendAll, sendTelegram, sendWhatsApp, sendEmailJS }
}
