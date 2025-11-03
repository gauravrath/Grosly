import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { connectConsumer } from './kafka/consumer.js';
import { connectProducer, sendOrderCreated } from './kafka/producer.js';

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3002;

let orders = {};
let usersCache = {}; // cache consumed user records for enrichment demo

// Hook to handle user.created events
async function handleUserCreated(user) {
  console.log('order-service received user.created', user.id);
  usersCache[user.id] = user;
}

(async () => {
  try {
    await connectProducer();
    await connectConsumer(handleUserCreated);
  } catch (e) {
    console.error('Kafka connect failed', e);
    process.exit(1);
  }
})();

// create order API
app.post('/orders', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    // Simple validation
    if (!userId || !amount) return res.status(400).json({ error: 'userId and amount required' });

    const id = uuidv4();
    const order = {
      id,
      userId,
      amount,
      createdAt: new Date().toISOString(),
      user: usersCache[userId] || null // enrich if we have user info
    };

    orders[id] = order;
    await sendOrderCreated(order);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to create order' });
  }
});

process.on('SIGINT', async () => {
  try { await require('./kafka/producer').producer.disconnect(); } catch(e) {}
  try { await require('./kafka/consumer').consumer.disconnect(); } catch(e) {}
  process.exit(0);
});

app.listen(PORT, () => console.log(`order-service listening ${PORT}`));
