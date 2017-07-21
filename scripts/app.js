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
    // console.log('playingCard[0].img', playingCard[0].img);
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
    // console.log('The Hole Card:', cardInPlay)
  };

  const hitMe = ($element) => {
    const faceUp = true;
    let cardInPlay = dealCard();
    $element.append(getCardImg(cardInPlay, faceUp));
    if ($element.attr('id') === 'player') {
      cards.playerCards.push(cardInPlay);
    } else {
      cards.dealerCards.push(cardInPlay);
    };
  };

  const scoreTotal = (hand) => {
      let totalScore = 0;
      // console.log('hand.length', hand.length);
      for ( let i = 0; i < hand.length; i++ ) {
        // console.log('hand['+ i + '] [0].value', hand[i][0].value);
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
    if (!parseInt(bet) || playerBankRoll < 0 || bet > playerBankRoll) {
      // console.log('!parseInt(bet) || bet > playerBankRoll');
      $('input').attr("placeholder", "Invalid! Try Again").css({
        'background-color' : 'red',
        'font-weight' : 'bold'
      });
      return(false);
    }
    //input is a non-blocking call so just leave!!!
    //and wait for the next button to check again.....
    return(true);
  };

  const betButton = () => {
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
        return(false);
      } else {
        //set the bet for this round -- betting only once.
        //no 2:3 nor 5:7 yet....
        playerBankRoll-=parseInt(bet);
        thePot+=parseInt(bet);
        //input good play the game.........
        openingDeal();
      };
      return(true);
  };

  const playerPlayHand = () => {
    //player hit or stay......
    //algorithm for hit or stay
    // //Player draws till > 17  if dealer up card is < 6 or stay
    // // let hitme = false;
    //player hit or stay......
    //algorithm for hit or stay - for now.....
    //if dealer up card is < 6 player takes hit
    // console.log('playerPlayHand Entry');
    hitMe($('#player'));
    return;
  };

  const dealerPlayHand = () => {
    //JQuery to flip the hole card up.....
    // const faceUp = true;
    $('#dealer').children().eq(1).attr({
        src: cards.dealerCards[1][0].img
    });
    //dealer draws until >= 17
    while ( scoreTotal(cards.dealerCards) <= 17 && cards.deck.length > 0) {
      // console.log('dealer draws another card');
      hitMe($('#dealer'));
    };
    return;
  };

  const whoWon = () => {
    let playerScore = scoreTotal(cards.playerCards);
    let dealerScore = scoreTotal(cards.dealerCards);

    console.log('playerScore', playerScore);
    console.log('dealerScore', dealerScore);
    // console.log('clean up');

    if (playerScore <= 21 && (dealerScore > 21 || playerScore > dealerScore)) {
      //player gets the pot
      playerBankRoll += parseInt(thePot);
      console.log('Player Wins!!', playerScore);
    } else if (dealerScore <= 21 && (playerScore > 21 || dealerScore > playerScore)) {
      //player loses bet
      playerBankRoll -= parseInt(thePot);
      console.log('Dealer Wins!!', dealerScore);
    } else if (playerScore === dealerScore || (playerScore > 21 && dealerScore > 21)) {
      //it is a push -- player keeps his bet
      playerBankRoll += parseInt(bet);
      console.log('Push!!');
    };
  };

  const gameCleanup = () => {
    //reset for next round
    thePot = 0;
    bet = '';
    roundPlayed++;
    cards.dealerCards = [];
    cards.playerCards = [];
    // $('#player').children().remove();
    // $('#dealer').children().remove();

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
  //hide non user flow buttons
  //don't show if it is not needed
  $('#hit-me').css('visibility', 'hidden');
  $('#stay').css('visibility', 'hidden');

  //build the Deck of Cards (just 1 Deck for now)
  // console.log('createCards');
  createCards();
  // console.log('setup event listener on start/bet button');

  $('#bet').on('click', () => {
    const betBool = betButton();
    //Bet made -- turn button off for now -- till game finished or ended
    console.log('betBool', betBool);
    if (betBool) {
      $('#bet').off();
      $('#bet').css('visibility', 'hidden');
      $('#hit-me').css('visibility', 'visible');
      $('#stay').css('visibility', 'visible');
    }

    //Players turn to hit or stand so.. turn on those buttons
    $('#hit-me').on('click', () => {
      console.log('hit-me clicked');
      //do all the hitme code
      playerPlayHand();
      if (scoreTotal(cards.playerCards) > 21) {
      // } else {
        $('#stay').trigger('click');
      };
    });

    $('#stay').on('click', () => {
      console.log('stay clicked');
      //Player done... so hit-me and stay are done/off!!
      $('#hit-me').off();
      $('#stay').off();
      //now the dealer play code runs (automatically - no buttons nor input)
      dealerPlayHand();
      //get the totals and do all the winner/looser/push updates
      //prompt for continue playing.....
      //I need a status or just on continue play show Game/Player Stats
      whoWon();

      gameCleanup();

    });

    console.log('outa the button click');
  });

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
