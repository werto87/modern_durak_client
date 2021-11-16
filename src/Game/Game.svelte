<script>
    import Board from "./Board/Board.svelte";
    import Countdown from "../Util/Countdown.svelte";
    export let defenderWantsToTakeCards = false;
    export let DurakAllowedMoves = null;
    export let GameData = null;
    export let playerRole = "";
    export let playerCards = [];
    export let DurakTimers = null;
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
        } else if (playerRole == "assistAttacker") {
            sendMessageToWebsocket("DurakAssistPass|{}");
        }
    };
    const surrender = () => {
        sendMessageToWebsocket("DurakLeaveGame|{}");
    };
    const isAllowedMove = (DurakAllowedMoves, moveToCheck) => {
        console.log(DurakAllowedMoves);
        return (
            (DurakAllowedMoves &&
                DurakAllowedMoves.allowedMoves.filter(
                    (element) => element.Move == moveToCheck
                ).length > 0) ||
            (moveToCheck == "pass" &&
                defenderWantsToTakeCards &&
                (playerRole == "attack" || playerRole == "assistAttacker"))
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
    import cardDeckIcon from "../asset/icons/deck.svg";
    import { Item } from "svelte-layouts";
    import { printCard, printType } from "./Board/helper.js";
</script>

{#if GameData}
    <main>
        <h1>Game</h1>
        <Board
            bind:playerRole
            bind:playerCards
            bind:table={GameData.table}
            bind:trump={GameData.trump}
            {cardBeatenCallback}
            {cardDroppedToAttackCallback}
            bind:allowedMoves={DurakAllowedMoves}
        />
        {#if GameData.cardsInDeck > 1}
            <div class="deckContainer">
                <span class="deckIcon">
                    {@html cardDeckIcon}
                </span>
                <p class="cardCount">{GameData.cardsInDeck}</p>

                {#if GameData.lastCardInDeck}
                    <div class="lastCardInDeck">
                        <Item class="cardItem">
                            <span
                                class={GameData.lastCardInDeck.type ===
                                    "hearts" ||
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
                <Item class="cardItem">
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
        {#if DurakTimers}
            {#if DurakTimers.runningTimeUserTimePointMilliseconds}
                {#each DurakTimers.runningTimeUserTimePointMilliseconds as runningTimer}
                    <p>
                        Player Name: {runningTimer[0]}
                    </p>
                    <p>
                        <!-- <Header countdown={runningTimer[1]} /> -->
                        <Countdown
                            countdown={Math.floor(
                                (runningTimer[1] - Date.now()) / 1000
                            )}
                            let:countdown
                        >
                            Player Time: {countdown}
                        </Countdown>
                    </p>
                {/each}
            {/if}
            {#if DurakTimers.pausedTimeUserDurationMilliseconds}
                {#each DurakTimers.pausedTimeUserDurationMilliseconds as pausedTimer}
                    <p>
                        Player Name: {pausedTimer[0]}
                    </p>
                    <p>
                        Player Time: {Math.floor(pausedTimer[1] / 1000)} seconds
                    </p>
                {/each}
            {/if}
        {/if}

        {#if playerRole == "defend"}
            <button
                disabled={!isAllowedMove(DurakAllowedMoves, "takeCards") ||
                    undefined}
                on:click={() => {
                    drawCardsFromTable();
                }}>Draw Cards from Table</button
            ><br />
        {:else if playerRole == "attack" || playerRole == "assistAttacker"}
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
    :global(.deckContainer) {
        height: var(--itemHeight);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    :global(.deckIcon) {
        flex: 0 0 0px;
        margin-top: 120px;
    }
    :global(.cardCount) {
        flex: 0 0 0px;
        margin-left: -8.5em;
        min-width: 200px;
        margin-top: 140px;
    }
    :global(.lastCardInDeck) {
        flex: 0 0 0px;
        margin-left: -6.4em;
        z-index: -100;
    }
    :global(.onlyOneCardInDeck) {
        height: var(--itemHeight);
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
