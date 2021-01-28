// Get data from database about custom match
export function gamePlay(game_link, end_link, gameType) {
  let url = "/accounts/player/".concat(game_link, "/");
  fetch(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const playAgain = document.getElementById("play-again");
      const roundNum = document.getElementById("round-num");
      const userWins = document.getElementById("user-wins");
      const computerWins = document.getElementById("computer-wins");
      const playerImg = document.getElementById("player-img");
      const compImg = document.getElementById("comp-img");
      const parent = document.getElementById("btn-group");
      //   if (data["discard-option"] != "") {
      //     parent.removeChild(
      //       document.getElementById(data["discard-option"].toLowerCase())
      //     );
      //  }
      // See which options are active
      const options = ["Rock", "Papper", "Scissors"];
      const btns = [];

      // Add active options to btns array
      for (let i = 0; i < parent.children.length; i++) {
        if (options.includes(parent.children[i].value)) {
          btns.push(
            document.getElementById(
              parent.children[i].value.toLocaleLowerCase()
            )
          );
        }
      }

      let game_table = {
        Rock: [0, 2, 1],
        Papper: [1, 0, 2],
        Scissors: [2, 1, 0],
      };

      // Check game type and limit computer options if needed
      let computer_table = {};
      let computer_options = [];

      if (gameType == "regular") {
        computer_table = { 0: "Rock", 1: "Papper", 2: "Scissors" };
        computer_options = [0, 1, 2];
      } else {
        // Dinamicaly crate computer table if computer doesn't have all options
        for (let i = 0; i < options.length; i++) {
          if (options[i] != data["discard-option"]) {
            computer_table[i] = options[i];
          }
        }

        // Limit columns from which can computer choose in game_table
        switch (data["discard-option"]) {
          case "Rock":
            computer_options = [1, 2];
            break;
          case "Papper":
            computer_options = [0, 2];
            break;
          case "Scissors":
            computer_options = [0, 1];
            break;
          default:
            computer_options = [0, 1, 2]; // If no radiobutton is selected
            break;
        }
      }

      // get number of rounds
      let round_count = 0;
      let round_number = data["round-number"];
      let computer_wins = 0;
      let player_wins = 0;

      // game score obj
      const game_score = {
        0: () => {},
        1: () => {
          player_wins++;
        },
        2: () => {
          computer_wins++;
        },
      };

      // Add event listeners to all active buttons
      for (let btn of btns) {
        btn.addEventListener("click", (e) => {
          round(
            e,
            round_number,
            end_link,
            computer_table,
            computer_options,
            game_table
          );
        });
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
      }

      //From Django documentation: getting cookies
      function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
          const cookies = document.cookie.split(";");
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + "=") {
              cookieValue = decodeURIComponent(
                cookie.substring(name.length + 1)
              );
              break;
            }
          }
        }
        return cookieValue;
      }

      // Function for sending data to the page view
      // This allows us to updated database without
      // reloading a page
      function sendData(data, link) {
        let url = "/accounts/player/".concat(link, "/");
        let csrftoken = getCookie("csrftoken");
        fetch(url, {
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
      function winner(link) {
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
        sendData(data, link); // alter database
      }

      // Round function
      function round(
        e,
        round_number,
        end_link,
        computer_table,
        computer_options,
        game_table
      ) {
        if (round_count == round_number) {
          winner(end_link);
          resetGame();
        } else {
          round_count++;

          let comp_choice =
            computer_options[
              Math.floor(Math.random() * computer_options.length)
            ];
          let user_choice = e.target.value;
          let res = game_table[user_choice][comp_choice];
          console.log(computer_table, comp_choice);
          let srcPlayer = `http://localhost:8000/static/player/images/${user_choice}_player.png`;
          let srcComputer = `http://localhost:8000/static/player/images/${computer_table[comp_choice]}_comp.png`;

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
    });
}
