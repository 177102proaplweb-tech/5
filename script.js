// const example = document.getElementById('example')
// const answer = document.getElementById('answer')
// const capital = document.getElementById('capital')
// example.addEventListener("click", function() {
//   let cap = capital.value
//   if (cap == "") cap = "Warsaw"
//   let table = document.createElement('table')
//   table.innerHTML = "<tr><th>Name</th><th>Capital</th><th>Population</th><th>Region</th><th>Subregion</th></tr>"
//   fetch(`https://restcountries.com/v3.1/capital/${cap}`)
//     .then(response => response.json())
//     .then(array => {
//       console.log(array)
//       for (let i = 0; i < array.length; i++) {
//         let item = document.createElement('tr')
//         item.innerHTML = `<td>${array[i].name.common}</td><td>${array[i].capital[0]}</td><td>${array[i].population}</td><td>${array[i].region}</td><td>${array[i].subregion}</td>`
//         table.appendChild(item)
//         // console.log("userID:", array[i].userId + ".", "id:", array[i].id + '.', "title:", array[i].title + '.')
//       }
//     })
//   answer.innerHTML = ""
//   answer.appendChild(table)
// })

const createLobbyButton = document.getElementById("createLobby");
const createdLobbyCode = document.getElementById("createdLobbyCode");
// const checkTurnButton = document.getElementById("checkTurn");
const lobbyDiv = document.getElementById("lobbyDiv");
const playAreaDiv = document.getElementById("playAreaDiv");
const tableCard = document.getElementById("tableCard");
const pileCard = document.getElementById("pileCard");

const joinLobbyButton = document.getElementById("joinLobby");
// const passTurnButton = document.getElementById("passTurn");
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
      hold = 1;
      console.log("Moved joker");
      console.log(array);
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
      endTurn();
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
        // TODO: reshuffle cards

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

// passTurnButton.addEventListener("click", function () {
//   if (deckID == null || myTurn == 0) return;
//   console.log("Passing turn");
//   fetch(
//     `https://deckofcardsapi.com/api/deck/${deckID}/pile/no_jokers/add/?cards=X1`,
//   )
//     .then((response) => response.json())
//     .then((array) => {
//       myTurn = 0;
//       console.log("Moved joker");
//       console.log(array);
//     });
// });

joinLobbyButton.addEventListener("click", function () {
  deckID = joinLobbyCode.value;
  handHTML.replaceChildren();
  if (deckID == "") return;
  console.log("Joining lobby with ID:", deckID);
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/shuffle/?remaining=true`)
    .then((response) => response.json())
    .then((array) => {
      console.log(array);
      if (!array.success) {
        console.log("Wrong lobby code!");
        return;
      }
      startingHandSize = 52 - array.remaining;
      console.log("Joined lobby with hand size", startingHandSize);
      fetch(
        `https://deckofcardsapi.com/api/deck/${deckID}/pile/no_jokers/add/?cards=X1`,
      )
        .then((response) => response.json())
        .then((array) => {
          console.log("Moved joker");
          console.log(array);
          hold = 1;
          console.log(`Drawing ${startingHandSize} cards`);
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
                  console.log("XDKHJSDXHKCHSK", array);
                  fetch(
                    `https://deckofcardsapi.com/api/deck/${deckID}/pile/table/add/?cards=${array.cards[0].code}`,
                  );
                  pileCard.src = `https://deckofcardsapi.com/static/img/${array.cards[0].code}.png`;
                });
              turnText.innerHTML = "Opponent's turn";
              lobbyDiv.hidden = true;
              playAreaDiv.hidden = false;
              setInterval(monitorNoJokersPile, 1000);
            });
          // console.log(`Drawing ${startingHandSize} cards for both players`);
          // fetch(
          //   `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${startingHandSize}`,
          // )
          //   .then((response) => response.json())
          //   .then((array) => {
          //     let drawnCards = [];
          //     array.cards.forEach((e) => {
          //       drawnCards.push(e.code);
          //     });
          //     fetch(
          //       `https://deckofcardsapi.com/api/deck/${deckID}/pile/p1/add/?cards=${drawnCards.join(',')}`,
          //     );
          //   });
        });
    });
});

createLobbyButton.addEventListener("click", function () {
  handHTML.replaceChildren();
  fetch(`https://deckofcardsapi.com/api/deck/new/?jokers_enabled=true`)
    .then((response) => response.json())
    .then((array) => {
      console.log("Creating new deck");
      startingHandSize = handSizeInput.value;
      console.log(array);
      deckID = array.deck_id;
      createdLobbyCode.innerHTML = `Lobby created with code: ${deckID}`;
      fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=54`)
        .then((response) => response.json())
        .then((array) => {
          console.log("Drawing all cards from deck");
          console.log(array);
          fetch(
            `https://deckofcardsapi.com/api/deck/${deckID}/pile/no_jokers/add/?cards=X1,X2`,
          )
            .then((response) => response.json())
            .then((array) => {
              console.log("Adding jokers to no_jokers pile");
              console.log(array);
              fetch(
                `https://deckofcardsapi.com/api/deck/${deckID}/pile/jokers/add/?cards=X1,X2`,
              )
                .then((response) => response.json())
                .then((array) => {
                  console.log("Moving jokers to jokers pile");
                  console.log(array);
                  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/return`)
                    .then((response) => response.json())
                    .then((array) => {
                      console.log(
                        `Returning other cards to deck, drawing ${startingHandSize} cards and waiting for other player to join`,
                      );
                      console.log(array);
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
                            setInterval(monitorNoJokersPile, 1000);
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
  if (hold == 1) {
    hold = 0;
    return;
  }
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/no_jokers/list`)
    .then((response) => response.json())
    .then((array) => {
      // console.log("Checking no_jokers pile");
      // console.log(array);
      let nextTurn = array.piles.no_jokers.remaining;
      // console.log(nextTurn);
      if (nextTurn) {
        console.log("My turn now!");
        turnText.innerHTML = "Your turn";
        fetch(`https://deckofcardsapi.com/api/deck/${deckID}/pile/table/list`)
          .then((response) => response.json())
          .then((array) => {
            console.log(array);
            if (!array.piles.table) return;
            pileCard.src = `https://deckofcardsapi.com/static/img/${array.piles.table.cards[array.piles.table.cards.length - 1].code}.png`;
          });
        lobbyDiv.hidden = true;
        playAreaDiv.hidden = false;
        myTurn = 1;
        fetch(
          `https://deckofcardsapi.com/api/deck/${deckID}/pile/jokers/add/?cards=X1`,
        )
          .then((response) => response.json())
          .then((array) => {
            console.log("Removed joker");
            console.log(array);
          });
      }
    });
}

// checkTurnButton.addEventListener("click", monitorNoJokersPile);
