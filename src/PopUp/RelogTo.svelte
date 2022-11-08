<script lang="ts">
    import {createEventDispatcher} from "svelte";

    let dispatch = createEventDispatcher();
    export let destination: string;
    import {sendMessageToWebsocket} from "../Webservice/store.js";
    import ModernDurakButton from "../component/ModernDurakButton.svelte";

    const lobby = () => {
        sendMessageToWebsocket(
            "RelogTo|" + JSON.stringify({wantsToRelog: false})
        );
        dispatch("stateMachineEvent", "LoginSuccess");
    };
    const backToCreateGameLobby = () => {
        sendMessageToWebsocket(
            "RelogTo|" + JSON.stringify({wantsToRelog: true})
        );
    };
</script>

<main>
    <h1 class="text-center text-lg font-bold">Do You Want Relog To {destination}?</h1>
    <ModernDurakButton onClick={lobby} buttonText="No"/>
    <ModernDurakButton onClick={backToCreateGameLobby} buttonText="Yes! Relog to {destination}"/>
</main>
