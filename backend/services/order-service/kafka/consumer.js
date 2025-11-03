import Kafka from 'kafkajs';
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'order-service-group' });

async function connectConsumer(onMessage) {
  await consumer.connect();
  console.log('Order consumer connected to Kafka');
  await consumer.subscribe({ topic: 'user.created', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      let payload;
      try {
        payload = JSON.parse(value);
      } catch (err) {
        console.error('invalid message', err);
        return;
      }
      await onMessage(payload);
    }
  });
}

export default { connectConsumer, consumer };
