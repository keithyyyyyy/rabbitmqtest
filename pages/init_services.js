const amqp = require("amqplib");
init_rabbitMQ();

// seeding info from database
async function init_rabbitMQ() {
  try {
    const connection = amqp.connect("amqp://localhost");
    const channel = await (await connection).createChannel();

    const queue1 = channel.assertQueue("doctor");
    const queue2 = channel.assertQueue("bill");

    // assertExchange(<exchangeName>, <exchangetype>, args???)
    const exchange = await channel.assertExchange("polyclinic", "direct", {
      durable: true,
    });

    // bindQueue(<queueName>, <exchangeName>, <bindingkey>)
    channel.bindQueue("doctor", "polyclinic", "yourEyeGotProblem", {
      durable: true,
    });
    channel.bindQueue("bill", "polyclinic", "ompm", { durable: true });

    setTimeout(() => {
      connection.cancel();
      process.exit(0);
    }, 20);
    // find out how to set response for runtime error
  } catch (ex) {
    console.log(ex);
  }
}
