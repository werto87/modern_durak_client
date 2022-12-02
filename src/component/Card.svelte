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
      return "text-redCardValue";
    }else if(type === "spades" || type === "clubs")
    {
      return "text-greenCardValue";
    }else{
      return "";
    }
  }
</script>

<div class={className + " " + cardClass(card.type)}>
  {printCard(card)}
</div>
