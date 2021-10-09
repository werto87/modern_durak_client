<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let isLoggedIn: boolean = false;
    let dispatch = createEventDispatcher();
    const quickPressed = () => {
        dispatch("stateMachineEvent", "Quick");
    };
    const rankedPressed = () => {
        dispatch("stateMachineEvent", "Ranked");
    };
    const puzzlePressed = () => {
        dispatch("stateMachineEvent", "Puzzle");
    };
    const customPressed = () => {
        console.log(isLoggedIn);
        if (isLoggedIn) {
            dispatch("stateMachineEvent", "Custom");
        } else {
            dispatch("stateMachineEvent", "CustomLogin");
        }
    };
</script>

<main>
    <h1>Chose Game Mode</h1>
    <button on:click={quickPressed}>Quick</button><br />
    <button on:click={rankedPressed}>Ranked</button><br />
    <button on:click={puzzlePressed}>Puzzle</button><br />
    <button on:click={customPressed}>Custom</button><br />
</main>

<style>
</style>
