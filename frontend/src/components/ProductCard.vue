<template>
  <div class="product-card card">
    <router-link :to="`/product/${product._id}`" class="product-link">
      <div class="product-image">
        <img :src="product.image" :alt="product.name" />
      </div>
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
        <div class="product-rating">
          <div class="rating-stars">
            <svg v-for="i in 5" :key="i" class="star-icon" :class="{ filled: i <= Math.round(product.rating) }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="rating-value">{{ product.rating }}</span>
          <span class="rating-reviews">({{ product.reviews }} avaliações)</span>
        </div>
        <div class="product-footer">
          <span class="product-price">{{ formatCurrency(product.price) }}</span>
          <button 
            @click.prevent="handleAddToCart" 
            class="btn btn-primary btn-small"
            :disabled="product.stock === 0"
          >
            {{ product.stock > 0 ? 'Adicionar' : 'Esgotado' }}
          </button>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { cartService } from '../services/api'
import { getSessionId } from '../utils/storage'
import { formatCurrency } from '../utils/formatters'
import { useToast } from '../composables/useToast'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { showToast } = useToast()
    
    const addToCart = async () => {
      if (props.product.stock === 0) return
      
      try {
        const sessionId = getSessionId()
        await cartService.add({
          productId: props.product._id,
          quantity: 1,
          sessionId
        })
        showToast('Produto adicionado ao carrinho!', 'success')
      } catch (error) {
        showToast('Erro ao adicionar produto ao carrinho', 'error')
      }
    }

    return {
      addToCart,
      formatCurrency
    }
  },
  methods: {
    async handleAddToCart() {
      await this.addToCart()
    }
  }
}
</script>

<style scoped>
.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-image {
  width: 100%;
  height: 240px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 16px;
  background: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.4s ease;
  padding: 12px;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d3748;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
}

.product-description {
  font-size: 13px;
  color: #718096;
  margin-bottom: 12px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.rating-stars {
  display: flex;
  gap: 2px;
  align-items: center;
}

.star-icon {
  width: 16px;
  height: 16px;
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
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
}

.rating-reviews {
  font-size: 13px;
  color: #64748b;
  font-weight: 400;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.product-price {
  font-size: 22px;
  font-weight: 700;
  color: #3b82f6;
  letter-spacing: -0.5px;
}

@media (max-width: 640px) {
  .product-price {
    font-size: 20px;
  }
}

.btn-small {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

