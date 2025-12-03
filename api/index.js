const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
  }
};

connectDB();

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number,
  rating: Number,
  reviews: Number
});

const CategorySchema = new mongoose.Schema({
  name: String,
  icon: String
});

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  sessionId: {
    type: String,
    required: true
  }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Product = mongoose.model('Product', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);
const CartItem = mongoose.model('CartItem', CartItemSchema);
const User = mongoose.model('User', UserSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'zaylo_secret_key_change_in_production', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cart/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const items = await CartItem.find({ sessionId })
      .populate('productId')
      .exec();
    
    const validItems = items.filter(item => item.productId);
    res.json(validItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const { productId, quantity, sessionId } = req.body;
    
    if (!productId || !sessionId) {
      return res.status(400).json({ error: 'productId e sessionId são obrigatórios' });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    let cartItem = await CartItem.findOne({ productId, sessionId });
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new CartItem({ productId, quantity, sessionId });
    }
    await cartItem.save();
    await cartItem.populate('productId');
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/cart/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findByIdAndUpdate(req.params.id, { quantity }, { new: true }).populate('productId');
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cart/:id', async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removido' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cart/session/:sessionId', async (req, res) => {
  try {
    await CartItem.deleteMany({ sessionId: req.params.sessionId });
    res.json({ message: 'Carrinho limpo' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produto removido' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/seed', async (req, res) => {
  try {
    await Category.deleteMany({});
    await Product.deleteMany({});
    
    const categoryMap = {
      "electronics": { name: 'Eletrônicos', icon: '📱' },
      "jewelery": { name: 'Joias', icon: '💍' },
      "men's clothing": { name: 'Roupas Masculinas', icon: '👔' },
      "women's clothing": { name: 'Roupas Femininas', icon: '👗' }
    };

    const response = await axios.get('https://fakestoreapi.com/products');
    const apiProducts = response.data;

    const categoriesMap = new Map();
    const categoriesToInsert = [];

    apiProducts.forEach(product => {
      const categoryKey = product.category;
      if (!categoriesMap.has(categoryKey)) {
        const categoryInfo = categoryMap[categoryKey] || { 
          name: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1), 
          icon: '🛍️' 
        };
        categoriesMap.set(categoryKey, categoryInfo);
        categoriesToInsert.push({
          name: categoryInfo.name,
          icon: categoryInfo.icon
        });
      }
    });

    const categories = await Category.insertMany(categoriesToInsert);
    const categoryNameMap = new Map();
    categories.forEach(cat => {
      categoryNameMap.set(cat.name, cat._id);
    });

    const productsToInsert = apiProducts.map(product => {
      const categoryInfo = categoryMap[product.category] || { 
        name: product.category.charAt(0).toUpperCase() + product.category.slice(1), 
        icon: '🛍️' 
      };
      
      return {
        name: product.title,
        description: product.description,
        price: product.price * 5,
        image: product.image,
        category: categoryInfo.name,
        stock: Math.floor(Math.random() * 100) + 10,
        rating: Math.round(product.rating.rate * 10) / 10,
        reviews: product.rating.count
      };
    });

    const products = await Product.insertMany(productsToInsert);

    res.json({ 
      message: 'Produtos importados com sucesso!',
      categories: categories.length,
      products: products.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'zaylo_secret_key_change_in_production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'zaylo_secret_key_change_in_production',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

module.exports = app;

