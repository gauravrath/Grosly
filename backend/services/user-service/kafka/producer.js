
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
	clientId: 'user-service',
	brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();

async function connectProducer() {
	await producer.connect();
	console.log('User producer connected to Kafka');
}

async function sendUserCreated(payload) {
	await producer.send({
		topic: 'user.created',
		messages: [{ key: String(payload.id), value: JSON.stringify(payload) }]
	});
}

async function getUser(payload) {
	await producer.connect();

	if (!payload || !payload.id) {
		throw new Error("Payload with id is required");
	}
	
	const replyTopic = "user.list.reply";
	await producer.send({
		topic: "user.list",
		messages: [
		{
			key: String(payload.id),
			value: JSON.stringify(payload),
			headers: { replyTo: replyTopic }
		}
		]
	});

	console.log(`Request sent for userId ${payload.id}`);
	await producer.disconnect();
}

export  { connectProducer, sendUserCreated, getUser, producer };
