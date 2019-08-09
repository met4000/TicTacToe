/*
 * MAIN.JS
 * 
 * Javascript functions and executable code for 'Ultimate Tic Tac Toe'.
 * See www.github.com/met4000/TicTacToe for development of this.
 * 
 */

// Defualt X and O ascii art - TODO: make Symbol object which has both small and large version of art
playerSymbols = {
	X: ["      ", "  \\\/  ", "  \/\\  "],

	O: [
		"  __  ",
		" |  | ",
		" |__| "
	]
};

class Player {
	constructor(symbol) {
		if (!(symbol instanceof Array) || symbol.length != 3 || !symbol.every(v => typeof v == "string" && v.length <= 6))
			throw new Error("Invalid Symbol used to construct Player: " + symbol);

		this.symbol = symbol;
	}
}

class Game {
	constructor(player1 = new Player(playerSymbols.X), player2 = new Player(playerSymbols.O)) {
		// this.version = "1.3.0";
		this.winner = undefined;

		this.board = (new Array(3)).fill((new Array(3)).fill({
			winner: undefined,
			cell: (new Array(3)).fill((new Array(3)).fill(undefined))
		}));

		this.players = [player1, player2];

		this.active = {
			playerID: 0,		// Active player ID - either 0 or 1
			board: [1, 1],	// Starts in the centre
			toggle: function () { return this.playerID = !this.playerID + 0; }
		};

		// Construct the board
		for (var a = 0; a < 3; a++) {
			for (var z = 0; z < 3; z++) {
				document.getElementById("board").innerHTML += "<div id=\"board" + a + "_" + z + "\" style=\"display: inline-block;\"></div>";
				var board = "document.getElementById('board" + a + "_" + z + "')";
				
				eval(board + ".innerHTML += '<span class=\"boardButton" + a + "_" + z + "_0_0\">______</span>_'");
				eval(board + ".innerHTML += '<span class=\"boardButton" + a + "_" + z + "_0_1\">______</span>_'");
				eval(board + ".innerHTML += '<span class=\"boardButton" + a + "_" + z + "_0_2\">______</span><br>'");
				
				for (var o = 0; o < 3; o++) {
					for (var i = 0; i < 3; i++) {
						eval(board + ".innerHTML += '|'");
						for (var n = 0; n < 3; n++) {
							eval(board + ".innerHTML += '<span class=\"boardButton" + a + "_" + z + "_" + o + "_" + n + "\">      </span>|'");
						}
						eval(board + ".innerHTML += '<br>'");
					}
					eval(board + ".innerHTML += '|'");
					for (var n = 0; n < 3; n++) {
						eval(board + ".innerHTML += '<span class=\"boardButton" + a + "_" + z + "_" + (o > 1 ? 2 : o + 1) + "_" + n + "\">______</span>|'");
					}
					eval(board + ".innerHTML += '<br>'");
				}
			}
			document.getElementById("board").innerHTML += "<br>";
		}
		
		//Load eventListener
		for (var a = 0; a < 3; a++) {
			for (var z = 0; z < 3; z++) {
				for (var y = 0; y < 3; y++) {
					for (var x = 0; x < 3; x++) {
						for (var i = 1, buttons = document.getElementsByClassName("boardButton" + a + "_" + z + "_" + y + "_" + x); i < 4; i++) {
							buttons[i].addEventListener("click", function(){buttonOnClick(this);});
						}
					}
				}
			}
		}
		
		// Add version tag
		// document.getElementById("version").innerHTML = "v" + this.version;
	}
}

// Document OnLoad Trigger
onload = function () {
	game = new Game();
	
	//Update active board colour
	updateColourEntire();
};


/*
 * void buttonOnClick(e)
 * e - The span element this is executed from ('this')
 */
function buttonOnClick(e) {
	var z = parseInt(e.className.charAt(13)),
			a = parseInt(e.className.charAt(11)),
			x = parseInt(e.className.charAt(17)),
			y = parseInt(e.className.charAt(15));


	// Active board test
	if (game.active.board.length)
		if (z != game.active.board[0] || a != game.active.board[1])
			return false;

	// Overwriting test
	if (game.board[z][a].cell[x][y])
		return false;

	
	if (!setCell(x, y, z, a, game.active.playerID))
		return false;
	

	game.active.toggle();

	updateWinner(z, a);
	updateWinnerEntire();

	updateActive(x, y);

	updateColourEntire();
}


/*
 * bool setCell(x, y, z, a, playerID)
 * x - The x location of the box
 * y - The y location of the box
 * z - The z location of the box
 * a - The a location of the box
 * playerID - The playerID to set as the owner of the square
 * 
 * return - Whether the cell was set successfully
 */
function setCell(x, y, z, a, playerID) {
	// Only check if the inputs are valid/usefull - 'admin level' cell set command

	if (!!game.board[z][a].winner)
		return false;

	if (!!playerID + 0 !== playerID)	// must be either 0 or 1
		return false;
	
	game.board[z][a].cell[x][y] = playerID;

	// TODO - move to render board function
	for (var i = 0, buttons = document.getElementsByClassName("boardButton" + a + "_" + z + "_" + y + "_" + x); i < 3; i++) {
		buttons[i + 1].innerHTML = game.players[playerID].symbol[i];
	}

	return true;
}

/*
 * void updateActive
 */
function updateActive(x, y) {
	game.active.board = !game.board[x][y].winner ? [x, y] : [];
}

/*
 * void updateWinner(z, a)
 * z - The z location of the board
 * a - The a location of the board
 */
function updateWinner(z, a) {
	if (!!game.board[z][a].winner)
		return false;

	var board = game.board[z][a].cell, win = undefined;
	
	search: {
		//Vertical
		for (var i = 0; i < 2; i++) {
			var f = board[i][0];
			if (board[i].every(v => v == f)) {
				win = f;
				break search;
			}
		}
		
		//Horizontal
		for (var i = 0; i < 2; i++) {
			var f = board[0][i];
			if (board.every(v => v[i] == f)) {
				win = f;
				break search;
			}
		}
		
		//Diagonal
		var f = board[1][1];
		if (board.every((v, i) => v[i] == f) || board.every((v, i) => v[2 - i] == f)) {
			win = f;
			break search;
		}
	}
	
	game.board[z][a].winner = win;

	// TODO - move to render board function
	if (!!win) {
		document.getElementById("board" + a + "_" + z).innerHTML = win == 0 ? "____________________<br>|                    |<br>|     \\        /     |<br>|      \\      /      |<br>|       \\    /       |<br>|        \\  /        |<br>|         \\/         |<br>|         /\\         |<br>|        /  \\        |<br>|       /    \\       |<br>|      /      \\      |<br>|     /        \\     |<br>|____________________|" : (win == 1 ? "____________________<br>|    ____________    |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |____________|   |<br>|____________________|" : document.getElementById("board" + a + "_" + z).innerHTML);
		//alert("Player " + (win + 1) + " has won board " + (3 * parseInt(a) + parseInt(z)) + "!");
	}
}

/*
 * void updateWinnerEntire()
 */
function updateWinnerEntire() {
	if (!!game.winner)
		return false;
	var board = game.board, win = undefined;
	
	//Vertical
	if (board[0][0].winner == board[0][1].winner && board[0][0].winner == board[0][2].winner)
		win = board[0][0].winner;
	else if (board[1][0].winner == board[1][1].winner && board[1][0].winner == board[1][2].winner)
		win = board[1][0].winner;
	else if (board[2][0].winner == board[2][1].winner && board[2][0].winner == board[2][2].winner)
		win = board[2][0].winner;
	
	//Horizontal
	else if (board[0][0].winner == board[1][0].winner && board[0][0].winner == board[2][0].winner)
		win = board[0][0].winner;
	else if (board[0][1].winner == board[1][1].winner && board[0][1].winner == board[2][1].winner)
		win = board[0][1].winner;
	else if (board[0][2].winner == board[1][2].winner && board[0][2].winner == board[2][2].winner)
		win = board[0][2].winner;
	
	//Diagonal
	else if (board[0][0].winner == board[1][1].winner && board[0][0].winner == board[2][2].winner)
		win = board[0][0].winner;
	else if (board[2][0].winner == board[1][1].winner && board[2][0].winner == board[0][2].winner)
		win = board[2][0].winner;
	
	game.winner = win;
	if (!!win)
		alert("Player " + (win + 1) + " has won the game!");
}

/*
 * void updateColourEntire()
 */
function updateColourEntire() {
	for (var z = 0; z < 3; z++) {
		for (var a = 0; a < 3; a++) {
			if (game.board[z][a].winner != undefined || (game.active.board.length && (z != game.active.board[0] || a != game.active.board[1])))
				document.getElementById("board" + a + "_" + z).style.color = "#B0B0B0";
			else	// else if (!game.active.board.length || (z == game.active.board[0] && a == game.active.board[1]))
				document.getElementById("board" + a + "_" + z).style.color = "#000000";
		}
	}
}
