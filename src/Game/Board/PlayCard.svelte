<script>
    import { dndzone, TRIGGERS } from "svelte-dnd-action";
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
    }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
>
    {#each items as item (item.id)}
        <div />
    {/each}
</section>

<style>
    section {
        height: 100%;
    }
</style>
