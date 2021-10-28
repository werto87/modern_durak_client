export function allowedToPlayDefend(cardToBeat, card, trump) {
    console.log("cardToBeat")
    console.log(cardToBeat)
    console.log("card")
    console.log(card)
    console.log(trump)
    console.log((card.value > cardToBeat.value && card.type == cardToBeat.type) ||
        (trump == card.type && cardToBeat.type != trump))


    // { id: "5hearts", value: 5, type: "hearts" }
    // { id: "6clubs", value: 6, type: "clubs" }


    return (card.value > cardToBeat.value && card.type == cardToBeat.type) ||
        (trump == card.type && cardToBeat.type != trump);
}