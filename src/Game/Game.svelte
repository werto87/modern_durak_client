<script>
    import OtherPlayerState from "./State/OtherPlayerState.svelte";
    import cardDeckIcon from "../asset/icons/deck.svg";
    import Board from "./Board/Board.svelte";
    export let defenderWantsToTakeCards = false;
    export let DurakAllowedMoves = null;
    export let GameData = null;
    export let playerRole = "";
    export let playerCards = [];
    export let DurakTimers = null;
    export let accountName = null;
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

    let cardBeatenCallback = (cardToBeat, card) => {
        placeSelectedCardOnTableToDefend(cardToBeat, card);
    };

    let cardDroppedToAttackCallback = (card) => {
        placeSelectedCardsOnTableToAttack(card);
    };

    import { Item, Col, Row } from "svelte-layouts";
    import { printCard, printType } from "./Board/helper.js";
</script>

{#if GameData}
    <main>
        <h1>Game</h1>
        <Row class="gameRow">
            <Col>
                <Board
                    bind:playerRole
                    bind:playerCards
                    bind:table={GameData.table}
                    bind:trump={GameData.trump}
                    {cardBeatenCallback}
                    {cardDroppedToAttackCallback}
                    bind:allowedMoves={DurakAllowedMoves}
                />
            </Col>
            <Col class="overView">
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
                                        GameData.lastCardInDeck.type ===
                                            "diamonds"
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
                    {#if player.PlayerData.name != accountName}
                        <OtherPlayerState {player} {DurakTimers} />
                    {/if}
                {/each}
            </Col>
        </Row>
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
    /* TODO place text inside of the card icon */
    /* TODO fix scaling */
    /* TODO add role display maybe make a enemy player component */
    /* TODO add player status for example time left is missing for player only shows for other players */
    :global(.deckContainer) {
        /* height: var(--itemHeight);
        width: var(--itemMinWidth); */
        display: flex;
        flex-shrink: 3;
    }

    :global(.deckIcon) {
        min-width: var(--itemHeight);
        max-width: var(--itemHeight);
        z-index: -100;
    }
    :global(.cardCount) {
    }
    :global(.lastCardInDeck) {
        /* flex: 0 0 0px; */
        z-index: -100;
    }
    :global(.onlyOneCardInDeck) {
        display: flex;
    }

    :global(.gameRow) {
        /* justify-content: space-evenly; */
        display: flex;
        border-style: solid;
        border-color: #cccccc;
    }
    :global(.overView) {
        width: 10em;
    }
</style>
