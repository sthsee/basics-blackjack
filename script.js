/*
Game rules are more like casino black jack
 */

/*
at the start, have bet, input field, and go button appear.
then other than go button, also hide bet and input field.
then gameover 5 secs later, reshow the 3 elements.
*/

// make a shuffled deck
var makeDeck = function () {
  var deck = [];

  var suits = ["hearts", "diamonds", "clubs", "spades"];
  for (var suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    var currentSuit = suits[suitIndex];
    for (var rank = 1; rank <= 13; rank += 1) {
      var name = rank;
      if (rank == 1) {
        name = "ace";
      } else if (rank == 11) {
        name = "jack";
      } else if (rank == 12) {
        name = "queen";
      } else if (rank == 13) {
        name = "king";
      }
      var score = rank;
      if (rank == 11 || rank == 12 || rank == 13) {
        score = 10;
      } else if (rank == 1) {
        score = 11;
      }
      deck.push({
        name: name,
        rank: rank,
        suit: currentSuit,
        score: score,
        imgSrc: rank.toString() + currentSuit[0].toString(),
      });
    }
  }
  return deck;
};

var fakeDeck = [
  {
    name: "ace",
    rank: 1,
    suit: "clubs",
    score: 11,
  },
  {
    name: "2",
    rank: 2,
    suit: "clubs",
    score: 2,
  },
  {
    name: "6",
    rank: 6,
    suit: "clubs",
    score: 6,
  },
  {
    name: "ace",
    rank: 1,
    suit: "clubs",
    score: 11,
  },
  {
    name: "10",
    rank: 10,
    suit: "clubs",
    score: 10,
  },
  {
    name: "ace",
    rank: 1,
    suit: "clubs",
    score: 11,
  },
].reverse();

var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};
var shuffleCards = function (cardDeck) {
  for (var i = 0; i < cardDeck.length; i += 1) {
    var randomIndex = getRandomIndex(cardDeck.length);
    var randomCard = cardDeck[randomIndex];
    var currentCard = cardDeck[i];
    cardDeck[i] = randomCard;
    cardDeck[randomIndex] = currentCard;
  }
  return cardDeck;
};

var deck = makeDeck();

// have 6 shuffled decks
var shuffledDeckOne = shuffleCards(deck);
var shuffledDeckTwo = shuffleCards(structuredClone(deck));
var shuffledDeckThree = shuffleCards(structuredClone(deck));
var shuffledDeckFour = shuffleCards(structuredClone(deck));
var shuffledDeckFive = shuffleCards(structuredClone(deck));
var shuffledDeckSix = shuffleCards(structuredClone(deck));
var sixDecks = shuffledDeckOne.concat(
  shuffledDeckTwo,
  shuffledDeckThree,
  shuffledDeckFour,
  shuffledDeckFive,
  shuffledDeckSix
);

// player starts with $1000
var playerMoneyBalance = 1000;
var bet = 0;

var dealer = {
  cards: [],
  score: 0,
  isDealer: true,
};

var player = {
  cards: [],
  score: 0,
  isDealer: false,
};

var output = "";
var bettingContainer = document.querySelector("#betting-container");
var errorMessage = document.querySelector("#output-div");
//var hitStandContainer = document.querySelector("#hit-stand-container");
var input = document.querySelector("#input-field");
var goButton = document.querySelector("#go-button");
var hitButton = document.querySelector("#hit-button");
var standButton = document.querySelector("#stand-button");
var middle = document.querySelector("#middle");
var gameOverMessage = document.querySelector("#game-over-message");
var groupOfText = document.querySelector(".group-of-text");
var betDisplay = document.querySelector("#bet-display");
var dealerScoreAttachment = document.querySelector("#dealer-score-attachment");
var playerScoreAttachment = document.querySelector("#player-score-attachment");

betDisplay.style.display = "none";
dealerScoreAttachment.style.display = "none";
playerScoreAttachment.style.display = "none";

var hideHitStandButtons = function () {
  hitButton.style.display = "none";
  standButton.style.display = "none";
  groupOfText.style.opacity = "";
  betDisplay.style.display = "none";
};

var showHitStandButtons = function () {
  hitButton.style.display = "block";
  standButton.style.display = "block";
  groupOfText.style.opacity = "0.2";
  betDisplay.style.display = "block";
  betDisplay.innerText = `$${bet}`;
};

var isThereAnyBlackJack = false;
var isItEndOfRound = false;

var showScore = function (person) {
  playerScoreAttachment.style.display = "block";
  dealerScoreAttachment.style.display = "block";
  if (person == player) {
    playerScoreAttachment.innerText = player.score;
  } else if (person == dealer) {
    if (isThereAnyBlackJack || isItEndOfRound) {
      dealerScoreAttachment.innerText = dealer.score;
      isThereAnyBlackJack = false;
    } else if (dealer.cards.length == 2) {
      dealerScoreAttachment.innerText = dealer.cards[0].score;
    } else {
      dealerScoreAttachment.innerText = dealer.score;
    }
  }
};

var hideBetting = function () {
  bettingContainer.style.display = "none";
};

var showBetting = function () {
  bettingContainer.style.display = "flex";
  //bettingContainer.style.visibility = "visible";
};

hideHitStandButtons();

// [if card rank = 1, and cardTotalValue doesn't exceed 21, count card value as 11.
// if card rank = 1, and cardTotalValue exceeds 21, count card value as 1.
// e.g.
// A,9. count as 11,9.
// 5,9,A. count as 15.]

var calcScore = function (person) {
  var elevenCount = 0;
  person.score = 0;
  for (var i = 0; i < person.cards.length; i += 1) {
    person.score += person.cards[i].score;
    if (person.cards[i].score == 11) {
      elevenCount += 1;
    }
  }
  //console.log(JSON.stringify(person, "", 2));
  // if score exceeds and there is still at least 1 ace that has score 11????
  while (person.score > 21 && elevenCount > 0) {
    for (var i = 0; i < person.cards.length; i += 1) {
      if (person.cards[i].rank == 1 && person.cards[i].score == 11) {
        person.cards[i].score = 1;
        elevenCount -= 1;
        break;
      }
    }
    person.score = 0;
    for (var i = 0; i < person.cards.length; i += 1) {
      person.score += person.cards[i].score;
    }
  }
  console.log(JSON.stringify(person, "", 2));
};

/*
for gameover and blackjack scenarios, 
run a function that adds/subtract from playerMoneyBalance, and update the html
*/
var updateBalance = function (outcome) {
  if (outcome == "win") {
    playerMoneyBalance += bet;
  } else if (outcome == "big win") {
    playerMoneyBalance += 1.5 * bet;
  } else if (outcome == "lose") {
    playerMoneyBalance -= bet;
  }
  document.querySelector(
    "#player-balance"
  ).innerText = `$${playerMoneyBalance}`;
};

var toNextRound = function () {
  middle.style.background =
    "linear-gradient(113deg, #EAD307 6.67%, #F2E14C 86.34%)";
  middle.style.boxShadow = "0px 0px 40px 5px rgba(0, 0, 0, 0.25)";
  var dealerSecondCard = document.querySelector("[src='cards/back.svg']");
  var originalSource = dealerSecondCard.getAttribute("originalsrc");
  dealerSecondCard.src = originalSource;

  showScore(dealer);
  showScore(player);
  setTimeout(() => {
    gameOverMessage.innerText = "";
    bet = 0;
    player.cards = [];
    dealer.cards = [];
    document.querySelector("#player-hand").innerHTML = "";
    document.querySelector("#dealer-hand").innerHTML = "";
    dealerScoreAttachment.style.display = "none";
    playerScoreAttachment.style.display = "none";
    showBetting();
    errorMessage.innerText = "";
    middle.style.background = "";
    middle.style.boxShadow = "";
    isItEndOfRound = false;
  }, 4000);
};

var blackJackCheck = function () {
  if (player.score == 21 || dealer.score == 21) {
    isThereAnyBlackJack = true;
    isItEndOfRound = true;
    hideHitStandButtons();
    if (player.score == 21 && dealer.score == 21) {
      gameOverMessage.innerText = "PLAYER AND DEALER BLACK JACK! PUSH!";
      console.log("PLAYER AND DEALER BLACK JACK. PUSH");
    } else if (player.score == 21) {
      gameOverMessage.innerText = "PLAYER BLACK JACK!";
      updateBalance("big win");
      console.log("PLAYER BLACKJACK");
    } else if (dealer.score == 21) {
      gameOverMessage.innerText = "DEALER BLACK JACK!";
      updateBalance("lose");
      console.log("DEALER BLACK JACK");
    }
    toNextRound();
  }
};

var gameOver = function () {
  isItEndOfRound = true;
  hideHitStandButtons();
  if (player.score > 21) {
    gameOverMessage.innerText = "PLAYER BUST!";
    updateBalance("lose");
    console.log("PLAYER BUST");
  } else if (dealer.score > 21) {
    gameOverMessage.innerText = "DEALER BUST!";
    updateBalance("win");
    console.log("DEALER BUST");
  } else if (player.score == dealer.score) {
    gameOverMessage.innerText = "PUSH!";
    console.log("PUSH");
  } else if (player.score > dealer.score) {
    gameOverMessage.innerText = "PLAYER WINS!";
    updateBalance("win");
    console.log("PLAYER WINS");
  } else if (player.score < dealer.score) {
    gameOverMessage.innerText = "DEALER WINS!";
    updateBalance("lose");
    console.log("DEALER WINS");
  }

  toNextRound();
};

var playerDrawCard = function () {
  var newCard = sixDecks.pop();
  player.cards.push(newCard);
  var newCardImg = document.createElement("img");
  newCardImg.src = `cards/${newCard.imgSrc}.svg`;
  document.querySelector("#player-hand").appendChild(newCardImg);
};

var dealerDrawCard = function () {
  var newCard = sixDecks.pop();
  dealer.cards.push(newCard);
  var newCardImg = document.createElement("img");
  var isSecondCard = dealer.cards.length == 2;
  if (isSecondCard) {
    newCardImg.src = `cards/back.svg`;
    newCardImg.setAttribute("originalSrc", `cards/${newCard.imgSrc}.svg`);
  } else {
    newCardImg.src = `cards/${newCard.imgSrc}.svg`;
  }
  document.querySelector("#dealer-hand").appendChild(newCardImg);
};

var playerHit = function () {
  playerDrawCard();
  calcScore(player);
  showScore(player);
  console.log(player.score);
  console.log(player.cards[player.cards.length - 1]);
  if (player.score > 21) {
    // Player loses bet, Reset values?
    gameOver();
  }
};

// if player chooses stand,
// if dealer card total is less than 17, draw card until dealer card total is 17 or more.
// if dealer card total is 17 or more, expose all dealer's cards.
// if dealer card total exceeds 21, BUST. player wins bet. end round.
// if player card total = dealer card total, TIE. end round.
// if player card total > dealer card total, YOU WIN. player wins bet. end round.
// if player card total < dealer card total, DEALER WINS. player loses bet. end round.
var playerStand = function () {
  while (dealer.score < 17) {
    dealerDrawCard();
    calcScore(dealer);
  }
  showScore(dealer);
  console.log(dealer.cards);
  console.log(dealer.score);
  gameOver();
};

var main = function (userInput) {
  // player input bet: $2-$500. clicks "Deal"
  if (isNaN(userInput) || userInput < 2 || userInput > 500) {
    return "Please enter a number from 2 to 500.";
  } else {
    bet = Number(userInput);
    // sequence of card drawing: player, dealer, player, dealer(face down)
    playerDrawCard();
    dealerDrawCard();
    playerDrawCard();
    dealerDrawCard();

    // display card totals for player and dealer
    calcScore(player);
    calcScore(dealer);
    showScore(player);
    showScore(dealer);
    hideBetting();
    showHitStandButtons();
    blackJackCheck();
  }
};
var button = document.querySelector("#go-button");
button.addEventListener("click", function () {
  // Set result to input value
  var input = document.querySelector("#input-field");
  var result = main(input.value);

  // Display result in output element
  if (result !== null) {
    var output = document.querySelector("#output-div");
    output.innerHTML = result;
  }

  // Reset input value
  input.value = "";
});

var hitButton = document.querySelector("#hit-button");
hitButton.addEventListener("click", function () {
  playerHit();
});

var standButton = document.querySelector("#stand-button");
standButton.addEventListener("click", function () {
  playerStand();
});
