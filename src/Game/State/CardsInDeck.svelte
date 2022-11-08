<script>
    import cardDeckIcon from "../../asset/icons/deck.svg";
    import {printCard, printType} from "../Board/helper.js";
    import Card from "../../component/Card.svelte";

    export let GameData = null;
</script>

<div class="">
    {#if GameData.cardsInDeck > 1}
        <div class="grid grid-cols-2">
                        <span class="relative">
                            {@html cardDeckIcon}
                            <p class="absolute inset-0 flex items-center justify-center cardDeckCount">{GameData.cardsInDeck}</p>
                        </span>
            {#if GameData.lastCardInDeck}
                <div class="bg-white px-2">
                    <Card className="h-full bg-blue-500 object-fill text-center"
                          card={GameData.lastCardInDeck}/>
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

<style>

</style>