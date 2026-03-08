const { MercadoPagoConfig, Payment } = require('mercadopago');

// Step 2: Initialize the client object
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN, // Your access token
  options: { timeout: 5000 }, // Optional settings
});

// Export the client and payment API for use in other files
module.exports = {
  client,
  PaymentAPI: new Payment(client), // Initialize the Payment API
};
