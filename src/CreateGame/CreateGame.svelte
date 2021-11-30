<script>
    import RangeSlider from "svelte-range-slider-pips";
    import { printCard } from "../Game/Board/helper";
    import { toast } from "@zerodevx/svelte-toast";
    export let UsersInGameLobby = null;
    export let SetTimerOption = {
        timerType: "noTimer",
        timeAtStartInSeconds: 0,
        timeForEachRoundInSeconds: 0,
    };
    export let timerOptionSelected = 0;
    export let deckOptionSelected = 0;
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
        // TODO add option to play with specific cards
    ];
    // framework "svelte-range-slider-pips" requires this to be array so this is a workaround
    $: maxUserSizeArray = [UsersInGameLobby?.maxUserSize];
    $: cardsInDeckArray = [UsersInGameLobby?.durakGameOption.maxCardValue * 4];
    $: timeAtStartInSecondsArray = [SetTimerOption?.timeAtStartInSeconds];
    $: timeForEachRoundInSecondsArray = [
        SetTimerOption?.timeForEachRoundInSeconds,
    ];

    import { sendMessageToWebsocket } from "../Webservice/store.js";
    import { createForm } from "svelte-forms-lib";
    const maxUserCountChanged = () => {
        const maxUserObject = { maxUserSize: maxUserSizeArray[0] };
        sendMessageToWebsocket(
            "SetMaxUserSizeInCreateGameLobby|" + JSON.stringify(maxUserObject)
        );
    };

    const gameOptionChanged = () => {
        const customCardDeckValue = deckOptionSelected == 0 ? null : [];
        sendMessageToWebsocket(
            "GameOption|" +
                JSON.stringify({
                    maxCardValue: cardsInDeckArray[0] / 4,
                    typeCount: UsersInGameLobby.durakGameOption.typeCount,
                    numberOfCardsPlayerShouldHave:
                        UsersInGameLobby.durakGameOption
                            .numberOfCardsPlayerShouldHave,
                    roundToStart: UsersInGameLobby.durakGameOption.roundToStart,
                    customCardDeck: customCardDeckValue,
                })
        );
    };

    const exampleDeck = () => {
        sendMessageToWebsocket(
            "GameOption|" +
                JSON.stringify({
                    maxCardValue: cardsInDeckArray[0] / 4,
                    typeCount: UsersInGameLobby.durakGameOption.typeCount,
                    numberOfCardsPlayerShouldHave:
                        UsersInGameLobby.durakGameOption
                            .numberOfCardsPlayerShouldHave,
                    roundToStart: UsersInGameLobby.durakGameOption.roundToStart,
                    customCardDeck: debugDeck36,
                })
        );
    };

    const timerOptionChanged = () => {
        sendMessageToWebsocket(
            "SetTimerOption|" +
                JSON.stringify({
                    timerType: timerOptions[timerOptionSelected].value,
                    timeAtStartInSeconds: timeAtStartInSecondsArray[0],
                    timeForEachRoundInSeconds:
                        timeForEachRoundInSecondsArray[0],
                })
        );
    };

    const startGame = () => {
        sendMessageToWebsocket("CreateGame|{}");
    };
    const leaveGameLobby = () => {
        sendMessageToWebsocket("LeaveGameLobby|{}");
    };
    const debugDeck36 = [
        { Card: { value: 7, type: "clubs" } },
        { Card: { value: 8, type: "clubs" } },
        { Card: { value: 3, type: "hearts" } },
        { Card: { value: 3, type: "clubs" } },
        { Card: { value: 2, type: "diamonds" } },
        { Card: { value: 3, type: "diamonds" } },
        { Card: { value: 2, type: "clubs" } },
        { Card: { value: 5, type: "diamonds" } },
        { Card: { value: 6, type: "diamonds" } },
        { Card: { value: 7, type: "diamonds" } },
        { Card: { value: 8, type: "diamonds" } },
        { Card: { value: 9, type: "diamonds" } },
        { Card: { value: 1, type: "spades" } },
        { Card: { value: 2, type: "spades" } },
        { Card: { value: 3, type: "spades" } },
        { Card: { value: 1, type: "diamonds" } },
        { Card: { value: 5, type: "spades" } },
        { Card: { value: 6, type: "spades" } },
        { Card: { value: 7, type: "spades" } },
        { Card: { value: 8, type: "spades" } },
        { Card: { value: 9, type: "spades" } },
        { Card: { value: 1, type: "hearts" } },
        { Card: { value: 2, type: "hearts" } },
        { Card: { value: 9, type: "clubs" } },
        { Card: { value: 1, type: "clubs" } },
        { Card: { value: 5, type: "hearts" } },
        { Card: { value: 6, type: "clubs" } },
        { Card: { value: 7, type: "hearts" } },
        { Card: { value: 8, type: "hearts" } },
        { Card: { value: 9, type: "hearts" } },
        { Card: { value: 4, type: "hearts" } },
        { Card: { value: 4, type: "diamonds" } },
        { Card: { value: 4, type: "spades" } },
        { Card: { value: 4, type: "clubs" } },
        { Card: { value: 5, type: "clubs" } },
        { Card: { value: 6, type: "hearts" } },
    ];
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
                                (element.Card.type == "hearts" ||
                                    element.Card.type == "diamonds" ||
                                    element.Card.type == "spades" ||
                                    element.Card.type == "clubs")
                            );
                        })
                    ) {
                        sendMessageToWebsocket(
                            "GameOption|" +
                                JSON.stringify({
                                    // NOTE maxCardValue and typeCount will get ignored because we set customCardDeck
                                    maxCardValue:
                                        UsersInGameLobby.durakGameOption
                                            .maxCardValue,
                                    typeCount:
                                        UsersInGameLobby.durakGameOption
                                            .typeCount,
                                    numberOfCardsPlayerShouldHave:
                                        UsersInGameLobby.durakGameOption
                                            .numberOfCardsPlayerShouldHave,
                                    roundToStart:
                                        UsersInGameLobby.durakGameOption
                                            .roundToStart,
                                    customCardDeck: JSON.parse(
                                        values.createDeckArray
                                    ),
                                })
                        );
                    } else {
                        toast.push(
                            "Please check if all Cards in the Array are valid Card Objects",
                            { target: "Error" }
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

{#if UsersInGameLobby}
    <div class="container" />

    <h1>Create Game</h1>
    <div>
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
        {:else}
            {#if isCreateGameLobbyAdmin}
                <form on:submit={handleSubmit}>
                    <label for="createDeckArray">Create Deck from Array</label>
                    <input
                        id="createDeckArray"
                        name="createDeckArray"
                        on:change={handleChange}
                        bind:value={$form.createDeckArray}
                    />
                    <button type="submit"
                        >Create Card Deck from Json Array</button
                    >
                </form>
                <button
                    on:click={() => {
                        exampleDeck();
                    }}>Use example Deck with 36 Cards</button
                >
            {/if}
            {#if UsersInGameLobby.durakGameOption.customCardDeck && UsersInGameLobby.durakGameOption.customCardDeck.length >= 1}
                <div>
                    <label for="">Cards in Deck</label>
                    {#each UsersInGameLobby.durakGameOption.customCardDeck as card}
                        <span
                            class={card.Card.type === "hearts" ||
                            card.Card.type === "diamonds"
                                ? "redText"
                                : "greenText"}
                        >
                            <p class="cardText">{printCard(card.Card)}&nbsp;</p>
                        </span>
                    {/each}
                </div>
            {:else}
                <p>No Cards in Deck</p>
            {/if}
        {/if}
    </div>
    <div>
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
        {/if}
    </div>

    <div>
        {#each UsersInGameLobby.users as user}
            <p>{user.UserInGameLobby.accountName}</p>
        {/each}
    </div>
{/if}

{#if isCreateGameLobbyAdmin}
    <div>
        <button on:click={startGame}>Start Game</button>
    </div>
{/if}

<div>
    <button on:click={leaveGameLobby}>Leave Game Lobby</button>
</div>

<style>
</style>
