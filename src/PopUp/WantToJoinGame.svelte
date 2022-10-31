<script>
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    import { toast } from "@zerodevx/svelte-toast";
    const userPressedNo = () => {
        toast.pop();
        sendMessageToWebsocket(
            "WantsToJoinGame|" + JSON.stringify({ answer: false })
        );
    };
    const userPressedYes = () => {
        toast.pop();
        sendMessageToWebsocket(
            "WantsToJoinGame|" + JSON.stringify({ answer: true })
        );
    };
</script>

<main>
    <!-- TODO add animtation while waiting -->

    <h1>Game found do you want to join?</h1>
    <button on:click={userPressedYes}>Yes</button>
    <button on:click={userPressedNo}>No</button>
</main>


