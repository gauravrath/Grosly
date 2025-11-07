import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import { connectProducer, sendUserCreated, getUser, addUser } from "./kafka/producer.js";
import User from "./../../models/users.js";
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

let users = {}; // simple in-memory store for demo

(async () => {
	try {
		await connectProducer();
	} catch (e) {
		console.error('Kafka producer connect failed', e);
		process.exit(1);
	}
})();

app.post('/users', async (req, res) => {
	try {
		const { name, email, idempotencyKey } = req.body;
		// idempotency basic check
		if (idempotencyKey && users[idempotencyKey]) {
			return res.status(200).json(users[idempotencyKey]);
		}

		const id = uuidv4();
		const user = { id, name, email, created_at: new Date().toISOString() };

		// store by idempotencyKey if provided (very basic)
		if (idempotencyKey) users[idempotencyKey] = user;

		// produce event
		await sendUserCreated(user);

		res.status(201).json(user);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'failed to create user' });
	}
});

app.get("/get-users", async (req, res) => {
	try {
		console.log("Fetching users...");
		const users = await User.findAll();
		for (const u of users) {
			await getUser({ id: u.id, name: u.name, email: u.email });
		}

		res.status(200).json(users);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch users" });
	}
});


app.post("/add-users", async (req, res) => {
	const { name, email, password, role } = req.body;

	if (!name || !email || !password || !role) {
		console.log('req.bodyreq.body', req.body);
		
		return res.status(400).send("All fields required!");
	}

	const result = await addUser({ name, email, password, role });

	if (!result.success) {
		return res.status(500).send("Error sending message to Kafka");
	}
	return res.status(200).send("User add successfully!");
});



// graceful shutdown
process.on('SIGINT', async () => {
	try { await require('./kafka/producer').default.producer.disconnect(); } catch (e) { }
	process.exit(0);
});

app.listen(PORT, () => console.log(`user-service listening ${PORT}`));
