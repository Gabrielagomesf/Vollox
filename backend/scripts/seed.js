const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

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

const Product = mongoose.model('Product', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);

async function seedDatabase() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB!');

    console.log('Limpando banco de dados...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    const categoryMap = {
      "electronics": { name: 'Eletrônicos', icon: '📱' },
      "jewelery": { name: 'Joias', icon: '💍' },
      "men's clothing": { name: 'Roupas Masculinas', icon: '👔' },
      "women's clothing": { name: 'Roupas Femininas', icon: '👗' }
    };

    console.log('Buscando produtos da API...');
    const response = await axios.get('https://fakestoreapi.com/products');
    const apiProducts = response.data;
    console.log(`Encontrados ${apiProducts.length} produtos na API`);

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

    console.log('Inserindo categorias...');
    const categories = await Category.insertMany(categoriesToInsert);
    console.log(`${categories.length} categorias inseridas`);

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

    console.log('Inserindo produtos...');
    const products = await Product.insertMany(productsToInsert);
    console.log(`${products.length} produtos inseridos`);

    console.log('✅ Banco de dados populado com sucesso!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDatabase();

