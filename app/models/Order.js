const mongoose = require('mongoose');

// Definindo o schema para o MongoDB
const Schema = new mongoose.Schema({
  id: Number,
  transaction_amount: Number,
  date_approved: String,
  first_six_digits: String,
  last_four_digits: String,
  display_name: String,
  email: String
});

// Exportando o modelo para ser utilizado no controller
module.exports = mongoose.model('orders', Schema);
