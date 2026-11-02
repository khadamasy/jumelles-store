import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { memoryStore, PaymentTransaction } from '../config/db';
import { WaveService } from '../services/waveService';
import { OrangeMoneyService } from '../services/orangeMoneyService';

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { orderId, provider, customerPhone } = req.body;

    if (!orderId || !provider) {
      return res.status(400).json({
        success: false,
        message: 'orderId et provider (WAVE ou ORANGE_MONEY) sont requis.',
      });
    }

    const order = memoryStore.orders.find((o) => o.id === orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable.' });
    }

    if (order.status === 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'Cette commande a déjà été réglée avec succès.',
      });
    }

    const transactionReference = `TXN-${provider}-${Date.now()}-${uuidv4().substring(0, 4).toUpperCase()}`;

    let paymentDetails: any = null;

    if (provider === 'WAVE') {
      paymentDetails = await WaveService.createCheckoutSession({
        amount: order.totalAmount,
        currency: 'XOF',
        orderId: order.id,
        orderNumber: order.orderNumber,
        clientReference: transactionReference,
        successUrl: `http://localhost:3000/order-success?orderId=${order.id}&ref=${transactionReference}`,
        errorUrl: `http://localhost:3000/checkout?error=payment_cancelled`,
      });
    } else if (provider === 'ORANGE_MONEY') {
      paymentDetails = await OrangeMoneyService.initPayment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.totalAmount,
        currency: 'XOF',
        customerPhone: customerPhone || order.customerPhone,
        returnUrl: `http://localhost:3000/order-success?orderId=${order.id}&ref=${transactionReference}`,
        cancelUrl: `http://localhost:3000/checkout?error=payment_cancelled`,
        notifUrl: `http://localhost:4000/api/payments/webhook/orange-money`,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Fournisseur de paiement non pris en charge. Utilisez WAVE ou ORANGE_MONEY.',
      });
    }

    const newTransaction: PaymentTransaction = {
      id: `txn-${uuidv4().substring(0, 8)}`,
      orderId: order.id,
      provider,
      transactionReference,
      operatorTransactionId: paymentDetails.id || paymentDetails.paymentToken,
      amount: order.totalAmount,
      currency: 'XOF',
      status: 'PENDING',
      paymentUrl: paymentDetails.waveLaunchUrl || paymentDetails.paymentUrl,
      createdAt: new Date().toISOString(),
    };

    memoryStore.transactions.push(newTransaction);

    res.json({
      success: true,
      message: `Session de paiement ${provider} initialisée avec succès.`,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.totalAmount,
        currency: 'XOF',
        provider,
        transactionReference,
        paymentUrl: newTransaction.paymentUrl,
        qrCodeUrl: paymentDetails.qrCodeUrl || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Webhook Wave : Notification de paiement réussi
 */
export const waveWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['wave-signature'] as string;
    const isValid = WaveService.verifyWebhookSignature(JSON.stringify(req.body), signature);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Signature Webhook Wave invalide.' });
    }

    const { type, data } = req.body;
    console.log(`[Wave Webhook Reçu] Type: ${type}`);

    if (type === 'checkout.session.completed' || data?.status === 'complete') {
      const clientReference = data?.client_reference;
      const txn = memoryStore.transactions.find((t) => t.transactionReference === clientReference);

      if (txn) {
        txn.status = 'SUCCESSFUL';
        txn.operatorTransactionId = data.id || txn.operatorTransactionId;

        const order = memoryStore.orders.find((o) => o.id === txn.orderId);
        if (order) {
          order.status = 'PAID';
          console.log(`[Wave Webhook] Commande ${order.orderNumber} marquée comme PAYÉE !`);
        }
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('[Wave Webhook Error]', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Webhook Orange Money IPN
 */
export const orangeMoneyWebhook = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log('[Orange Money IPN Reçu]', payload);

    if (OrangeMoneyService.verifyIpnPayload(payload)) {
      const ref = payload.order_id || payload.transaction_reference;
      const txn = memoryStore.transactions.find(
        (t) => t.transactionReference === ref || t.operatorTransactionId === payload.payment_token
      );

      if (txn) {
        txn.status = 'SUCCESSFUL';
        const order = memoryStore.orders.find((o) => o.id === txn.orderId);
        if (order) {
          order.status = 'PAID';
          console.log(`[Orange Money IPN] Commande ${order.orderNumber} marquée comme PAYÉE !`);
        }
      }
    }

    res.json({ status: 'ACK' });
  } catch (error: any) {
    console.error('[Orange Money IPN Error]', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Simulation de validation instantanée pour démonstration et tests
 */
export const mockSimulatePaymentSuccess = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const order = memoryStore.orders.find((o) => o.id === orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable.' });
    }

    order.status = 'PAID';
    const txn = memoryStore.transactions.find((t) => t.orderId === order.id);
    if (txn) {
      txn.status = 'SUCCESSFUL';
    }

    res.json({
      success: true,
      message: `Paiement simulé avec succès pour la commande ${order.orderNumber}. Statut: PAYÉ.`,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
