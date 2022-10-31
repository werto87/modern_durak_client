<script>
    export let buttonText
    export let onClick
</script>
<button on:click={onClick} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    {buttonText}
</button>
