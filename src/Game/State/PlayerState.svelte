<script>
    import cardDeckIcon from "../../asset/icons/deck.svg";
    import Countdown from "../../Util/Countdown.svelte";
    export let player = null;
    export let DurakTimers = null;

    const countdownForPlayerInSeconds = (playerName, runningTimers) => {
        let playerTimer = runningTimers.find((nameAndTimer) => {
            return nameAndTimer[0] == playerName;
        });
        if (playerTimer) {
            const secondsLeft = playerTimer[1];
            let result = Math.floor((secondsLeft - Date.now()) / 1000);
            return result;
        } else {
            return 0;
        }
    };
    const timeLeftForPlayerInSeconds = (playerName, pausedTimer) => {
        let playerTimer = pausedTimer.find((nameAndTimer) => {
            return nameAndTimer[0] == playerName;
        });
        if (playerTimer) {
            return Math.floor(playerTimer[1] / 1000);
        } else {
            return 0;
        }
    };
    const playerHasRunningTimer = (playerName, runningTimers) => {
        return (
            runningTimers.find((nameAndTimer) => {
                return nameAndTimer[0] == playerName;
            }) != undefined
        );
    };
    const printPlayerRole = (playerRole) => {
        if (playerRole == "assistAttacker") {
            return "assist";
        } else if (playerRole == "waiting") {
            return "wait";
        } else {
            return playerRole;
        }
    };
</script>

<div class="otherPlayerState">
    <h4 class="playerName">{player.PlayerData.name}</h4>
    <hr id="playerNameHr" />
    <div class="deckContainerCards">
        <span class="cards">
            {@html cardDeckIcon}
        </span>
        <p class="cardCount">
            {player.PlayerData.cards.length}
        </p>
    </div>
    <div id="roleAndTimeLeftContainer">
        <p id="playerRole">
            {printPlayerRole(player.PlayerData.playerRole)}
        </p>
        {#if DurakTimers}
            <div id="timer">
                {#if playerHasRunningTimer(player.PlayerData.name, DurakTimers.runningTimeUserTimePointMilliseconds)}
                    <Countdown
                        countdown={countdownForPlayerInSeconds(
                            player.PlayerData.name,
                            DurakTimers.runningTimeUserTimePointMilliseconds
                        )}
                        let:countdown
                    >
                        <p id="runningTimer">
                            Time Left
                            <br />
                            {countdown}
                        </p>
                    </Countdown>
                {:else}
                    <p id="pauseTimer">
                        Time Left
                        <br />
                        {timeLeftForPlayerInSeconds(
                            player.PlayerData.name,
                            DurakTimers.pausedTimeUserDurationMilliseconds
                        )}
                    </p>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    :global(.otherPlayerState) {
        padding-bottom: 10px;
        border-style: solid;
        border-color: #cccccc;
        margin: 3px;
        margin-left: 0px;
        margin-bottom: 0px;
        height: 8em;
    }
    :global(.deckContainerCards) {
        display: flex;
    }
    :global(.cards) {
        transform: rotate(90deg);
        min-width: var(--itemWidthMin);
        max-width: var(--itemWidthMin);

        margin-left: -1em;
        z-index: -100;
    }
    :global(.cardCount) {
        margin-left: -3.9em;
        margin-top: 1.4em;
        width: 2em;
    }
    :global(.playerName) {
        margin: 1em;
        margin-top: 10px;
        margin-bottom: 0px;
    }

    :global(#runningTimer) {
        color: #ffaa00;
    }

    :global(#roleAndTimeLeftContainer) {
        margin-top: -6em;
        margin-right: -4em;
    }
    :global(#playerNameHr) {
        margin-bottom: 1em;
        margin-top: 8px;
        color: #cccccc;

        /* margin-right: -4em; */
    }
</style>
