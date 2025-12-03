<template>
  <div class="contact-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Entre em Contato</h1>
        <p class="page-subtitle">Estamos aqui para ajudar! Envie sua mensagem e responderemos o mais breve possível.</p>
      </div>

      <div class="contact-wrapper">
        <div class="contact-info-section">
          <div class="info-card">
            <div class="info-icon">📧</div>
            <h3>Email</h3>
            <p>contato@vollox.com</p>
            <p>suporte@vollox.com</p>
          </div>

          <div class="info-card">
            <div class="info-icon">📞</div>
            <h3>Telefone</h3>
            <p>(11) 9999-9999</p>
            <p>Segunda a Sexta, 9h às 18h</p>
          </div>

          <div class="info-card">
            <div class="info-icon">📍</div>
            <h3>Endereço</h3>
            <p>São Paulo, SP</p>
            <p>Brasil</p>
          </div>

          <div class="info-card">
            <div class="info-icon">⏰</div>
            <h3>Horário de Atendimento</h3>
            <p>Segunda a Sexta: 9h às 18h</p>
            <p>Sábado: 9h às 13h</p>
          </div>
        </div>

        <div class="contact-form-section">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label for="name">Nome Completo *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                placeholder="Seu nome completo"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="seu@email.com"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="phone">Telefone</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="(11) 99999-9999"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="subject">Assunto *</label>
              <select
                id="subject"
                v-model="form.subject"
                required
                class="form-input"
              >
                <option value="">Selecione um assunto</option>
                <option value="pedido">Dúvida sobre Pedido</option>
                <option value="produto">Dúvida sobre Produto</option>
                <option value="entrega">Dúvida sobre Entrega</option>
                <option value="pagamento">Dúvida sobre Pagamento</option>
                <option value="troca">Troca ou Devolução</option>
                <option value="fornecedor">Tornar-se Fornecedor</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">Mensagem *</label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="6"
                placeholder="Descreva sua dúvida ou solicitação..."
                class="form-input form-textarea"
              ></textarea>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="!loading">Enviar Mensagem</span>
              <span v-else class="loading-spinner"></span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useToast } from '../composables/useToast'
import { authService } from '../services/auth'

export default {
  name: 'Contact',
  setup() {
    const { showToast } = useToast()
    const loading = ref(false)
    const form = ref({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })

    const user = authService.getCurrentUser()
    if (user) {
      form.value.name = user.name || ''
      form.value.email = user.email || ''
    }

    const handleSubmit = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success')
        form.value = {
          name: user?.name || '',
          email: user?.email || '',
          phone: '',
          subject: '',
          message: ''
        }
      } catch (error) {
        showToast('Erro ao enviar mensagem. Tente novamente.', 'error')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.contact-page {
  padding: 40px 0 80px;
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 42px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 18px;
  color: #64748b;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.contact-wrapper {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.info-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.info-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 12px;
}

.info-card p {
  font-size: 15px;
  color: #64748b;
  margin: 8px 0;
  line-height: 1.6;
}

.contact-form-section {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.form-input {
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #2d3748;
  transition: all 0.3s ease;
  background: #f8f9fa;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.submit-btn {
  padding: 16px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 968px) {
  .contact-wrapper {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .contact-info-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 640px) {
  .contact-page {
    padding: 20px 0 40px;
  }

  .page-header {
    padding: 30px 20px;
    margin-bottom: 30px;
  }

  .page-title {
    font-size: 32px;
  }

  .contact-form-section {
    padding: 30px 20px;
  }

  .contact-info-section {
    grid-template-columns: 1fr;
  }

  .info-card {
    padding: 24px;
  }
}
</style>

