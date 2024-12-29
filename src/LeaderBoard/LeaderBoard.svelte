<script>
    import ModernDurakButton from "../component/ModernDurakButton.svelte";
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    const cancel = () => {
        dispatch("stateMachineEvent", "Cancel");
    };
</script>

<div class="grid grid-cols-1 gap-4 ">
    <div class="ml-4 mr-4 grid grid-cols-1 gap-4">
        <div>
            <h1 class="grow text-center text-lg font-bold">Leader Board</h1>
            <span>TODO put the top players here</span>
            <div class="grid grid-cols-1 gap-4 ">
                <ModernDurakButton
                    onClick={cancel}
                    buttonText="Back to the Landing Page"
                />
            </div>
        </div>
    </div>
</div>
