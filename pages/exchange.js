const amqp = require("amqplib");
const args = process.argv.slice(2);
console.log(args);
createExchange(args[0]);

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
