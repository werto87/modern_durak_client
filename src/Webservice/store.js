import { writable } from 'svelte/store';

export const messageStore = writable('');

export const webSocket = new WebSocket('wss://modern-durak.com/wss');

// Connection opened
webSocket.addEventListener('open', function (event) {
	console.log("It's open");
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



