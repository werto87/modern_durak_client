<script lang="ts">
    export let errors: Array<string> = [];
</script>

<main>
    {#each errors as error}
        <p>{error}</p>
    {/each}
</main>

<style>
    p {
        color: #ff3e00;
    }
</style>
