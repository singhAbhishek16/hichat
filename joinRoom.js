function joinRoom(roomName){
	nsSocket.emit('joinRoom',roomName,(newNumberOfMembers)=>{
		document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class='glyphicon glyphicon-user'></span>`
	})
	nsSocket.on('historyCatchUp',(history)=>{
		// this will print chat history in console window
		// console.log(history);
		// access messages id using messagesUl and run loop to each message to get chat history
		const messagesUl = document.querySelector('#messages');
		messagesUl.innerHTML = "";
		history.forEach((msg)=>{
			const newMsg = buildHTML(msg)
			const currentMessages = messagesUl.innerHTML;
			messagesUl.innerHTML = currentMessages + newMsg;
		})
		// to keep scroll bar at the bottom when new user joins
		messagesUl.scrollTo(0,messagesUl.scrollHeight);
	})
	// updating no. of members in current room
	nsSocket.on('updateMembers',(numMembers)=>{
		document.querySelector('.curr-room-num-users').innerHTML = `${numMembers} <span class='glyphicon glyphicon-user'></span>`
		document.querySelector('.curr-room-text').innerText = `${roomName}`
	})

	// let searchBox = document.querySelector('#search-box');
	// searchBox.addEventListener('input',(e)=>{
	// 	console.log(e.target.value)
	// 	let messages = Array.from(document.getElementsByClassName('message-text'));
	// 	console.log(messages);
	// 	messages.forEach(msg)=>{
	// 		if(msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) == -1){
	// 			// the msg doesn't contain user's search text
	// 			msg.style.display = "none";

	// 		}
			// else{
	// 			msg.style.display = "block";
	// 		}
	// 	}
	// })
};