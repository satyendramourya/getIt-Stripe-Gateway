require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');

app.use(express.json());
app.use(cors());


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// checkout api
app.post('/api/payment', async (req, res) => { 
    const { products } = req.body;
    console.log(products);
    
    const line_items = products.map((product) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: product.title,
            },
            unit_amount: product.price * 100,
        },
        quantity: product.quantity,
    }));

    console.log(line_items);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: 'payment',
        line_items : line_items,
        success_url: `${process.env.DOMAIN}/cart`,
        cancel_url: `${process.env.DOMAIN}/cart`,
    });

    res.json({ id: session.id });
});


app.listen(7000, () => {
    console.log('Server started on port 7000');
})