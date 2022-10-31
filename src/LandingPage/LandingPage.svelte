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


    <div class="p-8 bg-amber-300">
        <div class="grid grid-cols-1 ">
            <h1 class="text-center">Chose Game Mode</h1>
            <button class="btn btn-blue" on:click={quickPressed}>Quick</button>
            <button on:click={rankedPressed}>Ranked</button>
            <button on:click={puzzlePressed}>Puzzle</button>
            <button on:click={customPressed}>Custom</button>
            {#if loginState}
                <button on:click={logout}>Logout</button>
            {:else}
                <button on:click={login}>Login</button>
            {/if}
        </div>
    </div>


<style>
    .btn {
        @apply font-bold py-2 px-4 rounded;
    }
    .btn-blue {
        @apply bg-blue-500 text-white;
    }
    .btn-blue:hover {
        @apply bg-blue-700;
    }
</style>