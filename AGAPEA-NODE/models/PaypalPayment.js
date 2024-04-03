const mongoose=require('mongoose');

const PayPalPaymentSchema=new mongoose.Schema(
    {
        idpago: { type: String, required: true },
        idcliente: { type: String, required: true },
        idpedido: { type: String, required: true },
    }
);

module.exports=mongoose.model('PayPalPayment', PayPalPaymentSchema, 'paypalpayments');
