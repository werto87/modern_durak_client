<script>
  import cardDeckIcon from "../../asset/icons/deck.svg";
  import { printCard, printType } from "../Board/helper.js";
  import Card from "../../component/Card.svelte";
  import Deck from "../../component/Deck.svelte";
  export let GameData = null;
</script>

<div class="">
  {#if GameData.cardsInDeck > 1}
    <div class="grid grid-cols-2">
      <div class="relative">
        <div class="flex justify-center">
            <Deck></Deck>
        </div>
        <p class="absolute inset-0 flex items-center justify-center">
          {GameData.cardsInDeck}
        </p>
      </div>
      {#if GameData.lastCardInDeck}
        <Card className="flex items-center justify-center" card={GameData.lastCardInDeck} />
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
