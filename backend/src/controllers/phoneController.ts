import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { memoryStore, PhoneCallbackRequest } from '../config/db';

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
    const { customerName, customerPhone, productInterest, notes } = req.body;

    if (!customerPhone || typeof customerPhone !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Veuillez renseigner un numéro de téléphone valide (ex: 77 208 78 20).',
      });
    }

    const cleanPhone = customerPhone.trim();
    if (cleanPhone.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le numéro de téléphone saisi est trop court.',
      });
    }

    const newRequest: PhoneCallbackRequest = {
      id: `call-${uuidv4().substring(0, 8)}`,
      customerName: customerName ? customerName.trim() : 'Cliente Anonyme',
      customerPhone: cleanPhone,
      productInterest: productInterest || 'Commande d\'articles',
      notes: notes || 'Demande de rappel téléphonique immédiat',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    memoryStore.phoneCallbacks.unshift(newRequest);

    console.log(`[Téléphonie Jumelles Store] Nouvelle demande de rappel reçue : ${newRequest.customerPhone} (${newRequest.customerName})`);

    res.status(201).json({
      success: true,
      message: 'Votre demande de rappel a été enregistrée avec succès. Notre équipe vous contacte dans quelques minutes au ' + cleanPhone,
      data: newRequest,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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
export const updateCallbackStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const found = memoryStore.phoneCallbacks.find((c) => c.id === id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'Demande introuvable.' });
  }

  if (status && ['PENDING', 'CALLED'].includes(status)) {
    found.status = status;
  }

  res.json({
    success: true,
    message: 'Statut de l\'appel mis à jour.',
    data: found,
  });
};

