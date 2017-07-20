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
      // console.log('cards.deck[randomIndex]', cards.deck[randomIndex]);
      return(cards.deck.splice(randomIndex, 1));
    } else {
      //don't think I will ever get here cause splice updates the cards array length preventing the random index from landing outside the array...
      //but this did server its purpose in early development/verificaiton
      return(null);
    }
  };

  const getCardImg = (playingCard, faceUp) => {
    console.log('playingCard[0].img', playingCard[0].img);
    let cardPic = playingCard[0].img;
    if (!faceUp) {
      cardPic = 'img/back.bmp'
    };

    //create a card image to append to the player/dealer div.
    const $cardImage = $('<img/>');

    $cardImage.attr({
        src: cardPic,
        height: "125px",
        width: "75px"
    });
    return($cardImage);
  };

  const openingDeal = () => {
    // console.log('cards.deck.length', cards.deck.length);
    const faceUp = true;
    //test for dealCard return of null... nomore cards and EOG
    //if cards.deck.length < 4 --> EOG.
    //
    //face up
    let cardInPlay = dealCard();
    // console.log('cardInPlay', cardInPlay);
    $('#player').append(getCardImg(cardInPlay, faceUp));
    cards.playerCards.push(cardInPlay);
    //not face up (down) -- The Hole Card
    cardInPlay = dealCard();
    $('#dealer').append(getCardImg(cardInPlay, faceUp));
    cards.dealerCards.push(cardInPlay);
    //face up
    cardInPlay = dealCard();
    $('#player').append(getCardImg(cardInPlay, faceUp));
    cards.playerCards.push(cardInPlay);
    //face up
    cardInPlay = dealCard();
    $('#dealer').append(getCardImg(cardInPlay, !faceUp));
    cards.dealerCards.push(cardInPlay);
    console.log('The Hole Card:', cardInPlay)
  };

  const hitMe = ($element) => {
    const faceUp = true;
    let cardInPlay = dealCard();
    // console.log('cardInPlay', cardInPlay);
    $element.append(getCardImg(cardInPlay, faceUp));
    cards.playerCards.push(cardInPlay);
  };

  const scoreTotal = (hand) => {
      let totalScore = 0;
      // console.log('hand.length', hand.length);
      for ( let i = 0; i < hand.length; i++ ) {
        console.log('hand['+ i + '] [0].value', hand[i][0].value);
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
    if (!parseInt(bet) || playerBankRoll < 0) {
      // console.log('!parseInt(bet) || bet > playerBankRoll');
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
  // console.log('createCards');
  createCards();
  // console.log('setup event listener on start/bet button');
  $('#bet').on('click', () => {
    //bet submitted (input) on click
    // console.log('bet =', bet);

    //get Valid Bet the input
    //if bankroll < 0 EOG
    //player can bet their last $
    if (!getValidBet() && playerBankRoll >= 0) {
      console.log('return to try again later');
      //invalid input so wait for another input
      //and button click with a valid value - maybe
      //can't start the game so......

      //todo: alert -- if playerBankRoll <= 0
      //go get more $$  OR just Game Over!!!!
      return;
    } else {
      // //play a round
      // roundPlayed++;
      // //deduct player bet from playerBankRoll
      // playerBankRoll-=bet;
      //
      //todo: this may not be the best place yet.....
      //no 2:3 nor 5:7 yet....
      thePot+=bet;

      // console.log('playerBankRoll', playerBankRoll);

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
      //algorithm for hit or stay - for now.....
      //if dealer up card is < 6 player takes hit
    if ( cards.dealerCards[1].value < 6 ) {
        while (scoreTotal(cards.playerCards) <= 17 && cards.deck.length > 0) {
          hitMe($('#player'));
        }
      }

      //JQuery to flip the hole card up.....
      const faceUp = true;
      // let holeCardImg = getCardImg(cards.dealerCards[1], faceUp);
      console.log('Turn over the hole card', cards.dealerCards[1][0].img);
      console.log("$('#dealer').eq(1)", $('#dealer').children().eq(1));
      $('#dealer').children().eq(1).attr({
          src: cards.dealerCards[1][0].img
      });


      let dealerScore = scoreTotal(cards.dealerCards);
      //dealer draws until >= 17
      // while ( scoreTotal(cards.dealerCards) < 17 && cards.deck.length > 0) {
      //   console.log('dealer draws another card');
      //   hitMe($('#dealer'));
      // };


      console.log('playerScore', playerScore);
      console.log('dealerScore', dealerScore);
      console.log('clean up');

      if (playerScore <= 21 && playerScore > dealerScore) {
        playerBankRoll += thePot;
        console.log('Player -> bet', bet);
        console.log('Player Win -> thePot', thePot);
        console.log('Player Win -> playerBankRoll', playerBankRoll);
        thePot = 0;
        bet = '';
        roundPlayed++;
        cards.dealerCards = [];
        cards.playerCards = [];
        // $('#player').children().remove();
        // $('#dealer').children().remove();
        console.log('Player Wins!!', playerScore);
        console.log('Dealer loose', dealerScore);

      } else if (dealerScore <= 21 && dealerScore > playerScore) {
        playerBankRoll -= thePot;
        console.log('Dealer -> bet', bet);
        console.log('Dealer Win -> thePot', thePot);
        console.log('Dealer Win -> playerBankRoll', playerBankRoll);
        thePot = 0;
        bet = '';
        roundPlayed++;
        cards.dealerCards = [];
        cards.playerCards = [];
        // $('#player').children().remove();
        // $('#dealer').children().remove();
        console.log('Dealer Wins!!', dealerScore);
        console.log('Player loose', playerScore);
      } else if (playerScore === dealerScore) {
        //it is a push
        playerBankRoll += bet;
        console.log('Push -> bet', bet);
        console.log('Push Win -> thePot', thePot);
        console.log('Push playerBankRoll', playerBankRoll);
        thePot = 0;
        bet = '';
        roundPlayed++;
        cards.dealerCards = [];
        cards.playerCards = [];
        // $('#player').children().remove();
        // $('#dealer').children().remove();
        console.log('Push!!');
        console.log('playerScore', playerScore);
        console.log('dealerScore', dealerScore);
      };
      //check the cleanup.....
      console.log('playerBankRoll', playerBankRoll);
      console.log('roundPlayed', roundPlayed);
      console.log('cards.deck.length', cards.deck.length);
      console.log('cards.playerCards.length', cards.playerCards.length);
      console.log('cards.dealerCards.length', cards.dealerCards.length);
      console.log('thePot', thePot);
      console.log('bet' , bet);
      // $('input').val("");
      // bet = '';
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
