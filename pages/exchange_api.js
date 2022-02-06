const amqp = require("amqplib");
const express = require("express");
const app = express();
const { type } = require("express/lib/response");

// API URL
app.get("/api/exchange/:name", (req, res) => {
  createExchange(req.params.name);
  res.send(`Created exchange with name: ${req.params.name}`);
});

// PORT
const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Listening to port ${port}`));

async function createExchange(name) {
  try {
    const connection = amqp.connect("amqp://localhost");
    const channel = await (await connection).createChannel();

    const exchange = await channel.assertExchange(name, "direct", {
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
