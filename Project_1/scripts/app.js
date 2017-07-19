$(()=>{
console.log('hooked up');

  let playerBankRoll = 500;
  let thePot = 0;

  class Card {
    constructor(suit, value) {
      this.suit = suit;
      this.value = value;
    }
  };

  class FaceCard extends Card {
    constructor(suit, value, face) {
      super(suit, value);
      this.face = face;
    }
  }

  const cards = {
    deck: [],
    dealerCards: [],
    playerCards: []
  };


  //set cards in a deck
  const createCards = () => {
    const suit = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];

    for ( let i = 0; i < suit.length; i++ ) {
      //create Ace - 10
      for (let j = 2; j <= 10; j++ ) {
        cards.deck.push(new Card(suit[i], j));
      }
      //update Ace face
      cards.deck.push(new FaceCard(suit[i], 11, 'Ace'));
      cards.deck.push(new FaceCard(suit[i], 10, 'Jack'));
      cards.deck.push(new FaceCard(suit[i], 10, 'Queen'));
      cards.deck.push(new FaceCard(suit[i], 10, 'King'));
    }
  };

  const dealCard = () => {
    if (cards.deck.length > 0) {
      const randomIndex = Math.floor((Math.random() * 53) + 1);
      // console.log('randomIndex', cards.deck[randomIndex]);
      return(cards.deck.splice(randomIndex, 1));
    } else {
      return(null);
    }
  };

  const placeyourBet = (bet) => {
    console.log('cards.deck.length', cards.deck.length);

    //test for dealCard return of null... nomore cards and EOG
    //if cards.deck.length < 4 --> EOG.
    //
    //face up
    cards.playerCards.push(dealCard());
    //face down
    cards.dealerCards.push(dealCard());
    //face up
    cards.playerCards.push(dealCard());
    //face up
    cards.dealerCards.push(dealCard());
    console.log('cards.deck.length', cards.deck.length);
    //take the anti
    playerBankRoll-=bet;
    //no 2:3 nor 5:7 yet....
    thePot+=bet;
  };

  const scoreTotal = (hand) => {
      let totalScore = 0;
      // console.log('hand.length', hand.length);
      for ( let i = 0; i < hand.length; i++ ) {
        // cards.playerCards[0][0].value
        // console.log('hand[' + i + '][0].value', hand[i][0].value);
        totalScore+=hand[i][0].value;
      }
      return(totalScore);
  };

  createCards();
  //button ante up (2 cards each) get bet from input
  //if bankroll <= 0 EOG
  placeyourBet(10);

  //Player draws till > 17  if dealer up card is < 6 or stay
  // let hitme = false;
  let playerScore = scoreTotal(cards.playerCards);
  //player hit or stay......
  //algorithm for hit or stay


  let dealerScore = scoreTotal(cards.dealerCards);
  //dealer draws until >= 17
  while ( dealerScore < 17 ) {
        console.log('dealer draws another card');
        cards.dealerCards.push(dealCard());
        dealerScore = scoreTotal(cards.dealerCards);
  };
  console.log('dealerScore', dealerScore);
  //if dealerh up card is < 6 player takes hit
  //JQuery to get dealer up card.....


  // //check cards
  // for (let i = 0; i < cards.deck.length; i++) {
  //   console.log(cards.deck[i]);
  // }
  console.log('cards.deck.length', cards.deck.length)
  // console.log('cards.playerCards', cards.playerCards.length);
  // console.log('FaceCard', cards.playerCards[0][0] instanceof FaceCard );
  // console.log('FaceCard', cards.playerCards[1][0] instanceof FaceCard );
  // console.log(cards.playerCards[0][0].value);
  // console.log(cards.playerCards[1][0].value);
  // console.log(cards.playerCards[0][0].face);
  // console.log(cards.playerCards[1][0].face);
  // console.log('cards.dealerCards', cards.dealerCards.length);
  // console.log(cards.dealerCards[0][0].value);
  // console.log(cards.dealerCards[1][0].value);
  //
  console.log('playerScore', playerScore);
  console.log('dealerScore', dealerScore);

});
