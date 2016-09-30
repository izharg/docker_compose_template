'use strict';

// RabbitMQ Setup
var amqp = require('amqp');
var connection = amqp.createConnection({ host: 'rabbit' });
var messages = []

connection.on('error', function(e) {
  console.log("Error from amqp: ", e);
});

connection.on('ready', function () {
  // Use the default 'amq.topic' exchange
  console.log("Connected to ampq");
  // connect to users queue
  connection.queue('users-queue', {'durable': true, 'autoDelete': false}, function (q) {
      console.log("Queue 'users' is open");
      // Subscribe to users queue
      q.subscribe(function (message, headers, deliveryInfo, messageObject) {
        // Print messages to stdout
        console.log('Got a message:');
        var data = message.data.toString();
        console.log(data);
        messages.push(JSON.parse(data));
      });
  });
});

// Server Setup
const express = require('express');

// Morgan Setup
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

// Constants
const PORT = 8080;

// App
const app = express();
app.get('/', function (req, res) {
  res.send(messages);
});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
