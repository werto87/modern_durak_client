<script>
    import { sendMessageToWebsocket } from "../Webservice/store.js";
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
    const joinQuickGameQueue = () => {
        sendMessageToWebsocket("JoinQuickGameQueue|{}");
    };
    export let waitingState = "";
    //  waitForGame
    //  waitForAnswer
    // retryAfterStartGameFailed
</script>

<main>
    <!-- TODO add animtation while waiting -->
    <!-- TODO show accept and decline button when game is found -->
    <h1>Waiting For Game</h1>
    {#if waitingState == "waitForGame"}
        wait for game
    {:else if waitingState == "waitForAnswer"}
        wait for answer
        <h1>Game found do you want to join?</h1>
        <button on:click={userPressedYes}>Yes</button>
        <button on:click={userPressedNo}>No</button>
    {:else if waitingState == "retryAfterStartGameFailed"}
        retry after start game failed
        <button on:click={joinQuickGameQueue}>Join Quick Game Queue</button>
    {/if}
</main>

<style>
</style>
