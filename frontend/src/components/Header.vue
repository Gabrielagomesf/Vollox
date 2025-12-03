<template>
  <header class="header">
    <div class="header-promo">
      <div class="container">
        <div class="promo-content">
          <span class="promo-icon">🎉</span>
          <span class="promo-text">Frete Grátis em compras acima de R$ 200 | Parcelamento em até 12x sem juros</span>
        </div>
      </div>
    </div>
    
    <div class="header-main">
      <div class="container">
        <div class="header-content">
          <router-link to="/" class="logo">
            <div class="logo-wrapper">
              <div class="logo-icon-wrapper">
                <span class="logo-icon">🛍️</span>
              </div>
              <div class="logo-text-wrapper">
                <span class="logo-text">Vollox</span>
                <span class="logo-tagline">Sua loja favorita</span>
              </div>
            </div>
          </router-link>
          
          <nav class="main-nav">
            <router-link to="/" class="nav-link" active-class="active">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">Início</span>
            </router-link>
            <div class="nav-separator"></div>
            <div class="nav-dropdown" @mouseenter="showCategories = true" @mouseleave="showCategories = false">
              <a href="#" class="nav-link" @click.prevent>
                <span class="nav-icon">📂</span>
                <span class="nav-text">Categorias</span>
                <span class="dropdown-arrow">▼</span>
              </a>
              <div v-if="showCategories && categories.length > 0" class="dropdown-menu">
                <div class="dropdown-header">
                  <span class="dropdown-title">Navegar por Categoria</span>
                </div>
                <div class="dropdown-content">
                  <router-link 
                    v-for="category in categories" 
                    :key="category._id"
                    :to="{ path: '/products', query: { category: category.name } }"
                    class="dropdown-item"
                    @click="showCategories = false"
                  >
                    <div class="dropdown-item-icon">{{ category.icon }}</div>
                    <div class="dropdown-item-content">
                      <span class="dropdown-item-name">{{ category.name }}</span>
                      <span class="dropdown-item-desc">Ver produtos</span>
                    </div>
                    <span class="dropdown-item-arrow">→</span>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="nav-separator"></div>
            <router-link to="/products" class="nav-link" active-class="active">
              <span class="nav-icon">🛒</span>
              <span class="nav-text">Produtos</span>
            </router-link>
            <div class="nav-separator"></div>
            <router-link to="/products" class="nav-link" active-class="active">
              <span class="nav-icon">⭐</span>
              <span class="nav-text">Ofertas</span>
              <span class="nav-badge">Novo</span>
            </router-link>
          </nav>

          <div class="header-right">
            <div class="search-container">
              <div class="search-bar">
                <span class="search-icon-left">🔍</span>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  @keyup.enter="search"
                  placeholder="Buscar produtos, marcas..."
                  class="search-input"
                />
                <button @click="search" class="search-btn" aria-label="Buscar">
                  Buscar
                </button>
              </div>
            </div>

            <div class="header-actions">
              <router-link v-if="!isAuthenticated" to="/login" class="auth-link">
                <span class="action-icon">👤</span>
                <div class="action-content">
                  <span class="action-label">Entrar</span>
                  <span class="action-subtitle">Minha conta</span>
                </div>
              </router-link>
              
              <div v-if="isAuthenticated" class="user-menu-wrapper" @mouseenter="showUserMenu = true" @mouseleave="showUserMenu = false">
                <div class="user-menu-trigger">
                  <div class="user-avatar">
                    <span>{{ userName.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ userName }}</span>
                    <span class="user-status">Online</span>
                  </div>
                  <span class="dropdown-arrow">▼</span>
                </div>
                <div v-if="showUserMenu" class="user-dropdown-menu">
                  <div class="user-dropdown-header">
                    <div class="user-avatar-large">
                      <span>{{ userName.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="user-dropdown-info">
                      <div class="user-name-large">{{ userName }}</div>
                      <div class="user-email">{{ userEmail }}</div>
                    </div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <div class="dropdown-section">
                    <div class="dropdown-section-title">Minha Conta</div>
                    <router-link to="/profile" class="dropdown-item">
                      <span class="dropdown-item-icon">👤</span>
                      <span>Meu Perfil</span>
                    </router-link>
                    <a href="#" class="dropdown-item">
                      <span class="dropdown-item-icon">📦</span>
                      <span>Meus Pedidos</span>
                    </a>
                    <a href="#" class="dropdown-item">
                      <span class="dropdown-item-icon">❤️</span>
                      <span>Favoritos</span>
                    </a>
                  </div>
                  <div class="dropdown-divider"></div>
                  <button @click="handleLogout" class="dropdown-item logout-item">
                    <span class="dropdown-item-icon">🚪</span>
                    <span>Sair da conta</span>
                  </button>
                </div>
              </div>
              
              <router-link to="/cart" class="cart-link" aria-label="Carrinho">
                <div class="cart-wrapper">
                  <span class="cart-icon">🛒</span>
                  <div class="cart-info">
                    <span class="cart-label">Carrinho</span>
                    <span class="cart-count-text" v-if="cartCount > 0">{{ cartCount }} item{{ cartCount > 1 ? 's' : '' }}</span>
                  </div>
                  <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
                </div>
              </router-link>
            </div>

            <button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="Menu">
              <span class="menu-icon">☰</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showMobileMenu" class="mobile-menu-overlay" @click="toggleMobileMenu">
      <div class="mobile-menu" @click.stop>
        <div class="mobile-menu-header">
          <button class="mobile-close-btn" @click="toggleMobileMenu" aria-label="Fechar">
            <span>✕</span>
          </button>
          <div class="mobile-user-section" v-if="isAuthenticated">
          <div class="mobile-user-avatar">
            <span>{{ userName.charAt(0).toUpperCase() }}</span>
          </div>
          <div>
            <div class="mobile-user-name">{{ userName }}</div>
            <div class="mobile-user-email">{{ userEmail }}</div>
          </div>
        </div>
        <div v-else class="mobile-auth-section">
          <router-link to="/login" class="mobile-auth-btn" @click="toggleMobileMenu">
            <span>👤</span>
            <span>Entrar / Cadastrar</span>
          </router-link>
        </div>
      </div>
      
      <div class="mobile-menu-content">
        <router-link to="/" class="mobile-nav-link" @click="toggleMobileMenu">
          <span class="mobile-nav-icon">🏠</span>
          <span>Início</span>
        </router-link>
        
        <div class="mobile-categories">
          <div class="mobile-category-header" @click="toggleMobileCategories">
            <span class="mobile-nav-icon">📂</span>
            <span>Categorias</span>
            <span class="mobile-arrow">{{ showMobileCategories ? '▲' : '▼' }}</span>
          </div>
          <div v-if="showMobileCategories" class="mobile-category-list">
            <router-link 
              v-for="category in categories" 
              :key="category._id"
              :to="{ path: '/products', query: { category: category.name } }"
              class="mobile-category-item"
              @click="toggleMobileMenu"
            >
              <span class="mobile-category-icon">{{ category.icon }}</span>
              <span>{{ category.name }}</span>
            </router-link>
          </div>
        </div>
        
        <router-link to="/products" class="mobile-nav-link" @click="toggleMobileMenu">
          <span class="mobile-nav-icon">🛒</span>
          <span>Produtos</span>
        </router-link>
        
        <router-link to="/products" class="mobile-nav-link" @click="toggleMobileMenu">
          <span class="mobile-nav-icon">⭐</span>
          <span>Ofertas</span>
          <span class="mobile-badge">Novo</span>
        </router-link>
        
        <div class="mobile-divider"></div>
        
        <router-link to="/cart" class="mobile-cart-link" @click="toggleMobileMenu">
          <span class="mobile-nav-icon">🛒</span>
          <div class="mobile-cart-info">
            <span>Carrinho</span>
            <span v-if="cartCount > 0" class="mobile-cart-count">{{ cartCount }} item{{ cartCount > 1 ? 's' : '' }}</span>
          </div>
          <span v-if="cartCount > 0" class="mobile-cart-badge">{{ cartCount }}</span>
        </router-link>
        
        <div v-if="isAuthenticated" class="mobile-divider"></div>
        
        <div v-if="isAuthenticated" class="mobile-menu-actions">
          <router-link to="/profile" class="mobile-action-item" @click="toggleMobileMenu">
            <span class="mobile-nav-icon">👤</span>
            <span>Meu Perfil</span>
          </router-link>
          <a href="#" class="mobile-action-item">
            <span class="mobile-nav-icon">📦</span>
            <span>Meus Pedidos</span>
          </a>
          <a href="#" class="mobile-action-item">
            <span class="mobile-nav-icon">❤️</span>
            <span>Favoritos</span>
          </a>
          <button @click="handleLogout" class="mobile-logout-btn">
            <span class="mobile-nav-icon">🚪</span>
            <span>Sair da conta</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { cartService, categoryService } from '../services/api'
import { authService } from '../services/auth'
import { getSessionId } from '../utils/storage'
import { useToast } from '../composables/useToast'

export default {
  name: 'Header',
  setup() {
    const router = useRouter()
    const { showToast } = useToast()
    const searchQuery = ref('')
    const cartCount = ref(0)
    const showMobileMenu = ref(false)
    const showMobileCategories = ref(false)
    const showCategories = ref(false)
    const showUserMenu = ref(false)
    const categories = ref([])

    const isAuthenticated = computed(() => authService.isAuthenticated())
    const user = computed(() => authService.getCurrentUser())
    const userName = computed(() => {
      return user.value ? user.value.name.split(' ')[0] : ''
    })
    const userEmail = computed(() => {
      return user.value ? user.value.email : ''
    })

    const loadCartCount = async () => {
      try {
        const sessionId = getSessionId()
        const response = await cartService.get(sessionId)
        cartCount.value = response.data.reduce((sum, item) => sum + item.quantity, 0)
      } catch (error) {
        cartCount.value = 0
      }
    }

    const loadCategories = async () => {
      try {
        const response = await categoryService.getAll()
        categories.value = response.data || []
      } catch (error) {
        categories.value = []
      }
    }

    const search = () => {
      if (searchQuery.value.trim()) {
        router.push({ path: '/products', query: { search: searchQuery.value } })
        searchQuery.value = ''
        showMobileMenu.value = false
      }
    }

    const handleLogout = () => {
      authService.logout()
      showToast('Logout realizado com sucesso', 'success')
      router.push('/')
      showMobileMenu.value = false
      showUserMenu.value = false
    }

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
      if (!showMobileMenu.value) {
        showMobileCategories.value = false
      }
    }

    const toggleMobileCategories = () => {
      showMobileCategories.value = !showMobileCategories.value
    }

    onMounted(() => {
      loadCartCount()
      loadCategories()
      const interval = setInterval(loadCartCount, 3000)
      onUnmounted(() => clearInterval(interval))
    })

    return {
      searchQuery,
      cartCount,
      categories,
      isAuthenticated,
      userName,
      userEmail,
      showMobileMenu,
      showMobileCategories,
      showCategories,
      showUserMenu,
      search,
      handleLogout,
      toggleMobileMenu,
      toggleMobileCategories
    }
  }
}
</script>

<style scoped>
.header {
  background: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-promo {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  padding: 8px 0;
  font-size: 13px;
  text-align: center;
}

.promo-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.promo-icon {
  font-size: 16px;
}

.promo-text {
  font-weight: 500;
  letter-spacing: 0.3px;
}

.header-main {
  background: linear-gradient(to bottom, #ffffff 0%, #f8faff 100%);
  border-bottom: 1px solid #e0f2fe;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 16px 0;
  min-height: 80px;
}

.logo {
  text-decoration: none;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.logo-icon {
  font-size: 28px;
  line-height: 1;
}

.logo-text-wrapper {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.logo-tagline {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
  padding: 0 24px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  text-decoration: none;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
}

.nav-link:hover {
  color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  transform: translateY(-1px);
}

.nav-link.active {
  color: #1e40af;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  font-weight: 700;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 3px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 2px;
}

.nav-icon {
  font-size: 18px;
}

.nav-text {
  font-size: 14px;
}

.nav-badge {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 4px;
}

.nav-separator {
  width: 1px;
  height: 24px;
  background: #e0f2fe;
  margin: 0 4px;
}

.nav-dropdown {
  position: relative;
}

.dropdown-arrow {
  font-size: 10px;
  margin-left: 4px;
  transition: transform 0.3s ease;
  color: #94a3b8;
}

.nav-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
  color: #3b82f6;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid #e0f2fe;
  min-width: 280px;
  overflow: hidden;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.dropdown-header {
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-bottom: 1px solid #e0f2fe;
}

.dropdown-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e40af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-content {
  padding: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1e40af;
  transform: translateX(4px);
}

.dropdown-item-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 18px;
  flex-shrink: 0;
}

.dropdown-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-item-name {
  font-weight: 600;
  color: #1e293b;
}

.dropdown-item-desc {
  font-size: 12px;
  color: #94a3b8;
}

.dropdown-item-arrow {
  color: #cbd5e0;
  font-size: 16px;
  transition: all 0.2s ease;
}

.dropdown-item:hover .dropdown-item-arrow {
  color: #3b82f6;
  transform: translateX(4px);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.search-container {
  min-width: 320px;
  max-width: 400px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e0f2fe;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.search-bar:focus-within {
  border-color: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.1), 0 4px 12px rgba(59, 130, 246, 0.15);
}

.search-icon-left {
  padding: 0 12px;
  color: #94a3b8;
  font-size: 18px;
}

.search-input {
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #1e293b;
  outline: none;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-btn {
  padding: 12px 20px;
  border: none;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-btn:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transform: scale(1.02);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-separator {
  width: 1px;
  height: 32px;
  background: #e0f2fe;
}

.auth-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: white;
}

.auth-link:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  transform: translateY(-1px);
}

.action-icon {
  font-size: 20px;
}

.action-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.action-label {
  font-size: 13px;
  font-weight: 700;
  color: #1e40af;
}

.action-subtitle {
  font-size: 11px;
  color: #94a3b8;
}

.user-menu-wrapper {
  position: relative;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-menu-trigger:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.user-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  border-radius: 50%;
  color: white;
  font-weight: 700;
  font-size: 14px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e40af;
  white-space: nowrap;
}

.user-status {
  font-size: 11px;
  color: #10b981;
  font-weight: 500;
}

.user-dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid #e0f2fe;
  min-width: 280px;
  overflow: hidden;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

.user-dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-bottom: 1px solid #e0f2fe;
}

.user-avatar-large {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  border-radius: 50%;
  color: white;
  font-weight: 700;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.user-dropdown-info {
  flex: 1;
}

.user-name-large {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.user-email {
  font-size: 13px;
  color: #64748b;
}

.dropdown-divider {
  height: 1px;
  background: #e0f2fe;
  margin: 8px 0;
}

.dropdown-section {
  padding: 8px;
}

.dropdown-section-title {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 12px;
}

.logout-item {
  width: 100%;
  color: #ef4444;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
}

.logout-item:hover {
  background: #fef2f2;
  color: #dc2626;
}

.cart-link {
  position: relative;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 10px;
  background: white;
  transition: all 0.3s ease;
}

.cart-link:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.cart-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-icon {
  font-size: 22px;
}

.cart-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cart-label {
  font-size: 13px;
  font-weight: 700;
  color: #1e40af;
}

.cart-count-text {
  font-size: 11px;
  color: #94a3b8;
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  padding: 0 6px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
  border: 2px solid white;
}

.mobile-menu-btn {
  display: none;
  width: 44px;
  height: 44px;
  border: none;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  cursor: pointer;
  font-size: 24px;
  color: #3b82f6;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.mobile-menu-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.mobile-menu {
  display: none;
  width: 100%;
  max-width: 400px;
  background: white;
  max-height: 100vh;
  overflow-y: auto;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.mobile-menu-header {
  padding: 20px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-bottom: 1px solid #e0f2fe;
  position: relative;
}

.mobile-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 50%;
  color: #64748b;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-close-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
  transform: rotate(90deg);
}

.mobile-user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-user-avatar {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  border-radius: 50%;
  color: white;
  font-weight: 700;
  font-size: 24px;
}

.mobile-user-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.mobile-user-email {
  font-size: 13px;
  color: #64748b;
}

.mobile-auth-section {
  width: 100%;
}

.mobile-auth-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: white;
  border: 2px solid #60a5fa;
  border-radius: 12px;
  text-decoration: none;
  color: #3b82f6;
  font-weight: 700;
  font-size: 15px;
  transition: all 0.3s ease;
}

.mobile-auth-btn:hover {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
}

.mobile-menu-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-nav-link {
  padding: 14px 16px;
  background: #f8f9fa;
  border-radius: 10px;
  text-decoration: none;
  color: #475569;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.mobile-nav-link:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #3b82f6;
}

.mobile-nav-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.mobile-badge {
  margin-left: auto;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: uppercase;
}

.mobile-categories {
  background: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
}

.mobile-category-header {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-category-header:hover {
  background: #eff6ff;
  color: #3b82f6;
}

.mobile-arrow {
  margin-left: auto;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.mobile-category-list {
  padding: 8px;
  background: white;
  border-top: 1px solid #e0f2fe;
}

.mobile-category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-category-item:hover {
  background: #eff6ff;
  color: #3b82f6;
}

.mobile-category-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.mobile-divider {
  height: 1px;
  background: #e0f2fe;
  margin: 8px 0;
}

.mobile-cart-link {
  padding: 14px 16px;
  background: #f8f9fa;
  border-radius: 10px;
  text-decoration: none;
  color: #475569;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.mobile-cart-link:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #3b82f6;
}

.mobile-cart-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-cart-count {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 400;
}

.mobile-cart-badge {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.mobile-menu-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-action-item {
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 10px;
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.mobile-action-item:hover {
  background: #eff6ff;
  color: #3b82f6;
}

.mobile-logout-btn {
  width: 100%;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #ef4444;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.mobile-logout-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

@media (max-width: 1200px) {
  .main-nav {
    gap: 2px;
    padding: 0 16px;
  }
  
  .nav-link {
    padding: 10px 14px;
    font-size: 13px;
  }
  
  .search-container {
    min-width: 280px;
  }
}

@media (max-width: 968px) {
  .header-content {
    gap: 12px;
    flex-wrap: nowrap;
    align-items: center;
  }

  .main-nav {
    display: none;
  }

  .logo {
    flex-shrink: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: flex-end;
  }

  .search-container {
    display: none;
  }

  .header-actions {
    gap: 6px;
    flex-shrink: 0;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  .header-promo {
    font-size: 9px;
    padding: 5px 0;
  }

  .promo-content {
    gap: 6px;
    padding: 0 8px;
  }

  .promo-text {
    font-size: 9px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  .promo-icon {
    font-size: 12px;
    flex-shrink: 0;
  }

  .header-main {
    padding: 0;
  }

  .header-content {
    padding: 10px 16px;
    min-height: 60px;
    gap: 10px;
  }

  .logo-wrapper {
    gap: 6px;
  }

  .logo-icon-wrapper {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  .logo-icon {
    font-size: 18px;
  }

  .logo-text {
    font-size: 16px;
  }

  .logo-tagline {
    font-size: 8px;
    display: none;
  }

  .header-right {
    gap: 6px;
    flex-wrap: nowrap;
    min-width: 0;
  }

  .search-container {
    display: none;
  }

  .header-actions {
    gap: 4px;
    flex-shrink: 0;
  }

  .action-separator {
    display: none;
  }

  .auth-link {
    padding: 6px 10px;
    min-width: auto;
  }

  .auth-link .action-content {
    display: none;
  }

  .action-icon {
    font-size: 16px;
    margin: 0;
  }

  .user-menu-wrapper {
    display: none;
  }

  .cart-link {
    padding: 6px 10px;
    min-width: auto;
  }

  .cart-link .cart-info {
    display: none;
  }

  .cart-icon {
    font-size: 18px;
  }

  .cart-badge {
    min-width: 16px;
    height: 16px;
    font-size: 9px;
    top: -2px;
    right: -2px;
    padding: 0 4px;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: 18px;
    flex-shrink: 0;
  }

  .mobile-menu-overlay {
    display: block;
  }

  .mobile-menu {
    display: block;
    max-width: 85%;
  }
}

@media (max-width: 640px) {
  .header-promo {
    font-size: 8px;
    padding: 4px 0;
  }

  .promo-content {
    gap: 4px;
    padding: 0 8px;
  }

  .promo-text {
    font-size: 8px;
  }

  .promo-icon {
    font-size: 10px;
  }

  .header-content {
    gap: 6px;
    padding: 8px 12px;
    min-height: 56px;
  }

  .logo-wrapper {
    gap: 4px;
  }

  .logo-icon-wrapper {
    width: 28px;
    height: 28px;
  }

  .logo-icon {
    font-size: 16px;
  }

  .logo-text {
    font-size: 14px;
  }

  .header-right {
    gap: 4px;
  }

  .auth-link {
    padding: 5px 8px;
  }

  .action-icon {
    font-size: 14px;
  }

  .cart-link {
    padding: 5px 8px;
  }

  .cart-icon {
    font-size: 16px;
  }

  .cart-badge {
    min-width: 14px;
    height: 14px;
    font-size: 8px;
    top: -1px;
    right: -1px;
    padding: 0 3px;
  }

  .mobile-menu-btn {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }

  .mobile-menu {
    max-width: 90%;
  }

  .mobile-menu-header {
    padding: 16px;
  }

  .mobile-menu-header::after {
    top: 16px;
    right: 16px;
    width: 28px;
    height: 28px;
    font-size: 16px;
  }

  .mobile-user-avatar {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }

  .mobile-user-name {
    font-size: 14px;
  }

  .mobile-user-email {
    font-size: 11px;
  }

  .mobile-auth-btn {
    padding: 12px 14px;
    font-size: 13px;
  }

  .mobile-menu-content {
    padding: 12px;
    gap: 6px;
  }

  .mobile-nav-link,
  .mobile-cart-link,
  .mobile-action-item {
    padding: 12px 14px;
    font-size: 14px;
  }

  .mobile-nav-icon {
    font-size: 18px;
    width: 20px;
  }

  .mobile-category-header {
    padding: 12px 14px;
    font-size: 14px;
  }

  .mobile-category-item {
    padding: 10px 14px;
    font-size: 13px;
  }

  .mobile-category-icon {
    font-size: 18px;
    width: 20px;
  }

  .mobile-logout-btn {
    padding: 12px 14px;
    font-size: 13px;
  }
}
</style>
