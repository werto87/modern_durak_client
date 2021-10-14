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
    <div class="grid-container">
        <div class="grid-header" id="grid-item0">
            <h1>Chose Game Mode</h1>
        </div>
        <div class="grid-item">
            <button on:click={quickPressed} id="grid-item1">Quick</button>
        </div>
        <div class="grid-item">
            <button on:click={rankedPressed} id="grid-item2">Ranked</button>
        </div>
        <div class="grid-item">
            <button on:click={puzzlePressed} id="grid-item3">Puzzle</button>
        </div>
        <div class="grid-item">
            <button on:click={customPressed} id="grid-item4">Custom</button>
        </div>
    </div>
</main>

<style>
    .grid-container {
        box-sizing: border-box;
        display: grid;
        grid-template-rows: 28fr 72fr;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        grid-gap: 7px;
    }

    .grid-item {
        display: grid;
        height: 288px;
    }

    .grid-header {
        display: grid;
        grid-column: 1/5;
        place-self: center;
    }
</style>
