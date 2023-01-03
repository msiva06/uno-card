let ranks = [];
let suits = [];
let cards = [];
const d = new Deck(ranks, suits, cards);
d.generateCards();
console.log(d.cards.length);
d.shuffleCards();

let hands = [
  new Hand("player1", []),
  new Hand("player2", []),
  new Hand("player3", []),
  new Hand("player4", []),
];
//debugger;
let game = new Game(d, hands);
game.chooseDealer();
console.log("dealer:", game.dealer.name, game.dealer);
game.resetGame();
d.shuffleCards();
d.deal(hands, 7);
game.playGame();
