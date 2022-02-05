const express = require('express');
const app = express();
const amqp = require('amqplib/callback_api');
const { type } = require('express/lib/response');

//API URL
// to add more inputs, chain /:<inputName>
app.get('/api/receiver/:queueID', (req,res) => {
    
    consume(req.params.queueID);
    res.send(`consumed message from queue: ${req.params.queueID}`);
    
});

// PORT
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening to port ${port}`));

async function consume(queueID){
    amqp.connect('amqp://localhost', (connError, connection) => {
        if (connError){
            throw connError;
        }
        // else, step 2: create channel
        connection.createChannel((channelError, channel) => {
            if(channelError){
                throw channelError;
            }
            channel.prefetch(1);
            
            // step 4: receive message
            channel.consume(queueID, (msg) => {
                console.log(`message received: ${msg.content}`)
            }, {
                //consume message
                noAck: true
            })
        })

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 20);
    })
}

