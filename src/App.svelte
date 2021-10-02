<script>
	import { interpret } from "xstate";
	import { toggleMachine } from "./machine";
	import Error from "./PopUp/Error.svelte";

	const toggleService = interpret(toggleMachine)
		.onTransition((state) => {
			console.log("Screen: " + state.value.Screens);
		})
		.start();
	const stateMachineEvent = (e) => {
		console.log("event: " + e.detail);
		toggleService.send(e.detail);
	};
	import { webSocket } from "./Webservice/store.js";
	webSocket.addEventListener("message", function (event) {
		console.log("webservice message: " + event.data);
		const words = event.data.split("|");
		if (words.length == 2) {
			if (words[0].includes("Error")) {
				const someValue = JSON.parse(words[1]);
				someValue["type"] = "GenericError";
				toggleService.send(someValue);
			} else {
				const someValue = JSON.parse(words[1]);
				someValue["type"] = words[0];
				toggleService.send(someValue);
			}
		} else {
			console.log(
				"Message from server is not valid." +
					"It should have exactly one '|' symbol message: " +
					event.data
			);
		}
	});
	// import { sendMessageToWebsocket } from "./Webservice/store.js";
	// let message;

	// function onSendMessage() {
	// 	if (message.length > 0) {
	// 		sendMessageToWebsocket(message);
	// 		message = "";
	// 	}
	// }

	//TODO fix problems with autofill passwords
</script>

<main>
	{#if $toggleService.context.popUp}
		<svelte:component
			this={$toggleService.context.popUp}
			{...$toggleService.context.popUpProps}
			on:stateMachineEvent={stateMachineEvent}
		/>
	{:else}
		<svelte:component
			this={$toggleService.context.component}
			{...$toggleService.context.props}
			on:stateMachineEvent={stateMachineEvent}
		/>
	{/if}
	<Error errors={$toggleService.context.errors} />

	<!-- {#if $toggleService.context.accountName}
		<p>{$toggleService.context.accountName}</p>
	{/if} -->
</main>

<style>
	/* main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	} */

	/* h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	} */

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
