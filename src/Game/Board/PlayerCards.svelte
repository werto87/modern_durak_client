<script>
    import {allowedToPlayDefend} from "./helper.js";
    import {printCard} from "./helper.js";
    import {
        dndzone,
        TRIGGERS,
        SHADOW_ITEM_MARKER_PROPERTY_NAME,
    } from "svelte-dnd-action";
    import Card from "../../component/Card.svelte";

    export let item;
    export let trump;
    export let cardsToBeat;
    export let dropFromOthersDisabled;
    export let dragDisabled;
    let items = [item];
    let shouldIgnoreDndEvents = false;

    function handleDndConsider(e) {
        const {trigger, id} = e.detail.info;
        if (trigger === TRIGGERS.DRAG_STARTED) {
            const idx = items.findIndex((item) => item.id === id);
            const newId = `${id}_copy_${Math.round(Math.random() * 100000)}`;
            e.detail.items = e.detail.items.filter(
                (item) => !item[SHADOW_ITEM_MARKER_PROPERTY_NAME]
            );
            e.detail.items.splice(idx, 0, {...items[idx], id: newId});
            items = e.detail.items;
            shouldIgnoreDndEvents = true;
            let itemDragged = items[0];
            if (itemDragged != undefined) {
                for (let [index, cardToBeat] of cardsToBeat.entries()) {
                    if (allowedToPlayDefend(cardToBeat, itemDragged, trump)) {
                        dropFromOthersDisabled[index] = false;
                    } else {
                        dropFromOthersDisabled[index] = true;
                    }
                }
            }
        } else if (!shouldIgnoreDndEvents) {
            items = e.detail.items;
        } else {
            items = [...items];
        }
    }

    function handleDndFinalize(e) {
        console.warn(`got finalize ${JSON.stringify(e.detail, null, 2)}`);
        if (!shouldIgnoreDndEvents) {
            items = e.detail.items;
        } else {
            items = [...items];
            shouldIgnoreDndEvents = false;
        }
    }
</script>
<section
        use:dndzone={{
        items,
        dropFromOthersDisabled: true,
        dragDisabled,
        dropTargetClasses: ["drop"],
    }}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}
>
    {#each items as item (item.id)}
        <Card className="h-20" card={item}/>
    {/each}
</section>

