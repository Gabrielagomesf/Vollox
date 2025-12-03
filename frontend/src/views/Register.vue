<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-left">
        <div class="auth-content">
          <h2>Olá, amigo!</h2>
          <p>Preencha seus dados pessoais e comece sua jornada conosco</p>
          <router-link to="/login" class="auth-toggle-btn">
            Entrar
          </router-link>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-form-wrapper">
          <h1>Criar Conta</h1>
          <form @submit.prevent="handleRegister" class="auth-form">
            <div class="form-group">
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Nome"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <span class="input-icon">📧</span>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Email"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="Senha"
                  required
                  minlength="6"
                  class="form-input"
                />
              </div>
              <div v-if="form.password && form.password.length < 6" class="password-hint">
                Mínimo 6 caracteres
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <span class="input-icon">🔐</span>
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="Confirmar Senha"
                  required
                  class="form-input"
                  :class="{ 'input-error': form.password && form.confirmPassword && form.password !== form.confirmPassword }"
                />
              </div>
            </div>

            <div v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword" class="error-message">
              <span class="error-icon">⚠️</span>
              As senhas não coincidem
            </div>

            <button 
              type="submit" 
              class="btn-submit" 
              :disabled="loading || form.password !== form.confirmPassword || form.password.length < 6"
            >
              <span v-if="!loading">CRIAR CONTA</span>
              <span v-else class="loading-spinner-small"></span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'
import { useToast } from '../composables/useToast'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const { showToast } = useToast()
    const loading = ref(false)
    const form = ref({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const handleRegister = async () => {
      if (form.value.password !== form.value.confirmPassword) {
        showToast('As senhas não coincidem', 'error')
        return
      }

      if (form.value.password.length < 6) {
        showToast('A senha deve ter no mínimo 6 caracteres', 'error')
        return
      }

      loading.value = true
      try {
        await authService.register(
          form.value.name,
          form.value.email,
          form.value.password
        )
        window.dispatchEvent(new Event('auth-changed'))
        showToast('Conta criada com sucesso!', 'success')
        setTimeout(() => {
          router.push('/')
        }, 100)
      } catch (error) {
        const message = error.response?.data?.error || 'Erro ao criar conta'
        showToast(message, 'error')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 0;
}

.auth-container {
  display: flex;
  width: 100%;
  max-width: 900px;
  min-height: 500px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.auth-left {
  flex: 1;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  color: white;
  position: relative;
  overflow: hidden;
}

.auth-left::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse 15s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

.auth-content {
  text-align: center;
  z-index: 1;
  position: relative;
}

.auth-content h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.auth-content p {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.95;
}

.auth-toggle-btn {
  display: inline-block;
  padding: 14px 40px;
  background: transparent;
  border: 2px solid white;
  border-radius: 30px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.auth-toggle-btn:hover {
  background: white;
  color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.auth-right {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 50px;
  background: white;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 400px;
}

.auth-form-wrapper h1 {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 40px;
  letter-spacing: -0.5px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  width: 100%;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 20px;
  z-index: 1;
  color: #a0aec0;
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 50px;
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
  border-color: #60a5fa;
  background: white;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
}

.input-error {
  border-color: #feb2b2 !important;
  background: #fef2f2 !important;
}

.input-error:focus {
  box-shadow: 0 0 0 4px rgba(254, 178, 178, 0.1) !important;
}

.password-hint {
  font-size: 12px;
  color: #f59e0b;
  margin-top: 6px;
  padding-left: 4px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #c53030;
  font-size: 14px;
  padding: 12px 16px;
  background: #fef2f2;
  border-radius: 12px;
  border: 1px solid #fecaca;
  animation: shake 0.3s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-icon {
  font-size: 18px;
}

.btn-submit {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

@media (max-width: 968px) {
  .auth-container {
    flex-direction: column;
    max-width: 500px;
  }

  .auth-left {
    padding: 40px 30px;
    min-height: 200px;
  }

  .auth-content h2 {
    font-size: 28px;
  }

  .auth-content p {
    font-size: 14px;
    margin-bottom: 30px;
  }

  .auth-right {
    padding: 40px 30px;
  }
}

@media (max-width: 640px) {
  .auth-page {
    padding: 0;
  }

  .auth-container {
    border-radius: 0;
    min-height: 100vh;
  }

  .auth-left {
    padding: 30px 20px;
    min-height: 180px;
  }

  .auth-content h2 {
    font-size: 24px;
    margin-bottom: 16px;
  }

  .auth-content p {
    font-size: 13px;
    margin-bottom: 24px;
  }

  .auth-toggle-btn {
    padding: 12px 32px;
    font-size: 13px;
  }

  .auth-right {
    padding: 30px 20px;
  }

  .auth-form-wrapper h1 {
    font-size: 28px;
    margin-bottom: 30px;
  }

  .form-input {
    padding: 14px 14px 14px 46px;
    font-size: 14px;
  }

  .btn-submit {
    padding: 14px;
    font-size: 13px;
  }

  .error-message {
    padding: 10px 14px;
    font-size: 13px;
  }
}
</style>
