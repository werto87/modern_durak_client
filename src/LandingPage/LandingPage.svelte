<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { v4 as uuidv4 } from 'uuid';

    export let loginState: string = null;
    let dispatch = createEventDispatcher();
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    const quickPressed = () => {
        if (!loginState) {
            sendMessageToWebsocket("LoginAsGuest|{}");
        }
        dispatch("stateMachineEvent", "Quick");
        sendMessageToWebsocket('JoinMatchMakingQueue|{"isRanked": false}');
    };
    const rankedPressed = () => {
        if (loginState != "registered") {
            dispatch("stateMachineEvent", "RankedLogin");
        } else {
            dispatch("stateMachineEvent", "Ranked");
            sendMessageToWebsocket('JoinMatchMakingQueue|{"isRanked": true}');
        }
    };
    const puzzlePressed = () => {
        if (!loginState) {
            sendMessageToWebsocket("LoginAsGuest|{}");
        }
        sendMessageToWebsocket("CreateGameLobby|"+ "{\"name\":\""+ uuidv4()+"\",\"password\":\"\"}")
        dispatch("stateMachineEvent", "CreatePuzzle");
    };
    const customPressed = () => {
        if (!loginState) {
            sendMessageToWebsocket("LoginAsGuest|{}");
        }
        dispatch("stateMachineEvent", "Custom");
    };
    const login = () => {
        dispatch("stateMachineEvent", "LandingPageLogin");
    };
    const logout = () => {
        sendMessageToWebsocket("LogoutAccount|{}");
    };
</script>

<main>
    <div class="grid-container">
        <div class="grid-header" id="grid-item0">
            <h1>Chose Game Mode</h1>
        </div>
        <button on:click={quickPressed}>Quick</button>
        <button on:click={rankedPressed}>Ranked</button>
        <button on:click={puzzlePressed}>Puzzle</button>
        <button on:click={customPressed}>Custom</button>
        {#if loginState}
            <button on:click={logout}>Logout</button>
        {:else}
            <button on:click={login}>Login</button>
        {/if}
    </div>
</main>

<style>
</style>
