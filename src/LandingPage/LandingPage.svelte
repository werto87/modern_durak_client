<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import { sendMessageToWebsocket } from "../Webservice/store.js";
  import ModernDurakButton from "../component/ModernDurakButton.svelte";
  import Card from "../component/Card.svelte";

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
</script>

<div class="grid grid-cols-1 gap-4 ">
  <div class="ml-4 mr-4 grid grid-cols-1 gap-4">
    <h1 class="text-center text-lg font-bold">Chose Game Mode</h1>
    <ModernDurakButton buttonText="Quick" onClick={quickPressed} />
    <ModernDurakButton buttonText="Ranked" onClick={rankedPressed} />
    <ModernDurakButton buttonText="Puzzle" onClick={puzzlePressed} />
    <ModernDurakButton buttonText="Custom" onClick={customPressed} />
    {#if loginState}
      <ModernDurakButton buttonText="Logout" onClick={logout} />
    {:else}
      <ModernDurakButton buttonText="Login" onClick={login} />
    {/if}
  </div>
</div>
