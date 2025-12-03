<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">Carrinho de Compras</h1>
      
      <Loading :show="loading" message="Carregando carrinho..." />
      
      <div v-if="!loading && cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione produtos ao carrinho para continuar</p>
        <router-link to="/products" class="btn btn-primary">Explorar Produtos</router-link>
      </div>
      
      <div v-else-if="!loading && cartItems.length > 0" class="cart-content">
        <div class="cart-items">
          <div 
            v-for="item in cartItems" 
            :key="item._id"
            class="cart-item"
          >
            <div class="item-image">
              <img :src="item.productId?.image || ''" :alt="item.productId?.name || ''" />
            </div>
            
            <div class="item-info">
              <h3 class="item-name">{{ item.productId?.name }}</h3>
              <p class="item-price">{{ formatCurrency(item.productId?.price || 0) }}</p>
            </div>
            
            <div class="item-quantity">
              <button 
                @click="updateQuantity(item._id, item.quantity - 1)" 
                :disabled="updating === item._id || item.quantity <= 1"
                class="qty-btn"
              >
                -
              </button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button 
                @click="updateQuantity(item._id, item.quantity + 1)" 
                :disabled="updating === item._id"
                class="qty-btn"
              >
                +
              </button>
            </div>
            
            <div class="item-total">
              <span class="total-price">{{ formatCurrency((item.productId?.price || 0) * item.quantity) }}</span>
            </div>
            
            <button 
              @click="removeItem(item._id)" 
              :disabled="removing === item._id"
              class="remove-btn"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div class="cart-summary">
          <div class="summary-header">
            <h2>Resumo do Pedido</h2>
          </div>
          
          <div class="summary-content">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Frete</span>
              <span>{{ formatCurrency(shipping) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ formatCurrency(total) }}</span>
            </div>
          </div>
          
          <button 
            @click="checkout" 
            class="btn btn-primary btn-large btn-block"
            :disabled="checkingOut"
          >
            {{ checkingOut ? 'Processando...' : 'Finalizar Compra' }}
          </button>
          
          <router-link to="/products" class="continue-shopping">
            Continuar Comprando
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cartService } from '../services/api'
import { getSessionId } from '../utils/storage'
import { formatCurrency } from '../utils/formatters'
import { useToast } from '../composables/useToast'
import Loading from '../components/Loading.vue'

export default {
  name: 'Cart',
  components: {
    Loading
  },
  setup() {
    const router = useRouter()
    const cartItems = ref([])
    const loading = ref(true)
    const updating = ref(null)
    const removing = ref(null)
    const checkingOut = ref(false)
    const { showToast } = useToast()

    const loadCart = async () => {
      loading.value = true
      try {
        const sessionId = getSessionId()
        const response = await cartService.get(sessionId)
        cartItems.value = response.data || []
        
        if (cartItems.value.length > 0) {
          const hasInvalidItems = cartItems.value.some(item => !item.productId || !item.productId.name)
          if (hasInvalidItems) {
            console.warn('Alguns itens do carrinho não têm produto válido')
            cartItems.value = cartItems.value.filter(item => item.productId && item.productId.name)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
        showToast('Erro ao carregar carrinho. Verifique o console para mais detalhes.', 'error')
        cartItems.value = []
      } finally {
        loading.value = false
      }
    }

    const updateQuantity = async (id, newQuantity) => {
      if (newQuantity < 1) return
      
      updating.value = id
      try {
        await cartService.update(id, { quantity: newQuantity })
        await loadCart()
        showToast('Quantidade atualizada', 'success')
      } catch (error) {
        showToast('Erro ao atualizar quantidade', 'error')
      } finally {
        updating.value = null
      }
    }

    const removeItem = async (id) => {
      removing.value = id
      try {
        await cartService.remove(id)
        await loadCart()
        showToast('Item removido do carrinho', 'success')
      } catch (error) {
        showToast('Erro ao remover item', 'error')
      } finally {
        removing.value = null
      }
    }

    const checkout = () => {
      if (cartItems.value.length === 0) {
        showToast('Seu carrinho está vazio', 'warning')
        return
      }
      router.push('/checkout')
    }

    const subtotal = computed(() => {
      return cartItems.value.reduce((sum, item) => {
        return sum + (item.productId?.price || 0) * item.quantity
      }, 0)
    })

    const shipping = computed(() => {
      return subtotal.value > 200 ? 0 : 15
    })

    const total = computed(() => {
      return subtotal.value + shipping.value
    })

    onMounted(() => {
      loadCart()
    })

    return {
      cartItems,
      loading,
      updating,
      removing,
      checkingOut,
      subtotal,
      shipping,
      total,
      updateQuantity,
      removeItem,
      checkout,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.cart-page {
  padding: 40px 0;
  min-height: 60vh;
  background: #f8f9fa;
}

.page-title {
  font-size: 36px;
  color: #2d3748;
  margin-bottom: 30px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .cart-page {
    padding: 30px 0;
  }

  .page-title {
    font-size: 28px;
    margin-bottom: 24px;
  }
}

@media (max-width: 640px) {
  .cart-page {
    padding: 20px 0;
  }

  .page-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
}

.empty-cart {
  text-align: center;
  padding: 80px 20px;
}

.empty-cart-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.empty-cart h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 12px;
}

.empty-cart p {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  margin-top: 20px;
}

@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 640px) {
  .cart-content {
    gap: 24px;
    margin-top: 16px;
  }
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: grid;
  grid-template-columns: 100px 1fr 120px 120px 40px;
  gap: 20px;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

@media (max-width: 968px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 16px;
  }

  .item-quantity,
  .item-total,
  .remove-btn {
    grid-column: 2;
  }

  .item-quantity {
    justify-self: start;
  }

  .item-total {
    justify-self: end;
    text-align: left;
  }
}

@media (max-width: 640px) {
  .cart-item {
    padding: 16px;
    gap: 12px;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.item-price {
  font-size: 16px;
  color: #3b82f6;
  font-weight: 600;
  margin: 0;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.2s;
}

.qty-btn:hover:not(:disabled) {
  border-color: #60a5fa;
  color: #3b82f6;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-value {
  font-size: 18px;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-total {
  text-align: right;
}

.total-price {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.remove-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #fee;
  color: #ef4444;
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-btn:hover:not(:disabled) {
  background: #ef4444;
  color: white;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-summary {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  height: fit-content;
  position: sticky;
  top: 100px;
}

@media (max-width: 968px) {
  .cart-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-summary {
    padding: 20px;
  }
}

.summary-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0 0 20px 0;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 2px solid #e0e0e0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #666;
}

.summary-row.total {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-top: 8px;
}

.btn-block {
  width: 100%;
  margin-bottom: 16px;
}

.continue-shopping {
  display: block;
  text-align: center;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.continue-shopping:hover {
  color: #60a5fa;
}
</style>

