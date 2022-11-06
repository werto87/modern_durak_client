<script>
    import {
        dndzone,
        SHADOW_ITEM_MARKER_PROPERTY_NAME,
    } from "svelte-dnd-action";
    import {printCard} from "./helper.js";

    export let className = "";
    import Card from "../../component/Card.svelte";

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

<section class={className}
         use:dndzone={{
            items,
            dropFromOthersDisabled: dropNotAllowed,
            dropTargetClasses: ["bg-orange-500"],
            dragDisabled: true,
            morphDisabled: true,
        }}
         on:consider={handleConsider}
         on:finalize={handleFinalize}
>
    <div></div>
</section>

<style>
</style>