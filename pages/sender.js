const amqp = require("amqplib");
const msg = { name: "keith", age: "25" };
connect();

async function connect() {
  try {
    const connection = amqp.connect("amqp://localhost");
    const channel = await (await connection).createChannel();

    // const queue1 = channel.assertQueue("doctor");
    // const queue2 = channel.assertQueue("bill");

    // const exchange = await channel.assertExchange('polyclinic', 'direct', {durable: true});

    // channel.bindQueue("doctor", 'polyclinic', "yourEyeGotProblem", {durable: true});
    // channel.bindQueue("bill", 'polyclinic', "ompm", {durable: true});

    channel.publish(
      "polyclinic",
      "yourEyeGotProblem",
      Buffer.from(JSON.stringify(msg))
    );

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
