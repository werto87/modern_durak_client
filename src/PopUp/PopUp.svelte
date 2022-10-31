<script lang="ts">
    import ModernDurakButton from "../component/ModernDurakButton.svelte";

    export let message: string;
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    const close = () => {
        dispatch("stateMachineEvent", "ClosePopUp");
    };
</script>

<main>
    <h1>{message}</h1>
    <ModernDurakButton onClick={close} buttonText="Close"/>
</main>

