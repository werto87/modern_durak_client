<script>
  import RangeSlider from "svelte-range-slider-pips";
  import { printCard } from "../Game/Board/helper";
  import { toast } from "@zerodevx/svelte-toast";
  import ModernDurakButton from "../component/ModernDurakButton.svelte";

  export let UsersInGameLobby = null;
  export let GameOption = {
    gameOption: {
      maxCardValue: 9,
      typeCount: 4,
      numberOfCardsPlayerShouldHave: 6,
      roundToStart: 1,
      customCardDeck: null,
    },
    timerOption: {
      timerType: "noTimer",
      timeAtStartInSeconds: 0,
      timeForEachRoundInSeconds: 0,
    },
    computerControlledPlayerCount: 0,
    opponentCards: "showNumberOfOpponentCards",
  };
  export let timerOptionSelected = 0;
  export let deckOptionSelected = 0;
  export let opponentCardsOptionsSelected = 0;
  export let isCreateGameLobbyAdmin = true;
  let timerOptions = [
    { id: 0, value: "noTimer", label: "No Timer" },
    {
      id: 1,
      value: "resetTimeOnNewRound",
      label: "Reset Time on new Round",
    },
    {
      id: 2,
      value: "addTimeOnNewRound",
      label: "Add Time on new Round",
    },
  ];
  let deckOptions = [
    { id: 0, value: "randomDeck", label: "Shuffle Cards" },
    { id: 1, value: "customDeck", label: "Custom Deck" },
  ];
  let opponentCardsOptions = [
    {
      id: 0,
      value: "showNumberOfOpponentCards",
      label: "Show Number of Opponent Cards",
    },
    { id: 1, value: "showOpponentCards", label: "Show Opponent Cards" },
  ];
  // framework "svelte-range-slider-pips" requires this to be array so this is a workaround
  $: maxUserSizeArray = [UsersInGameLobby?.maxUserSize];
  $: computerControlledOpponentArray = [
    GameOption?.computerControlledPlayerCount,
  ];
  $: cardsInDeckArray = [GameOption.gameOption.maxCardValue * 4];
  $: timeAtStartInSecondsArray = [GameOption?.timerOption.timeAtStartInSeconds];
  $: timeForEachRoundInSecondsArray = [
    GameOption?.timerOption.timeForEachRoundInSeconds,
  ];

  import { sendMessageToWebsocket } from "../Webservice/store.js";
  import { createForm } from "svelte-forms-lib";
  import Card from "../component/Card.svelte";
  import { debugDeck36 } from "../Util/Util";

  const maxUserCountChanged = () => {
    const maxUserObject = { maxUserSize: maxUserSizeArray[0] };
    sendMessageToWebsocket(
      "SetMaxUserSizeInCreateGameLobby|" + JSON.stringify(maxUserObject),
    );
  };

  const createGameOption = (deck) => {
    const gameOption = JSON.stringify({
      gameOption: {
        maxCardValue: cardsInDeckArray[0] / 4,
        typeCount: GameOption.gameOption.typeCount,
        numberOfCardsPlayerShouldHave:
          GameOption.gameOption.numberOfCardsPlayerShouldHave,
        roundToStart: GameOption.gameOption.roundToStart,
        trump: null,
        customCardDeck:
          deckOptionSelected === 0
            ? null
            : deck
              ? deck
              : GameOption.gameOption.customCardDeck
                ? GameOption.gameOption.customCardDeck
                : [],
        cardsInHands: null,
      },
      timerOption: {
        timerType: timerOptions[timerOptionSelected].value,
        timeAtStartInSeconds: timeAtStartInSecondsArray[0],
        timeForEachRoundInSeconds: timeForEachRoundInSecondsArray[0],
      },
      computerControlledPlayerCount: computerControlledOpponentArray
        ? computerControlledOpponentArray[0]
        : 0,
      opponentCards: opponentCardsOptions[opponentCardsOptionsSelected].value,
    });
    return (
      "GameOptionAsString|" +
      '{"gameOptionAsString" :' +
      JSON.stringify(gameOption) +
      "}"
    );
  };

  const computerControlledOpponentChanged = () => {
    sendMessageToWebsocket(createGameOption());
  };

  const gameOptionChanged = () => {
    sendMessageToWebsocket(createGameOption());
  };

  const exampleDeck = () => {
    sendMessageToWebsocket(createGameOption(debugDeck36));
  };

  const timerOptionChanged = () => {
    sendMessageToWebsocket(createGameOption());
  };

  const startGame = () => {
    sendMessageToWebsocket("CreateGame|{}");
  };
  const leaveGameLobby = () => {
    sendMessageToWebsocket("LeaveGameLobby|{}");
  };

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }

  const { form, errors, state, handleChange, handleSubmit } = createForm({
    initialValues: {
      createDeckArray: "",
    },
    validate: (values) => {
      let errs = {};
      if (values.createDeckArray === "") {
        errs["createDeckArray"] = "Create Deck Array is required";
        toast.push(errs["createDeckArray"], { target: "Error" });
      }
      return errs;
    },
    onSubmit: (values) => {
      try {
        const deckArray = JSON.parse(values.createDeckArray);
        if (Array.isArray(deckArray)) {
          if (
            deckArray.every((element) => {
              return (
                element.hasOwnProperty("Card") &&
                element.Card != null &&
                typeof element.Card === "object" &&
                element.Card.hasOwnProperty("value") &&
                element.Card.value != null &&
                isNumber(element.Card.value) &&
                element.Card.hasOwnProperty("type") &&
                element.Card.type != null &&
                (typeof element.Card.type === "string" ||
                  element.Card.type instanceof String) &&
                (element.Card.type === "hearts" ||
                  element.Card.type === "diamonds" ||
                  element.Card.type === "spades" ||
                  element.Card.type === "clubs")
              );
            })
          ) {
            sendMessageToWebsocket(
              createGameOption(JSON.parse(values.createDeckArray)),
            );
          } else {
            toast.push(
              "Please check if all Cards in the Array are valid Card Objects",
              { target: "Error" },
            );
          }
        } else {
          toast.push("Please provide a Json Array", {
            target: "Error",
          });
        }
      } catch (e) {
        toast.push("Error parsing Custom Card Deck Array", {
          target: "Error",
        });
      }
    },
  });
</script>

<div class="grid grid-cols-1 gap-4">
  {#if UsersInGameLobby}
    <h1 class="text-center text-lg font-bold">Create Game</h1>
    <label for="maxUserCount">Max User Count</label>
    <RangeSlider
      id="slider"
      disabled={!isCreateGameLobbyAdmin || undefined}
      bind:values={maxUserSizeArray}
      pips
      step={1}
      all="label"
      pipstep={1}
      min={1}
      max={10}
      on:change={maxUserCountChanged}
    />
    <br />
    <br />
    <label for="computerControlledOpponent">Computer Controlled Opponent</label>
    <RangeSlider
      id="slider"
      disabled={!isCreateGameLobbyAdmin || undefined}
      bind:values={computerControlledOpponentArray}
      pips
      step={1}
      all="label"
      pipstep={1}
      min={0}
      max={5}
      on:change={computerControlledOpponentChanged}
    />
    <br />
    <br />
    <label for="deckType">Deck Type</label>
    <select
      bind:value={deckOptionSelected}
      on:change={gameOptionChanged}
      disabled={!isCreateGameLobbyAdmin || undefined}
    >
      {#each deckOptions as option}
        <option value={option.id}>{option.label}</option>
      {/each}
    </select>
    {#if deckOptionSelected == 0}
      <label for="NumberOfCardsInDeck">Number of Cards in Deck</label>
      <RangeSlider
        id="slider"
        disabled={!isCreateGameLobbyAdmin || undefined}
        bind:values={cardsInDeckArray}
        pips
        step={4}
        all="label"
        pipstep={1}
        min={4}
        max={40}
        on:change={gameOptionChanged}
      />
      <br />
      <br />
    {:else}
      {#if isCreateGameLobbyAdmin}
        <form class="grid grid-cols-1 gap-4" on:submit={handleSubmit}>
          <label for="createDeckArray">Create Deck from Array</label>
          <input
            class="border-2 bg-background"
            id="createDeckArray"
            name="createDeckArray"
            on:change={handleChange}
            bind:value={$form.createDeckArray}
          />
          <ModernDurakButton
            type="submit"
            buttonText="Create Card Deck from Json Array"
          />
        </form>
        <ModernDurakButton
          onClick={() => {
            exampleDeck();
          }}
          buttonText="Use example Deck with 36 Cards"
        />
      {/if}
      {#if GameOption.gameOption.customCardDeck && GameOption.gameOption.customCardDeck.length >= 1}
        <label for="">Cards in Deck</label>
        <div class="flex">
          {#each GameOption.gameOption.customCardDeck as card}
            <Card card={card.Card} />
          {/each}
        </div>
      {:else}
        <p>No Cards in Deck</p>
      {/if}
    {/if}
    <label for="opponentCardsOption">Opponent Cards Option</label>
    <select
      bind:value={opponentCardsOptionsSelected}
      on:change={timerOptionChanged}
      disabled={!isCreateGameLobbyAdmin || undefined}
    >
      {#each opponentCardsOptions as option}
        <option value={option.id}>{option.label}</option>
      {/each}
    </select>
    <label for="timerType">Timer Type</label>
    <select
      bind:value={timerOptionSelected}
      on:change={timerOptionChanged}
      disabled={!isCreateGameLobbyAdmin || undefined}
    >
      {#each timerOptions as option}
        <option value={option.id}>{option.label}</option>
      {/each}
    </select>
    {#if timerOptionSelected > 0}
      <label for="timeAtStartInSeconds">Time at Start in Seconds</label>
      <RangeSlider
        id="slider"
        disabled={!isCreateGameLobbyAdmin || undefined}
        bind:values={timeAtStartInSecondsArray}
        pips
        step={25}
        all="label"
        min={0}
        max={200}
        on:change={timerOptionChanged}
      />
      <br />
      <br />
      <label for="timeForEachRound">Time for each Round</label>
      <RangeSlider
        id="slider"
        disabled={!isCreateGameLobbyAdmin || undefined}
        bind:values={timeForEachRoundInSecondsArray}
        pips
        step={5}
        all="label"
        min={0}
        max={50}
        on:change={timerOptionChanged}
      />
      <br />
      <br />
    {/if}
    <p>Users in Game Lobby</p>
    {#each UsersInGameLobby.users as user}
      <p>{user.UserInGameLobby.accountName}</p>
    {/each}
  {/if}
  {#if isCreateGameLobbyAdmin}
    <ModernDurakButton onClick={startGame} buttonText="Start Game" />
  {/if}
  <ModernDurakButton onClick={leaveGameLobby} buttonText="Leave Game Lobby" />
</div>
