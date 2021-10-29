<script>
    import Board from "./Board/Board.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        console.log(playerCards);
    });

    export let defenderWantsToTakeCards = false;
    export let DurakAllowedMoves = null;
    export let GameData = null;
    export let playerRole = "";
    export let playerCards = [];
    import { sendMessageToWebsocket } from "../Webservice/store.js";

    const placeSelectedCardsOnTableToAttack = (card) => {
        let mycard = { Card: { value: card.value, type: card.type } };
        sendMessageToWebsocket(
            "DurakAttack|" + '{"cards":' + JSON.stringify([mycard]) + "}"
        );
    };
    const placeSelectedCardOnTableToDefend = (cardToBeat, card) => {
        let cardToBeatAndCard = {};
        cardToBeatAndCard["cardToBeat"] = cardToBeat;
        cardToBeatAndCard["card"] = card;
        sendMessageToWebsocket(
            "DurakDefend|" + JSON.stringify(cardToBeatAndCard)
        );
    };
    const drawCardsFromTable = () => {
        sendMessageToWebsocket("DurakDefendPass|{}");
    };
    const pass = () => {
        //TODO instead of sending messages to the webserver we should send an event to
        //the machine and the machine should decide if we send something or not
        if (playerRole == "attack") {
            sendMessageToWebsocket("DurakAttackPass|{}");
        } else if (playerRole == "assist") {
            sendMessageToWebsocket("DurakAssistPass|{}");
        }
        defenderWantsToTakeCards = false;
    };
    const surrender = () => {
        sendMessageToWebsocket("DurakLeaveGame|{}");
    };
    const isAllowedMove = (DurakAllowedMoves, moveToCheck) => {
        return (
            (DurakAllowedMoves &&
                DurakAllowedMoves.allowedMoves.filter(
                    (element) => element.Move == moveToCheck
                ).length > 0) ||
            (moveToCheck == "pass" &&
                defenderWantsToTakeCards &&
                (playerRole == "attack" || playerRole == "assist"))
        );
    };
    const numberOfUnknowenCards = (cards) => {
        let unknowenCardCount = 0;
        cards.forEach((card) => {
            if (card === null) {
                unknowenCardCount++;
            }
        });
        return unknowenCardCount;
    };


    let cardBeatenCallback = (cardToBeat, card) => {
        placeSelectedCardOnTableToDefend(cardToBeat, card);
    };

    let cardDroppedToAttackCallback = (card) => {
        placeSelectedCardsOnTableToAttack(card);
    };
</script>

{#if GameData}
    <main>
        <h1>Game</h1>
        <h3>Table:</h3>
        <Board
            bind:playerRole
            bind:playerCards
            bind:table={GameData.table}
            bind:trump={GameData.trump}
            {cardBeatenCallback}
            {cardDroppedToAttackCallback}
            bind:allowedMoves={DurakAllowedMoves}
        />
        <p>Cards in Deck {GameData.cardsInDeck}</p>
        <p>
            {#if GameData.lastCardInDeck}
                Last Card in Deck {GameData.lastCardInDeck.value}
                {GameData.lastCardInDeck.type}
            {/if}
        </p>
        <p>Trump {GameData.trump}</p>
        {#each GameData.players as player}
            <p>Player: {player.PlayerData.name}</p>
            {#if numberOfUnknowenCards(player.PlayerData.cards) !== 0}
                <p>
                    Number of Unknowen Cards {numberOfUnknowenCards(
                        player.PlayerData.cards
                    )}
                </p>
            {/if}
        {/each}

        {#if playerRole == "defend"}
            <!--TODO REPLACE THIS BUTTON WITH A DRAG AND DROP ACTION for example drag table inside cards :) -->
            <button
                disabled={!isAllowedMove(DurakAllowedMoves, "takeCards") ||
                    undefined}
                on:click={() => {
                    drawCardsFromTable();
                }}>Draw Cards from Table</button
            ><br />
        {:else if playerRole == "attack" || playerRole == "assist"}
            <button
                disabled={!isAllowedMove(DurakAllowedMoves, "pass") ||
                    undefined}
                on:click={() => {
                    pass();
                }}>Pass</button
            ><br />
        {/if}

        <button
            on:click={() => {
                surrender();
            }}>Surrender</button
        ><br />
    </main>
{/if}

<style>
    /*  */
</style>
