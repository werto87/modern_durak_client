<script>
    import CardToBeat from "./CardToBeat.svelte";
    import { Item, Row } from "svelte-layouts";
    import PlayerCards from "./PlayerCards.svelte";
    import PlayCard from "./PlayCard.svelte";
    import { allowedToPlayDefend } from "./helper.js";
    import { printCard } from "./helper.js";
    export let playerRole;
    export let playerCards;
    export let table;
    export let trump;
    export let cardBeatenCallback;
    export let cardDroppedToAttackCallback;
    export let allowedMoves;
    const calcCardsOnTable = (table) => {
        let result = [];
        table.forEach((cardToBeatAndCard, i) => {
            let object = { id: i, cardToBeatAndCard };
            result.push(object);
        });
        return result;
    };
    const calcPlayerCardsWithId = (playerCards) => {
        let result = [];
        playerCards.forEach((element) => {
            let cardWithId = {
                id: element.Card.value + element.Card.type,
                ...element.Card,
            };
            result.push(cardWithId);
        });
        return result;
    };

    const calcCardsToBeat = (cardsOnTable) => {
        let result = [];
        cardsOnTable
            .filter((element) => element.cardToBeatAndCard[1] == null)
            .forEach((element) => {
                let cardWithId = {
                    id:
                        element.cardToBeatAndCard[0].Card.value +
                        element.cardToBeatAndCard[0].Card.type,
                    ...element.cardToBeatAndCard[0].Card,
                };
                result.push(cardWithId);
            });

        return result;
    };
    const calcBeatenCardsWithCards = (cardsOnTable) => {
        let result = [];
        cardsOnTable
            .filter((element) => element.cardToBeatAndCard[1] != null)
            .forEach((element, i) => {
                let beatenCard = {
                    id:
                        element.cardToBeatAndCard[0].Card.value +
                        element.cardToBeatAndCard[0].Card.type,
                    ...element.cardToBeatAndCard[0].Card,
                };
                let card = {
                    id:
                        element.cardToBeatAndCard[1].Card.value +
                        element.cardToBeatAndCard[1].Card.type,
                    ...element.cardToBeatAndCard[1].Card,
                };
                result.push({ id: i, beatenCard, card });
            });
        return result;
    };
    const shouldDragBeDisabled = (
        id,
        playerCardsWithId,
        cardsAllowedToPlay
    ) => {
        const item = playerCardsWithId.find((element) => element.id == id);
        return (
            cardsAllowedToPlay.find((element) => {
                return element.id == item.id;
            }) == undefined
        );
    };
    const calcCardsAllowedToPlayDefend = (playerCards, cardsToBeat, trump) => {
        let result;
        result = playerCards.filter((card) => {
            let allowed = false;
            cardsToBeat.some((cardToBeat) => {
                allowed = allowedToPlayDefend(cardToBeat, card, trump);
                return allowed;
            });
            return allowed;
        });
        return result;
    };
    const calcCardsAllowedToPlayAttackOrAssist = (
        playerCardsWithId,
        cardsOnTable,
        playerRole
    ) => {
        return playerCardsWithId.filter((playerCard) => {
            let cardPlayable = false;
            if (cardsOnTable.length == 0 && playerRole == "attack") return true;
            cardsOnTable.some((element) => {
                cardPlayable =
                    element.cardToBeatAndCard[0].Card.value == playerCard.value;

                if (cardPlayable) {
                    return true;
                } else if (element.cardToBeatAndCard[1] != null) {
                    cardPlayable =
                        element.cardToBeatAndCard[1].Card.value ==
                        playerCard.value;
                }
                return cardPlayable;
            });
            return cardPlayable;
        });
    };
    const calcCardsAllowedToPlay = (
        playerRole,
        playerCardsWithId,
        cardsToBeat,
        trump,
        allowedMoves
    ) => {
        if (playerRole == "defend") {
            if (allowedMoves != null && allowedMoves.allowedMoves.length != 0) {
                return calcCardsAllowedToPlayDefend(
                    playerCardsWithId,
                    cardsToBeat,
                    trump
                );
            } else {
                return [];
            }
        } else if (playerRole == "attack" || playerRole == "assist") {
            if (allowedMoves != null && allowedMoves.allowedMoves.length != 0) {
                return calcCardsAllowedToPlayAttackOrAssist(
                    playerCardsWithId,
                    cardsOnTable,
                    playerRole
                );
            } else {
                return [];
            }
        }
        return result;
    };

    $: cardsOnTable = calcCardsOnTable(table);
    $: cardsToBeat = calcCardsToBeat(cardsOnTable);
    $: playerCardsWithId = calcPlayerCardsWithId(playerCards);
    $: cardsAllowedToPlay = calcCardsAllowedToPlay(
        playerRole,
        playerCardsWithId,
        cardsToBeat,
        trump,
        allowedMoves
    );

    $: beatenCardsWithCards = calcBeatenCardsWithCards(cardsOnTable);
    $: dropFromOthersDisabled = Array(42).fill(true);
</script>

<!-- Player Cards -->

<Row class="boardRow">
    {#if playerCardsWithId.length != 0}
        {#each playerCardsWithId as card (card.id)}
            <Item class="cardItem"
                ><PlayerCards
                    item={card}
                    {cardsToBeat}
                    bind:dropFromOthersDisabled
                    dragDisabled={shouldDragBeDisabled(
                        card.id,
                        playerCardsWithId,
                        cardsAllowedToPlay
                    )}
                    {trump}
                /></Item
            >
        {/each}
    {:else}
        <Item class="fill" />
    {/if}
</Row>
<!-- Table -->

{#if playerRole == "attack"}
    <Row class="container_row">
        <div class="layer1">
            <PlayCard {cardDroppedToAttackCallback} />
        </div>
        <Row class="layer2">
            {#if table.length == 0}
                <Item class="fill" />
            {:else}
                {#each cardsOnTable as cardToBeatAndCard (cardToBeatAndCard.id)}
                    <Item class="cardItem">
                        {printCard(cardToBeatAndCard.cardToBeatAndCard[0].Card)}
                        {#if cardToBeatAndCard.cardToBeatAndCard[1] != null}
                            <br />
                            {printCard(
                                cardToBeatAndCard.cardToBeatAndCard[1].Card
                            )}
                        {/if}
                    </Item>
                {/each}
            {/if}
        </Row>
    </Row>
{:else}
    <Row class="boardRow">
        {#if table.length == 0}
            <Item class="fill" />
        {:else}
            {#each beatenCardsWithCards as beatenCardWithCard (beatenCardWithCard.id)}
                <Item class="cardItem">
                    {printCard(beatenCardWithCard.beatenCard)}
                    <br />
                    {printCard(beatenCardWithCard.card)}
                </Item>
            {/each}
            {#each cardsToBeat as cardToBeat, i (cardToBeat.id)}
                <Item class="cardItem">
                    <CardToBeat
                        {cardToBeat}
                        bind:dropFromOthersDisabled={dropFromOthersDisabled[i]}
                        {cardBeatenCallback}
                    />
                </Item>
            {/each}
        {/if}
    </Row>
{/if}

<style>
    :global(:root) {
        --itemWidth: 7em;
        --itemHeight: 10em;
    }
    :global(.cardItem) {
        height: var(--itemHeight);
        width: var(--itemWidth);
        text-align: center;
        border-width: 3px;
        border-color: black;
        border-style: solid;
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 25%;
    }

    :global(.boardRow) {
        display: flex;
        flex-wrap: wrap;
        margin: 5px;
        flex-shrink: 1;
        gap: 5px;
        border-style: solid;
        padding: 5px;
        min-width: 15em;
        flex-flow: row wrap;
        display: flex;
    }

    :global(.drop) {
        background-color: yellow;
        border-color: lightcoral;
    }

    :global(.fill) {
        height: var(--itemHeight);
        flex-grow: 1;
        background-color: transparent;
        border-color: transparent;
    }

    :global(.container_row) {
        /* TODO find out how to inherit from another class for example ".boardRow" 
        so we do not have to copy all of it here*/
        padding: 0px;
        display: flex;
        flex-wrap: wrap;
        margin: 5px;
        flex-shrink: 1;
        gap: 5px;
        border-style: solid;
        padding: 5px;
        min-width: 15em;
        flex-flow: row wrap;
        display: flex;
    }

    :global(.layer1) {
        width: 100%;
        border-width: 5px;
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 25%;
        padding: 0;
    }

    :global(.layer2) {
        flex-wrap: wrap;
        /* margin: 5px; */
        flex-shrink: 1;
        gap: 5px;
        border-style: unset;
        min-width: 15em;
        display: flex;
        margin-left: -100%;
        padding: 0px;
        flex-grow: 1;
        flex-basis: 25%;
    }
</style>
