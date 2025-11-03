import connectAndStart from './kafka/consumer.js';

(async () => {
  try {
    await connectAndStart();
    console.log('notification-service started and subscribed');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

process.on('SIGINT', async () => {
  try { await require('./kafka/consumer').consumer.disconnect(); } catch(e) {}
  process.exit(0);
});
