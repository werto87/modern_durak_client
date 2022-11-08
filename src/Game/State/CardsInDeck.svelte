<script>
  import cardDeckIcon from "../../asset/icons/deck.svg";
  import { printCard, printType } from "../Board/helper.js";
  import Card from "../../component/Card.svelte";

  export let GameData = null;
</script>

<div class="">
  {#if GameData.cardsInDeck > 1}
    <div class="grid grid-cols-2 pt-2">
      <div class="relative">
        <div class="absolute inset-0 flex items-center justify-center">
          {@html cardDeckIcon}
        </div>
        <p class="absolute inset-0 flex items-center justify-center">
          {GameData.cardsInDeck}
        </p>
      </div>
      {#if GameData.lastCardInDeck}
        <Card className="text-center" card={GameData.lastCardInDeck} />
      {/if}
    </div>
  {:else if GameData.lastCardInDeck}
    <div class="col-span-full text-center">
      <Card card={GameData.lastCardInDeck} />
    </div>
  {:else}
    <p>
      Trump:&nbsp;
      <span
        class={GameData.trump === "hearts" || GameData.trump === "diamonds"
          ? "text-red-500"
          : "text-green-500"}
      >
        {printType(GameData.trump)}
      </span>
    </p>
  {/if}
</div>

<style>
</style>
