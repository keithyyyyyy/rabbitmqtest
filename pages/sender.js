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
        const connection = amqp.connect("amqp://localhost:5672");
        const channel = await (await connection).createChannel();
        const queue1 = channel.assertQueue("jobs");
        const queue2 = channel.assertQueue("jobs2");

        // assertExchange(<exchangeName>, <exchangetype>, args???)
        channel.assertExchange('logs', 'fanout', {durable: false});

        // bindQueue(<queueName>, <exchangeName>, <bindingkey>)
        // for fanout exchanges, last parameter (bindingKey) is not needed
        channel.bindQueue("jobs", "logs", "");

        // channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)));
        
        //second parameter specifies the queue to send to
        // publish(<exchange>, <message>)
        channel.publish('logs', '', Buffer.from('hello world'));
        

        console.log("----------------------------")
        console.log("message sent")
    }

    catch (ex){
        console.log(ex)
    }

}