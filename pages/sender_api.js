const express = require("express");
const app = express();
const amqp = require("amqplib");
const { type } = require("express/lib/response");

//API URL
// to add more inputs, chain /:<inputName>
// serviceID-> exchange, queueID-> queue
app.get("/api/sender/:bookingID/:serviceID/:bindingKey", (req, res) => {
  publish(req.params.bookingID, req.params.serviceID, req.params.bindingKey);
  res.send(`Send Message for bookingID: ${req.params.bookingID}`);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));

async function publish(bookingID, serviceID, bindingKey) {
  const msg = {
    bookingID: bookingID,
    serviceID: serviceID,
    bindingKey: bindingKey,
  };

  try {
    const connection = amqp.connect("amqp://localhost");
    const channel = await (await connection).createChannel();

    //publish(<exchange>, <bindingKey>, <message>)
    channel.publish(serviceID, bindingKey, Buffer.from(JSON.stringify(msg)));

    console.log("----------------------------");
    console.log("message sent");

    setTimeout(() => {
      connection.cancel();
      process.exit(0);
    }, 20);
    // find out how to set response for runtime error
  } catch (ex) {
    console.log(ex);
  }
}
