export function allowedToPlayDefend(cardToBeat, card, trump) {
  // console.log("cardToBeat")
  // console.log(cardToBeat)
  // console.log("card")
  // console.log(card)
  // console.log(trump)
  // console.log((card.value > cardToBeat.value && card.type == cardToBeat.type) ||
  //     (trump == card.type && cardToBeat.type != trump))
  return (
    (card.value > cardToBeat.value && card.type == cardToBeat.type) ||
    (trump == card.type && cardToBeat.type != trump)
  );
}

export function printCard(card) {
  return card.value + printType(card.type);
}

export function printType(type) {
  let result;
  if (type == "hearts") {
    result = "♥";
  } else if (type == "diamonds") {
    result = "♦";
  } else if (type == "spades") {
    result = "♠";
  } else if (type == "clubs") {
    result = "♣";
  }
  return result;
}
