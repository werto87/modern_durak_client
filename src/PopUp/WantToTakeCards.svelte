<script lang="ts">
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    const lobby = () => {
        sendMessageToWebsocket(
            'DurakAskDefendWantToTakeCardsAnswer|{"answer":false}'
        );
        dispatch("stateMachineEvent", "ClosePopUp");
    };
    const backToCreateGameLobby = () => {
        sendMessageToWebsocket(
            'DurakAskDefendWantToTakeCardsAnswer|{"answer":true}'
        );
        dispatch("stateMachineEvent", "ClosePopUp");
    };
</script>

<main>
    <h1>Attack is over do you want to?</h1>
    <button on:click={lobby}>Discard Cards from Table</button>
    <button on:click={backToCreateGameLobby}>Take Cards from Table</button>
</main>

<style>
</style>
