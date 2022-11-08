<script>
  export let card;
  export let className = "";

  function printCard(card) {
    return card.value + printType(card.type);
  }

  function printType(type) {
    let result;
    if (type === "hearts") {
      result = "♥";
    } else if (type === "diamonds") {
      result = "♦";
    } else if (type === "spades") {
      result = "♠";
    } else if (type === "clubs") {
      result = "♣";
    }
    return result;
  }

  function cardClass(type) {
    return type === "hearts" || type === "diamonds"
      ? "text-red-500"
      : "text-green-500";
  }
</script>

<div class={className + " " + cardClass(card.type)}>
  {printCard(card)}
</div>
