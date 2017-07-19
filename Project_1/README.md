Project 1 -- Blackjack MVP

  Setup - up generateComputer
done    • Setup background - Green Playing table
    • Show deck of cards on playing table
done    • Set array of 52 card objects (suite, value)
????    • Setup Player and Computer/Dealer objects
done    • Random deal (pop or count = 52) form card array updating html  to display dealt cards
  Player/Dealer(Computer)
done    • bankroll -= bet on start (ante or end button)
done    • update pot += ante or bet
done    • 2 cards dealt to each player
done    • calculate score for dealer/player
      Player Hit (add score dealer/player)
done          •Bet if bankroll >= 0 else EOG (bet/stay button)
done          •player bet amount (bankroll -= bet)
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
          •player > dealer <= 21 bankroll += pot
          •compare dealer card total with player

    Strech Goals
      •Annomate dealing of cards off the deck
      •Play with 4 decks or continous cards
      •Player has no $ must Stay! win/loose pot ?
      •algorithm to implement betting strategy
      •insurance - side bet 2:1 payout (dealer up card is an ace)
      •split play
      •Aces are 1 or 11 (11 for now
      •


https://ga-students.slack.com/files/kristyn/F6AA69GCS/mvps_that_we_discussed_for_project_1.js
