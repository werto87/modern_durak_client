<script>
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    export let isRanked = false;
    const userPressedNo = () => {
        sendMessageToWebsocket(
            "WantsToJoinGame|" + JSON.stringify({ answer: false })
        );
    };
    const userPressedYes = () => {
        sendMessageToWebsocket(
            "WantsToJoinGame|" + JSON.stringify({ answer: true })
        );
    };
    const JoinMatchMakingQueue = () => {
        if (isRanked) {
            sendMessageToWebsocket('JoinMatchMakingQueue|{"isRanked": true}');
        } else {
            sendMessageToWebsocket('JoinMatchMakingQueue|{"isRanked": false}');
        }
    };
    const backLeaveQueueAndBackToLandingPage = () => {
        sendMessageToWebsocket("LeaveQuickGameQueue|{}");
    };
    const backToLandingPage = () => {
        dispatch("stateMachineEvent", "LandingPage");
    };
    export let waitingState = "";
    //  waitForGame
    //  waitForAnswer
    // retryAfterStartGameFailed
</script>

<main>
    <!-- TODO add animtation while waiting -->
    <!-- TODO add cancel button -->
    <h1>Waiting For Game</h1>
    {#if waitingState == "waitForGame"}
        <button on:click={backLeaveQueueAndBackToLandingPage}>Cancel</button>
    {:else if waitingState == "waitForAnswer"}
        <h1>Game found do you want to join?</h1>
        <button on:click={userPressedYes}>Yes</button>
        <button on:click={userPressedNo}>No</button>
    {:else if waitingState == "retryAfterStartGameFailed"}
        <button on:click={JoinMatchMakingQueue}>Join Quick Game Queue</button>
        <button on:click={backToLandingPage}>Cancel</button>
    {/if}
</main>

<style>
</style>
