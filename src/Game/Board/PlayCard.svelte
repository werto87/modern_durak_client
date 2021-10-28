<script>
    import { dndzone } from "svelte-dnd-action";
    const flipDurationMs = 200;
    let items = [];
    export let cardDroppedToAttackCallback;
    let currentItem;
    function handleConsider(e) {
        // TODO sometimes still cards disapear :(
        if (e?.detail?.items[0] != undefined) {
            currentItem = e.detail.items[0];
        }
    }
    function handleFinalize(e) {
        console.log("played card " + currentItem);
        cardDroppedToAttackCallback(currentItem);
    }
</script>

<section
    use:dndzone={{
        items,
        flipDurationMs,
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
