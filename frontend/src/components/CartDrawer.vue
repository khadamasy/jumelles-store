<template>
  <div v-if="cartStore.isDrawerOpen" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity"
      @click="cartStore.toggleDrawer(false)"
    ></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col">
        <!-- Drawer Header -->
        <div class="p-6 border-b border-stone-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl">🛍️</span>
            <h2 class="font-serif text-lg font-bold text-stone-900">Mon Panier d'Achat</h2>
            <span class="bg-stone-100 text-stone-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {{ cartStore.totalItems }}
            </span>
          </div>
          <button
            @click="cartStore.toggleDrawer(false)"
            class="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <!-- Drawer Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <div v-if="cartStore.items.length === 0" class="text-center py-12 text-stone-500 space-y-4">
            <div class="text-5xl">👜</div>
            <p class="font-medium text-stone-700">Votre panier est actuellement vide.</p>
            <p class="text-xs text-stone-400">Découvrez nos sacs tendance et nos élégants escarpins !</p>
            <router-link
              to="/catalog"
              @click="cartStore.toggleDrawer(false)"
              class="inline-block px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-gold-600 transition-colors"
            >
              Explorer la collection
            </router-link>
          </div>

          <div
            v-for="item in cartStore.items"
            :key="item.variantId"
            class="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-100"
          >
            <img
              :src="item.imageUrl"
              :alt="item.productName"
              class="w-20 h-20 object-cover rounded-lg bg-stone-200 shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold text-stone-900 truncate">
                {{ item.productName }}
              </h4>
              <p class="text-xs text-stone-500">
                Couleur : <span class="font-medium text-stone-700">{{ item.color }}</span>
              </p>
              <p class="text-xs text-stone-500">
                Pointure/Taille : <span class="font-medium text-stone-700">{{ item.sizeOrShoeSize }}</span>
              </p>
              <p class="text-sm font-bold text-stone-900 mt-1">
                {{ formatPrice(item.price) }}
              </p>

              <!-- Quantity Controls -->
              <div class="flex items-center gap-2 mt-2">
                <button
                  @click="cartStore.updateQuantity(item.variantId, item.quantity - 1)"
                  class="w-6 h-6 rounded bg-white border border-stone-300 flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-stone-100"
                >
                  -
                </button>
                <span class="text-xs font-semibold w-6 text-center">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.variantId, item.quantity + 1)"
                  class="w-6 h-6 rounded bg-white border border-stone-300 flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-stone-100"
                >
                  +
                </button>

                <button
                  @click="cartStore.removeItem(item.variantId)"
                  class="text-xs text-rosewood-600 hover:text-rosewood-800 ml-auto font-medium"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Drawer Footer -->
        <div v-if="cartStore.items.length > 0" class="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
          <div class="flex justify-between items-baseline text-base font-semibold text-stone-900">
            <span>Sous-total estimé :</span>
            <div class="text-right">
              <span class="font-serif text-xl font-black text-stone-950 block">
                {{ currencyStore.isEur ? currencyStore.toEurOnly(cartStore.subtotal) : currencyStore.toXofOnly(cartStore.subtotal) }}
              </span>
              <span class="text-xs text-stone-500 font-bold block">
                {{ currencyStore.isEur ? currencyStore.toXofOnly(cartStore.subtotal) : '≈ ' + currencyStore.toEurOnly(cartStore.subtotal) }}
              </span>
            </div>
          </div>
          <p class="text-xs text-stone-500">Validation rapide sur WhatsApp. Aucun paiement en ligne requis, règlement à la livraison.</p>

          <router-link
            to="/checkout"
            @click="cartStore.toggleDrawer(false)"
            class="w-full py-3.5 bg-stone-900 hover:bg-gold-600 text-white font-medium text-sm rounded-xl text-center block transition-all shadow-md hover:shadow-lg"
          >
            Valider et Commander
          </router-link>

          <button
            @click="orderCartByPhone"
            class="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>📞</span>
            <span>Commander ce panier par Téléphone / WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import { useCurrencyStore } from '../stores/currency';
import { usePhoneStore } from '../stores/phone';

const cartStore = useCartStore();
const currencyStore = useCurrencyStore();
const phoneStore = usePhoneStore();

const orderCartByPhone = () => {
  const summary = cartStore.items
    .map((i) => {
      const photoUrl = phoneStore.toAbsolutePhotoUrl(i.imageUrl);
      return `${i.productName} (${i.color} / ${i.sizeOrShoeSize} x${i.quantity})${photoUrl ? `\nPhoto : ${photoUrl}` : ''}`;
    })
    .join('\n\n');
  const firstPhoto = cartStore.items[0]?.imageUrl || '';
  cartStore.toggleDrawer(false);
  phoneStore.openModal(
    `Panier Jumelles Store: ${summary} - Total: ${cartStore.formattedSubtotal}`,
    firstPhoto
  );
};

const formatPrice = (price: number) => {
  return currencyStore.formatPrice(price);
};
</script>

