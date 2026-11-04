import { defineStore } from 'pinia';
import { ref } from 'vue';
import { PhoneService } from '../services/api';

export const toAbsolutePhotoUrl = (imageUrl?: string): string => {
  if (!imageUrl) return '';
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jumelles.sn';
  return `${origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

export const usePhoneStore = defineStore('phone', () => {
  const isOpen = ref(false);
  const phoneNumber = ref('+221 77 208 78 20');
  const phoneRaw = ref('221772087820');
  const productContext = ref<string>('');
  const productImage = ref<string>('');
  const isSubmittingCallback = ref(false);
  const callbackSuccess = ref(false);
  const copied = ref(false);

  const openModal = (context?: string, imageUrl?: string) => {
    productContext.value = context || '';
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

  const openWhatsApp = (customMessage?: string) => {
    let msg = customMessage;
    if (!msg) {
      if (productContext.value) {
        msg = `Bonjour Jumelles Store, je souhaite commander par téléphone l'article suivant : ${productContext.value}`;
        if (productImage.value && !msg.includes(productImage.value)) {
          msg += `\n📷 Photo : ${productImage.value}`;
        }
      } else {
        msg = `Bonjour Jumelles Store, je souhaite passer une commande par téléphone ou avoir des informations.`;
      }
    }
    const url = `https://wa.me/221772087820?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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
    isSubmittingCallback,
    callbackSuccess,
    copied,
    toAbsolutePhotoUrl,
    openModal,
    closeModal,
    copyPhoneNumber,
    callNow,
    openWhatsApp,
    submitCallback,
  };
});
