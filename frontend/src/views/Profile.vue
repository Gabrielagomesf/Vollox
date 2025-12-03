<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-header">
        <div class="header-content">
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações pessoais e preferências</p>
        </div>
      </div>

      <div v-if="!isAuthenticated" class="auth-required">
        <div class="auth-card">
          <div class="auth-icon">🔒</div>
          <h2>Acesso Restrito</h2>
          <p>Você precisa estar logado para acessar seu perfil</p>
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

      <div v-else class="profile-content">
        <div class="profile-layout">
          <aside class="profile-sidebar">
            <div class="profile-card">
              <div class="profile-avatar-wrapper">
                <div class="profile-avatar">
                  <span>{{ userInitials }}</span>
                </div>
                <div class="avatar-ring"></div>
              </div>
              <h2 class="profile-name">{{ userName }}</h2>
              <p class="profile-email">{{ userEmail }}</p>
              <div v-if="isSupplier" class="supplier-badge">
                <span class="badge-icon">🏪</span>
                <span class="badge-text">Fornecedor</span>
              </div>
              <div class="profile-stats">
                <div class="stat-item">
                  <div class="stat-icon">📦</div>
                  <div class="stat-content">
                    <span class="stat-value">{{ orderCount }}</span>
                    <span class="stat-label">Pedidos</span>
                  </div>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <div class="stat-icon">❤️</div>
                  <div class="stat-content">
                    <span class="stat-value">{{ favoriteCount }}</span>
                    <span class="stat-label">Favoritos</span>
                  </div>
                </div>
              </div>
            </div>

            <nav class="profile-nav">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="nav-item"
                :class="{ active: activeTab === tab.id }"
              >
                <span class="nav-icon">{{ tab.icon }}</span>
                <span class="nav-text">{{ tab.label }}</span>
                <span v-if="activeTab === tab.id" class="nav-indicator"></span>
              </button>
            </nav>
          </aside>

          <main class="profile-main">
            <div v-if="activeTab === 'info'" class="profile-section">
              <div class="section-header">
                <div class="section-title-wrapper">
                  <span class="section-icon">👤</span>
                  <h2>Informações Pessoais</h2>
                </div>
                <button @click="editMode = !editMode" class="edit-btn" :class="{ active: editMode }">
                  <span v-if="!editMode">✏️</span>
                  <span>{{ editMode ? 'Cancelar' : 'Editar' }}</span>
                </button>
              </div>

              <form @submit.prevent="updateProfile" class="profile-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="name">
                      <span class="label-icon">👤</span>
                      Nome Completo
                    </label>
                    <input
                      id="name"
                      v-model="profileForm.name"
                      type="text"
                      :disabled="!editMode"
                      class="form-input"
                      :class="{ 'editing': editMode }"
                      required
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="email">
                      <span class="label-icon">✉️</span>
                      Email
                    </label>
                    <input
                      id="email"
                      v-model="profileForm.email"
                      type="email"
                      :disabled="!editMode"
                      class="form-input"
                      :class="{ 'editing': editMode }"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="phone">
                      <span class="label-icon">📱</span>
                      Telefone
                    </label>
                    <input
                      id="phone"
                      v-model="profileForm.phone"
                      type="tel"
                      :disabled="!editMode"
                      placeholder="(11) 99999-9999"
                      class="form-input"
                      :class="{ 'editing': editMode }"
                    />
                  </div>
                </div>

                <div v-if="editMode" class="form-actions">
                  <button type="submit" class="btn btn-primary btn-large" :disabled="saving">
                    <span v-if="!saving">💾 Salvar Alterações</span>
                    <span v-else class="loading-spinner-small"></span>
                  </button>
                </div>
              </form>
            </div>

            <div v-if="activeTab === 'address'" class="profile-section">
              <div class="section-header">
                <div class="section-title-wrapper">
                  <span class="section-icon">📍</span>
                  <h2>Endereços</h2>
                </div>
                <button @click="showAddAddress = true" class="btn btn-primary btn-small">
                  <span>➕</span>
                  <span>Adicionar Endereço</span>
                </button>
              </div>

              <div v-if="addresses.length === 0" class="empty-state">
                <div class="empty-icon">📍</div>
                <h3>Nenhum endereço cadastrado</h3>
                <p>Adicione um endereço para facilitar suas compras</p>
                <button @click="showAddAddress = true" class="btn btn-primary">
                  Adicionar Primeiro Endereço
                </button>
              </div>

              <div v-else class="addresses-list">
                <div
                  v-for="address in addresses"
                  :key="address.id"
                  class="address-card"
                >
                  <div class="address-header">
                    <h3>{{ address.label }}</h3>
                    <div class="address-actions">
                      <button @click="editAddress(address)" class="action-btn edit">
                        <span>✏️</span>
                      </button>
                      <button @click="deleteAddress(address.id)" class="action-btn delete">
                        <span>🗑️</span>
                      </button>
                    </div>
                  </div>
                  <div class="address-content">
                    <p><span class="address-label">Endereço:</span> {{ address.street }}, {{ address.number }}</p>
                    <p v-if="address.complement"><span class="address-label">Complemento:</span> {{ address.complement }}</p>
                    <p><span class="address-label">Bairro:</span> {{ address.neighborhood }}</p>
                    <p><span class="address-label">Cidade:</span> {{ address.city }} - {{ address.state }}</p>
                    <p><span class="address-label">CEP:</span> {{ address.cep }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'orders'" class="profile-section">
              <div class="section-header">
                <div class="section-title-wrapper">
                  <span class="section-icon">📦</span>
                  <h2>Meus Pedidos</h2>
                </div>
              </div>

              <div v-if="orders.length === 0" class="empty-state">
                <div class="empty-icon">📦</div>
                <h3>Você ainda não realizou nenhum pedido</h3>
                <p>Explore nossos produtos e faça seu primeiro pedido</p>
                <router-link to="/products" class="btn btn-primary">
                  Ver Produtos
                </router-link>
              </div>

              <div v-else class="orders-list">
                <div
                  v-for="order in orders"
                  :key="order.id"
                  class="order-card"
                >
                  <div class="order-header">
                    <div class="order-info">
                      <h3>Pedido #{{ order.id }}</h3>
                      <p class="order-date">{{ formatDate(order.date) }}</p>
                    </div>
                    <span class="order-status" :class="order.status">
                      {{ order.statusText }}
                    </span>
                  </div>
                  <div class="order-items">
                    <div
                      v-for="item in order.items"
                      :key="item.id"
                      class="order-item"
                    >
                      <img :src="item.image" :alt="item.name" class="order-item-image" />
                      <div class="order-item-info">
                        <h4>{{ item.name }}</h4>
                        <p>Qtd: {{ item.quantity }} x {{ formatCurrency(item.price) }}</p>
                      </div>
                      <span class="order-item-total">{{ formatCurrency(item.price * item.quantity) }}</span>
                    </div>
                  </div>
                  <div class="order-footer">
                    <div class="order-total">
                      <span>Total:</span>
                      <span class="total-value">{{ formatCurrency(order.total) }}</span>
                    </div>
                    <button @click="viewOrder(order.id)" class="btn btn-outline">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'banking'" class="profile-section">
              <div class="section-header">
                <div class="section-title-wrapper">
                  <span class="section-icon">🏦</span>
                  <h2>Dados Bancários</h2>
                </div>
                <button v-if="bankingData" @click="editBankingMode = !editBankingMode" class="edit-btn" :class="{ active: editBankingMode }">
                  <span v-if="!editBankingMode">✏️</span>
                  <span>{{ editBankingMode ? 'Cancelar' : 'Editar' }}</span>
                </button>
              </div>

              <div v-if="!bankingData && !editBankingMode" class="empty-state">
                <div class="empty-icon">🏦</div>
                <h3>Nenhum dado bancário cadastrado</h3>
                <p>Cadastre seus dados bancários para receber pagamentos e fazer saques</p>
                <button @click="editBankingMode = true" class="btn btn-primary">
                  Cadastrar Dados Bancários
                </button>
              </div>

              <div v-else-if="bankingData && !editBankingMode" class="banking-display">
                <div class="banking-card">
                  <div class="banking-header">
                    <div class="banking-icon">🏦</div>
                    <div class="banking-info">
                      <h3>{{ bankingData.bankName }}</h3>
                      <p class="banking-type">{{ bankingData.accountType === 'checking' ? 'Conta Corrente' : 'Conta Poupança' }}</p>
                    </div>
                  </div>
                  <div class="banking-details">
                    <div class="detail-row">
                      <span class="detail-label">Agência:</span>
                      <span class="detail-value">{{ bankingData.agency }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Conta:</span>
                      <span class="detail-value">{{ bankingData.account }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Titular:</span>
                      <span class="detail-value">{{ bankingData.accountHolder }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">CPF/CNPJ:</span>
                      <span class="detail-value">{{ formatCpfCnpj(bankingData.cpfCnpj) }}</span>
                    </div>
                    <div v-if="bankingData.pixKeys && bankingData.pixKeys.length > 0" class="detail-row">
                      <span class="detail-label">Chaves PIX:</span>
                      <div class="pix-keys-display">
                        <div v-for="(pixKey, index) in bankingData.pixKeys" :key="index" class="pix-key-item">
                          <span class="pix-key-type">{{ getPixTypeLabel(pixKey.type) }}:</span>
                          <span class="pix-key-value">{{ pixKey.value }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <form v-else @submit.prevent="saveBankingData" class="banking-form">
                <div class="form-row">
                  <div class="form-group form-group-large">
                    <label for="bankName">Nome do Banco *</label>
                    <select
                      id="bankName"
                      v-model="bankingForm.bankName"
                      class="form-input"
                      required
                    >
                      <option value="">Selecione o banco</option>
                      <option value="Banco do Brasil">Banco do Brasil</option>
                      <option value="Bradesco">Bradesco</option>
                      <option value="Itaú">Itaú</option>
                      <option value="Santander">Santander</option>
                      <option value="Caixa Econômica Federal">Caixa Econômica Federal</option>
                      <option value="Banco Inter">Banco Inter</option>
                      <option value="Nubank">Nubank</option>
                      <option value="Banco Original">Banco Original</option>
                      <option value="Banco Safra">Banco Safra</option>
                      <option value="Banco Votorantim">Banco Votorantim</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div v-if="bankingForm.bankName === 'Outro'" class="form-row">
                  <div class="form-group form-group-large">
                    <label for="customBankName">Nome do Banco *</label>
                    <input
                      id="customBankName"
                      v-model="bankingForm.customBankName"
                      type="text"
                      placeholder="Digite o nome do banco"
                      class="form-input"
                      :required="bankingForm.bankName === 'Outro'"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="accountType">Tipo de Conta *</label>
                    <select
                      id="accountType"
                      v-model="bankingForm.accountType"
                      class="form-input"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="checking">Conta Corrente</option>
                      <option value="savings">Conta Poupança</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="agency">Agência *</label>
                    <input
                      id="agency"
                      v-model="bankingForm.agency"
                      type="text"
                      placeholder="0000"
                      class="form-input"
                      @input="formatAgency"
                      maxlength="10"
                      required
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="account">Número da Conta *</label>
                    <input
                      id="account"
                      v-model="bankingForm.account"
                      type="text"
                      placeholder="00000-0"
                      class="form-input"
                      @input="formatAccount"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="accountDigit">Dígito *</label>
                    <input
                      id="accountDigit"
                      v-model="bankingForm.accountDigit"
                      type="text"
                      placeholder="0"
                      class="form-input"
                      maxlength="2"
                      required
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group form-group-large">
                    <label for="accountHolder">Nome do Titular *</label>
                    <input
                      id="accountHolder"
                      v-model="bankingForm.accountHolder"
                      type="text"
                      placeholder="Nome completo do titular da conta"
                      class="form-input"
                      required
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group form-group-large">
                    <label for="cpfCnpj">CPF ou CNPJ do Titular *</label>
                    <input
                      id="cpfCnpj"
                      v-model="bankingForm.cpfCnpj"
                      type="text"
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      class="form-input"
                      @input="formatCpfCnpjInput"
                      required
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group form-group-large">
                    <div class="pix-section-header">
                      <label>Chaves PIX (Opcional)</label>
                      <button type="button" @click="addPixKey" class="btn-add-pix">
                        <span>➕</span>
                        <span>Adicionar Chave PIX</span>
                      </button>
                    </div>
                    <p class="form-hint">Cadastre suas chaves PIX para recebimentos mais rápidos</p>
                    
                    <div v-if="bankingForm.pixKeys && bankingForm.pixKeys.length > 0" class="pix-keys-list">
                      <div v-for="(pixKey, index) in bankingForm.pixKeys" :key="index" class="pix-key-form-item">
                        <div class="pix-key-form-row">
                          <div class="form-group pix-type-group">
                            <label :for="`pixType-${index}`">Tipo</label>
                            <select
                              :id="`pixType-${index}`"
                              v-model="pixKey.type"
                              class="form-input"
                              @change="updatePixPlaceholder(index)"
                            >
                              <option value="cpf">CPF</option>
                              <option value="email">Email</option>
                              <option value="phone">Telefone</option>
                              <option value="random">Chave Aleatória</option>
                            </select>
                          </div>
                          <div class="form-group pix-value-group">
                            <label :for="`pixValue-${index}`">Valor</label>
                            <input
                              :id="`pixValue-${index}`"
                              v-model="pixKey.value"
                              type="text"
                              :placeholder="getPixPlaceholder(pixKey.type)"
                              class="form-input"
                              @input="formatPixValue(index)"
                            />
                          </div>
                          <button type="button" @click="removePixKey(index)" class="btn-remove-pix" title="Remover chave PIX">
                            <span>🗑️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div v-else class="pix-empty-state">
                      <p>Nenhuma chave PIX cadastrada. Clique em "Adicionar Chave PIX" para começar.</p>
                    </div>
                  </div>
                </div>

                <div class="form-actions">
                  <button
                    type="submit"
                    class="btn btn-primary btn-large"
                    :disabled="saving"
                  >
                    <span v-if="!saving">💾 Salvar Dados Bancários</span>
                    <span v-else class="loading-spinner-small"></span>
                  </button>
                  <button
                    v-if="bankingData"
                    type="button"
                    @click="deleteBankingData"
                    class="btn btn-danger btn-large"
                  >
                    🗑️ Excluir Dados Bancários
                  </button>
                </div>
              </form>
            </div>

            <div v-if="activeTab === 'security'" class="profile-section">
              <div class="section-header">
                <div class="section-title-wrapper">
                  <span class="section-icon">🔒</span>
                  <h2>Segurança</h2>
                </div>
              </div>

              <form @submit.prevent="changePassword" class="profile-form">
                <div class="form-group">
                  <label for="currentPassword">
                    <span class="label-icon">🔑</span>
                    Senha Atual
                  </label>
                  <input
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    type="password"
                    placeholder="Digite sua senha atual"
                    class="form-input"
                    required
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="newPassword">
                      <span class="label-icon">🔐</span>
                      Nova Senha
                    </label>
                    <input
                      id="newPassword"
                      v-model="passwordForm.newPassword"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      minlength="6"
                      class="form-input"
                      :class="{ 'input-error': passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword }"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="confirmPassword">
                      <span class="label-icon">✅</span>
                      Confirmar Nova Senha
                    </label>
                    <input
                      id="confirmPassword"
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      placeholder="Digite novamente"
                      class="form-input"
                      :class="{ 'input-error': passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword }"
                      required
                    />
                  </div>
                </div>

                <div v-if="passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="error-message">
                  ⚠️ As senhas não coincidem
                </div>

                <div class="form-actions">
                  <button
                    type="submit"
                    class="btn btn-primary btn-large"
                    :disabled="passwordForm.newPassword !== passwordForm.confirmPassword || saving"
                  >
                    <span v-if="!saving">🔒 Alterar Senha</span>
                    <span v-else class="loading-spinner-small"></span>
                  </button>
                </div>
              </form>
            </div>

            <div v-if="activeTab === 'supplier'" class="profile-section">
              <div v-if="!isSupplier" class="supplier-registration">
                <div class="section-header">
                  <div class="section-title-wrapper">
                    <span class="section-icon">🏪</span>
                    <h2>Torne-se um Fornecedor</h2>
                  </div>
                </div>

                <div class="supplier-info">
                  <div class="info-card">
                    <h3>Vantagens de ser Fornecedor</h3>
                    <ul class="benefits-list">
                      <li>✅ Cadastre e gerencie seus próprios produtos</li>
                      <li>✅ Aumente sua visibilidade na plataforma</li>
                      <li>✅ Controle total sobre seus produtos e preços</li>
                      <li>✅ Acompanhe suas vendas em tempo real</li>
                      <li>✅ Receba pagamentos de forma segura</li>
                    </ul>
                  </div>

                  <form @submit.prevent="registerAsSupplier" class="supplier-form">
                    <h3>Dados da Empresa</h3>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label for="companyName">Nome da Empresa *</label>
                        <input
                          id="companyName"
                          v-model="supplierForm.companyName"
                          type="text"
                          placeholder="Nome da sua empresa"
                          class="form-input"
                          required
                        />
                      </div>
                      <div class="form-group">
                        <label for="cnpj">CNPJ *</label>
                        <input
                          id="cnpj"
                          v-model="supplierForm.cnpj"
                          type="text"
                          placeholder="00.000.000/0000-00"
                          class="form-input"
                          @input="formatCnpj"
                          maxlength="18"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label for="companyEmail">Email Comercial *</label>
                        <input
                          id="companyEmail"
                          v-model="supplierForm.companyEmail"
                          type="email"
                          placeholder="contato@empresa.com"
                          class="form-input"
                          required
                        />
                      </div>
                      <div class="form-group">
                        <label for="companyPhone">Telefone Comercial *</label>
                        <input
                          id="companyPhone"
                          v-model="supplierForm.companyPhone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          class="form-input"
                          @input="formatPhone"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group form-group-large">
                        <label for="companyAddress">Endereço da Empresa *</label>
                        <input
                          id="companyAddress"
                          v-model="supplierForm.companyAddress"
                          type="text"
                          placeholder="Rua, número, complemento"
                          class="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label for="companyCity">Cidade *</label>
                        <input
                          id="companyCity"
                          v-model="supplierForm.companyCity"
                          type="text"
                          placeholder="Sua cidade"
                          class="form-input"
                          required
                        />
                      </div>
                      <div class="form-group">
                        <label for="companyState">Estado *</label>
                        <select
                          id="companyState"
                          v-model="supplierForm.companyState"
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
                      <div class="form-group">
                        <label for="companyCep">CEP *</label>
                        <input
                          id="companyCep"
                          v-model="supplierForm.companyCep"
                          type="text"
                          placeholder="00000-000"
                          class="form-input"
                          @input="formatCep"
                          maxlength="9"
                          required
                        />
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group form-group-large">
                        <label for="companyDescription">Descrição da Empresa *</label>
                        <textarea
                          id="companyDescription"
                          v-model="supplierForm.companyDescription"
                          placeholder="Descreva sua empresa, produtos e serviços oferecidos..."
                          class="form-input"
                          rows="4"
                          required
                        ></textarea>
                      </div>
                    </div>

                    <div class="form-actions">
                      <button
                        type="submit"
                        class="btn btn-primary btn-large"
                        :disabled="saving"
                      >
                        <span v-if="!saving">🏪 Registrar como Fornecedor</span>
                        <span v-else class="loading-spinner-small"></span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div v-else class="supplier-dashboard">
                <div class="section-header">
                  <div class="section-title-wrapper">
                    <span class="section-icon">🏪</span>
                    <h2>Painel do Fornecedor</h2>
                  </div>
                  <router-link to="/supplier/products" class="btn btn-primary">
                    <span>➕</span>
                    <span>Cadastrar Produto</span>
                  </router-link>
                </div>

                <div class="supplier-stats">
                  <div class="stat-card">
                    <div class="stat-card-icon">📦</div>
                    <div class="stat-card-content">
                      <span class="stat-card-value">{{ myProductsCount }}</span>
                      <span class="stat-card-label">Produtos Cadastrados</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-card-icon">💰</div>
                    <div class="stat-card-content">
                      <span class="stat-card-value">{{ formatCurrency(totalSales) }}</span>
                      <span class="stat-card-label">Total em Vendas</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-card-icon">📊</div>
                    <div class="stat-card-content">
                      <span class="stat-card-value">{{ totalOrders }}</span>
                      <span class="stat-card-label">Pedidos Recebidos</span>
                    </div>
                  </div>
                </div>

                <div class="supplier-actions">
                  <router-link to="/supplier/products" class="action-card">
                    <div class="action-icon">📦</div>
                    <h3>Meus Produtos</h3>
                    <p>Gerencie seus produtos cadastrados</p>
                  </router-link>
                  <div class="action-card">
                    <div class="action-icon">📊</div>
                    <h3>Relatórios</h3>
                    <p>Visualize suas vendas e estatísticas</p>
                  </div>
                  <div class="action-card">
                    <div class="action-icon">⚙️</div>
                    <h3>Configurações</h3>
                    <p>Gerencie suas informações de fornecedor</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../services/auth'
import { formatCurrency } from '../utils/formatters'
import { useToast } from '../composables/useToast'

export default {
  name: 'Profile',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { showToast } = useToast()
    const isAuthenticated = computed(() => authService.isAuthenticated())
    const user = computed(() => authService.getCurrentUser())
    const activeTab = ref('info')
    const editMode = ref(false)
    const saving = ref(false)
    const showAddAddress = ref(false)
    const isSupplier = ref(false)

    const tabs = [
      { id: 'info', label: 'Informações', icon: '👤' },
      { id: 'address', label: 'Endereços', icon: '📍' },
      { id: 'orders', label: 'Pedidos', icon: '📦' },
      { id: 'banking', label: 'Dados Bancários', icon: '🏦' },
      { id: 'security', label: 'Segurança', icon: '🔒' },
      { id: 'supplier', label: 'Fornecedor', icon: '🏪' }
    ]

    const userName = computed(() => user.value ? user.value.name : '')
    const userEmail = computed(() => user.value ? user.value.email : '')
    const userInitials = computed(() => {
      if (!userName.value) return '?'
      const names = userName.value.split(' ')
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase()
      }
      return userName.value[0].toUpperCase()
    })

    const profileForm = ref({
      name: '',
      email: '',
      phone: ''
    })

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const supplierForm = ref({
      companyName: '',
      cnpj: '',
      companyEmail: '',
      companyPhone: '',
      companyAddress: '',
      companyCity: '',
      companyState: '',
      companyCep: '',
      companyDescription: ''
    })

    const bankingForm = ref({
      bankName: '',
      customBankName: '',
      accountType: '',
      agency: '',
      account: '',
      accountDigit: '',
      accountHolder: '',
      cpfCnpj: '',
      pixKeys: []
    })

    const addresses = ref([])
    const orders = ref([])
    const orderCount = computed(() => orders.value.length)
    const favoriteCount = ref(0)
    const myProductsCount = ref(0)
    const totalSales = ref(0)
    const totalOrders = ref(0)
    const editBankingMode = ref(false)
    const bankingData = ref(null)

    const formatCnpj = (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length > 14) value = value.substring(0, 14)
      if (value.length > 12) {
        value = value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5, 8) + '/' + value.substring(8, 12) + '-' + value.substring(12)
      } else if (value.length > 8) {
        value = value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5, 8) + '/' + value.substring(8)
      } else if (value.length > 5) {
        value = value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5)
      } else if (value.length > 2) {
        value = value.substring(0, 2) + '.' + value.substring(2)
      }
      supplierForm.value.cnpj = value
    }

    const formatCep = (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8)
      }
      supplierForm.value.companyCep = value
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
      supplierForm.value.companyPhone = value
    }

    const formatAgency = (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length > 10) value = value.substring(0, 10)
      bankingForm.value.agency = value
    }

    const formatAccount = (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length > 10) value = value.substring(0, 10)
      if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5)
      }
      bankingForm.value.account = value
    }

    const formatCpfCnpjInput = (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length <= 11) {
        if (value.length > 9) {
          value = value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6, 9) + '-' + value.substring(9)
        } else if (value.length > 6) {
          value = value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6)
        } else if (value.length > 3) {
          value = value.substring(0, 3) + '.' + value.substring(3)
        }
      } else {
        if (value.length > 12) {
          value = value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5, 8) + '/' + value.substring(8, 12) + '-' + value.substring(12, 14)
        } else if (value.length > 8) {
          value = value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5, 8) + '/' + value.substring(8)
        } else if (value.length > 5) {
          value = value.substring(0, 2) + '.' + value.substring(2, 5) + '.' + value.substring(5)
        } else if (value.length > 2) {
          value = value.substring(0, 2) + '.' + value.substring(2)
        }
      }
      bankingForm.value.cpfCnpj = value
    }

    const formatCpfCnpj = (value) => {
      if (!value) return ''
      const clean = value.replace(/\D/g, '')
      if (clean.length <= 11) {
        if (clean.length > 9) {
          return clean.substring(0, 3) + '.' + clean.substring(3, 6) + '.' + clean.substring(6, 9) + '-' + clean.substring(9)
        } else if (clean.length > 6) {
          return clean.substring(0, 3) + '.' + clean.substring(3, 6) + '.' + clean.substring(6)
        } else if (clean.length > 3) {
          return clean.substring(0, 3) + '.' + clean.substring(3)
        }
        return clean
      } else {
        if (clean.length > 12) {
          return clean.substring(0, 2) + '.' + clean.substring(2, 5) + '.' + clean.substring(5, 8) + '/' + clean.substring(8, 12) + '-' + clean.substring(12, 14)
        } else if (clean.length > 8) {
          return clean.substring(0, 2) + '.' + clean.substring(2, 5) + '.' + clean.substring(5, 8) + '/' + clean.substring(8)
        } else if (clean.length > 5) {
          return clean.substring(0, 2) + '.' + clean.substring(2, 5) + '.' + clean.substring(5)
        } else if (clean.length > 2) {
          return clean.substring(0, 2) + '.' + clean.substring(2)
        }
        return clean
      }
    }

    const saveBankingData = async () => {
      saving.value = true
      try {
        const finalBankName = bankingForm.value.bankName === 'Outro' 
          ? bankingForm.value.customBankName 
          : bankingForm.value.bankName

        const pixKeys = bankingForm.value.pixKeys
          .filter(key => key.value && key.value.trim() !== '')
          .map(key => ({
            type: key.type,
            value: key.type === 'cpf' || key.type === 'phone' 
              ? key.value.replace(/\D/g, '') 
              : key.value.trim()
          }))

        const data = {
          bankName: finalBankName,
          accountType: bankingForm.value.accountType,
          agency: bankingForm.value.agency.replace(/\D/g, ''),
          account: bankingForm.value.account.replace(/\D/g, ''),
          accountDigit: bankingForm.value.accountDigit,
          accountHolder: bankingForm.value.accountHolder,
          cpfCnpj: bankingForm.value.cpfCnpj.replace(/\D/g, ''),
          pixKeys: pixKeys.length > 0 ? pixKeys : null
        }

        const user = authService.getCurrentUser()
        const userId = user?._id || user?.id || 'user_' + Date.now()
        const key = `banking_${userId}`
        
        localStorage.setItem(key, JSON.stringify(data))
        bankingData.value = data
        editBankingMode.value = false
        showToast('Dados bancários salvos com sucesso!', 'success')
      } catch (error) {
        showToast('Erro ao salvar dados bancários', 'error')
      } finally {
        saving.value = false
      }
    }

    const addPixKey = () => {
      if (!bankingForm.value.pixKeys) {
        bankingForm.value.pixKeys = []
      }
      bankingForm.value.pixKeys.push({
        type: 'cpf',
        value: ''
      })
    }

    const removePixKey = (index) => {
      if (bankingForm.value.pixKeys && bankingForm.value.pixKeys.length > index) {
        bankingForm.value.pixKeys.splice(index, 1)
      }
    }

    const getPixPlaceholder = (type) => {
      switch (type) {
        case 'cpf':
          return '000.000.000-00'
        case 'email':
          return 'seu@email.com'
        case 'phone':
          return '(00) 00000-0000'
        case 'random':
          return 'Chave aleatória (UUID)'
        default:
          return 'Digite a chave PIX'
      }
    }

    const updatePixPlaceholder = (index) => {
      const pixKey = bankingForm.value.pixKeys[index]
      if (pixKey) {
        pixKey.value = ''
      }
    }

    const formatPixValue = (index) => {
      const pixKey = bankingForm.value.pixKeys[index]
      if (!pixKey) return

      if (pixKey.type === 'cpf') {
        let value = pixKey.value.replace(/\D/g, '')
        if (value.length > 11) value = value.substring(0, 11)
        if (value.length > 9) {
          value = value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6, 9) + '-' + value.substring(9)
        } else if (value.length > 6) {
          value = value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6)
        } else if (value.length > 3) {
          value = value.substring(0, 3) + '.' + value.substring(3)
        }
        pixKey.value = value
      } else if (pixKey.type === 'phone') {
        let value = pixKey.value.replace(/\D/g, '')
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
        pixKey.value = value
      }
    }

    const getPixTypeLabel = (type) => {
      switch (type) {
        case 'cpf':
          return 'CPF'
        case 'email':
          return 'Email'
        case 'phone':
          return 'Telefone'
        case 'random':
          return 'Chave Aleatória'
        default:
          return 'PIX'
      }
    }

    const detectPixType = (value) => {
      if (!value) return 'random'
      const clean = value.replace(/\D/g, '')
      if (clean.length === 11) return 'cpf'
      if (value.includes('@')) return 'email'
      if (clean.length >= 10 && clean.length <= 11) return 'phone'
      return 'random'
    }

    const deleteBankingData = async () => {
      if (!confirm('Tem certeza que deseja excluir seus dados bancários?')) {
        return
      }

      try {
        const user = authService.getCurrentUser()
        const userId = user?._id || user?.id || 'user_' + Date.now()
        const key = `banking_${userId}`
        
        localStorage.removeItem(key)
        bankingData.value = null
        bankingForm.value = {
          bankName: '',
          customBankName: '',
          accountType: '',
          agency: '',
          account: '',
          accountDigit: '',
          accountHolder: '',
          cpfCnpj: '',
          pixKeys: []
        }
        showToast('Dados bancários excluídos com sucesso!', 'success')
      } catch (error) {
        showToast('Erro ao excluir dados bancários', 'error')
      }
    }

    const updateProfile = async () => {
      saving.value = true
      try {
        showToast('Perfil atualizado com sucesso!', 'success')
        editMode.value = false
      } catch (error) {
        showToast('Erro ao atualizar perfil', 'error')
      } finally {
        saving.value = false
      }
    }

    const changePassword = async () => {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        showToast('As senhas não coincidem', 'error')
        return
      }

      saving.value = true
      try {
        showToast('Senha alterada com sucesso!', 'success')
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        showToast('Erro ao alterar senha', 'error')
      } finally {
        saving.value = false
      }
    }

    const registerAsSupplier = async () => {
      saving.value = true
      try {
        const supplierData = {
          companyName: supplierForm.value.companyName,
          cnpj: supplierForm.value.cnpj.replace(/\D/g, ''),
          companyEmail: supplierForm.value.companyEmail,
          companyPhone: supplierForm.value.companyPhone.replace(/\D/g, ''),
          companyAddress: supplierForm.value.companyAddress,
          companyCity: supplierForm.value.companyCity,
          companyState: supplierForm.value.companyState,
          companyCep: supplierForm.value.companyCep.replace(/\D/g, ''),
          companyDescription: supplierForm.value.companyDescription
        }

        const storedSupplier = localStorage.getItem('supplier')
        if (storedSupplier) {
          const supplier = JSON.parse(storedSupplier)
          if (supplier.userId === user.value._id) {
            showToast('Você já é um fornecedor cadastrado!', 'info')
            isSupplier.value = true
            return
          }
        }

        const userId = user.value?._id || user.value?.id || 'user_' + Date.now()
        const newSupplier = {
          ...supplierData,
          userId: userId,
          status: 'pending',
          createdAt: new Date().toISOString()
        }

        localStorage.setItem('supplier', JSON.stringify(newSupplier))
        isSupplier.value = true
        showToast('Registro como fornecedor realizado com sucesso!', 'success')
      } catch (error) {
        showToast('Erro ao registrar como fornecedor', 'error')
      } finally {
        saving.value = false
      }
    }

    const editAddress = (address) => {
      showToast('Funcionalidade em desenvolvimento', 'info')
    }

    const deleteAddress = (id) => {
      showToast('Funcionalidade em desenvolvimento', 'info')
    }

    const viewOrder = (orderId) => {
      showToast('Funcionalidade em desenvolvimento', 'info')
    }

    const formatDate = (date) => {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    onMounted(() => {
      if (route.query.tab) {
        activeTab.value = route.query.tab
      }

      if (isAuthenticated.value && user.value) {
        profileForm.value = {
          name: user.value.name || '',
          email: user.value.email || '',
          phone: user.value.phone || ''
        }

        const storedSupplier = localStorage.getItem('supplier')
        if (storedSupplier) {
          const supplier = JSON.parse(storedSupplier)
          const userId = user.value?._id || user.value?.id || ''
          if (supplier.userId === userId) {
            isSupplier.value = true
          }
        }

        const userId = user.value?._id || user.value?.id || 'user_' + Date.now()
        const bankingKey = `banking_${userId}`
        const storedBanking = localStorage.getItem(bankingKey)
        if (storedBanking) {
          bankingData.value = JSON.parse(storedBanking)
          
          let pixKeys = []
          if (bankingData.value.pixKeys && Array.isArray(bankingData.value.pixKeys)) {
            pixKeys = bankingData.value.pixKeys.map(key => ({
              type: key.type,
              value: key.type === 'cpf' ? formatCpfCnpj(key.value) : key.value
            }))
          } else if (bankingData.value.pix) {
            const pixType = detectPixType(bankingData.value.pix)
            pixKeys = [{
              type: pixType,
              value: pixType === 'cpf' ? formatCpfCnpj(bankingData.value.pix) : bankingData.value.pix
            }]
          }
          
          bankingForm.value = {
            bankName: bankingData.value.bankName,
            customBankName: '',
            accountType: bankingData.value.accountType,
            agency: bankingData.value.agency,
            account: bankingData.value.account,
            accountDigit: bankingData.value.accountDigit,
            accountHolder: bankingData.value.accountHolder,
            cpfCnpj: formatCpfCnpj(bankingData.value.cpfCnpj),
            pixKeys: pixKeys
          }
        }
      }
    })

    return {
      isAuthenticated,
      user,
      userName,
      userEmail,
      userInitials,
      activeTab,
      editMode,
      saving,
      showAddAddress,
      isSupplier,
      tabs,
      profileForm,
      passwordForm,
      supplierForm,
      addresses,
      orders,
      orderCount,
      favoriteCount,
      myProductsCount,
      totalSales,
      totalOrders,
      updateProfile,
      changePassword,
      registerAsSupplier,
      editAddress,
      deleteAddress,
      viewOrder,
      formatCurrency,
      formatDate,
      formatCnpj,
      formatCep,
      formatPhone,
      editBankingMode,
      bankingData,
      bankingForm,
      formatAgency,
      formatAccount,
      formatCpfCnpjInput,
      formatCpfCnpj,
      saveBankingData,
      deleteBankingData,
      addPixKey,
      removePixKey,
      getPixPlaceholder,
      updatePixPlaceholder,
      formatPixValue,
      getPixTypeLabel
    }
  }
}
</script>

<style scoped>
.profile-page {
  padding: 40px 0 60px;
  min-height: calc(100vh - 200px);
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  width: 100%;
}

.profile-header {
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 2px solid #e0f2fe;
}

.header-content h1 {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.header-content p {
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
}

.auth-required {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.auth-card {
  background: white;
  border-radius: 24px;
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

.profile-content {
  width: 100%;
}

.profile-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 100px;
  height: fit-content;
}

.profile-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
  border: 1px solid #e0f2fe;
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
}

.profile-avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  font-size: 42px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
  position: relative;
  z-index: 1;
}

.avatar-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  opacity: 0.2;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.3;
  }
}

.profile-name {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  text-transform: capitalize;
}

.profile-email {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.supplier-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.badge-icon {
  font-size: 16px;
}

.badge-text {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 24px;
  border-top: 2px solid #e0f2fe;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.stat-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e0f2fe;
}

.profile-nav {
  background: white;
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0f2fe;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 15px;
  font-weight: 500;
  color: #475569;
  position: relative;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #3b82f6;
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #1e40af;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.nav-text {
  flex: 1;
}

.nav-indicator {
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: 2px;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0f2fe;
  position: relative;
  overflow: hidden;
}

.profile-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0f2fe;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
}

.section-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1e40af;
  margin: 0;
}

.edit-btn {
  padding: 10px 20px;
  border: 2px solid #60a5fa;
  border-radius: 10px;
  background: white;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-btn:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.2);
}

.edit-btn.active {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  border-color: #3b82f6;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-row:has(.form-group-large) {
  grid-template-columns: 1fr;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group-large {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-icon {
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0f2fe;
  border-radius: 12px;
  font-size: 15px;
  color: #1e293b;
  background: #f8f9fa;
  transition: all 0.3s ease;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:disabled {
  background: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
}

.form-input.editing:focus,
.form-input:focus:not(:disabled) {
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

.input-error {
  border-color: #feb2b2 !important;
  background: #fef2f2 !important;
}

.error-message {
  color: #dc2626;
  font-size: 14px;
  padding: 12px 16px;
  background: #fef2f2;
  border-radius: 10px;
  border: 1px solid #fecaca;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions {
  margin-top: 8px;
}

.btn-large {
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
}

.btn-small {
  padding: 10px 18px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 15px;
  margin-bottom: 24px;
}

.addresses-list,
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.address-card,
.order-card {
  border: 2px solid #e0f2fe;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
}

.address-card:hover,
.order-card:hover {
  border-color: #bfdbfe;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0f2fe;
}

.address-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.address-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e0f2fe;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn.edit:hover {
  background: #eff6ff;
  border-color: #60a5fa;
}

.action-btn.delete:hover {
  background: #fef2f2;
  border-color: #fecaca;
}

.address-content p {
  font-size: 14px;
  color: #475569;
  margin: 8px 0;
  line-height: 1.6;
}

.address-label {
  font-weight: 600;
  color: #64748b;
  margin-right: 8px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.order-info h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.order-date {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.order-status {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-status.pending {
  background: #fef3c7;
  color: #d97706;
}

.order-status.processing {
  background: #dbeafe;
  color: #2563eb;
}

.order-status.completed {
  background: #d1fae5;
  color: #059669;
}

.order-status.cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0f2fe;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-item-image {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: contain;
  background: #f8f9fa;
  padding: 4px;
  flex-shrink: 0;
}

.order-item-info {
  flex: 1;
  min-width: 0;
}

.order-item-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-item-info p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.order-item-total {
  font-size: 15px;
  font-weight: 700;
  color: #3b82f6;
  white-space: nowrap;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.total-value {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.btn-outline {
  padding: 10px 20px;
  border: 2px solid #60a5fa;
  border-radius: 10px;
  background: white;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-outline:hover {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  transform: translateY(-1px);
}

.supplier-registration {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.supplier-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #bfdbfe;
}

.info-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 16px 0;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benefits-list li {
  font-size: 15px;
  color: #1e293b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.supplier-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.supplier-form h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e40af;
  margin: 0 0 20px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0f2fe;
}

.supplier-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.supplier-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #e0f2fe;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #bfdbfe;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.stat-card-icon {
  font-size: 32px;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  flex-shrink: 0;
}

.stat-card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-card-value {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
}

.stat-card-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.supplier-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #e0f2fe;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.action-card:hover {
  border-color: #bfdbfe;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
  transform: translateY(-4px);
}

.action-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 16px;
}

.action-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.action-card p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.banking-display {
  padding: 20px 0;
}

.banking-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #e0f2fe;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.banking-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0f2fe;
}

.banking-icon {
  font-size: 48px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 16px;
  flex-shrink: 0;
}

.banking-info h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.banking-type {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.banking-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e0f2fe;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.detail-value {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  font-family: monospace;
}

.banking-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-hint {
  font-size: 12px;
  color: #94a3b8;
  margin: 8px 0 0 0;
  font-style: italic;
}

.btn-danger {
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 12px;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.pix-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
}

.pix-section-header label {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.btn-add-pix {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 2px solid #bfdbfe;
  border-radius: 8px;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-add-pix:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #93c5fd;
  transform: translateY(-1px);
}

.pix-keys-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.pix-key-form-item {
  background: #f8f9fa;
  border: 2px solid #e0f2fe;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.pix-key-form-item:hover {
  border-color: #bfdbfe;
  background: #f0f9ff;
}

.pix-key-form-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.pix-type-group {
  flex: 0 0 180px;
  min-width: 0;
}

.pix-value-group {
  flex: 1;
  min-width: 0;
}

.btn-remove-pix {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 10px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  font-size: 18px;
}

.btn-remove-pix:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  transform: translateY(-1px);
}

.pix-empty-state {
  margin-top: 16px;
  padding: 20px;
  background: #f8f9fa;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  text-align: center;
}

.pix-empty-state p {
  color: #94a3b8;
  font-size: 14px;
  margin: 0;
}

.pix-keys-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.pix-key-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #e0f2fe;
}

.pix-key-type {
  font-size: 12px;
  font-weight: 700;
  color: #3b82f6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 80px;
}

.pix-key-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  font-family: monospace;
}

@media (max-width: 968px) {
  .profile-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .profile-sidebar {
    position: static;
    order: -1;
  }

  .profile-card {
    padding: 24px;
  }

  .profile-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 6px;
    gap: 6px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    margin-top: 16px;
  }

  .profile-nav::-webkit-scrollbar {
    display: none;
  }

  .nav-item {
    white-space: nowrap;
    flex-shrink: 0;
    min-width: 110px;
    padding: 10px 14px;
    font-size: 12px;
    justify-content: center;
  }

  .nav-icon {
    font-size: 16px;
  }

  .nav-icon {
    font-size: 18px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .supplier-stats {
    grid-template-columns: 1fr;
  }

  .supplier-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 20px 0 40px;
  }

  .container {
    padding: 0 16px;
  }

  .profile-header {
    margin-bottom: 24px;
    padding: 20px 16px;
  }

  .header-content h1 {
    font-size: 32px;
  }

  .header-content p {
    font-size: 14px;
  }

  .profile-card {
    padding: 20px;
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }

  .profile-name {
    font-size: 20px;
  }

  .profile-email {
    font-size: 13px;
  }

  .profile-stats {
    padding: 16px;
  }

  .stat-item {
    gap: 12px;
  }

  .stat-icon {
    font-size: 20px;
  }

  .stat-value {
    font-size: 18px;
  }

  .stat-label {
    font-size: 11px;
  }

  .profile-section {
    padding: 24px 20px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .section-header h2 {
    font-size: 20px;
  }

  .edit-btn {
    width: 100%;
    justify-content: center;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    font-size: 13px;
    margin-bottom: 8px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 14px;
    padding: 12px 14px;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    padding: 14px;
    font-size: 15px;
  }

  .address-card {
    padding: 20px;
  }

  .address-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .address-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .order-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .order-footer .btn-outline {
    width: 100%;
    text-align: center;
  }

  .order-total {
    width: 100%;
    justify-content: space-between;
  }

  .supplier-registration {
    gap: 24px;
  }

  .info-card {
    padding: 20px;
  }

  .info-card h3 {
    font-size: 18px;
  }

  .info-card p {
    font-size: 14px;
  }

  .banking-form-row {
    grid-template-columns: 1fr;
  }

  .pix-keys-list {
    gap: 16px;
  }

  .pix-key-item {
    padding: 16px;
  }
}

@media (max-width: 640px) {
  .profile-page {
    padding: 16px 0 32px;
  }

  .container {
    padding: 0 12px;
  }

  .profile-header {
    margin-bottom: 20px;
    padding: 16px 12px;
    border-radius: 12px;
  }

  .header-content h1 {
    font-size: 28px;
  }

  .header-content p {
    font-size: 13px;
  }

  .profile-card {
    padding: 16px;
    border-radius: 12px;
  }

  .profile-avatar-wrapper {
    margin-bottom: 16px;
  }

  .profile-avatar {
    width: 70px;
    height: 70px;
    font-size: 28px;
  }

  .profile-name {
    font-size: 18px;
    margin-bottom: 6px;
  }

  .profile-email {
    font-size: 12px;
  }

  .supplier-badge {
    padding: 8px 14px;
    font-size: 12px;
    margin-top: 12px;
  }

  .profile-stats {
    padding: 12px;
    margin-top: 16px;
  }

  .stat-item {
    gap: 10px;
  }

  .stat-icon {
    font-size: 18px;
  }

  .stat-value {
    font-size: 16px;
  }

  .stat-label {
    font-size: 10px;
  }

  .profile-nav {
    padding: 6px;
    gap: 6px;
  }

  .nav-item {
    min-width: 100px;
    padding: 10px 12px;
    font-size: 12px;
  }

  .nav-icon {
    font-size: 16px;
  }

  .profile-section {
    padding: 20px 16px;
    border-radius: 12px;
  }

  .section-header {
    margin-bottom: 20px;
  }

  .section-header h2 {
    font-size: 18px;
  }

  .section-icon {
    font-size: 20px;
  }

  .edit-btn {
    padding: 10px 16px;
    font-size: 13px;
  }

  .form-group {
    margin-bottom: 18px;
  }

  .form-group label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  .label-icon {
    font-size: 14px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 13px;
    padding: 10px 12px;
    border-radius: 8px;
  }

  .btn-primary,
  .btn-secondary {
    padding: 12px;
    font-size: 14px;
    border-radius: 8px;
  }

  .address-card {
    padding: 16px;
    border-radius: 12px;
  }

  .address-header h3 {
    font-size: 16px;
  }

  .address-content p {
    font-size: 13px;
  }

  .address-actions {
    gap: 8px;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .order-card {
    padding: 16px;
    border-radius: 12px;
  }

  .order-info h3 {
    font-size: 16px;
  }

  .order-date {
    font-size: 12px;
  }

  .order-status {
    padding: 5px 12px;
    font-size: 11px;
  }

  .order-item {
    gap: 10px;
  }

  .order-item-image {
    width: 50px;
    height: 50px;
  }

  .order-item-info h4 {
    font-size: 13px;
  }

  .order-item-info p {
    font-size: 11px;
  }

  .order-item-total {
    font-size: 14px;
  }

  .order-total {
    font-size: 16px;
  }

  .total-value {
    font-size: 20px;
  }

  .btn-outline {
    padding: 10px 16px;
    font-size: 13px;
  }

  .supplier-registration {
    gap: 20px;
  }

  .info-card {
    padding: 16px;
    border-radius: 12px;
  }

  .info-card h3 {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .info-card p {
    font-size: 13px;
  }

  .banking-form-row {
    gap: 16px;
  }

  .pix-keys-list {
    gap: 12px;
  }

  .pix-key-item {
    padding: 14px;
    border-radius: 10px;
  }

  .pix-key-header {
    margin-bottom: 12px;
  }

  .pix-key-header h4 {
    font-size: 14px;
  }

  .remove-pix-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding: 12px 0 24px;
  }

  .container {
    padding: 0 10px;
  }

  .profile-header {
    padding: 14px 10px;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .header-content p {
    font-size: 12px;
  }

  .profile-card {
    padding: 14px;
  }

  .profile-avatar {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .profile-name {
    font-size: 16px;
  }

  .profile-email {
    font-size: 11px;
  }

  .profile-nav {
    padding: 4px;
    gap: 4px;
  }

  .nav-item {
    min-width: 90px;
    padding: 8px 10px;
    font-size: 11px;
  }

  .nav-icon {
    font-size: 14px;
  }

  .profile-section {
    padding: 16px 12px;
  }

  .section-header h2 {
    font-size: 16px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 12px;
    padding: 9px 11px;
  }

  .btn-primary,
  .btn-secondary {
    padding: 11px;
    font-size: 13px;
  }
}
</style>
