export const debugDeck36 = [
  { Card: { value: 7, type: "clubs" } },
  { Card: { value: 8, type: "clubs" } },
  { Card: { value: 3, type: "hearts" } },
  { Card: { value: 3, type: "clubs" } },
  { Card: { value: 2, type: "diamonds" } },
  { Card: { value: 3, type: "diamonds" } },
  { Card: { value: 2, type: "clubs" } },
  { Card: { value: 5, type: "diamonds" } },
  { Card: { value: 6, type: "diamonds" } },
  { Card: { value: 7, type: "diamonds" } },
  { Card: { value: 8, type: "diamonds" } },
  { Card: { value: 9, type: "diamonds" } },
  { Card: { value: 1, type: "spades" } },
  { Card: { value: 2, type: "spades" } },
  { Card: { value: 3, type: "spades" } },
  { Card: { value: 1, type: "diamonds" } },
  { Card: { value: 5, type: "spades" } },
  { Card: { value: 6, type: "spades" } },
  { Card: { value: 7, type: "spades" } },
  { Card: { value: 8, type: "spades" } },
  { Card: { value: 9, type: "spades" } },
  { Card: { value: 1, type: "hearts" } },
  { Card: { value: 2, type: "hearts" } },
  { Card: { value: 9, type: "clubs" } },
  { Card: { value: 1, type: "clubs" } },
  { Card: { value: 5, type: "hearts" } },
  { Card: { value: 6, type: "clubs" } },
  { Card: { value: 7, type: "hearts" } },
  { Card: { value: 8, type: "hearts" } },
  { Card: { value: 9, type: "hearts" } },
  { Card: { value: 4, type: "hearts" } },
  { Card: { value: 4, type: "diamonds" } },
  { Card: { value: 4, type: "spades" } },
  { Card: { value: 4, type: "clubs" } },
  { Card: { value: 5, type: "clubs" } },
  { Card: { value: 6, type: "hearts" } },
];

export function shuffleArray(array) {
  let myArray = array.slice();
  for (let i = myArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [myArray[i], myArray[j]] = [myArray[j], myArray[i]];
  }
  return myArray;
}
