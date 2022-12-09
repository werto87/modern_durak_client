<script>
  import PlayerState from "./State/PlayerState.svelte";

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
    sendMessageToWebsocket("DurakDefend|" + JSON.stringify(cardToBeatAndCard));
  };
  const drawCardsFromTable = () => {
    sendMessageToWebsocket("DurakDefendPass|{}");
  };

  const durakAskDefendWantToTakeCardsAnswerYes = () => {
    sendMessageToWebsocket(
      'DurakAskDefendWantToTakeCardsAnswer|{"answer": true}'
    );
  };

  const durakAskDefendWantToTakeCardsAnswerNo = () => {
    sendMessageToWebsocket(
      'DurakAskDefendWantToTakeCardsAnswer|{"answer": false}'
    );
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

  import CardsInDeck from "./State/CardsInDeck.svelte";
  import ModernDurakButton from "../component/ModernDurakButton.svelte";
</script>

{#if GameData}
  <main>
    <div class="flex flex-col gap-2 p-4">
      <h1 class="text-center text-lg font-bold">Game</h1>
      <CardsInDeck {GameData} />
      {#each GameData.players as player}
        {#if player.PlayerData.name == accountName}
          <PlayerState {player} isPlayer={true} {DurakTimers} />
        {/if}
      {/each}
      {#each GameData.players as player}
        {#if player.PlayerData.name != accountName}
          <PlayerState {player} {DurakTimers} />
        {/if}
      {/each}
      <Board
        bind:playerRole
        bind:playerCards
        bind:table={GameData.table}
        bind:trump={GameData.trump}
        {cardBeatenCallback}
        {cardDroppedToAttackCallback}
        bind:allowedMoves={DurakAllowedMoves}
      />
      <div class="col-span-full grid grid-cols-1 gap-4">
        {#if playerRole == "defend"}
          {#if isAllowedMove(DurakAllowedMoves, "TakeCards")}
            <ModernDurakButton
              onClick={() => {
                drawCardsFromTable();
              }}
              buttonText="Take Cards from Table"
            />
          {:else}
            <ModernDurakButton
              disabled={!isAllowedMove(
                DurakAllowedMoves,
                "AnswerDefendWantsToTakeCardsYes"
              ) || undefined}
              onClick={() => {
                durakAskDefendWantToTakeCardsAnswerYes();
              }}
              buttonText="Take Cards from Table"
            />
          {/if}
          <ModernDurakButton
            disabled={!isAllowedMove(
              DurakAllowedMoves,
              "AnswerDefendWantsToTakeCardsNo"
            ) || undefined}
            onClick={() => {
              durakAskDefendWantToTakeCardsAnswerNo();
            }}
            buttonText="Discard Cards from Table"
          />
        {:else if playerRole == "attack" || playerRole == "assistAttacker"}
          <ModernDurakButton
            disabled={!isAllowedMove(DurakAllowedMoves, "AttackAssistPass") ||
              undefined}
            onClick={() => {
              pass();
            }}
            buttonText="Pass"
          />
          <ModernDurakButton
            disabled={!isAllowedMove(
              DurakAllowedMoves,
              "AttackAssistDoneAddingCards"
            ) || undefined}
            onClick={() => {
              pass();
            }}
            buttonText="Done adding Cards"
          />
        {/if}
        <ModernDurakButton
          onClick={() => {
            surrender();
          }}
          buttonText="Surrender"
        />
        <br />
      </div>
    </div>
  </main>
{/if}
