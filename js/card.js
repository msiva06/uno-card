"use strict";
class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }
}
class Skip extends Card {
  constructor(suit) {
    super(suit, "skip");
  }
}
class PlusTwo extends Card {
  constructor(suit) {
    super(suit, "plustwo");
  }
}
class Wild extends Card {
  constructor() {
    super("*", "wild");
  }
}
class WildPlusFour extends Card {
  constructor() {
    super("*", "wildplusfour");
  }
}
class Reverse extends Card {
  constructor(suit) {
    super(suit, "reverse");
  }
}
