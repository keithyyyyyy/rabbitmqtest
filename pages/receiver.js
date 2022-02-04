const amqp = require('amqplib/callback_api');

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
            const queue = 'doctor';
            channel.assertQueue(queue);
            channel.prefetch(1);
            
            // step 4: receive message
            channel.consume(queue, (msg) => {
                console.log(`message received: ${msg.content}`)
            }, {
                //consume message
                noAck: false
            })
        })

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 20);
    })