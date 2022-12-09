<script>
  import CardToBeat from "./CardToBeat.svelte";
  import PlayerCards from "./PlayerCards.svelte";
  import PlayCard from "./PlayCard.svelte";
  import { allowedToPlayDefend } from "./helper.js";
  import Card from "../../component/Card.svelte";

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
  const shouldDragBeDisabled = (id, playerCardsWithId, cardsAllowedToPlay) => {
    const item = playerCardsWithId.find((element) => element.id === id);
    return (
      cardsAllowedToPlay.find((element) => {
        return element.id === item.id;
      }) === undefined
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
      if (cardsOnTable.length === 0 && playerRole === "attack") return true;
      cardsOnTable.some((element) => {
        cardPlayable =
          element.cardToBeatAndCard[0].Card.value === playerCard.value;

        if (cardPlayable) {
          return true;
        } else if (element.cardToBeatAndCard[1] != null) {
          cardPlayable =
            element.cardToBeatAndCard[1].Card.value === playerCard.value;
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
    if (playerRole === "defend") {
      if (
        allowedMoves != null &&
        allowedMoves.allowedMoves.length !== 0 &&
        allowedMoves.allowedMoves.find((move) => move.Move === "Defend") !==
          undefined
      ) {
        return calcCardsAllowedToPlayDefend(
          playerCardsWithId,
          cardsToBeat,
          trump
        );
      } else {
        return [];
      }
    } else if (playerRole === "attack" || playerRole === "assistAttacker") {
      if (
        allowedMoves != null &&
        allowedMoves.allowedMoves.length !== 0 &&
        allowedMoves.allowedMoves.find((move) => move.Move === "AddCards") !==
          undefined
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
<div class="col-span-3 gap-4">
  {#if playerRole === "attack" || playerRole === "assistAttacker"}
    <div
      class="border-black relative flex flex-wrap justify-center gap-4 border-2 p-4"
    >
      <PlayCard className="absolute inset-0" {cardDroppedToAttackCallback} />
      {#if table.length === 0}
        <div class="h-20 sm:h-40" />
      {:else}
        {#each cardsOnTable as cardToBeatAndCard (cardToBeatAndCard.id)}
          <div class="h-20 w-14 bg-cardBackground sm:h-40 sm:w-24">
            <Card
              className="relative text-center"
              card={cardToBeatAndCard.cardToBeatAndCard[0].Card}
            />
            {#if cardToBeatAndCard.cardToBeatAndCard[1] != null}
              <Card
                className="relative text-center"
                card={cardToBeatAndCard.cardToBeatAndCard[1].Card}
              />
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  {:else if table.length === 0}
    <div class="border-black h-24 border-2 sm:h-48" />
  {:else}
    <div
      class="border-black relative flex flex-wrap justify-center gap-4 border-2 p-4"
    >
      {#each beatenCardsWithCards as beatenCardWithCard (beatenCardWithCard.id)}
        <div class="h-20 w-14 bg-cardBackground text-center sm:h-40 sm:w-24">
          <Card className="" card={beatenCardWithCard.beatenCard} />
          <Card className="" card={beatenCardWithCard.card} />
        </div>
      {/each}
      {#each cardsToBeat as cardToBeat, i (cardToBeat.id)}
        <div class="relative h-20 text-center sm:h-40">
          <CardToBeat
            className="h-20 sm:h-40 bg-cardBackground sm:w-24 w-14"
            {cardToBeat}
            bind:dropFromOthersDisabled={dropFromOthersDisabled[i]}
            {cardBeatenCallback}
          />
          <Card className="absolute inset-0" card={cardToBeat} />
        </div>
      {/each}
    </div>
  {/if}
  <!-- Player Cards -->
  {#if playerCardsWithId.length !== 0}
    <div class="flex flex-wrap justify-center gap-4 p-4">
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
    </div>
  {:else}{/if}
</div>
