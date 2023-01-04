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
      this.deck.cards.push(hand.drawCard());
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

  skipActionCard() {
    console.log(`Current Player ${this.currPlayer.name} skips turn`);
    this.findNextPlayer();
    this.currPlayer = this.nextplayer;
  }

  reverseActionCard() {
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
  }

  plusTwoActionCard() {
    console.log(
      `Current Player ${this.currPlayer.name} takes two cards from the deck and loses turn`
    );
    for (let i = 0; i < 2; i++) {
      if (this.deck.cards.length === 0) this.loadDeck();
      this.currPlayer.addCard(this.deck.draw());
    }
    this.findNextPlayer();
    this.currPlayer = this.nextplayer;
  }

  wildCardActionCard(wildCard) {
    const colors = ["red", "blue", "green", "yellow"];
    let choseRandomColorIndex = Math.random() * (3 - 0 + 1); // Math.random() * (upper_bound-lower_bound + 1);
    let choseRandomColor = colors[choseRandomColorIndex];
    for (const color of colors) {
      if (
        this.currPlayer.cardMap.get(color) === null ||
        this.currPlayer.cardMap.get(color) === undefined
      ) {
        this.currPlayer.declareWildCardColor(choseRandomColor);
      } else if (this.currPlayer.cardMap.get(color) > 0) {
        this.currPlayer.declareWildCardColor(color);
        const colorCard = this.currPlayer.cards.find(
          (card) => card.suit === color
        );
        //wildcard should be pushed first
        this.discardPile.push(colorCard);
        break;
      }
    }
    this.discardPile.push(wildCard);
    if (this.currPlayer.wildCardColor === choseRandomColor) {
      const nextPlayerWildCardColor = this.currPlayer.wildCardColor;
      this.currPlayer.wildCardColor = null;
      this.findNextPlayer();
      this.nextplayer.wildCardColor = nextPlayerWildCardColor;
    } else {
      this.findNextPlayer();
    }
    this.currPlayer = this.nextplayer;
  }

  wildCardPlusFourActionCard() {
    this.wildCardActionCard();
  }

  actionCardfunction(card) {
    switch (card.rank) {
      case "skip":
        this.skipActionCard();
        break;
      case "reverse":
        this.reverseActionCard();
        break;
      case "plustwo":
        this.plusTwoActionCard();
        break;
      case "wild": {
        const wildCard = this.discardPile.pop();
        this.wildCardActionCard(wildCard);
        break;
      }
      case "wildplusfour": {
        if (this.discardPile.length === 1) {
          this.deck.cards.push(this.discardPile.pop());
          this.deck.shuffleCards();
          this.playGame();
        } else {
          this.wildCardPlusFourActionCard();
        }
        break;
      }
    }
    this.deck.cards.push(this.discardPile.pop());
    this.deck.shuffleCards();
  }
  loadDeck() {
    for (let i = 0; i < this.discardPile.length - 2; i++) {
      this.deck.cards.push(this.discardPile[i]);
    }
    this.deck.shuffleCards();
  }
  playGame() {
    //debugger;
    // find dealer
    const dealerIndex = this.hands.indexOf(this.dealer);

    // find current player
    this.currPlayer = this.hands[(dealerIndex + 1) % 4];

    // move one card to discard pile
    this.discardPile.push(this.deck.draw());

    // check if current player has cards and didnt call uno
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
        this.actionCardfunction(discardTop);
        if (this.discardPile.length === 0) {
          this.deck.shuffleCards();
          this.discardPile.push(this.deck.draw());
        }
      } else {
        if (this.currPlayer.cards.length === 1) {
          this.currPlayer.calledUno();
          this.discardPile.push(
            this.currPlayer.playCard(this.currPlayer.cards[0])
          );
          this.findNextPlayer();
          this.currPlayer = this.nextplayer;
        } else {
          let matchedCardIndex;
          if (this.currPlayer.wildCardColor !== null) {
            matchedCardIndex = this.currPlayer.cards.findIndex(
              (card) => card.suit === this.currPlayer.wildCardColor
            );
            this.currPlayer.wildCardColor = null;
          } else {
            matchedCardIndex = this.currPlayer.cards.findIndex(
              (card) =>
                card.suit === discardTop.suit || card.rank === discardTop.rank
            );
          }

          if (matchedCardIndex !== -1) {
            const [matchedCard] = this.currPlayer.cards.splice(
              matchedCardIndex,
              1
            );
            if (matchedCardIndex >= 0) {
              this.discardPile.push(matchedCard);
              if (matchedCard.rank === "reverse") {
                console.log(
                  `CurrPlayer: ${this.currPlayer.name} placed reverse card`
                );
                this.actionCardfunction(matchedCard);
              } else this.findNextPlayer();
            }
          } else if (this.currPlayer.cardMap.get("*") > 0) {
            console.log("Wildcard * :", this.currPlayer.cardMap.get("*"));
            const wildCardIndex = this.currPlayer.cards.findIndex(
              (card) => card.suit === "*"
            );
            const [wildCard] = this.currPlayer.cards.splice(wildCardIndex, 1);
            //this.discardPile.push(wildCard);
            this.wildCardActionCard(wildCard);
          } else {
            let drawCards = [];
            if (this.deck.cards.length === 0) {
              this.loadDeck();
            }
            drawCards.push(this.deck.draw());
            while (
              drawCards[drawCards.length - 1].suit !== discardTop.suit &&
              drawCards[drawCards.length - 1].rank !== discardTop.rank
            ) {
              if (this.deck.cards.length === 0) {
                this.loadDeck();
              }
              console.log(
                "DrawCard Suit:",
                drawCards[drawCards.length - 1].suit
              );
              console.log(
                "DrawCard Rank:",
                drawCards[drawCards.length - 1].rank
              );
              drawCards.push(this.deck.draw());
            }
            const matchedCard = drawCards.pop();
            console.log("Matched Card:", matchedCard);
            this.discardPile.push(matchedCard);
            drawCards.forEach((card) => this.currPlayer.cards.push(card));
            if (matchedCard.rank === "reverse") {
              console.log(
                `CurrPlayer: ${this.currPlayer.name} placed reverse card`
              );
              this.actionCardfunction(matchedCard);
            } else this.findNextPlayer();
          }
        }
        this.currPlayer = this.nextplayer;
      }
    }
    console.log(`${this.currPlayer.name} is the winner`);
  }
}
