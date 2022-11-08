<script>
  export let label = "";
  export let bindGroup = [];
  export let value = "";
</script>

<label
  >{label}
  <input type="checkbox" bind:group={bindGroup} {value} />
  <span />
</label>
