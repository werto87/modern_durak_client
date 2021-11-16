<script>
    import Board from "./Board/Board.svelte";
    import Countdown from "../Util/Countdown.svelte";
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
            <Col>
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
                        <p>Player: {player.PlayerData.name}</p>
                        {#if numberOfUnknowenCards(player.PlayerData.cards) !== 0}
                            <div class="deckContainerUnknowenCards">
                                <span class="unknowenCards">
                                    {@html cardDeckIcon}
                                </span>
                                <p class="unknowenCardsCardCount">
                                    {numberOfUnknowenCards(
                                        player.PlayerData.cards
                                    )}
                                </p>
                            </div>
                        {/if}
                    {/if}
                {/each}
                {#if DurakTimers}
                    {#if DurakTimers.runningTimeUserTimePointMilliseconds}
                        {#each DurakTimers.runningTimeUserTimePointMilliseconds as runningTimer}
                            <p>
                                Player Name: {runningTimer[0]}
                            </p>
                            <p>
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
                                Player Time: {Math.floor(pausedTimer[1] / 1000)}
                                seconds
                            </p>
                        {/each}
                    {/if}
                {/if}
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
    /* TODO find out how to shrink svg */
    :global(.deckContainer) {
        flex-shrink: 3;
        height: calc(var(--itemHeight) + 0.5em);
        width: calc(var(--itemHeight) + 0.5em);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :global(.deckIcon) {
        flex-shrink: 3;
        flex: 0 0 0px;
        margin-top: 120px;
        margin-left: -2.3em;
    }
    :global(.cardCount) {
        flex-shrink: 3;
        flex: 0 0 0px;
        margin-left: -8.5em;
        min-width: 200px;
        margin-top: 140px;
    }
    :global(.lastCardInDeck) {
        flex-shrink: 3;
        flex: 0 0 0px;
        margin-left: -6.4em;
        z-index: -100;
    }
    :global(.onlyOneCardInDeck) {
        flex-shrink: 3;
        height: var(--itemHeight);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    :global(.deckContainerUnknowenCards) {
        flex-shrink: 3;
        height: var(--itemHeight);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        margin-top: -10px;
    }
    :global(.unknowenCards) {
        flex-shrink: 3;
        transform: rotate(90deg);
        z-index: -100;
        margin-left: -2em;
    }
    :global(.unknowenCardsCardCount) {
        flex-shrink: 3;
        margin-left: -8.4em;
        min-width: 200px;
    }
    :global(.gameRow) {
        justify-content: space-evenly;
        display: flex;
        margin: 5px;
        flex-shrink: 1;
        border-style: solid;
        border-color: #cccccc;
    }
</style>
