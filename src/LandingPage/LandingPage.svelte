<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let isLoggedIn: boolean = false;
    let dispatch = createEventDispatcher();
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    const quickPressed = () => {
        if (!isLoggedIn) {
            sendMessageToWebsocket("LoginAsGuest|{}");
        }
        dispatch("stateMachineEvent", "Quick");
        sendMessageToWebsocket("JoinQuickGameQueue|{}");
    };
    const rankedPressed = () => {
        dispatch("stateMachineEvent", "Ranked");
    };
    const puzzlePressed = () => {
        dispatch("stateMachineEvent", "Puzzle");
    };
    const customPressed = () => {
        if (!isLoggedIn) {
            sendMessageToWebsocket("LoginAsGuest|{}");
        }
        dispatch("stateMachineEvent", "Custom");
    };
    const login = () => {
        dispatch("stateMachineEvent", "LandingPageLogin");
    };
</script>

<main>
    <div class="grid-container">
        <div class="grid-header" id="grid-item0">
            <h1>Chose Game Mode</h1>
        </div>
        <button on:click={quickPressed}>Quick</button>
        <button disabled on:click={rankedPressed}>Ranked</button>
        <button disabled on:click={puzzlePressed}>Puzzle</button>
        <button on:click={customPressed}>Custom</button>
        <button on:click={login}>Login</button>
    </div>
</main>

<style>
</style>
