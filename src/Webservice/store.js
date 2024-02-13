import { writable } from "svelte/store";
export const isWebSocketConnected=writable(false);
export const messageStore = writable("");


function webSocketAddress() {
  console.log(process.env);
  // return process.env.NODE_ENV === "production" ||
  //   process.env.CONNECT_TO_PRODUCTION === "true"
  //   ? new WebSocket("wss://modern-durak.com/wss")
  //   :
  return  new WebSocket("wss://localhost:55555");
}
export const webSocket = webSocketAddress();

// Connection opened
webSocket.addEventListener("open", function (event) {
  isWebSocketConnected.set(true);
  console.log("It's open");
});
webSocket.addEventListener("error", function (event) {
  alert("Web Socket error please check connection to: " + event.target.url);
});

// Listen for messages
webSocket.addEventListener("message", function (event) {
  messageStore.update((messageStore) => [...messageStore, event.data]);
});
webSocket.addEventListener("close", function (event) {
  alert("Connection lost. Refresh to try to start a new game");
  isWebSocketConnected.set(false);
});

export const sendMessageToWebsocket = (message) => {
  process.env !== "production"
    ? console.log("send to matchmaking proxy: " + message)
    : [];
  if (webSocket.readyState <= 1) {
    webSocket.send(message);
  }
};
