<script>
    import { dndzone } from "svelte-dnd-action";

    let items = [];
    export let cardDroppedToAttackCallback;
    function handleConsider(e) {
        items = e.detail.items;
    }
    function handleFinalize(e) {
        items = e.detail.items;
        console.log("played card " + items[items.length - 1]);
        cardDroppedToAttackCallback(items[items.length - 1]);
    }
</script>

<section
    use:dndzone={{
        items,
        dropTargetClasses: ["drop"],
        dragDisabled: true,
    }}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
>
    <div />
</section>

<style>
    section {
        height: 100%;
    }
</style>
