<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import { sendMessageToWebsocket } from "../Webservice/store.js";
  import ModernDurakButton from "../component/ModernDurakButton.svelte";
  import { Hamburger } from "svelte-hamburgers";

  let open;
  export let loginState: string = null;
  export let accountName: string = null;

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
    sendMessageToWebsocket('SubscribeGetTopRatedPlayers|{"playerCount":10}');
    sendMessageToWebsocket('GetTopRatedPlayers|{"playerCount":10}');
  };
  const viewLoggedInPlayers = () => {
    dispatch("stateMachineEvent", "LoggedInPlayers");
    sendMessageToWebsocket('SubscribeGetLoggedInPlayers|{"playerCount":1337}');
    sendMessageToWebsocket('GetLoggedInPlayers|{"playerCount":1337}');
  };
</script>

{#if open}
  <div class="grid grid-cols-1 gap-4 ">
    <div class="ml-4 mr-4 grid grid-cols-1 gap-4">
      <div class="mt-2 flex">
        <div class="w-12 " />
        <div class="grid grow grid-cols-1">
          {#if loginState}
            {#if loginState == "guest"}
              <h1 class="grow text-center text-lg font-bold">
                Logged in as Guest
              </h1>
            {/if}
            <h1 class="grow text-center text-lg font-bold">
              {accountName}
            </h1>
          {:else}
            <h1 class="grow text-center text-lg font-bold">Please log in</h1>
          {/if}
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
      {#if !loginState}
        <ModernDurakButton buttonText="Login" onClick={login} />
      {/if}
      <ModernDurakButton buttonText="About" onClick={about} />
      <ModernDurakButton
        buttonText="Report Issue / Ask Question"
        onClick={reportIssueAskQuestion}
      />
      <ModernDurakButton
        buttonText="View Leaderboard"
        onClick={viewLeaderBoard}
      />
      <ModernDurakButton
        buttonText="View logged in Players"
        onClick={viewLoggedInPlayers}
      />
      {#if loginState}
        <ModernDurakButton buttonText="Logout" onClick={logout} />
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
