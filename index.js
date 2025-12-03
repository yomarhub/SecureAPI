const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ quiet: true });
const { Sequelize } = require('sequelize');
const sequilize = new Sequelize('sqlite://./data/database.sqlite');
const models = require('./models/init-models')(sequilize);

const PORT = process.env.PORT || 3000;

const app = express()
app.use(express.json());
app.models = models;

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use('/products', require('./routes/products'));
app.use('/categories', require('./routes/categories'));
app.use('/users', require('./routes/users'));
app.use('/tokens', require('./routes/tokens'));

app.listen(PORT, () => {
  models.Product.findAll().then(console.log);
  console.log(`Server is running on http://localhost:${PORT}`)
})