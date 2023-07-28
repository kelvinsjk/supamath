// Fisher-Yates / Durstenfield shuffle
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// answer by Laurens Holst, edited by ashleedawg
export function shuffle<T>(array: Array<T>): void {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}