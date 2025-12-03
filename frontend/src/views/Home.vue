<template>
  <div class="home">
    <section class="hero">
      <div class="hero-background">
        <div class="hero-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Bem-vindo ao Vollox</h1>
          <p class="hero-subtitle">Descubra produtos incríveis com os melhores preços do mercado</p>
          <div class="hero-buttons">
            <router-link to="/products" class="btn btn-primary btn-hero">Explorar Produtos</router-link>
            <router-link to="/products" class="btn btn-secondary btn-hero">Ver Ofertas</router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚚</div>
            <h3>Frete Grátis</h3>
            <p>Em compras acima de R$ 200</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Compra Segura</h3>
            <p>Seus dados protegidos</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">↩️</div>
            <h3>Devolução Fácil</h3>
            <p>Até 30 dias após a compra</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💳</div>
            <h3>Parcelamento</h3>
            <p>Em até 12x sem juros</p>
          </div>
        </div>
      </div>
    </section>

    <section class="categories">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Nossas Categorias</h2>
          <p class="section-subtitle">Explore por categoria e encontre exatamente o que procura</p>
        </div>
        <div v-if="loadingCategories" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Carregando categorias...</p>
        </div>
        <div v-else-if="categories.length > 0" class="categories-grid">
          <div 
            v-for="category in categories" 
            :key="category._id"
            class="category-card"
            @click="filterByCategory(category.name)"
          >
            <div class="category-icon-wrapper">
              <span class="category-icon">{{ category.icon }}</span>
            </div>
            <h3 class="category-name">{{ category.name }}</h3>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>Nenhuma categoria encontrada. Popule o banco de dados primeiro.</p>
        </div>
      </div>
    </section>

    <section class="featured-products">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Produtos em Destaque</h2>
          <p class="section-subtitle">Seleção especial dos nossos melhores produtos</p>
        </div>
        <div v-if="loadingProducts" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Carregando produtos...</p>
        </div>
        <div v-else-if="products.length > 0" class="products-grid">
          <ProductCard 
            v-for="product in products.slice(0, 8)" 
            :key="product._id"
            :product="product"
          />
        </div>
        <div v-else class="empty-state">
          <p>Nenhum produto encontrado. Popule o banco de dados primeiro.</p>
        </div>
        <div class="view-all">
          <router-link to="/products" class="btn btn-outline">Ver Todos os Produtos</router-link>
        </div>
      </div>
    </section>

    <section v-if="isAuthenticated && !isSupplier" class="become-supplier-banner">
      <div class="supplier-banner">
        <div class="banner-content">
          <div class="banner-left">
            <div class="supplier-icon-wrapper">
              <div class="supplier-icon-badge">24</div>
              <div class="supplier-cta-icon">🏪</div>
            </div>
            <div class="banner-text">
              <div class="banner-header">
                <h2 class="banner-title">Torne-se um Fornecedor</h2>
                <p class="banner-subtitle">Venda seus produtos na Vollox e alcance milhares de clientes!</p>
              </div>
              <div class="banner-benefits">
                <div class="banner-benefit">
                  <div class="benefit-icon-wrapper">
                    <span class="benefit-icon">📦</span>
                  </div>
                  <span class="benefit-text">Cadastre e gerencie seus produtos</span>
                </div>
                <div class="banner-benefit">
                  <div class="benefit-icon-wrapper">
                    <span class="benefit-icon">📈</span>
                  </div>
                  <span class="benefit-text">Aumente sua visibilidade</span>
                </div>
                <div class="banner-benefit">
                  <div class="benefit-icon-wrapper">
                    <span class="benefit-icon">💰</span>
                  </div>
                  <span class="benefit-text">Receba pagamentos de forma segura</span>
                </div>
                <div class="banner-benefit">
                  <div class="benefit-icon-wrapper">
                    <span class="benefit-icon">📊</span>
                  </div>
                  <span class="benefit-text">Acompanhe suas vendas em tempo real</span>
                </div>
              </div>
            </div>
          </div>
          <div class="banner-right">
            <router-link to="/profile?tab=supplier" class="btn btn-supplier-banner">
              <span class="btn-icon">🚀</span>
              <span class="btn-text">Quero ser Fornecedor</span>
            </router-link>
          </div>
        </div>
        <div class="banner-visual">
          <div class="visual-shape shape-1"></div>
          <div class="visual-shape shape-2"></div>
          <div class="visual-shape shape-3"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categoryService, productService } from '../services/api'
import { authService } from '../services/auth'
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'Home',
  components: {
    ProductCard
  },
  setup() {
    const router = useRouter()
    const categories = ref([])
    const products = ref([])
    const loadingCategories = ref(true)
    const loadingProducts = ref(true)
    const isSupplier = ref(false)

    const isAuthenticated = computed(() => authService.isAuthenticated())

    const checkSupplierStatus = () => {
      const user = authService.getCurrentUser()
      if (user) {
        const storedSupplier = localStorage.getItem('supplier')
        if (storedSupplier) {
          const supplier = JSON.parse(storedSupplier)
          const userId = user?._id || user?.id || ''
          if (supplier.userId === userId) {
            isSupplier.value = true
            return true
          }
        }
      }
      isSupplier.value = false
      return false
    }

    const loadCategories = async () => {
      loadingCategories.value = true
      try {
        const response = await categoryService.getAll()
        if (response && response.data) {
          categories.value = response.data
        } else {
          categories.value = []
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
        categories.value = []
      } finally {
        loadingCategories.value = false
      }
    }

    const loadProducts = async () => {
      loadingProducts.value = true
      try {
        const response = await productService.getAll()
        if (response && response.data) {
          products.value = response.data
        } else {
          products.value = []
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        products.value = []
      } finally {
        loadingProducts.value = false
      }
    }

    const filterByCategory = (categoryName) => {
      router.push({ path: '/products', query: { category: categoryName } })
    }

    onMounted(() => {
      loadCategories()
      loadProducts()
      checkSupplierStatus()
    })

    return {
      categories,
      products,
      loadingCategories,
      loadingProducts,
      filterByCategory,
      isAuthenticated,
      isSupplier
    }
  }
}
</script>

<style scoped>
.home {
  background: white;
  width: 100%;
  overflow-x: hidden;
}

.hero {
  position: relative;
  padding: 100px 0 80px;
  background: white;
  overflow: hidden;
  min-height: 550px;
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .hero {
    padding: 60px 0 40px;
    min-height: 400px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 40px 0 30px;
    min-height: 350px;
  }
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: #93c5fd;
  top: -100px;
  right: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: #60a5fa;
  bottom: -50px;
  left: 15%;
  animation-delay: 5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  background: #bfdbfe;
  top: 50%;
  right: 20%;
  animation-delay: 10s;
}

@media (max-width: 768px) {
  .shape-1,
  .shape-2,
  .shape-3 {
    opacity: 0.05;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  33% {
    transform: translateY(-30px) translateX(30px);
  }
  66% {
    transform: translateY(30px) translateX(-30px);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 20px;
  line-height: 1.2;
  letter-spacing: -1px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 42px;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 32px;
    margin-bottom: 16px;
  }
}

.hero-subtitle {
  font-size: 22px;
  color: #4a5568;
  margin-bottom: 40px;
  line-height: 1.6;
  font-weight: 400;
}

@media (max-width: 768px) {
  .hero-subtitle {
    font-size: 18px;
    margin-bottom: 30px;
  }
}

@media (max-width: 640px) {
  .hero-subtitle {
    font-size: 16px;
    margin-bottom: 24px;
  }
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-hero {
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  border: 2px solid #60a5fa;
}

.btn-secondary:hover {
  background: #60a5fa;
  color: white;
}

.features {
  padding: 60px 0;
  background: white;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .features {
    padding: 40px 0;
  }
}

@media (max-width: 640px) {
  .features {
    padding: 30px 0;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border-color: #cbd5e0;
  background: white;
}

@media (max-width: 640px) {
  .feature-card {
    padding: 30px 16px;
  }
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 15px;
  color: #718096;
  margin: 0;
}

.categories {
  padding: 80px 0;
  background: white;
}

@media (max-width: 768px) {
  .categories {
    padding: 60px 0;
  }
}

@media (max-width: 640px) {
  .categories {
    padding: 40px 0;
  }
}

.featured-products {
  padding: 80px 0;
  background: white;
}

@media (max-width: 768px) {
  .featured-products {
    padding: 60px 0;
  }
}

@media (max-width: 640px) {
  .featured-products {
    padding: 40px 0;
  }
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 42px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: 18px;
  color: #718096;
  font-weight: 400;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.category-card {
  background: white;
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.category-card:hover {
  transform: translateY(-8px);
  border-color: #60a5fa;
  box-shadow: 0 12px 30px rgba(96, 165, 250, 0.15);
}

@media (max-width: 640px) {
  .category-card {
    padding: 30px 15px;
  }
}

.category-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.category-card:hover .category-icon-wrapper {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  transform: scale(1.1);
}

@media (max-width: 640px) {
  .category-icon-wrapper {
    width: 60px;
    height: 60px;
    margin-bottom: 16px;
  }
}

.category-icon {
  font-size: 40px;
  display: block;
}

.category-name {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 50px;
}

.view-all {
  text-align: center;
}

.btn-outline {
  padding: 14px 40px;
  background: white;
  color: #3b82f6;
  border: 2px solid #60a5fa;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: #60a5fa;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(96, 165, 250, 0.3);
}

@media (max-width: 640px) {
  .btn-outline {
    padding: 12px 32px;
    font-size: 14px;
  }
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #60a5fa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 16px;
  color: #a0aec0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  border: 2px dashed #cbd5e0;
}

.empty-state p {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

@media (max-width: 968px) {
  .hero {
    padding: 80px 0 60px;
    min-height: 450px;
  }

  .features {
    padding: 50px 0;
  }

  .categories,
  .featured-products {
    padding: 60px 0;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 60px 0 40px;
    min-height: 400px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .section-title {
    font-size: 32px;
  }

  .section-subtitle {
    font-size: 16px;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
  }

  .category-card {
    padding: 30px 15px;
  }

  .category-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .category-icon {
    font-size: 32px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
  }

  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
}

.become-supplier-banner {
  padding: 80px 0;
  background: white;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}


.supplier-banner {
  position: relative;
  background: transparent;
  border-radius: 0;
  padding: 50px 0;
  box-shadow: none;
  border: none;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;
}

@media (max-width: 1200px) {
  .banner-content {
    padding: 0 40px;
  }
}

@media (max-width: 968px) {
  .supplier-banner {
    padding: 30px 0;
  }

  .banner-content {
    padding: 0 40px;
    gap: 30px;
  }
}

@media (max-width: 640px) {
  .supplier-banner {
    padding: 24px 0;
  }

  .banner-content {
    padding: 0 20px;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .supplier-cta {
    padding: 40px 30px;
  }
}

@media (max-width: 640px) {
  .supplier-cta {
    padding: 30px 20px;
  }
}

.banner-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 60px;
  box-sizing: border-box;
  overflow: hidden;
}

@media (max-width: 968px) {
  .banner-content {
    flex-direction: column;
    gap: 30px;
    text-align: center;
  }
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 30px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

@media (max-width: 968px) {
  .banner-left {
    flex-direction: column;
    width: 100%;
  }
}

.supplier-icon-wrapper {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
}

.supplier-icon-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
  z-index: 2;
  border: 2px solid white;
}

.supplier-cta-icon {
  font-size: 72px;
  display: block;
  line-height: 1;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}

@media (max-width: 640px) {
  .supplier-cta-icon {
    font-size: 60px;
    margin-bottom: 20px;
  }
}

.banner-text {
  flex: 1;
  min-width: 0;
}

.banner-header {
  margin-bottom: 24px;
}

.banner-title {
  font-size: 40px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 12px;
  line-height: 1.2;
  letter-spacing: -0.8px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 968px) {
  .banner-title {
    font-size: 34px;
  }

  .banner-subtitle {
    font-size: 16px;
  }
}

@media (max-width: 640px) {
  .banner-title {
    font-size: 28px;
  }

  .banner-subtitle {
    font-size: 15px;
  }

  .supplier-cta-icon {
    font-size: 56px;
  }

  .supplier-icon-badge {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .supplier-cta-title {
    font-size: 32px;
  }
}

@media (max-width: 640px) {
  .supplier-cta-title {
    font-size: 28px;
    margin-bottom: 12px;
  }
}

.banner-subtitle {
  font-size: 17px;
  color: #475569;
  line-height: 1.6;
  font-weight: 500;
  margin: 0;
}

@media (max-width: 640px) {
  .banner-subtitle {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .supplier-cta-subtitle {
    font-size: 18px;
    margin-bottom: 30px;
  }
}

@media (max-width: 640px) {
  .supplier-cta-subtitle {
    font-size: 16px;
    margin-bottom: 24px;
  }
}

.banner-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  width: 100%;
  overflow: hidden;
}

@media (max-width: 640px) {
  .banner-benefits {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 640px) {
  .supplier-benefits {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 30px;
  }
}

.banner-benefit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  color: #475569;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

.banner-benefit:hover {
  background: white;
  border-color: #cbd5e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

@media (max-width: 640px) {
  .banner-benefit {
    white-space: normal;
    width: 100%;
    justify-content: center;
  }
}

.banner-benefit .benefit-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.benefit-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
}

.banner-benefit:hover .benefit-icon-wrapper {
  background: white;
  border-color: #cbd5e0;
}

.banner-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

@media (max-width: 968px) {
  .banner-right {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .benefit-text {
    font-size: 14px;
  }
}

.btn-supplier-banner {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 18px 36px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 17px;
  font-weight: 700;
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
  border: none;
  cursor: pointer;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.btn-supplier-banner:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.45);
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.btn-icon {
  font-size: 20px;
  line-height: 1;
}

.btn-text {
  line-height: 1;
}

@media (max-width: 640px) {
  .btn-supplier-banner {
    padding: 14px 28px;
    font-size: 15px;
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .btn-supplier {
    padding: 14px 32px;
    font-size: 16px;
  }
}

.banner-visual {
  position: absolute;
  top: -50px;
  left: 0;
  right: 0;
  bottom: -50px;
  width: 100%;
  height: calc(100% + 100px);
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.visual-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.visual-shape.shape-1 {
  width: 200px;
  height: 200px;
  background: #93c5fd;
  top: -30px;
  right: 5%;
  animation-delay: 0s;
}

.visual-shape.shape-2 {
  width: 150px;
  height: 150px;
  background: #60a5fa;
  bottom: -30px;
  left: 5%;
  animation-delay: 5s;
}

.visual-shape.shape-3 {
  width: 120px;
  height: 120px;
  background: #bfdbfe;
  top: 50%;
  right: 10%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  33% {
    transform: translateY(-30px) translateX(30px);
  }
  66% {
    transform: translateY(30px) translateX(-30px);
  }
}
</style>
