const express = require("express");
const app = express();
const amqp = require("amqplib/callback_api");
const { type } = require("express/lib/response");

//API URL
// to add more inputs, chain /:<inputName>
app.get("/api/receiver/:queueName", (req, res) => {
  consume(req.params.queueName);
  res.send(`consumed message from queue: ${req.params.queueName}`);
});

// PORT
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening to port ${port}`));

async function consume(queueName) {
  amqp.connect("amqp://localhost", (connError, connection) => {
    if (connError) {
      throw connError;
    }
    connection.createChannel((channelError, channel) => {
      if (channelError) {
        throw channelError;
      }
      channel.prefetch(1);

      channel.consume(
        queueName,
        (msg) => {
          channel.ack(msg, true);
          console.log(`message received: ${msg.content}`);
        },
        {
          //consume message
          noAck: false,
        }
      );
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 20);
  });
}
