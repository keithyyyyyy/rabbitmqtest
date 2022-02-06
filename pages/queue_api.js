const amqp = require("amqplib");
const express = require("express");
const app = express();
const { type } = require("express/lib/response");

// API URL
app.get("/api/queue/:queue_name/:exc_name/:bindingKey", (req, res) => {
  createQueue(
    req.params.queue_name,
    req.params.exc_name,
    req.params.bindingKey
  );
  res.send(
    `Created queue: ${req.params.queue_name} binding to exchange: ${req.params.exc_name}`
  );
});

// PORT
const port = process.env.PORT || 3004;
app.listen(port, () => console.log(`Listening to port ${port}`));

async function createQueue(queueName, excName, bindingKey) {
  try {
    const connection = amqp.connect("amqp://localhost");
    const channel = await (await connection).createChannel();

    const queue = channel.assertQueue(queueName);

    channel.bindQueue(queueName, excName, bindingKey, {
      durable: true,
    });

    setTimeout(() => {
      connection.cancel();
      process.exit(0);
    }, 20);
    // find out how to set response for runtime error
  } catch (ex) {
    console.log(ex);
  }
}
