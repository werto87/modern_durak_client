<script>
    import { afterUpdate } from "svelte";
    afterUpdate(() => {
        if (GameData && playerRole == "defend") {
            if (
                GameData.table.length > 0 &&
                (selectedCardToBeat == null ||
                    !GameData.table.includes((cardToBeatAndCardPair) => {
                        return cardToBeatAndCardPair[0] == selectedCardToBeat;
                    }))
            ) {
                GameData.table.some((cardToBeatAndCardPair) => {
                    if (cardToBeatAndCardPair[1] == null) {
                        selectedCardToBeat = cardToBeatAndCardPair[0];
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        }
    });

    let selectedCards = [];
    let selectedCardToBeat = null;

    export let defenderWantsToTakeCards = false;
    export let DurakAllowedMoves = null;
    export let GameData = null;
    export let playerRole = "";
    import { sendMessageToWebsocket } from "../Webservice/store.js";

    const placeSelectedCardsOnTableToAttack = () => {
        sendMessageToWebsocket(
            "DurakAttack|" + '{"cards":' + JSON.stringify(selectedCards) + "}"
        );
        selectedCards = [];
    };
    const placeSelectedCardOnTableToDefend = () => {
        let cardToBeatAndCard = {};
        cardToBeatAndCard["cardToBeat"] = selectedCardToBeat["Card"];
        cardToBeatAndCard["card"] = selectedCards["Card"];
        sendMessageToWebsocket(
            "DurakDefend|" + JSON.stringify(cardToBeatAndCard)
        );
        selectedCards = [];
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
</script>

{#if GameData}
    <main>
        <h1>Game</h1>
        <h3>Table:</h3>
        {#each GameData.table as card}
            <p>
                Card: {card[0].Card.value}
                {card[0].Card.type}
                {#if card[1]}
                    {card[1].Card.value}
                    {card[1].Card.type}
                {:else if playerRole == "defend"}
                    <input
                        type="radio"
                        bind:group={selectedCardToBeat}
                        name="selectedCardToBeat"
                        value={card[0]}
                        on:change={selectedCardToBeat}
                    />
                {/if}
            </p>
        {/each}
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
            {#each player.PlayerData.cards as card}
                {#if card}
                    <label for="selectedCards">
                        {#if player.PlayerData.playerRole === "defend"}
                            <input
                                type="radio"
                                bind:group={selectedCards}
                                name="selectedCards"
                                value={card}
                            />
                        {:else if player.PlayerData.playerRole === "attack" || player.PlayerData.playerRole === "assist"}
                            <input
                                type="checkbox"
                                bind:group={selectedCards}
                                name="selectedCards"
                                value={card}
                            />
                        {/if}
                        card: value {card.Card.value}, type {card.Card.type}
                    </label>
                {/if}
            {/each}
        {/each}

        {#if playerRole == "defend"}
            <button
                disabled={!isAllowedMove(DurakAllowedMoves, "defend") ||
                    undefined}
                on:click={() => {
                    placeSelectedCardOnTableToDefend();
                }}>Place selected Card on Table to Defend</button
            ><br />
            <button
                disabled={!isAllowedMove(DurakAllowedMoves, "takeCards") ||
                    undefined}
                on:click={() => {
                    drawCardsFromTable();
                }}>Draw Cards from Table</button
            ><br />
        {:else if playerRole == "attack" || playerRole == "assist"}
            <button
                disabled={!(
                    isAllowedMove(DurakAllowedMoves, "startAttack") ||
                    isAllowedMove(DurakAllowedMoves, "addCard")
                ) || undefined}
                on:click={() => {
                    placeSelectedCardsOnTableToAttack();
                }}>Place selected Cards on Table</button
            > <br />
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
</style>
