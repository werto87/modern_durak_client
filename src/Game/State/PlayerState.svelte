<script>
  import Countdown from "../../Util/Countdown.svelte";
  import Deck from "../../component/Deck.svelte";
  import Card from "../../component/Card.svelte";

  export let player = null;
  export let DurakTimers = null;
  export let ShowCardsIfPossible = true;

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
    <p>Role</p>
    <p>{printPlayerRole(player.PlayerData.playerRole)}</p>
  </div>
  <div class="grid grid-cols-2">
    <p>Cards</p>
    <div class="flex flex-wrap gap-2">
      {#each player?.PlayerData?.cards as card}
        {#if card }
          <Card className="h-10 w-6 bg-blue-500 text-center" card={card.Card} />
          {:else }
          <Card className="h-10 w-6 bg-blue-500 text-center" card={{"value":"?","type":"?"}} />
        {/if}

      {/each}
    </div>
  </div>
    <div class="grid grid-cols-2">
    {#if DurakTimers}
      {#if playerHasRunningTimer(player.PlayerData.name, DurakTimers.runningTimeUserTimePointMilliseconds)}
        <Countdown
          countdown={countdownForPlayerInSeconds(
            player.PlayerData.name,
            DurakTimers.runningTimeUserTimePointMilliseconds
          )}
          let:countdown
        >
          <p>Time Left:</p>
          <p id="runningTimer">
            {countdown}
          </p>
        </Countdown>
      {:else}
        <p>Time Left:</p>
        <p id="pauseTimer">
          {timeLeftForPlayerInSeconds(
            player.PlayerData.name,
            DurakTimers.pausedTimeUserDurationMilliseconds
          )}
        </p>
      {/if}
    {/if}
    </div>
          </div>

