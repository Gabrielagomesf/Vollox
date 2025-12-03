<template>
  <div class="checkout-page">
    <div class="container">
      <div class="checkout-header">
        <h1>Finalizar Compra</h1>
        <router-link to="/cart" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="back-icon">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Voltar ao carrinho
        </router-link>
      </div>

      <div v-if="!isAuthenticated" class="auth-required">
        <div class="auth-card">
          <div class="auth-icon">🔒</div>
          <h2>Login Necessário</h2>
          <p>Você precisa estar logado para finalizar a compra</p>
          <div class="auth-actions">
            <router-link to="/login" class="btn btn-primary">
              Fazer Login
            </router-link>
            <router-link to="/register" class="btn btn-secondary">
              Criar Conta
            </router-link>
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="loading-container">
        <Loading :show="true" message="Carregando..." />
      </div>

      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione produtos ao carrinho para continuar</p>
        <router-link to="/products" class="btn btn-primary">
          Ver Produtos
        </router-link>
      </div>

      <div v-else class="checkout-content">
        <div class="checkout-layout">
          <div class="checkout-main">
            <div class="checkout-section">
              <h2 class="section-title">
                <span class="section-icon">👤</span>
                Dados de Entrega
              </h2>
              <form @submit.prevent="handleCheckout" class="checkout-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="fullName">Nome Completo *</label>
                    <input
                      id="fullName"
                      v-model="form.fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      required
                      class="form-input"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="email">Email *</label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label for="phone">Telefone *</label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      required
                      class="form-input"
                      @input="formatPhone"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="cep">CEP *</label>
                    <input
                      id="cep"
                      v-model="form.cep"
                      type="text"
                      placeholder="00000-000"
                      required
                      class="form-input"
                      @blur="searchCep"
                      @input="formatCep"
                      maxlength="9"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group form-group-large">
                    <label for="address">Endereço *</label>
                    <input
                      id="address"
                      v-model="form.address"
                      type="text"
                      placeholder="Rua, Avenida, etc."
                      required
                      class="form-input"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="number">Número *</label>
                    <input
                      id="number"
                      v-model="form.number"
                      type="text"
                      placeholder="123"
                      required
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label for="complement">Complemento</label>
                    <input
                      id="complement"
                      v-model="form.complement"
                      type="text"
                      placeholder="Apto, Bloco, etc."
                      class="form-input"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="neighborhood">Bairro *</label>
                    <input
                      id="neighborhood"
                      v-model="form.neighborhood"
                      type="text"
                      placeholder="Seu bairro"
                      required
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label for="city">Cidade *</label>
                    <input
                      id="city"
                      v-model="form.city"
                      type="text"
                      placeholder="Sua cidade"
                      required
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label for="state">Estado *</label>
                    <select
                      id="state"
                      v-model="form.state"
                      required
                      class="form-input"
                    >
                      <option value="">Selecione</option>
                      <option value="AC">AC</option>
                      <option value="AL">AL</option>
                      <option value="AP">AP</option>
                      <option value="AM">AM</option>
                      <option value="BA">BA</option>
                      <option value="CE">CE</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="GO">GO</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="MS">MS</option>
                      <option value="MG">MG</option>
                      <option value="PA">PA</option>
                      <option value="PB">PB</option>
                      <option value="PR">PR</option>
                      <option value="PE">PE</option>
                      <option value="PI">PI</option>
                      <option value="RJ">RJ</option>
                      <option value="RN">RN</option>
                      <option value="RS">RS</option>
                      <option value="RO">RO</option>
                      <option value="RR">RR</option>
                      <option value="SC">SC</option>
                      <option value="SP">SP</option>
                      <option value="SE">SE</option>
                      <option value="TO">TO</option>
                    </select>
                  </div>
                </div>

                <div class="checkout-section">
                  <h2 class="section-title">
                    <span class="section-icon">💳</span>
                    Forma de Pagamento
                  </h2>
                  <div class="payment-methods">
                    <label
                      v-for="method in paymentMethods"
                      :key="method.value"
                      class="payment-method"
                      :class="{ active: form.paymentMethod === method.value }"
                    >
                      <input
                        type="radio"
                        :value="method.value"
                        v-model="form.paymentMethod"
                        required
                        class="payment-input"
                        @change="onPaymentMethodChange"
                      />
                      <div class="payment-content">
                        <span class="payment-icon">{{ method.icon }}</span>
                        <div class="payment-info">
                          <span class="payment-name">{{ method.name }}</span>
                          <span class="payment-desc">{{ method.description }}</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div v-if="form.paymentMethod === 'credit' || form.paymentMethod === 'debit'" class="card-form">
                    <div class="card-form-header">
                      <h3>Dados do Cartão</h3>
                    </div>
                    <div class="form-row">
                      <div class="form-group form-group-large">
                        <label for="cardNumber">Número do Cartão *</label>
                        <input
                          id="cardNumber"
                          v-model="cardData.number"
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          required
                          class="form-input"
                          maxlength="19"
                          @input="formatCardNumber"
                        />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group form-group-large">
                        <label for="cardName">Nome no Cartão *</label>
                        <input
                          id="cardName"
                          v-model="cardData.name"
                          type="text"
                          placeholder="NOME COMO ESTÁ NO CARTÃO"
                          required
                          class="form-input"
                          style="text-transform: uppercase;"
                        />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label for="cardExpiry">Validade *</label>
                        <input
                          id="cardExpiry"
                          v-model="cardData.expiry"
                          type="text"
                          placeholder="MM/AA"
                          required
                          class="form-input"
                          maxlength="5"
                          @input="formatExpiry"
                        />
                      </div>
                      <div class="form-group">
                        <label for="cardCvv">CVV *</label>
                        <input
                          id="cardCvv"
                          v-model="cardData.cvv"
                          type="text"
                          placeholder="123"
                          required
                          class="form-input"
                          maxlength="4"
                          @input="formatCvv"
                        />
                      </div>
                    </div>
                    <div v-if="form.paymentMethod === 'credit'" class="form-row">
                      <div class="form-group form-group-large">
                        <label for="installments">Parcelas *</label>
                        <select
                          id="installments"
                          v-model="cardData.installments"
                          required
                          class="form-input"
                        >
                          <option value="">Selecione</option>
                          <option v-for="i in 12" :key="i" :value="i">
                            {{ i }}x de {{ formatCurrency(total / i) }} sem juros
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div v-if="form.paymentMethod === 'pix'" class="pix-payment">
                    <div class="pix-header">
                      <h3>Pagamento via PIX</h3>
                      <p class="pix-discount">Desconto de 10% aplicado!</p>
                    </div>
                    <div class="pix-content">
                      <div class="pix-qr-code">
                        <div class="qr-code-wrapper">
                          <canvas ref="qrCodeCanvas" class="qr-code"></canvas>
                        </div>
                        <p class="qr-code-text">Escaneie o QR Code com o app do seu banco</p>
                      </div>
                      <div class="pix-code">
                        <label>Código PIX (Copiar e Colar)</label>
                        <div class="pix-code-input-wrapper">
                          <input
                            type="text"
                            :value="pixCode"
                            readonly
                            class="pix-code-input"
                            ref="pixCodeInput"
                          />
                          <button type="button" @click="copyPixCode" class="copy-btn">
                            {{ copiedPix ? '✓ Copiado!' : '📋 Copiar' }}
                          </button>
                        </div>
                        <p class="pix-expiry">Código válido por 30 minutos</p>
                      </div>
                    </div>
                  </div>

                  <div v-if="form.paymentMethod === 'boleto'" class="boleto-payment">
                    <div class="boleto-header">
                      <h3>Pagamento via Boleto</h3>
                      <p class="boleto-discount">Desconto de 5% aplicado!</p>
                    </div>
                    <div class="boleto-content">
                      <div class="boleto-preview">
                        <div class="boleto-info">
                          <div class="boleto-row">
                            <span class="boleto-label">Valor:</span>
                            <span class="boleto-value">{{ formatCurrency(total) }}</span>
                          </div>
                          <div class="boleto-row">
                            <span class="boleto-label">Vencimento:</span>
                            <span class="boleto-value">{{ boletoDueDate }}</span>
                          </div>
                          <div class="boleto-row">
                            <span class="boleto-label">Código de Barras:</span>
                            <span class="boleto-code">{{ boletoCode }}</span>
                          </div>
                        </div>
                        <div class="boleto-actions">
                          <button type="button" @click="downloadBoleto" class="btn btn-outline">
                            📄 Baixar Boleto
                          </button>
                          <button type="button" @click="copyBoletoCode" class="btn btn-outline">
                            {{ copiedBoleto ? '✓ Copiado!' : '📋 Copiar Código' }}
                          </button>
                        </div>
                        <p class="boleto-warning">⚠️ O boleto vence em 3 dias úteis. Após o pagamento, a confirmação pode levar até 2 dias úteis.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-actions">
                  <button
                    type="submit"
                    class="btn btn-primary btn-large"
                    :disabled="processing || !canSubmit"
                  >
                    <span v-if="!processing">Finalizar Compra</span>
                    <span v-else class="loading-spinner-small"></span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <aside class="checkout-sidebar">
            <div class="order-summary">
              <h2 class="summary-title">Resumo do Pedido</h2>
              
              <div class="summary-items">
                <div
                  v-for="item in cartItems"
                  :key="item._id"
                  class="summary-item"
                >
                  <div class="summary-item-image">
                    <img :src="item.productId.image" :alt="item.productId.name" />
                  </div>
                  <div class="summary-item-info">
                    <h4>{{ item.productId.name }}</h4>
                    <p>Qtd: {{ item.quantity }} x {{ formatCurrency(item.productId.price) }}</p>
                  </div>
                  <div class="summary-item-price">
                    {{ formatCurrency(item.productId.price * item.quantity) }}
                  </div>
                </div>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-totals">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>{{ formatCurrency(subtotal) }}</span>
                </div>
                <div class="summary-row">
                  <span>Frete</span>
                  <span class="shipping-free" v-if="subtotal >= 200">Grátis</span>
                  <span v-else>{{ formatCurrency(shipping) }}</span>
                </div>
                <div v-if="form.paymentMethod === 'pix'" class="summary-row discount">
                  <span>Desconto PIX (10%)</span>
                  <span>-{{ formatCurrency((subtotal + shipping) * 0.1) }}</span>
                </div>
                <div v-if="form.paymentMethod === 'debit' || form.paymentMethod === 'boleto'" class="summary-row discount">
                  <span>Desconto (5%)</span>
                  <span>-{{ formatCurrency((subtotal + shipping) * 0.05) }}</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-row summary-total">
                  <span>Total</span>
                  <span>{{ formatCurrency(total) }}</span>
                </div>
              </div>

              <div v-if="subtotal < 200" class="shipping-info">
                <p>💰 Faltam {{ formatCurrency(200 - subtotal) }} para frete grátis!</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { cartService } from '../services/api'
import { authService } from '../services/auth'
import { getSessionId } from '../utils/storage'
import { formatCurrency } from '../utils/formatters'
import { useToast } from '../composables/useToast'
import Loading from '../components/Loading.vue'

export default {
  name: 'Checkout',
  components: {
    Loading
  },
  setup() {
    const router = useRouter()
    const { showToast } = useToast()
    const cartItems = ref([])
    const loading = ref(true)
    const processing = ref(false)
    const isAuthenticated = computed(() => authService.isAuthenticated())
    const qrCodeCanvas = ref(null)
    const pixCodeInput = ref(null)
    const copiedPix = ref(false)
    const copiedBoleto = ref(false)

    const form = ref({
      fullName: '',
      email: '',
      phone: '',
      cep: '',
      address: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      paymentMethod: ''
    })

    const cardData = ref({
      number: '',
      name: '',
      expiry: '',
      cvv: '',
      installments: ''
    })

    const paymentMethods = [
      { value: 'credit', name: 'Cartão de Crédito', icon: '💳', description: 'Parcelamento em até 12x' },
      { value: 'debit', name: 'Cartão de Débito', icon: '💳', description: 'Desconto de 5%' },
      { value: 'pix', name: 'PIX', icon: '📱', description: 'Desconto de 10%' },
      { value: 'boleto', name: 'Boleto', icon: '📄', description: 'Desconto de 5%' }
    ]

    const generatePixCode = () => {
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 15)
      return `00020126580014BR.GOV.BCB.PIX0136${timestamp}${random}520400005303986540${total.value.toFixed(2)}5802BR5925VOLLOX COMERCIO LTDA6009SAO PAULO62070503***6304`
    }

    const pixCode = ref('')
    const boletoCode = ref('')
    const boletoDueDate = ref('')

    const generateBoletoCode = () => {
      const code = '34191' + Math.random().toString().substring(2, 6) + '1' + 
                  Math.random().toString().substring(2, 11) + '1' + 
                  Math.random().toString().substring(2, 12) + '1' + 
                  Math.random().toString().substring(2, 12)
      return code.match(/.{1,5}/g).join(' ')
    }

    const generateBoletoDueDate = () => {
      const date = new Date()
      date.setDate(date.getDate() + 3)
      return date.toLocaleDateString('pt-BR')
    }

    const generateQRCode = async () => {
      if (!qrCodeCanvas.value) return
      
      try {
        const QRCode = await import('qrcode')
        const canvas = qrCodeCanvas.value
        const code = pixCode.value || generatePixCode()
        
        await QRCode.default.toCanvas(canvas, code, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error)
        const canvas = qrCodeCanvas.value
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#f0f0f0'
        ctx.fillRect(0, 0, 200, 200)
        ctx.fillStyle = '#666'
        ctx.font = '14px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('QR Code', 100, 100)
      }
    }

    const loadCart = async () => {
      loading.value = true
      try {
        const sessionId = getSessionId()
        const response = await cartService.get(sessionId)
        cartItems.value = response.data || []
        
        if (cartItems.value.length > 0) {
          cartItems.value = cartItems.value.filter(item => item.productId && item.productId.name)
        }

        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          form.value.fullName = currentUser.name || ''
          form.value.email = currentUser.email || ''
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
        showToast('Erro ao carregar carrinho', 'error')
        cartItems.value = []
      } finally {
        loading.value = false
      }
    }

    const formatCep = (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8)
      }
      form.value.cep = value
    }

    const formatPhone = (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length > 11) value = value.substring(0, 11)
      if (value.length > 10) {
        value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`
      } else if (value.length > 6) {
        value = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`
      } else if (value.length > 2) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`
      } else if (value.length > 0) {
        value = `(${value}`
      }
      form.value.phone = value
    }

    const formatCardNumber = (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length > 16) value = value.substring(0, 16)
      value = value.match(/.{1,4}/g)?.join(' ') || value
      cardData.value.number = value
    }

    const formatExpiry = (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4)
      }
      cardData.value.expiry = value
    }

    const formatCvv = (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length > 4) value = value.substring(0, 4)
      cardData.value.cvv = value
    }

    const searchCep = async () => {
      const cep = form.value.cep.replace(/\D/g, '')
      if (cep.length !== 8) return

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()
        
        if (!data.erro) {
          form.value.address = data.logradouro || ''
          form.value.neighborhood = data.bairro || ''
          form.value.city = data.localidade || ''
          form.value.state = data.uf || ''
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }

    const onPaymentMethodChange = async () => {
      if (form.value.paymentMethod === 'pix') {
        pixCode.value = generatePixCode()
        await nextTick()
        await generateQRCode()
      } else if (form.value.paymentMethod === 'boleto') {
        boletoCode.value = generateBoletoCode()
        boletoDueDate.value = generateBoletoDueDate()
      }
    }

    const copyPixCode = async () => {
      try {
        await navigator.clipboard.writeText(pixCode.value)
        copiedPix.value = true
        showToast('Código PIX copiado!', 'success')
        setTimeout(() => {
          copiedPix.value = false
        }, 2000)
      } catch (error) {
        showToast('Erro ao copiar código', 'error')
      }
    }

    const copyBoletoCode = async () => {
      try {
        await navigator.clipboard.writeText(boletoCode.value.replace(/\s/g, ''))
        copiedBoleto.value = true
        showToast('Código de barras copiado!', 'success')
        setTimeout(() => {
          copiedBoleto.value = false
        }, 2000)
      } catch (error) {
        showToast('Erro ao copiar código', 'error')
      }
    }

    const downloadBoleto = () => {
      const boletoData = {
        valor: total.value,
        vencimento: boletoDueDate.value,
        codigo: boletoCode.value.replace(/\s/g, ''),
        beneficiario: 'VOLLOX COMERCIO LTDA',
        cnpj: '12.345.678/0001-90',
        endereco: 'Rua Exemplo, 123 - São Paulo/SP'
      }
      
      const blob = new Blob([JSON.stringify(boletoData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `boleto-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('Boleto baixado!', 'success')
    }

    const subtotal = computed(() => {
      return cartItems.value.reduce((sum, item) => {
        return sum + (item.productId.price * item.quantity)
      }, 0)
    })

    const shipping = computed(() => {
      return subtotal.value >= 200 ? 0 : 15.90
    })

    const total = computed(() => {
      let finalTotal = subtotal.value + shipping.value
      
      if (form.value.paymentMethod === 'pix') {
        finalTotal = finalTotal * 0.9
      } else if (form.value.paymentMethod === 'debit' || form.value.paymentMethod === 'boleto') {
        finalTotal = finalTotal * 0.95
      }
      
      return finalTotal
    })

    const canSubmit = computed(() => {
      if (!form.value.paymentMethod) return false
      
      if (form.value.paymentMethod === 'credit' || form.value.paymentMethod === 'debit') {
        return cardData.value.number.length >= 16 &&
               cardData.value.name.length >= 3 &&
               cardData.value.expiry.length === 5 &&
               cardData.value.cvv.length >= 3 &&
               (form.value.paymentMethod !== 'credit' || cardData.value.installments)
      }
      
      return true
    })

    const handleCheckout = async () => {
      if (!isAuthenticated.value) {
        showToast('Você precisa estar logado para finalizar a compra', 'error')
        router.push('/login')
        return
      }

      if (!canSubmit.value) {
        showToast('Preencha todos os campos obrigatórios', 'error')
        return
      }

      processing.value = true
      try {
        const orderData = {
          items: cartItems.value.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price
          })),
          shipping: {
            fullName: form.value.fullName,
            email: form.value.email,
            phone: form.value.phone,
            address: {
              cep: form.value.cep,
              street: form.value.address,
              number: form.value.number,
              complement: form.value.complement,
              neighborhood: form.value.neighborhood,
              city: form.value.city,
              state: form.value.state
            }
          },
          payment: {
            method: form.value.paymentMethod,
            ...(form.value.paymentMethod === 'credit' || form.value.paymentMethod === 'debit' ? {
              card: {
                number: cardData.value.number.replace(/\s/g, ''),
                name: cardData.value.name,
                expiry: cardData.value.expiry,
                cvv: cardData.value.cvv,
                installments: form.value.paymentMethod === 'credit' ? cardData.value.installments : 1
              }
            } : {}),
            ...(form.value.paymentMethod === 'pix' ? {
              pixCode: pixCode.value
            } : {}),
            ...(form.value.paymentMethod === 'boleto' ? {
              boletoCode: boletoCode.value.replace(/\s/g, ''),
              dueDate: boletoDueDate.value
            } : {})
          },
          subtotal: subtotal.value,
          shipping: shipping.value,
          total: total.value
        }

        showToast('Pedido realizado com sucesso!', 'success')
        
        const sessionId = getSessionId()
        await cartService.clear(sessionId)
        
        router.push({ name: 'OrderSuccess' })
      } catch (error) {
        console.error('Erro ao finalizar pedido:', error)
        showToast('Erro ao finalizar pedido. Tente novamente.', 'error')
      } finally {
        processing.value = false
      }
    }

    watch(() => form.value.paymentMethod, async () => {
      if (form.value.paymentMethod === 'pix') {
        await nextTick()
        await generateQRCode()
      }
    })

    onMounted(() => {
      if (!isAuthenticated.value) {
        loading.value = false
        return
      }
      loadCart()
    })

    return {
      cartItems,
      loading,
      processing,
      isAuthenticated,
      form,
      cardData,
      paymentMethods,
      subtotal,
      shipping,
      total,
      pixCode,
      boletoCode,
      boletoDueDate,
      qrCodeCanvas,
      pixCodeInput,
      copiedPix,
      copiedBoleto,
      canSubmit,
      searchCep,
      formatCep,
      formatPhone,
      formatCardNumber,
      formatExpiry,
      formatCvv,
      onPaymentMethodChange,
      copyPixCode,
      copyBoletoCode,
      downloadBoleto,
      handleCheckout,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.checkout-page {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
  background: #f8f9fa;
  width: 100%;
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.checkout-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.back-link:hover {
  color: #2563eb;
  transform: translateX(-4px);
}

.back-icon {
  width: 18px;
  height: 18px;
}

.auth-required {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0f2fe;
  max-width: 500px;
  width: 100%;
}

.auth-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.auth-card h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.auth-card p {
  color: #64748b;
  margin-bottom: 32px;
  font-size: 16px;
}

.auth-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.loading-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  border: 1px solid #e0f2fe;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.empty-cart h2 {
  font-size: 24px;
  color: #1e293b;
  margin-bottom: 12px;
}

.empty-cart p {
  color: #64748b;
  margin-bottom: 32px;
}

.checkout-content {
  width: 100%;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
}

.checkout-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.checkout-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0f2fe;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0f2fe;
}

.section-icon {
  font-size: 24px;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  font-weight: 600;
  color: #1e293b;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
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

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid #e0f2fe;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.payment-method:hover {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.payment-method.active {
  border-color: #60a5fa;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.2);
}

.payment-input {
  display: none;
}

.payment-content {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.payment-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  flex-shrink: 0;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.payment-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.payment-desc {
  font-size: 13px;
  color: #64748b;
}

.card-form {
  margin-top: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border: 2px solid #e0f2fe;
}

.card-form-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 20px 0;
}

.pix-payment {
  margin-top: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  border-radius: 12px;
  border: 2px solid #86efac;
}

.pix-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #059669;
  margin: 0 0 8px 0;
}

.pix-discount {
  color: #059669;
  font-weight: 600;
  font-size: 14px;
  margin: 0 0 20px 0;
}

.pix-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pix-qr-code {
  text-align: center;
}

.qr-code-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 2px solid #86efac;
}

.qr-code {
  max-width: 100%;
  height: auto;
}

.qr-code-text {
  color: #059669;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.pix-code {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pix-code label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.pix-code-input-wrapper {
  display: flex;
  gap: 8px;
}

.pix-code-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #86efac;
  border-radius: 10px;
  background: white;
  font-size: 13px;
  font-family: monospace;
  color: #1e293b;
}

.copy-btn {
  padding: 12px 20px;
  border: 2px solid #86efac;
  border-radius: 10px;
  background: #059669;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.copy-btn:hover {
  background: #047857;
  border-color: #047857;
}

.pix-expiry {
  color: #64748b;
  font-size: 12px;
  margin: 0;
}

.boleto-payment {
  margin-top: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #fef3c7 0%, #ffffff 100%);
  border-radius: 12px;
  border: 2px solid #fcd34d;
}

.boleto-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #d97706;
  margin: 0 0 8px 0;
}

.boleto-discount {
  color: #d97706;
  font-weight: 600;
  font-size: 14px;
  margin: 0 0 20px 0;
}

.boleto-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.boleto-preview {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 2px solid #fcd34d;
}

.boleto-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.boleto-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #fef3c7;
}

.boleto-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.boleto-value {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.boleto-code {
  font-size: 14px;
  font-family: monospace;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: 2px;
}

.boleto-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.boleto-warning {
  color: #d97706;
  font-size: 12px;
  margin: 0;
  padding: 12px;
  background: #fef3c7;
  border-radius: 8px;
}

.form-actions {
  margin-top: 8px;
}

.btn-large {
  width: 100%;
  padding: 18px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
}

.btn-outline {
  padding: 10px 20px;
  border: 2px solid #fcd34d;
  border-radius: 10px;
  background: white;
  color: #d97706;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: #fef3c7;
  transform: translateY(-1px);
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.checkout-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.order-summary {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0f2fe;
}

.summary-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0f2fe;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  max-height: 400px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.summary-item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  flex-shrink: 0;
}

.summary-item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}

.summary-item-info {
  flex: 1;
  min-width: 0;
}

.summary-item-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-item-info p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.summary-item-price {
  font-size: 15px;
  font-weight: 700;
  color: #3b82f6;
  white-space: nowrap;
}

.summary-divider {
  height: 1px;
  background: #e0f2fe;
  margin: 16px 0;
}

.summary-totals {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #475569;
}

.summary-row.discount {
  color: #059669;
  font-weight: 600;
}

.summary-row.summary-total {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  padding-top: 12px;
}

.shipping-free {
  color: #10b981;
  font-weight: 600;
}

.shipping-info {
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 10px;
  border: 1px solid #bfdbfe;
}

.shipping-info p {
  font-size: 13px;
  color: #3b82f6;
  font-weight: 600;
  margin: 0;
  text-align: center;
}

@media (max-width: 968px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-sidebar {
    position: static;
    order: -1;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .pix-content {
    flex-direction: column;
  }

  .boleto-actions {
    flex-direction: column;
  }

  .boleto-actions .btn-outline {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .checkout-page {
    padding: 20px 0;
  }

  .checkout-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .checkout-header h1 {
    font-size: 24px;
  }

  .checkout-section {
    padding: 24px 20px;
  }

  .section-title {
    font-size: 18px;
  }

  .form-input {
    padding: 12px 14px;
    font-size: 14px;
  }

  .payment-method {
    padding: 14px;
  }

  .payment-icon {
    font-size: 28px;
    width: 44px;
    height: 44px;
  }

  .card-form,
  .pix-payment,
  .boleto-payment {
    padding: 20px;
  }

  .order-summary {
    padding: 20px;
  }
}
</style>
