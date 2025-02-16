const readline = require("readline-sync");

// Vytvoření balíčku karet
function createDeck() {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  const deck = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

// Zamíchání balíčku (Fisher-Yates shuffle)
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Převod karty na řetězec (pro hezký výpis)
function cardToString(card) {
  let suitSymbol;
  switch (card.suit) {
    case "hearts":
      suitSymbol = "♥";
      break;
    case "diamonds":
      suitSymbol = "♦";
      break;
    case "clubs":
      suitSymbol = "♣";
      break;
    case "spades":
      suitSymbol = "♠";
      break;
    default:
      suitSymbol = card.suit;
  }
  return `${card.rank}${suitSymbol}`;
}

// Výpočet hodnoty ruky s přihlédnutím k esům
function calculateHandValue(hand) {
  let total = 0;
  let aceCount = 0;

  for (const card of hand) {
    let value;
    if (["J", "Q", "K"].includes(card.rank)) {
      value = 10;
    } else if (card.rank === "A") {
      value = 11;
      aceCount++;
    } else {
      value = Number(card.rank);
    }
    total += value;
  }

  // Úprava hodnoty esa
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }

  return total;
}

// Hlavní funkce pro průběh hry
function playGame() {
  const deck = createDeck();
  shuffleDeck(deck);

  // Rozdání počátečních karet
  const playerHand = [deck.pop(), deck.pop()];
  const dealerHand = [deck.pop(), deck.pop()];

  console.log("Dealer's hand: [hidden], " + cardToString(dealerHand[1]));
  console.log(
    "Your hand: " +
      playerHand.map(cardToString).join(", ") +
      " (Total: " +
      calculateHandValue(playerHand) +
      ")"
  );

  // Tah hráče
  let playerTotal = calculateHandValue(playerHand);
  while (playerTotal < 21) {
    const answer = readline.question("Hit or stand? (h/s): ");
    if (answer.toLowerCase() === "h") {
      const card = deck.pop();
      console.log("You drew: " + cardToString(card));
      playerHand.push(card);
      playerTotal = calculateHandValue(playerHand);
      console.log(
        "Your hand: " +
          playerHand.map(cardToString).join(", ") +
          " (Total: " +
          playerTotal +
          ")"
      );
      if (playerTotal > 21) {
        console.log("Bust! You lose.");
        return;
      }
    } else if (answer.toLowerCase() === "s") {
      break;
    } else {
      console.log("Invalid input. Please enter 'h' for hit or 's' for stand.");
    }
  }

  // Tah dealera
  console.log("\nDealer's turn.");
  console.log(
    "Dealer's hand: " +
      dealerHand.map(cardToString).join(", ") +
      " (Total: " +
      calculateHandValue(dealerHand) +
      ")"
  );
  let dealerTotal = calculateHandValue(dealerHand);
  while (dealerTotal < 17) {
    const card = deck.pop();
    console.log("Dealer draws: " + cardToString(card));
    dealerHand.push(card);
    dealerTotal = calculateHandValue(dealerHand);
    console.log(
      "Dealer's hand: " +
        dealerHand.map(cardToString).join(", ") +
        " (Total: " +
        dealerTotal +
        ")"
    );
  }

  // Vyhodnocení výsledku
  console.log("\nFinal Results:");
  console.log("Your total: " + playerTotal);
  console.log("Dealer's total: " + dealerTotal);

  if (dealerTotal > 21) {
    console.log("Dealer busts! You win!");
  } else if (playerTotal === dealerTotal) {
    console.log("Push. It's a tie.");
  } else if (playerTotal > dealerTotal) {
    console.log("You win!");
  } else {
    console.log("Dealer wins.");
  }
}

playGame();
