<script>
    import {
        dndzone,
        TRIGGERS,
        SHADOW_ITEM_MARKER_PROPERTY_NAME,
    } from "svelte-dnd-action";
    export let items = [];
    export let cardDroppedToAttackCallback;
    function handleDndConsider(e) {
        console.warn(`got consider ${JSON.stringify(e.detail, null, 2)}`);
        const { trigger, id } = e.detail.info;
        if (trigger === TRIGGERS.DRAG_STARTED) {
            console.warn(`copying ${id}`);
            const idx = items.findIndex((item) => item.id === id);
            const newId = `${id}_copy_${Math.round(Math.random() * 100000)}`;
            e.detail.items.splice(idx, 0, { ...items[idx], id: newId });
        }
        items = e.detail.items;
    }
    function handleDndFinalize(e) {
        console.warn(`got finalize ${JSON.stringify(e.detail, null, 2)}`);
        items = e.detail.items;
        cardDroppedToAttackCallback(items[0]);
    }
</script>

<section
    use:dndzone={{
        items,
        dropTargetClasses: ["drop"],
        dragDisabled: true,
        morphDisabled: true,
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
>
    {#each items as item (item.id)}
        <div
            class={item.type === "hearts" || item.type === "diamonds"
                ? "redText"
                : "greenText"}
        >
            {#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
                <div class="custom-shadow-item" />
            {/if}
        </div>
    {/each}
</section>

<style>
    section {
        height: 100%;
    }

    :global(.custom-shadow-item) {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        visibility: visible;
        background-color: #0f292f;
        opacity: 0.5;
        margin: 0;
    }
</style>
