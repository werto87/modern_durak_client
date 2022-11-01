<script>
    import cardDeckIcon from "../../asset/icons/deck.svg";
    import { printCard, printType } from "../Board/helper.js";
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
                        <span
                            class={GameData.lastCardInDeck.type === "hearts" ||
                            GameData.lastCardInDeck.type === "diamonds"
                                ? "text-red-500"
                                : "text-green-500"}
                        >
                            <p class="cardText">
                                {printCard(GameData.lastCardInDeck)}
                            </p>
                        </span>
                </div>
            {/if}
        </div>
    {:else if GameData.lastCardInDeck}
        <div class="onlyOneCardInDeck">
                <span
                    class={GameData.lastCardInDeck.type === "hearts" ||
                    GameData.lastCardInDeck.type === "diamonds"
                        ? "text-red-500"
                        : "text-green-500"}
                >
                    <p class="cardText">{printCard(GameData.lastCardInDeck)}</p>
                </span>
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

