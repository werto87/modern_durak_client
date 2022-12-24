<script>
  import { isWebSocketConnected } from "../Webservice/store.js";

  let disableButton = false;
  isWebSocketConnected.subscribe((isConnected) => {
    disableButton = !isConnected;
  });
  export let buttonText;
  export let onClick = undefined;
  export let type = undefined;
  export let disabled = undefined;
</script>

<button
  disabled={disabled || disableButton}
  {type}
  on:click={onClick}
  class="rounded border-2 border-borderColor bg-cardBackground  py-2 font-bold text-greenCardValue  focus:outline-none disabled:opacity-25"
>
  {buttonText}
</button>
