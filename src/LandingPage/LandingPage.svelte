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
        if (!isLoggedIn) {
            dispatch("stateMachineEvent", "RankedLogin");
        } else {
            dispatch("stateMachineEvent", "Ranked");
        }
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
        <button disabled on:click={puzzlePressed}>Puzzle</button>
        <button on:click={customPressed}>Custom</button>
        {#if isLoggedIn}
            <button on:click={logout}>Logout</button>
        {:else}
            <button on:click={login}>Login</button>
        {/if}
    </div>
</main>

<style>
</style>
