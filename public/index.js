var socket;

document.addEventListener('DOMContentLoaded', () => {
    socket = io('http://localhost:3000');

    socket.on('connect', function() {
        console.log('Connected to server');
        socket.emit('data', 'data is emitted !')
    });

    socket.on('message', function(data) {
        document.getElementById('incomingMessage').innerHTML = "Message received from server: " + data
        console.log(data)
    });

    socket.on('incomingCall', async function(data) {
        document.getElementById('incomingMessage').innerHTML = 'Incoming call from: ' + data.data.replace(/\s/g, "")
        console.log(data)

        try {
            const notificationOptions =  {
                id: "12345",
                title: "Simple Notification",
                body: "This is a simple notification",
                icon: 'https://openfin.co/favicon.ico'
            };
    
            notifications.create(notificationOptions)
                .then((resp) => {
                    console.log(resp);
                })  
                .catch((err) => {
                    console.log('Error', err.message);
                });

            console.log('Notification sent.')

            // notifications.getAll().then(resp => {
            //     resp.json().then(notes => {
            //         if(notes.length > 0) {
            //             console.log(notes)
            //         }
            //         else {
            //             console.log('No notifications found.')
            //         }
            //     })
            // })
            
        } catch (error) {
            console.log(error.message)
        }
    });
})

const sendACK = () => {
    socket.emit('message', 'Hello from client');
}