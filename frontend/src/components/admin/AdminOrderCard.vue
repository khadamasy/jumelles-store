<template>
  <article class="oc" :class="`st-${order.status}`">
    <header class="oc-h">
      <div class="oc-id">
        <span class="oc-num">{{ order.orderNumber }}</span>
        <span class="oc-ago">{{ formatAgo(order.createdAt) }}</span>
      </div>
      <span class="pill" :class="statusTones[order.status]">{{ statusLabels[order.status] || order.status }}</span>
    </header>

    <div class="oc-who">
      <b>{{ order.customerName }}</b>
      <span v-if="showPhone" class="tnum">{{ order.customerPhone }}</span>
    </div>
    <p class="oc-addr">
      <MapPin aria-hidden="true" />
      {{ order.shippingCity }}<template v-if="order.shippingAddress"> · {{ order.shippingAddress }}</template>
    </p>

    <p class="oc-items">{{ formatOrderItems(order) }}</p>

    <footer class="oc-f">
      <span class="oc-tot tnum">{{ formatMoney(order.totalAmount) }}</span>
      <div class="oc-acts">
        <a class="ib oc-ib" :href="`tel:${cleanDigits(order.customerPhone)}`" :aria-label="`Appeler ${order.customerName}`" title="Appeler">
          <Phone aria-hidden="true" />
        </a>
        <a
          class="ib oc-ib oc-wa"
          :href="customerWhatsAppUrl(order)"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Écrire à ${order.customerName} sur WhatsApp`"
          title="WhatsApp"
        >
          <IconWhatsApp className="w-[18px] h-[18px]" />
        </a>
        <button
          v-if="allowedNext(order.status).length > 0"
          type="button"
          class="btn dark sm"
          @click="emit('change-status', order)"
        >
          {{ primaryNextText(order.status) }}
        </button>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { MapPin, Phone } from 'lucide-vue-next';
import IconWhatsApp from '../icons/IconWhatsApp.vue';
import {
  statusLabels,
  statusTones,
  formatAgo,
  formatMoney,
  formatOrderItems,
  cleanDigits,
  customerWhatsAppUrl,
  allowedNext,
  primaryNextText,
} from '../../utils/adminOrders';

withDefaults(defineProps<{ order: any; showPhone?: boolean }>(), { showPhone: false });
const emit = defineEmits<{ (e: 'change-status', order: any): void }>();
</script>

<style scoped>
.oc {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  padding: var(--s-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-1);
  transition: border-color var(--dur-2), box-shadow var(--dur-3) var(--ease-out);
}
.oc:hover {
  border-color: var(--border-strong);
  box-shadow: var(--sh-2);
}
.oc::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 16px;
  bottom: 16px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: transparent;
}
.st-PENDING::before {
  background: var(--warning);
}
.st-PAID::before {
  background: var(--success);
}

.oc-h {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-2);
}
.oc-id {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.oc-num {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  font-weight: 700;
}
.oc-ago {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}
.oc-who {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px var(--s-2);
  margin-top: var(--s-1);
}
.oc-who b {
  font-weight: 600;
}
.oc-who span {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
.oc-addr {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0;
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.oc-addr svg {
  width: 13px;
  height: 13px;
  flex: none;
  margin-top: 2px;
}
.oc-items {
  margin: 0;
  padding: var(--s-2) var(--s-3);
  border-radius: var(--r-sm);
  background: var(--bg-sunken);
  font-size: var(--fs-sm);
  line-height: 1.45;
}
.oc-f {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-2);
  margin-top: auto;
  padding-top: var(--s-2);
}
.oc-tot {
  font-weight: 700;
}
.oc-acts {
  display: flex;
  align-items: center;
  gap: var(--s-1);
}
.oc-ib {
  width: 38px;
  height: 38px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  color: var(--text-muted);
}
.oc-ib :deep(svg) {
  width: 18px;
  height: 18px;
}
.oc-ib:hover {
  color: var(--text);
  background: var(--bg-sunken);
}
.oc-wa {
  color: var(--wa);
}
.oc-wa:hover {
  color: var(--wa);
  background: var(--wa-soft);
}
</style>
