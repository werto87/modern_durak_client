<script>
  import { printCard, printType } from "../Board/helper.js";
  import Card from "../../component/Card.svelte";
  export let GameData = null;
</script>

<div class="flex space-x-2">
  {#if GameData.cardsInDeck > 0}
    <div>
      Cards in Deck {GameData.cardsInDeck}
    </div>
  {/if}
  {#if GameData.cardsInDeck === 0}
    <div class="flex space-x-2">
      <div>Trump</div>
      <div
        class={GameData.trump === "hearts" || GameData.trump === "diamonds"
          ? "text-redCardValue"
          : "text-greenCardValue"}
      >
        {printType(GameData.trump)}
      </div>
    </div>
  {/if}
  {#if GameData.lastCardInDeck}
    <div class="flex space-x-2">
      <div>Last Card in Deck</div>
      <Card className="" card={GameData.lastCardInDeck} />
    </div>
  {/if}
</div>
