<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import { sendMessageToWebsocket } from "../Webservice/store.js";
  import ModernDurakButton from "../component/ModernDurakButton.svelte";
  import { Hamburger } from "svelte-hamburgers";

  let open;
  export let loginState: string = null;
  let dispatch = createEventDispatcher();
  const quickPressed = () => {
    if (!loginState) {
      sendMessageToWebsocket("LoginAsGuest|{}");
    }
    dispatch("stateMachineEvent", "Quick");
    sendMessageToWebsocket('JoinMatchMakingQueue|{"isRanked": false}');
  };
  const rankedPressed = () => {
    if (loginState != "registered") {
      dispatch("stateMachineEvent", "RankedLogin");
    } else {
      dispatch("stateMachineEvent", "Ranked");
      sendMessageToWebsocket('JoinMatchMakingQueue|{"isRanked": true}');
    }
  };
  const puzzlePressed = () => {
    if (!loginState) {
      sendMessageToWebsocket("LoginAsGuest|{}");
    }
    sendMessageToWebsocket(
      "CreateGameLobby|" + '{"name":"' + uuidv4() + '","password":""}'
    );
    dispatch("stateMachineEvent", "CreatePuzzle");
  };
  const customPressed = () => {
    if (!loginState) {
      sendMessageToWebsocket("LoginAsGuest|{}");
    }
    dispatch("stateMachineEvent", "Custom");
  };
  const login = () => {
    dispatch("stateMachineEvent", "LandingPageLogin");
  };
  const logout = () => {
    sendMessageToWebsocket("LogoutAccount|{}");
  };
  const about = () => {
    dispatch("stateMachineEvent", "About");
  };
  const reportIssueAskQuestion = () => {
    window.open(`https://github.com/werto87/modern_durak`, "_blank");
  };
  const viewLeaderBoard = () => {
    dispatch("stateMachineEvent", "LeaderBoard");
    sendMessageToWebsocket('GetTopRatedPlayers|{"playerCount":10}');
  };
</script>

{#if open}
  <div class="grid grid-cols-1 gap-4 ">
    <div class="ml-4 mr-4 grid grid-cols-1 gap-4">
      <div class="mt-2 flex">
        <div class="w-12 " />
        <div class="flex grow items-center text-lg font-bold">
          <h1 class="grow text-center text-lg font-bold">Menu</h1>
        </div>
        <div class="w-12 overflow-clip">
          <Hamburger
            bind:open
            --color="#0e3b93"
            --layer-width="30px"
            --layer-height="5px"
            --padding="0px"
          />
        </div>
      </div>
      <ModernDurakButton buttonText="About" onClick={about} />
      <ModernDurakButton
        buttonText="Report Issue / Ask Question"
        onClick={reportIssueAskQuestion}
      />
      <ModernDurakButton
        buttonText="View Leaderboard"
        onClick={viewLeaderBoard}
      />
      {#if loginState}
        <ModernDurakButton buttonText="Logout" onClick={logout} />
      {:else}
        <ModernDurakButton buttonText="Login" onClick={login} />
      {/if}
    </div>
  </div>
{:else}
  <div class="grid grid-cols-1 gap-4 ">
    <div class="ml-4 mr-4 grid grid-cols-1 gap-4">
      <div class="mt-2 flex">
        <div class="w-12 " />
        <div class="flex grow items-center text-lg font-bold">
          <h1 class="grow text-center text-lg font-bold">Chose Game Mode</h1>
        </div>
        <div class="w-12 overflow-clip">
          <Hamburger
            bind:open
            --color="#0e3b93"
            --layer-width="30px"
            --layer-height="5px"
            --padding="0px"
          />
        </div>
      </div>
      <ModernDurakButton buttonText="Quick" onClick={quickPressed} />
      <ModernDurakButton buttonText="Ranked" onClick={rankedPressed} />
      <ModernDurakButton buttonText="Puzzle" onClick={puzzlePressed} />
      <ModernDurakButton buttonText="Custom" onClick={customPressed} />
    </div>
  </div>
{/if}
