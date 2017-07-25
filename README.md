# Project 1 -- Blackjack MVP

  Setup - up generateComputer -- Class - Objects - JavaScript
    • Setup background - Green Playing table
    • Show deck of cards on playing table
    • Set array of 52 card objects (suit, value)
    • Setup Player and Computer/Dealer objects
    • Random deal (pop or count = 52) form card array updating html  to display dealt cards
  Player/Dealer(Computer) -- CSS -- JQuery -- JavaScript
    • bankroll -= bet on start (ante or end button)
    • update pot += ante or bet
    • 2 cards dealt to each player
    • calculate score for dealer/player
      Player Hit (add score dealer/player)
          •Bet if bankroll >= 0 else EOG (bet/stay button)
          •player bet amount (bankroll -= bet)
          •dealer draws till >= 17
          •player takes another card
          •Player calc total > 21 busted EORound
          •Dealer/Computer may take card or stay
            •The dealer must hit until the cards total 17 or more points
          •Dealer/Computer add total > 21 busted EORound
            •Player wins pot bankroll += (pot * 2)
          •Dealer/Computer pays winner
          While dealer or player !busted or !stay
      Stay
          •Dealer score > 17
          •Player > 18
          •compare dealer card total with player award pot to winner
          •player & dealer bust or === a push bet credited back to player

    Strech Goals
      •Annomate dealing of cards off the deck (CSS for img)
      •Play with 4 decks - call create cards n times for n decks
      •Player has no $ must Stay! loose pot ?
      •algorithm to implement betting strategy
      •insurance - side bet
      •2:1 payout (dealer up card is an ace)
      •split play
      •Aces are 1 or 11 (11 for now

Site:
https://lin1ood.github.io/

Code:
https://github.com/lin1ood/lin1ood.github.io
