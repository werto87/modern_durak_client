<script>
    export let buttonText;
    export let onClick = undefined;
    export let type = undefined;
</script>
<button type={type} on:click={onClick} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    {buttonText}
</button>
