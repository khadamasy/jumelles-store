import { buildWhatsAppSendUrl } from '../stores/phone';

/* Règles et mises en forme des commandes de l'Espace Gérance
   (déplacées telles quelles depuis AdminView.vue pour être partagées avec ses composants d'affichage) */

export const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  PAID: 'Payée',
  PREPARING: 'En préparation',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

/** Couleur de la pastille de statut (affichage uniquement) */
export const statusTones: Record<string, string> = {
  PENDING: 'warning',
  PAID: 'success',
  PREPARING: 'info',
  SHIPPED: 'gold',
  DELIVERED: '',
  CANCELLED: 'danger',
};

export const nextStatusMap: Record<string, string[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['PREPARING', 'CANCELLED'],
  PREPARING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export const nextStatusText: Record<string, string> = {
  PAID: 'Marquer comme payée',
  PREPARING: 'Passer en préparation',
  SHIPPED: 'Marquer comme expédiée',
  DELIVERED: 'Marquer comme livrée',
  CANCELLED: 'Annuler la commande',
};

export const revenueStatuses = new Set(['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED']);

export const daysAgo = (dateStr?: string): number => {
  if (!dateStr) return 0;
  const created = new Date(dateStr);
  if (isNaN(created.getTime())) return 0;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfCreated = new Date(created.getFullYear(), created.getMonth(), created.getDate()).getTime();
  return Math.max(0, Math.round((startOfToday - startOfCreated) / 86400000));
};

export const formatAgo = (dateStr?: string): string => {
  const d = daysAgo(dateStr);
  return d === 0 ? 'aujourd’hui' : `il y a ${d} j`;
};

export const formatMoney = (n: number): string =>
  `${new Intl.NumberFormat('fr-FR').format(Math.round(Number(n) || 0))} FCFA`;

export const cleanDigits = (phone?: string): string => String(phone || '').replace(/\D/g, '');

export const formatOrderItems = (o: any): string => {
  if (!Array.isArray(o.items) || o.items.length === 0) return 'Articles commandés';
  return o.items
    .map((i: any) => `${i.quantity} × ${i.productName}${i.variantDetails ? ` (${i.variantDetails})` : ''}`)
    .join(', ');
};

export const customerWhatsAppUrl = (o: any): string => {
  const digits = cleanDigits(o.customerPhone);
  const phone = digits.startsWith('221') ? digits : `221${digits}`;
  const msg = `Bonjour ${o.customerName}, concernant votre commande ${o.orderNumber} chez Jumelles Store.`;
  return buildWhatsAppSendUrl(msg, phone);
};

export const allowedNext = (st: string): string[] => nextStatusMap[st] || [];

export const primaryNextText = (st: string): string => {
  const nx = allowedNext(st).find((s) => s !== 'CANCELLED');
  return nx ? nextStatusText[nx] : 'Changer le statut';
};
