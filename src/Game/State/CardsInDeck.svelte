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
                            <p class="cardDeckCount absolute inset-0 flex justify-center items-center">{GameData.cardsInDeck}</p>
                        </span>
            {#if GameData.lastCardInDeck}
                <div class="bg-white  px-2">
                    <Card className="text-center  bg-blue-500 object-fill h-full"
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