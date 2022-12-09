<script>
  import { printCard, printType } from "../Board/helper.js";
  import Card from "../../component/Card.svelte";
  export let GameData = null;
</script>

<div class="">
  <p>Deck</p>
    {#if GameData.cardsInDeck>0}
      <div class="grid grid-cols-2">
      <p> Cards in Deck</p>
        <div class="flex items-center">
      <p > {GameData.cardsInDeck}</p>
        </div>
    </div>
        {/if}
    {#if GameData.cardsInDeck===0}
<!--    <div class="grid grid-cols-2">-->
     <p>Trump</p>
      <div
        class={GameData.trump === "hearts" || GameData.trump === "diamonds"
          ? "text-redCardValue"
          : "text-greenCardValue"}
      >
        {printType(GameData.trump)}
      </div>
<!--    </div>-->
        {/if}
    {#if GameData.lastCardInDeck}
        <div class="grid grid-cols-2">
            <p>Last Card in Deck</p>
            <div class="flex items-center">
        <Card
                className=""
                card={GameData.lastCardInDeck}
        />
            </div>
        </div>
    {/if}
</div>