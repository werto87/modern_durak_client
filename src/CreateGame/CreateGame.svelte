<script>
    import RangeSlider from "svelte-range-slider-pips";

    export let UsersInGameLobby = null;
    export let SetTimerOption = {
        timerType: "noTimer",
        timeAtStartInSeconds: 0,
        timeForEachRoundInSeconds: 0,
    };
    export let selected = 0;
    export let isCreateGameLobbyAdmin = true;
    let options = [
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
    // framework "svelte-range-slider-pips" requires this to be array so this is a workaround
    $: maxUserSizeArray = [UsersInGameLobby?.maxUserSize];
    $: maxCardValueArray = [UsersInGameLobby?.durakGameOption.maxCardValue];
    $: timeAtStartInSecondsArray = [SetTimerOption?.timeAtStartInSeconds];
    $: timeForEachRoundInSecondsArray = [
        SetTimerOption?.timeForEachRoundInSeconds,
    ];

    import { sendMessageToWebsocket } from "../Webservice/store.js";
    const maxUserCountChanged = () => {
        const maxUserObject = { maxUserSize: maxUserSizeArray[0] };
        sendMessageToWebsocket(
            "SetMaxUserSizeInCreateGameLobby|" + JSON.stringify(maxUserObject)
        );
    };
    const maxCardValueChanged = () => {
        const maxCardValueObject = {
            maxCardValue: maxCardValueArray[0],
        };
        sendMessageToWebsocket(
            "SetMaxCardValueInCreateGameLobby|" +
                JSON.stringify(maxCardValueObject)
        );
    };

    const timerTypeChanged = () => {
        sendMessageToWebsocket(
            "SetTimerOption|" +
                JSON.stringify({
                    timerType: options[selected].value,
                    timeAtStartInSeconds: timeAtStartInSecondsArray[0],
                    timeForEachRoundInSeconds:
                        timeForEachRoundInSecondsArray[0],
                })
        );
    };

    const timeAtStartInSecondsChanged = () => {
        sendMessageToWebsocket(
            "SetTimerOption|" +
                JSON.stringify({
                    timerType: options[selected].value,
                    timeAtStartInSeconds: timeAtStartInSecondsArray[0],
                    timeForEachRoundInSeconds:
                        timeForEachRoundInSecondsArray[0],
                })
        );
    };
    const timeForEachRoundChanged = () => {
        sendMessageToWebsocket(
            "SetTimerOption|" +
                JSON.stringify({
                    timerType: options[selected].value,
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
    let values = [1];
</script>

{#if UsersInGameLobby}
    <div class="container" />

    <h1>Create Game</h1>
    <div>
        <!-- TODO find out how to make this a bit smaller -->
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
        <label for="maxCardValue">Max Card Value</label>
        <RangeSlider
            id="slider"
            disabled={!isCreateGameLobbyAdmin || undefined}
            bind:values={maxCardValueArray}
            pips
            step={1}
            all="label"
            pipstep={1}
            min={1}
            max={10}
            on:change={maxCardValueChanged}
        />
    </div>
    <div>
        <label for="timerType">Timer Type</label>
        <select
            bind:value={selected}
            on:change={timerTypeChanged}
            disabled={!isCreateGameLobbyAdmin || undefined}
        >
            {#each options as option}
                <option value={option.id}>{option.label}</option>
            {/each}
        </select>
        {#if selected > 0}
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
                on:change={timeAtStartInSecondsChanged}
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
                on:change={timeForEachRoundChanged}
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
        <button
            disabled={UsersInGameLobby?.users.length < 2 || undefined}
            on:click={startGame}>Start Game</button
        >
    </div>
{/if}

<div>
    <button on:click={leaveGameLobby}>Leave Game Lobby</button>
</div>
