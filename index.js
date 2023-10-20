const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;
const socket = require('socket.io');
var cors = require('cors');

const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));

// Parse incoming POST params with Express middleware
app.use(urlencoded({ extended: false }));

io.on('connection', function (socket) {
  console.log('Client made socket connection');
  setTimeout(function () {
    socket.send('Sent a message 4seconds after connection!');
  }, 4000);

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

  socket.on('message', function (data) {
    console.log('Received message from client:', data);
  });

  // listen for incoming data msg on this newly connected socket
  socket.on('data', function (data) {
    console.log(`data received is '${data}'`);
  });
});

// Test GET
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
app.post('/voice', (request, response) => {
  // Get information about the incoming call
  console.log(request.body);
  const city = request.body.FromCity;
  const phoneNumber = request.body.From.slice(1).split('').join(' ');

  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();
  try {
    io.emit('incomingCall', { data: phoneNumber });
  } catch (error) {
    console.log(error.message);
  }

  twiml.say(
    { voice: 'Polly.Amy', loop: 1 },
    `You are calling from ${phoneNumber}. `
  );

  twiml.say({ voice: 'Polly.Amy', loop: 1 }, 'Please enjoy our music.');
  twiml.play({}, 'https://demo.twilio.com/docs/classic.mp3');

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

// Create an HTTP server and listen for requests on port 3000
// const server = app.listen(5500, () => {
//   console.log('Now listening on port 5500. ');
// });

http.listen(3000, function () {
  console.log('listening on *:3000');
});

module.exports = http;
