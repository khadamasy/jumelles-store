import { defineStore } from 'pinia';
import { ref } from 'vue';
import { PhoneService } from '../services/api';

export const usePhoneStore = defineStore('phone', () => {
  const isOpen = ref(false);
  const phoneNumber = ref('+221 77 208 78 20');
  const phoneRaw = ref('221772087820');
  const productContext = ref<string>('');
  const isSubmittingCallback = ref(false);
  const callbackSuccess = ref(false);
  const copied = ref(false);

  const openModal = (context?: string) => {
    productContext.value = context || '';
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
      // Fallback
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
      } else {
        msg = `Bonjour Jumelles Store, je souhaite passer une commande par téléphone ou avoir des informations.`;
      }
    }
    const url = `https://wa.me/221772087820?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const submitCallback = async (customerName: string, customerPhone: string, notes?: string) => {
    isSubmittingCallback.value = true;
    try {
      await PhoneService.requestCallback({
        customerName,
        customerPhone,
        productInterest: productContext.value || 'Commande générale',
        notes,
      });
      callbackSuccess.value = true;
      return true;
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de l\'envoi de la demande.');
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
    isSubmittingCallback,
    callbackSuccess,
    copied,
    openModal,
    closeModal,
    copyPhoneNumber,
    callNow,
    openWhatsApp,
    submitCallback,
  };
});
