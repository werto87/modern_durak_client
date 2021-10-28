<script>
    import { dndzone } from "svelte-dnd-action";
    import { allowedToPlayDefend } from "./helper.js";
    export let item;
    let items = [item];
    export let cardsToBeat;
    export let dropFromOthersDisabled;
    export let dragDisabled;
    export let trump;
    function handleConsider(e) {
        items = e.detail.items;
        if (e.detail.info.trigger == "draggedEntered") {
            let itemDragged = items.find((item) => {
                return item.id == e.detail.info.id;
            });
            if (itemDragged != undefined) {
                for (let [index, cardToBeat] of cardsToBeat.entries()) {
                    if (allowedToPlayDefend(cardToBeat, itemDragged, trump)) {
                        dropFromOthersDisabled[index] = false;
                    } else {
                        dropFromOthersDisabled[index] = true;
                    }
                }
            }
        }
    }
    function handleFinalize(e) {
        items = e.detail.items;
    }
</script>

<section
    use:dndzone={{
        items,
        dropFromOthersDisabled: true,
        dragDisabled,
    }}
    on:consider={handleConsider}
    on:finalize={handleFinalize}
>
    {#each items as item (item.id)}
        <div class:dragable={dragDisabled === false}>
            {item.value}
            {item.type}
        </div>
    {/each}
</section>

<style>
    section {
        width: 100%;
        height: 100%;
    }
    div {
        width: 100%;
        height: 100%;
        text-align: center;
    }
    .dragable {
        border-color: coral;
        border-width: 3px;
        border-style: solid;
    }
</style>
