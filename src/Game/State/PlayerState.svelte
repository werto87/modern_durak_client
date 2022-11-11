<script>
  import Countdown from "../../Util/Countdown.svelte";
  import Deck from "../../component/Deck.svelte";
  import Card from "../../component/Card.svelte";

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

<!--TODO timer for player-->
<!--TODO enemy timer if player knows enemy cards-->
<div>
  <div class="grid grid-cols-2">
    <p>Name:</p>
    <p class="truncate">{player.PlayerData.name}</p>
  </div>
  {#if player?.PlayerData?.cards !== [] && player?.PlayerData?.cards[0] != null}
    <div class="grid grid-cols-2">
      <p>Role:</p>
      <p>{printPlayerRole(player.PlayerData.playerRole)}</p>
    </div>

    <div class="flex flex-wrap justify-center gap-2">
      {#each player?.PlayerData?.cards as card}
        <Card className="h-20 w-12 bg-blue-500 text-center" card={card.Card} />
      {/each}
    </div>
  {:else}
    <br />
    <div class="grid grid-cols-2">
      <div class="relative">
        <div
          class="absolute inset-0 flex rotate-90 items-center justify-center"
        >
          <Deck />
        </div>
        <p class="absolute inset-0 flex items-center justify-center">
          {player.PlayerData.cards.length}
        </p>
      </div>
      <div class="grid grid-cols-1">
        <p id="playerRole" class="text-center">
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
        {/if}
      </div>
    </div>
    <br />
  {/if}
</div>
