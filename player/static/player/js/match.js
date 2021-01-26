//
const rock = document.getElementById("rock");
const papper = document.getElementById("papper");
const scissors = document.getElementById("scissors");
const playAgain = document.getElementById("play-again");
const roundNum = document.getElementById("round-num");
const userWins = document.getElementById("user-wins");
const computerWins = document.getElementById("computer-wins");
const playerImg = document.getElementById("player-img");
const compImg = document.getElementById("comp-img");

//
const btns = [rock, papper, scissors];
const game_table = { Rock: [0, 2, 1], Papper: [1, 0, 2], Scissors: [2, 1, 0] };
const computer_table = { 0: "Rock", 1: "Papper", 2: "Scissors" };

//
let round_count = 0;
let computer_wins = 0;
let player_wins = 0;

//
const game_score = {
  0: () => {},
  1: () => {
    player_wins++;
  },
  2: () => {
    computer_wins++;
  },
};

// Add event listeners to buttons rock, papper, scissors
for (let btn of btns) {
  btn.addEventListener("click", round);
}

// Reset everything
playAgain.addEventListener("click", resetGame);

// Reset function
function resetGame() {
  round_count = 0;
  player_wins = 0;
  computer_wins = 0;
  roundNum.innerHTML = `Round: ${round_count}`;
  userWins.innerHTML = player_wins;
  computerWins.innerHTML = computer_wins;
  for (let btn of btns) {
    btn.addEventListener("click", round);
  }
}

// Django documentation for getting cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Function for sending data to the page view
// This allows us to updated database without
// reloading a page
function sendData(data) {
  let csrftoken = getCookie("csrftoken");
  fetch("/accounts/player/end_match", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(data),
  });
}

// Check winner function
function winner() {
  let data = { win: 0, lose: 0, tie: 0 };

  if (computer_wins == player_wins) {
    alert("It's a TIE");
    data["tie"] = 1;
  } else if (computer_wins > player_wins) {
    alert("Computer wins.");
    data["lose"] = 1;
  } else {
    alert("You win. \n CONGRATULATIONS.");
    data["win"] = 1;
  }
  sendData(data);
}

// Round function
function round(e) {
  if (round_count == 5) {
    e.target.removeEventListener("click", round);
    winner();
    resetGame();
  } else {
    round_count++;

    let comp_choice = Math.floor(Math.random() * 3);
    let user_choice = e.target.value;
    let res = game_table[user_choice][comp_choice];

    let srcPlayer = `http://localhost:8000/static/player/images/${user_choice}_player.png`;
    let srcComputer = `http://localhost:8000/static/player/images/${computer_table[comp_choice]}_player.png`;

    playerImg.setAttribute("src", srcPlayer);
    compImg.setAttribute("src", srcComputer);

    game_score[res]();
    roundNum.innerHTML = `Round: ${round_count}`;
    userWins.innerHTML = player_wins;
    computerWins.innerHTML = computer_wins;

    console.log(
      `Player plays:${e.target.value}. Computer plays ${computer_table[comp_choice]}.`
    );
  }
}
