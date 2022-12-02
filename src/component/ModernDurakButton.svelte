<script>
  export let buttonText;
  export let onClick = undefined;
  export let type = undefined;
  export let disabled = undefined;
</script>

<button
  {disabled}
  {type}
  on:click={onClick}
  class="rounded border-2 border-borderColor bg-cardBackground px-4 py-2 font-bold text-greenCardValue  focus:outline-none disabled:opacity-25"
>
  {buttonText}
</button>
