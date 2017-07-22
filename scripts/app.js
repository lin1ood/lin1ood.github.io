$(()=>{
// console.log('hooked up');
  //globals -- maintained between rounds
  //and initialized here for starting a new game
  let playerBankRoll = 500;
  let thePot = 0;
  let bet = '';
  let roundPlayed = 0;
  let playerWins = true;
  let dealerWins = true;

  //class for playing card
  class Card {
    constructor(suit, value, img) {
      this.suit = suit;
      this.value = value;
      this.img = 'img/' + img;
    }
  };

  //Class for Face Cards
  class FaceCard extends Card {
    constructor(suit, value, img, face) {
      super(suit, value, img);
      this.face = face;
    }
  }

  //cards object for storing the 'in play' deck,
  //dealer & player hands
  const cards = {
    deck: [],
    dealerCards: [],
    playerCards: []
  };


  //create 1 52 card deck of all 4 suits cards in a deck
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

  //randomly deal cards from the deck.cards array
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


  //create and return face up/face down card image element
  //based on the playingCard parameter
  const getCardImg = (playingCard, faceUp) => {
    let cardPic = playingCard[0].img;
    if (!faceUp) {
      cardPic = 'img/back.bmp'
    };

    const $cardImage = $('<img/>');
    $cardImage.attr({
        src: cardPic,
        height: "125px",
        width: "75px"
    });
    return($cardImage);
  };

  //Opening deal -- 2 cards to the player and 2 to the dealer in turn
  //Dealers second delt card is the hole card and only the back can show
  const openingDeal = () => {
    const faceUp = true;
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
  };

  //hitme player or dealer to add a card to their hand
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

  //calc the score total of the hand (cards) parameter
  const scoreTotal = (hand) => {
      let totalScore = 0;
      // console.log('hand.length', hand.length);
      for ( let i = 0; i < hand.length; i++ ) {
        // console.log('hand['+ i + '] [0].value', hand[i][0].value);
        totalScore+=hand[i][0].value;
      }
      return(totalScore);
  };

  //check the input for a good, valid value
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
      // nag in red if input was invalid
      $('input').attr("placeholder", "Invalid! Try Again").css({
        'background-color' : 'red',
        'font-weight' : 'bold'
      });
      return(false);
    }
    return(true);
  };

  //get Valid Bet the input
  const validateBet = () => {
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
        //todo: Strech
        //  no 2:3 nor 5:7 yet....
        thePot+=parseInt(bet);
        openingDeal();
      };
      return(true);
  };

  //player playing hand
  //This method is avaiable for self play
  //could let the game run in a 'Demo' mode.
  const playerPlayHand = () => {
    //player hit or stay......
    //todo: Strech Goal
    //algorithm for hit or stay
    // Current implementation... this was coded inline for console.log prior to // the hit button baing added.. with this it is up to the Player
    //  Player draws till > 17  if dealer up card is < 6 or stay
    //  let hitme = false;
    hitMe($('#player'));
    return;
  };

  //Player is done with hits and has stayed
  //now the Dealer (Computer) must play her hand
  const dealerPlayHand = () => {
    //JQuery to flip the hole card up.....
    //replace the back of the card with the actual
    //face of the card
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

  //who won the round
  const whoWon = () => {
    let playerScore = scoreTotal(cards.playerCards);
    let dealerScore = scoreTotal(cards.dealerCards);
    // console.log('playerScore', playerScore);
    // console.log('dealerScore', dealerScore);
    if (playerScore <= 21 && (dealerScore > 21 || playerScore > dealerScore)) {
      //player gets the pot & original bet back
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
    //this is the end of the round -- when the dealer is done.
    roundPlayed++;
  };

  //calc and update the summary div (panel)
  const summaryUdate = () => {
    $('#bank-roll').text('Player Bank Roll: $' + playerBankRoll);
    $('#rounds').text('Rounds Played: ' + roundPlayed);
    $('#pot').text('Pot: $' + thePot);
    $('#playerbet').text('Players Bet: $' + parseInt(bet));
    //set green 'win' or red 'lose' summary text for the Player
    if (playerWins) {
      $('#player-score').text('Player Score: ' + scoreTotal(cards.playerCards)).css('color', 'green');
    } else {
      $('#player-score').text('Player Score: ' + scoreTotal(cards.playerCards)).css('color', 'red');
    }
    //set green 'win' or red 'lose' summary text for the Dealer
    if (dealerWins) {
      $('#dealer-score').text('Dealer Score: ' + scoreTotal(cards.dealerCards)).css('color', 'green');
    } else {
      $('#dealer-score').text('Dealer Score: ' + scoreTotal(cards.dealerCards)).css('color', 'red');
    }
    //end of round so make the bet/start visible again
    $('#bet').css('visibility', 'visible');
    $('input').css('visibility', 'visible');
    // $('input').attr('placeholder', "Place your Bet Here");
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

  //reset cumulative values for next round
  const gameCleanup = () => {
    //global value housekeeping
    playerWins = true;
    dealerWins = true;
    thePot = 0;
    bet = 0;
    //empty hands for both players
    cards.dealerCards = [];
    cards.playerCards = [];
    //remove cards from the table
    $('#player img').remove();
    $('#dealer img').remove();
    //set summary panel with top of the round values
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
    //reset cumulative vars for new round
    gameCleanup();

    //player has placed a bet
    const betBool = validateBet();
    //hide bet button for now -- till game finished or next round
    if (betBool) {
      $('input').css('visibility', 'hidden');
      $('#bet').css('visibility', 'hidden');
      $('#hit-me').css('visibility', 'visible');
      $('#stay').css('visibility', 'visible');
    }
  };

  //player asking for another card
  const hitButton = () => {
    console.log('hit-me clicked');
    playerPlayHand();
    if (scoreTotal(cards.playerCards) > 21 || cards.deck.length <= 0) {
      $('#stay').trigger('click');
    };
  };

  const stayButton = () => {
    console.log('stay clicked');
    //Player done... so hide hit-me - no need to show what is not needed
    $('#hit-me').css('visibility', 'hidden');
    $('#stay').css('visibility', 'hidden');
    //now the dealer play code runs (automatically - no buttons nor input)
    //dealer must hit until >= 17
    dealerPlayHand();
  };

  //Start............
  //build the Deck of Cards (just 1 Deck for now - each call will create 1 deck)
  createCards();

  //hide non user flow buttons
  //don't show if it is not needed
  $('#hit-me').css('visibility', 'hidden');
  $('#stay').css('visibility', 'hidden');

  //set 3 button event listeners
  $('#bet').on('click', betButton);
  //Players turn to hit or stand so.. turn on those buttons
  $('#hit-me').on('click', hitButton);
  //player stay - happy with hand
  $('#stay').on('click', stayButton);

});
