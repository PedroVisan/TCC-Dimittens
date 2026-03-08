import { Payment } from 'mercadopago';
import client from './mercadoPagoConfig.js'; // Import the configured client

const payment = new Payment(client);

/**
 * Create a payment for a plan
 * @param {Object} plan - Plan details
 * @param {string} userEmail - User's email
 * @returns {Promise<Object>} Payment response
 */
export const createPlanPayment = async (plan, userEmail) => {
    const body = {
        transaction_amount: plan.amount, // Amount for the plan
        description: plan.description, // Description of the plan
        payment_method_id: 'pix', // Payment method, e.g., 'pix'
        payer: {
            email: userEmail, // Payer's email
        },
    };

    try {
        const response = await payment.create({ body });
        return response.body; // Return response body
    } catch (error) {
        console.error('Error creating payment:', error.response?.data || error.message);
        throw error;
    }
};
