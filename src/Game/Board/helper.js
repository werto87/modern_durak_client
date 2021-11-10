export function allowedToPlayDefend(cardToBeat, card, trump) {
    // console.log("cardToBeat")
    // console.log(cardToBeat)
    // console.log("card")
    // console.log(card)
    // console.log(trump)
    // console.log((card.value > cardToBeat.value && card.type == cardToBeat.type) ||
    //     (trump == card.type && cardToBeat.type != trump))
    return (card.value > cardToBeat.value && card.type == cardToBeat.type) ||
        (trump == card.type && cardToBeat.type != trump);
}

export function printCard(card) {
    let result = card.value;
    if (card.type == "hearts") {
        result += "♥";
    } else if (card.type == "diamonds") {
        result += "♦";
    } else if (card.type == "spades") {
        result += "♠";
    } else if (card.type == "clubs") {
        result += "♣";
    }

    return result;
};