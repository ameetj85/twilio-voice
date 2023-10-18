var app = require('express')();
var http = require('http').Server(app);
// var io = require('socket.io')(http);
var io = require('socket-io')(http);
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;

// Parse incoming POST params with Express middleware
app.use(urlencoded({ extended: false }));

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
app.post('/voice', (request, response) => {

    // Get information about the incoming call
    console.log(request.body);
    const city = request.body.FromCity;
    const phoneNumber = request.body.From.slice(1).split('').join(' ');
  
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new VoiceResponse();
    twiml.say(
      { voice: 'Polly.Amy', loop: 1 },
      `You are calling from ${phoneNumber}. `
    );
  
    twiml.say(
      { voice: 'Polly.Amy', loop: 1 },
      'Please enjoy our music.'
    );
    twiml.play({}, 'https://demo.twilio.com/docs/classic.mp3');
  
    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
  });

//Whenever someone connects this gets executed
io.on('connection', function(socket){
   console.log('A user connected');
   
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});
http.listen(3000, function(){
   console.log('listening on *:3000');
});