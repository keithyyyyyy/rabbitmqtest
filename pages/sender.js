const amqp = require('amqplib/callback_api');

// step 1: connect to rabbitmq management
// change localhost when loading to cloud
amqp.connect('amqp://localhost', (connError, connection) => {
    if (connError){
        throw connError;
    }
    // else, step 2: create channel
    connection.createChannel((channelError, channel) => {
        if(channelError){
            throw channelError;
        }
        // else, step 3: assert queue (check if the queue is present in rabbitmq, else create the queue)
        const queue = 'queue1';
        channel.assertQueue(queue);
        // step 4: send message to queue
        // this is an async fire and forget
        channel.sendToQueue(queue, Buffer.from('test message'));
        console.log('---------------------');
        console.log(`message sent to  ${queue}`);
    })
})