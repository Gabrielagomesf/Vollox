<template>
  <div class="supplier-products-page">
    <div class="container">
      <div class="page-header">
        <div class="header-content">
          <h1>Meus Produtos</h1>
          <p>Gerencie seus produtos cadastrados</p>
        </div>
        <button @click="showAddProduct = true" class="btn btn-primary">
          <span>➕</span>
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      <div v-if="!isSupplier" class="not-supplier">
        <div class="not-supplier-card">
          <div class="not-supplier-icon">🏪</div>
          <h2>Você não é um fornecedor</h2>
          <p>Para cadastrar produtos, você precisa se registrar como fornecedor primeiro</p>
          <router-link to="/profile" class="btn btn-primary">
            Ir para Perfil
          </router-link>
        </div>
      </div>

      <div v-else class="products-content">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Carregando produtos...</p>
        </div>

        <div v-else-if="products.length === 0" class="empty-state">
          <div class="empty-icon">📦</div>
          <h2>Nenhum produto cadastrado</h2>
          <p>Comece cadastrando seu primeiro produto</p>
          <button @click="showAddProduct = true" class="btn btn-primary">
            Cadastrar Primeiro Produto
          </button>
        </div>

        <div v-else class="products-grid">
          <div
            v-for="product in products"
            :key="product._id"
            class="product-card"
          >
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-category">{{ product.category }}</p>
              <div class="product-details">
                <div class="detail-item">
                  <span class="detail-label">Preço:</span>
                  <span class="detail-value">{{ formatCurrency(product.price) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Estoque:</span>
                  <span class="detail-value">{{ product.stock }} unidades</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Avaliação:</span>
                  <span class="detail-value">⭐ {{ product.rating || 'N/A' }}</span>
                </div>
              </div>
            </div>
            <div class="product-actions">
              <button @click="editProduct(product)" class="action-btn edit">
                <span>✏️</span>
                <span>Editar</span>
              </button>
              <button @click="deleteProduct(product._id)" class="action-btn delete">
                <span>🗑️</span>
                <span>Excluir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showAddProduct || editingProduct" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto' }}</h2>
            <button @click="closeModal" class="close-btn">✕</button>
          </div>

          <form @submit.prevent="saveProduct" class="product-form">
            <div class="form-row">
              <div class="form-group form-group-large">
                <label for="productName">Nome do Produto *</label>
                <input
                  id="productName"
                  v-model="productForm.name"
                  type="text"
                  placeholder="Nome do produto"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group form-group-large">
                <label for="productDescription">Descrição *</label>
                <textarea
                  id="productDescription"
                  v-model="productForm.description"
                  placeholder="Descreva o produto..."
                  class="form-input"
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="productPrice">Preço *</label>
                <input
                  id="productPrice"
                  v-model.number="productForm.price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label for="productStock">Estoque *</label>
                <input
                  id="productStock"
                  v-model.number="productForm.stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group form-group-large">
                <label for="productCategory">Categoria *</label>
                <select
                  id="productCategory"
                  v-model="productForm.category"
                  class="form-input"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option v-for="cat in categories" :key="cat._id" :value="cat.name">
                    {{ cat.icon }} {{ cat.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group form-group-large">
                <label for="productImage">URL da Imagem *</label>
                <input
                  id="productImage"
                  v-model="productForm.image"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  class="form-input"
                  required
                />
                <div v-if="productForm.image" class="image-preview">
                  <img :src="productForm.image" alt="Preview" @error="imageError = true" />
                  <p v-if="imageError" class="image-error">Erro ao carregar imagem</p>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="productRating">Avaliação Inicial</label>
                <input
                  id="productRating"
                  v-model.number="productForm.rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="0.0"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="productReviews">Número de Avaliações</label>
                <input
                  id="productReviews"
                  v-model.number="productForm.reviews"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeModal" class="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="!saving">{{ editingProduct ? '💾 Salvar Alterações' : '➕ Cadastrar Produto' }}</span>
                <span v-else class="loading-spinner-small"></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productService, categoryService } from '../services/api'
import { authService } from '../services/auth'
import { formatCurrency } from '../utils/formatters'
import { useToast } from '../composables/useToast'

export default {
  name: 'SupplierProducts',
  setup() {
    const router = useRouter()
    const { showToast } = useToast()
    const products = ref([])
    const categories = ref([])
    const loading = ref(true)
    const saving = ref(false)
    const showAddProduct = ref(false)
    const editingProduct = ref(null)
    const imageError = ref(false)
    const isSupplier = ref(false)

    const productForm = ref({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      image: '',
      rating: 0,
      reviews: 0
    })

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
      return false
    }

    const loadCategories = async () => {
      try {
        const response = await categoryService.getAll()
        categories.value = response.data || []
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
        categories.value = []
      }
    }

    const loadProducts = async () => {
      loading.value = true
      try {
        const user = authService.getCurrentUser()
        if (!user) {
          router.push('/login')
          return
        }

        const response = await productService.getAll()
        const allProducts = response.data || []
        
        const storedSupplier = localStorage.getItem('supplier')
        if (storedSupplier) {
          const supplier = JSON.parse(storedSupplier)
          const userId = user?._id || user?.id || ''
          if (supplier.userId === userId) {
            const myProducts = localStorage.getItem('myProducts')
            if (myProducts) {
              products.value = JSON.parse(myProducts)
            } else {
              products.value = []
            }
          } else {
            products.value = []
          }
        } else {
          products.value = []
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
        showToast('Erro ao carregar produtos', 'error')
        products.value = []
      } finally {
        loading.value = false
      }
    }

    const saveProduct = async () => {
      saving.value = true
      imageError.value = false
      
      try {
        const currentUser = authService.getCurrentUser()
        const productData = {
          ...productForm.value,
          supplierId: currentUser?._id || currentUser?.id || 'user_' + Date.now()
        }

        if (editingProduct.value) {
          const myProducts = JSON.parse(localStorage.getItem('myProducts') || '[]')
          const index = myProducts.findIndex(p => p._id === editingProduct.value._id)
          if (index !== -1) {
            myProducts[index] = { ...editingProduct.value, ...productData }
            localStorage.setItem('myProducts', JSON.stringify(myProducts))
            showToast('Produto atualizado com sucesso!', 'success')
          }
        } else {
          const newProduct = {
            ...productData,
            _id: 'prod_' + Date.now(),
            createdAt: new Date().toISOString()
          }
          
          const myProducts = JSON.parse(localStorage.getItem('myProducts') || '[]')
          myProducts.push(newProduct)
          localStorage.setItem('myProducts', JSON.stringify(myProducts))
          showToast('Produto cadastrado com sucesso!', 'success')
        }

        await loadProducts()
        closeModal()
      } catch (error) {
        console.error('Erro ao salvar produto:', error)
        showToast('Erro ao salvar produto', 'error')
      } finally {
        saving.value = false
      }
    }

    const editProduct = (product) => {
      editingProduct.value = product
      productForm.value = {
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category: product.category || '',
        image: product.image || '',
        rating: product.rating || 0,
        reviews: product.reviews || 0
      }
      showAddProduct.value = true
    }

    const deleteProduct = async (productId) => {
      if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return
      }

      try {
        const myProducts = JSON.parse(localStorage.getItem('myProducts') || '[]')
        const filtered = myProducts.filter(p => p._id !== productId)
        localStorage.setItem('myProducts', JSON.stringify(filtered))
        showToast('Produto excluído com sucesso!', 'success')
        await loadProducts()
      } catch (error) {
        console.error('Erro ao excluir produto:', error)
        showToast('Erro ao excluir produto', 'error')
      }
    }

    const closeModal = () => {
      showAddProduct.value = false
      editingProduct.value = null
      productForm.value = {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        image: '',
        rating: 0,
        reviews: 0
      }
      imageError.value = false
    }

    onMounted(() => {
      if (!checkSupplierStatus()) {
        loading.value = false
        return
      }
      loadCategories()
      loadProducts()
    })

    return {
      products,
      categories,
      loading,
      saving,
      showAddProduct,
      editingProduct,
      imageError,
      isSupplier,
      productForm,
      saveProduct,
      editProduct,
      deleteProduct,
      closeModal,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.supplier-products-page {
  padding: 40px 0 60px;
  min-height: calc(100vh - 200px);
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-content h1 {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.header-content p {
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.not-supplier {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.not-supplier-card {
  background: white;
  border-radius: 20px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0f2fe;
  max-width: 500px;
  width: 100%;
}

.not-supplier-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.not-supplier-card h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.not-supplier-card p {
  color: #64748b;
  margin-bottom: 32px;
  font-size: 16px;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #64748b;
  font-size: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  border: 1px solid #e0f2fe;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 24px;
  font-size: 16px;
}

.products-content {
  width: 100%;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.product-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0f2fe;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-card:hover {
  border-color: #bfdbfe;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
  transform: translateY(-4px);
}

.product-image {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-category {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px 0;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.detail-label {
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  color: #1e293b;
  font-weight: 600;
}

.product-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e0f2fe;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
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
  gap: 8px;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-btn.edit:hover {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #3b82f6;
}

.action-btn.delete:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
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

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0f2fe;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e40af;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  color: #64748b;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
  transform: rotate(90deg);
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-row:has(.form-group-large) {
  grid-template-columns: 1fr;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group-large {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0f2fe;
  border-radius: 10px;
  font-size: 15px;
  color: #1e293b;
  background: #f8f9fa;
  transition: all 0.3s ease;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #60a5fa;
  background: white;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.1);
}

.form-input::placeholder {
  color: #94a3b8;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.image-preview {
  margin-top: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px solid #e0f2fe;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}

.image-error {
  color: #dc2626;
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
  padding-top: 20px;
  border-top: 2px solid #e0f2fe;
}

.btn-secondary {
  padding: 12px 24px;
  border: 2px solid #e0f2fe;
  border-radius: 10px;
  background: white;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #bfdbfe;
}

.loading-spinner-small {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@media (max-width: 968px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .supplier-products-page {
    padding: 20px 0 40px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 24px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>

