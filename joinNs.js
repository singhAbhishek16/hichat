    
function joinNs(endpoint){
    if(nsSocket){
        // to check if nsSocket is a socket
        nsSocket.close();
            // for removal of event listener before it's added again
        document.querySelector('#user-input').removeEventListener('submit',formSubmission)

    }
    nsSocket = io(`http://localhost:9001${endpoint}`);
    nsSocket.on('nsRoomLoad',(nsRooms)=>{
        console.log(nsRooms)
        let roomList = document.querySelector('.room-list');
        // let roomList = document.querySelector('.room-list');
        // console.log(roomList);
        roomList.innerHTML = "";
        nsRooms.forEach((room)=>{
            // console.log(room.roomList);
            var icon;
            console.log(room);
            if(room.privateRoom){
                icon = 'lock'
            }
            else{
                icon = 'globe'
            }   
            roomList.innerHTML += `<li class = "room"><span class='glyphicon glyphicon-${icon}'></span>${room.roomtitle }</li>`
            // roomList.innerHTML += `<li class = "room">${room.roomtitle }</li>`
            // add click listener to each room
            let roomNodes = document.getElementsByClassName('room');
            console.log(roomNodes);
            Array.from(roomNodes).forEach((elem)=>{
                elem.addEventListener('click',(e)=>{
                    console.log("Someone clicked on ",e.target.innerText);
                    joinRoom(e.target.innerText)    
                })

            })
        }) 
        const topRoom = document.querySelector('.room')
        const topRoomName = topRoom.innerText;
        console.log(topRoomName);
        joinRoom(topRoomName);

    })
        //to check action of SEND button and sending message to server

    
    nsSocket.on('messageToClients',(msg)=>{
        console.log(msg)
        const newMsg = buildHTML(msg);
        document.querySelector('#messages').innerHTML += newMsg
    });

        document.querySelector('.message-form').addEventListener('submit',formSubmission)

};

function formSubmission(event){
        event.preventDefault();
        //console.log("Form has been submitted")
        const newMessage = document.querySelector('#user-message').value;
        nsSocket.emit('newMessageToServer',{text: newMessage})
    }
function buildHTML(msg){
    const convertedDate = new Date(msg.time).toLocaleString();
    const newHTML = `
    <li>
        <div class="user-image">
            <img src="${msg.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time"><b>${msg.username}</b> <span>${convertedDate}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>`
    return newHTML;
}