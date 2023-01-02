"use strict";
class Hand {
  constructor(name, cards) {
    this.name = name;
    this.cards = cards;
    this.wildCardColor = null;
    this.isUno = false;
    this.cardMap = new Map();
    //this.dealer = false;
    //this.currPlayer = false;
  }

  // isDealer(dealer = false) {
  //   this.dealer = dealer;
  // }

  // isCurrPlayer(player = false) {
  //   this.currPlayer = player;
  // }
  setCardMap() {
    for (const card of this.cards) {
      if (card.suite === "*") {
        if (
          this.cardMap.get("*") === null ||
          this.cardMap.get("*") === undefined
        )
          this.cardMap.set("*", 1);
        else this.cardMap.set("*", this.cardMap.get("*") + 1);
      } else {
        if (
          this.cardMap.get(card.suit) === null ||
          this.cardMap.get(card.suit) === undefined
        )
          this.cardMap.set(card.suit, 1);
        else this.cardMap.set(card.suit, this.cardMap.get(card.suit) + 1);
      }
    }
  }
  addCard(card) {
    this.cards.push(card);
  }

  declareWildCardColor(color) {
    this.wildCardColor = color;
  }

  calledUno() {
    this.isUno = true;
  }

  showCard() {
    return this.cards;
  }

  playCard(card) {
    //debugger;
    let index = this.cards.indexOf(card);
    const deletedCard = this.cards.splice(index, 1);
    return deletedCard[0]; // need to change this
  }

  drawCard() {
    //return this.cards.splice(0, 1);
    return this.cards.pop();
  }
}
