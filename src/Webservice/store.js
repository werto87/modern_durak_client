import { writable } from 'svelte/store';
export const messageStore = writable('');


export const webSocket = new WebSocket('wss://modern-durak.com/wss');
// export const webSocket = new WebSocket('wss://localhost:55555');

// Connection opened
webSocket.addEventListener('open', function (event) {
	console.log("It's open");
});
webSocket.addEventListener('error', function (event) {
	alert("Web Socket error please check connection to: " + event.target.url);
});

// Listen for messages
webSocket.addEventListener('message', function (event) {
	messageStore.update(messageStore => [...messageStore, event.data]);
});


export const sendMessageToWebsocket = (message) => {
	if (webSocket.readyState <= 1) {
		webSocket.send(message);
	}
}



