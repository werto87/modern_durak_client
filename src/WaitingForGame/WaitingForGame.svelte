<script>
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    import { createEventDispatcher } from "svelte";
    import ModernDurakButton from "../component/ModernDurakButton.svelte";
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
    <div class="grid grid-cols-1 px-4 space-y-4">
        <h1 class="text-lg font-bold text-center">Waiting For Game</h1>
        {#if waitingState == "waitForGame"}
            <ModernDurakButton onClick={backLeaveQueueAndBackToLandingPage} buttonText="Cancel"/>
        {:else if waitingState == "waitForAnswer"}
            <h1 class="text-lg font-bold text-center">Game found do you want to join?</h1>
            <ModernDurakButton onClick={userPressedYes} buttonText="Yes"/>
            <ModernDurakButton onClick={userPressedNo} buttonText="No"/>
        {:else if waitingState == "retryAfterStartGameFailed"}
            <ModernDurakButton onClick={JoinMatchMakingQueue} buttonText="Join Quick Game Queue"/>
            <ModernDurakButton onClick={backToLandingPage} buttonText="Cancel"/>
        {/if}
    </div>

</main>

