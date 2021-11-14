<script>
    import {
        dndzone,
        SHADOW_ITEM_MARKER_PROPERTY_NAME,
    } from "svelte-dnd-action";
    import { printCard } from "./helper.js";

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
    <div
        class={cardToBeat.type === "hearts" || cardToBeat.type === "diamonds"
            ? "redText"
            : "greenText"}
    >
        {printCard(cardToBeat)}
    </div>
    <section
        use:dndzone={{
            items,
            dropFromOthersDisabled: dropNotAllowed,
            dropTargetClasses: ["drop"],
            dragDisabled: true,
        }}
        on:consider={handleConsider}
        on:finalize={handleFinalize}
    >
        {#each items as item (item.id)}
            <div class="fillDiv">
                <div
                    class={item.type === "hearts" || item.type === "diamonds"
                        ? "redText"
                        : "greenText"}
                >
                    {item.value}
                    {item.type}
                    {#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
                        <div class="custom-shadow-item" />
                    {/if}
                </div>
            </div>
        {/each}
    </section>
</div>

<style>
    section {
        flex-grow: 1;
    }
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .fillDiv {
        height: var(--itemHeight);
        width: var(--itemWidth);
    }
</style>
