# Zaylo - E-commerce

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- MongoDB (local ou MongoDB Atlas)

## Configuração

### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` e configure as variáveis de ambiente necessárias. O mínimo necessário para começar:
```
MONGODB_URI=mongodb://localhost:27017/zaylo
PORT=3000
```

**Variáveis importantes:**
- `MONGODB_URI` - String de conexão do MongoDB (obrigatório)
- `PORT` - Porta do servidor backend (padrão: 3000)
- `NODE_ENV` - Ambiente de execução (development/production)
- `CORS_ORIGIN` - URL do frontend para CORS

O arquivo `.env.example` contém todas as variáveis disponíveis com descrições. Para desenvolvimento, apenas `MONGODB_URI` e `PORT` são obrigatórias.

### Frontend

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

## Como Executar

### Desenvolvimento

1. **Inicie o backend** (em um terminal):
```bash
cd backend
npm run dev
```

O backend estará rodando em `http://localhost:3000`

2. **Inicie o frontend** (em outro terminal):
```bash
cd frontend
npm run dev
```

O frontend estará rodando em `http://localhost:8080`

### Produção

1. **Backend**:
```bash
cd backend
npm start
```

2. **Frontend**:
```bash
cd frontend
npm run build
```

O build gerará os arquivos estáticos na pasta `dist`.

## Populando o Banco de Dados

Após iniciar o backend, você precisa popular o banco de dados com produtos reais da API. Existem duas formas:

### Opção 1: Script NPM (Recomendado)
```bash
cd backend
npm run seed
```

### Opção 2: Endpoint da API
Faça uma requisição POST para:
```
http://localhost:3000/api/seed
```

Ambas as opções irão:
- Buscar produtos da Fake Store API
- Criar categorias automaticamente
- Inserir produtos com preços convertidos para R$
- Gerar estoque e avaliações aleatórias

**⚠️ Importante:** Execute o seed antes de usar o frontend, caso contrário não haverá produtos para exibir.

## Estrutura do Projeto

### Backend
```
backend/
├── server.js          # Servidor Express principal
├── package.json       # Dependências do backend
├── .env.example       # Exemplo de variáveis de ambiente
└── .env              # Variáveis de ambiente (criar a partir do .env.example)
```

### Frontend
```
frontend/
├── src/
│   ├── components/    # Componentes Vue reutilizáveis
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   ├── ProductCard.vue
│   │   ├── Loading.vue
│   │   ├── Toast.vue
│   │   └── Modal.vue
│   ├── views/        # Páginas/Views
│   │   ├── Home.vue
│   │   ├── Products.vue
│   │   ├── ProductDetail.vue
│   │   └── Cart.vue
│   ├── services/     # Serviços de API
│   │   └── api.js
│   ├── utils/         # Utilitários
│   │   ├── storage.js
│   │   └── formatters.js
│   ├── composables/   # Composables Vue
│   │   └── useToast.js
│   ├── router/        # Configuração de rotas
│   │   └── index.js
│   ├── App.vue        # Componente raiz
│   ├── main.js        # Entry point
│   └── style.css      # Estilos globais
├── index.html
├── vite.config.js
└── package.json
```

## Funcionalidades

- ✅ Catálogo de produtos com busca e filtros
- ✅ Detalhes do produto
- ✅ Carrinho de compras
- ✅ Sistema de notificações (Toast)
- ✅ Loading states
- ✅ Design responsivo
- ✅ API RESTful completa
- ✅ Integração com MongoDB

## Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS
- dotenv

### Frontend
- Vue.js 3 (Composition API)
- Vue Router
- Vite
- Axios
- CSS3 (Grid, Flexbox, Animations)

