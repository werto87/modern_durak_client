<script>
    export let UsersInGameLobby = null;
    export let SetTimerOption = null;
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

    import { sendMessageToWebsocket } from "../Webservice/store.js";
    const maxUserCountChanged = () => {
        const maxUserObject = { maxUserSize: UsersInGameLobby.maxUserSize };
        sendMessageToWebsocket(
            "SetMaxUserSizeInCreateGameLobby|" + JSON.stringify(maxUserObject)
        );
    };
    const maxCardValueChanged = () => {
        const maxCardValueObject = {
            maxCardValue: UsersInGameLobby.durakGameOption.maxCardValue,
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
                    timeAtStartInSeconds: SetTimerOption.timeAtStartInSeconds,
                    timeForEachRoundInSeconds:
                        SetTimerOption.timeForEachRoundInSeconds,
                })
        );
    };

    const timeAtStartInSecondsChanged = () => {
        sendMessageToWebsocket(
            "SetTimerOption|" +
                JSON.stringify({
                    timerType: options[selected].value,
                    timeAtStartInSeconds: SetTimerOption.timeAtStartInSeconds,
                    timeForEachRoundInSeconds:
                        SetTimerOption.timeForEachRoundInSeconds,
                })
        );
    };
    const timeForEachRoundChanged = () => {
        sendMessageToWebsocket(
            "SetTimerOption|" +
                JSON.stringify({
                    timerType: options[selected].value,
                    timeAtStartInSeconds: SetTimerOption.timeAtStartInSeconds,
                    timeForEachRoundInSeconds:
                        SetTimerOption.timeForEachRoundInSeconds,
                })
        );
    };
    const startGame = () => {
        sendMessageToWebsocket("CreateGame|{}");
    };
    const leaveGameLobby = () => {
        sendMessageToWebsocket("LeaveGameLobby|{}");
    };
</script>

{#if UsersInGameLobby}
    <div class="container" />
    <h1>Create Game</h1>
    <div>
        <label for="maxUserCount">Max User Count</label>
        <input
            disabled={!isCreateGameLobbyAdmin || undefined}
            type="number"
            min="1"
            name="maxUserCount"
            bind:value={UsersInGameLobby.maxUserSize}
            on:change={maxUserCountChanged}
        />
        <label for="maxCardValue">Max Card Value</label>
        <input
            disabled={!isCreateGameLobbyAdmin || undefined}
            type="number"
            min="1"
            name="maxCardValue"
            bind:value={UsersInGameLobby.durakGameOption.maxCardValue}
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
            <input
                disabled={!isCreateGameLobbyAdmin || undefined}
                type="number"
                min="0"
                name="timeAtStartInSeconds"
                bind:value={SetTimerOption.timeAtStartInSeconds}
                on:change={timeAtStartInSecondsChanged}
            />
            <label for="timeForEachRound">Time for each Round</label>
            <input
                disabled={!isCreateGameLobbyAdmin || undefined}
                type="number"
                min="0"
                name="timeForEachRound"
                bind:value={SetTimerOption.timeForEachRoundInSeconds}
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

<div>
    <button on:click={startGame}>Start Game</button>
</div>
<div>
    <button on:click={leaveGameLobby}>Leave Game Lobby</button>
</div>
