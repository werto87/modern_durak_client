<script>
    export let buttonText;
    export let onClick = undefined;
    export let type = undefined;
    export let disabled = undefined;

</script>
<button disabled={disabled} type={type} on:click={onClick}
        class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:opacity-25">
    {buttonText}
</button>
