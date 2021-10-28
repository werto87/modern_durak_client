<script>
    import { dndzone } from "svelte-dnd-action";
    import { flip } from "svelte/animate";
    const flipDurationMs = 200;

    export let dropFromOthersDisabled;
    export let cardToBeat;
    let items = [];

    export let cardBeatenCallback;
    function handleConsider(e) {
        items = e.detail.items;
    }
    function handleFinalize(e) {
        items = e.detail.items;
        if (items.length >= 1) {
            dropFromOthersDisabled = true;
            beaten = true;
            cardBeatenCallback(cardToBeat, items[0]);
        }
    }
    $: beaten = false;
    $: dropNotAllowed = dropFromOthersDisabled || beaten;
</script>

<div class="container">
    <div>
        {cardToBeat.value}
        {cardToBeat.type}
    </div>
    <section
        class:selected={beaten === true}
        use:dndzone={{
            items,
            flipDurationMs,
            dropFromOthersDisabled: dropNotAllowed,
            dropTargetClasses: ["drop"],
            dragDisabled: true,
        }}
        on:consider={handleConsider}
        on:finalize={handleFinalize}
    >
        {#each items as item (item.id)}
            <div animate:flip={{ duration: flipDurationMs }}>
                {item.value}
                {item.type}
            </div>
        {/each}
    </section>
</div>

<style>
    section {
        flex-grow: 1;
    }
    .selected {
        background-color: greenyellow;
    }
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
