# Como Popular o Banco de Dados - Zaylo

## Método 1: Script NPM (Recomendado) ⭐

Este é o método mais fácil e rápido:

### Passo 1: Certifique-se de estar na pasta do backend
```bash
cd backend
```

### Passo 2: Execute o comando de seed
```bash
npm run seed
```

### O que acontece:
- ✅ Conecta ao MongoDB
- ✅ Limpa dados antigos (se houver)
- ✅ Busca produtos da Fake Store API
- ✅ Cria categorias automaticamente
- ✅ Insere todos os produtos no banco
- ✅ Mostra quantos produtos foram inseridos

### Exemplo de saída:
```
Conectando ao MongoDB...
Conectado ao MongoDB!
Limpando banco de dados...
Buscando produtos da API...
Encontrados 20 produtos na API
Inserindo categorias...
4 categorias inseridas
Inserindo produtos...
20 produtos inseridos
✅ Banco de dados populado com sucesso!
```

---

## Método 2: Endpoint da API

Se o servidor já estiver rodando:

### Passo 1: Inicie o servidor
```bash
cd backend
npm run dev
```

### Passo 2: Faça uma requisição POST
Você pode usar:
- **Postman** ou **Insomnia**
- **curl** no terminal
- **Navegador** (com extensão)

#### Com curl:
```bash
curl -X POST http://localhost:3000/api/seed
```

#### Com Postman/Insomnia:
- Método: `POST`
- URL: `http://localhost:3000/api/seed`
- Headers: não precisa
- Body: não precisa

---

## Verificar se funcionou

### Opção 1: Via API
```bash
# Ver produtos
curl http://localhost:3000/api/products

# Ver categorias
curl http://localhost:3000/api/categories
```

### Opção 2: Via Frontend
1. Inicie o frontend: `cd frontend && npm run dev`
2. Acesse: `http://localhost:8080`
3. Você deve ver produtos e categorias na página inicial

---

## Solução de Problemas

### Erro: "Cannot find module 'axios'"
**Solução:** Instale as dependências:
```bash
cd backend
npm install
```

### Erro: "MongoServerError: Authentication failed"
**Solução:** Verifique o arquivo `.env`:
```bash
# Certifique-se de que o .env tem:
MONGODB_URI=mongodb+srv://natal:Gabixp22@cluster0.7nyvlvq.mongodb.net/zaylo
```

### Erro: "ECONNREFUSED"
**Solução:** Verifique se o MongoDB Atlas está acessível ou se a string de conexão está correta.

### Nenhum produto aparece no frontend
**Solução:** 
1. Verifique se o seed foi executado com sucesso
2. Verifique se o backend está rodando
3. Verifique o console do navegador para erros

---

## Dados que serão inseridos

- **Produtos:** ~20 produtos reais da Fake Store API
- **Categorias:** 
  - 📱 Eletrônicos
  - 💍 Joias
  - 👔 Roupas Masculinas
  - 👗 Roupas Femininas

Cada produto terá:
- Nome e descrição
- Preço (convertido para R$)
- Imagem
- Estoque aleatório
- Avaliações e rating

---

## Comandos Rápidos

```bash
# Popular banco (método recomendado)
cd backend && npm run seed

# Popular banco com servidor rodando
curl -X POST http://localhost:3000/api/seed

# Ver produtos
curl http://localhost:3000/api/products | json_pp

# Ver categorias
curl http://localhost:3000/api/categories | json_pp
```

---

## ⚠️ Importante

- Execute o seed **antes** de usar o frontend
- O seed **limpa** dados antigos antes de inserir novos
- Você pode executar o seed quantas vezes quiser
- Os produtos são buscados de uma API pública (Fake Store API)

