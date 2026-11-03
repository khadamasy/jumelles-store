import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const WAVE_API_KEY = process.env.WAVE_API_KEY || 'wave_test_secret_key_jumelles';
const WAVE_WEBHOOK_SECRET = process.env.WAVE_WEBHOOK_SECRET || 'wave_whsec_jumelles';
const WAVE_API_URL = process.env.WAVE_API_URL || 'https://api.wave.com/v1';

export interface WaveCheckoutParams {
  amount: number;
  currency: 'XOF';
  orderId: string;
  orderNumber: string;
  clientReference: string;
  successUrl: string;
  errorUrl: string;
}

export class WaveService {
  /**
   * Créer une session de paiement Wave
   */
  static async createCheckoutSession(params: WaveCheckoutParams) {
    try {
      console.log(`[Wave API] Création d'une session de paiement pour commande ${params.orderNumber} (${params.amount} ${params.currency})`);

      // Informations de paiement direct Wave (+221 77 208 78 20)
      const boutiquePhone = '+221 77 208 78 20';
      const boutiquePhoneClean = '221772087820';
      const waveDeepLink = 'wave://';
      const mockCheckoutId = `cos_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const waveLaunchUrl = `https://pay.wave.com/c/${mockCheckoutId}`;

      return {
        id: mockCheckoutId,
        amount: params.amount,
        currency: params.currency,
        waveLaunchUrl,
        waveDeepLink,
        boutiquePhone,
        boutiquePhoneClean,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=tel:${boutiquePhoneClean}`,
        checkoutStatus: 'open',
        clientReference: params.clientReference,
      };
    } catch (error: any) {
      console.error('[Wave API Error]', error);
      throw new Error(`Erreur lors de la création de la session Wave: ${error.message}`);
    }
  }

  /**
   * Vérifier la signature cryptographique du Webhook Wave
   */
  static verifyWebhookSignature(payload: string, signatureHeader: string): boolean {
    // En développement, tolérant si la clé secrète n'a pas encore été renseignée
    if (process.env.NODE_ENV !== 'production' && (!signatureHeader || !WAVE_WEBHOOK_SECRET)) {
      return true;
    }
    if (!signatureHeader || !WAVE_WEBHOOK_SECRET) {
      return false;
    }
    try {
      const hmac = crypto.createHmac('sha256', WAVE_WEBHOOK_SECRET);
      const computedSignature = hmac.update(payload).digest('hex');
      const sigBuffer = Buffer.from(signatureHeader);
      const compBuffer = Buffer.from(computedSignature);
      if (sigBuffer.length !== compBuffer.length) return false;
      return crypto.timingSafeEqual(sigBuffer, compBuffer);
    } catch {
      return false;
    }
  }
}

