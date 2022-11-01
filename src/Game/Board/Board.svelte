<script>
    import CardToBeat from "./CardToBeat.svelte";
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
            if (
                allowedMoves != null &&
                allowedMoves.allowedMoves.length != 0 &&
                allowedMoves.allowedMoves.find(
                    (move) => move.Move == "Defend"
                ) != undefined
            ) {
                return calcCardsAllowedToPlayDefend(
                    playerCardsWithId,
                    cardsToBeat,
                    trump
                );
            } else {
                return [];
            }
        } else if (playerRole == "attack" || playerRole == "assistAttacker") {
            if (
                allowedMoves != null &&
                allowedMoves.allowedMoves.length != 0 &&
                allowedMoves.allowedMoves.find(
                    (move) => move.Move == "AddCards"
                ) != undefined
            ) {
                return calcCardsAllowedToPlayAttackOrAssist(
                    playerCardsWithId,
                    cardsOnTable,
                    playerRole
                );
            } else {
                return [];
            }
        }
        return [];
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

<!-- Table -->

{#if playerRole == "attack" || playerRole == "assistAttacker"}
        <div class="layer1">
            <PlayCard {cardDroppedToAttackCallback} />
        </div>
            {#if table.length == 0}
            {:else}
                {#each cardsOnTable as cardToBeatAndCard (cardToBeatAndCard.id)}
                        <span
                            class={cardToBeatAndCard.cardToBeatAndCard[0].Card
                                .type === "hearts" ||
                            cardToBeatAndCard.cardToBeatAndCard[0].Card.type ===
                                "diamonds"
                                ? "redText"
                                : "greenText"}
                        >
                            <p class="cardText">
                                {printCard(
                                    cardToBeatAndCard.cardToBeatAndCard[0].Card
                                )}
                            </p>
                        </span>
                        {#if cardToBeatAndCard.cardToBeatAndCard[1] != null}
                            <div class="beatCardDiv">
                                <span
                                    class={cardToBeatAndCard
                                        .cardToBeatAndCard[1].Card.type ===
                                        "hearts" ||
                                    cardToBeatAndCard.cardToBeatAndCard[1].Card
                                        .type === "diamonds"
                                        ? "redText"
                                        : "greenText"}
                                >
                                    <p class="cardText">
                                        {printCard(
                                            cardToBeatAndCard
                                                .cardToBeatAndCard[1].Card
                                        )}
                                    </p>
                                </span>
                            </div>
                        {/if}
                {/each}
            {/if}
{:else}
        {#if table.length == 0}
        {:else}
            {#each beatenCardsWithCards as beatenCardWithCard (beatenCardWithCard.id)}
                    class="cardItem"
                    id={beatenCardWithCard.beatenCard.type === "hearts" ||
                    beatenCardWithCard.beatenCard.type === "diamonds"
                        ? "redText"
                        : "greenText"}
                >
                    <span
                        class={beatenCardWithCard.beatenCard.type ===
                            "hearts" ||
                        beatenCardWithCard.beatenCard.type === "diamonds"
                            ? "redText"
                            : "greenText"}
                    >
                        <p class="cardText">
                            {printCard(beatenCardWithCard.beatenCard)}
                        </p>
                    </span>
                    <div class="beatCardDiv">
                        <span
                            class={beatenCardWithCard.card.type === "hearts" ||
                            beatenCardWithCard.card.type === "diamonds"
                                ? "redText"
                                : "greenText"}
                        >
                            <p class="cardText">
                                {printCard(beatenCardWithCard.card)}
                            </p>
                        </span>
                    </div>
            {/each}
            {#each cardsToBeat as cardToBeat, i (cardToBeat.id)}
                    <CardToBeat
                        {cardToBeat}
                        bind:dropFromOthersDisabled={dropFromOthersDisabled[i]}
                        {cardBeatenCallback}
                    />
            {/each}
        {/if}
{/if}
<!-- Player Cards -->
    {#if playerCardsWithId.length != 0}
        {#each playerCardsWithId as card (card.id)}
                <PlayerCards
                    item={card}
                    {cardsToBeat}
                    bind:dropFromOthersDisabled
                    dragDisabled={shouldDragBeDisabled(
                        card.id,
                        playerCardsWithId,
                        cardsAllowedToPlay
                    )}
                    {trump}
                />
        {/each}
    {:else}
    {/if}

