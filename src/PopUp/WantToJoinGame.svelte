<script>
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    import { toast } from "@zerodevx/svelte-toast";
    import ModernDurakButton from "../component/ModernDurakButton.svelte";
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

    <h1 class="text-lg font-bold text-center">Game found do you want to join?</h1>
    <ModernDurakButton onClick={userPressedYes} buttonText="Yes"/>
    <ModernDurakButton onClick={userPressedNo} buttonText="No"/>
</main>


