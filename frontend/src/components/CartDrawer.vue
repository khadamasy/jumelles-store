<template>
  <UiModal
    :open="cartStore.isDrawerOpen"
    variant="drawer"
    label="Mon panier"
    close-label="Fermer le panier"
    flush
    @close="cartStore.toggleDrawer(false)"
  >
    <template #header>
      <div class="cd-hd">
        <h2>Mon panier</h2>
        <span v-if="cartStore.totalItems > 0" class="pill plain tnum">
          {{ cartStore.totalItems }} article{{ cartStore.totalItems > 1 ? 's' : '' }}
        </span>
      </div>
    </template>

    <UiEmpty
      v-if="cartStore.items.length === 0"
      title="Votre panier est vide"
      text="Découvrez nos sacs et nos chaussures : chaque pièce est disponible à Dakar."
      heading-tag="p"
    >
      <template #icon><ShoppingBag /></template>
      <router-link to="/catalog" class="btn dark" @click="cartStore.toggleDrawer(false)">
        Explorer la collection
      </router-link>
    </UiEmpty>

    <TransitionGroup v-else tag="ul" name="list" class="cd-list">
      <li v-for="item in cartStore.items" :key="item.variantId" class="cd-item">
        <img
          :src="item.imageUrl"
          :alt="item.productName"
          loading="lazy"
          decoding="async"
          class="cd-img"
        />
        <div class="cd-info">
          <div class="cd-top">
            <h3>{{ item.productName }}</h3>
            <button
              type="button"
              class="cd-rm"
              :aria-label="`Retirer ${item.productName} du panier`"
              @click="cartStore.removeItem(item.variantId)"
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <p class="cd-var">
            {{ item.color }}<template v-if="item.sizeOrShoeSize"> · {{ item.sizeOrShoeSize }}</template>
          </p>
          <div class="cd-bot">
            <UiQty
              :model-value="item.quantity"
              :max="item.maxStock"
              size="sm"
              allow-remove
              :label="`Quantité de ${item.productName}`"
              @update:model-value="(q) => cartStore.updateQuantity(item.variantId, q)"
            />
            <span class="cd-price tnum">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
        </div>
      </li>
    </TransitionGroup>

    <template v-if="cartStore.items.length > 0" #footer>
      <div class="cd-ft">
        <div class="cd-total">
          <span>Sous-total</span>
          <div>
            <strong class="tnum">
              {{ currencyStore.isEur ? currencyStore.toEurOnly(cartStore.subtotal) : currencyStore.toXofOnly(cartStore.subtotal) }}
            </strong>
            <small class="tnum">
              {{ currencyStore.isEur ? currencyStore.toXofOnly(cartStore.subtotal) : '≈ ' + currencyStore.toEurOnly(cartStore.subtotal) }}
            </small>
          </div>
        </div>
        <p class="cd-note">
          <Truck aria-hidden="true" />
          Livraison offerte à Dakar · paiement à la réception
        </p>

        <router-link to="/checkout" class="btn gold lg block" @click="cartStore.toggleDrawer(false)">
          Commander
          <ArrowRight aria-hidden="true" />
        </router-link>

        <button type="button" class="btn ghost block cd-wa" @click="orderCartByPhone">
          <IconWhatsApp className="w-4 h-4" />
          Commander par téléphone ou WhatsApp
        </button>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { ShoppingBag, X, Truck, ArrowRight } from 'lucide-vue-next';
import UiModal from './ui/UiModal.vue';
import UiEmpty from './ui/UiEmpty.vue';
import UiQty from './ui/UiQty.vue';
import IconWhatsApp from './icons/IconWhatsApp.vue';
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
  phoneStore.openModal(`Panier Jumelles Store: ${summary} - Total: ${cartStore.formattedSubtotal}`, firstPhoto);
};

const formatPrice = (price: number) => currencyStore.formatPrice(price);
</script>

<style scoped>
.cd-hd {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--s-3);
}
.cd-hd h2 {
  margin: 0;
  font-size: var(--fs-lg);
}

.cd-list {
  position: relative;
  list-style: none;
  margin: 0;
  padding: var(--s-2) var(--s-5);
}
.cd-item {
  display: flex;
  gap: var(--s-4);
  padding: var(--s-4) 0;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.cd-item:last-child {
  border-bottom: 0;
}
.cd-img {
  width: 84px;
  height: 105px;
  flex: none;
  object-fit: cover;
  border-radius: var(--r-sm);
  background: var(--bg-sunken);
}
.cd-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.cd-top {
  display: flex;
  align-items: flex-start;
  gap: var(--s-2);
}
.cd-top h3 {
  flex: 1;
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: 600;
  line-height: var(--lh-snug);
  letter-spacing: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.cd-rm {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  margin: -6px -6px 0 0;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--text-faint);
  cursor: pointer;
  transition: background-color var(--dur-2), color var(--dur-2);
}
.cd-rm:hover {
  background: var(--danger-soft);
  color: var(--danger);
}
.cd-rm svg {
  width: 16px;
  height: 16px;
}
.cd-var {
  margin: 2px 0 0;
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.cd-bot {
  margin-top: auto;
  padding-top: var(--s-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-2);
}
.cd-price {
  font-weight: 700;
  font-size: var(--fs-sm);
  text-align: right;
}

.cd-ft {
  display: grid;
  gap: var(--s-3);
}
.cd-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.cd-total > span {
  font-weight: 600;
}
.cd-total div {
  text-align: right;
}
.cd-total strong {
  display: block;
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: 500;
}
.cd-total small {
  color: var(--text-muted);
  font-size: var(--fs-xs);
}
.cd-note {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  margin: 0;
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.cd-note svg {
  width: 16px;
  height: 16px;
  color: var(--success);
}
.cd-wa {
  color: var(--wa);
  font-size: var(--fs-sm);
}
</style>
