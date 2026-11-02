import dotenv from 'dotenv';

dotenv.config();

const OM_CLIENT_ID = process.env.ORANGE_MONEY_CLIENT_ID || 'om_test_client_id';
const OM_CLIENT_SECRET = process.env.ORANGE_MONEY_CLIENT_SECRET || 'om_test_client_secret';
const OM_API_URL = process.env.ORANGE_MONEY_API_URL || 'https://api.orange.com/orange-money-webpay/dev/v1';

export interface OrangeMoneyPaymentParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: 'XOF';
  customerPhone?: string;
  returnUrl: string;
  cancelUrl: string;
  notifUrl: string;
}

export class OrangeMoneyService {
  /**
   * Initialise un paiement Web Orange Money
   */
  static async initPayment(params: OrangeMoneyPaymentParams) {
    try {
      console.log(`[Orange Money API] Initialisation paiement pour commande ${params.orderNumber} (${params.amount} ${params.currency})`);

      // Simulation du token de paiement et de l'URL Orange Money WebPay
      const payToken = `OM_PAY_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentUrl = `https://webpayment.orange-money.com/pay?token=${payToken}&amount=${params.amount}`;

      return {
        paymentToken: payToken,
        paymentUrl,
        notifToken: `NT_${Date.now()}`,
        status: 'INITIATED',
        amount: params.amount,
        currency: params.currency,
      };
    } catch (error: any) {
      console.error('[Orange Money API Error]', error);
      throw new Error(`Erreur lors de l'initialisation Orange Money: ${error.message}`);
    }
  }

  /**
   * Vérification du statut IPN Orange Money
   */
  static verifyIpnPayload(payload: any, authHeader?: string): boolean {
    if (!payload) return false;

    // En production, vérifier le secret de notification partagé
    if (process.env.NODE_ENV === 'production') {
      const omSecret = process.env.ORANGE_MONEY_WEBHOOK_SECRET || process.env.ORANGE_MONEY_CLIENT_SECRET;
      if (omSecret && authHeader !== omSecret && payload.notif_token !== omSecret) {
        return false;
      }
    }

    // Seul un statut confirmé doit valider la commande (pas 'INITIATED')
    return payload.status === 'SUCCESS' || payload.status === 'SUCCESSFUL';
  }
}

