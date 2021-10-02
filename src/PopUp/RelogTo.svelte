<script lang="ts">
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    export let destination: string;
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    const lobby = () => {
        sendMessageToWebsocket(
            "RelogTo|" + JSON.stringify({ wantsToRelog: false })
        );
        dispatch("stateMachineEvent", "Lobby");
    };
    const backToCreateGameLobby = () => {
        sendMessageToWebsocket(
            "RelogTo|" + JSON.stringify({ wantsToRelog: true })
        );
    };
</script>

<main>
    <h1>Relog To</h1>
    <button on:click={lobby}>Lobby</button>
    <button on:click={backToCreateGameLobby}>{destination}</button>
</main>

<style>
</style>
