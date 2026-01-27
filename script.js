const createLobbyButton = document.getElementById("createLobby");
const createdLobbyCode = document.getElementById("createdLobbyCode");
const lobbyDiv = document.getElementById("lobbyDiv");
const playAreaDiv = document.getElementById("playAreaDiv");
const tableCard = document.getElementById("tableCard");
const pileCard = document.getElementById("pileCard");

const joinLobbyButton = document.getElementById("joinLobby");
const joinLobbyCode = document.getElementById("joinLobbyCode");

const handSizeInput = document.getElementById("handSizeInput");

const handHTML = document.getElementById("hand");
const turnText = document.getElementById("turnText");

let deckID;
let myTurn = 0;
let hold = 0;

let startingHandSize = 5;
let hand = [];

tableCard.onclick = function () {
  if (myTurn == 0) return;
  drawCards(1);
  endTurn();
};

function endTurn() {
  fetch(
    `https://deckofcardsapi.com/api/deck/${deckID}/pile/no_jokers/add/?cards=X1`,
  )
    .then((response) => response.json())
    .then((array) => {
      myTurn = 0;
      turnText.innerHTML = "Opponent's turn";
      hold = 2;
    });
}

function playCard(e) {
  if (myTurn == 0) return;
  if (
    pileCard.src.substr(-6, 2)[0] != e.target.code[0] &&
    pileCard.src.substr(-6, 2)[1] != e.target.code[1]
  )
    return;
  fetch(
    `https://deckofcardsapi.com/api/deck/${deckID}/pile/table/add/?cards=${e.target.code}`,
  )
    .then((response) => response.json())
    .then((array) => {
      handHTML.removeChild(e.target);
      pileCard.src = `https://deckofcardsapi.com/static/img/${e.target.code}.png`;
      if (handHTML.children.length > 0) endTurn();
      else {
        fetch(
          `https://deckofcardsapi.com/api/deck/${deckID}/pile/no_jokers/add/?cards=X1,X2`,
        )
          .then((response) => response.json())
          .then((array) => {
            myTurn = 1;
            turnText.innerHTML = "You win!";
          });
      }
    });
}

function drawCards(n) {
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${n}`)
    .then((response) => response.json())
    .then((array) => {
      array.cards.forEach((e) => {
        hand.push(e.code);
        let img = document.createElement("img");
        img.src = `https://deckofcardsapi.com/static/img/${e.code}.png`;
        img.code = e.code;
        img.onclick = (img) => {
          playCard(img);
        };
        img.width = 169;
        handHTML.appendChild(img);
      });
      if (array.cards.length < n) {
        fetch(
          `https://deckofcardsapi.com/api/deck/${deckID}/pile/table/return/`,
        ).then(
          fetch(
            `https://deckofcardsapi.com/api/deck/${deckID}/pile/table/add/?cards=${pileCard.src.substr(-6, 2)}`,
          ).then(
            fetch(
              `https://deckofcardsapi.com/api/deck/${deckID}/shuffle/?remaining=true`,
            ),
          ),
        );

        drawCards(n - array.cards.length);
      }
    });
}

joinLobbyButton.addEventListener("click", function () {
  deckID = joinLobbyCode.value;
  handHTML.replaceChildren();
  if (deckID == "") return;
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/shuffle/?remaining=true`)
    .then((response) => response.json())
    .then((array) => {
      if (!array.success) {
        return;
      }
      startingHandSize = 52 - array.remaining;
      fetch(
        `https://deckofcardsapi.com/api/deck/${deckID}/pile/no_jokers/add/?cards=X1`,
      )
        .then((response) => response.json())
        .then((array) => {
          hold = 5;
          fetch(
            `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${startingHandSize}`,
          )
            .then((response) => response.json())
            .then((array) => {
              array.cards.forEach((e) => {
                hand.push(e.code);
                let img = document.createElement("img");
                img.src = `https://deckofcardsapi.com/static/img/${e.code}.png`;
                img.code = e.code;
                img.onclick = (img) => {
                  playCard(img);
                };
                img.width = 169;
                handHTML.appendChild(img);
              });
              fetch(
                `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`,
              )
                .then((response) => response.json())
                .then((array) => {
                  fetch(
                    `https://deckofcardsapi.com/api/deck/${deckID}/pile/table/add/?cards=${array.cards[0].code}`,
                  );
                  pileCard.src = `https://deckofcardsapi.com/static/img/${array.cards[0].code}.png`;
                });
              turnText.innerHTML = "Opponent's turn";
              lobbyDiv.hidden = true;
              playAreaDiv.hidden = false;
              setInterval(monitorNoJokersPile, 2000);
            });
        });
    });
});

createLobbyButton.addEventListener("click", function () {
  handHTML.replaceChildren();
  fetch(`https://deckofcardsapi.com/api/deck/new/?jokers_enabled=true`)
    .then((response) => response.json())
    .then((array) => {
      startingHandSize = handSizeInput.value;
      deckID = array.deck_id;
      createdLobbyCode.innerHTML = `Lobby created with code: ${deckID}`;
      fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=54`)
        .then((response) => response.json())
        .then((array) => {
          fetch(
            `https://deckofcardsapi.com/api/deck/${deckID}/pile/no_jokers/add/?cards=X1,X2`,
          )
            .then((response) => response.json())
            .then((array) => {
              fetch(
                `https://deckofcardsapi.com/api/deck/${deckID}/pile/jokers/add/?cards=X1,X2`,
              )
                .then((response) => response.json())
                .then((array) => {
                  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/return`)
                    .then((response) => response.json())
                    .then((array) => {
                      fetch(
                        `https://deckofcardsapi.com/api/deck/${deckID}/shuffle/?remaining=true`,
                      ).then((response) => {
                        fetch(
                          `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${startingHandSize}`,
                        )
                          .then((response) => response.json())
                          .then((array) => {
                            array.cards.forEach((e) => {
                              hand.push(e.code);
                              let img = document.createElement("img");
                              img.src = `https://deckofcardsapi.com/static/img/${e.code}.png`;
                              img.code = e.code;
                              img.onclick = (img) => {
                                playCard(img);
                              };
                              img.width = 169;
                              handHTML.appendChild(img);
                            });
                            setInterval(monitorNoJokersPile, 2000);
                          });
                      });
                    });
                });
            });
        });
    });
});
function monitorNoJokersPile() {
  if (deckID == null || myTurn == 1) return;
  if (hold > 0) {
    hold -= 1;
    return;
  }
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/no_jokers/list`)
    .then((response) => response.json())
    .then((array) => {
      if (array.piles.jokers.remaining == 0) {
        turnText.innerHTML = "Opponent wins";
        myTurn = 1;
        return;
      }
      let nextTurn = array.piles.no_jokers.remaining;
      if (nextTurn) {
        turnText.innerHTML = "Your turn";
        fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/table/list`)
          .then((response) => response.json())
          .then((array) => {
            if (!array.piles.table) return;
            pileCard.src = `https://deckofcardsapi.com/static/img/${array.piles.table.cards[array.piles.table.cards.length - 1].code}.png`;
          });
        lobbyDiv.hidden = true;
        playAreaDiv.hidden = false;
        myTurn = 1;
        fetch(
          `https://deckofcardsapi.com/api/deck/${deckID}/pile/jokers/add/?cards=X1`,
        );
      }
    });
}

// checkTurnButton.addEventListener("click", monitorNoJokersPile);
