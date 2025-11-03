import Kafka from 'kafkajs';
const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

async function connectAndStart() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order.created', fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = JSON.parse(message.value.toString());
      console.log('NOTIFICATION: order.created ->', payload.id, 'userId:', payload.userId);
      // real system: push to email/sms/queue
    }
  });
}

export default { connectAndStart, consumer };
