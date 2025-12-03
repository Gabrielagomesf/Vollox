<template>
  <div class="privacy-policy-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Política de Privacidade</h1>
        <p class="page-subtitle">Última atualização: {{ lastUpdate }}</p>
      </div>

      <div class="content-wrapper">
        <div class="content-section">
          <h2>1. Informações que Coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente, incluindo:
          </p>
          <ul>
            <li>Nome completo</li>
            <li>Endereço de e-mail</li>
            <li>Número de telefone</li>
            <li>Endereço de entrega</li>
            <li>Informações de pagamento (processadas de forma segura)</li>
            <li>Dados bancários (quando você se torna fornecedor)</li>
          </ul>
        </div>

        <div class="content-section">
          <h2>2. Como Usamos suas Informações</h2>
          <p>Utilizamos suas informações para:</p>
          <ul>
            <li>Processar e entregar seus pedidos</li>
            <li>Comunicar-nos com você sobre seus pedidos</li>
            <li>Melhorar nossos serviços e experiência do usuário</li>
            <li>Enviar comunicações de marketing (com seu consentimento)</li>
            <li>Prevenir fraudes e garantir a segurança</li>
            <li>Cumprir obrigações legais</li>
          </ul>
        </div>

        <div class="content-section">
          <h2>3. Compartilhamento de Informações</h2>
          <p>
            Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas com:
          </p>
          <ul>
            <li>Prestadores de serviços que nos ajudam a operar (processamento de pagamentos, entrega)</li>
            <li>Autoridades legais quando exigido por lei</li>
            <li>Fornecedores parceiros (apenas informações necessárias para entrega)</li>
          </ul>
        </div>

        <div class="content-section">
          <h2>4. Segurança dos Dados</h2>
          <p>
            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
          </p>
          <ul>
            <li>Criptografia SSL/TLS para transmissão de dados</li>
            <li>Armazenamento seguro de informações sensíveis</li>
            <li>Acesso restrito a dados pessoais</li>
            <li>Monitoramento regular de segurança</li>
          </ul>
        </div>

        <div class="content-section">
          <h2>5. Seus Direitos</h2>
          <p>Você tem o direito de:</p>
          <ul>
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir informações incorretas</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Retirar seu consentimento a qualquer momento</li>
            <li>Objetar ao processamento de seus dados</li>
            <li>Solicitar portabilidade de dados</li>
          </ul>
        </div>

        <div class="content-section">
          <h2>6. Cookies e Tecnologias Similares</h2>
          <p>
            Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do site e personalizar conteúdo. Você pode gerenciar suas preferências de cookies nas configurações do navegador.
          </p>
        </div>

        <div class="content-section">
          <h2>7. Retenção de Dados</h2>
          <p>
            Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
          </p>
        </div>

        <div class="content-section">
          <h2>8. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas publicando a nova política nesta página e atualizando a data de "Última atualização".
          </p>
        </div>

        <div class="content-section">
          <h2>9. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos suas informações pessoais, entre em contato conosco:
          </p>
          <div class="contact-info">
            <p><strong>Email:</strong> privacidade@vollox.com</p>
            <p><strong>Telefone:</strong> (11) 9999-9999</p>
            <p><strong>Endereço:</strong> São Paulo, SP, Brasil</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy',
  setup() {
    const lastUpdate = new Date().toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return {
      lastUpdate
    }
  }
}
</script>

<style scoped>
.privacy-policy-page {
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
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  padding: 50px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.content-section {
  margin-bottom: 40px;
}

.content-section:last-child {
  margin-bottom: 0;
}

.content-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0f2fe;
}

.content-section p {
  font-size: 16px;
  line-height: 1.8;
  color: #475569;
  margin-bottom: 16px;
}

.content-section ul {
  margin: 16px 0;
  padding-left: 24px;
}

.content-section li {
  font-size: 16px;
  line-height: 1.8;
  color: #475569;
  margin-bottom: 12px;
}

.contact-info {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  margin-top: 20px;
  border-left: 4px solid #3b82f6;
}

.contact-info p {
  margin-bottom: 12px;
  font-size: 16px;
  color: #475569;
}

.contact-info strong {
  color: #1e40af;
}

@media (max-width: 768px) {
  .privacy-policy-page {
    padding: 20px 0 40px;
  }

  .page-header {
    padding: 30px 20px;
    margin-bottom: 30px;
  }

  .page-title {
    font-size: 32px;
  }

  .content-wrapper {
    padding: 30px 20px;
  }

  .content-section h2 {
    font-size: 24px;
  }

  .content-section p,
  .content-section li {
    font-size: 15px;
  }
}
</style>

