<script>
	import { interpret } from "xstate";
	import { toggleMachine } from "./machine";
	import Error from "./PopUp/Error.svelte";

	import Grid from "svelte-grid";
	import gridHelp from "svelte-grid/build/helper/index.mjs";

	const id = () => "_" + Math.random().toString(36).substr(2, 9);

	let items = [
		gridHelp.item({ x: 0, y: 0, w: 2, h: 2, id: id() }),
		gridHelp.item({ x: 2, y: 0, w: 2, h: 2, id: id() }),
	];

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
	let selectedCards = [];
</script>

<main>
	<div class="my-container">
		{#if $toggleService.context.popUp}
			<svelte:component
				this={$toggleService.context.popUp}
				class="mainScreen"
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
	</div>
</main>

<style>
	:global(.my-container) {
		width: 75%;
		display: inline-block;
		box-sizing: border-box;
	}

	:global(input[type="number"]:enabled) {
		background: #0e3b93;
		color: #4ed93f;
		width: 100%;
	}
	:global(input[type="number"]:disabled) {
		background: #cccccc;
		color: #cb2d6f;
		width: 100%;
	}
	:global(select:enabled) {
		background: #0e3b93;
		color: #4ed93f;
		width: 100%;
	}
	:global(select:disabled) {
		background: #cccccc;
		color: #cb2d6f;
		width: 100%;
	}

	:global(main) {
		/* background: #0f292f; */
		text-align: center;
		color: white;
		font-family: Open Sans;
		font-size: 30px;
	}
	:global(body) {
		padding: 0;
		background-color: #0f292f;
		/* #501f3a #cb2d6f #cccccc #14a098 #0f292f */
	}

	:global(.mainScreen) {
		padding: 0;
	}
	:global(h1) {
		font-size: 40px;
	}
	:global(button) {
		background: #0e3b93;
		color: #4ed93f;
		/* color: #cb2d6f; DO NOT DELETE THIS: SECOND BUTTON TEXT COLOR */
		height: 100%;
		width: 100%;
		border-width: 3px;
		border-color: #cccccc;
		/* border-color: #ffaa00; DO NOT DELETE THIS: SECOND BORDER COLOR  */
		font-size: 30px;
		border-radius: 5%;
		word-break: break-word;
	}
	:global(.form-field:focus) {
		width: 100%;
		border-width: 3px;
		border-radius: 5%;
		border-color: #cccccc;
	}
	:global(.form-error) {
		width: 100%;
		color: #ff3e00;
	}
	:global(.form-field) {
		width: 100%;
		background: #0e3b93;
		color: #4ed93f;
		border-radius: 5%;
		border-width: 3px;
		border-color: #cccccc;
	}
	:global(label) {
		text-align: left;
	}
</style>
