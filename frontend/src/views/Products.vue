<template>
  <div class="products-page">
    <div class="products-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Nossos Produtos</h1>
          <div class="results-info" v-if="!loading">
            <span>{{ filteredProducts.length }} produto{{ filteredProducts.length !== 1 ? 's' : '' }} encontrado{{ filteredProducts.length !== 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>

      <div class="products-layout">
        <aside class="filters-sidebar" :class="showFilters ? 'filters-open' : ''">
          <div class="filters-header">
            <h2>Filtros</h2>
            <button class="close-filters-btn" @click="showFilters = false" v-if="showFilters">
              ✕
            </button>
          </div>

          <div class="filters-content">
            <div class="filter-group">
              <h3 class="filter-title">Categoria</h3>
              <select v-model="selectedCategory" @change="applyFilters" class="filter-select">
                <option value="">Todas as categorias</option>
                <option v-for="cat in categories" :key="cat._id" :value="cat.name">
                  {{ cat.icon }} {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Preço</h3>
              <div class="price-range">
                <div class="price-inputs">
                  <input 
                    type="number" 
                    v-model.number="priceMin" 
                    placeholder="Mín"
                    class="price-input"
                    @input="applyFilters"
                  />
                  <span class="price-separator">até</span>
                  <input 
                    type="number" 
                    v-model.number="priceMax" 
                    placeholder="Máx"
                    class="price-input"
                    @input="applyFilters"
                  />
                </div>
              </div>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Avaliação</h3>
              <div class="rating-filters">
                <div class="rating-select-wrapper">
                  <select v-model.number="selectedRating" @change="applyFilters" class="rating-select">
                    <option :value="null">Todas as avaliações</option>
                    <option :value="5">5 estrelas</option>
                    <option :value="4">4+ estrelas</option>
                    <option :value="3">3+ estrelas</option>
                    <option :value="2">2+ estrelas</option>
                    <option :value="1">1+ estrelas</option>
                  </select>
                  <div v-if="selectedRating" class="rating-preview">
                    <span class="rating-stars-preview">
                      <svg v-for="i in 5" :key="i" class="star-icon" :class="{ filled: i <= selectedRating }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                    <span class="rating-preview-text">{{ selectedRating }}+ estrelas</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="filter-group">
              <h3 class="filter-title">Disponibilidade</h3>
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="inStockOnly"
                  @change="applyFilters"
                  class="checkbox-input"
                />
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">Apenas em estoque</span>
              </label>
            </div>

            <div class="filter-actions">
              <button @click="clearAllFilters" class="clear-filters-btn">
                Limpar Filtros
              </button>
            </div>
          </div>
        </aside>

        <div class="products-content">
          <div class="products-toolbar">
            <button class="toggle-filters-btn" @click="showFilters = !showFilters">
              <span>🔍</span>
              <span>Filtros</span>
            </button>
            
            <div class="sort-container">
              <label class="sort-label">Ordenar por:</label>
              <select v-model="sortBy" @change="applyFilters" class="sort-select">
                <option value="name">Nome (A-Z)</option>
                <option value="name-desc">Nome (Z-A)</option>
                <option value="price">Preço: Menor para Maior</option>
                <option value="price-desc">Preço: Maior para Menor</option>
                <option value="rating">Melhor Avaliado</option>
                <option value="reviews">Mais Avaliado</option>
              </select>
            </div>
          </div>

          <Loading :show="loading" message="Carregando produtos..." />
          
          <div v-if="!loading && filteredProducts.length === 0" class="empty-state">
            <div class="empty-icon">🔍</div>
            <h2>Nenhum produto encontrado</h2>
            <p>Tente ajustar os filtros de busca</p>
            <button @click="clearAllFilters" class="clear-filters-action-btn">
              Limpar Filtros
            </button>
          </div>

          <div v-else class="products-grid">
            <ProductCard 
              v-for="product in paginatedProducts" 
              :key="product._id"
              :product="product"
            />
          </div>

          <div v-if="!loading && filteredProducts.length > 0" class="pagination-wrapper">
            <div class="pagination-info">
              <span>Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ filteredProducts.length }} produtos</span>
            </div>
            <div class="pagination">
              <button 
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="pagination-btn"
                :class="{ disabled: currentPage === 1 }"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="pagination-icon">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Anterior
              </button>
              
              <div class="pagination-numbers">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  class="pagination-number"
                  :class="{ active: page === currentPage }"
                >
                  {{ page }}
                </button>
              </div>
              
              <button 
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="pagination-btn"
                :class="{ disabled: currentPage === totalPages }"
              >
                Próxima
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="pagination-icon">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { categoryService, productService } from '../services/api'
import ProductCard from '../components/ProductCard.vue'
import Loading from '../components/Loading.vue'

export default {
  name: 'Products',
  components: {
    ProductCard,
    Loading
  },
  setup() {
    const route = useRoute()
    const products = ref([])
    const categories = ref([])
    const selectedCategory = ref('')
    const priceMin = ref(null)
    const priceMax = ref(null)
    const selectedRating = ref(null)
    const inStockOnly = ref(false)
    const sortBy = ref('name')
    const showFilters = ref(false)
    const loading = ref(true)
    const currentPage = ref(1)
    const itemsPerPage = ref(12)

    const loadCategories = async () => {
      try {
        const response = await categoryService.getAll()
        categories.value = response.data
      } catch (error) {
        categories.value = []
      }
    }

    const loadProducts = async () => {
      loading.value = true
      try {
        const params = {}
        if (selectedCategory.value) params.category = selectedCategory.value
        if (route.query.search) params.search = route.query.search
        
        const response = await productService.getAll(params)
        products.value = response.data
      } catch (error) {
        products.value = []
      } finally {
        loading.value = false
      }
    }

    const filteredProducts = computed(() => {
      let filtered = [...products.value]

      // Filtro de preço
      if (priceMin.value !== null && priceMin.value !== '') {
        filtered = filtered.filter(p => p.price >= priceMin.value)
      }
      if (priceMax.value !== null && priceMax.value !== '' && priceMax.value !== Infinity) {
        filtered = filtered.filter(p => p.price <= priceMax.value)
      }

      // Filtro de avaliação
      if (selectedRating.value) {
        filtered = filtered.filter(p => Math.round(p.rating) >= selectedRating.value)
      }

      // Filtro de estoque
      if (inStockOnly.value) {
        filtered = filtered.filter(p => p.stock > 0)
      }

      // Ordenação
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'name-desc':
            return b.name.localeCompare(a.name)
          case 'price':
            return a.price - b.price
          case 'price-desc':
            return b.price - a.price
          case 'rating':
            return b.rating - a.rating
          case 'reviews':
            return b.reviews - a.reviews
          default:
            return 0
        }
      })

      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
    })

    const startIndex = computed(() => {
      return (currentPage.value - 1) * itemsPerPage.value
    })

    const endIndex = computed(() => {
      return Math.min(startIndex.value + itemsPerPage.value, filteredProducts.value.length)
    })

    const paginatedProducts = computed(() => {
      return filteredProducts.value.slice(startIndex.value, endIndex.value)
    })

    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 3) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 2) {
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        }
      }
      
      return pages
    })

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    watch([filteredProducts, selectedCategory, priceMin, priceMax, selectedRating, inStockOnly, sortBy], () => {
      currentPage.value = 1
    })

    const clearAllFilters = () => {
      selectedCategory.value = ''
      priceMin.value = null
      priceMax.value = null
      selectedRating.value = null
      inStockOnly.value = false
      sortBy.value = 'name'
      applyFilters()
    }

    const applyFilters = () => {
      // Os filtros são aplicados automaticamente via computed
      // Este método pode ser usado para futuras ações
    }

    watch(() => route.query, () => {
      if (route.query.category) {
        selectedCategory.value = route.query.category
      }
      loadProducts()
    }, { immediate: true })

    onMounted(() => {
      loadCategories()
      if (route.query.category) {
        selectedCategory.value = route.query.category
      }
      loadProducts()
    })

    return {
      products,
      categories,
      selectedCategory,
      priceMin,
      priceMax,
      selectedRating,
      inStockOnly,
      sortBy,
      showFilters,
      loading,
      filteredProducts,
      paginatedProducts,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      goToPage,
      clearAllFilters,
      applyFilters
    }
  }
}
</script>

<style scoped>
.products-page {
  padding: 0;
  min-height: calc(100vh - 200px);
  background: #f8f9fa;
  width: 100%;
}

.products-container {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  margin-bottom: 30px;
  padding: 30px 24px 0;
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.page-header h1 {
  font-size: 36px;
  color: #2d3748;
  font-weight: 700;
  margin: 0;
}

.results-info {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.products-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  width: 100%;
  padding: 0 24px 40px;
}

.filters-sidebar {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0f2fe;
  height: fit-content;
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  max-width: 280px;
  box-sizing: border-box;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0f2fe;
}

.filters-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1e40af;
  margin: 0;
}

.close-filters-btn {
  display: none;
  width: 32px;
  height: 32px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
}

.close-filters-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.filters-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow-x: hidden;
}

.filters-content::-webkit-scrollbar {
  width: 6px;
}

.filters-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.filters-content::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.filters-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.filter-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e40af;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0f2fe;
}

.filter-select {
  width: 100%;
  max-width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0f2fe;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
}

.filter-select:hover {
  border-color: #bfdbfe;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #60a5fa;
  background: white;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  flex-wrap: nowrap;
  box-sizing: border-box;
}

.price-input {
  flex: 1;
  min-width: 0;
  max-width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0f2fe;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background: #f8f9fa;
  transition: all 0.3s ease;
  font-weight: 500;
  box-sizing: border-box;
  width: 100%;
}

.price-input:hover {
  border-color: #bfdbfe;
  background: white;
}

.price-input:focus {
  outline: none;
  border-color: #60a5fa;
  background: white;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.price-separator {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.price-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.price-btn {
  padding: 12px 16px;
  border: 2px solid #e0f2fe;
  border-radius: 10px;
  background: #f8f9fa;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-btn:hover {
  border-color: #60a5fa;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #3b82f6;
  transform: translateX(4px);
}

.price-btn.active {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  border-color: #3b82f6;
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.rating-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.rating-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.rating-select {
  width: 100%;
  max-width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0f2fe;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-sizing: border-box;
}

.rating-select:hover {
  border-color: #bfdbfe;
  background: white;
}

.rating-select:focus {
  outline: none;
  border-color: #60a5fa;
  background: white;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.rating-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 10px;
  border: 1px solid #bfdbfe;
}

.rating-stars-preview {
  display: flex;
  gap: 2px;
}

.rating-preview-text {
  font-size: 13px;
  color: #3b82f6;
  font-weight: 600;
}

.rating-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.rating-option:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #bfdbfe;
}

.rating-input {
  display: none;
}

.rating-input:checked + .rating-stars + .rating-text {
  color: #3b82f6;
  font-weight: 700;
}

.rating-option:has(.rating-input:checked) {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #60a5fa;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star-icon {
  width: 18px;
  height: 18px;
  color: #cbd5e0;
  opacity: 0.4;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.star-icon.filled {
  color: #fbbf24;
  opacity: 1;
  fill: #fbbf24;
}

.rating-stars-preview {
  display: flex;
  gap: 4px;
  align-items: center;
}

.rating-text {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.clear-rating-btn {
  margin-top: 8px;
  padding: 8px 12px;
  border: 1px solid #e0f2fe;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-rating-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  border-radius: 10px;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.checkbox-label:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #bfdbfe;
}

.checkbox-label:has(.checkbox-input:checked) {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #60a5fa;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e0;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  border-color: #3b82f6;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.checkbox-text {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.filter-actions {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #e0f2fe;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.clear-filters-btn {
  width: 100%;
  padding: 14px;
  border: 2px solid #e0f2fe;
  border-radius: 12px;
  background: white;
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.clear-filters-btn:hover {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-color: #fecaca;
  color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.products-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.products-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.toggle-filters-btn {
  display: none;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid #60a5fa;
  border-radius: 10px;
  background: white;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-filters-btn:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.sort-select {
  padding: 10px 16px;
  border: 2px solid #e0f2fe;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e0f2fe;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 24px;
  color: #1e293b;
  margin-bottom: 12px;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 24px;
}

.clear-filters-action-btn {
  padding: 12px 24px;
  border: 2px solid #60a5fa;
  border-radius: 10px;
  background: white;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters-action-btn:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.pagination-wrapper {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  padding: 30px 0;
  border-top: 1px solid #e0f2fe;
}

.pagination-info {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: 2px solid #e0f2fe;
  border-radius: 10px;
  background: white;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(.disabled) {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #60a5fa;
  color: #3b82f6;
  transform: translateY(-2px);
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f8f9fa;
}

.pagination-icon {
  width: 18px;
  height: 18px;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pagination-number {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: 2px solid #e0f2fe;
  border-radius: 10px;
  background: white;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover:not(.active) {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #60a5fa;
  color: #3b82f6;
}

.pagination-number.active {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  border-color: #3b82f6;
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.pagination-number:disabled {
  cursor: default;
  background: transparent;
  border: none;
  color: #94a3b8;
}

@media (max-width: 640px) {
  .pagination-wrapper {
    margin-top: 30px;
    padding: 20px 0;
  }

  .pagination {
    gap: 6px;
  }

  .pagination-btn {
    padding: 8px 14px;
    font-size: 13px;
  }

  .pagination-number {
    min-width: 36px;
    height: 36px;
    padding: 0 8px;
    font-size: 13px;
  }

  .pagination-info {
    font-size: 12px;
    text-align: center;
  }
}

@media (max-width: 968px) {
  .products-page {
    padding: 0;
    overflow-x: hidden;
  }

  .page-header {
    padding: 20px 16px 0;
  }

  .products-layout {
    grid-template-columns: 1fr;
    gap: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
  }

  .filters-sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 100%;
    max-width: 400px;
    height: 100vh;
    height: 100dvh;
    z-index: 2000;
    overflow-y: auto;
    overflow-x: hidden;
    transition: left 0.3s ease;
    border-radius: 0;
    border: none;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-height: none;
  }

  .filters-sidebar.filters-open {
    left: 0;
  }

  .filters-content {
    padding-right: 0;
    width: 100%;
    overflow-x: hidden;
  }

  .filter-group {
    width: 100%;
    min-width: 0;
  }

  .filter-select,
  .price-input {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .price-inputs {
    width: 100%;
    flex-wrap: nowrap;
  }

  .price-buttons {
    width: 100%;
  }

  .price-btn {
    width: 100%;
    box-sizing: border-box;
  }

  .close-filters-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toggle-filters-btn {
    display: flex;
  }

  .products-content {
    padding: 0 16px 30px;
    width: 100%;
    overflow-x: hidden;
  }
}

@media (max-width: 768px) {
  .products-page {
    padding: 0;
  }

  .page-header {
    padding: 20px 16px 0;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .products-content {
    padding: 0 16px 30px;
  }

  .products-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .sort-container {
    width: 100%;
    justify-content: space-between;
  }

  .sort-select {
    flex: 1;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    width: 100%;
  }
}

@media (max-width: 640px) {
  .products-page {
    padding: 0;
    overflow-x: hidden;
    width: 100%;
  }

  .products-container {
    width: 100%;
    overflow-x: hidden;
  }

  .page-header {
    padding: 16px 12px 0;
    width: 100%;
    box-sizing: border-box;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .products-layout {
    width: 100%;
    overflow-x: hidden;
  }

  .products-content {
    padding: 0 12px 20px;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .filters-sidebar {
    width: 100%;
    max-width: 100%;
    padding: 16px;
    box-sizing: border-box;
  }

  .filters-header {
    padding-bottom: 12px;
    margin-bottom: 16px;
  }

  .filters-content {
    gap: 20px;
    padding-right: 0;
  }

  .filter-group {
    width: 100%;
    min-width: 0;
  }

  .filter-title {
    font-size: 12px;
  }

  .filter-select,
  .price-input {
    width: 100%;
    padding: 10px 12px;
    font-size: 13px;
    box-sizing: border-box;
  }

  .price-inputs {
    width: 100%;
    gap: 6px;
  }

  .price-separator {
    font-size: 12px;
    white-space: nowrap;
  }

  .price-buttons {
    width: 100%;
    gap: 6px;
  }

  .price-btn {
    width: 100%;
    padding: 10px 12px;
    font-size: 12px;
    box-sizing: border-box;
  }

  .rating-option {
    padding: 10px;
    gap: 8px;
  }

  .rating-stars {
    font-size: 12px;
  }

  .rating-text {
    font-size: 12px;
  }

  .checkbox-label {
    padding: 10px;
    gap: 10px;
  }

  .checkbox-text {
    font-size: 13px;
  }

  .clear-filters-btn {
    padding: 12px;
    font-size: 12px;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;
    box-sizing: border-box;
  }

  .products-toolbar {
    gap: 10px;
    width: 100%;
    box-sizing: border-box;
  }

  .toggle-filters-btn {
    width: 100%;
    justify-content: center;
    box-sizing: border-box;
  }

  .sort-container {
    width: 100%;
    box-sizing: border-box;
  }

  .sort-select {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
