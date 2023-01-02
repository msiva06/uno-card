"use strict";
class Game {
  constructor(deck, hands) {
    this.deck = deck;
    this.hands = hands;
    this.discardPile = [];
    this.dealer = null;
    this.currPlayer = null;
    this.nextplayer = null;
    this.reverse = false;
  }

  chooseDealer() {
    this.deck.deal(this.hands, 1);
    let max = -Infinity;
    let maxHand;
    for (const hand of this.hands) {
      const cardRank = hand.cards[0].rank;
      if (typeof cardRank === "number") {
        if (cardRank > max) {
          max = cardRank;
          maxHand = hand;
        }
      }
    }
    this.dealer = maxHand;
  }
  resetGame() {
    for (const hand of this.hands) {
      hand.drawCard();
    }
  }
  findNextPlayer() {
    const currPlayerIndex = this.hands.findIndex(
      (player) => player.name === this.currPlayer.name
    );
    if (!this.reverse) {
      this.nextplayer = this.hands[(currPlayerIndex + 1) % 4];
    } else {
      if (currPlayerIndex - 1 < 0)
        this.nextplayer = this.hands[this.hands.length - 1];
      else this.nextplayer = this.hands[(currPlayerIndex - 1) % 4];
    }
  }
  actionCardfunction(card) {
    //debugger;
    // const currPlayerIndex = this.hands.indexOf(this.currPlayer);
    // this.nextplayer = this.hands[currPlayerIndex + 1];
    // console.log(this.nextplayer.name, this.nextplayer.cards);
    if (this.discardPile.length === 1) {
      if (card.rank === "skip") {
        console.log(`Current Player ${this.currPlayer.name} skips turn`);
        this.findNextPlayer();
        this.currPlayer = this.nextplayer;
      } else if (card.rank === "reverse") {
        if (this.reverse) {
          this.reverse = false;
          console.log("Play continues in clockwise direction");
        } else {
          this.reverse = true;
          this.currPlayer = this.dealer;
          console.log("Play continues in anti-clockwise direction");
        }
      } else if (card.rank === "plustwo") {
        console.log(
          `Current Player ${this.currPlayer.name} takes two cards from the deck and loses turn`
        );
        for (let i = 0; i < 2; i++) {
          this.currPlayer.addCard(this.deck.draw());
        }
        this.findNextPlayer();
        this.currPlayer = this.nextplayer;
      } else if (card.rank === "wild") {
        const colors = ["red", "blue", "green", "yellow"];
        let choseColor;
        colors.forEach((color) => {
          if (this.currPlayer.cardMap.get(color) > 0) {
            choseColor = color;
          }
        });
        this.currPlayer.declareWildCardColor(choseColor);
        const colorCard = this.currPlayer.cards.find(
          (card) => card.suit === choseColor
        );
        // this.currPlayer.cardMap.set(
        //   choseColor,
        //   this.currPlayer.cardMap.get(choseColor) - 1
        // );
        this.discardPile.push(colorCard);
        this.nextplayer();
        this.currPlayer = this.nextplayer;
        // for (const card of this.currPlayer.cards) {
        //   if (card.suit === color) {
        //     this.discardPile.push(this.currPlayer.playCard(card));
        //   }
        // }
      } else if (card.rank === "wildplusfour") {
        this.deck.cards.push(this.discardPile.pop());
        this.deck.shuffleCards();
        this.playGame();
      }
    } else {
      if (card.rank === "skip") {
        console.log(`${this.currPlayer.name} loses turn`);
        this.findNextPlayer();
        this.currPlayer = this.nextplayer;
      } else if (card.rank === "reverse") {
        if (this.reverse) {
          this.reverse = false;
          this.findNextPlayer();
          this.currPlayer = this.nextplayer;
          console.log("Play continues in clockwise direction");
        } else {
          this.reverse = true;
          console.log("Play continues in anti-clockwise direction");
          this.findNextPlayer();
          this.currPlayer = this.nextplayer;
        }
      } else if (card.rank === "plustwo") {
        console.log(
          `Current Player ${this.currPlayer.name} takes two cards from the deck and loses turn`
        );
        for (let i = 0; i < 2; i++) {
          this.currPlayer.addCard(this.deck.draw());
        }
        this.findNextPlayer();
        this.currPlayer = this.nextplayer;
      }
      // else if (card.rank === "wild") {
      //   const color = prompt("Enter color value to declare:");
      //   this.currPlayer.declareWildCardColor(color);
      // } else if (card.rank === "wildplusfour") {
      //   this.deck.cards.push(this.discardPile.pop());
      //   this.deck.shuffleCards();
      // }
    }
  }
  playGame() {
    //debugger;
    const dealerIndex = this.hands.indexOf(this.dealer);
    this.currPlayer = this.hands[(dealerIndex + 1) % 4];
    this.discardPile.push(this.deck.draw());

    while (this.currPlayer.cards.length > 0 && !this.currPlayer.isUNO) {
      let discardTop = this.discardPile[this.discardPile.length - 1];
      console.log("Discard Card:", discardTop);
      console.log(
        "CurrPlayer:",
        this.currPlayer.name,
        "CurrPlayerCards:",
        this.currPlayer.cards
      );
      this.currPlayer.setCardMap();
      if (typeof discardTop.rank !== "number") {
        // if (this.currPlayer.cards.length === 1) {
        //   //this might not be needed
        //   this.currPlayer.calledUno();
        //   this.discardPile.push(
        //     this.currPlayer.playCard(this.currPlayer.cards[0])
        //   );
        //   this.findNextPlayer();
        // } else {
        this.actionCardfunction(discardTop);
        this.discardPile.pop();
        if (this.discardPile.length === 0) {
          this.deck.shuffleCards();
          this.discardPile.push(this.deck.draw());
        }
      } else {
        // const currPlayerIndex = this.hands.indexOf(this.currPlayer);
        // if (!this.reverse)
        //   this.nextplayer = this.hands[(currPlayerIndex + 1) % 4];
        if (this.currPlayer.cards.length === 1) {
          this.currPlayer.calledUno();
          this.discardPile.push(
            this.currPlayer.playCard(this.currPlayer.cards[0])
          );
          this.findNextPlayer();
          this.currPlayer = this.nextplayer;
        }
        //condition to check map if '*' suit === null
        else {
          if (
            this.currPlayer.cardMap.get("*") === null ||
            this.currPlayer.cardMap.get("*") === undefined
          ) {
            const matchedCardIndex = this.currPlayer.cards.findIndex(
              (card) =>
                card.suit === discardTop.suit || card.rank === discardTop.rank
            );
            const [matchedCard] = this.currPlayer.cards.splice(
              matchedCardIndex,
              1
            );
            if (matchedCardIndex >= 0) {
              this.discardPile.push(matchedCard);
              //this.currPlayer.cardMap.set(matchedCard.suit, this.currPlayer.cardMap.get(matchedCard.suit) - 1);
              if (matchedCard.rank === "reverse") {
                console.log(
                  `CurrPlayer: ${this.currPlayer.name} placed reverse card`
                );
                this.actionCardfunction(matchedCard);
                this.discardPile.pop();
              } else this.findNextPlayer();
            } else {
              let drawCards = [];
              drawCards.push(this.deck.draw());
              while (
                drawCards[drawCards.length - 1].suit !== discardTop.suit ||
                drawCards[drawCards.length - 1].color !== discardTop.color
              ) {
                drawCards.push(this.deck.draw());
              }
              this.discardPile.push(drawCards.pop());
              for (const card of drawCards) {
                this.currPlayer.cards.push(card);
              }
              this.findNextPlayer();
            }
          } else {
            if (
              this.currPlayer.cardMap.get(discardTop.suit) >
              this.currPlayer.cardMap.get("*")
            ) {
              const matchedCardIndex = this.currPlayer.cards.findIndex(
                (card) =>
                  card.suit === discardTop.suit || card.rank === discardTop.rank
              );
              const [matchedCard] = this.currPlayer.cards.splice(
                matchedCardIndex,
                1
              );
              if (matchedCardIndex >= 0) {
                this.discardPile.push(matchedCard);
                //this.currPlayer.cardMap.set(matchedCard.suit, this.currPlayer.cardMap.get(matchedCard.suit) - 1);
                this.findNextPlayer();
              } //  else {
              //   let drawCards = [];
              //   drawCards.push(this.deck.drawCard());
              //   while (
              //     drawCards[drawCards.length - 1].suit !== discardTop.suit ||
              //     drawCards[drawCards.length - 1].color !== discardTop.color
              //   ) {
              //     drawCards.push(this.deck.draw());
              //   }
              //   this.discardPile.push(drawCards.pop());
              //   this.currPlayer.cards.concat(drawCards);
              //   this.findNextPlayer();
              // }
            } else if (
              this.currPlayer.cardMap.get(discardTop.suit) ===
              this.currPlayer.cardMap.get("*")
            ) {
              const wildCardIndex = this.currPlayer.cards.findIndex(
                (card) => card.suit === "*"
              );
              const [wildCard] = this.currPlayer.cards.splice(wildCardIndex, 1);
              const rank = wildCard.rank;
              this.discardPile.push(wildCard);
              const colors = ["red", "blue", "green", "yellow"];
              let choseColor;
              colors.forEach((color) => {
                if (this.currPlayer.cardMap.get(color) > 0) {
                  choseColor = color;
                }
              });
              this.currPlayer.declareWildCardColor(choseColor);
              const colorCardIndex = this.currPlayer.cards.findIndex(
                (card) => card.suit === choseColor
              );
              // this.currPlayer.cardMap.set(
              //   choseColor,
              //   this.currPlayer.cardMap.get(choseColor) - 1
              // );
              const [colorCard] = this.currPlayer.cards.splice(
                colorCardIndex,
                1
              );
              this.discardPile.push(colorCard);
              this.findNextPlayer();
              if (rank === "wildplusfour") {
                for (let i = 0; i < 3; i++) {
                  this.nextplayer.addCard(this.deck.draw());
                }
              }
            } else if (
              discardTop === this.discardPile[this.discardPile.length - 1]
            ) {
              let drawCards = [];
              drawCards.push(this.deck.drawCard());
              while (
                drawCards[drawCards.length - 1].suit !== discardTop.suit ||
                drawCards[drawCards.length - 1].color !== discardTop.color
              ) {
                drawCards.push(this.deck.draw());
              }
              this.discardPile.push(drawCards.pop());
              this.currPlayer.cards.concat(drawCards);
              this.findNextPlayer();
            }
          }
        }
        this.currPlayer = this.nextplayer;
      }
    }
    console.log(`${this.currPlayer.name} is the winner`);
  }
}

////////////////////////////////////////////////////////////
//   for (const card of this.currPlayer.cards) {
//     if (
//       (card.suit === discardTop.suit ||
//         card.rank === discardTop.rank) &&
//       (this.currPlayer.cardMap.get("*") !== null ||
//         this.currPlayer.cardMap.get("*") !== undefined) &&
//       this.currPlayer.cardMap.get(discardTop.suit) >
//         this.currPlayer.cardMap.get("*")
//     ) {
//       this.discardPile.push(this.currPlayer.playCard(card));
//       this.currPlayer.cardMap.set(
//         card.suit,
//         this.currPlayer.cardMap.get(card.suit) - 1
//       );
//       this.currPlayer = this.nextplayer;
//       break;
//     }
//   }
// }
// if (
//   (discardTop === this.discardPile[this.discardPile.length - 1] &&
//     this.currPlayer.cardMap.get("*") >= 1) ||
//   this.currPlayer.cardMap.get(discardTop.suit) ===
//     this.currPlayer.cardMap.get("*")
// ) {
//   let color = "";
//   let colorCard;
//   for (const [key, val] of this.currPlayer.cardMap.entries()) {
//     if (
//       key !== "*" &&
//       key !== discardTop.suit &&
//       this.currPlayer.cardMap.get(key) >= 1
//     ) {
//       color = key;
//       break;
//     }
//   }
//   for (const card of this.currPlayer.cards) {
//     if (card.suit === color) {
//       colorCard = card;
//       break;
//     }
//   }
//   console.log(colorCard);
//   for (const card of this.currPlayer.cards) {
//     if (card.suit === "*") {
//       this.discardPile.push(this.currPlayer.playCard(card));
//       this.discardPile.push(this.currPlayer.playCard(colorCard));
//       this.currPlayer.cardMap.set(
//         card.suit,
//         this.currPlayer.cardMap.get(card.suit) - 1
//       );
//       this.currPlayer.cardMap.set(
//         colorCard.suit,
//         this.currPlayer.cardMap.get(colorCard.suit) - 1
//       );
//       this.currPlayer = this.nextplayer;
//       break;
//     }
//   }
// } else if (
//   discardTop === this.discardPile[this.discardPile.length - 1]
// ) {
//   this.currPlayer.addCard(this.deck.draw());
//   this.playGame();
// }

//////////////////////////////////////////////////////////
// } else {
//   this.currPlayer.addCard(this.deck.draw());
//   break;
//}

// if (
//   currplayerSuite === discardTop.suite ||
//   currplayerRank === discardTop.rank
// ) {
//   this.discardPile.push(
//     Math.random() - 0.5
//       ? currPlayer.playCard(playerSuite)
//       : currPlayer.playCard(playerRank)
//   );
// }
