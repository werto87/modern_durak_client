<script>
    import { onMount } from "svelte";
    export let countdown = 10;
    let timer;
    $: {
        if (countdown === 0) {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }
    }
    onMount(() => {
        timer = setInterval(() => {
            countdown -= 1;
        }, 1000);
    });
</script>

<slot {countdown} />

