<template>
  <div class="faq-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Perguntas Frequentes</h1>
        <p class="page-subtitle">Encontre respostas para as dúvidas mais comuns</p>
      </div>

      <div class="faq-wrapper">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="faq-item"
          :class="{ active: activeIndex === index }"
        >
          <button 
            class="faq-question"
            @click="toggleFaq(index)"
          >
            <span class="faq-icon">{{ faq.icon }}</span>
            <span class="faq-text">{{ faq.question }}</span>
            <span class="faq-arrow">{{ activeIndex === index ? '▲' : '▼' }}</span>
          </button>
          <div class="faq-answer" v-show="activeIndex === index">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <div class="faq-footer">
        <p>Não encontrou a resposta que procurava?</p>
        <router-link to="/contact" class="contact-link">
          Entre em contato conosco
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'FAQ',
  setup() {
    const activeIndex = ref(null)

    const faqs = [
      {
        icon: '🛒',
        question: 'Como faço um pedido?',
        answer: 'Navegue pelos produtos, adicione os itens desejados ao carrinho, clique em "Finalizar Compra" e preencha os dados de entrega e pagamento. Você receberá um e-mail de confirmação após a conclusão do pedido.'
      },
      {
        icon: '💳',
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Aceitamos cartão de crédito (Visa, Mastercard, Elo, Amex), PIX (com desconto) e boleto bancário. Todos os pagamentos são processados de forma segura através de nossos parceiros certificados.'
      },
      {
        icon: '🚚',
        question: 'Qual o prazo de entrega?',
        answer: 'O prazo de entrega varia conforme a região e o tipo de produto. Geralmente, entregas em capitais levam de 3 a 7 dias úteis, e no interior de 7 a 15 dias úteis. Você receberá um código de rastreamento por e-mail.'
      },
      {
        icon: '💰',
        question: 'Há frete grátis?',
        answer: 'Sim! Oferecemos frete grátis para compras acima de R$ 200 em todo o Brasil. Para compras abaixo desse valor, o frete é calculado automaticamente no carrinho de compras.'
      },
      {
        icon: '↩️',
        question: 'Como faço para trocar ou devolver um produto?',
        answer: 'Você tem até 30 dias após o recebimento para solicitar troca ou devolução. Acesse "Meus Pedidos" no seu perfil, selecione o pedido e clique em "Solicitar Troca/Devolução". O produto deve estar em perfeito estado, com etiquetas e embalagem original.'
      },
      {
        icon: '🔒',
        question: 'Meus dados estão seguros?',
        answer: 'Sim! Utilizamos criptografia SSL/TLS para proteger todas as informações transmitidas. Seus dados pessoais e de pagamento são armazenados de forma segura e nunca são compartilhados com terceiros sem sua autorização.'
      },
      {
        icon: '📦',
        question: 'Posso rastrear meu pedido?',
        answer: 'Sim! Após a confirmação do pagamento, você receberá um código de rastreamento por e-mail e SMS. Você também pode acompanhar o status do pedido na área "Meus Pedidos" do seu perfil.'
      },
      {
        icon: '🎁',
        question: 'Como me torno um fornecedor?',
        answer: 'Acesse seu perfil e clique na aba "Fornecedor". Preencha o formulário de cadastro com seus dados e informações da empresa. Após a aprovação, você poderá cadastrar e gerenciar seus produtos na plataforma.'
      },
      {
        icon: '💬',
        question: 'Como entro em contato com o suporte?',
        answer: 'Você pode entrar em contato conosco através do formulário na página "Entre em Contato", pelo e-mail contato@vollox.com ou pelo telefone (11) 9999-9999. Nosso atendimento funciona de segunda a sexta, das 9h às 18h.'
      },
      {
        icon: '🔐',
        question: 'Esqueci minha senha. Como recupero?',
        answer: 'Na página de login, clique em "Esqueci minha senha". Você receberá um e-mail com instruções para redefinir sua senha. Se não receber o e-mail, verifique sua caixa de spam ou entre em contato conosco.'
      },
      {
        icon: '📱',
        question: 'O site é seguro para comprar?',
        answer: 'Sim! Utilizamos certificado SSL e todas as transações são processadas por gateways de pagamento seguros e certificados. Além disso, seguimos todas as normas de proteção de dados (LGPD) para garantir sua segurança.'
      },
      {
        icon: '⭐',
        question: 'Como funcionam as avaliações de produtos?',
        answer: 'Após receber e avaliar seu pedido, você pode deixar uma avaliação e comentário sobre o produto na página do produto. Sua avaliação ajuda outros clientes a fazerem escolhas informadas.'
      }
    ]

    const toggleFaq = (index) => {
      activeIndex.value = activeIndex.value === index ? null : index
    }

    return {
      faqs,
      activeIndex,
      toggleFaq
    }
  }
}
</script>

<style scoped>
.faq-page {
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
}

.faq-wrapper {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.faq-item.active {
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
  border: 2px solid #3b82f6;
}

.faq-question {
  width: 100%;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
}

.faq-question:hover {
  background: #f8f9fa;
}

.faq-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.faq-text {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.faq-arrow {
  font-size: 14px;
  color: #3b82f6;
  transition: transform 0.3s ease;
}

.faq-answer {
  padding: 0 24px 24px 24px;
  margin-left: 40px;
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.faq-answer p {
  font-size: 16px;
  line-height: 1.8;
  color: #475569;
  margin: 0;
}

.faq-footer {
  max-width: 900px;
  margin: 50px auto 0;
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.faq-footer p {
  font-size: 18px;
  color: #64748b;
  margin-bottom: 20px;
}

.contact-link {
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.contact-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

@media (max-width: 768px) {
  .faq-page {
    padding: 20px 0 40px;
  }

  .page-header {
    padding: 30px 20px;
    margin-bottom: 30px;
  }

  .page-title {
    font-size: 32px;
  }

  .faq-question {
    padding: 20px;
    gap: 12px;
  }

  .faq-icon {
    font-size: 20px;
  }

  .faq-text {
    font-size: 16px;
  }

  .faq-answer {
    margin-left: 32px;
    padding: 0 20px 20px 20px;
    padding-top: 16px;
  }

  .faq-answer p {
    font-size: 15px;
  }

  .faq-footer {
    padding: 30px 20px;
    margin-top: 30px;
  }
}
</style>

