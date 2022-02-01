// const amqp = require('amqplib/callback_api');

// // step 1: connect to rabbitmq management
// // change localhost when loading to cloud
// amqp.connect('amqp://localhost', (connError, connection) => {
//     if (connError){
//         throw connError;
//     }
//     // else, step 2: create channel
//     connection.createChannel((channelError, channel) => {
//         if(channelError){
//             throw channelError;
//         }
//         // else, step 3: assert queue (check if the queue is present in rabbitmq, else create the queue)
//         const queue = 'queue1';
//         channel.assertQueue(queue);
//         channel.assertExchange('logs','fanout', {durable:false})
//         channel.bindQueue(queue, 'logs',)
//         // step 4: send message to queue
//         // this is an async fire and forget
//         // if youre send JSON, then the message has to be "Buffer.from(JSON.stringify(<json message>))"
//         channel.sendToQueue(queue, Buffer.from('test message'));
//         console.log('---------------------');
//         console.log(`message sent to  ${queue}`);
//     })
// })

const amqp = require('amqplib');
const msg = {"name": "keith", "age":"25"}
connect();

async function connect(){

    try{
        const connection = amqp.connect("amqp://localhost");
        const channel = await (await connection).createChannel();
        
        const queue1 = channel.assertQueue("doctor");
        const queue2 = channel.assertQueue("bill");

        // assertExchange(<exchangeName>, <exchangetype>, args???)
        const exchange = await channel.assertExchange('conjunctivitis', 'direct', {durable: true});

        // bindQueue(<queueName>, <exchangeName>, <bindingkey>)
        // for fanout exchanges, last parameter (bindingKey) is not needed
        channel.bindQueue("doctor", 'conjunctivitis', "yourEyeGotProblem", {durable: true});
        channel.bindQueue("bill", 'conjunctivitis', "ompm", {durable: true});

        // channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)));
        
        //second parameter specifies the queue to send to
        //publish(<exchange>, <message>)
        channel.publish('conjunctivitis', 'yourEyeGotProblem', Buffer.from('hello world'));
        

        console.log("----------------------------")
        console.log("message sent")

        setTimeout(() => {
            connection.cancel();
            process.exit(0);
        }, 20);
        // find out how to set response for runtime error
    }

    catch (ex){
        console.log(ex)
    }

}