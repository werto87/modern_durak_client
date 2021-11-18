<script>
    import cardDeckIcon from "../../asset/icons/deck.svg";
    import { Item } from "svelte-layouts";
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
                    <Item class="smallCardItem">
                        <span
                            class={GameData.lastCardInDeck.type === "hearts" ||
                            GameData.lastCardInDeck.type === "diamonds"
                                ? "redText"
                                : "greenText"}
                        >
                            {printCard(GameData.lastCardInDeck)}
                        </span>
                    </Item>
                </div>
            {/if}
        </div>
    {:else if GameData.lastCardInDeck}
        <div class="onlyOneCardInDeck">
            <Item class="smallCardItem">
                <span
                    class={GameData.lastCardInDeck.type === "hearts" ||
                    GameData.lastCardInDeck.type === "diamonds"
                        ? "redText"
                        : "greenText"}
                >
                    {printCard(GameData.lastCardInDeck)}
                </span>
            </Item>
        </div>
    {:else}
        <p>
            Trump:&nbsp;
            <span
                class={GameData.trump === "hearts" ||
                GameData.trump === "diamonds"
                    ? "redText"
                    : "greenText"}
            >
                {printType(GameData.trump)}
            </span>
        </p>
    {/if}
</div>

<style>
    :global(.deckContainer) {
        display: flex;
        padding-top: 10px;
    }

    :global(.deckIcon) {
        z-index: -50;
        min-height: calc(var(--itemWidthMin) * 0.75);
        max-height: calc(var(--itemWidthMin) * 0.75);
        min-width: calc(var(--itemHeight) * 0.75);
        max-width: calc(var(--itemHeight) * 0.75);
        padding-bottom: 30px;
        margin-top: 3em;
        margin-bottom: 0px;
        margin-left: 1em;
    }
    :global(.cardDeckCount) {
        margin-top: -3.6em;
    }
    :global(.lastCardInDeck) {
        z-index: -100;
        margin-left: -6em;
    }
    :global(.onlyOneCardInDeck) {
        display: flex;
        z-index: -100;
        margin-left: 2.5em;
        padding-bottom: 30px;
        margin-top: 10px;
    }

    :global(#cardsInDeckContainer) {
        border-style: solid;
        border-color: #cccccc;
        margin: 3px;
        margin-left: 0px;
    }
    :global(.smallCardItem) {
        text-align: center;
        border-width: 3px;
        border-color: #cccccc;
        border-style: solid;
        border-radius: 10px !important;
        flex-grow: 1;
        flex-shrink: 0;
        background: #0e3b93;
        min-width: calc(var(--itemWidthMin) * 0.75);
        max-width: calc(var(--itemWidthMin) * 0.75);
        height: calc(var(--itemHeight) * 0.75);
    }
</style>
