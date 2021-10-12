<script lang="ts">
    export let message: string;
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    const close = () => {
        dispatch("stateMachineEvent", "ClosePopUp");
    };
</script>

<main>
    <h1>{message}</h1>
    <button on:click={close}>Close</button>
</main>

