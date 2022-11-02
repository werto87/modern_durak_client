<script>
    import cardDeckIcon from "../../asset/icons/deck.svg";
    import {printCard, printType} from "../Board/helper.js";
    import Card from "../../component/Card.svelte";

    export let GameData = null;
</script>

<div id="cardsInDeckContainer">
    {#if GameData.cardsInDeck > 1}
        <div class="deckContainer">
            <span class="deckIcon">
                {@html cardDeckIcon}
                <p class="cardDeckCount">{GameData.cardsInDeck}</p>
            </span>

            {#if GameData.lastCardInDeck}
                <div class="lastCardInDeck">
                    <Card card={GameData.lastCardInDeck}/>
                </div>
            {/if}
        </div>
    {:else if GameData.lastCardInDeck}
        <div class="onlyOneCardInDeck">
            <Card card={GameData.lastCardInDeck}/>
        </div>
    {:else}
        <p>
            Trump:&nbsp;
            <span
                    class={GameData.trump === "hearts" ||
                GameData.trump === "diamonds"
                    ? "text-red-500"
                    : "text-green-500"}
            >
                {printType(GameData.trump)}
            </span>
        </p>
    {/if}
</div>

