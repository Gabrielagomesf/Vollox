<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <span class="footer-logo-icon">🛍️</span>
            <h3 class="footer-logo-text">Vollox</h3>
          </div>
          <p class="footer-description">
            Sua loja online favorita com os melhores produtos e preços incríveis!
          </p>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Links Rápidos</h4>
          <nav class="footer-nav">
            <router-link to="/" class="footer-link">Início</router-link>
            <router-link to="/products" class="footer-link">Produtos</router-link>
            <router-link to="/cart" class="footer-link">Carrinho</router-link>
            <router-link to="/faq" class="footer-link">FAQ</router-link>
            <router-link to="/contact" class="footer-link">Contato</router-link>
          </nav>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Segurança</h4>
          <nav class="footer-nav">
            <router-link to="/privacy" class="footer-link">Política de Privacidade</router-link>
            <a href="#" class="footer-link">Termos de Uso</a>
            <a href="#" class="footer-link">LGPD</a>
          </nav>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Contato</h4>
          <div class="footer-contact">
            <p class="footer-contact-item">
              <span class="contact-icon">✉️</span>
              contato@vollox.com
            </p>
            <p class="footer-contact-item">
              <span class="contact-icon">📞</span>
              (11) 9999-9999
            </p>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">
          &copy; 2024 Vollox. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(to bottom, #f8faff 0%, #eff6ff 100%);
  color: #4a5568;
  padding: 60px 0 24px;
  margin-top: 80px;
  border-top: 2px solid #e0f2fe;
  position: relative;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, #60a5fa, transparent);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid #dbeafe;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.footer-logo-icon {
  font-size: 32px;
  line-height: 1;
}

.footer-logo-text {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.footer-description {
  color: #718096;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  max-width: 300px;
}

.footer-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 20px 0;
  letter-spacing: -0.3px;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-link {
  color: #64748b;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
}

.footer-link::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 2px;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: #3b82f6;
  transform: translateX(4px);
}

.footer-link:hover::before {
  width: 6px;
}

.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
  font-size: 15px;
  margin: 0;
  transition: all 0.3s ease;
}

.footer-contact-item:hover {
  color: #3b82f6;
  transform: translateX(4px);
}

.contact-icon {
  font-size: 18px;
  line-height: 1;
  transition: transform 0.3s ease;
}

.footer-contact-item:hover .contact-icon {
  transform: scale(1.1);
}

.footer-bottom {
  text-align: center;
  padding-top: 24px;
}

.footer-copyright {
  color: #94a3b8;
  font-size: 14px;
  margin: 0;
  font-weight: 500;
}

@media (max-width: 968px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .footer-section:first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 1200px) {
  .footer-content {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .footer {
    padding: 40px 0 20px;
    margin-top: 60px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-bottom: 32px;
    padding-bottom: 32px;
  }

  .footer-description {
    max-width: 100%;
  }

  .footer-title {
    font-size: 16px;
  }

  .footer-nav {
    gap: 10px;
  }

  .footer-contact {
    gap: 12px;
  }
}
</style>
