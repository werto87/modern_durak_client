<script>
  import {
    dndzone,
    TRIGGERS,
    SHADOW_ITEM_MARKER_PROPERTY_NAME,
  } from "svelte-dnd-action";
  import Card from "../../component/Card.svelte";

  export let className = "";
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
    items = [];
  }
</script>

<section
  class={className}
  use:dndzone={{
    items,
    dropTargetClasses: ["border-2.bg-cardBackground"],
    dropTargetStyle: { outline: "rgba(255, 170, 0, 1) solid 10px" },
    dragDisabled: true,
    morphDisabled: true,
  }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>
  {#each items as item (item.id)}
    <Card className="h-20 sm:h-40 bg-cardBackground sm:w-24 w-14" card={item} />
  {/each}
</section>
