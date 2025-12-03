<template>
  <div class="product-detail">
    <Loading :show="loading" message="Carregando produto..." />
    
    <div v-if="!loading && product" class="container">
      <div class="product-detail-content">
        <div class="product-images">
          <div class="main-image">
            <img :src="product.image" :alt="product.name" />
          </div>
        </div>
        
        <div class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="product-rating">
            <div class="stars">
              <svg v-for="i in 5" :key="i" class="star-icon" :class="{ filled: i <= Math.round(product.rating) }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="rating-value">{{ product.rating }}</span>
            <span class="reviews-count">({{ product.reviews }} avaliações)</span>
          </div>
          
          <div class="product-price-section">
            <span class="product-price">{{ formatCurrency(product.price) }}</span>
            <span v-if="product.stock > 0" class="stock-available">Em estoque</span>
            <span v-else class="stock-unavailable">Esgotado</span>
          </div>
          
          <div class="product-description">
            <h3>Descrição</h3>
            <p>{{ product.description }}</p>
          </div>
          
          <div class="product-actions">
            <div class="quantity-selector">
              <button @click="decreaseQuantity" :disabled="quantity <= 1" class="qty-btn">-</button>
              <input v-model.number="quantity" type="number" min="1" :max="product.stock" class="qty-input" />
              <button @click="increaseQuantity" :disabled="quantity >= product.stock" class="qty-btn">+</button>
            </div>
            
            <button 
              @click="addToCart" 
              class="btn btn-primary btn-large"
              :disabled="product.stock === 0 || addingToCart"
            >
              {{ addingToCart ? 'Adicionando...' : product.stock > 0 ? 'Adicionar ao Carrinho' : 'Esgotado' }}
            </button>
          </div>
          
          <div class="product-meta">
            <div class="meta-item">
              <strong>Categoria:</strong> {{ product.category }}
            </div>
            <div class="meta-item">
              <strong>Estoque:</strong> {{ product.stock }} unidades
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="!loading && !product" class="container">
      <div class="empty-state">
        <h2>Produto não encontrado</h2>
        <router-link to="/products" class="btn btn-primary">Voltar para Produtos</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { productService, cartService } from '../services/api'
import { getSessionId } from '../utils/storage'
import { formatCurrency } from '../utils/formatters'
import { useToast } from '../composables/useToast'
import Loading from '../components/Loading.vue'

export default {
  name: 'ProductDetail',
  components: {
    Loading
  },
  setup() {
    const route = useRoute()
    const product = ref(null)
    const loading = ref(true)
    const quantity = ref(1)
    const addingToCart = ref(false)
    const { showToast } = useToast()

    const loadProduct = async () => {
      loading.value = true
      try {
        const response = await productService.getById(route.params.id)
        product.value = response.data
        if (product.value.stock < quantity.value) {
          quantity.value = product.value.stock
        }
      } catch (error) {
        showToast('Erro ao carregar produto', 'error')
      } finally {
        loading.value = false
      }
    }

    const increaseQuantity = () => {
      if (quantity.value < product.value.stock) {
        quantity.value++
      }
    }

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const addToCart = async () => {
      if (product.value.stock === 0) return
      
      addingToCart.value = true
      try {
        const sessionId = getSessionId()
        await cartService.add({
          productId: product.value._id,
          quantity: quantity.value,
          sessionId
        })
        showToast('Produto adicionado ao carrinho!', 'success')
      } catch (error) {
        showToast('Erro ao adicionar produto ao carrinho', 'error')
      } finally {
        addingToCart.value = false
      }
    }

    onMounted(() => {
      loadProduct()
    })

    return {
      product,
      loading,
      quantity,
      addingToCart,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.product-detail {
  padding: 40px 0;
  min-height: 60vh;
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .product-detail {
    padding: 30px 0;
  }
}

@media (max-width: 640px) {
  .product-detail {
    padding: 20px 0;
  }
}

.product-detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 20px;
}

.product-images {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-title {
  font-size: 32px;
  color: #333;
  margin: 0;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  display: flex;
  gap: 4px;
  align-items: center;
}

.star-icon {
  width: 24px;
  height: 24px;
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

.rating-value {
  font-weight: 600;
  color: #333;
}

.reviews-count {
  color: #666;
  font-size: 14px;
}

.product-price-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-price {
  font-size: 36px;
  font-weight: bold;
  color: #3b82f6;
}

@media (max-width: 640px) {
  .product-price {
    font-size: 28px;
  }
}

.stock-available {
  color: #10b981;
  font-weight: 500;
}

.stock-unavailable {
  color: #ef4444;
  font-weight: 500;
}

.product-description h3 {
  font-size: 20px;
  margin-bottom: 12px;
  color: #333;
}

.product-description p {
  color: #666;
  line-height: 1.6;
  font-size: 16px;
}

.product-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.qty-btn {
  width: 40px;
  height: 48px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  transition: background 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background: #e0e0e0;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-input {
  width: 60px;
  height: 48px;
  border: none;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}

.btn-large {
  flex: 1;
  padding: 16px 32px;
  font-size: 18px;
}

.product-meta {
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-item {
  color: #666;
  font-size: 14px;
}

.meta-item strong {
  color: #333;
  margin-right: 8px;
}

@media (max-width: 968px) {
  .product-detail-content {
    grid-template-columns: 1fr;
  }
  
  .product-images {
    position: static;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .product-price {
    font-size: 28px;
  }
}
</style>

