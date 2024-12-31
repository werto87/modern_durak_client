<script>
    import ModernDurakButton from "../component/ModernDurakButton.svelte";
    import { createEventDispatcher } from "svelte";
    import { sendMessageToWebsocket } from "../Webservice/store.js";
    let dispatch = createEventDispatcher();
    const cancel = () => {
        sendMessageToWebsocket("UnSubscribeGetLoggedInPlayers|{}");
        dispatch("stateMachineEvent", "Cancel");
    };
    export let players = [];
</script>

<div class="grid grid-cols-1 gap-4 ">
    <div class="ml-4 mr-4 grid grid-cols-1 gap-4">
        <h1 class="grow text-center text-lg font-bold">Logged in Players</h1>

        <table class="min-w-full table-auto border-collapse">
            <thead>
                <tr class="bg-gray-100">
                    <th
                        class="text-gray-700 px-4 py-2 text-left text-sm font-semibold"
                        >Name</th
                    >
                </tr>
            </thead>
            <tbody>
                {#each players as player}
                    <tr class="border-b">
                        <td class="px-4 py-2 text-sm text-greenCardValue"
                            >{player}</td
                        >
                    </tr>
                {/each}
            </tbody>
        </table>
        <div class="grid grid-cols-1 gap-4 ">
            <ModernDurakButton
                onClick={cancel}
                buttonText="Back to the Landing Page"
            />
        </div>
    </div>
</div>
