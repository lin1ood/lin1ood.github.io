$(()=>{
// console.log('hooked up');

  let playerBankRoll = 500;
  let thePot = 0;
  let bet = '';
  let roundPlayed = 0;

  class Card {
    constructor(suit, value, img) {
      this.suit = suit;
      this.value = value;
      this.img = 'img/' + img;
    }
  };

  class FaceCard extends Card {
    constructor(suit, value, img, face) {
      super(suit, value, img);
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
        cards.deck.push(new Card(suit[i], j, suit[i]+j+".bmp"));
      }
      //update Ace face
      cards.deck.push(new FaceCard(suit[i], 11, suit[i]+"1.bmp", 'Ace'));
      cards.deck.push(new FaceCard(suit[i], 10, suit[i]+"11.bmp", 'Jack'));
      cards.deck.push(new FaceCard(suit[i], 10, suit[i]+"12.bmp", 'Queen'));
      cards.deck.push(new FaceCard(suit[i], 10, suit[i]+"13.bmp", 'King'));
    }
  };

  const dealCard = () => {
    if (cards.deck.length > 0) {
      const randomIndex = Math.floor((Math.random() * (cards.deck.length)));
      // console.log('randomIndex', cards.deck[randomIndex]);
      return(cards.deck.splice(randomIndex, 1));
    } else {
      //don't think I will ever get here cause splice updates the cards array length preventing the random index from landing outside the array...
      //but this did server its purpose in early development/verificaiton
      return(null);
    }
  };

  const getCardImg = (playingCard) => {
    const $cardImage = $('<img/>');
    console.log('playingCard[0].img', playingCard[0].img);
    $cardImage.attr({
        src: playingCard[0].img,
        height: "125px",
        width: "75px"
    });
    return($cardImage);
  };

  const openingDeal = () => {
    // console.log('cards.deck.length', cards.deck.length);

    //test for dealCard return of null... nomore cards and EOG
    //if cards.deck.length < 4 --> EOG.
    //
    //face up
    let cardInPlay = dealCard();
    console.log('cardInPlay', cardInPlay);
    $('#player').append(getCardImg(cardInPlay));
    cards.playerCards.push(cardInPlay);
    //face down
    cards.dealerCards.push(dealCard());
    //face up
    cards.playerCards.push(dealCard());
    //face up
    cards.dealerCards.push(dealCard());
    // console.log('cards.deck.length', cards.deck.length);
    //take the anti
    playerBankRoll-=bet;
    //no 2:3 nor 5:7 yet....
    thePot+=bet;
  };

  const scoreTotal = (hand) => {
      let totalScore = 0;
      // console.log('hand.length', hand.length);
      for ( let i = 0; i < hand.length; i++ ) {
        // hand.playerCards[0][0].value
        // console.log('hand[' + i + '][0].value', hand[i][0].value);
        totalScore+=hand[i][0].value;
      }
      return(totalScore);
  };

  const getValidBet = () => {
    console.log('betClicked');
    //clean up the input box form last time
    $('input').css({
      'background-color' : 'white',
      'font-weight' : 'none'
    });
    //get the input -- bet
    bet = $('input').val();
    //update input with message on Invalid Input
    if (!parseInt(bet) || bet > playerBankRoll) {
      console.log('!parseInt(bet) || bet > playerBankRoll');
      $('input').val("Invalid! Try Again").css({
        'background-color' : 'red',
        'font-weight' : 'bold'
      });
      return(false);
    }
    //input is a non-blocking call so just leave!!!
    //and wait for the next button to check again.....
    return(true);
  };

  //build the Deck of Cards (just 1 Deck for now)
  console.log('createCards');
  createCards();
  //button ante up (2 cards each) get bet from input
  //if bankroll <= 0 EOG
  // console.log($('#bet').on('click', betClicked));
  // console.log('waiting for betClicked');
  console.log('setup event listener on start/bet button');
  $('#bet').on('click', () => {
    //bet submitted (input) on click
    console.log('bet =', bet);

    //get Valid Bet the input
    if (!getValidBet()) {
      console.log('return to try again later');
      //invalid input so wait for another input
      //and button click with a valid value - maybe
      //can't start the game so......
      return;
    } else {
      //valid bet so what is player bankroll
      console.log('playerBankRoll', playerBankRoll);

      //input good play the game.........
      //todo: Turn off #bet button and go play  -- play here for now
      //todo: Turn it on again at the end of the round.....
      openingDeal();
      //player hit or stay......
      //algorithm for hit or stay
      // //Player draws till > 17  if dealer up card is < 6 or stay
      // // let hitme = false;
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
      //if dealerh up card is < 6 player takes hit
      //JQuery to get dealer up card.....
      console.log('playerScore', playerScore);
      console.log('dealerScore', dealerScore);
      console.log('clean up');
      $('input').val("");
      bet = '';
    };
  });

  console.log('outa the button click');
    // while (!(bet) || bet > playerBankRoll) {
    //   // alert("The bet is not a valid value. Try again.")
    //   bet = betClicked();
    // }

    // // console.log('bet clicked');
    // // alert("The bet is not a valid value. Try again.")
    // //placeyourBet(bet)-- figure out how to loop on input
    // // console.log('playerBankRoll', playerBankRoll);
    // do {
    //   bet = $('input').val();
    //   console.log('bet', bet);
    //   if ( !parseInt(bet) || bet > playerBankRoll) {
    //     // alert("The bet is not a valid value. Enter a valid value here...");
    //     // $('input').val("Invalid Value").css({
    //       // 'background-color' : 'red',
    //       // 'font-weight' : 'bold'
    //     // });
    //     bet = '';
    //     console.log('returning false');
    //     return (false);
    //   };
    // } while ( !parseInt(bet) || bet > playerBankRoll );
    // return(true);
    // // $('input').val('$' + bet + '.00').css({'background-color' : 'none'});
    // //
    // // bet = $('input').val();
    // // if
    // // $(e.currentTarget).parent().css('display', 'none');
    // // console.log('Hello ', name);
    // placeyourBet(bet);
    // // // roundPlayed++;
    // // //Player draws till > 17  if dealer up card is < 6 or stay
    // // // let hitme = false;
    // let playerScore = scoreTotal(cards.playerCards);
    // //player hit or stay......
    // //algorithm for hit or stay
    //
    //
    // let dealerScore = scoreTotal(cards.dealerCards);
    // //dealer draws until >= 17
    // while ( dealerScore < 17 ) {
    //       console.log('dealer draws another card');
    //       cards.dealerCards.push(dealCard());
    //       dealerScore = scoreTotal(cards.dealerCards);
    // };
    // //if dealerh up card is < 6 player takes hit
    // //JQuery to get dealer up card.....
    //
    //
    // // //check cards
    // for (let i = 0; i < cards.deck.length; i++) {
    //   console.log(cards.deck[i]);
    // }
    // // console.log('cards.deck.length', cards.deck.length)
    // // console.log('cards.playerCards', cards.playerCards.length);
    // // console.log('FaceCard', cards.playerCards[0][0] instanceof FaceCard );
    // // console.log('FaceCard', cards.playerCards[1][0] instanceof FaceCard );
    // // console.log(cards.playerCards[0][0].value);
    // // console.log(cards.playerCards[1][0].value);
    // // console.log(cards.playerCards[0][0].face);
    // // console.log(cards.playerCards[1][0].face);
    // // console.log('cards.dealerCards', cards.dealerCards.length);
    // // console.log(cards.dealerCards[0][0].value);
    // // console.log(cards.dealerCards[1][0].value);
    // //

});
