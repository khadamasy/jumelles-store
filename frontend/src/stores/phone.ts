import { defineStore } from 'pinia';
import { ref } from 'vue';
import { PhoneService } from '../services/api';

const GITHUB_RAW_BASE =
  'https://raw.githubusercontent.com/khadamasy/jumelles-store/main/frontend/public';

/**
 * Retourne une URL HTTPS publique pour la photo du sac ou de la chaussure.
 * - En local (localhost / 127.0.0.1), les images "/products/..." pointent vers le dépôt GitHub public
 *   afin que WhatsApp et le téléphone de la gérance puissent ouvrir et prévisualiser la photo.
 */
export const toAbsolutePhotoUrl = (imageUrl?: string): string => {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) {
    // Si l'URL contient localhost et /products/, basculer sur l'URL publique HTTPS
    const localMatch = imageUrl.match(/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(\/products\/.+)$/i);
    if (localMatch) {
      return `${GITHUB_RAW_BASE}${localMatch[1]}`;
    }
    return imageUrl;
  }

  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.');
    if (isLocal && cleanPath.startsWith('/products/')) {
      return `${GITHUB_RAW_BASE}${cleanPath}`;
    }
    return `${window.location.origin}${cleanPath}`;
  }
  return `${GITHUB_RAW_BASE}${cleanPath}`;
};

/**
 * Copie l'image réelle de l'article dans le presse-papiers (pour pouvoir aussi faire Ctrl+V dans WhatsApp).
 */
export const copyPhotoToClipboard = async (imageUrl?: string): Promise<boolean> => {
  if (!imageUrl || typeof window === 'undefined' || !navigator.clipboard || typeof ClipboardItem === 'undefined') {
    return false;
  }
  try {
    const localSrc = imageUrl.startsWith('http') ? imageUrl : imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image load error'));
      img.src = localSrc;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 800;
    canvas.height = img.naturalHeight || 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return false;
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch {
    return false;
  }
};

export const buildWhatsAppSendUrl = (message: string, phone = '221772087820'): string => {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
};

export const usePhoneStore = defineStore('phone', () => {
  const isOpen = ref(false);
  const phoneNumber = ref('+221 77 208 78 20');
  const phoneRaw = ref('221772087820');
  const productContext = ref<string>('');
  const productImage = ref<string>('');
  const productLocalImage = ref<string>('');
  const isSubmittingCallback = ref(false);
  const callbackSuccess = ref(false);
  const copied = ref(false);

  const openModal = (context?: string, imageUrl?: string) => {
    productContext.value = context || '';
    productLocalImage.value = imageUrl || '';
    productImage.value = imageUrl ? toAbsolutePhotoUrl(imageUrl) : '';
    callbackSuccess.value = false;
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
  };

  const copyPhoneNumber = async () => {
    try {
      await navigator.clipboard.writeText('+221 77 208 78 20');
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 3000);
    } catch {
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 3000);
    }
  };

  const callNow = () => {
    window.location.href = 'tel:+221772087820';
  };

  const openWhatsApp = async (customMessage?: string) => {
    let msg = customMessage;
    if (!msg) {
      if (productContext.value) {
        const photoPublicUrl = productImage.value;
        msg = `${photoPublicUrl ? photoPublicUrl + '\n\n' : ''}Bonjour Jumelles Store, je souhaite commander par téléphone l'article suivant :\n${productContext.value}`;
      } else {
        msg = `Bonjour Jumelles Store, je souhaite passer une commande par téléphone ou avoir des informations.`;
      }
    }
    // Ouverture immédiate (dans le clic) : après un await, Safari iOS bloquerait la fenêtre
    const url = buildWhatsAppSendUrl(msg, phoneRaw.value);
    window.open(url, '_blank', 'noopener,noreferrer');
    if (productLocalImage.value) {
      void copyPhotoToClipboard(productLocalImage.value);
    }
  };

  const submitCallback = async (customerName: string, customerPhone: string, notes?: string) => {
    isSubmittingCallback.value = true;
    try {
      const interestWithPhoto =
        productContext.value && productImage.value && !productContext.value.includes(productImage.value)
          ? `${productContext.value} (Photo: ${productImage.value})`
          : productContext.value || 'Commande générale';

      await PhoneService.requestCallback({
        customerName,
        customerPhone,
        productInterest: interestWithPhoto,
        notes,
      });
      callbackSuccess.value = true;
      return true;
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de l'envoi de la demande.");
      return false;
    } finally {
      isSubmittingCallback.value = false;
    }
  };

  return {
    isOpen,
    phoneNumber,
    phoneRaw,
    productContext,
    productImage,
    productLocalImage,
    isSubmittingCallback,
    callbackSuccess,
    copied,
    toAbsolutePhotoUrl,
    copyPhotoToClipboard,
    buildWhatsAppSendUrl,
    openModal,
    closeModal,
    copyPhoneNumber,
    callNow,
    openWhatsApp,
    submitCallback,
  };
});
