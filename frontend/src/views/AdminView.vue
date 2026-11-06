<template>
  <!-- ============================================================== -->
  <!-- ÉCRAN DE CONNEXION SÉCURISÉ DE LA GÉRANCE                      -->
  <!-- ============================================================== -->
  <div v-if="!authStore.isAdmin" class="min-h-[75vh] flex items-center justify-center px-4 py-12">
    <form
      @submit.prevent="handleAdminLogin"
      class="w-full max-w-sm bg-white rounded-3xl border border-stone-200 shadow-2xl p-8 space-y-6"
    >
      <div class="text-center space-y-2">
        <div class="w-14 h-14 rounded-2xl bg-stone-950 border border-gold-500/40 flex items-center justify-center mx-auto shadow-lg">
          <Lock class="w-6 h-6 text-gold-400" />
        </div>
        <h1 class="font-serif text-2xl font-bold text-stone-900">Espace Gérance</h1>
        <p class="text-xs text-stone-500">Accès réservé à la direction de Jumelles Store.</p>
      </div>

      <div
        v-if="!authStore.adminConfigured"
        class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed"
      >
        <strong>Accès gérance non configuré :</strong> définissez <code>ADMIN_PASSWORD</code> (12 caractères minimum) dans le fichier <code>backend/.env</code> puis redémarrez le serveur. Connectez-vous ensuite avec ce mot de passe : vous pourrez le remplacer depuis l'Espace Gérance.
      </div>

      <div>
        <label for="admin-email" class="block text-xs font-bold text-stone-700 mb-1">Adresse Email Administrateur</label>
        <input
          id="admin-email"
          v-model="adminEmail"
          type="email"
          placeholder="Ex: votre-email@gmail.com"
          autocomplete="username"
          maxlength="160"
          required
          class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
        />
      </div>

      <div>
        <div class="flex items-center justify-between mb-1">
          <label for="admin-password" class="block text-xs font-bold text-stone-700">Mot de passe</label>
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="text-[11px] font-bold text-gold-700 hover:underline cursor-pointer"
          >
            {{ showPassword ? 'Masquer' : 'Afficher' }}
          </button>
        </div>
        <input
          id="admin-password"
          v-model="adminPassword"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Entrez votre mot de passe"
          autocomplete="current-password"
          maxlength="200"
          required
          class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 outline-none"
        />
      </div>

      <p v-if="loginError" class="text-xs font-semibold text-rosewood-700 bg-rosewood-50 border border-rosewood-200 rounded-xl p-3 flex items-center gap-2">
        <AlertTriangle class="w-4 h-4 shrink-0" />
        <span>{{ loginError }}</span>
      </p>

      <button
        type="submit"
        :disabled="authStore.isLoading || !adminEmail || !adminPassword"
        class="w-full py-3 bg-stone-950 hover:bg-gold-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
      >
        {{ authStore.isLoading ? 'Vérification...' : 'Se connecter' }}
      </button>
    </form>
  </div>

  <!-- ============================================================== -->
  <!-- ADMINISTRATION MOBILE-FIRST CONNECTÉE AUX VRAIES DONNÉES        -->
  <!-- ============================================================== -->
  <div v-else class="adm-root">
    <header class="adm-top">
      <h1>
        Jumelles Store
        <small>Administration · {{ authStore.user?.email || 'Gérance' }}</small>
      </h1>
      <router-link to="/" class="adm-b adm-sm" title="Voir la boutique">Boutique ↗</router-link>
      <!-- Compte : identifiants + déconnexion regroupés dans un seul menu -->
      <details ref="accountMenuRef" class="adm-menu">
        <summary class="adm-b adm-sm" aria-label="Mon compte">Compte ▾</summary>
        <div class="adm-menu-pn">
          <button type="button" @click="closeAccountMenu(); openCredentialsModal()">Email & mot de passe</button>
          <button type="button" class="d" @click="closeAccountMenu(); authStore.logout()">Se déconnecter</button>
        </div>
      </details>
    </header>

    <main class="adm-main">
      <!-- 1. TABLEAU DE BORD -->
      <section class="adm-view" :class="{ on: activeView === 'v-dash' }" aria-label="Tableau de bord">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px">
          <div class="adm-seg" role="group" aria-label="Période">
            <button
              v-for="p in periods"
              :key="p.days"
              type="button"
              :aria-pressed="selectedPeriod === p.days"
              @click="selectedPeriod = p.days"
            >
              {{ p.label }}
            </button>
          </div>
          <button
            type="button"
            class="adm-b adm-sm"
            :disabled="isRefreshing"
            title="Actualiser les données"
            @click="refreshData"
          >
            {{ isRefreshing ? 'Actualisation…' : '↻ Actualiser' }}
          </button>
        </div>

        <!-- 4 indicateurs, une seule ligne sur ordinateur, 2 × 2 sur téléphone -->
        <div class="adm-kpis">
          <div class="adm-k">
            <span>Chiffre d’affaires</span>
            <b>{{ formatMoney(periodRevenue) }}</b>
            <em>
              Panier moyen :
              {{ periodPaidOrders.length ? formatMoney(Math.round(periodRevenue / periodPaidOrders.length)) : '–' }}
            </em>
          </div>
          <div class="adm-k">
            <span>Commandes</span>
            <b>{{ periodOrders.length }}</b>
            <em>{{ periodPaidOrders.length }} payée(s) ou en cours</em>
          </div>
          <button type="button" class="adm-k adm-k-btn" :class="{ a: pendingOrdersCount > 0 }" @click="openOrdersFilter('PENDING')">
            <span>En attente</span>
            <b>{{ pendingOrdersCount }}</b>
            <em>Voir les commandes →</em>
          </button>
          <button type="button" class="adm-k adm-k-btn" :class="{ a: lowStockProducts.length > 0 }" @click="switchView('v-stk')">
            <span>Stock bas</span>
            <b>{{ lowStockProducts.length }} <small>article(s)</small></b>
            <em>{{ criticalStockItems.length }} taille(s) / coloris →</em>
          </button>
        </div>

        <div class="adm-two">
          <div>
            <h2>Chiffre d’affaires par jour</h2>
            <div class="adm-panel">
              <svg
                class="adm-chart"
                viewBox="0 0 300 120"
                preserveAspectRatio="none"
                role="img"
                aria-label="Histogramme du chiffre d’affaires"
              >
                <g class="bars">
                  <rect
                    v-for="(bar, idx) in chartBars"
                    :key="idx"
                    :x="bar.x"
                    :y="bar.y"
                    :width="bar.w"
                    :height="bar.h"
                    rx="3"
                  >
                    <title>{{ bar.label }} : {{ formatMoney(bar.value) }}</title>
                  </rect>
                </g>
              </svg>
              <div class="adm-lbls">
                <span>{{ chartBars[0]?.label || '' }}</span>
                <span>{{ chartBars[chartBars.length - 1]?.label || '' }}</span>
              </div>
            </div>
          </div>

          <div>
            <h2>Top ventes (articles commandés)</h2>
            <div class="adm-panel">
              <template v-if="topProducts.length > 0">
                <div v-for="(tp, idx) in topProducts" :key="tp.name" class="adm-row">
                  <div class="adm-rk">{{ idx + 1 }}</div>
                  <div class="g">
                    <b>{{ tp.name }}</b>
                    <div class="adm-bar2">
                      <i :style="{ width: `${tp.pct}%` }"></i>
                    </div>
                  </div>
                  <b>{{ tp.qty }}</b>
                </div>
              </template>
              <div v-else class="adm-empty">Aucune vente enregistrée sur cette période.</div>
            </div>
          </div>
        </div>

        <h2>À traiter maintenant</h2>
        <div class="adm-list">
          <template v-if="todoOrders.length > 0">
            <article v-for="o in todoOrders" :key="o.id" class="adm-o">
              <div class="h">
                <div>
                  <div class="n">{{ o.orderNumber }}</div>
                  <div class="m">
                    {{ o.customerName }} · {{ o.shippingCity }} · {{ formatAgo(o.createdAt) }}
                  </div>
                  <div class="m" v-if="o.shippingAddress">Adresse : {{ o.shippingAddress }}</div>
                </div>
                <span class="adm-st" :class="`s-${o.status}`">{{ statusLabels[o.status] || o.status }}</span>
              </div>
              <div class="it">
                {{ formatOrderItems(o) }}
              </div>
              <div class="f">
                <span class="tot">{{ formatMoney(o.totalAmount) }}</span>
              </div>
              <div class="adm-acts">
                <button
                  v-if="allowedNext(o.status).length > 0"
                  type="button"
                  class="adm-b p"
                  @click="openStatusSheet(o)"
                >
                  {{ primaryNextText(o.status) }}
                </button>
                <a
                  class="adm-b"
                  :href="`tel:${cleanDigits(o.customerPhone)}`"
                  :aria-label="`Appeler ${o.customerName}`"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
                  </svg>
                  Appeler
                </a>
                <a
                  class="adm-b w"
                  :href="customerWhatsAppUrl(o)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 20l1.3-4.2A8 8 0 1 1 8.2 19L4 20z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </article>
          </template>
          <div v-else class="adm-empty" style="grid-column: 1 / -1">
            Aucune commande en attente à traiter pour le moment.
          </div>
        </div>
      </section>

      <!-- 2. COMMANDES RÉELLES -->
      <section class="adm-view" :class="{ on: activeView === 'v-ord' }" aria-label="Commandes">
        <div class="adm-tools">
          <input
            v-model="orderQuery"
            type="search"
            placeholder="Rechercher : n°, nom ou téléphone"
            aria-label="Rechercher une commande"
          />
          <div class="adm-chips" role="group" aria-label="Filtrer par statut">
            <button
              v-for="st in statusFilters"
              :key="st.key"
              type="button"
              class="adm-chip"
              :aria-pressed="orderStatusFilter === st.key"
              @click="orderStatusFilter = st.key"
            >
              {{ st.label }}<i>{{ st.count }}</i>
            </button>
          </div>
        </div>

        <div class="adm-list">
          <template v-if="filteredOrders.length > 0">
            <article v-for="o in filteredOrders" :key="o.id" class="adm-o">
              <div class="h">
                <div>
                  <div class="n">{{ o.orderNumber }}</div>
                  <div class="m">
                    {{ o.customerName }} ({{ o.customerPhone }}) · {{ o.shippingCity }} · {{ formatAgo(o.createdAt) }}
                  </div>
                  <div class="m" v-if="o.shippingAddress">Adresse : {{ o.shippingAddress }}</div>
                </div>
                <span class="adm-st" :class="`s-${o.status}`">{{ statusLabels[o.status] || o.status }}</span>
              </div>
              <div class="it">
                {{ formatOrderItems(o) }}
              </div>
              <div class="f">
                <span class="tot">{{ formatMoney(o.totalAmount) }}</span>
              </div>
              <div class="adm-acts">
                <button
                  v-if="allowedNext(o.status).length > 0"
                  type="button"
                  class="adm-b p"
                  @click="openStatusSheet(o)"
                >
                  {{ primaryNextText(o.status) }}
                </button>
                <a
                  class="adm-b"
                  :href="`tel:${cleanDigits(o.customerPhone)}`"
                  :aria-label="`Appeler ${o.customerName}`"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
                  </svg>
                  Appeler
                </a>
                <a
                  class="adm-b w"
                  :href="customerWhatsAppUrl(o)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 20l1.3-4.2A8 8 0 1 1 8.2 19L4 20z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </article>
          </template>
          <div v-else class="adm-empty" style="grid-column: 1 / -1">
            {{ orderStatusFilter === 'TODO' ? 'Aucune commande à traiter : tout est à jour.' : 'Aucune commande ne correspond à ce filtre.' }}
          </div>
        </div>
      </section>

      <!-- 3. STOCK RÉEL & CATALOGUE -->
      <section class="adm-view" :class="{ on: activeView === 'v-stk' }" aria-label="Stock et Catalogue">
        <div class="adm-tools adm-tools-row">
          <input
            v-model="productQuery"
            type="search"
            placeholder="Rechercher un article"
            aria-label="Rechercher un article"
          />
          <button type="button" class="adm-b p" @click="isCreateModalOpen = true">+ Nouvel article</button>
        </div>

        <!-- Stock bas : UNE ligne par article (et non une par taille), détail dans « Réassortir » -->
        <h2>
          Stock bas
          <small class="adm-h-sub">4 pièces ou moins</small>
        </h2>
        <div class="adm-panel">
          <template v-if="lowStockProducts.length > 0">
            <div v-for="g in visibleLowStock" :key="g.product.id" class="adm-row">
              <div class="g">
                <b>{{ g.product.name }}</b>
                <span class="adm-vchips">
                  <i
                    v-for="v in g.variants.slice(0, 6)"
                    :key="v.variantId"
                    :class="v.stock === 0 ? 'z' : ''"
                    :title="`${v.variantLabel} : ${v.stock}`"
                  >{{ v.short }} · {{ v.stock }}</i>
                  <i v-if="g.variants.length > 6" class="more">+{{ g.variants.length - 6 }}</i>
                </span>
              </div>
              <span v-if="g.outCount > 0" class="adm-low l0">{{ g.outCount }} en rupture</span>
              <button type="button" class="adm-b adm-sm" @click="openManageStockModal(g.product)">Réassortir</button>
            </div>
            <button
              v-if="lowStockProducts.length > LOW_STOCK_PREVIEW"
              type="button"
              class="adm-more"
              @click="showAllLowStock = !showAllLowStock"
            >
              {{ showAllLowStock ? 'Afficher moins' : `Voir les ${lowStockProducts.length - LOW_STOCK_PREVIEW} autres articles` }}
            </button>
          </template>
          <div v-else class="adm-empty">Aucun article en stock bas : toutes les tailles ont plus de 4 pièces.</div>
        </div>

        <h2>
          Catalogue
          <small class="adm-h-sub">{{ filteredProducts.length }} article(s)</small>
        </h2>
        <div class="adm-list">
          <article v-for="p in filteredProducts" :key="p.id" class="adm-o adm-prod">
            <img
              loading="lazy"
              decoding="async"
              :src="getProductThumbnail(p)"
              :alt="p.name"
              class="adm-thumb"
            />
            <div class="adm-prod-body">
              <div class="adm-prod-name">{{ p.name }}</div>
              <div class="m">
                {{ formatMoney(p.basePrice) }} ·
                <span :class="getTotalStock(p) === 0 ? 'adm-txt-bad' : ''">{{ getTotalStock(p) }} en stock</span>
                · {{ p.variants?.length || 0 }} taille(s)/coloris
              </div>
              <div class="adm-acts adm-acts-sm">
                <button type="button" class="adm-b adm-sm" @click="openEditProductModal(p)">Modifier</button>
                <button type="button" class="adm-b adm-sm" @click="openManageStockModal(p)">Stock</button>
                <button type="button" class="adm-link-d" @click="handleDeleteProduct(p.id)">Supprimer</button>
              </div>
            </div>
          </article>
          <div v-if="filteredProducts.length === 0" class="adm-empty" style="grid-column: 1 / -1">
            Aucun article ne correspond à « {{ productQuery }} ».
          </div>
        </div>
      </section>

      <!-- 4. DEMANDES DE RAPPEL RÉELLES -->
      <section class="adm-view" :class="{ on: activeView === 'v-cb' }" aria-label="Rappels">
        <h2 style="margin-top: 6px">Demandes de rappel téléphonique ({{ phoneCallbacks.length }})</h2>
        <div class="adm-list">
          <template v-if="phoneCallbacks.length > 0">
            <article v-for="cb in phoneCallbacks" :key="cb.id" class="adm-o">
              <div class="h">
                <div>
                  <b>{{ cb.customerName || 'Cliente' }} ({{ cb.customerPhone }})</b>
                  <div class="m">{{ cb.productInterest || 'Demande de rappel' }}</div>
                  <div class="m">{{ formatAgo(cb.createdAt) }}</div>
                </div>
                <span class="adm-st" :class="cb.status === 'CALLED' ? 's-DELIVERED' : 's-PENDING'">
                  {{ cb.status === 'CALLED' ? 'Traitée' : 'À rappeler' }}
                </span>
              </div>
              <div class="adm-acts">
                <a class="adm-b p" :href="`tel:${cleanDigits(cb.customerPhone)}`">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
                  </svg>
                  Rappeler
                </a>
                <button
                  v-if="cb.status !== 'CALLED'"
                  type="button"
                  class="adm-b"
                  @click="handleCallStatus(cb.id, 'CALLED')"
                >
                  Marquer traitée
                </button>
              </div>
            </article>
          </template>
          <div v-else class="adm-empty" style="grid-column: 1 / -1">
            Aucune demande de rappel téléphonique enregistrée.
          </div>
        </div>
      </section>
    </main>

    <!-- BARRE DE NAVIGATION BASSE (MOBILE) / LATÉRALE (ORDINATEUR) -->
    <nav class="adm-nav" aria-label="Sections">
      <button
        type="button"
        :aria-current="activeView === 'v-dash' ? 'page' : undefined"
        @click="switchView('v-dash')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />
        </svg>
        Tableau
      </button>

      <button
        type="button"
        :aria-current="activeView === 'v-ord' ? 'page' : undefined"
        @click="switchView('v-ord')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 8h12l-1 12H7L6 8zM9 8a3 3 0 0 1 6 0" />
        </svg>
        Commandes
        <span v-if="pendingOrdersCount > 0" class="dot" :aria-label="`${pendingOrdersCount} à traiter`">
          {{ pendingOrdersCount }}
        </span>
      </button>

      <button
        type="button"
        :aria-current="activeView === 'v-stk' ? 'page' : undefined"
        @click="switchView('v-stk')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 7l9-4 9 4v10l-9 4-9-4V7zM3 7l9 4 9-4M12 11v10" />
        </svg>
        Stock
        <span v-if="lowStockProducts.length > 0" class="dot" :aria-label="`${lowStockProducts.length} article(s) en stock bas`">
          {{ lowStockProducts.length }}
        </span>
      </button>

      <button
        type="button"
        :aria-current="activeView === 'v-cb' ? 'page' : undefined"
        @click="switchView('v-cb')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </svg>
        Rappels
        <span v-if="pendingCallbacksCount > 0" class="dot">
          {{ pendingCallbacksCount }}
        </span>
      </button>
    </nav>

    <!-- FENÊTRE DE CHANGEMENT DE STATUT (#sheet) -->
    <div id="adm-sheet" :class="{ on: !!sheetOrder }" role="dialog" aria-modal="true" aria-labelledby="sh-t">
      <div class="bg" @click="closeStatusSheet"></div>
      <div v-if="sheetOrder && !confirmingCancel" class="pn">
        <h3 id="sh-t">Changer le statut</h3>
        <div class="m" style="color: var(--adm-mut)">
          {{ sheetOrder.orderNumber }} · {{ sheetOrder.customerName }}<br />
          Actuel :
          <span class="adm-st" :class="`s-${sheetOrder.status}`">
            {{ statusLabels[sheetOrder.status] || sheetOrder.status }}
          </span>
        </div>
        <div class="opts">
          <button
            v-for="nextSt in allowedNext(sheetOrder.status)"
            :key="nextSt"
            type="button"
            class="adm-b"
            :class="nextSt === 'CANCELLED' ? 'd' : 'p'"
            @click="selectNextStatus(nextSt)"
          >
            {{ nextStatusText[nextSt] }}
          </button>
          <button type="button" class="adm-b" @click="closeStatusSheet">Fermer</button>
        </div>
      </div>

      <div v-else-if="sheetOrder && confirmingCancel" class="pn">
        <h3 id="sh-t">Annuler cette commande ?</h3>
        <div class="adm-warnbox">
          Les articles de cette commande seront remis en stock automatiquement. L’action est définitive : une commande annulée ne peut plus être rouverte.
        </div>
        <div class="opts">
          <button type="button" class="adm-b d" @click="applyStatusChange(sheetOrder.id, 'CANCELLED')">
            Oui, annuler la commande
          </button>
          <button type="button" class="adm-b" @click="confirmingCancel = false">
            Non, revenir
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL MODIFICATION EMAIL / MOT DE PASSE ADMIN -->
    <div
      v-if="showCredentialsModal"
      class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="showCredentialsModal = false"
    >
      <form
        @submit.prevent="handleUpdateCredentials"
        class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5 text-stone-900"
      >
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="font-serif text-xl font-bold">Identifiants Administrateur</h3>
          <button type="button" @click="showCredentialsModal = false" class="text-stone-400 hover:text-stone-700 font-bold">✕</button>
        </div>
        <p class="text-xs text-stone-500">
          Définissez l'adresse email et le mot de passe demandés pour accéder à l'Espace Gérance.
        </p>
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Nouvelle Adresse Email Admin *</label>
          <input
            v-model="credForm.email"
            type="email"
            required
            placeholder="Ex: votre-email@gmail.com"
            class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm outline-none"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Mot de passe actuel *</label>
          <input
            v-model="credForm.currentPassword"
            type="password"
            required
            autocomplete="current-password"
            placeholder="Votre mot de passe actuel"
            class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm outline-none"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Nouveau Mot de passe Admin * (12 caractères minimum)</label>
          <input
            v-model="credForm.password"
            type="password"
            required
            minlength="12"
            autocomplete="new-password"
            placeholder="Choisissez votre mot de passe"
            class="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm outline-none"
          />
        </div>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" @click="showCredentialsModal = false" class="adm-b">Annuler</button>
          <button type="submit" :disabled="authStore.isLoading" class="adm-b p">Enregistrer</button>
        </div>
      </form>
    </div>

    <!-- MODAL GESTION DU STOCK & POINTURES D'UN ARTICLE -->
    <div
      v-if="manageStockModal"
      class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="manageStockModal = null"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl space-y-4 text-stone-900 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="font-serif text-lg font-bold">Stock : {{ manageStockModal.name }}</h3>
          <button type="button" @click="manageStockModal = null" class="font-bold">✕</button>
        </div>
        <div class="space-y-2">
          <div
            v-for="v in manageStockModal.variants"
            :key="v.id"
            class="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-stone-200 text-xs"
          >
            <div>
              <b>{{ v.color }} · {{ v.sizeOrShoeSize }}</b>
              <div class="text-stone-500">Stock actuel : {{ v.stockQuantity }}</div>
            </div>
            <div class="flex items-center gap-1.5">
              <button type="button" class="adm-b" style="min-height: 32px; padding: 0 10px" @click="handleQuickAdjustStock(manageStockModal, v, -1)">-1</button>
              <button type="button" class="adm-b p" style="min-height: 32px; padding: 0 10px" @click="handleQuickAdjustStock(manageStockModal, v, 5)">+5</button>
            </div>
          </div>
        </div>
        <form @submit.prevent="handleAddVariant" class="border-t border-stone-200 pt-3 space-y-2 text-xs">
          <div class="font-bold">Ajouter une variante (pointure / couleur)</div>
          <div class="grid grid-cols-3 gap-2">
            <input v-model="newVariantData.color" placeholder="Couleur" required class="px-3 py-2 border rounded-lg" />
            <input v-model="newVariantData.sizeOrShoeSize" placeholder="Taille/Pointure" required class="px-3 py-2 border rounded-lg" />
            <input v-model.number="newVariantData.stockQuantity" type="number" min="0" placeholder="Stock" required class="px-3 py-2 border rounded-lg" />
          </div>
          <button type="submit" class="adm-b p" style="width: 100%; justify-content: center">+ Ajouter la variante</button>
        </form>
      </div>
    </div>

    <!-- MODAL MODIFICATION FICHE / PRIX -->
    <div
      v-if="editProductModal"
      class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="editProductModal = null"
    >
      <form
        @submit.prevent="handleSaveProductEdit"
        class="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4 text-stone-900"
      >
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="font-serif text-lg font-bold">Modifier l'article</h3>
          <button type="button" @click="editProductModal = null" class="font-bold">✕</button>
        </div>
        <div>
          <label class="block text-xs font-bold mb-1">Nom de l'article</label>
          <input v-model="editForm.name" required class="w-full px-3 py-2.5 border rounded-xl text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold mb-1">Prix (FCFA)</label>
          <input v-model.number="editForm.basePrice" type="number" min="500" required class="w-full px-3 py-2.5 border rounded-xl text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold mb-1">Description</label>
          <textarea v-model="editForm.description" rows="3" class="w-full px-3 py-2 border rounded-xl text-xs"></textarea>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="adm-b" @click="editProductModal = null">Annuler</button>
          <button type="submit" :disabled="isSavingEdit" class="adm-b p">Enregistrer</button>
        </div>
      </form>
    </div>

    <!-- MODAL CRÉATION NOUVEL ARTICLE -->
    <div
      v-if="isCreateModalOpen"
      class="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="isCreateModalOpen = false"
    >
      <form
        @submit.prevent="handleCreateProduct"
        class="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4 text-stone-900 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 class="font-serif text-lg font-bold">Nouvel article</h3>
          <button type="button" @click="isCreateModalOpen = false" class="font-bold">✕</button>
        </div>
        <div>
          <label class="block text-xs font-bold mb-1">Nom de l'article *</label>
          <input v-model="newProduct.name" required placeholder="Ex: Sac Cabas Cuir..." class="w-full px-3 py-2.5 border rounded-xl text-sm" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold mb-1">Catégorie *</label>
            <select v-model="newProduct.categoryId" class="w-full px-3 py-2.5 border rounded-xl text-xs bg-white">
              <option value="cat-sac-1">Sacs à Main</option>
              <option value="cat-sac-2">Pochettes</option>
              <option value="cat-shoe-1">Escarpins & Mules</option>
              <option value="cat-shoe-2">Sandales</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold mb-1">Prix (FCFA) *</label>
            <input v-model.number="newProduct.basePrice" type="number" min="500" required class="w-full px-3 py-2.5 border rounded-xl text-sm" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold mb-1">Photo de l'article</label>
          <input type="file" accept="image/*" @change="handleFileUpload" class="w-full text-xs" />
        </div>
        <div>
          <label class="block text-xs font-bold mb-1">Description</label>
          <textarea v-model="newProduct.description" rows="2" class="w-full px-3 py-2 border rounded-xl text-xs"></textarea>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="adm-b" @click="isCreateModalOpen = false">Annuler</button>
          <button type="submit" :disabled="isCreating" class="adm-b p">Créer l'article</button>
        </div>
      </form>
    </div>

    <div id="adm-toast" :class="{ on: !!toastMessage }" role="status" aria-live="polite">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { Lock, AlertTriangle } from 'lucide-vue-next';
import { ProductService, OrderService, PhoneService, UploadService } from '../services/api';
import { useAuthStore } from '../stores/auth';
import { buildWhatsAppSendUrl } from '../stores/phone';

const authStore = useAuthStore();

// Vue active : v-dash | v-ord | v-stk | v-cb
const activeView = ref<'v-dash' | 'v-ord' | 'v-stk' | 'v-cb'>('v-dash');
const switchView = (v: 'v-dash' | 'v-ord' | 'v-stk' | 'v-cb') => {
  activeView.value = v;
  if (typeof window !== 'undefined') window.scrollTo(0, 0);
};

// Données réelles chargées depuis l'API
const products = ref<any[]>([]);
const orders = ref<any[]>([]);
const phoneCallbacks = ref<any[]>([]);

// Période du tableau de bord (en nombre de jours : 0 = Aujourd'hui, 6 = 7 jours, 13 = 14 jours, 3650 = Tout)
const periods = [
  { label: 'Aujourd’hui', days: 0 },
  { label: '7 jours', days: 6 },
  { label: '14 jours', days: 13 },
  { label: 'Tout', days: 3650 },
];
const selectedPeriod = ref<number>(13);

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  PAID: 'Payée',
  PREPARING: 'En préparation',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

const nextStatusMap: Record<string, string[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['PREPARING', 'CANCELLED'],
  PREPARING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

const nextStatusText: Record<string, string> = {
  PAID: 'Marquer comme payée',
  PREPARING: 'Passer en préparation',
  SHIPPED: 'Marquer comme expédiée',
  DELIVERED: 'Marquer comme livrée',
  CANCELLED: 'Annuler la commande',
};

const revenueStatuses = new Set(['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED']);

const daysAgo = (dateStr?: string): number => {
  if (!dateStr) return 0;
  const created = new Date(dateStr);
  if (isNaN(created.getTime())) return 0;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfCreated = new Date(created.getFullYear(), created.getMonth(), created.getDate()).getTime();
  return Math.max(0, Math.round((startOfToday - startOfCreated) / 86400000));
};

const formatAgo = (dateStr?: string): string => {
  const d = daysAgo(dateStr);
  return d === 0 ? 'aujourd’hui' : `il y a ${d} j`;
};

const formatMoney = (n: number): string =>
  `${new Intl.NumberFormat('fr-FR').format(Math.round(Number(n) || 0))} FCFA`;

const cleanDigits = (phone?: string): string => String(phone || '').replace(/\D/g, '');

const formatOrderItems = (o: any): string => {
  if (!Array.isArray(o.items) || o.items.length === 0) return 'Articles commandés';
  return o.items
    .map((i: any) => `${i.quantity} × ${i.productName}${i.variantDetails ? ` (${i.variantDetails})` : ''}`)
    .join(', ');
};

const customerWhatsAppUrl = (o: any): string => {
  const digits = cleanDigits(o.customerPhone);
  const phone = digits.startsWith('221') ? digits : `221${digits}`;
  const msg = `Bonjour ${o.customerName}, concernant votre commande ${o.orderNumber} chez Jumelles Store.`;
  return buildWhatsAppSendUrl(msg, phone);
};

// Commandes filtrées sur la période choisie
const periodOrders = computed(() =>
  orders.value.filter((o) => daysAgo(o.createdAt) <= selectedPeriod.value)
);

const periodPaidOrders = computed(() =>
  periodOrders.value.filter((o) => revenueStatuses.has(o.status))
);

const periodRevenue = computed(() =>
  periodPaidOrders.value.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)
);

const pendingOrdersCount = computed(
  () => orders.value.filter((o) => o.status === 'PENDING').length
);

const pendingCallbacksCount = computed(
  () => phoneCallbacks.value.filter((c) => c.status !== 'CALLED').length
);

// Stock critique réel (<= 4 unités)
const criticalStockItems = computed(() => {
  const list: Array<{
    productId: string;
    variantId: string;
    productName: string;
    variantLabel: string;
    stock: number;
  }> = [];

  for (const p of products.value) {
    for (const v of p.variants || []) {
      const stock = Number(v.stockQuantity) || 0;
      if (stock <= 4) {
        list.push({
          productId: p.id,
          variantId: v.id,
          productName: p.name,
          variantLabel: `${v.sizeOrShoeSize || 'Unique'} · ${v.color || 'Standard'}`,
          stock,
        });
      }
    }
  }
  return list.sort((a, b) => a.stock - b.stock);
});

/** Stock bas regroupé par article : une ligne par article au lieu d'une ligne par taille */
const LOW_STOCK_PREVIEW = 5;
const showAllLowStock = ref(false);

const lowStockProducts = computed(() => {
  const groups = new Map<string, { product: any; variants: any[]; outCount: number; minStock: number }>();
  for (const item of criticalStockItems.value) {
    const product = products.value.find((p) => p.id === item.productId);
    if (!product) continue;
    const variant = (product.variants || []).find((v: any) => v.id === item.variantId) || {};
    const size = variant.sizeOrShoeSize && variant.sizeOrShoeSize !== 'Standard' ? variant.sizeOrShoeSize : '';
    const color = String(variant.color || '').split(' ')[0];
    const group = groups.get(product.id) || { product, variants: [], outCount: 0, minStock: Infinity };
    group.variants.push({ ...item, short: [size, color].filter(Boolean).join(' ') || 'Unique' });
    if (item.stock === 0) group.outCount += 1;
    group.minStock = Math.min(group.minStock, item.stock);
    groups.set(product.id, group);
  }
  // Ruptures d'abord, puis les stocks les plus bas
  return [...groups.values()].sort((a, b) => b.outCount - a.outCount || a.minStock - b.minStock);
});

const visibleLowStock = computed(() =>
  showAllLowStock.value ? lowStockProducts.value : lowStockProducts.value.slice(0, LOW_STOCK_PREVIEW)
);

// Recherche dans le catalogue
const productQuery = ref('');
const filteredProducts = computed(() => {
  const q = productQuery.value.trim().toLowerCase();
  return q ? products.value.filter((p) => p.name.toLowerCase().includes(q)) : products.value;
});

// Menu « Compte » de l'en-tête
const accountMenuRef = ref<HTMLDetailsElement | null>(null);
const closeAccountMenu = () => {
  if (accountMenuRef.value) accountMenuRef.value.open = false;
};

// Actualisation manuelle avec retour visuel
const isRefreshing = ref(false);
const refreshData = async () => {
  isRefreshing.value = true;
  try {
    await loadData();
  } finally {
    isRefreshing.value = false;
  }
};

// Histogramme du chiffre d'affaires par jour à partir des vraies commandes
const chartBars = computed(() => {
  const n = Math.min(selectedPeriod.value === 3650 ? 14 : selectedPeriod.value + 1, 14);
  const values: number[] = [];
  const labels: string[] = [];
  const now = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const daySum = orders.value
      .filter((o) => daysAgo(o.createdAt) === i && revenueStatuses.has(o.status))
      .reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
    values.push(daySum);
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    labels.push(`${dt.getDate()}/${dt.getMonth() + 1}`);
  }

  const maxVal = Math.max(...values, 1);
  const w = 300 / n;
  return values.map((val, idx) => {
    const bh = Math.max(val > 0 ? 6 : 2, (val / maxVal) * 110);
    return {
      x: idx * w + w * 0.15,
      y: 116 - bh,
      w: w * 0.7,
      h: bh,
      value: val,
      label: labels[idx],
    };
  });
});

// Top ventes réel
const topProducts = computed(() => {
  const counts: Record<string, number> = {};
  for (const o of periodOrders.value.filter((x) => x.status !== 'CANCELLED')) {
    for (const it of o.items || []) {
      const name = it.productName || 'Article';
      counts[name] = (counts[name] || 0) + (Number(it.quantity) || 1);
    }
  }
  const sorted = Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, 4);
  const maxQty = sorted.length > 0 ? counts[sorted[0]] : 1;
  return sorted.map((name) => ({
    name,
    qty: counts[name],
    pct: Math.round((counts[name] / maxQty) * 100),
  }));
});

// Commandes à traiter maintenant (PENDING ou PAID)
const todoOrders = computed(() =>
  orders.value.filter((o) => o.status === 'PENDING' || o.status === 'PAID')
);

// Recherche et filtre de l'onglet Commandes
const orderQuery = ref('');
// Par défaut : seulement les commandes encore en cours (les annulées / livrées n'encombrent plus la liste)
const ACTIVE_STATUSES = new Set(['PENDING', 'PAID', 'PREPARING', 'SHIPPED']);
const orderStatusFilter = ref('TODO');

const statusFilters = computed(() => {
  const counts: Record<string, number> = { ALL: orders.value.length, TODO: 0 };
  for (const o of orders.value) {
    counts[o.status] = (counts[o.status] || 0) + 1;
    if (ACTIVE_STATUSES.has(o.status)) counts.TODO += 1;
  }
  return [
    { key: 'TODO', label: 'À traiter', count: counts.TODO },
    { key: 'ALL', label: 'Toutes', count: counts.ALL || 0 },
    // Statuts sans aucune commande masqués (sauf s'il est sélectionné)
    ...Object.keys(statusLabels)
      .filter((k) => (counts[k] || 0) > 0 || orderStatusFilter.value === k)
      .map((k) => ({ key: k, label: statusLabels[k], count: counts[k] || 0 })),
  ];
});

const openOrdersFilter = (status: string) => {
  orderStatusFilter.value = status;
  orderQuery.value = '';
  switchView('v-ord');
};

const filteredOrders = computed(() => {
  const q = orderQuery.value.trim().toLowerCase();
  return orders.value.filter((o) => {
    const matchStatus =
      orderStatusFilter.value === 'ALL' ||
      (orderStatusFilter.value === 'TODO' ? ACTIVE_STATUSES.has(o.status) : o.status === orderStatusFilter.value);
    const matchQuery =
      !q ||
      `${o.orderNumber} ${o.customerName} ${o.customerPhone} ${o.shippingCity}`
        .toLowerCase()
        .includes(q);
    return matchStatus && matchQuery;
  });
});

const allowedNext = (st: string): string[] => nextStatusMap[st] || [];
const primaryNextText = (st: string): string => {
  const nx = allowedNext(st).find((s) => s !== 'CANCELLED');
  return nx ? nextStatusText[nx] : 'Changer le statut';
};

// Feuille modale de changement de statut (#adm-sheet)
const sheetOrder = ref<any | null>(null);
const confirmingCancel = ref(false);

const openStatusSheet = (order: any) => {
  sheetOrder.value = order;
  confirmingCancel.value = false;
};

const closeStatusSheet = () => {
  sheetOrder.value = null;
  confirmingCancel.value = false;
};

const selectNextStatus = async (nextSt: string) => {
  if (!sheetOrder.value) return;
  if (nextSt === 'CANCELLED') {
    confirmingCancel.value = true;
    return;
  }
  await applyStatusChange(sheetOrder.value.id, nextSt);
};

const applyStatusChange = async (orderId: string, newStatus: string) => {
  try {
    await OrderService.updateStatus(orderId, newStatus);
    closeStatusSheet();
    await loadData();
    showToast(
      newStatus === 'CANCELLED'
        ? 'Commande annulée, stock remis à jour'
        : `Statut : ${statusLabels[newStatus] || newStatus}`
    );
  } catch (err: any) {
    showToast(err.response?.data?.message || 'Erreur lors du changement de statut', 'error');
  }
};

// Toast
const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');
let toastTimer: any = null;
const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = msg;
  toastType.value = type;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = '';
  }, 2600);
};

/** Session expirée (401) : retour à l'écran de connexion ; sinon message précis renvoyé par le serveur */
const handleAdminError = (err: any, fallback: string) => {
  if (err?.response?.status === 401) {
    authStore.user = null;
    authStore.isAuthenticated = false;
    loginError.value = 'Session expirée : veuillez vous reconnecter.';
    return;
  }
  showToast(err?.response?.data?.message || fallback, 'error');
};

// Chargement des vraies données depuis le backend
const loadData = async () => {
  try {
    const [prodRes, ordRes, cbRes] = await Promise.all([
      ProductService.getAll(),
      OrderService.getAllAdmin(),
      PhoneService.getCallbacks(),
    ]);
    products.value = Array.isArray(prodRes.data?.data) ? prodRes.data.data : [];
    orders.value = Array.isArray(ordRes.data?.data) ? ordRes.data.data : [];
    phoneCallbacks.value = Array.isArray(cbRes.data?.data) ? cbRes.data.data : [];
  } catch (err) {
    console.error('Erreur chargement données réelles Admin:', err);
    handleAdminError(err, 'Impossible de charger les données. Vérifiez la connexion.');
  }
};

// Gestion du stock et du catalogue
const getProductThumbnail = (product: any) => {
  if (product.images && product.images.length > 0) {
    return product.images[0].minioUrl;
  }
  return '/products/sac-cadenas-camel.jpg';
};

const getTotalStock = (product: any) => {
  if (!product.variants) return 0;
  return product.variants.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0);
};

const quickReplenish = async (productId: string, variantId: string, qty: number) => {
  try {
    await ProductService.replenishStock({ productId, variantId, quantityToAdd: qty });
    await loadData();
    showToast(`+${qty} unité(s) ajoutées au stock.`);
  } catch (err) {
    handleAdminError(err, 'Erreur réapprovisionnement.');
  }
};

const manageStockModal = ref<any>(null);
const newVariantData = reactive({
  sizeOrShoeSize: '39',
  color: 'Noir',
  stockQuantity: 10,
});

const openManageStockModal = (product: any) => {
  manageStockModal.value = product;
  newVariantData.sizeOrShoeSize = 'Standard';
  newVariantData.color = 'Noir';
  newVariantData.stockQuantity = 10;
};

const handleQuickAdjustStock = async (product: any, variant: any, delta: number) => {
  const newQty = Math.max(0, (variant.stockQuantity || 0) + delta);
  try {
    await ProductService.replenishStock({
      productId: product.id,
      variantId: variant.id,
      newStockQuantity: newQty,
    });
    variant.stockQuantity = newQty;
    await loadData();
    showToast(`Stock mis à jour : ${newQty}`);
  } catch (err) {
    handleAdminError(err, 'Erreur mise à jour du stock.');
  }
};

const handleAddVariant = async () => {
  if (!manageStockModal.value) return;
  try {
    await ProductService.addVariant(manageStockModal.value.id, { ...newVariantData });
    await loadData();
    const updated = products.value.find((p) => p.id === manageStockModal.value.id);
    if (updated) manageStockModal.value = updated;
    showToast('Nouvelle variante ajoutée.');
  } catch (err) {
    handleAdminError(err, 'Erreur ajout variante.');
  }
};

const editProductModal = ref<any>(null);
const isSavingEdit = ref(false);
const editForm = reactive({
  id: '',
  name: '',
  basePrice: 0,
  description: '',
});

const openEditProductModal = (product: any) => {
  editProductModal.value = product;
  editForm.id = product.id;
  editForm.name = product.name;
  editForm.basePrice = product.basePrice;
  editForm.description = product.description || '';
};

const handleSaveProductEdit = async () => {
  if (!editForm.id) return;
  isSavingEdit.value = true;
  try {
    await ProductService.update(editForm.id, {
      name: editForm.name,
      basePrice: editForm.basePrice,
      description: editForm.description,
    });
    editProductModal.value = null;
    await loadData();
    showToast('Fiche article mise à jour.');
  } catch (err) {
    handleAdminError(err, 'Erreur modification article.');
  } finally {
    isSavingEdit.value = false;
  }
};

const isCreateModalOpen = ref(false);
const isCreating = ref(false);
const uploadedImageUrl = ref('');
const newProduct = reactive({
  name: '',
  categoryId: 'cat-sac-1',
  basePrice: 15000,
  description: '',
});

const handleFileUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  try {
    const res = await UploadService.uploadImage(input.files[0]);
    uploadedImageUrl.value = res.data.data.url;
    showToast('Photo téléversée.');
  } catch (err) {
    handleAdminError(err, 'Erreur téléversement image.');
  }
};

const handleCreateProduct = async () => {
  if (!newProduct.name) return;
  isCreating.value = true;
  try {
    const isShoeCat = newProduct.categoryId.includes('shoe');
    await ProductService.create({
      name: newProduct.name,
      categoryId: newProduct.categoryId,
      basePrice: newProduct.basePrice,
      description: newProduct.description || `${newProduct.name} - Collection Jumelles Store Dakar.`,
      isFeatured: true,
      images: [
        {
          minioUrl: uploadedImageUrl.value || '/products/sac-cadenas-camel.jpg',
          altText: newProduct.name,
          isPrimary: true,
        },
      ],
      variants: isShoeCat
        ? ['38', '39', '40'].map((sz) => ({
            sku: `JUM-${Date.now()}-${sz}`,
            sizeOrShoeSize: sz,
            color: 'Noir',
            stockQuantity: 10,
          }))
        : [
            {
              sku: `JUM-${Date.now()}-STD`,
              sizeOrShoeSize: 'Standard',
              color: 'Classique',
              stockQuantity: 10,
            },
          ],
    });
    isCreateModalOpen.value = false;
    newProduct.name = '';
    uploadedImageUrl.value = '';
    await loadData();
    showToast('Nouvel article ajouté au catalogue.');
  } catch (err) {
    handleAdminError(err, 'Erreur création article.');
  } finally {
    isCreating.value = false;
  }
};

const handleDeleteProduct = async (id: string) => {
  if (!confirm('Supprimer définitivement cet article du catalogue ?')) return;
  try {
    await ProductService.delete(id);
    await loadData();
    showToast('Article supprimé.');
  } catch (err) {
    handleAdminError(err, 'Erreur suppression.');
  }
};

const handleCallStatus = async (id: string, status: 'PENDING' | 'CALLED') => {
  try {
    await PhoneService.updateCallbackStatus(id, status);
    await loadData();
    showToast('Demande marquée traitée');
  } catch (err) {
    handleAdminError(err, 'Erreur mise à jour rappel.');
  }
};

// Connexion et modification des identifiants Admin
const adminEmail = ref('');
const adminPassword = ref('');
const showPassword = ref(false);
const loginError = ref('');

const showCredentialsModal = ref(false);
const credForm = reactive({
  email: '',
  currentPassword: '',
  password: '',
});

const openCredentialsModal = () => {
  credForm.email = authStore.user?.email || adminEmail.value || '';
  credForm.currentPassword = '';
  credForm.password = '';
  showCredentialsModal.value = true;
};

const handleUpdateCredentials = async () => {
  try {
    await authStore.updateCredentials(credForm.email, credForm.password, credForm.currentPassword);
    credForm.currentPassword = '';
    credForm.password = '';
    showCredentialsModal.value = false;
    showToast('Identifiants administrateur mis à jour !');
  } catch (err: any) {
    showToast(err.response?.data?.message || 'Erreur mise à jour identifiants.', 'error');
  }
};

const handleAdminLogin = async () => {
  loginError.value = '';
  try {
    await authStore.loginAdmin(adminEmail.value, adminPassword.value);
    adminPassword.value = '';
    await loadData();
  } catch (err: any) {
    loginError.value = err.response?.data?.message || 'Connexion impossible.';
  }
};

const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && sheetOrder.value) {
    closeStatusSheet();
  }
};

onMounted(async () => {
  window.addEventListener('keydown', handleEscapeKey);
  await authStore.checkAdminStatus();
  if (!authStore.sessionChecked) {
    await authStore.checkSession();
  }
  if (authStore.isAdmin) {
    await loadData();
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscapeKey);
});
</script>

<style scoped>
.adm-root {
  --adm-bg: #f6f2ec;
  --adm-card: #fff;
  --adm-tx: #241d19;
  --adm-mut: #6f625a;
  --adm-bd: #e7ddd1;
  --adm-gold: #a97a2c;
  --adm-goldbg: #f6ecd9;
  --adm-ink: #17110e;
  --adm-ok: #23794a;
  --adm-okb: #e2f3e8;
  --adm-warn: #a8670f;
  --adm-warnb: #fbefd6;
  --adm-bad: #b33a3a;
  --adm-badb: #f9e2e2;
  --adm-info: #2c5d9b;
  --adm-infob: #e2ecf9;
  --adm-sh: 0 4px 16px rgba(36, 29, 25, 0.07);
  min-height: 100vh;
  background: var(--adm-bg);
  color: var(--adm-tx);
  font: 15px/1.5 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  padding-bottom: 84px;
}

.adm-top {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--adm-bg);
  border-bottom: 1px solid var(--adm-bd);
  padding: 10px 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.adm-top h1 {
  font: 700 18px Georgia, serif;
  margin: 0;
  flex: 1;
  letter-spacing: 0.02em;
}

.adm-top small {
  display: block;
  font: 600 11px system-ui;
  color: var(--adm-mut);
}

.adm-live {
  font: 700 11px system-ui;
  background: var(--adm-okb);
  color: var(--adm-ok);
  border-radius: 999px;
  padding: 4px 10px;
}

.adm-main {
  padding: 14px 16px;
  max-width: 1100px;
  margin: 0 auto;
}

.adm-view {
  display: none;
}

.adm-view.on {
  display: block;
  animation: admIn 0.3s;
}

@keyframes admIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

.adm-root h2 {
  font: 700 17px Georgia, serif;
  margin: 22px 0 10px;
}

.adm-seg {
  display: flex;
  gap: 6px;
  background: var(--adm-card);
  border: 1px solid var(--adm-bd);
  border-radius: 14px;
  padding: 4px;
  width: max-content;
  max-width: 100%;
  overflow-x: auto;
}

.adm-seg button {
  border: 0;
  background: transparent;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  font-weight: 600;
  color: var(--adm-mut);
  cursor: pointer;
  white-space: nowrap;
}

.adm-seg button[aria-pressed='true'] {
  background: var(--adm-ink);
  color: #fff;
}

.adm-kpis {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 12px;
}

.adm-k {
  background: var(--adm-card);
  border: 1px solid var(--adm-bd);
  border-radius: 18px;
  padding: 14px;
  box-shadow: var(--adm-sh);
}

.adm-k span {
  font-size: 12px;
  color: var(--adm-mut);
  display: block;
}

.adm-k b {
  display: block;
  font: 700 22px Georgia, serif;
  margin-top: 2px;
  word-break: break-word;
}

.adm-k em {
  font-style: normal;
  font-size: 12px;
  font-weight: 700;
}

.adm-k.a {
  border-color: var(--adm-warn);
}

.adm-k.wide {
  grid-column: 1 / -1;
}

.adm-panel {
  background: var(--adm-card);
  border: 1px solid var(--adm-bd);
  border-radius: 18px;
  padding: 14px;
  box-shadow: var(--adm-sh);
}

svg.adm-chart {
  width: 100%;
  height: 120px;
  display: block;
}

svg.adm-chart .bars rect {
  fill: var(--adm-gold);
  transition: height 0.5s, y 0.5s;
}

.adm-lbls {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--adm-mut);
  margin-top: 4px;
}

.adm-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--adm-bd);
}

.adm-row:last-child {
  border: 0;
}

.adm-row .g {
  flex: 1;
  min-width: 0;
}

.adm-row .g b,
.adm-row .g span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.adm-row .g span {
  font-size: 13px;
  color: var(--adm-mut);
}

.adm-rk {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--adm-goldbg);
  color: var(--adm-gold);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 13px;
  flex: none;
}

.adm-bar2 {
  height: 6px;
  background: var(--adm-bd);
  border-radius: 3px;
  margin-top: 6px;
  overflow: hidden;
}

.adm-bar2 i {
  display: block;
  height: 100%;
  background: var(--adm-gold);
}

.adm-tools {
  display: grid;
  gap: 10px;
  margin: 12px 0;
}

.adm-tools input[type='search'] {
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid var(--adm-bd);
  background: var(--adm-card);
  color: var(--adm-tx);
  font-size: 16px;
}

.adm-chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.adm-chips::-webkit-scrollbar {
  display: none;
}

.adm-chip {
  flex: none;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--adm-bd);
  background: var(--adm-card);
  cursor: pointer;
  font-weight: 600;
}

.adm-chip[aria-pressed='true'] {
  background: var(--adm-ink);
  color: #fff;
  border-color: var(--adm-ink);
}

.adm-chip i {
  font-style: normal;
  opacity: 0.7;
  margin-left: 6px;
  font-size: 12px;
}

.adm-list {
  display: grid;
  gap: 10px;
}

.adm-o {
  background: var(--adm-card);
  border: 1px solid var(--adm-bd);
  border-radius: 18px;
  padding: 14px;
  box-shadow: var(--adm-sh);
}

.adm-o .h {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: flex-start;
}

.adm-o .n {
  font: 700 13px ui-monospace, monospace;
  letter-spacing: 0.02em;
}

.adm-o .m {
  color: var(--adm-mut);
  font-size: 13px;
}

.adm-o .it {
  font-size: 14px;
  margin: 8px 0;
  color: var(--adm-mut);
}

.adm-o .f {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.adm-o .tot {
  font: 700 17px Georgia, serif;
}

.adm-st {
  font: 700 12px system-ui;
  border-radius: 999px;
  padding: 4px 10px;
  white-space: nowrap;
}

.s-PENDING {
  background: var(--adm-warnb);
  color: var(--adm-warn);
}
.s-PAID {
  background: var(--adm-infob);
  color: var(--adm-info);
}
.s-PREPARING {
  background: var(--adm-goldbg);
  color: var(--adm-gold);
}
.s-SHIPPED {
  background: var(--adm-infob);
  color: var(--adm-info);
}
.s-DELIVERED {
  background: var(--adm-okb);
  color: var(--adm-ok);
}
.s-CANCELLED {
  background: var(--adm-badb);
  color: var(--adm-bad);
}

.adm-acts {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.adm-b {
  min-height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid var(--adm-bd);
  background: var(--adm-card);
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: var(--adm-tx);
}

.adm-b:active {
  transform: scale(0.97);
}

.adm-b.p {
  background: var(--adm-ink);
  color: #fff;
  border-color: var(--adm-ink);
}

.adm-b.d {
  color: var(--adm-bad);
  border-color: var(--adm-bad);
}

.adm-b.w {
  color: var(--adm-ok);
}

.adm-b svg,
.adm-nav svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.adm-empty {
  text-align: center;
  color: var(--adm-mut);
  padding: 28px 8px;
}

.adm-low {
  padding: 3px 9px;
  border-radius: 999px;
  font: 700 12px system-ui;
}

.adm-low.l0 {
  background: var(--adm-badb);
  color: var(--adm-bad);
}

.adm-low.l1 {
  background: var(--adm-warnb);
  color: var(--adm-warn);
}

.adm-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  background: var(--adm-ink);
  display: flex;
  padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 0px));
}

.adm-nav button {
  flex: 1;
  min-height: 54px;
  border: 0;
  background: transparent;
  color: #cdbfb1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font: 600 11px system-ui;
  cursor: pointer;
  position: relative;
  border-radius: 12px;
}

.adm-nav button[aria-current='page'] {
  color: #fff;
  background: #ffffff14;
}

.adm-nav .dot {
  position: absolute;
  top: 4px;
  left: calc(50% + 6px);
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: var(--adm-bad);
  color: #fff;
  font: 700 11px/18px system-ui;
  text-align: center;
  padding: 0 4px;
}

#adm-sheet {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: none;
}

#adm-sheet.on {
  display: block;
}

#adm-sheet .bg {
  position: absolute;
  inset: 0;
  background: #0009;
}

#adm-sheet .pn {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--adm-card);
  border-radius: 24px 24px 0 0;
  padding: 18px 16px calc(18px + env(safe-area-inset-bottom, 0px));
  max-height: 85vh;
  overflow: auto;
}

#adm-sheet h3 {
  font: 700 18px Georgia, serif;
  margin: 0 0 4px;
}

#adm-sheet .opts {
  display: grid;
  gap: 8px;
  margin-top: 14px;
}

.adm-warnbox {
  background: var(--adm-badb);
  color: var(--adm-bad);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  margin-top: 12px;
}

#adm-toast {
  position: fixed;
  left: 50%;
  bottom: calc(76px + env(safe-area-inset-bottom, 0px));
  transform: translate(-50%, 16px);
  background: var(--adm-tx);
  color: var(--adm-bg);
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  opacity: 0;
  pointer-events: none;
  transition: 0.25s;
  z-index: 60;
  max-width: 90vw;
}

#adm-toast.on {
  opacity: 1;
  transform: translate(-50%, 0);
}

/* ---------- Mise en page allégée ---------- */
.adm-sm {
  min-height: 36px;
  padding: 0 12px;
  font-size: 13px;
}

.adm-menu {
  position: relative;
}
.adm-menu summary {
  list-style: none;
  cursor: pointer;
}
.adm-menu summary::-webkit-details-marker {
  display: none;
}
.adm-menu-pn {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 210px;
  background: var(--adm-card);
  border: 1px solid var(--adm-bd);
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  padding: 6px;
  z-index: 30;
}
.adm-menu-pn button {
  display: block;
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  color: var(--adm-tx);
  cursor: pointer;
}
.adm-menu-pn button:hover {
  background: var(--adm-bg);
}
.adm-menu-pn button.d {
  color: #a63333;
}

.adm-k small {
  font: 600 12px system-ui, sans-serif;
  color: var(--adm-mut);
}
.adm-k em {
  display: block;
  margin-top: 2px;
  color: var(--adm-mut);
  font-weight: 600;
}
.adm-k-btn {
  text-align: left;
  cursor: pointer;
  font: inherit;
  color: inherit;
  width: 100%;
}
.adm-k-btn:hover {
  border-color: var(--adm-gold);
}

.adm-h-sub {
  font: 600 12px system-ui, sans-serif;
  color: var(--adm-mut);
  margin-left: 6px;
}

.adm-tools-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.adm-tools-row input[type='search'] {
  flex: 1;
  min-width: 0;
}

.adm-vchips {
  display: flex !important;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}
.adm-vchips i {
  font-style: normal;
  font-size: 11px;
  font-weight: 600;
  background: #fbf3e4;
  color: #7a5214;
  border-radius: 999px;
  padding: 1px 8px;
  white-space: nowrap;
}
.adm-vchips i.z {
  background: #fdecec;
  color: #a63333;
}
.adm-vchips i.more {
  background: var(--adm-bg);
  color: var(--adm-mut);
}

.adm-more {
  display: block;
  width: 100%;
  margin-top: 6px;
  padding: 10px;
  border: 0;
  background: transparent;
  color: var(--adm-gold);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.adm-prod {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.adm-thumb {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  flex: none;
  border: 1px solid var(--adm-bd);
  background: var(--adm-bg);
}
.adm-prod-body {
  flex: 1;
  min-width: 0;
}
.adm-prod-name {
  font-weight: 700;
  font-size: 15px;
  line-height: 1.3;
}
.adm-acts-sm {
  margin-top: 8px;
  align-items: center;
}
.adm-link-d {
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #a63333;
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  padding: 6px 2px;
}
.adm-txt-bad {
  color: #a63333;
  font-weight: 700;
}

@media (min-width: 900px) {
  .adm-root {
    padding-bottom: 0;
    padding-left: 220px;
  }
  .adm-nav {
    top: 0;
    bottom: auto;
    right: auto;
    width: 220px;
    height: 100vh;
    flex-direction: column;
    padding: 70px 12px 12px;
    gap: 4px;
  }
  .adm-nav button {
    flex: none;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    padding: 0 14px;
    min-height: 48px;
    font-size: 15px;
  }
  .adm-nav .dot {
    position: static;
    margin-left: auto;
  }
  .adm-top {
    padding-left: 24px;
  }
  .adm-kpis {
    grid-template-columns: repeat(4, 1fr);
  }
  .adm-k.wide {
    grid-column: auto;
  }
  .adm-two {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 14px;
  }
  .adm-list {
    grid-template-columns: 1fr 1fr;
  }
  #adm-sheet .pn {
    left: 50%;
    right: auto;
    bottom: auto;
    top: 50%;
    width: 440px;
    transform: translate(-50%, -50%);
    border-radius: 24px;
  }
  #adm-toast {
    bottom: 24px;
  }
}
</style>
