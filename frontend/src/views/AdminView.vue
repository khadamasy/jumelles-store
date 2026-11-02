<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
    <!-- Header Admin -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
      <div>
        <div class="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
          <span>👑</span> Espace Direction & Administration
        </div>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Tableau de Bord Jumelles Store
        </h1>
        <p class="text-sm text-stone-500 mt-1">
          Pilotez vos ventes de sacs et de chaussures, stocks et transactions Wave / OM.
        </p>
      </div>

      <!-- Quick Switch to Admin demo if needed -->
      <div v-if="!authStore.isAdmin" class="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center gap-3">
        <span class="text-xs text-amber-900">Vous êtes en mode visiteur.</span>
        <button
          @click="authStore.loginAsDemoAdmin"
          class="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-lg shadow"
        >
          Se connecter en tant qu'Administratrice
        </button>
      </div>
    </div>

    <!-- KPI Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <span class="text-xs uppercase tracking-wider text-stone-400 font-bold block mb-1">Chiffre d'Affaires</span>
        <p class="font-serif text-2xl font-bold text-emerald-600">{{ formatPrice(stats.totalRevenue) }}</p>
        <span class="text-[11px] text-stone-500 mt-1 block">Commandes encaissées</span>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <span class="text-xs uppercase tracking-wider text-stone-400 font-bold block mb-1">Total Commandes</span>
        <p class="font-serif text-2xl font-bold text-stone-900">{{ stats.totalOrders }}</p>
        <span class="text-[11px] text-stone-500 mt-1 block">Sur la plateforme</span>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <span class="text-xs uppercase tracking-wider text-stone-400 font-bold block mb-1">À Traiter / Expédier</span>
        <p class="font-serif text-2xl font-bold text-amber-600">{{ stats.pendingOrders }}</p>
        <span class="text-[11px] text-stone-500 mt-1 block">En attente d'expédition</span>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <span class="text-xs uppercase tracking-wider text-stone-400 font-bold block mb-1">Alertes Stocks Faibles</span>
        <p class="font-serif text-2xl font-bold text-rosewood-600">{{ stats.lowStockCount }}</p>
        <span class="text-[11px] text-stone-500 mt-1 block">Variantes &lt; 5 unités</span>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-stone-200 gap-8 text-sm font-semibold">
      <button
        @click="activeTab = 'products'"
        class="pb-3 border-b-2 transition-all flex items-center gap-2"
        :class="activeTab === 'products' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'"
      >
        <span>👜</span> Gestion des Produits & Variantes
      </button>

      <button
        @click="activeTab = 'orders'"
        class="pb-3 border-b-2 transition-all flex items-center gap-2"
        :class="activeTab === 'orders' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'"
      >
        <span>📦</span> Suivi & Validation des Commandes
      </button>
    </div>

    <!-- TAB 1: Gestion des Produits -->
    <div v-if="activeTab === 'products'" class="space-y-8">
      <!-- Formulaire d'ajout d'article -->
      <div class="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b border-stone-100 pb-4">
          <h3 class="font-serif text-lg font-bold text-stone-900">
            Ajouter un Nouveau Produit (Sacs / Chaussures)
          </h3>
          <span class="text-xs text-stone-400">Stockage MinIO S3 automatique</span>
        </div>

        <form @submit.prevent="handleCreateProduct" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-semibold text-stone-600 mb-1">Nom de l'article *</label>
            <input
              v-model="newProduct.name"
              type="text"
              placeholder="Ex: Escarpins Python Doré 2026"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-600 mb-1">Catégorie *</label>
            <select
              v-model="newProduct.categoryId"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none bg-white"
              required
            >
              <option value="cat-sac-1">Sacs à Main & Cabas (SAC)</option>
              <option value="cat-sac-2">Pochettes & Bandoulières (SAC)</option>
              <option value="cat-shoe-1">Escarpins & Talons Hauts (CHAUSSURE)</option>
              <option value="cat-shoe-2">Sandales & Mules d'Été (CHAUSSURE)</option>
              <option value="cat-shoe-3">Baskets & Sneakers Chic (CHAUSSURE)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-600 mb-1">Prix de Base (FCFA) *</label>
            <input
              v-model.number="newProduct.basePrice"
              type="number"
              placeholder="Ex: 35000"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-stone-600 mb-1">Photo du Produit (Upload vers MinIO) *</label>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-gold-600"
            />
            <p v-if="uploadedImageUrl" class="text-[11px] text-emerald-600 mt-1 font-medium">
              ✓ Image prête dans MinIO
            </p>
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-stone-600 mb-1">Description détaillée *</label>
            <textarea
              v-model="newProduct.description"
              rows="3"
              placeholder="Description des matières, du talon ou de la maroquinerie..."
              class="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
              required
            ></textarea>
          </div>

          <div class="md:col-span-2 flex justify-end">
            <button
              type="submit"
              :disabled="isCreating"
              class="px-6 py-3 bg-stone-900 hover:bg-gold-600 text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              {{ isCreating ? 'Enregistrement...' : 'Ajouter l\'article au catalogue' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Liste des Produits Existants -->
      <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-stone-100 flex items-center justify-between">
          <h3 class="font-serif text-lg font-bold text-stone-900">Articles en Vente</h3>
          <span class="text-xs text-stone-500">{{ products.length }} produit(s)</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-100">
              <tr>
                <th class="px-6 py-4">Article</th>
                <th class="px-6 py-4">Prix de base</th>
                <th class="px-6 py-4">Variantes & Stocks</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr v-for="prod in products" :key="prod.id" class="hover:bg-stone-50/50">
                <td class="px-6 py-4 flex items-center gap-3">
                  <img
                    :src="prod.images?.[0]?.minioUrl || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80'"
                    class="w-12 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                  />
                  <div>
                    <p class="font-bold text-stone-900">{{ prod.name }}</p>
                    <p class="text-xs text-stone-400">{{ prod.slug }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 font-bold text-stone-900">
                  {{ formatPrice(prod.basePrice) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="v in prod.variants"
                      :key="v.id"
                      class="px-2 py-0.5 rounded text-[10px] font-semibold"
                      :class="v.stockQuantity > 3 ? 'bg-stone-100 text-stone-700' : 'bg-rosewood-100 text-rosewood-800'"
                    >
                      {{ v.color }} ({{ v.sizeOrShoeSize }}) : {{ v.stockQuantity }} en stock
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click="handleDeleteProduct(prod.id)"
                    class="text-xs text-rosewood-600 hover:text-rosewood-800 font-semibold"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: Suivi & Validation des Commandes -->
    <div v-if="activeTab === 'orders'" class="space-y-6">
      <div class="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-stone-100 flex items-center justify-between">
          <h3 class="font-serif text-lg font-bold text-stone-900">Toutes les Commandes Clients</h3>
          <span class="text-xs text-stone-500">{{ orders.length }} commande(s)</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-100">
              <tr>
                <th class="px-6 py-4">N° Commande</th>
                <th class="px-6 py-4">Client</th>
                <th class="px-6 py-4">Montant</th>
                <th class="px-6 py-4">Statut Actuel</th>
                <th class="px-6 py-4">Changer le Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-stone-50/50">
                <td class="px-6 py-4 font-mono font-bold text-stone-900">
                  {{ order.orderNumber }}
                </td>
                <td class="px-6 py-4">
                  <p class="font-bold text-stone-900">{{ order.customerName }}</p>
                  <p class="text-xs text-stone-500">{{ order.customerPhone }} • {{ order.shippingCity }}</p>
                </td>
                <td class="px-6 py-4 font-bold text-stone-950">
                  {{ formatPrice(order.totalAmount) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    :class="getStatusBadgeClass(order.status)"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <select
                    :value="order.status"
                    @change="handleStatusChange(order.id, ($event.target as HTMLSelectElement).value)"
                    class="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                  >
                    <option value="PENDING">PENDING (En attente)</option>
                    <option value="PAID">PAID (Payée Wave/OM)</option>
                    <option value="PREPARING">PREPARING (Préparation)</option>
                    <option value="SHIPPED">SHIPPED (Expédiée)</option>
                    <option value="DELIVERED">DELIVERED (Livrée)</option>
                    <option value="CANCELLED">CANCELLED (Annulée)</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { ProductService, OrderService, UploadService } from '../services/api';

const authStore = useAuthStore();
const activeTab = ref<'products' | 'orders'>('products');

const stats = reactive({
  totalRevenue: 0,
  totalOrders: 0,
  pendingOrders: 0,
  lowStockCount: 0,
});

const products = ref<any[]>([]);
const orders = ref<any[]>([]);
const isCreating = ref(false);
const uploadedImageUrl = ref('');

const newProduct = reactive({
  name: '',
  categoryId: 'cat-shoe-1',
  basePrice: 35000,
  description: '',
});

const loadData = async () => {
  try {
    const statsRes = await OrderService.getStats();
    Object.assign(stats, statsRes.data.data);

    const prodRes = await ProductService.getAll();
    products.value = prodRes.data.data;

    const ordersRes = await OrderService.getAllAdmin();
    orders.value = ordersRes.data.data;
  } catch (error) {
    console.error('Erreur chargement back-office:', error);
  }
};

const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];

  try {
    const res = await UploadService.uploadImage(file);
    uploadedImageUrl.value = res.data.data.url;
  } catch (error) {
    console.error('Erreur upload MinIO:', error);
    alert('Erreur lors du téléversement sur MinIO.');
  }
};

const handleCreateProduct = async () => {
  isCreating.value = true;
  try {
    const isShoe = newProduct.categoryId.includes('shoe');
    const defaultVariants = isShoe
      ? [
          { sizeOrShoeSize: '37', color: 'Noir', sku: `SKU-${Date.now()}-37`, stockQuantity: 6 },
          { sizeOrShoeSize: '38', color: 'Noir', sku: `SKU-${Date.now()}-38`, stockQuantity: 8 },
          { sizeOrShoeSize: '39', color: 'Noir', sku: `SKU-${Date.now()}-39`, stockQuantity: 5 },
        ]
      : [
          { sizeOrShoeSize: 'Standard', color: 'Noir', sku: `SKU-${Date.now()}-STD`, stockQuantity: 10 },
        ];

    const payload = {
      name: newProduct.name,
      categoryId: newProduct.categoryId,
      basePrice: newProduct.basePrice,
      description: newProduct.description,
      isFeatured: true,
      variants: defaultVariants,
      images: [
        {
          minioUrl:
            uploadedImageUrl.value ||
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
          altText: newProduct.name,
        },
      ],
    };

    await ProductService.create(payload);
    alert('Produit ajouté avec succès !');
    newProduct.name = '';
    newProduct.description = '';
    uploadedImageUrl.value = '';
    loadData();
  } catch (error: any) {
    console.error('Erreur création produit:', error);
    alert(error.response?.data?.message || 'Erreur lors de l\'ajout.');
  } finally {
    isCreating.value = false;
  }
};

const handleDeleteProduct = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
  try {
    await ProductService.delete(id);
    loadData();
  } catch (error) {
    console.error('Erreur suppression:', error);
  }
};

const handleStatusChange = async (orderId: string, newStatus: string) => {
  try {
    await OrderService.updateStatus(orderId, newStatus);
    loadData();
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price);
};

const getStatusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800 border border-amber-300',
    PAID: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    PREPARING: 'bg-blue-100 text-blue-800 border border-blue-300',
    SHIPPED: 'bg-purple-100 text-purple-800 border border-purple-300',
    DELIVERED: 'bg-stone-100 text-stone-800 border border-stone-300',
    CANCELLED: 'bg-rosewood-100 text-rosewood-800 border border-rosewood-300',
  };
  return map[status] || 'bg-stone-100 text-stone-700';
};

onMounted(() => {
  loadData();
});
</script>
