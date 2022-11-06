<script>
    export let buttonText;
    export let onClick = undefined;
    export let type = undefined;
    export let disabled = undefined;

</script>
<button disabled={disabled} type={type} on:click={onClick}
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none disabled:opacity-25">
    {buttonText}
</button>
