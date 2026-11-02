import { Router } from 'express';
import {
  initiatePayment,
  waveWebhook,
  orangeMoneyWebhook,
  mockSimulatePaymentSuccess,
} from '../controllers/paymentController';

const router = Router();

// Initialisation paiement Wave ou Orange Money
router.post('/initiate', initiatePayment);

// Webhooks
router.post('/webhook/wave', waveWebhook);
router.post('/webhook/orange-money', orangeMoneyWebhook);

// Simulation test pour environnement de développement
router.post('/simulate-success', mockSimulatePaymentSuccess);

export default router;

