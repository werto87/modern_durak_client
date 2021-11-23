<script>
    import OtherPlayerState from "./State/PlayerState.svelte";

    import Board from "./Board/Board.svelte";

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
            DurakAllowedMoves &&
            DurakAllowedMoves.allowedMoves.filter(
                (element) => element.Move == moveToCheck
            ).length > 0
        );
    };

    let cardBeatenCallback = (cardToBeat, card) => {
        placeSelectedCardOnTableToDefend(cardToBeat, card);
    };

    let cardDroppedToAttackCallback = (card) => {
        placeSelectedCardsOnTableToAttack(card);
    };

    import { Col, Row } from "svelte-layouts";
    import CardsInDeck from "./State/CardsInDeck.svelte";
</script>

{#if GameData}
    <main>
        <h1>Game</h1>
        <Row class="gameRow">
            <Col class="gameCol">
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
                <CardsInDeck {GameData} />
                {#each GameData.players as player}
                    {#if player.PlayerData.name == accountName}
                        <OtherPlayerState {player} {DurakTimers} />
                    {/if}
                {/each}
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
    :global(.gameRow) {
        display: flex;
        flex-grow: 3;
        border-style: solid;
        border-color: #cccccc;
        margin: 3px;
    }
    :global(.gameCol) {
        display: flex;
        flex-grow: 3;
        margin-bottom: 3px;
    }
    :global(.overView) {
        min-width: 10em;
        display: flex;
        margin: 3px;
    }
    :global(#playerStatus) {
        text-align: left;
    }
</style>
