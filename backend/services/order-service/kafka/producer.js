import Kafka from 'kafkajs';
const kafka = new Kafka({
  clientId: 'order-producer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log('Order producer connected');
}

async function sendOrderCreated(payload) {
  await producer.send({
    topic: 'order.created',
    messages: [{ key: String(payload.id), value: JSON.stringify(payload) }]
  });
}

export default { connectProducer, sendOrderCreated, producer };
