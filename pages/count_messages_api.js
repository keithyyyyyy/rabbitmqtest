const amqp = require('amqplib/callback_api');
const express = require('express');
const app = express();

app.get('/api/waitTime/:queueID', (req,res) => {
    
    consume(req.params.queueID);
    res.send(`consumed message from queue: ${req.params.queueID}`);
    
});

// PORT
const port = process.env.PORT || 3002;
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
                channel.checkQueue(queueID, function(err,ok) {
                    console.log(ok.messageCount);
                });
            })

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 20);
    })
}