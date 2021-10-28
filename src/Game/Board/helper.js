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