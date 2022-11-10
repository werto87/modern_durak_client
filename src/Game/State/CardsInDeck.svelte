<script>
  import cardDeckIcon from "../../asset/icons/deck.svg";
  import { printCard, printType } from "../Board/helper.js";
  import Card from "../../component/Card.svelte";
  import Deck from "../../component/Deck.svelte";
  export let GameData = null;
</script>

<div class="">
  <p>Deck</p>
  {#if GameData.cardsInDeck > 1}
    <div class="grid grid-cols-2">
      <div class="relative">
        <div class="flex justify-center">
          <Deck />
        </div>
        <p class="absolute inset-0 flex items-center justify-center">
          {GameData.cardsInDeck}
        </p>
      </div>
      {#if GameData.lastCardInDeck}
        <Card
          className="flex items-center justify-center"
          card={GameData.lastCardInDeck}
        />
      {/if}
    </div>
  {:else if GameData.lastCardInDeck}
    <div class="col-span-full text-center">
      <Card card={GameData.lastCardInDeck} />
    </div>
  {:else}
    <div class="grid grid-cols-2">
     <p> Trump:&nbsp;</p>
      <div
        class={GameData.trump === "hearts" || GameData.trump === "diamonds"
          ? "text-red-500"
          : "text-green-500"}
      >
        {printType(GameData.trump)}
      </div>
    </div>
  {/if}
</div>

<style>
</style>
