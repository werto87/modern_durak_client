<script lang="ts">
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    export let destination: string;
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    const lobby = () => {
        sendMessageToWebsocket(
            "RelogTo|" + JSON.stringify({ wantsToRelog: false })
        );
        dispatch("stateMachineEvent", "LoginSuccess");
    };
    const backToCreateGameLobby = () => {
        sendMessageToWebsocket(
            "RelogTo|" + JSON.stringify({ wantsToRelog: true })
        );
    };
</script>

<main>
    <h1>Do You Want Relog To {destination}?</h1>
    <button on:click={lobby}>No</button>
    <button on:click={backToCreateGameLobby}>Yes! Relog to {destination}</button
    >
</main>

<style>
</style>
