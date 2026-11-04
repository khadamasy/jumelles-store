/**
 * Notifications instantanées de la gérance via un bot Telegram (gratuit).
 * Configuration (backend/.env) :
 *   TELEGRAM_BOT_TOKEN : jeton donné par @BotFather
 *   TELEGRAM_CHAT_ID   : identifiant de la conversation qui reçoit les alertes
 * Sans ces variables, aucune notification n'est envoyée (le site fonctionne normalement).
 */
const TELEGRAM_TIMEOUT_MS = 5000;

export const isNotifierConfigured = (): boolean =>
  Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);

/** Envoie un message texte ; ne lève jamais d'erreur (une panne Telegram ne bloque pas une commande) */
export const notifyAdmin = async (text: string): Promise<void> => {
  if (!isNotifierConfigured()) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);
  try {
    const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: text.slice(0, 4000),
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn(`[Notification] Telegram a refusé le message (HTTP ${res.status}).`);
    }
  } catch (err: any) {
    console.warn(`[Notification] Envoi Telegram impossible : ${err.message}`);
  } finally {
    clearTimeout(timer);
  }
};

const formatXof = (n: number) => `${Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ')} FCFA`;

export const formatNewOrderMessage = (order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingCity: string;
  shippingAddress: string;
  totalAmount: number;
  items: { productName: string; variantDetails: string; quantity: number }[];
}): string => {
  const lines = order.items.map((i) => `• ${i.quantity} × ${i.productName} (${i.variantDetails})`).join('\n');
  const adminUrl = process.env.SITE_URL ? `\n\nGérer : ${process.env.SITE_URL.replace(/\/$/, '')}/admin` : '';
  return (
    `🛍️ Nouvelle commande ${order.orderNumber}\n\n` +
    `${order.customerName} — ${order.customerPhone}\n` +
    `${order.shippingCity} : ${order.shippingAddress}\n\n` +
    `${lines}\n\nTotal : ${formatXof(order.totalAmount)}` +
    adminUrl
  );
};
