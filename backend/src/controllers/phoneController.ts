import { Request, Response } from 'express';
import { randomUUID as uuidv4 } from 'crypto';
import { memoryStore, PhoneCallbackRequest, persistStore } from '../config/db';
import { cleanText, isValidPhone } from '../middlewares/security';
import { notifyAdmin } from '../services/notifier';

export const OFFICIAL_PHONE = '+221 77 208 78 20';
export const OFFICIAL_PHONE_RAW = '221772087820';

/**
 * Obtenir les coordonnées et le statut du service téléphonique
 */
export const getPhoneInfo = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      phone: OFFICIAL_PHONE,
      phoneRaw: OFFICIAL_PHONE_RAW,
      callUrl: `tel:${OFFICIAL_PHONE.replace(/\s+/g, '')}`,
      whatsappUrl: `https://wa.me/${OFFICIAL_PHONE_RAW}?text=Bonjour%20Jumelles%20Store%2C%20je%20souhaite%20commander%20un%20article%20par%20t%C3%A9l%C3%A9phone`,
      openingHours: '7j/7 de 08h00 à 22h00 GMT',
      isOpen: true,
      serviceName: 'Service Client & Téléphonie Jumelles Store Dakar',
    },
  });
};

/**
 * Enregistrer une demande de rappel téléphonique client
 */
export const requestCallback = async (req: Request, res: Response) => {
  try {
    const { customerName, customerPhone, productInterest, notes } = req.body || {};

    if (!isValidPhone(customerPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner un numéro de téléphone valide (ex: 77 208 78 20).',
      });
    }

    const cleanPhone = cleanText(customerPhone, 25);

    // Plafond anti-saturation : ne jamais écraser une demande PENDING légitime
    if (memoryStore.phoneCallbacks.length >= 2000) {
      const calledIdx = memoryStore.phoneCallbacks.findIndex((c) => c.status === 'CALLED');
      if (calledIdx !== -1) {
        memoryStore.phoneCallbacks.splice(calledIdx, 1);
      } else {
        return res.status(429).json({
          success: false,
          message: 'Trop de demandes de rappel en attente. Contactez-nous directement sur WhatsApp au +221 77 208 78 20.',
        });
      }
    }

    const newRequest: PhoneCallbackRequest = {
      id: `call-${uuidv4()}`,
      customerName: cleanText(customerName, 100) || 'Cliente Anonyme',
      customerPhone: cleanPhone,
      productInterest: cleanText(productInterest, 200) || 'Commande d\'articles',
      notes: cleanText(notes, 500) || 'Demande de rappel téléphonique immédiat',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    memoryStore.phoneCallbacks.unshift(newRequest);
    await persistStore();
    void notifyAdmin(
      `📞 Demande de rappel : ${newRequest.customerName} — ${newRequest.customerPhone}\nIntérêt : ${newRequest.productInterest}`
    );

    res.status(201).json({
      success: true,
      message: 'Votre demande de rappel a été enregistrée. Notre équipe vous contacte très vite.',
      data: { id: newRequest.id, status: newRequest.status },
    });
  } catch (error) {
    console.error('[requestCallback]', error);
    res.status(500).json({ success: false, message: 'Erreur interne.' });
  }
};

/**
 * Consulter toutes les demandes de rappel (Back-Office Admin)
 */
export const getCallbacks = (req: Request, res: Response) => {
  res.json({
    success: true,
    count: memoryStore.phoneCallbacks.length,
    data: memoryStore.phoneCallbacks,
  });
};

/**
 * Mettre à jour le statut d'un appel (Admin)
 */
export const updateCallbackStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const found = memoryStore.phoneCallbacks.find((c) => c.id === id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'Demande introuvable.' });
  }

  if (status && ['PENDING', 'CALLED'].includes(status)) {
    found.status = status;
    await persistStore();
  }

  res.json({
    success: true,
    message: 'Statut de l\'appel mis à jour.',
    data: found,
  });
};

