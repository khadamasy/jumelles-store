<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
    <!-- Header Admin avec Espace Gérance & Direction -->
    <div class="relative overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 rounded-3xl p-6 sm:p-8 text-white border border-stone-800 shadow-2xl">
      <div class="absolute -right-16 -top-16 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 bg-gold-500/15 text-gold-400 border border-gold-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Crown class="w-3.5 h-3.5 text-gold-400" />
            <span>Espace Gérance & Direction Jumelles Store</span>
          </div>
          <h1 class="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Tableau de Bord & Gestion des Articles
          </h1>
          <p class="text-xs sm:text-sm text-stone-300 font-light max-w-2xl">
            Pilotez votre catalogue de maroquinerie et souliers de luxe en temps réel : modifiez vos fiches articles, réapprovisionnez les pointures et gérez vos expéditions.
          </p>
          <div class="flex items-center gap-2 text-xs text-gold-400/90 pt-1 font-medium">
            <Phone class="w-3.5 h-3.5 text-gold-400" />
            <span>Ligne directe gérance boutique :</span>
            <span class="font-bold underline text-gold-300">+221 77 208 78 20</span>
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
        <div v-else class="flex items-center gap-2.5 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-semibold self-start lg:self-center">
          <CheckCircle2 class="w-4 h-4 text-emerald-400" />
          <span>Droits Administrateur Activés</span>
        </div>
      </div>
    </div>

    <!-- Notification Toast de Succès / Erreur -->
    <div
      v-if="toastMessage"
      class="p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg transition-all"
      :class="toastType === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-rosewood-50 text-rosewood-900 border border-rosewood-300'"
    >
      <div class="flex items-center gap-2.5">
        <CheckCircle2 v-if="toastType === 'success'" class="w-5 h-5 text-emerald-600 shrink-0" />
        <AlertTriangle v-else class="w-5 h-5 text-rosewood-600 shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>
      <button @click="toastMessage = ''" class="text-xs font-bold px-2 py-1 hover:opacity-70">
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- KPI Cards Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div class="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Chiffre d'Affaires</span>
          <TrendingUp class="w-4 h-4 text-emerald-600" />
        </div>
        <p class="font-serif text-2xl sm:text-3xl font-black text-emerald-600">{{ formatPrice(stats.totalRevenue) }}</p>
        <span class="text-[11px] text-stone-500 mt-1 block">Règlements Wave & OM encaissés</span>
      </div>

      <div class="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Total Articles</span>
          <Package class="w-4 h-4 text-stone-700" />
        </div>
        <p class="font-serif text-2xl sm:text-3xl font-black text-stone-900">{{ products.length }}</p>
        <span class="text-[11px] text-stone-500 mt-1 block">{{ bagsCount }} sacs • {{ shoesCount }} souliers</span>
      </div>

      <div class="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Commandes à Traiter</span>
          <Clock class="w-4 h-4 text-amber-600" />
        </div>
        <p class="font-serif text-2xl sm:text-3xl font-black text-amber-600">{{ stats.pendingOrders }}</p>
        <span class="text-[11px] text-stone-500 mt-1 block">Sur {{ stats.totalOrders }} commandes au total</span>
      </div>

      <div class="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Alertes Stocks</span>
          <AlertCircle class="w-4 h-4 text-rosewood-600" />
        </div>
        <p class="font-serif text-2xl sm:text-3xl font-black text-rosewood-600">{{ stats.lowStockCount }}</p>
        <span class="text-[11px] text-stone-500 mt-1 block">Variantes avec stock &lt; 5 unités</span>
      </div>
    </div>

    <!-- Navigation Tabs Principaux -->
    <div class="flex flex-wrap border-b border-stone-200 gap-4 sm:gap-8 text-sm font-bold">
      <button
        @click="activeTab = 'products'"
        class="pb-4 border-b-2 transition-all flex items-center gap-2"
        :class="activeTab === 'products' ? 'border-gold-600 text-stone-950 font-black' : 'border-transparent text-stone-400 hover:text-stone-700'"
      >
        <Package class="w-4 h-4" />
        <span>Catalogue & Gestion des Articles ({{ products.length }})</span>
      </button>

      <button
        @click="activeTab = 'orders'"
        class="pb-4 border-b-2 transition-all flex items-center gap-2"
        :class="activeTab === 'orders' ? 'border-gold-600 text-stone-950 font-black' : 'border-transparent text-stone-400 hover:text-stone-700'"
      >
        <ShoppingBag class="w-4 h-4" />
        <span>Commandes Clients ({{ orders.length }})</span>
      </button>

      <button
        @click="activeTab = 'phone-calls'"
        class="pb-4 border-b-2 transition-all flex items-center gap-2"
        :class="activeTab === 'phone-calls' ? 'border-gold-600 text-stone-950 font-black' : 'border-transparent text-stone-400 hover:text-stone-700'"
      >
        <PhoneCall class="w-4 h-4" />
        <span>Rappels Téléphoniques ({{ pendingCallsCount }})</span>
      </button>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 1 : CATALOGUE ET GESTION ULTRA-MODERNE DES ARTICLES        -->
    <!-- ============================================================== -->
    <div v-if="activeTab === 'products'" class="space-y-6">
      <!-- Toolbar avec Recherche, Filtres Catégories et Bouton d'Ajout -->
      <div class="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <!-- Barre de Recherche en direct -->
          <div class="relative flex-1 max-w-md">
            <Search class="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              v-model="productSearchQuery"
              type="text"
              placeholder="Rechercher par nom d'article, référence ou matière..."
              class="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 bg-stone-50/50"
            />
            <button
              v-if="productSearchQuery"
              @click="productSearchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Bouton Action Primaire: Créer un Nouvel Article -->
          <div class="flex items-center gap-3">
            <button
              @click="openCreateProductModal"
              class="px-4 sm:px-5 py-2.5 bg-stone-950 hover:bg-gold-600 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus class="w-4 h-4 text-gold-400" />
              <span>+ Nouvel Article</span>
            </button>
          </div>
        </div>

        <!-- Filtres par Catégorie et par Santé du Stock -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
          <!-- Filtres Catégorie -->
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-stone-400 font-semibold mr-1 flex items-center gap-1">
              <Filter class="w-3 h-3" /> Rayon :
            </span>
            <button
              @click="categoryFilter = 'ALL'"
              class="px-3 py-1 rounded-xl font-bold transition-all"
              :class="categoryFilter === 'ALL' ? 'bg-stone-900 text-white shadow-2xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
            >
              Tous ({{ products.length }})
            </button>
            <button
              @click="categoryFilter = 'SAC'"
              class="px-3 py-1 rounded-xl font-bold transition-all"
              :class="categoryFilter === 'SAC' ? 'bg-stone-900 text-white shadow-2xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
            >
              Sacs & Maroquinerie ({{ bagsCount }})
            </button>
            <button
              @click="categoryFilter = 'CHAUSSURE'"
              class="px-3 py-1 rounded-xl font-bold transition-all"
              :class="categoryFilter === 'CHAUSSURE' ? 'bg-stone-900 text-white shadow-2xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
            >
              Souliers & Talons ({{ shoesCount }})
            </button>
          </div>

          <!-- Filtres Stock -->
          <div class="flex items-center gap-1.5">
            <span class="text-stone-400 font-semibold mr-1">Stock :</span>
            <button
              @click="stockFilter = 'ALL'"
              class="px-2.5 py-1 rounded-xl font-semibold transition-all"
              :class="stockFilter === 'ALL' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'"
            >
              Tous
            </button>
            <button
              @click="stockFilter = 'LOW'"
              class="px-2.5 py-1 rounded-xl font-semibold transition-all flex items-center gap-1"
              :class="stockFilter === 'LOW' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'"
            >
              <AlertTriangle class="w-3 h-3" />
              <span>Faibles (≤ 5)</span>
            </button>
            <button
              @click="stockFilter = 'OUT'"
              class="px-2.5 py-1 rounded-xl font-semibold transition-all flex items-center gap-1"
              :class="stockFilter === 'OUT' ? 'bg-rosewood-600 text-white' : 'bg-rosewood-50 text-rosewood-800 border border-rosewood-200 hover:bg-rosewood-100'"
            >
              <AlertCircle class="w-3 h-3" />
              <span>Ruptures</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tableau Épuré des Articles -->
      <div class="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div v-if="filteredProducts.length === 0" class="p-12 text-center space-y-3">
          <Package class="w-12 h-12 text-stone-300 mx-auto" />
          <h3 class="font-serif text-lg font-bold text-stone-800">Aucun article ne correspond à votre filtre</h3>
          <p class="text-xs text-stone-400">Essayez de réinitialiser la recherche ou de changer les filtres.</p>
          <button
            @click="productSearchQuery = ''; categoryFilter = 'ALL'; stockFilter = 'ALL'"
            class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold"
          >
            Réinitialiser les filtres
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-stone-50/80 text-stone-400 uppercase tracking-wider border-b border-stone-200/80 font-bold">
              <tr>
                <th class="py-3.5 px-4 sm:px-6">Article & Visuel</th>
                <th class="py-3.5 px-4">Rayon</th>
                <th class="py-3.5 px-4">Prix Public</th>
                <th class="py-3.5 px-4">Stock Global</th>
                <th class="py-3.5 px-4">Pointures / Formats</th>
                <th class="py-3.5 px-4 sm:px-6 text-right">Actions de Gestion</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="hover:bg-stone-50/60 transition-colors group"
              >
                <!-- Visuel & Nom de l'Article -->
                <td class="py-4 px-4 sm:px-6">
                  <div class="flex items-center gap-3.5">
                    <div class="relative w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <img
                        :src="getProductThumbnail(product)"
                        :alt="product.name"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div class="space-y-0.5 max-w-xs">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span
                          v-if="product.isFeatured"
                          class="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded"
                        >
                          <Sparkles class="w-2.5 h-2.5 text-amber-600" />
                          <span>Pièce Phare</span>
                        </span>
                        <span class="text-[10px] font-mono text-stone-400">{{ product.id }}</span>
                      </div>
                      <p class="font-serif font-bold text-stone-950 text-sm line-clamp-1 group-hover:text-gold-700 transition-colors">
                        {{ product.name }}
                      </p>
                      <p class="text-[11px] text-stone-400 line-clamp-1 font-light">
                        {{ product.description }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Catégorie -->
                <td class="py-4 px-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border"
                    :class="isShoe(product) ? 'bg-purple-50 text-purple-900 border-purple-200' : 'bg-amber-50 text-amber-900 border-amber-200'"
                  >
                    {{ isShoe(product) ? '👠 Souliers' : '👜 Maroquinerie' }}
                  </span>
                </td>

                <!-- Prix et Promotion -->
                <td class="py-4 px-4 whitespace-nowrap">
                  <div class="space-y-0.5">
                    <p class="font-serif font-black text-stone-950 text-sm">
                      {{ formatPrice(product.basePrice) }}
                    </p>
                    <div v-if="product.originalPrice && product.originalPrice > product.basePrice" class="flex items-center gap-1.5">
                      <span class="line-through text-[11px] text-stone-400 font-semibold">{{ formatPrice(product.originalPrice) }}</span>
                      <span class="text-[10px] font-bold text-rosewood-700 bg-rosewood-50 px-1.5 py-0.2 rounded border border-rosewood-200">
                        -{{ Math.round((1 - product.basePrice / product.originalPrice) * 100) }}%
                      </span>
                    </div>
                    <button
                      @click="openQuickPriceModal(product)"
                      class="text-[10px] text-stone-500 hover:text-gold-700 font-bold underline cursor-pointer flex items-center gap-1 pt-0.5"
                    >
                      <Pencil class="w-2.5 h-2.5" />
                      <span>Modifier tarif</span>
                    </button>
                  </div>
                </td>

                <!-- Stock Total & Badge État -->
                <td class="py-4 px-4 whitespace-nowrap">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                        :class="getProductStockBadge(product)"
                      >
                        <span class="w-1.5 h-1.5 rounded-full" :class="getProductStockDot(product)"></span>
                        <span>{{ getTotalStock(product) }} unité(s)</span>
                      </span>
                    </div>
                    <span class="text-[10px] text-stone-400 block font-medium">
                      {{ (product.variants || []).length }} variante(s)
                    </span>
                  </div>
                </td>

                <!-- Variantes / Pointures résumées -->
                <td class="py-4 px-4">
                  <div class="flex flex-wrap gap-1 max-w-xs">
                    <span
                      v-for="v in (product.variants || []).slice(0, 6)"
                      :key="v.id"
                      class="px-1.5 py-0.5 rounded text-[10px] font-semibold border"
                      :class="v.stockQuantity === 0 ? 'bg-rosewood-50 text-rosewood-700 border-rosewood-200 line-through' : v.stockQuantity <= 5 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-stone-100 text-stone-700 border-stone-200'"
                      :title="`${v.color} - ${v.sizeOrShoeSize} : ${v.stockQuantity} en stock`"
                    >
                      {{ v.sizeOrShoeSize }} ({{ v.stockQuantity }})
                    </span>
                    <span v-if="(product.variants || []).length > 6" class="text-[10px] text-stone-400 font-bold self-center">
                      +{{ (product.variants || []).length - 6 }}
                    </span>
                  </div>
                </td>

                <!-- Actions Rapides -->
                <td class="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                  <div class="inline-flex items-center gap-1.5 justify-end">
                    <!-- Gérer Stock & Variantes (Drawer / Modal) -->
                    <button
                      @click="openManageStockModal(product)"
                      class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-all border border-stone-200/80 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Gérer les stocks et ajouter des pointures"
                    >
                      <Layers class="w-3.5 h-3.5 text-stone-600" />
                      <span>Stocks & Tailles</span>
                    </button>

                    <!-- Éditer Fiche Complète -->
                    <button
                      @click="openEditProductModal(product)"
                      class="px-2.5 py-1.5 bg-gold-50 hover:bg-gold-100 text-gold-950 rounded-xl text-xs font-bold transition-all border border-gold-300/80 flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Modifier les détails de l'article"
                    >
                      <Pencil class="w-3.5 h-3.5 text-gold-800" />
                      <span class="hidden sm:inline">Modifier</span>
                    </button>

                    <!-- Supprimer -->
                    <button
                      @click="handleDeleteProduct(product.id)"
                      class="p-1.5 text-stone-400 hover:text-rosewood-600 hover:bg-rosewood-50 rounded-lg transition-colors cursor-pointer"
                      title="Supprimer cet article"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- TAB 2 : SUIVI ET EXPÉDITIONS DES COMMANDES CLIENTS             -->
    <!-- ============================================================== -->
    <div v-if="activeTab === 'orders'" class="space-y-6">
      <div class="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
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
    <!-- TAB 3 : DEMANDES DE RAPPEL TÉLÉPHONIQUE & COMMANDES EXPRESS     -->
    <!-- ============================================================== -->
    <div v-if="activeTab === 'phone-calls'" class="space-y-6">
      <div class="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <div class="p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <PhoneCall class="w-5 h-5 text-gold-600" />
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
                    <Phone class="w-3.5 h-3.5 text-blue-600" />
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
                    class="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"
                    :class="call.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'"
                  >
                    <Clock v-if="call.status === 'PENDING'" class="w-3 h-3 text-amber-700" />
                    <Check v-else class="w-3 h-3 text-emerald-700" />
                    <span>{{ call.status === 'PENDING' ? 'À rappeler' : 'Contactée' }}</span>
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="inline-flex items-center gap-2">
                    <button
                      v-if="call.status === 'PENDING'"
                      @click="handleCallStatus(call.id, 'CALLED')"
                      class="px-3 py-1.5 bg-stone-900 hover:bg-gold-600 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
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

    <!-- ============================================================== -->
    <!-- MODAL 1 : GESTION DES STOCKS & POINTURES D'UN ARTICLE          -->
    <!-- ============================================================== -->
    <div v-if="manageStockModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
      <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 border border-stone-200">
        <!-- Header Modal -->
        <div class="flex items-center justify-between border-b border-stone-100 pb-4">
          <div class="flex items-center gap-3">
            <img
              :src="getProductThumbnail(manageStockModal)"
              :alt="manageStockModal.name"
              class="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
            />
            <div>
              <span class="text-[10px] uppercase font-bold tracking-wider text-gold-700 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                Gestion des Stocks & Tailles
              </span>
              <h3 class="font-serif font-bold text-lg text-stone-950 mt-0.5 line-clamp-1">
                {{ manageStockModal.name }}
              </h3>
            </div>
          </div>
          <button @click="manageStockModal = null" class="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Tableau des Variantes / Pointures -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs">
            <h4 class="font-bold text-stone-900">Variantes et Pointures Disponibles :</h4>
            <span class="text-stone-500 font-semibold">Total : <strong class="text-stone-950">{{ getTotalStock(manageStockModal) }} pièce(s)</strong></span>
          </div>

          <div class="border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
            <table class="w-full text-left text-xs">
              <thead class="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th class="py-2.5 px-4">Pointure / Taille</th>
                  <th class="py-2.5 px-4">Couleur</th>
                  <th class="py-2.5 px-4">Stock Actuel</th>
                  <th class="py-2.5 px-4 text-right">Réapprovisionnement Rapide</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100">
                <tr v-for="variant in manageStockModal.variants" :key="variant.id" class="hover:bg-stone-50/50">
                  <td class="py-3 px-4 font-bold text-stone-900">
                    {{ isShoe(manageStockModal) ? 'Pointure ' + variant.sizeOrShoeSize : variant.sizeOrShoeSize }}
                  </td>
                  <td class="py-3 px-4 text-stone-600">
                    {{ variant.color }}
                  </td>
                  <td class="py-3 px-4">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                      :class="getStockBadgeClass(variant.stockQuantity)"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" :class="getStockDotClass(variant.stockQuantity)"></span>
                      <span>{{ variant.stockQuantity }} en stock</span>
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <div class="inline-flex items-center gap-1.5 justify-end">
                      <button
                        @click="quickReplenish(manageStockModal.id, variant.id, 5)"
                        class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 transition-colors text-[11px]"
                        title="Ajouter 5 unités"
                      >
                        +5
                      </button>
                      <button
                        @click="quickReplenish(manageStockModal.id, variant.id, 10)"
                        class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 transition-colors text-[11px]"
                        title="Ajouter 10 unités"
                      >
                        +10
                      </button>
                      <button
                        @click="quickReplenish(manageStockModal.id, variant.id, 20)"
                        class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 transition-colors text-[11px]"
                        title="Ajouter 20 unités"
                      >
                        +20
                      </button>
                      <div class="flex items-center gap-1 ml-1">
                        <input
                          v-model.number="variantInputs[variant.id]"
                          type="number"
                          placeholder="Qté"
                          class="w-14 px-2 py-1 text-xs border border-stone-300 rounded-lg text-center outline-none focus:ring-1 focus:ring-gold-500"
                        />
                        <button
                          @click="submitCustomReplenish(manageStockModal.id, variant.id)"
                          class="px-2.5 py-1 bg-stone-900 hover:bg-gold-600 text-white font-bold rounded-lg text-xs transition-colors"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Formulaire d'ajout d'une nouvelle pointure ou couleur -->
        <div class="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-4">
          <h4 class="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <Plus class="w-3.5 h-3.5 text-gold-600" />
            <span>Ajouter une Nouvelle Pointure ou Couleur</span>
          </h4>
          <form @submit.prevent="submitAddVariant" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-stone-600 mb-1">
                {{ isShoe(manageStockModal) ? 'Pointure (ex: 37 à 42) *' : 'Taille / Format *' }}
              </label>
              <input
                v-model="newVariantData.sizeOrShoeSize"
                type="text"
                :placeholder="isShoe(manageStockModal) ? 'Ex: 39' : 'Ex: Moyen'"
                class="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none focus:ring-1 focus:ring-gold-500 bg-white"
                required
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-stone-600 mb-1">Couleur *</label>
              <input
                v-model="newVariantData.color"
                type="text"
                placeholder="Ex: Noir Verni"
                class="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none focus:ring-1 focus:ring-gold-500 bg-white"
                required
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-stone-600 mb-1">Stock initial *</label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="newVariantData.stockQuantity"
                  type="number"
                  placeholder="10"
                  class="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none focus:ring-1 focus:ring-gold-500 bg-white"
                  required
                />
                <button
                  type="submit"
                  class="px-4 py-2 bg-stone-900 hover:bg-gold-600 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-2xs transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="flex justify-end pt-2">
          <button
            @click="manageStockModal = null"
            class="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- MODAL 2 : ÉDITION COMPLÈTE DE LA FICHE PRODUIT                -->
    <!-- ============================================================== -->
    <div v-if="editProductModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 border border-stone-200">
        <div class="flex items-center justify-between border-b border-stone-100 pb-4">
          <div class="flex items-center gap-2.5">
            <Pencil class="w-5 h-5 text-gold-600" />
            <div>
              <h3 class="font-serif font-bold text-lg text-stone-950">
                Modifier la Fiche Article
              </h3>
              <p class="text-xs text-stone-400">Réf : {{ editProductModal.id }}</p>
            </div>
          </div>
          <button @click="editProductModal = null" class="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitUpdateProduct" class="space-y-5">
          <!-- Nom du Produit -->
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Nom complet de l'article *</label>
            <input
              v-model="editForm.name"
              type="text"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none"
              required
            />
          </div>

          <!-- Catégorie -->
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Rayon / Catégorie *</label>
            <select
              v-model="editForm.categoryId"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none bg-white"
              required
            >
              <option value="cat-sac-1">👜 Sacs à Main & Cabas (Maroquinerie)</option>
              <option value="cat-sac-2">👛 Pochettes & Sacs Matelassés (Maroquinerie)</option>
              <option value="cat-shoe-1">👠 Mules & Escarpins à Talons (Souliers)</option>
              <option value="cat-shoe-2">👡 Sandales Plates & Tongs de Luxe (Souliers)</option>
            </select>
          </div>

          <!-- Prix de Vente & Prix Barré Promo -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Prix de Vente Effectif (FCFA) *</label>
              <input
                v-model.number="editForm.basePrice"
                type="number"
                step="500"
                class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-black text-stone-950 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none"
                required
              />
              <p class="text-[11px] text-stone-400 mt-1">Montant facturé sur Wave & Orange Money</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Prix Barré avant Réduction (Optionnel)</label>
              <input
                v-model.number="editForm.originalPrice"
                type="number"
                step="500"
                placeholder="Ex: 20000"
                class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-600 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none"
              />
              <p class="text-[11px] text-stone-400 mt-1">Pour afficher une remise promotionnelle</p>
            </div>
          </div>

          <!-- Calcul direct remise -->
          <div
            v-if="editForm.originalPrice && editForm.originalPrice > editForm.basePrice"
            class="p-3 bg-rosewood-50 border border-rosewood-200 rounded-xl flex items-center justify-between text-xs"
          >
            <span class="font-bold text-rosewood-900">Remise automatique affichée :</span>
            <span class="font-extrabold text-rosewood-700 bg-rosewood-100 px-2 py-0.5 rounded-lg">
              -{{ Math.round((1 - editForm.basePrice / editForm.originalPrice) * 100) }}% de réduction
            </span>
          </div>

          <!-- Photo de l'article -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-stone-700">Photo Principale de l'Article</label>
            <div class="flex items-center gap-4">
              <img
                :src="editForm.imageUrl || getProductThumbnail(editProductModal)"
                class="w-16 h-16 rounded-xl object-cover border border-stone-200 bg-stone-100 shadow-2xs shrink-0"
              />
              <div class="space-y-1.5 flex-1">
                <input
                  v-model="editForm.imageUrl"
                  type="text"
                  placeholder="URL de l'image ou chemin local (ex: /products/sac-birkin-camel.jpg)"
                  class="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                />
                <div class="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleEditPhotoUpload"
                    class="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-stone-900 file:text-white hover:file:bg-gold-600 cursor-pointer"
                  />
                  <span v-if="isUploadingPhoto" class="text-xs text-amber-600 font-bold">Téléversement MinIO...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Description & Caractéristiques *</label>
            <textarea
              v-model="editForm.description"
              rows="3"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none"
              required
            ></textarea>
          </div>

          <!-- Toggle Pièce Phare -->
          <div class="flex items-center gap-2.5 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <input
              id="editFeatured"
              v-model="editForm.isFeatured"
              type="checkbox"
              class="w-4 h-4 text-gold-600 rounded border-stone-300 focus:ring-gold-500"
            />
            <label for="editFeatured" class="text-xs text-stone-800 font-semibold cursor-pointer">
              Mettre en avant sur la page d'accueil (Badge « Pièce Phare »)
            </label>
          </div>

          <!-- Boutons Sauvegarde -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              @click="editProductModal = null"
              class="px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isUpdating"
              class="px-6 py-2.5 bg-stone-950 hover:bg-gold-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              {{ isUpdating ? 'Enregistrement...' : 'Enregistrer les Modifications' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- MODAL 3 : CRÉATION RAPIDE D'UN NOUVEL ARTICLE DANS LE CATALOGUE -->
    <!-- ============================================================== -->
    <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 border border-stone-200">
        <div class="flex items-center justify-between border-b border-stone-100 pb-4">
          <div class="flex items-center gap-2.5">
            <Package class="w-5 h-5 text-gold-600" />
            <div>
              <h3 class="font-serif font-bold text-lg text-stone-950">
                Ajouter un Nouvel Article au Catalogue
              </h3>
              <p class="text-xs text-stone-400">Le modèle sera immédiatement visible en ligne.</p>
            </div>
          </div>
          <button @click="isCreateModalOpen = false" class="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleCreateProduct" class="space-y-5">
          <!-- Nom -->
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Nom complet du modèle *</label>
            <input
              v-model="newProduct.name"
              type="text"
              placeholder="Ex: Escarpins Stiletto Métallisé Doré"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none"
              required
            />
          </div>

          <!-- Catégorie -->
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Rayon / Catégorie *</label>
            <select
              v-model="newProduct.categoryId"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none bg-white"
              required
            >
              <option value="cat-sac-1">👜 Sacs à Main & Cabas (Maroquinerie)</option>
              <option value="cat-sac-2">👛 Pochettes & Sacs Matelassés (Maroquinerie)</option>
              <option value="cat-shoe-1">👠 Mules & Escarpins à Talons (Souliers)</option>
              <option value="cat-shoe-2">👡 Sandales Plates & Tongs de Luxe (Souliers)</option>
            </select>
            <p class="text-[11px] text-stone-400 mt-1">
              Pour les souliers, les pointures 37 à 42 seront automatiquement préconfigurées.
            </p>
          </div>

          <!-- Prix -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Prix de Vente (FCFA) *</label>
              <input
                v-model.number="newProduct.basePrice"
                type="number"
                step="500"
                placeholder="15000"
                class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-black text-stone-950 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none"
                required
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Prix d'Origine avant Promo (Optionnel)</label>
              <input
                v-model.number="newProduct.originalPrice"
                type="number"
                step="500"
                placeholder="20000"
                class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-600 focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none"
              />
            </div>
          </div>

          <!-- Photo MinIO ou Preset Local -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-stone-700">Photo de l'Article</label>
            <div class="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                class="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-stone-900 file:text-white hover:file:bg-gold-600 cursor-pointer"
              />
              <span v-if="uploadedImageUrl" class="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check class="w-3.5 h-3.5" /> Photo prête
              </span>
            </div>

            <!-- Choix rapide d'un visuel existant -->
            <div class="pt-2">
              <span class="text-[11px] text-stone-400 block mb-1.5">Ou sélectionner un visuel de shooting disponible :</span>
              <div class="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  v-for="preset in imagePresets"
                  :key="preset.url"
                  @click="newProductSelectedPreset = preset.url"
                  class="shrink-0 rounded-xl overflow-hidden border-2 transition-all"
                  :class="newProductSelectedPreset === preset.url ? 'border-gold-500 scale-105' : 'border-stone-200 opacity-60 hover:opacity-100'"
                  :title="preset.label"
                >
                  <img :src="preset.url" :alt="preset.label" class="w-12 h-12 object-cover" />
                </button>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Description & Matière *</label>
            <textarea
              v-model="newProduct.description"
              rows="3"
              placeholder="Précisez les finitions (cuir grainé, talon bobine, semelle confort)..."
              class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none"
              required
            ></textarea>
          </div>

          <!-- Toggle Pièce Phare -->
          <div class="flex items-center gap-2.5 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <input
              id="newFeaturedCheck"
              v-model="newProduct.isFeatured"
              type="checkbox"
              class="w-4 h-4 text-gold-600 rounded border-stone-300 focus:ring-gold-500"
            />
            <label for="newFeaturedCheck" class="text-xs text-stone-800 font-semibold cursor-pointer">
              Mettre en avant sur la page d'accueil (Pièce Phare)
            </label>
          </div>

          <!-- Bouton Submit -->
          <div class="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              @click="isCreateModalOpen = false"
              class="px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isCreating"
              class="px-6 py-2.5 bg-stone-950 hover:bg-gold-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              {{ isCreating ? 'Création en cours...' : 'Publier le Modèle' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- MODAL 4 : MODIFICATION RAPIDE DU PRIX                         -->
    <!-- ============================================================== -->
    <div v-if="quickPriceModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
      <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl space-y-6 p-6 sm:p-8 border border-stone-200">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <div class="flex items-center gap-2">
            <DollarSign class="w-5 h-5 text-gold-600" />
            <h3 class="font-serif font-bold text-lg text-stone-950">
              Modifier le Prix de Vente
            </h3>
          </div>
          <button @click="quickPriceModal = null" class="p-1 text-stone-400 hover:text-stone-700">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div>
          <p class="text-xs text-stone-400">Article :</p>
          <p class="font-serif font-bold text-stone-900 text-sm mt-0.5">{{ quickPriceModal.name }}</p>
        </div>

        <form @submit.prevent="submitQuickPrice" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Prix de Vente Effectif (FCFA) *</label>
            <input
              v-model.number="quickPriceForm.basePrice"
              type="number"
              step="500"
              class="w-full px-4 py-3 rounded-xl border border-stone-300 text-lg font-black text-stone-950 focus:ring-2 focus:ring-gold-500 outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Prix Barré avant Remise (Optionnel)</label>
            <input
              v-model.number="quickPriceForm.originalPrice"
              type="number"
              step="500"
              placeholder="Ex: 18000"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-600 focus:ring-2 focus:ring-gold-500 outline-none"
            />
          </div>

          <div
            v-if="quickPriceForm.originalPrice && quickPriceForm.originalPrice > quickPriceForm.basePrice"
            class="p-3 bg-rosewood-50 border border-rosewood-200 rounded-xl flex items-center justify-between text-xs"
          >
            <span class="font-bold text-rosewood-900">Remise commerciale :</span>
            <span class="font-extrabold text-rosewood-700 bg-rosewood-100 px-2 py-0.5 rounded-lg">
              -{{ Math.round((1 - quickPriceForm.basePrice / quickPriceForm.originalPrice) * 100) }}%
            </span>
          </div>

          <div class="flex justify-end gap-3 pt-3">
            <button
              type="button"
              @click="quickPriceModal = null"
              class="px-4 py-2 text-xs font-bold text-stone-500 hover:bg-stone-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-stone-950 font-black text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              Enregistrer le Tarif
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
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Layers,
  UploadCloud,
  X,
  ExternalLink,
  ShoppingBag,
  PhoneCall,
  Check,
  RotateCcw,
  Sparkles,
  DollarSign,
  Crown,
  Tag,
  Phone,
  ArrowRight,
  TrendingUp,
  Clock,
  Filter,
  Eye,
  Percent,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const activeTab = ref<'products' | 'orders' | 'phone-calls'>('products');

// Filtres et Recherche Catalogue
const productSearchQuery = ref('');
const categoryFilter = ref<'ALL' | 'SAC' | 'CHAUSSURE'>('ALL');
const stockFilter = ref<'ALL' | 'LOW' | 'OUT'>('ALL');

// Données principales
const products = ref<any[]>([]);
const orders = ref<any[]>([]);
const phoneCallbacks = ref<any[]>([]);
const stats = reactive({
  totalRevenue: 0,
  totalOrders: 0,
  pendingOrders: 0,
  lowStockCount: 0,
});

// Toast Notifications
const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');
const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = '';
  }, 4500);
};

// Saisies réassort
const variantInputs = reactive<Record<string, number>>({});

// Présélections d'images locales rapides
const imagePresets = [
  { label: 'Sac Birkin Camel', url: '/products/sac-birkin-camel.jpg' },
  { label: 'Sac Birkin Chocolat', url: '/products/sac-birkin-chocolat.jpg' },
  { label: 'Sac Cabas Cuir Grainé', url: '/products/sac-cabas-cuir-graine-noir.jpg' },
  { label: 'Sac Alma Damier', url: '/products/sac-alma-damier-ebene.jpg' },
  { label: 'Sac Besace Daim Chocolat', url: '/products/sac-besace-daim-suede-cognac-chocolat.jpg' },
  { label: 'Mules Talon Cœur Noir', url: '/products/mules-talon-coeur-noir.jpg' },
  { label: 'Mules Jacquard Blanc', url: '/products/mules-h-jacquard-blanc-coffret.jpg' },
  { label: 'Sandales Vernies Zara', url: '/products/sandales-plates-verni-zara-collection.jpg' },
  { label: 'Tongs Cuir Doré', url: '/products/tongs-cuir-bijou-dore.jpg' },
];

// Modal 1 : Gestion des Stocks & Tailles
const manageStockModal = ref<any>(null);
const newVariantData = reactive({
  sizeOrShoeSize: '',
  color: '',
  stockQuantity: 10,
});
const openManageStockModal = (product: any) => {
  manageStockModal.value = product;
  newVariantData.sizeOrShoeSize = isShoe(product) ? '39' : 'Standard';
  newVariantData.color = 'Noir';
  newVariantData.stockQuantity = 10;
};

// Modal 2 : Édition Complète Article
const editProductModal = ref<any>(null);
const isUpdating = ref(false);
const isUploadingPhoto = ref(false);
const editForm = reactive({
  name: '',
  categoryId: 'cat-sac-1',
  basePrice: 15000,
  originalPrice: null as number | null,
  description: '',
  isFeatured: false,
  imageUrl: '',
});
const openEditProductModal = (product: any) => {
  editProductModal.value = product;
  editForm.name = product.name;
  editForm.categoryId = product.categoryId;
  editForm.basePrice = product.basePrice;
  editForm.originalPrice = product.originalPrice || null;
  editForm.description = product.description;
  editForm.isFeatured = !!product.isFeatured;
  editForm.imageUrl = getProductThumbnail(product);
};

// Modal 3 : Création d'un Nouvel Article
const isCreateModalOpen = ref(false);
const isCreating = ref(false);
const uploadedImageUrl = ref('');
const newProductSelectedPreset = ref('/products/sac-birkin-camel.jpg');
const newProduct = reactive({
  name: '',
  categoryId: 'cat-sac-1',
  basePrice: 15000,
  originalPrice: null as number | null,
  description: '',
  isFeatured: true,
});
const openCreateProductModal = () => {
  isCreateModalOpen.value = true;
};

// Modal 4 : Modification Rapide de Prix
const quickPriceModal = ref<any>(null);
const quickPriceForm = reactive({
  basePrice: 0,
  originalPrice: null as number | null,
});
const openQuickPriceModal = (product: any) => {
  quickPriceModal.value = product;
  quickPriceForm.basePrice = product.basePrice;
  quickPriceForm.originalPrice = product.originalPrice || null;
};

// --- Computed Filters ---
const bagsCount = computed(() => {
  return products.value.filter((p) => !isShoe(p)).length;
});

const shoesCount = computed(() => {
  return products.value.filter((p) => isShoe(p)).length;
});

const filteredProducts = computed(() => {
  let list = products.value;

  // Filtre catégorie
  if (categoryFilter.value === 'SAC') {
    list = list.filter((p) => !isShoe(p));
  } else if (categoryFilter.value === 'CHAUSSURE') {
    list = list.filter((p) => isShoe(p));
  }

  // Filtre recherche par texte
  if (productSearchQuery.value.trim()) {
    const q = productSearchQuery.value.toLowerCase().trim();
    list = list.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchCat = p.category?.name?.toLowerCase().includes(q);
      const matchSku = p.variants?.some((v: any) => v.sku?.toLowerCase().includes(q));
      return matchName || matchDesc || matchCat || matchSku;
    });
  }

  // Filtre stock
  if (stockFilter.value === 'OUT') {
    list = list.filter((p) => (p.variants || []).some((v: any) => v.stockQuantity === 0));
  } else if (stockFilter.value === 'LOW') {
    list = list.filter((p) => (p.variants || []).some((v: any) => v.stockQuantity <= 5));
  }

  return list;
});

const pendingCallsCount = computed(() => {
  return phoneCallbacks.value.filter((c) => c.status === 'PENDING').length;
});

// --- Helpers ---
const isShoe = (p: any) => {
  if (!p) return false;
  return p.category?.type === 'CHAUSSURE' || p.categoryId?.includes('shoe');
};

const getProductThumbnail = (p: any) => {
  if (!p) return '/products/sac-birkin-camel.jpg';
  if (p.images && p.images.length > 0 && p.images[0].minioUrl) {
    return p.images[0].minioUrl;
  }
  return '/products/sac-birkin-camel.jpg';
};

const getTotalStock = (p: any) => {
  if (!p || !p.variants) return 0;
  return p.variants.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0);
};

const getProductStockBadge = (p: any) => {
  const total = getTotalStock(p);
  const hasOut = (p.variants || []).some((v: any) => v.stockQuantity === 0);
  if (hasOut || total === 0) return 'bg-rosewood-100 text-rosewood-800 border border-rosewood-300';
  if (total <= 10) return 'bg-amber-100 text-amber-800 border border-amber-300';
  return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
};

const getProductStockDot = (p: any) => {
  const total = getTotalStock(p);
  const hasOut = (p.variants || []).some((v: any) => v.stockQuantity === 0);
  if (hasOut || total === 0) return 'bg-rosewood-600';
  if (total <= 10) return 'bg-amber-600';
  return 'bg-emerald-600';
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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(price || 0);
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

// --- Actions & API Calls ---
const loadData = async () => {
  try {
    const [statsRes, prodRes, ordersRes, callsRes] = await Promise.all([
      OrderService.getStats(),
      ProductService.getAll(),
      OrderService.getAllAdmin(),
      PhoneService.getCallbacks(),
    ]);
    Object.assign(stats, statsRes.data.data);
    products.value = prodRes.data.data;
    orders.value = ordersRes.data.data;
    phoneCallbacks.value = callsRes.data.data;
  } catch (error) {
    console.error('Erreur chargement données admin:', error);
  }
};

const quickReplenish = async (productId: string, variantId: string, qty: number) => {
  try {
    const res = await ProductService.replenishStock({
      productId,
      variantId,
      quantityToAdd: qty,
    });
    showToast(res.data?.message || `+${qty} unité(s) ajoutée(s) au stock !`);
    await loadData();
    if (manageStockModal.value && manageStockModal.value.id === productId) {
      const refreshed = products.value.find((p) => p.id === productId);
      if (refreshed) manageStockModal.value = refreshed;
    }
  } catch (err: any) {
    showToast(err.response?.data?.message || 'Erreur réapprovisionnement.', 'error');
  }
};

const submitCustomReplenish = async (productId: string, variantId: string) => {
  const qty = variantInputs[variantId];
  if (!qty || qty <= 0) {
    alert('Veuillez saisir une quantité positive.');
    return;
  }
  await quickReplenish(productId, variantId, qty);
  variantInputs[variantId] = 0;
};

const submitAddVariant = async () => {
  if (!manageStockModal.value) return;
  try {
    await ProductService.addVariant(manageStockModal.value.id, newVariantData);
    showToast('Nouvelle variante ajoutée avec succès !');
    newVariantData.sizeOrShoeSize = '';
    newVariantData.color = '';
    newVariantData.stockQuantity = 10;
    await loadData();
    const refreshed = products.value.find((p) => p.id === manageStockModal.value.id);
    if (refreshed) manageStockModal.value = refreshed;
  } catch (err: any) {
    showToast(err.response?.data?.message || 'Erreur lors de l\'ajout de la variante.', 'error');
  }
};

const submitUpdateProduct = async () => {
  if (!editProductModal.value) return;
  isUpdating.value = true;
  try {
    const payload: any = {
      name: editForm.name,
      categoryId: editForm.categoryId,
      basePrice: Number(editForm.basePrice),
      originalPrice:
        editForm.originalPrice && editForm.originalPrice > editForm.basePrice
          ? Number(editForm.originalPrice)
          : null,
      description: editForm.description,
      isFeatured: !!editForm.isFeatured,
    };
    if (editForm.imageUrl) {
      payload.images = [
        {
          minioUrl: editForm.imageUrl,
          altText: editForm.name,
          isPrimary: true,
        },
      ];
    }
    await ProductService.update(editProductModal.value.id, payload);
    showToast(`Article "${editForm.name}" mis à jour avec succès !`);
    editProductModal.value = null;
    await loadData();
  } catch (err: any) {
    showToast(err.response?.data?.message || 'Erreur lors de la mise à jour.', 'error');
  } finally {
    isUpdating.value = false;
  }
};

const submitQuickPrice = async () => {
  if (!quickPriceModal.value || !quickPriceForm.basePrice || quickPriceForm.basePrice <= 0) {
    showToast('Veuillez saisir un prix valide.', 'error');
    return;
  }
  try {
    const payload = {
      basePrice: Number(quickPriceForm.basePrice),
      originalPrice:
        quickPriceForm.originalPrice && quickPriceForm.originalPrice > quickPriceForm.basePrice
          ? Number(quickPriceForm.originalPrice)
          : null,
    };
    await ProductService.update(quickPriceModal.value.id, payload);
    showToast(`Tarif de "${quickPriceModal.value.name}" mis à jour : ${formatPrice(quickPriceForm.basePrice)}`);
    quickPriceModal.value = null;
    await loadData();
  } catch (err: any) {
    showToast(err.response?.data?.message || 'Erreur mise à jour prix.', 'error');
  }
};

const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  try {
    const res = await UploadService.uploadImage(file);
    uploadedImageUrl.value = res.data.data.url;
    showToast('Photo hébergée avec succès dans MinIO !');
  } catch (error) {
    showToast('Erreur téléversement MinIO.', 'error');
  }
};

const handleEditPhotoUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  isUploadingPhoto.value = true;
  try {
    const res = await UploadService.uploadImage(file);
    editForm.imageUrl = res.data.data.url;
    showToast('Nouvelle photo enregistrée avec succès !');
  } catch (error) {
    showToast('Erreur téléversement.', 'error');
  } finally {
    isUploadingPhoto.value = false;
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
          { sizeOrShoeSize: '39', color: 'Noir', sku: `SKU-${Date.now()}-39`, stockQuantity: 8 },
          { sizeOrShoeSize: '40', color: 'Noir', sku: `SKU-${Date.now()}-40`, stockQuantity: 6 },
          { sizeOrShoeSize: '41', color: 'Noir', sku: `SKU-${Date.now()}-41`, stockQuantity: 4 },
          { sizeOrShoeSize: '42', color: 'Noir', sku: `SKU-${Date.now()}-42`, stockQuantity: 3 },
        ]
      : [
          { sizeOrShoeSize: 'Standard', color: 'Noir', sku: `SKU-${Date.now()}-STD`, stockQuantity: 10 },
          { sizeOrShoeSize: 'Standard', color: 'Camel', sku: `SKU-${Date.now()}-CML`, stockQuantity: 8 },
        ];

    const finalPhoto = uploadedImageUrl.value || newProductSelectedPreset.value || '/products/sac-birkin-camel.jpg';

    const payload = {
      name: newProduct.name,
      categoryId: newProduct.categoryId,
      basePrice: newProduct.basePrice,
      originalPrice:
        newProduct.originalPrice && newProduct.originalPrice > newProduct.basePrice
          ? newProduct.originalPrice
          : null,
      description: newProduct.description,
      isFeatured: newProduct.isFeatured,
      variants: defaultVariants,
      images: [
        {
          minioUrl: finalPhoto,
          altText: newProduct.name,
          isPrimary: true,
        },
      ],
    };

    await ProductService.create(payload);
    showToast(`Produit "${newProduct.name}" créé et publié avec succès !`);
    newProduct.name = '';
    newProduct.description = '';
    uploadedImageUrl.value = '';
    isCreateModalOpen.value = false;
    await loadData();
  } catch (error: any) {
    showToast(error.response?.data?.message || 'Erreur lors de la création.', 'error');
  } finally {
    isCreating.value = false;
  }
};

const handleDeleteProduct = async (id: string) => {
  if (!confirm('Êtes-vous sûre de vouloir supprimer définitivement cet article du catalogue ?')) return;
  try {
    await ProductService.delete(id);
    showToast('Article retiré du catalogue avec succès.');
    await loadData();
  } catch (error) {
    showToast('Erreur lors de la suppression.', 'error');
  }
};

const handleStatusChange = async (orderId: string, newStatus: string) => {
  try {
    await OrderService.updateStatus(orderId, newStatus);
    showToast(`Statut commande mis à jour : ${newStatus}`);
    await loadData();
  } catch (error) {
    showToast('Erreur mise à jour statut.', 'error');
  }
};

const handleCallStatus = async (id: string, status: 'PENDING' | 'CALLED') => {
  try {
    await PhoneService.updateCallbackStatus(id, status);
    showToast(status === 'CALLED' ? 'Appel client marqué comme effectué.' : 'Appel remis en attente.');
    await loadData();
  } catch (error) {
    showToast('Erreur mise à jour appel.', 'error');
  }
};

onMounted(() => {
  if (!authStore.isAdmin) {
    authStore.loginAsDemoAdmin();
  }
  loadData();
});
</script>
