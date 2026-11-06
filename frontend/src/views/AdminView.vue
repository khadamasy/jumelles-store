<template>
  <!-- ============================================================== -->
  <!-- ÉCRAN DE CONNEXION DE LA GÉRANCE                                -->
  <!-- ============================================================== -->
  <div v-if="!authStore.isAdmin" class="lgn">
    <form class="lgn-card" @submit.prevent="handleAdminLogin">
      <div class="lgn-head">
        <span class="lgn-ic"><Lock aria-hidden="true" /></span>
        <h1>Espace Gérance</h1>
        <p>Accès réservé à la direction de Jumelles Store.</p>
      </div>

      <div v-if="!authStore.adminConfigured" class="note warning">
        <AlertTriangle aria-hidden="true" />
        <p>
          <strong>Accès gérance non configuré :</strong> définissez <code>ADMIN_PASSWORD</code> (12 caractères minimum)
          dans le fichier <code>backend/.env</code> puis redémarrez le serveur. Connectez-vous ensuite avec ce mot de
          passe : vous pourrez le remplacer depuis l'Espace Gérance.
        </p>
      </div>

      <div class="field">
        <label for="admin-email" class="label">Adresse email</label>
        <input
          id="admin-email"
          v-model="adminEmail"
          type="email"
          class="input"
          placeholder="votre-email@gmail.com"
          autocomplete="username"
          maxlength="160"
          required
        />
      </div>

      <div class="field">
        <label for="admin-password" class="label">Mot de passe</label>
        <div class="pw">
          <input
            id="admin-password"
            v-model="adminPassword"
            :type="showPassword ? 'text' : 'password'"
            class="input"
            placeholder="Votre mot de passe"
            autocomplete="current-password"
            maxlength="200"
            required
          />
          <button
            type="button"
            class="pw-t"
            :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
            :aria-pressed="showPassword"
            @click="showPassword = !showPassword"
          >
            <component :is="showPassword ? EyeOff : Eye" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Transition name="slide-down">
        <div v-if="loginError" role="alert" class="note danger">
          <AlertTriangle aria-hidden="true" />
          <p>{{ loginError }}</p>
        </div>
      </Transition>

      <button
        type="submit"
        class="btn dark lg block"
        :class="{ loading: authStore.isLoading }"
        :disabled="authStore.isLoading || !adminEmail || !adminPassword"
      >
        Se connecter
      </button>

      <router-link to="/" class="lgn-back">← Retour à la boutique</router-link>
    </form>
  </div>

  <!-- ============================================================== -->
  <!-- ADMINISTRATION CONNECTÉE AUX VRAIES DONNÉES                     -->
  <!-- ============================================================== -->
  <div v-else class="adm">
    <!-- Barre latérale (ordinateur) / onglets du bas (téléphone) -->
    <nav class="adm-nav" aria-label="Sections">
      <div class="adm-brand">
        <span class="adm-logo">Jumelles</span>
        <span class="adm-tag">Gérance</span>
      </div>

      <div class="adm-links">
        <button
          v-for="item in navItems"
          :key="item.view"
          type="button"
          class="adm-link"
          :aria-current="activeView === item.view ? 'page' : undefined"
          @click="switchView(item.view)"
        >
          <component :is="item.icon" aria-hidden="true" />
          <span class="adm-link-l">{{ item.label }}</span>
          <span v-if="item.count > 0" class="adm-count tnum" :aria-label="item.countLabel">{{ item.count }}</span>
        </button>
      </div>

      <div class="adm-side-ft">
        <router-link to="/" class="adm-link">
          <ExternalLink aria-hidden="true" />
          <span class="adm-link-l">Voir la boutique</span>
        </router-link>
      </div>
    </nav>

    <div class="adm-body">
      <!-- En-tête -->
      <header class="adm-top">
        <div class="adm-top-t">
          <span class="adm-top-brand">Jumelles · Gérance</span>
          <Transition name="fade" mode="out-in">
            <h1 :key="activeView">{{ viewTitles[activeView] }}</h1>
          </Transition>
        </div>

        <div class="adm-top-a">
          <button
            v-if="activeView === 'v-dash' || activeView === 'v-ord'"
            type="button"
            class="btn line sm"
            :disabled="isRefreshing"
            title="Actualiser les données"
            @click="refreshData"
          >
            <RefreshCw :class="{ spin: isRefreshing }" aria-hidden="true" />
            <span class="hide-sm">{{ isRefreshing ? 'Actualisation…' : 'Actualiser' }}</span>
          </button>
          <button
            v-if="activeView === 'v-stk'"
            type="button"
            class="btn dark sm"
            aria-label="Nouvel article"
            @click="isCreateModalOpen = true"
          >
            <Plus aria-hidden="true" />
            <span class="hide-sm">Nouvel article</span>
          </button>

          <!-- Compte : identifiants + déconnexion -->
          <details ref="accountMenuRef" class="acc-menu">
            <summary class="acc-btn" aria-label="Mon compte">
              <span class="acc-av" aria-hidden="true">{{ (authStore.user?.email || 'G').charAt(0).toUpperCase() }}</span>
              <ChevronDown class="hide-sm" aria-hidden="true" />
            </summary>
            <div class="acc-pn">
              <p class="acc-mail">{{ authStore.user?.email || 'Gérance' }}</p>
              <button type="button" @click="closeAccountMenu(); openCredentialsModal()">
                <KeyRound aria-hidden="true" />Email & mot de passe
              </button>
              <router-link to="/" @click="closeAccountMenu()"><ExternalLink aria-hidden="true" />Voir la boutique</router-link>
              <button type="button" class="d" @click="closeAccountMenu(); authStore.logout()">
                <LogOut aria-hidden="true" />Se déconnecter
              </button>
            </div>
          </details>
        </div>
      </header>

      <main class="adm-main">
        <Transition name="view" mode="out-in">
          <!-- ===================== 1. TABLEAU DE BORD ===================== -->
          <section v-if="activeView === 'v-dash'" key="dash" aria-label="Tableau de bord">
            <div class="seg" role="group" aria-label="Période">
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

            <!-- 4 indicateurs -->
            <div class="kpis stagger">
              <div class="kpi">
                <span class="kpi-h"><TrendingUp aria-hidden="true" />Chiffre d’affaires</span>
                <b v-if="hasLoaded" class="tnum">{{ formatMoney(periodRevenue) }}</b>
                <span v-else class="skel kpi-sk"></span>
                <em>
                  Panier moyen :
                  {{ periodPaidOrders.length ? formatMoney(Math.round(periodRevenue / periodPaidOrders.length)) : '–' }}
                </em>
              </div>
              <div class="kpi">
                <span class="kpi-h"><Receipt aria-hidden="true" />Commandes</span>
                <b v-if="hasLoaded" class="tnum">{{ periodOrders.length }}</b>
                <span v-else class="skel kpi-sk"></span>
                <em>{{ periodPaidOrders.length }} payée(s) ou en cours</em>
              </div>
              <button type="button" class="kpi kpi-btn" :class="{ warn: pendingOrdersCount > 0 }" @click="openOrdersFilter('PENDING')">
                <span class="kpi-h"><Clock aria-hidden="true" />En attente</span>
                <b class="tnum">{{ pendingOrdersCount }}</b>
                <em>Voir les commandes <ArrowRight aria-hidden="true" /></em>
              </button>
              <button
                type="button"
                class="kpi kpi-btn"
                :class="{ bad: lowStockProducts.length > 0 }"
                @click="switchView('v-stk')"
              >
                <span class="kpi-h"><PackageX aria-hidden="true" />Stock bas</span>
                <b class="tnum">{{ lowStockProducts.length }} <small>article(s)</small></b>
                <em>{{ criticalStockItems.length }} taille(s) / coloris <ArrowRight aria-hidden="true" /></em>
              </button>
            </div>

            <div class="two">
              <div class="panel">
                <h2 class="panel-t">Chiffre d’affaires par jour</h2>
                <AdminRevenueChart :bars="chartBars" />
              </div>

              <div class="panel">
                <h2 class="panel-t">Meilleures ventes</h2>
                <ol v-if="topProducts.length > 0" class="top">
                  <li v-for="(tp, idx) in topProducts" :key="tp.name">
                    <span class="top-rk tnum">{{ idx + 1 }}</span>
                    <div class="top-g">
                      <b>{{ tp.name }}</b>
                      <span class="top-bar"><i :style="{ width: `${tp.pct}%` }"></i></span>
                    </div>
                    <b class="tnum">{{ tp.qty }}</b>
                  </li>
                </ol>
                <p v-else class="panel-empty">Aucune vente enregistrée sur cette période.</p>
              </div>
            </div>

            <div class="sec-h">
              <h2>À traiter maintenant</h2>
              <span v-if="todoOrders.length" class="pill warning tnum">{{ todoOrders.length }}</span>
            </div>
            <TransitionGroup v-if="todoOrders.length > 0" tag="div" name="list" class="cards">
              <AdminOrderCard v-for="o in todoOrders" :key="o.id" :order="o" @change-status="openStatusSheet" />
            </TransitionGroup>
            <UiEmpty v-else compact title="Tout est à jour" text="Aucune commande en attente à traiter pour le moment.">
              <template #icon><CheckCircle2 /></template>
            </UiEmpty>
          </section>

          <!-- ===================== 2. COMMANDES ===================== -->
          <section v-else-if="activeView === 'v-ord'" key="ord" aria-label="Commandes">
            <div class="tools">
              <div class="srch">
                <Search aria-hidden="true" />
                <input
                  v-model="orderQuery"
                  type="search"
                  class="input"
                  placeholder="Rechercher : n°, nom ou téléphone"
                  aria-label="Rechercher une commande"
                />
              </div>
              <div class="chips" role="group" aria-label="Filtrer par statut">
                <button
                  v-for="st in statusFilters"
                  :key="st.key"
                  type="button"
                  class="chip"
                  :aria-pressed="orderStatusFilter === st.key"
                  @click="orderStatusFilter = st.key"
                >
                  {{ st.label }}<i class="tnum">{{ st.count }}</i>
                </button>
              </div>
            </div>

            <TransitionGroup v-if="filteredOrders.length > 0" tag="div" name="list" class="cards">
              <AdminOrderCard
                v-for="o in filteredOrders"
                :key="o.id"
                :order="o"
                show-phone
                @change-status="openStatusSheet"
              />
            </TransitionGroup>
            <UiEmpty
              v-else
              compact
              :title="orderStatusFilter === 'TODO' ? 'Tout est à jour' : 'Aucun résultat'"
              :text="orderStatusFilter === 'TODO' ? 'Aucune commande à traiter.' : 'Aucune commande ne correspond à ce filtre.'"
            >
              <template #icon><Inbox /></template>
            </UiEmpty>
          </section>

          <!-- ===================== 3. STOCK & CATALOGUE ===================== -->
          <section v-else-if="activeView === 'v-stk'" key="stk" aria-label="Stock et catalogue">
            <div class="tools">
              <div class="srch">
                <Search aria-hidden="true" />
                <input
                  v-model="productQuery"
                  type="search"
                  class="input"
                  placeholder="Rechercher un article"
                  aria-label="Rechercher un article"
                />
              </div>
            </div>

            <!-- Stock bas : une ligne par article, détail dans « Réassortir » -->
            <div class="sec-h">
              <h2>Stock bas</h2>
              <span class="sec-sub">4 pièces ou moins</span>
            </div>
            <div class="panel flush">
              <template v-if="lowStockProducts.length > 0">
                <div v-for="g in visibleLowStock" :key="g.product.id" class="low">
                  <div class="low-g">
                    <b>{{ g.product.name }}</b>
                    <span class="vchips">
                      <i
                        v-for="v in g.variants.slice(0, 6)"
                        :key="v.variantId"
                        :class="{ z: v.stock === 0 }"
                        :title="`${v.variantLabel} : ${v.stock}`"
                      >{{ v.short }} · {{ v.stock }}</i>
                      <i v-if="g.variants.length > 6" class="more">+{{ g.variants.length - 6 }}</i>
                    </span>
                  </div>
                  <span v-if="g.outCount > 0" class="pill danger">{{ g.outCount }} en rupture</span>
                  <button type="button" class="btn line sm" @click="openManageStockModal(g.product)">Réassortir</button>
                </div>
                <button
                  v-if="lowStockProducts.length > LOW_STOCK_PREVIEW"
                  type="button"
                  class="more-btn"
                  @click="showAllLowStock = !showAllLowStock"
                >
                  {{ showAllLowStock ? 'Afficher moins' : `Voir les ${lowStockProducts.length - LOW_STOCK_PREVIEW} autres articles` }}
                </button>
              </template>
              <p v-else class="panel-empty">Aucun article en stock bas : toutes les tailles ont plus de 4 pièces.</p>
            </div>

            <div class="sec-h">
              <h2>Catalogue</h2>
              <span class="sec-sub tnum">{{ filteredProducts.length }} article(s)</span>
            </div>
            <div v-if="filteredProducts.length > 0" class="cards">
              <article v-for="p in filteredProducts" :key="p.id" class="prod">
                <img loading="lazy" decoding="async" :src="getProductThumbnail(p)" :alt="p.name" class="prod-img" />
                <div class="prod-b">
                  <b class="prod-n">{{ p.name }}</b>
                  <p class="prod-m">
                    <span class="tnum">{{ formatMoney(p.basePrice) }}</span>
                    <span class="pill plain" :class="getTotalStock(p) === 0 ? 'danger' : getTotalStock(p) <= 4 ? 'warning' : ''">
                      {{ getTotalStock(p) }} en stock
                    </span>
                  </p>
                  <p class="prod-v">{{ p.variants?.length || 0 }} taille(s) / coloris</p>
                  <div class="prod-a">
                    <button type="button" class="btn line sm" @click="openManageStockModal(p)">
                      <Boxes aria-hidden="true" />Stock
                    </button>
                    <button type="button" class="btn ghost sm" @click="openEditProductModal(p)">
                      <Pencil aria-hidden="true" />Modifier
                    </button>
                    <button
                      type="button"
                      class="ib prod-del"
                      :aria-label="`Supprimer ${p.name}`"
                      title="Supprimer"
                      @click="askDeleteProduct(p)"
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            </div>
            <UiEmpty v-else compact title="Aucun article" :text="`Aucun article ne correspond à « ${productQuery} ».`">
              <template #icon><Search /></template>
            </UiEmpty>
          </section>

          <!-- ===================== 4. RAPPELS ===================== -->
          <section v-else key="cb" aria-label="Rappels">
            <div class="sec-h first">
              <h2>Demandes de rappel téléphonique</h2>
              <span class="pill plain tnum">{{ phoneCallbacks.length }}</span>
            </div>
            <div v-if="phoneCallbacks.length > 0" class="cards">
              <article v-for="cb in phoneCallbacks" :key="cb.id" class="cbk" :class="{ done: cb.status === 'CALLED' }">
                <header class="cbk-h">
                  <div>
                    <b>{{ cb.customerName || 'Cliente' }}</b>
                    <span class="tnum">{{ cb.customerPhone }}</span>
                  </div>
                  <span class="pill" :class="cb.status === 'CALLED' ? '' : 'warning'">
                    {{ cb.status === 'CALLED' ? 'Traitée' : 'À rappeler' }}
                  </span>
                </header>
                <p class="cbk-i">{{ cb.productInterest || 'Demande de rappel' }}</p>
                <footer class="cbk-f">
                  <span class="cbk-ago">{{ formatAgo(cb.createdAt) }}</span>
                  <div class="cbk-a">
                    <button
                      v-if="cb.status !== 'CALLED'"
                      type="button"
                      class="btn ghost sm"
                      @click="handleCallStatus(cb.id, 'CALLED')"
                    >
                      Marquer traitée
                    </button>
                    <a class="btn dark sm" :href="`tel:${cleanDigits(cb.customerPhone)}`">
                      <Phone aria-hidden="true" />Rappeler
                    </a>
                  </div>
                </footer>
              </article>
            </div>
            <UiEmpty v-else compact title="Aucune demande" text="Aucune demande de rappel téléphonique enregistrée.">
              <template #icon><PhoneCall /></template>
            </UiEmpty>
          </section>
        </Transition>
      </main>
    </div>

    <!-- ============ FENÊTRE DE CHANGEMENT DE STATUT ============ -->
    <UiModal
      :open="!!sheetOrder"
      variant="sheet"
      size="sm"
      :title="confirmingCancel ? 'Annuler cette commande ?' : 'Changer le statut'"
      @close="closeStatusSheet"
    >
      <template v-if="sheetOrder && !confirmingCancel">
        <div class="sh-ctx">
          <span class="oc-num">{{ sheetOrder.orderNumber }}</span>
          <span>{{ sheetOrder.customerName }}</span>
          <span class="sh-cur">
            Actuel :
            <span class="pill" :class="statusTones[sheetOrder.status]">
              {{ statusLabels[sheetOrder.status] || sheetOrder.status }}
            </span>
          </span>
        </div>
        <div class="sh-opts">
          <button
            v-for="nextSt in allowedNext(sheetOrder.status)"
            :key="nextSt"
            type="button"
            class="btn block"
            :class="nextSt === 'CANCELLED' ? 'danger' : 'dark lg'"
            @click="selectNextStatus(nextSt)"
          >
            {{ nextStatusText[nextSt] }}
          </button>
          <button type="button" class="btn ghost block" @click="closeStatusSheet">Fermer</button>
        </div>
      </template>

      <template v-else-if="sheetOrder && confirmingCancel">
        <div class="note warning">
          <AlertTriangle aria-hidden="true" />
          <p>
            Les articles de cette commande seront remis en stock automatiquement. L’action est définitive : une commande
            annulée ne peut plus être rouverte.
          </p>
        </div>
        <div class="sh-opts">
          <button type="button" class="btn danger block lg" @click="applyStatusChange(sheetOrder.id, 'CANCELLED')">
            Oui, annuler la commande
          </button>
          <button type="button" class="btn ghost block" @click="confirmingCancel = false">Non, revenir</button>
        </div>
      </template>
    </UiModal>

    <!-- ============ IDENTIFIANTS ============ -->
    <UiModal
      :open="showCredentialsModal"
      size="sm"
      title="Identifiants administrateur"
      subtitle="Adresse email et mot de passe demandés pour accéder à l’Espace Gérance."
      @close="showCredentialsModal = false"
    >
      <form id="cred-form" class="frm" @submit.prevent="handleUpdateCredentials">
        <div class="field">
          <label class="label" for="cred-email">Nouvelle adresse email</label>
          <input
            id="cred-email"
            v-model="credForm.email"
            type="email"
            class="input"
            required
            placeholder="votre-email@gmail.com"
          />
        </div>
        <div class="field">
          <label class="label" for="cred-cur">Mot de passe actuel</label>
          <input
            id="cred-cur"
            v-model="credForm.currentPassword"
            type="password"
            class="input"
            required
            autocomplete="current-password"
            placeholder="Votre mot de passe actuel"
          />
        </div>
        <div class="field">
          <label class="label" for="cred-new">Nouveau mot de passe</label>
          <input
            id="cred-new"
            v-model="credForm.password"
            type="password"
            class="input"
            required
            minlength="12"
            autocomplete="new-password"
            placeholder="Choisissez votre mot de passe"
            aria-describedby="cred-new-h"
          />
          <p id="cred-new-h" class="hint">12 caractères minimum.</p>
        </div>
      </form>
      <template #footer>
        <div class="ft-acts">
          <button type="button" class="btn ghost" @click="showCredentialsModal = false">Annuler</button>
          <button
            type="submit"
            form="cred-form"
            class="btn dark"
            :class="{ loading: authStore.isLoading }"
            :disabled="authStore.isLoading"
          >
            Enregistrer
          </button>
        </div>
      </template>
    </UiModal>

    <!-- ============ STOCK D'UN ARTICLE ============ -->
    <UiModal
      :open="!!manageStockModal"
      variant="sheet"
      size="lg"
      :title="manageStockModal ? `Stock : ${manageStockModal.name}` : 'Stock'"
      subtitle="Ajustez chaque taille / coloris ou ajoutez-en un nouveau."
      @close="manageStockModal = null"
    >
      <template v-if="manageStockModal">
        <ul class="stk">
          <li v-for="v in manageStockModal.variants" :key="v.id">
            <div>
              <b>{{ v.color }} · {{ v.sizeOrShoeSize }}</b>
              <span class="pill plain tnum" :class="v.stockQuantity === 0 ? 'danger' : v.stockQuantity <= 4 ? 'warning' : ''">
                {{ v.stockQuantity }} en stock
              </span>
            </div>
            <div class="stk-a">
              <button type="button" class="btn line sm tnum" @click="handleQuickAdjustStock(manageStockModal, v, -1)">−1</button>
              <button type="button" class="btn dark sm tnum" @click="handleQuickAdjustStock(manageStockModal, v, 5)">+5</button>
            </div>
          </li>
        </ul>

        <form class="stk-new" @submit.prevent="handleAddVariant">
          <h3>Ajouter une taille ou un coloris</h3>
          <div class="stk-new-f">
            <div class="field">
              <label class="label" for="nv-color">Couleur</label>
              <input id="nv-color" v-model="newVariantData.color" class="input" placeholder="Noir" required />
            </div>
            <div class="field">
              <label class="label" for="nv-size">Taille / pointure</label>
              <input id="nv-size" v-model="newVariantData.sizeOrShoeSize" class="input" placeholder="39" required />
            </div>
            <div class="field">
              <label class="label" for="nv-stock">Stock</label>
              <input
                id="nv-stock"
                v-model.number="newVariantData.stockQuantity"
                type="number"
                min="0"
                inputmode="numeric"
                class="input tnum"
                required
              />
            </div>
          </div>
          <button type="submit" class="btn dark block"><Plus aria-hidden="true" />Ajouter</button>
        </form>
      </template>
    </UiModal>

    <!-- ============ MODIFIER UN ARTICLE ============ -->
    <UiModal :open="!!editProductModal" title="Modifier l’article" @close="editProductModal = null">
      <form id="edit-form" class="frm" @submit.prevent="handleSaveProductEdit">
        <div class="field">
          <label class="label" for="ed-name">Nom de l’article</label>
          <input id="ed-name" v-model="editForm.name" class="input" required />
        </div>
        <div class="field">
          <label class="label" for="ed-price">Prix (FCFA)</label>
          <input
            id="ed-price"
            v-model.number="editForm.basePrice"
            type="number"
            min="500"
            inputmode="numeric"
            class="input tnum"
            required
          />
        </div>
        <div class="field">
          <label class="label" for="ed-desc">Description</label>
          <textarea id="ed-desc" v-model="editForm.description" rows="4" class="textarea"></textarea>
        </div>
      </form>
      <template #footer>
        <div class="ft-acts">
          <button type="button" class="btn ghost" @click="editProductModal = null">Annuler</button>
          <button type="submit" form="edit-form" class="btn dark" :class="{ loading: isSavingEdit }" :disabled="isSavingEdit">
            Enregistrer
          </button>
        </div>
      </template>
    </UiModal>

    <!-- ============ NOUVEL ARTICLE ============ -->
    <UiModal :open="isCreateModalOpen" title="Nouvel article" @close="isCreateModalOpen = false">
      <form id="create-form" class="frm" @submit.prevent="handleCreateProduct">
        <div class="field">
          <label class="label" for="np-name">Nom de l’article</label>
          <input id="np-name" v-model="newProduct.name" class="input" required placeholder="Sac cabas cuir…" />
        </div>
        <div class="frm-2">
          <div class="field">
            <label class="label" for="np-cat">Catégorie</label>
            <select id="np-cat" v-model="newProduct.categoryId" class="select">
              <option value="cat-sac-1">Sacs à main</option>
              <option value="cat-sac-2">Pochettes</option>
              <option value="cat-shoe-1">Escarpins & mules</option>
              <option value="cat-shoe-2">Sandales</option>
            </select>
          </div>
          <div class="field">
            <label class="label" for="np-price">Prix (FCFA)</label>
            <input
              id="np-price"
              v-model.number="newProduct.basePrice"
              type="number"
              min="500"
              inputmode="numeric"
              class="input tnum"
              required
            />
          </div>
        </div>
        <div class="field">
          <span class="label">Photo de l’article</span>
          <label class="drop" :class="{ ok: !!uploadedImageUrl }">
            <input type="file" accept="image/*" class="sr-only" @change="handleFileUpload" />
            <img v-if="uploadedImageUrl" :src="uploadedImageUrl" alt="" />
            <span v-else class="drop-ic"><ImagePlus aria-hidden="true" /></span>
            <span class="drop-t">
              <b>{{ uploadedImageUrl ? 'Photo téléversée' : 'Choisir une photo' }}</b>
              <span>{{ uploadedImageUrl ? 'Touchez pour la remplacer' : 'JPG ou PNG, format portrait conseillé' }}</span>
            </span>
          </label>
        </div>
        <div class="field">
          <label class="label" for="np-desc">Description <span class="opt-tag">(facultatif)</span></label>
          <textarea id="np-desc" v-model="newProduct.description" rows="3" class="textarea"></textarea>
        </div>
      </form>
      <template #footer>
        <div class="ft-acts">
          <button type="button" class="btn ghost" @click="isCreateModalOpen = false">Annuler</button>
          <button type="submit" form="create-form" class="btn dark" :class="{ loading: isCreating }" :disabled="isCreating">
            Créer l’article
          </button>
        </div>
      </template>
    </UiModal>

    <!-- ============ CONFIRMER LA SUPPRESSION ============ -->
    <UiModal :open="!!deleteTarget" size="sm" title="Supprimer cet article ?" @close="deleteTarget = null">
      <p class="del-p">
        <strong>{{ deleteTarget?.name }}</strong> sera supprimé définitivement du catalogue.
      </p>
      <template #footer>
        <div class="ft-acts">
          <button type="button" class="btn ghost" @click="deleteTarget = null">Annuler</button>
          <button
            type="button"
            class="btn danger"
            :class="{ loading: isDeleting }"
            :disabled="isDeleting"
            @click="deleteTarget && handleDeleteProduct(deleteTarget.id)"
          >
            <Trash2 aria-hidden="true" />Supprimer
          </button>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import {
  Lock,
  AlertTriangle,
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  PhoneCall,
  RefreshCw,
  Plus,
  Search,
  ExternalLink,
  KeyRound,
  LogOut,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Receipt,
  Clock,
  PackageX,
  Eye,
  EyeOff,
  Phone,
  ImagePlus,
  Trash2,
  Pencil,
  Inbox,
  CheckCircle2,
} from 'lucide-vue-next';
import UiModal from '../components/ui/UiModal.vue';
import UiEmpty from '../components/ui/UiEmpty.vue';
import AdminOrderCard from '../components/admin/AdminOrderCard.vue';
import AdminRevenueChart from '../components/admin/AdminRevenueChart.vue';
import { useToastStore } from '../stores/toast';
import {
  statusLabels,
  statusTones,
  nextStatusText,
  revenueStatuses,
  daysAgo,
  formatAgo,
  formatMoney,
  cleanDigits,
  allowedNext,
} from '../utils/adminOrders';
import { ProductService, OrderService, PhoneService, UploadService } from '../services/api';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const toastStore = useToastStore();

const viewTitles: Record<string, string> = {
  'v-dash': 'Tableau de bord',
  'v-ord': 'Commandes',
  'v-stk': 'Stock et catalogue',
  'v-cb': 'Demandes de rappel',
};

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

// Onglets (barre latérale sur ordinateur, barre du bas sur téléphone)
type AdminView = 'v-dash' | 'v-ord' | 'v-stk' | 'v-cb';
const navItems = computed<Array<{ view: AdminView; label: string; icon: any; count: number; countLabel: string }>>(() => [
  { view: 'v-dash', label: 'Tableau', icon: LayoutDashboard, count: 0, countLabel: '' },
  {
    view: 'v-ord',
    label: 'Commandes',
    icon: ShoppingBag,
    count: pendingOrdersCount.value,
    countLabel: `${pendingOrdersCount.value} à traiter`,
  },
  {
    view: 'v-stk',
    label: 'Stock',
    icon: Boxes,
    count: lowStockProducts.value.length,
    countLabel: `${lowStockProducts.value.length} article(s) en stock bas`,
  },
  {
    view: 'v-cb',
    label: 'Rappels',
    icon: PhoneCall,
    count: pendingCallbacksCount.value,
    countLabel: `${pendingCallbacksCount.value} à rappeler`,
  },
]);

// Messages : système commun (UiToaster)
const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastStore.show(msg, type === 'error' ? 'danger' : 'success');
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
const hasLoaded = ref(false);
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
  } finally {
    hasLoaded.value = true;
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

/** Article à supprimer : la fenêtre de confirmation remplace la boîte confirm() du navigateur */
const deleteTarget = ref<any | null>(null);
const isDeleting = ref(false);
const askDeleteProduct = (product: any) => {
  deleteTarget.value = product;
};

const handleDeleteProduct = async (id: string) => {
  isDeleting.value = true;
  try {
    await ProductService.delete(id);
    await loadData();
    showToast('Article supprimé.');
  } catch (err) {
    handleAdminError(err, 'Erreur suppression.');
  } finally {
    isDeleting.value = false;
    deleteTarget.value = null;
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

onMounted(async () => {
  await authStore.checkAdminStatus();
  if (!authStore.sessionChecked) {
    await authStore.checkSession();
  }
  if (authStore.isAdmin) {
    await loadData();
  }
});

</script>
<style scoped>
/* ================= CONNEXION ================= */
.lgn {
  min-height: 80vh;
  display: grid;
  place-items: center;
  padding: var(--s-10) var(--gutter);
}
.lgn-card {
  width: 100%;
  max-width: 400px;
  display: grid;
  gap: var(--s-4);
  padding: var(--s-8) var(--s-6);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--sh-3);
  animation: rise-in var(--dur-4) var(--ease-out) both;
}
.lgn-head {
  text-align: center;
  margin-bottom: var(--s-2);
}
.lgn-ic {
  display: inline-grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: var(--r-lg);
  background: var(--ink);
  color: var(--accent-on-ink);
  box-shadow: var(--sh-2);
}
.lgn-ic svg {
  width: 24px;
  height: 24px;
}
.lgn-head h1 {
  margin: var(--s-4) 0 var(--s-1);
  font-size: var(--fs-2xl);
}
.lgn-head p {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
.lgn code {
  font-family: var(--font-mono);
  font-size: 0.92em;
}
.lgn-back {
  justify-self: center;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
.lgn-back:hover {
  color: var(--text);
}
.pw {
  position: relative;
}
.pw .input {
  padding-right: 52px;
}
.pw-t {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}
.pw-t:hover {
  background: var(--bg-sunken);
  color: var(--text);
}
.pw-t svg {
  width: 18px;
  height: 18px;
}

/* ================= STRUCTURE ================= */
.adm {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg);
  /* L'espace sous la barre du bas est déjà réservé par le body (style.css) */
}

/* ----- Navigation : barre du bas sur téléphone ----- */
.adm-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-header);
  padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 0px));
  background: rgb(var(--c-sand-0) / 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid var(--border);
}
.adm-brand,
.adm-side-ft {
  display: none;
}
.adm-links {
  display: flex;
  gap: 2px;
}
.adm-link {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-height: 56px;
  border: 0;
  border-radius: var(--r-md);
  background: transparent;
  color: var(--text-faint);
  font: 600 11px/1 var(--font-sans);
  cursor: pointer;
  transition: color var(--dur-2), background-color var(--dur-2);
}
.adm-link > svg {
  width: 22px;
  height: 22px;
  stroke-width: 1.7;
  transition: transform var(--dur-2) var(--ease-spring);
}
.adm-link[aria-current='page'] {
  color: var(--text);
}
.adm-link[aria-current='page'] > svg {
  transform: translateY(-1px) scale(1.08);
  color: var(--accent-text);
}
.adm-count {
  position: absolute;
  top: 6px;
  left: calc(50% + 6px);
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--danger);
  color: #fff;
  font: 700 10px/18px var(--font-sans);
  text-align: center;
  box-shadow: 0 0 0 2px var(--surface);
}

/* ----- En-tête ----- */
.adm-top {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: var(--s-3);
  min-height: 64px;
  padding: var(--s-2) var(--gutter);
  background: rgb(var(--c-sand-50) / 0.9);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
}
.adm-top-t {
  flex: 1;
  min-width: 0;
}
.adm-top-brand {
  display: block;
  font: 700 10px/1.2 var(--font-sans);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--accent-text);
}
.adm-top h1 {
  margin: 2px 0 0;
  font-size: var(--fs-lg);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.adm-top-a {
  display: flex;
  align-items: center;
  gap: var(--s-2);
}
.hide-sm {
  display: none;
}
.spin {
  animation: spin 0.8s linear infinite;
}

/* Menu du compte */
.acc-menu {
  position: relative;
}
.acc-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px;
  border-radius: var(--r-full);
  cursor: pointer;
  list-style: none;
  color: var(--text-muted);
}
.acc-btn::-webkit-details-marker {
  display: none;
}
.acc-btn:hover {
  background: var(--bg-sunken);
}
.acc-btn svg {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}
.acc-av {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--accent-on-ink);
  font: 600 var(--fs-sm) var(--font-display);
}
.acc-pn {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 5;
  min-width: 240px;
  padding: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--sh-3);
  animation: menu-pop var(--dur-2) var(--ease-out);
  transform-origin: top right;
}
.acc-mail {
  margin: 0;
  padding: 8px 10px 10px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
  font-size: var(--fs-xs);
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.acc-pn button,
.acc-pn a {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  width: 100%;
  min-height: 40px;
  padding: 0 10px;
  border: 0;
  border-radius: var(--r-sm);
  background: none;
  color: var(--text);
  font: 500 var(--fs-sm) var(--font-sans);
  text-align: left;
  cursor: pointer;
}
.acc-pn button:hover,
.acc-pn a:hover {
  background: var(--bg-sunken);
}
.acc-pn svg {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}
.acc-pn .d,
.acc-pn .d svg {
  color: var(--danger);
}

.adm-main {
  padding: var(--s-5) var(--gutter) var(--s-10);
}

/* Passage d'un onglet à l'autre */
.view-enter-active {
  transition: opacity var(--dur-3) var(--ease-out), transform var(--dur-3) var(--ease-out);
}
.view-leave-active {
  transition: opacity var(--dur-1) var(--ease-out);
}
.view-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.view-leave-to {
  opacity: 0;
}

/* ================= ÉLÉMENTS COMMUNS ================= */
.seg {
  display: inline-flex;
  max-width: 100%;
  overflow-x: auto;
  padding: 3px;
  border-radius: var(--r-md);
  background: var(--bg-sunken);
  border: 1px solid var(--border);
  scrollbar-width: none;
}
.seg button {
  flex: none;
  min-height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--text-muted);
  font: 600 var(--fs-sm) var(--font-sans);
  cursor: pointer;
  transition: background-color var(--dur-2), color var(--dur-2), box-shadow var(--dur-2);
}
.seg button[aria-pressed='true'] {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--sh-1);
}

.sec-h {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  margin: var(--s-8) 0 var(--s-3);
}
.sec-h.first {
  margin-top: 0;
}
.sec-h h2 {
  margin: 0;
  font-size: var(--fs-lg);
}
.sec-sub {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.panel {
  padding: var(--s-5);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-1);
}
.panel.flush {
  padding: 0;
  overflow: hidden;
}
.panel-t {
  margin: 0 0 var(--s-4);
  font: 700 var(--fs-2xs) / 1 var(--font-sans);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--text-muted);
}
.panel-empty {
  margin: 0;
  padding: var(--s-6) var(--s-4);
  text-align: center;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.cards {
  position: relative;
  display: grid;
  gap: var(--s-3);
}

.tools {
  display: grid;
  gap: var(--s-3);
  margin-bottom: var(--s-5);
}
.srch {
  position: relative;
}
.srch > svg {
  position: absolute;
  left: 14px;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  color: var(--text-faint);
  pointer-events: none;
}
.srch .input {
  padding-left: 42px;
}
.chips {
  display: flex;
  gap: var(--s-2);
  overflow-x: auto;
  margin: 0 calc(-1 * var(--gutter));
  padding: 2px var(--gutter);
  scrollbar-width: none;
}
.chips::-webkit-scrollbar {
  display: none;
}
.chip {
  min-height: 38px;
  font-size: var(--fs-xs);
}
.chip i {
  font-style: normal;
  min-width: 20px;
  padding: 2px 6px;
  border-radius: 10px;
  background: var(--bg-sunken);
  color: var(--text-muted);
  font-size: 11px;
}
.chip[aria-pressed='true'] i {
  background: rgb(255 255 255 / 0.16);
  color: var(--on-ink);
}

/* ================= TABLEAU DE BORD ================= */
.kpis {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-3);
  margin-top: var(--s-5);
}
.kpi {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  padding: var(--s-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-1);
  text-align: left;
  font: inherit;
  color: inherit;
}
.kpi-h {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--text-muted);
}
.kpi-h svg {
  width: 15px;
  height: 15px;
}
.kpi b {
  font-family: var(--font-display);
  font-size: clamp(20px, 5.5vw, 28px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.01em;
}
.kpi b small {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  font-weight: 500;
  color: var(--text-muted);
}
.kpi em {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-style: normal;
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.kpi em svg {
  width: 13px;
  height: 13px;
  transition: transform var(--dur-2) var(--ease-out);
}
.kpi-sk {
  height: 30px;
  width: 75%;
}
.kpi-btn {
  cursor: pointer;
  transition: border-color var(--dur-2), box-shadow var(--dur-3) var(--ease-out), transform var(--dur-1);
}
.kpi-btn:hover {
  border-color: var(--border-strong);
  box-shadow: var(--sh-2);
}
.kpi-btn:hover em svg {
  transform: translateX(3px);
}
.kpi-btn:active {
  transform: scale(0.98);
}
.kpi.warn {
  background: var(--warning-soft);
  border-color: rgb(var(--c-warning-200));
}
.kpi.warn .kpi-h,
.kpi.warn b {
  color: var(--warning);
}
.kpi.bad {
  background: var(--danger-soft);
  border-color: rgb(var(--c-danger-200));
}
.kpi.bad .kpi-h,
.kpi.bad b {
  color: var(--danger);
}

.two {
  display: grid;
  gap: var(--s-3);
  margin-top: var(--s-3);
}
.top {
  display: grid;
  gap: var(--s-4);
  list-style: none;
  margin: 0;
  padding: 0;
}
.top li {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  font-size: var(--fs-sm);
}
.top-rk {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: 50%;
  background: var(--bg-sunken);
  font-size: var(--fs-xs);
  font-weight: 700;
  color: var(--text-muted);
}
.top li:first-child .top-rk {
  background: var(--accent);
  color: var(--ink);
}
.top-g {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 6px;
}
.top-g b {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.top-bar {
  display: block;
  height: 6px;
  border-radius: 3px;
  background: var(--bg-sunken);
  overflow: hidden;
}
.top-bar i {
  display: block;
  height: 100%;
  border-radius: 3px;
  background: var(--accent);
  transform-origin: left;
  animation: bar-x 0.7s var(--ease-out) both;
}

/* ================= COMMANDES ================= */
.oc-num {
  font-family: var(--font-mono);
  font-weight: 700;
}

/* ================= STOCK ================= */
.low {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s-2) var(--s-3);
  padding: var(--s-4);
  border-bottom: 1px solid var(--border);
}
.low:last-of-type {
  border-bottom: 0;
}
.low-g {
  flex: 1 1 220px;
  min-width: 0;
  display: grid;
  gap: 6px;
}
.low-g b {
  font-size: var(--fs-sm);
  font-weight: 600;
}
.vchips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.vchips i {
  font-style: normal;
  padding: 3px 8px;
  border-radius: var(--r-xs);
  background: var(--warning-soft);
  color: var(--warning);
  font-size: 11px;
  font-weight: 600;
}
.vchips i.z {
  background: var(--danger-soft);
  color: var(--danger);
}
.vchips i.more {
  background: var(--bg-sunken);
  color: var(--text-muted);
}
.more-btn {
  display: block;
  width: 100%;
  min-height: 48px;
  border: 0;
  border-top: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  font: 600 var(--fs-sm) var(--font-sans);
  cursor: pointer;
}
.more-btn:hover {
  background: var(--bg-sunken);
}

.prod {
  display: flex;
  gap: var(--s-3);
  padding: var(--s-3);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-1);
  transition: box-shadow var(--dur-3) var(--ease-out);
}
.prod:hover {
  box-shadow: var(--sh-2);
}
.prod-img {
  width: 84px;
  height: 105px;
  flex: none;
  object-fit: cover;
  border-radius: var(--r-md);
  background: var(--bg-sunken);
}
.prod-b {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.prod-n {
  font-size: var(--fs-sm);
  font-weight: 600;
  line-height: var(--lh-snug);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.prod-m {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px var(--s-2);
  margin: 0;
  font-size: var(--fs-sm);
  font-weight: 600;
}
.prod-v {
  margin: 0;
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
.prod-a {
  display: flex;
  align-items: center;
  gap: var(--s-1);
  margin-top: auto;
  padding-top: var(--s-2);
}
.prod-a .btn svg {
  width: 15px;
  height: 15px;
}
.prod-del {
  margin-left: auto;
  width: 38px;
  height: 38px;
  color: var(--text-faint);
}
.prod-del:hover {
  color: var(--danger);
  background: var(--danger-soft);
}
.prod-del :deep(svg),
.prod-del svg {
  width: 17px;
  height: 17px;
}

/* ================= RAPPELS ================= */
.cbk {
  display: grid;
  gap: var(--s-3);
  padding: var(--s-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-1);
}
.cbk.done {
  opacity: 0.7;
}
.cbk-h {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--s-2);
}
.cbk-h b {
  display: block;
  font-weight: 600;
}
.cbk-h span.tnum {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
.cbk-i {
  margin: 0;
  padding: var(--s-2) var(--s-3);
  border-radius: var(--r-sm);
  background: var(--bg-sunken);
  font-size: var(--fs-sm);
  white-space: pre-line;
  word-break: break-word;
}
.cbk-f {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-2);
}
.cbk-ago {
  font-size: var(--fs-xs);
  color: var(--text-faint);
}
.cbk-a {
  display: flex;
  gap: var(--s-1);
}

/* ================= FENÊTRES ================= */
.sh-ctx {
  display: grid;
  gap: 4px;
  margin-bottom: var(--s-5);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
.sh-ctx .oc-num {
  color: var(--text);
}
.sh-cur {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  margin-top: 4px;
}
.sh-opts {
  display: grid;
  gap: var(--s-2);
  margin-top: var(--s-4);
}
.frm {
  display: grid;
  gap: var(--s-4);
}
.frm-2 {
  display: grid;
  gap: var(--s-4);
}
.ft-acts {
  display: flex;
  justify-content: flex-end;
  gap: var(--s-2);
}
.del-p {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
.del-p strong {
  color: var(--text);
}

.stk {
  display: grid;
  gap: var(--s-2);
  list-style: none;
  margin: 0;
  padding: 0;
}
.stk li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
  padding: var(--s-3);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
}
.stk li > div:first-child {
  display: grid;
  gap: 6px;
  justify-items: start;
}
.stk li b {
  font-size: var(--fs-sm);
  font-weight: 600;
}
.stk-a {
  display: flex;
  gap: var(--s-1);
}
.stk-a .btn {
  min-width: 52px;
}
.stk-new {
  display: grid;
  gap: var(--s-3);
  margin-top: var(--s-6);
  padding-top: var(--s-5);
  border-top: 1px solid var(--border);
}
.stk-new h3 {
  margin: 0;
  font: 700 var(--fs-2xs) / 1 var(--font-sans);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  color: var(--text-muted);
}
.stk-new-f {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--s-3);
}
.stk-new-f .field:last-child {
  grid-column: 1 / -1;
}

.drop {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  padding: var(--s-3);
  border: 1.5px dashed var(--border-strong);
  border-radius: var(--r-md);
  background: var(--surface-2);
  cursor: pointer;
  transition: border-color var(--dur-2), background-color var(--dur-2);
}
.drop:hover,
.drop:focus-within {
  border-color: var(--accent);
  background: var(--accent-soft);
}
.drop.ok {
  border-style: solid;
  border-color: rgb(var(--c-success-200));
  background: var(--success-soft);
}
.drop img {
  width: 52px;
  height: 64px;
  object-fit: cover;
  border-radius: var(--r-sm);
}
.drop-ic {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--accent-text);
}
.drop-ic svg {
  width: 22px;
  height: 22px;
}
.drop-t {
  display: grid;
  gap: 2px;
  font-size: var(--fs-sm);
}
.drop-t span {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

@keyframes bar-x {
  from {
    transform: scaleX(0);
  }
}
@keyframes menu-pop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
  }
}

/* ================= TABLETTE ================= */
@media (min-width: 720px) {
  .hide-sm {
    display: inline;
  }
  .kpis {
    grid-template-columns: repeat(4, 1fr);
  }
  .tools {
    grid-template-columns: minmax(240px, 360px) 1fr;
    align-items: center;
  }
  .chips {
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
  }
  .cards {
    grid-template-columns: 1fr 1fr;
  }
  .frm-2 {
    grid-template-columns: 1fr 1fr;
  }
  .stk-new-f {
    grid-template-columns: 1fr 1fr 110px;
  }
  .stk-new-f .field:last-child {
    grid-column: auto;
  }
}

/* ================= ORDINATEUR : barre latérale ================= */
@media (min-width: 1024px) {
  .adm {
    padding-bottom: 0;
    padding-left: 248px;
  }
  .adm-nav {
    top: 0;
    right: auto;
    width: 248px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: var(--s-5) var(--s-3);
    background: var(--surface-2);
    border-top: 0;
    border-right: 1px solid var(--border);
    backdrop-filter: none;
  }
  .adm-brand {
    display: flex;
    align-items: baseline;
    gap: var(--s-2);
    padding: 0 var(--s-3) var(--s-6);
  }
  .adm-logo {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .adm-tag {
    padding: 2px 8px;
    border-radius: var(--r-full);
    background: var(--accent-soft);
    color: var(--accent-text);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .adm-links {
    flex-direction: column;
  }
  .adm-link {
    flex: none;
    flex-direction: row;
    justify-content: flex-start;
    gap: var(--s-3);
    min-height: 42px;
    padding: 0 var(--s-3);
    color: var(--text-muted);
    font-size: var(--fs-sm);
  }
  .adm-link > svg {
    width: 18px;
    height: 18px;
  }
  .adm-link:hover {
    background: rgb(var(--c-sand-900) / 0.05);
    color: var(--text);
  }
  .adm-link[aria-current='page'] {
    background: var(--surface);
    color: var(--text);
    box-shadow: var(--sh-1), inset 0 0 0 1px var(--border);
  }
  .adm-link[aria-current='page'] > svg {
    transform: none;
  }
  .adm-count {
    position: static;
    margin-left: auto;
    box-shadow: none;
  }
  .adm-side-ft {
    display: block;
    margin-top: auto;
    padding-top: var(--s-3);
    border-top: 1px solid var(--border);
  }
  .adm-top {
    padding: var(--s-2) var(--s-8);
  }
  .adm-top-brand {
    display: none;
  }
  .adm-top h1 {
    font-size: var(--fs-xl);
  }
  .adm-main {
    padding: var(--s-6) var(--s-8) var(--s-12);
  }
  .two {
    grid-template-columns: 1.5fr 1fr;
  }
}

@media (min-width: 1280px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
