$(()=>{
// console.log('hooked up');

  let playerBankRoll = 500;
  let thePot = 0;
  let bet = '';
  let roundPlayed = 0;
  let playerWins = true;
  let dealerWins = true;

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

  const validateBet = () => {
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
        // playerBankRoll-=parseInt(bet);
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
    $('#dealer').children().eq(3).attr({
        src: cards.dealerCards[1][0].img
    });
    //dealer draws until >= 17
    while ( scoreTotal(cards.dealerCards) <= 17 && cards.deck.length > 0) {
      // console.log('dealer draws another card');
      hitMe($('#dealer'));
    };
    //get the totals and do all the winner/looser/push updates
    //prompt for continue playing.....
    //I need a status or just on continue play show Game/Player Stats
    whoWon();
    //Game over at this point
    //update stats and turn the input & bet button back on
    summaryUdate();
    return;
  };

  const whoWon = () => {
    let playerScore = scoreTotal(cards.playerCards);
    let dealerScore = scoreTotal(cards.dealerCards);
    // console.log('playerScore', playerScore);
    // console.log('dealerScore', dealerScore);
    if (playerScore <= 21 && (dealerScore > 21 || playerScore > dealerScore)) {
      //player gets the pot
      playerBankRoll += parseInt(thePot) + parseInt(bet);
      playerWins = true;
      dealerWins = false;
      console.log('Player Wins!!', playerScore);
    } else if (dealerScore <= 21 && (playerScore > 21 || dealerScore > playerScore)) {
      //player loses bet
      playerBankRoll -= parseInt(bet);
      dealerWins = true;
      playerWins = false;
      console.log('Dealer Wins!!', dealerScore);
    } else if (playerScore === dealerScore || (playerScore > 21 && dealerScore > 21)) {
      //it is a push -- player keeps his bet
      //playerBankRoll += parseInt(bet);
      playerWins = true;
      dealerWins = true;
      console.log('Push!!');
    };
    roundPlayed++;
  };

  const summaryUdate = () => {
    $('#bank-roll').text('Player Bank Roll: $' + playerBankRoll);
    $('#rounds').text('Rounds Played: ' + roundPlayed);
    $('#pot').text('Pot: $' + thePot);
    $('#playerbet').text('Players Bet: $' + parseInt(bet));
    if (playerWins) {
      $('#player-score').text('Player Score: ' + scoreTotal(cards.playerCards)).css('color', 'green');
    } else {
      $('#player-score').text('Player Score: ' + scoreTotal(cards.playerCards)).css('color', 'red');
    }
    if (dealerWins) {
      $('#dealer-score').text('Dealer Score: ' + scoreTotal(cards.dealerCards)).css('color', 'green');
    } else {
      $('#dealer-score').text('Dealer Score: ' + scoreTotal(cards.dealerCards)).css('color', 'red');
    }
    $('#bet').css('visibility', 'visible');
    $('input').css('visibility', 'visible');
    $('input').text('');
    //no more need for hit-me nor stay -- game over
    $('#hit-me').css('visibility', 'hidden');
    $('#stay').css('visibility', 'hidden');

    //summary console.log
    // console.log('playerBankRoll', playerBankRoll);
    // console.log('roundPlayed', roundPlayed);
    // console.log('cards.deck.length', cards.deck.length);
    // console.log('cards.playerCards.length', cards.playerCards.length);
    // console.log('cards.dealerCards.length', cards.dealerCards.length);
    // console.log('thePot', thePot);
    // console.log('bet' , bet);
  };

  const gameCleanup = () => {
    //remove things u can not use -- need not use
    // $('#bet').css('visibility', 'visible');
    // $('input').css('visibility', 'visible');
    // $('input').text('');
    // $('#hit-me').css('visibility', 'hidden');
    // $('#stay').css('visibility', 'hidden');

    //reset for next round
    thePot = 0;
    bet = 0;
    cards.dealerCards = [];
    cards.playerCards = [];
    // console.log("$('#player img')", $('#player img'));
    $('#player img').remove();
    $('#dealer img').remove();
    playerWins = true;
    dealerWins = true;
    summaryUdate();
    if (cards.deck.length < 4) {
      alert("The Deck is exhausted.  Restarting...");
      location.reload();
    } else if ( playerBankRoll <= 0 ) {
      alert("Players Bankroll is exhausted.  Restarting...");
      location.reload();
    }
  };

  const betButton = () => {
    console.log('Start/bet clicked');
    //todo: turn stuff back on and prepair for the next round!!!!!!!
    gameCleanup();

    const betBool = validateBet();
    //Bet made -- turn button off for now -- till game finished or ended
    // console.log('betBool', betBool);
    if (betBool) {
      // $('#bet').off();
      $('input').css('visibility', 'hidden');
      $('#bet').css('visibility', 'hidden');
      $('#hit-me').css('visibility', 'visible');
      $('#stay').css('visibility', 'visible');
    }
  };

  const hitButton = () => {
    console.log('hit-me clicked');
    //do all the hitme code
    playerPlayHand();
    if (scoreTotal(cards.playerCards) > 21 || cards.deck.length <= 0) {
      $('#stay').trigger('click');
    };
  };

  const stayButton = () => {
    console.log('stay clicked');
    //Player done... so hit-me and stay are done/off!!
    // $('#hit-me').off();
    // $('#stay').off();
    $('#hit-me').css('visibility', 'hidden');
    $('#stay').css('visibility', 'hidden');
    //now the dealer play code runs (automatically - no buttons nor input)
    dealerPlayHand();
  };

  //Start............
  //build the Deck of Cards (just 1 Deck for now)
  // console.log('createCards');
  createCards();

  //hide non user flow buttons
  //don't show if it is not needed
  $('#hit-me').css('visibility', 'hidden');
  $('#stay').css('visibility', 'hidden');

  //set event listeners
  $('#bet').on('click', betButton);
  //Players turn to hit or stand so.. turn on those buttons
  $('#hit-me').on('click', hitButton);

  $('#stay').on('click', stayButton);
  // gameCleanup();
  // if ( playerBankRoll <= 0 && cards.deck.length < 4 ) {
  //   return;
  // };

});
