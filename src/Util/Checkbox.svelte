<script>
    export let label = "";
    export let bindGroup = [];
    export let value = "";
</script>

<label class="container"
    >{label}
    <input type="checkbox" bind:group={bindGroup} {value} />
    <span class="checkmark" />
</label>
