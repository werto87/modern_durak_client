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
        <p class="cardText">{printCard(cardToBeat)}</p>
        <p />
    </div>
    <section
        use:dndzone={{
            items,
            dropFromOthersDisabled: dropNotAllowed,
            dropTargetClasses: ["drop"],
            dragDisabled: true,
            morphDisabled: true,
        }}
        on:consider={handleConsider}
        on:finalize={handleFinalize}
    >
        {#each items as item (item.id)}
            <div
                class={item.type === "hearts" || item.type === "diamonds"
                    ? "redText"
                    : "greenText"}
            >
                <p class="cardText">{printCard(item)}</p>
                <p />
                {#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
                    <div class="custom-shadow-item" />
                {/if}
            </div>
        {/each}
    </section>
</div>

