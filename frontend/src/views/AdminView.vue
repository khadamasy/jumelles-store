<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
    <!-- Header Admin avec Contact Officiel -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-200 pb-8 bg-gradient-to-r from-stone-900 to-stone-950 p-8 rounded-3xl text-white shadow-xl">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 border border-gold-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <span>👑</span> Espace Gérance & Direction Jumelles Store
        </div>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
          Gestion & Renouvellement des Produits
        </h1>
        <p class="text-sm text-stone-300 font-light max-w-xl">
          Contrôlez vos stocks de maroquinerie et souliers en temps réel, réapprovisionnez vos variantes et traitez les commandes Wave & Orange Money.
        </p>
        <div class="flex items-center gap-2 text-xs text-gold-400 pt-2 font-medium">
          <span>📞 Contact gérance boutique :</span>
          <span class="font-bold underline">+221 77 208 78 20</span>
        </div>
      </div>

      <!-- Quick Switch to Admin demo if needed -->
      <div v-if="!authStore.isAdmin" class="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-3 shrink-0">
        <p class="text-xs text-stone-200">Mode démonstration actif :</p>
        <button
          @click="authStore.loginAsDemoAdmin"
          class="w-full px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 text-xs font-bold rounded-xl shadow-lg transition-all"
        >
          Débloquer Droits Directrice (Admin)
        </button>
      </div>
      <div v-else class="flex items-center gap-3 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-4 py-2 rounded-2xl text-xs font-semibold">
        <span>✓</span> Droits Administrateur Activés
      </div>
    </div>

    <!-- Notification Toast de Succès / Erreur -->
    <div
      v-if="toastMessage"
      class="p-4 rounded-2xl text-sm font-semibold flex items-center justify-between shadow-lg transition-all"
      :class="toastType === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rosewood-100 text-rosewood-900 border border-rosewood-300'"
    >
      <div class="flex items-center gap-2">
        <span>{{ toastType === 'success' ? '✅' : '⚠️' }}</span>
        <span>{{ toastMessage }}</span>
      </div>
      <button @click="toastMessage = ''" class="text-xs font-bold px-2">✕</button>
    </div>

    <!-- KPI Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
        <span class="text-xs uppercase tracking-wider text-stone-400 font-bold block mb-1">Chiffre d'Affaires Encaissé</span>
        <p class="font-serif text-3xl font-black text-emerald-600">{{ formatPrice(stats.totalRevenue) }}</p>
        <span class="text-xs text-stone-500 mt-1 block">Règlements Wave & OM confirmés</span>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
        <span class="text-xs uppercase tracking-wider text-stone-400 font-bold block mb-1">Total Commandes</span>
        <p class="font-serif text-3xl font-black text-stone-900">{{ stats.totalOrders }}</p>
        <span class="text-xs text-stone-500 mt-1 block">Toutes commandes confondues</span>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
        <span class="text-xs uppercase tracking-wider text-stone-400 font-bold block mb-1">Commandes en Préparation</span>
        <p class="font-serif text-3xl font-black text-amber-600">{{ stats.pendingOrders }}</p>
        <span class="text-xs text-stone-500 mt-1 block">À emballer et expédier</span>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
        <span class="text-xs uppercase tracking-wider text-stone-400 font-bold block mb-1">Alertes Réapprovisionnement</span>
        <p class="font-serif text-3xl font-black text-rosewood-600">{{ stats.lowStockCount }}</p>
        <span class="text-xs text-stone-500 mt-1 block">Variantes avec stock &lt; 5 unités</span>
      </div>
    </div>

    <!-- Navigation Tabs Principaux -->
    <div class="flex flex-wrap border-b border-stone-200 gap-4 sm:gap-8 text-sm font-bold">
      <button
        @click="activeTab = 'replenish'"
        class="pb-4 border-b-2 transition-all flex items-center gap-2"
        :class="activeTab === 'replenish' ? 'border-gold-600 text-stone-950 font-black' : 'border-transparent text-stone-400 hover:text-stone-700'"
      >
        <span>🔄</span> Renouvellement Rapide des Stocks
      </button>

      <button
        @click="activeTab = 'new-product'"
        class="pb-4 border-b-2 transition-all flex items-center gap-2"
        :class="activeTab === 'new-product' ? 'border-gold-600 text-stone-950 font-black' : 'border-transparent text-stone-400 hover:text-stone-700'"
      >
        <span>✨</span> Créer un Nouvel Article (MinIO)
      </button>

      <button
        @click="activeTab = 'orders'"
        class="pb-4 border-b-2 transition-all flex items-center gap-2"
        :class="activeTab === 'orders' ? 'border-gold-600 text-stone-950 font-black' : 'border-transparent text-stone-400 hover:text-stone-700'"
      >
        <span>📦</span> Traitement des Commandes ({{ orders.length }})
      </button>

      <button
        @click="activeTab = 'phone-calls'"
        class="pb-4 border-b-2 transition-all flex items-center gap-2"
        :class="activeTab === 'phone-calls' ? 'border-gold-600 text-stone-950 font-black' : 'border-transparent text-stone-400 hover:text-stone-700'"
      >
        <span>📞</span> Téléphonie & Rappels ({{ pendingCallsCount }})
      </button>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 1 : RENOUVELLEMENT & RÉAPPROVISIONNEMENT RAPIDE DU STOCK     -->
    <!-- ============================================================== -->
    <div v-if="activeTab === 'replenish'" class="space-y-8">
      <!-- Filtres d'affichage du stock -->
      <div class="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 class="font-serif text-xl font-bold text-stone-900">
            Inventaire & Réapprovisionnement des Stocks
          </h2>
          <p class="text-xs text-stone-500 mt-0.5">
            Cliquez sur les boutons rapides (+5, +10, +20) ou saisissez le nombre d'unités reçues du fournisseur.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="stockFilter = 'ALL'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
            :class="stockFilter === 'ALL' ? 'bg-stone-900 text-white shadow' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
          >
            Tous les Articles
          </button>
          <button
            @click="stockFilter = 'LOW'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            :class="stockFilter === 'LOW' ? 'bg-amber-600 text-white shadow' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'"
          >
            <span>⚠️</span> Stocks Faibles (≤ 5)
          </button>
          <button
            @click="stockFilter = 'OUT'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            :class="stockFilter === 'OUT' ? 'bg-rosewood-600 text-white shadow' : 'bg-rosewood-50 text-rosewood-800 border border-rosewood-200 hover:bg-rosewood-100'"
          >
            <span>🚨</span> Ruptures (0)
          </button>
        </div>
      </div>

      <!-- Liste détaillée des articles et de leurs variantes -->
      <div class="space-y-6">
        <div
          v-for="product in filteredInventoryProducts"
          :key="product.id"
          class="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden"
        >
          <!-- Entête Produit -->
          <div class="p-6 bg-stone-50/70 border-b border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <img
                :src="product.images?.[0]?.minioUrl || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80'"
                :alt="product.name"
                class="w-16 h-16 object-cover rounded-2xl bg-stone-200 border border-stone-300 shadow-sm shrink-0"
              />
              <div>
                <span class="text-[10px] uppercase font-bold tracking-wider text-gold-700 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                  {{ product.category?.name || 'Maroquinerie' }}
                </span>
                <h3 class="font-serif font-bold text-lg text-stone-900 mt-1">
                  {{ product.name }}
                </h3>
                <div class="flex flex-wrap items-center gap-2 mt-1">
                  <span class="text-xs text-stone-500">Prix actuel :</span>
                  <span class="font-serif font-black text-stone-950 text-sm">{{ formatPrice(product.basePrice) }}</span>
                  <span
                    v-if="product.originalPrice && product.originalPrice > product.basePrice"
                    class="text-[11px] text-rosewood-600 bg-rosewood-50 border border-rosewood-200 px-2 py-0.5 rounded-md font-bold"
                  >
                    Barré : {{ formatPrice(product.originalPrice) }} (-{{ Math.round((1 - product.basePrice / product.originalPrice) * 100) }}%)
                  </span>
                  <button
                    @click="openEditPriceModal(product)"
                    class="text-[11px] text-gold-900 bg-gold-100/80 hover:bg-gold-200 border border-gold-300 font-bold px-2.5 py-0.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    title="Changer le prix de vente de cet article"
                  >
                    <span>✏️</span> Modifier prix
                  </button>
                  <span class="text-xs text-stone-400">• Total en stock : <strong>{{ getTotalStock(product) }} unité(s)</strong></span>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2.5">
              <button
                @click="openEditPriceModal(product)"
                class="px-3.5 py-2 bg-gold-50 hover:bg-gold-100 text-gold-900 text-xs font-bold rounded-xl transition-all border border-gold-300 flex items-center gap-1.5 shadow-sm"
              >
                <span>💰</span> Modifier le prix
              </button>
              <button
                @click="openAddVariantModal(product)"
                class="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-all border border-stone-300"
              >
                + Ajouter une pointure / couleur
              </button>
              <button
                @click="handleDeleteProduct(product.id)"
                class="px-3.5 py-2 text-rosewood-600 hover:bg-rosewood-50 text-xs font-bold rounded-xl transition-all"
              >
                Supprimer
              </button>
            </div>
          </div>

          <!-- Tableau des Variantes & Boutons de Réapprovisionnement -->
          <div class="p-6 overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="text-stone-400 uppercase tracking-wider border-b border-stone-100 pb-3">
                  <th class="pb-3 font-semibold">Variante (Couleur / Pointure)</th>
                  <th class="pb-3 font-semibold">Référence SKU</th>
                  <th class="pb-3 font-semibold">État du Stock</th>
                  <th class="pb-3 font-semibold">Quantité Actuelle</th>
                  <th class="pb-3 font-semibold text-right">Renouveler le stock</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100">
                <tr v-for="variant in product.variants" :key="variant.id" class="hover:bg-stone-50/50">
                  <!-- Variante -->
                  <td class="py-4">
                    <p class="font-bold text-stone-900 text-sm">
                      {{ variant.color }} • {{ isShoe(product) ? 'Pointure ' + variant.sizeOrShoeSize : variant.sizeOrShoeSize }}
                    </p>
                  </td>

                  <!-- SKU -->
                  <td class="py-4 font-mono text-stone-500">
                    {{ variant.sku }}
                  </td>

                  <!-- Badge État Stock -->
                  <td class="py-4">
                    <span
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                      :class="getStockBadgeClass(variant.stockQuantity)"
                    >
                      <span class="w-2 h-2 rounded-full" :class="getStockDotClass(variant.stockQuantity)"></span>
                      <span>{{ getStockStatusLabel(variant.stockQuantity) }}</span>
                    </span>
                  </td>

                  <!-- Quantité Actuelle -->
                  <td class="py-4 font-bold text-stone-900 text-sm">
                    {{ variant.stockQuantity }} pièce(s)
                  </td>

                  <!-- Actions de Renouvellement Rapide -->
                  <td class="py-4 text-right">
                    <div class="inline-flex items-center gap-2 justify-end">
                      <!-- Boutons +5, +10, +20 -->
                      <button
                        @click="quickReplenish(product.id, variant.id, 5)"
                        class="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 transition-colors"
                        title="Ajouter 5 unités"
                      >
                        +5
                      </button>
                      <button
                        @click="quickReplenish(product.id, variant.id, 10)"
                        class="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 transition-colors"
                        title="Ajouter 10 unités"
                      >
                        +10
                      </button>
                      <button
                        @click="quickReplenish(product.id, variant.id, 20)"
                        class="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 transition-colors"
                        title="Ajouter 20 unités"
                      >
                        +20
                      </button>

                      <!-- Saisie manuelle de stock -->
                      <div class="flex items-center gap-1 ml-2">
                        <input
                          v-model.number="variantInputs[variant.id]"
                          type="number"
                          placeholder="Qté"
                          class="w-16 px-2 py-1.5 text-xs border border-stone-300 rounded-lg text-center outline-none focus:ring-1 focus:ring-gold-500"
                        />
                        <button
                          @click="submitCustomReplenish(product.id, variant.id)"
                          class="px-3 py-1.5 bg-stone-900 hover:bg-gold-600 text-white font-bold rounded-lg shadow-sm transition-all"
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 2 : CRÉATION D'UN NOUVEL ARTICLE DANS LE CATALOGUE         -->
    <!-- ============================================================== -->
    <div v-if="activeTab === 'new-product'" class="space-y-8">
      <div class="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-sm space-y-6 max-w-4xl mx-auto">
        <div class="border-b border-stone-100 pb-4">
          <span class="text-xs uppercase tracking-wider text-gold-700 font-bold block mb-1">Nouveau Modèle</span>
          <h2 class="font-serif text-2xl font-bold text-stone-900">
            Enregistrer un Sac ou une Paire de Chaussures
          </h2>
          <p class="text-xs text-stone-500 mt-1">
            Les photos sont directement sauvegardées dans votre bucket de stockage <strong>MinIO S3</strong>.
          </p>
        </div>

        <form @submit.prevent="handleCreateProduct" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-stone-700 mb-1">Nom complet du produit *</label>
            <input
              v-model="newProduct.name"
              type="text"
              placeholder="Ex: Sac Cabas Royal Python Doré"
              class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Catégorie de produit *</label>
            <select
              v-model="newProduct.categoryId"
              class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none bg-white font-medium"
              required
            >
              <option value="cat-sac-1">👜 Sacs à Main & Cabas (SAC)</option>
              <option value="cat-sac-2">👛 Pochettes & Bandoulières (SAC)</option>
              <option value="cat-shoe-1">👠 Escarpins & Talons Hauts (CHAUSSURE)</option>
              <option value="cat-shoe-2">👡 Sandales & Mules d'Été (CHAUSSURE)</option>
              <option value="cat-shoe-3">👟 Baskets & Sneakers Chic (CHAUSSURE)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Prix de Vente (FCFA) *</label>
            <input
              v-model.number="newProduct.basePrice"
              type="number"
              placeholder="Ex: 45000"
              class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none font-bold"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Téléverser la Photo (MinIO S3) *</label>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-900 file:text-white hover:file:bg-gold-600 cursor-pointer"
            />
            <p v-if="uploadedImageUrl" class="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <span>✓</span> Image hébergée avec succès dans le stockage MinIO
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Mise en avant sur l'accueil</label>
            <div class="flex items-center gap-2 mt-3">
              <input
                id="featuredCheck"
                v-model="newProduct.isFeatured"
                type="checkbox"
                class="w-4 h-4 text-gold-600 rounded border-stone-300 focus:ring-gold-500"
              />
              <label for="featuredCheck" class="text-xs text-stone-700 font-semibold cursor-pointer">
                Afficher dans la sélection « Pièces Phares »
              </label>
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-stone-700 mb-1">Description & Caractéristiques *</label>
            <textarea
              v-model="newProduct.description"
              rows="3"
              placeholder="Précisez la matière (cuir, daim, croco), la hauteur du talon ou la finition de la doublure..."
              class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
              required
            ></textarea>
          </div>

          <div class="md:col-span-2 pt-4 flex justify-end">
            <button
              type="submit"
              :disabled="isCreating"
              class="px-8 py-3.5 bg-gradient-to-r from-stone-950 to-stone-900 hover:from-gold-600 hover:to-gold-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              {{ isCreating ? 'Enregistrement en cours...' : 'Ajouter le Modèle à la Boutique' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 3 : SUIVI & TRAITEMENT DES COMMANDES CLIENTS               -->
    <!-- ============================================================== -->
    <div v-if="activeTab === 'orders'" class="space-y-6">
      <div class="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 class="font-serif text-lg font-bold text-stone-900">Commandes Reçues</h3>
            <p class="text-xs text-stone-400">Validez les expéditions Wave et Orange Money</p>
          </div>
          <span class="text-xs font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-full">
            {{ orders.length }} commande(s)
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-100">
              <tr>
                <th class="px-6 py-4">N° Commande</th>
                <th class="px-6 py-4">Acheteur / Contact</th>
                <th class="px-6 py-4">Montant Total</th>
                <th class="px-6 py-4">Statut Actuel</th>
                <th class="px-6 py-4">Mettre à Jour le Statut</th>
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
                <td class="px-6 py-4 font-bold text-stone-950 font-serif">
                  {{ formatPrice(order.totalAmount) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    :class="getOrderBadgeClass(order.status)"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <select
                    :value="order.status"
                    @change="handleStatusChange(order.id, ($event.target as HTMLSelectElement).value)"
                    class="px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-sm"
                  >
                    <option value="PENDING">PENDING (En attente de paiement)</option>
                    <option value="PAID">PAID (Payée Wave / OM)</option>
                    <option value="PREPARING">PREPARING (En cours de préparation)</option>
                    <option value="SHIPPED">SHIPPED (Colis Expédié)</option>
                    <option value="DELIVERED">DELIVERED (Livrée au client)</option>
                    <option value="CANCELLED">CANCELLED (Commande Annulée)</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 4 : DEMANDES DE RAPPEL TÉLÉPHONIQUE & COMMANDES EXPRESS     -->
    <!-- ============================================================== -->
    <div v-if="activeTab === 'phone-calls'" class="space-y-6">
      <div class="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xl">📞</span>
              <h3 class="font-serif text-lg font-bold text-stone-900">Demandes de Rappel Téléphonique</h3>
            </div>
            <p class="text-xs text-stone-400 mt-0.5">Clientes ayant demandé à être rappelées au <strong>+221 77 208 78 20</strong></p>
          </div>
          <span class="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full">
            {{ pendingCallsCount }} appel(s) en attente
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-100">
              <tr>
                <th class="px-6 py-4">Nom de la cliente</th>
                <th class="px-6 py-4">Téléphone</th>
                <th class="px-6 py-4">Article d'intérêt</th>
                <th class="px-6 py-4">Date & Heure</th>
                <th class="px-6 py-4">Statut</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr v-for="call in phoneCallbacks" :key="call.id" class="hover:bg-stone-50/50">
                <td class="px-6 py-4 font-bold text-stone-900">
                  {{ call.customerName }}
                </td>
                <td class="px-6 py-4 font-mono font-bold text-stone-950">
                  <a :href="'tel:' + call.customerPhone" class="text-blue-600 hover:underline flex items-center gap-1.5 font-bold">
                    <span>📞</span>
                    <span>{{ call.customerPhone }}</span>
                  </a>
                </td>
                <td class="px-6 py-4 text-xs text-stone-600">
                  {{ call.productInterest || 'Commande d\'articles' }}
                </td>
                <td class="px-6 py-4 text-xs text-stone-400">
                  {{ new Date(call.createdAt).toLocaleString('fr-FR') }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-bold"
                    :class="call.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'"
                  >
                    {{ call.status === 'PENDING' ? '⏳ À rappeler' : '✓ Contactée' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="inline-flex items-center gap-2">
                    <a
                      :href="'https://wa.me/' + call.customerPhone.replace(/[^0-9]/g, '') + '?text=Bonjour%20' + encodeURIComponent(call.customerName) + '%2C%20c%27est%20Jumelles%20Store%20suite%20%C3%A0%20votre%20demande%20de%20contact'"
                      target="_blank"
                      class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
                      title="Écrire sur WhatsApp"
                    >
                      <span>💬</span> WhatsApp
                    </a>
                    <button
                      v-if="call.status === 'PENDING'"
                      @click="handleCallStatus(call.id, 'CALLED')"
                      class="px-3 py-1.5 bg-stone-900 hover:bg-gold-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      Marquer appelée
                    </button>
                    <button
                      v-else
                      @click="handleCallStatus(call.id, 'PENDING')"
                      class="px-2 py-1.5 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
                    >
                      Remettre en attente
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal pour ajouter une nouvelle variante (Pointure ou Couleur) -->
    <div v-if="selectedProductForVariant" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="font-serif font-bold text-lg text-stone-900">
            Ajouter une Variante
          </h3>
          <button @click="selectedProductForVariant = null" class="text-stone-400 hover:text-stone-700 font-bold">✕</button>
        </div>

        <p class="text-xs text-stone-500">
          Modèle sélectionné : <strong class="text-stone-900">{{ selectedProductForVariant.name }}</strong>
        </p>

        <form @submit.prevent="submitAddVariant" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">
              {{ isShoe(selectedProductForVariant) ? 'Pointure de chaussure (37 à 42) *' : 'Taille / Format de sac *' }}
            </label>
            <input
              v-model="newVariantData.sizeOrShoeSize"
              type="text"
              placeholder="Ex: 38 (entre 37 et 42)"
              class="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:ring-1 focus:ring-gold-500 font-bold"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Couleur *</label>
            <input
              v-model="newVariantData.color"
              type="text"
              placeholder="Ex: Noir Verni ou Rouge Croco"
              class="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:ring-1 focus:ring-gold-500"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Stock initial *</label>
            <input
              v-model.number="newVariantData.stockQuantity"
              type="number"
              placeholder="10"
              class="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:ring-1 focus:ring-gold-500 font-bold"
              required
            />
          </div>

          <div class="pt-3 flex justify-end gap-3">
            <button
              type="button"
              @click="selectedProductForVariant = null"
              class="px-4 py-2 text-xs font-bold text-stone-500 hover:bg-stone-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 bg-stone-900 hover:bg-gold-600 text-white text-xs font-bold rounded-xl shadow transition-all"
            >
              Ajouter la variante
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Modal pour Modifier le Prix de Vente d'un Produit -->
    <div v-if="selectedProductForPrice" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">💰</span>
            <h3 class="font-serif font-bold text-lg text-stone-900">
              Modifier le Prix de Vente
            </h3>
          </div>
          <button @click="selectedProductForPrice = null" class="text-stone-400 hover:text-stone-700 font-bold">✕</button>
        </div>

        <div>
          <p class="text-xs text-stone-500">Article sélectionné :</p>
          <p class="font-serif font-bold text-base text-stone-900">{{ selectedProductForPrice.name }}</p>
          <p class="text-xs text-stone-400 mt-0.5">Prix actuel : <span class="line-through">{{ formatPrice(selectedProductForPrice.basePrice) }}</span></p>
        </div>

        <form @submit.prevent="submitUpdatePrice" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">
              Prix de Vente Effectif (FCFA) *
            </label>
            <input
              v-model.number="editedPrice"
              type="number"
              step="500"
              placeholder="Ex: 12000"
              class="w-full px-4 py-3 rounded-xl border border-stone-300 text-lg font-black text-stone-950 outline-none focus:ring-2 focus:ring-gold-500"
              required
            />
            <p class="text-[11px] text-stone-500 mt-1">
              C'est le montant exact qui sera facturé et débité au client sur Wave ou Orange Money.
            </p>
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">
              Prix d'origine avant réduction / Prix barré (Optionnel)
            </label>
            <input
              v-model.number="editedOriginalPrice"
              type="number"
              step="500"
              placeholder="Ex: 15000 (pour afficher une promotion)"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-600 outline-none focus:ring-2 focus:ring-gold-500"
            />
            <p class="text-[11px] text-stone-500 mt-1">
              Si renseigné, il apparaîtra barré avec un badge de réduction rouge automatique (ex: -20%).
            </p>
          </div>

          <!-- Aperçu réduction en direct -->
          <div
            v-if="editedOriginalPrice && editedOriginalPrice > editedPrice"
            class="p-3 bg-rosewood-50 border border-rosewood-200 rounded-xl flex items-center justify-between text-xs"
          >
            <span class="font-bold text-rosewood-900">🎉 Remise commerciale :</span>
            <span class="font-extrabold text-rosewood-700 bg-rosewood-100 px-2 py-0.5 rounded-lg">
              -{{ Math.round((1 - editedPrice / editedOriginalPrice) * 100) }}% de réduction
            </span>
          </div>

          <div class="pt-3 flex justify-end gap-3">
            <button
              type="button"
              @click="selectedProductForPrice = null"
              class="px-4 py-2 text-xs font-bold text-stone-500 hover:bg-stone-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 font-black text-xs rounded-xl shadow transition-all"
            >
              Enregistrer le tarif
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { ProductService, OrderService, UploadService, PhoneService } from '../services/api';

const authStore = useAuthStore();
const activeTab = ref<'replenish' | 'new-product' | 'orders' | 'phone-calls'>('replenish');
const stockFilter = ref<'ALL' | 'LOW' | 'OUT'>('ALL');

const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');

const stats = reactive({
  totalRevenue: 0,
  totalOrders: 0,
  pendingOrders: 0,
  lowStockCount: 0,
});

const products = ref<any[]>([]);
const orders = ref<any[]>([]);
const phoneCallbacks = ref<any[]>([]);
const variantInputs = reactive<Record<string, number>>({});

const pendingCallsCount = computed(() => {
  return phoneCallbacks.value.filter((c) => c.status === 'PENDING').length;
});

const isCreating = ref(false);
const uploadedImageUrl = ref('');

const newProduct = reactive({
  name: '',
  categoryId: 'cat-sac-1',
  basePrice: 15000,
  description: '',
  isFeatured: true,
});

const selectedProductForVariant = ref<any>(null);
const newVariantData = reactive({
  sizeOrShoeSize: '',
  color: '',
  stockQuantity: 10,
});

const selectedProductForPrice = ref<any>(null);
const editedPrice = ref<number>(0);
const editedOriginalPrice = ref<number | null>(null);

const openEditPriceModal = (product: any) => {
  selectedProductForPrice.value = product;
  editedPrice.value = product.basePrice;
  editedOriginalPrice.value = product.originalPrice || null;
};

const submitUpdatePrice = async () => {
  if (!selectedProductForPrice.value || !editedPrice.value || editedPrice.value <= 0) {
    alert('Veuillez saisir un prix valide.');
    return;
  }
  if (!authStore.isAdmin) {
    authStore.loginAsDemoAdmin();
  }
  try {
    const payload: any = {
      basePrice: Number(editedPrice.value),
      originalPrice:
        editedOriginalPrice.value && editedOriginalPrice.value > editedPrice.value
          ? Number(editedOriginalPrice.value)
          : null,
    };
    await ProductService.update(selectedProductForPrice.value.id, payload);
    showToast(`✅ Prix de "${selectedProductForPrice.value.name}" mis à jour : ${formatPrice(editedPrice.value)}`);
    selectedProductForPrice.value = null;
    await loadData();
  } catch (err: any) {
    console.error('Erreur mise à jour prix:', err);
    showToast(err.response?.data?.message || 'Erreur lors de la mise à jour du prix.', 'error');
  }
};

const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = '';
  }, 4500);
};

const loadData = async () => {
  try {
    const statsRes = await OrderService.getStats();
    Object.assign(stats, statsRes.data.data);

    const prodRes = await ProductService.getAll();
    products.value = prodRes.data.data;

    const ordersRes = await OrderService.getAllAdmin();
    orders.value = ordersRes.data.data;

    const callsRes = await PhoneService.getCallbacks();
    phoneCallbacks.value = callsRes.data.data;
  } catch (error) {
    console.error('Erreur chargement données admin:', error);
  }
};

const handleCallStatus = async (id: string, status: 'PENDING' | 'CALLED') => {
  try {
    await PhoneService.updateCallbackStatus(id, status);
    showToast(status === 'CALLED' ? 'Appel client marqué comme effectué.' : 'Appel remis en attente.');
    loadData();
  } catch (error) {
    showToast('Erreur mise à jour appel.', 'error');
  }
};

const isShoe = (p: any) => {
  return p.category?.type === 'CHAUSSURE' || p.categoryId.includes('shoe');
};

const getTotalStock = (p: any) => {
  if (!p.variants) return 0;
  return p.variants.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0);
};

const filteredInventoryProducts = computed(() => {
  if (stockFilter.value === 'ALL') return products.value;

  return products.value.filter((p) => {
    if (stockFilter.value === 'OUT') {
      return p.variants.some((v: any) => v.stockQuantity === 0);
    }
    if (stockFilter.value === 'LOW') {
      return p.variants.some((v: any) => v.stockQuantity <= 5);
    }
    return true;
  });
});

const getStockStatusLabel = (qty: number) => {
  if (qty === 0) return 'Rupture Totale';
  if (qty <= 5) return 'Stock Faible';
  return 'Stock Confortable';
};

const getStockBadgeClass = (qty: number) => {
  if (qty === 0) return 'bg-rosewood-100 text-rosewood-800 border border-rosewood-300';
  if (qty <= 5) return 'bg-amber-100 text-amber-800 border border-amber-300';
  return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
};

const getStockDotClass = (qty: number) => {
  if (qty === 0) return 'bg-rosewood-600';
  if (qty <= 5) return 'bg-amber-600';
  return 'bg-emerald-600';
};

/**
 * Réapprovisionnement rapide (+5, +10, +20)
 */
const quickReplenish = async (productId: string, variantId: string, qty: number) => {
  try {
    const res = await ProductService.replenishStock({
      productId,
      variantId,
      quantityToAdd: qty,
    });
    showToast(res.data.message);
    loadData();
  } catch (err: any) {
    showToast(err.response?.data?.message || 'Erreur réapprovisionnement.', 'error');
  }
};

/**
 * Saisie libre d'une quantité reçue
 */
const submitCustomReplenish = async (productId: string, variantId: string) => {
  const qty = variantInputs[variantId];
  if (!qty || qty <= 0) {
    alert('Veuillez saisir une quantité positive.');
    return;
  }
  await quickReplenish(productId, variantId, qty);
  variantInputs[variantId] = 0;
};

const openAddVariantModal = (product: any) => {
  selectedProductForVariant.value = product;
  newVariantData.sizeOrShoeSize = isShoe(product) ? '39' : 'Standard';
  newVariantData.color = 'Noir';
  newVariantData.stockQuantity = 10;
};

const submitAddVariant = async () => {
  if (!selectedProductForVariant.value) return;
  try {
    await ProductService.addVariant(selectedProductForVariant.value.id, newVariantData);
    showToast('Nouvelle variante ajoutée avec succès !');
    selectedProductForVariant.value = null;
    loadData();
  } catch (err: any) {
    showToast('Erreur lors de l\'ajout de la variante.', 'error');
  }
};

const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];

  try {
    const res = await UploadService.uploadImage(file);
    uploadedImageUrl.value = res.data.data.url;
    showToast('Image envoyée dans le stockage MinIO !');
  } catch (error) {
    showToast('Erreur lors du téléversement sur MinIO.', 'error');
  }
};

const handleCreateProduct = async () => {
  isCreating.value = true;
  try {
    const isShoeItem = newProduct.categoryId.includes('shoe');
    const defaultVariants = isShoeItem
      ? [
          { sizeOrShoeSize: '37', color: 'Noir', sku: `SKU-${Date.now()}-37`, stockQuantity: 6 },
          { sizeOrShoeSize: '38', color: 'Noir', sku: `SKU-${Date.now()}-38`, stockQuantity: 8 },
          { sizeOrShoeSize: '39', color: 'Noir', sku: `SKU-${Date.now()}-39`, stockQuantity: 5 },
          { sizeOrShoeSize: '40', color: 'Noir', sku: `SKU-${Date.now()}-40`, stockQuantity: 5 },
          { sizeOrShoeSize: '41', color: 'Noir', sku: `SKU-${Date.now()}-41`, stockQuantity: 4 },
          { sizeOrShoeSize: '42', color: 'Noir', sku: `SKU-${Date.now()}-42`, stockQuantity: 4 },
        ]
      : [
          { sizeOrShoeSize: 'Standard', color: 'Noir', sku: `SKU-${Date.now()}-STD`, stockQuantity: 10 },
          { sizeOrShoeSize: 'Standard', color: 'Marron', sku: `SKU-${Date.now()}-BRN`, stockQuantity: 8 },
        ];

    const payload = {
      name: newProduct.name,
      categoryId: newProduct.categoryId,
      basePrice: newProduct.basePrice,
      description: newProduct.description,
      isFeatured: newProduct.isFeatured,
      variants: defaultVariants,
      images: [
        {
          minioUrl:
            uploadedImageUrl.value ||
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
          altText: newProduct.name,
        },
      ],
    };

    await ProductService.create(payload);
    showToast(`Produit ${newProduct.name} créé et mis en vente avec succès !`);
    newProduct.name = '';
    newProduct.description = '';
    uploadedImageUrl.value = '';
    activeTab.value = 'replenish';
    loadData();
  } catch (error: any) {
    showToast(error.response?.data?.message || 'Erreur lors de la création.', 'error');
  } finally {
    isCreating.value = false;
  }
};

const handleDeleteProduct = async (id: string) => {
  if (!confirm('Supprimer définitivement cet article et toutes ses variantes ?')) return;
  try {
    await ProductService.delete(id);
    showToast('Article retiré du catalogue.');
    loadData();
  } catch (error) {
    showToast('Erreur suppression.', 'error');
  }
};

const handleStatusChange = async (orderId: string, newStatus: string) => {
  try {
    await OrderService.updateStatus(orderId, newStatus);
    showToast(`Statut de la commande mis à jour : ${newStatus}`);
    loadData();
  } catch (error) {
    showToast('Erreur mise à jour statut.', 'error');
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price);
};

const getOrderBadgeClass = (status: string) => {
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
  if (!authStore.isAdmin) {
    authStore.loginAsDemoAdmin();
  }
  loadData();
});
</script>
