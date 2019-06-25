const express = require('express');                             //express brings http behind the scene
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');                  //bringing namespaces.js file
//console.log(namespaces[1]);


app.use(express.static(__dirname + '/public'));                 //bringing hichat.html, joinNs.js, joinRoom.js from
                                                                //PUBLIC folder
//defining the port.
const expressServer = app.listen(9001);
console.log("server listening to port 9001");
const io = socketio(expressServer);                             //io is the socket server, thats why it is used as io.on

//to send message to client after successful connection
io.on('connection',(socket)=>{                                  //here io.on has a built-in 'connection' event [not user defined]
    // console.log(socket.handshake)
    // building an array for sending image and endpoint of each namespace
    let nsData = namespaces.map((ns)=>{                         //nsData is array containing of image and endpoint of 
        return {                                                //each namespace. 
            img: ns.img,
            endpoint: ns.endpoint
        }
    })
    // console.log(nsData)
    // sending nsData back to client. Here we gotta use socket NOT io coz data has to be sent only to a particular client
    socket.emit('nsList',nsData);                               //send nsData array to hichat.html [line 100]

})
//loop through each namespace and listen for connection
namespaces.forEach((namespace)=>{
    io.of(namespace.endpoint).on('connection',(nsSocket)=>{
        const username = nsSocket.handshake.query.username;
        console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
        nsSocket.emit('nsRoomLoad',namespace.rooms)                                 //namespaces[0]
        nsSocket.on('joinRoom',(roomToJoin,numberOfUsersCallback)=>{
            // need to deal with history here
            console.log("Printing nsSocket.rooms");
            console.log(nsSocket.rooms);
            // leaving of previous room before joining the next room
            const roomToLeave = Object.keys(nsSocket.rooms)[1];
            console.log("Printing room to leave")
            console.log(roomToLeave);
            nsSocket.leave(roomToLeave);
            updateUsersInRoom(namespace, roomToLeave);

            
            nsSocket.join(roomToJoin);
            io.of(namespace.endpoint).in(roomToJoin).clients((error,clients)=>{                //'/wiki'
                console.log(clients.length)
                numberOfUsersCallback(clients.length); 
            })
                const nsRoom = namespace.rooms.find((room)=>{                       //namespaces[0]
                return room.roomTitle = roomToJoin;
            })
            nsSocket.emit('historyCatchUp', nsRoom.history)
            updateUsersInRoom(namespace, roomToJoin);
            
        })
        nsSocket.on('newMessageToServer',(msg)=>{
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: "./a.jpg"
            }
            console.log(fullMsg)
            console.log("Notice the below one")
            console.log(nsSocket.rooms)
            const roomTitle = Object.keys(nsSocket.rooms)[1];

            // To find out user's current room
            const nsRoom = namespace.rooms.find((room)=>{                       //namespaces[0]
                return room.roomTitle = roomTitle;
            })
            // console.log("This one: ")
            console.log(nsRoom)
            // For getting recent message history to server
            console.log("This gotta give the recent message sent:")
            nsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients',fullMsg)       //'/wiki'
        })
        
    })
})

function updateUsersInRoom(namespace, roomToJoin){
    // updating no. of members in DOM
            io.of(namespace.endpoint).in(roomToJoin).clients((error,clients)=>{                //'/wiki'
                console.log(`There are ${clients.length} clients in this room`);
                io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);    //'/wiki'
            })
}