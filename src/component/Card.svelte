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
  } else if (type === "?") {
    result = "?";
  }
    return result;
  }

  function cardClass(type) {
    if (type === "hearts" || type === "diamonds"){
      return "text-red-500";
    }else if(type === "spades" || type === "clubs")
    {
      return "text-green-500";
    }else{
      return "";
    }
  }
</script>

<div class={className + " " + cardClass(card.type)}>
  {printCard(card)}
</div>
