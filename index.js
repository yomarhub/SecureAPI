const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ quiet: true });
const { Sequelize } = require('sequelize');
const sequilize = new Sequelize('sqlite://./data/database.sqlite', { logging: false });
const models = require('./models/init-models')(sequilize);

const PORT = process.env.PORT || 3000;

const app = express()
app.use(express.json());
app.models = models;

app.get('/', (_req, res) => {
  res.send('Hello World')
})
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/entries'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})