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


<p class="truncate playerName">{player.PlayerData.name}</p>
<div class="h-2"></div>
<div class="grid grid-cols-2">
    <div class="relative pt-1 cards">
        <div class="absolute inset-0 flex rotate-90 items-center justify-center">
            {@html cardDeckIcon}
        </div>

        <p class="absolute inset-0 flex items-center justify-center cardCount">
            {player.PlayerData.cards.length}
        </p>
    </div>
    <div class="grid grid-cols-1">
        <p id="playerRole">
            {printPlayerRole(player.PlayerData.playerRole)}
        </p>

        {#if DurakTimers}
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
                        <br/>
                        {countdown}
                    </p>
                </Countdown>
            {:else}
                <p id="pauseTimer">
                    Time Left
                    <br/>
                    {timeLeftForPlayerInSeconds(
                        player.PlayerData.name,
                        DurakTimers.pausedTimeUserDurationMilliseconds
                    )}
                </p>
            {/if}
        {/if}
    </div>
</div>
<div class="h-2"></div>
