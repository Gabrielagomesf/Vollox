# Deploy Vollox na Vercel

## ✅ Deploy Realizado

O projeto foi configurado e deployado na Vercel com sucesso!

### URLs do Projeto
- **Frontend (Produção)**: https://frontend-md6xyvfxs-gabrielas-projects-ea0e0301.vercel.app
- **Painel Vercel**: https://vercel.com/gabrielas-projects-ea0e0301/frontend

## 🔧 Configuração de Variáveis de Ambiente

Para o projeto funcionar completamente, você precisa configurar as seguintes variáveis de ambiente no painel da Vercel:

### Como adicionar variáveis de ambiente:

1. Acesse: https://vercel.com/gabrielas-projects-ea0e0301/frontend/settings/environment-variables
2. Adicione as seguintes variáveis:

#### Variáveis Obrigatórias:

```
MONGODB_URI=mongodb+srv://seu-usuario:senha@cluster.mongodb.net/vollox?retryWrites=true&w=majority
JWT_SECRET=sua_chave_secreta_jwt_aqui
```

#### Variáveis Opcionais (se o backend estiver em outro servidor):

```
VITE_API_URL=https://sua-api.vercel.app/api
```

### Configuração do MongoDB

1. Crie uma conta no MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Crie um cluster gratuito
3. Obtenha a string de conexão
4. Adicione no formato: `mongodb+srv://usuario:senha@cluster.mongodb.net/vollox`

## 📁 Estrutura do Projeto na Vercel

```
/
├── api/              # Backend (Serverless Functions)
│   ├── index.js      # API principal
│   └── package.json
├── frontend/         # Frontend (Vue.js + Vite)
│   ├── src/
│   ├── dist/         # Build output
│   └── package.json
└── vercel.json       # Configuração Vercel
```

## 🚀 Comandos Úteis

### Deploy Manual
```bash
cd frontend
npx vercel --prod
```

### Ver Logs
```bash
npx vercel inspect --logs
```

### Listar Deployments
```bash
npx vercel ls
```

## 📝 Notas Importantes

1. **Backend como Serverless Functions**: O backend foi convertido para serverless functions na pasta `api/`
2. **MongoDB**: Certifique-se de configurar a variável `MONGODB_URI` no painel da Vercel
3. **JWT Secret**: Configure uma chave secreta forte para produção
4. **Deploy Automático**: Cada push na branch `main` fará deploy automático

## 🔗 Endpoints da API

Todas as rotas da API estão disponíveis em:
- `https://seu-dominio.vercel.app/api/*`

Exemplos:
- `/api/products` - Listar produtos
- `/api/categories` - Listar categorias
- `/api/auth/register` - Registrar usuário
- `/api/auth/login` - Login
- `/api/cart/:sessionId` - Carrinho

