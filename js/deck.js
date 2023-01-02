"use strict";
class Deck {
  constructor(cardSuits, cardRanks, cards) {
    this.cardSuits = cardSuits;
    this.cardRanks = cardRanks;
    this.cards = cards;
  }
  generateCards() {
    let redCardSuite = "red";
    let yellowCardSuite = "yellow";
    let blueCardSuite = "blue";
    let greenCardSuite = "green";
    this.cardSuits = [
      redCardSuite,
      yellowCardSuite,
      blueCardSuite,
      greenCardSuite,
    ];
    for (let i = 0; i < 10; i++) {
      this.cardRanks.push(i);
    }
    let i = 0;
    for (const suit of this.cardSuits) {
      i = 0;
      while (i < 2) {
        for (const rank of this.cardRanks) {
          if (rank === 0 && i === 1) continue;
          let card = new Card(suit, rank);
          this.cards.push(card);
        }
        this.cards.push(new Skip(suit));
        this.cards.push(new PlusTwo(suit));
        this.cards.push(new Reverse(suit));
        i++;
      }
    }
    // for (let i = 0; i < 4; i++) {
    //   this.cards.push(new Wild());
    //   this.cards.push(new WildPlusFour());
    // }
    return this.cards;
  }

  draw() {
    return this.cards.pop();
  }

  shuffleCards() {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal(numHands, cardsPerHand) {
    for (let i = 0; i < numHands.length; i++) {
      for (let j = 1; j <= cardsPerHand; j++) {
        const card = this.draw();
        numHands[i].addCard(card);
      }
    }
  }
}
