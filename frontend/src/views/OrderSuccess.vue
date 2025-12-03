<template>
  <div class="order-success-page">
    <div class="container">
      <div class="success-content">
        <div class="success-icon-wrapper">
          <div class="success-icon">✓</div>
        </div>
        <h1>Pedido Realizado com Sucesso!</h1>
        <p class="success-message">Obrigado pela sua compra. Seu pedido foi recebido e está sendo processado.</p>
        
        <div class="success-actions">
          <router-link to="/products" class="btn btn-primary">
            Continuar Comprando
          </router-link>
          <router-link to="/" class="btn btn-secondary">
            Voltar ao Início
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSuccess'
}
</script>

<style scoped>
.order-success-page {
  padding: 60px 0;
  min-height: calc(100vh - 200px);
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-content {
  text-align: center;
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0f2fe;
  max-width: 600px;
  width: 100%;
}

.success-icon-wrapper {
  margin-bottom: 32px;
}

.success-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-content h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.success-message {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 40px;
  line-height: 1.6;
}

.success-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .order-success-page {
    padding: 40px 0;
  }

  .success-content {
    padding: 40px 24px;
  }

  .success-content h1 {
    font-size: 24px;
  }

  .success-icon {
    width: 80px;
    height: 80px;
    font-size: 48px;
  }

  .success-actions {
    flex-direction: column;
  }

  .success-actions .btn {
    width: 100%;
  }
}
</style>

