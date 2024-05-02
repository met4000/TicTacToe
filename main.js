/*
 * MAIN.JS
 * 
 * Javascript functions and executable code for 'Ultimate Tic Tac Toe'.
 * See www.github.com/met4000/TicTacToe for development of this.
 * 
 */

// Defualt X and O ascii art - TODO: make Symbol object which has both small and large version of art
class Counter {
	constructor(cell, board) {
		// TODO - Typecheck
		// if (!(symbol instanceof Array) || symbol.length != 3 || !symbol.every(v => typeof v == "string" && v.length <= 6))
		// 	throw new Error("Invalid Symbol used to construct Player: " + symbol);


		this.cell = cell;
		this.board = board;	// need to strip borders
	}
}
defaultCounters = {
	X: new Counter(["      ", "  \\\/  ", "  \/\\  "], ["____________________","|                    |","|     \\        /     |","|      \\      /      |","|       \\    /       |","|        \\  /        |","|         \\/         |","|         /\\         |","|        /  \\        |","|       /    \\       |","|      /      \\      |","|     /        \\     |","|____________________|"]),

	O: new Counter([
		"  __  ",
		" |  | ",
		" |__| "
	], [
		"____________________",
		"|    ____________    |",
		"|   |            |   |",
		"|   |            |   |",
		"|   |            |   |",
		"|   |            |   |",
		"|   |            |   |",
		"|   |            |   |",
		"|   |            |   |",
		"|   |            |   |",
		"|   |            |   |",
		"|   |____________|   |",
		"|____________________|"
	])
};

class Player {
	constructor(counter) {
		if (!(counter instanceof Counter))
			throw new Error("Invalid Counter used to construct Player: " + counter);

		this.counter = counter;
	}
}

class Game {
	constructor(player1 = new Player(defaultCounters.X), player2 = new Player(defaultCounters.O)) {
		// this.version = "1.3.0";
		this.winner = undefined;

		this.board = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => ({
			winner: undefined,
			cell: Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => undefined))
		})));

		this.players = [player1, player2];

		this.active = {
			playerID: 0,		// Active player ID - either 0 or 1
			board: [1, 1],	// Starts in the centre
			toggle: function () { return this.playerID = !this.playerID + 0; }
		};

		// Construct the board
		for (var a = 0; a < 3; a++) {
			for (var z = 0; z < 3; z++) {
				document.getElementById("board").innerHTML += "<div class=\"board a" + a + " z" + z + "\" style=\"display: inline-block;\"></div>";	// should move style to stylesheet
				var board = document.getElementsByClassName("board a" + a + " z" + z)[0];
				
				board.innerHTML += "<span class=\"boardButton a" + a + " z" + z + " y0 x0\">______</span>_"
				board.innerHTML += "<span class=\"boardButton a" + a + " z" + z + " y0 x1\">______</span>_";
				board.innerHTML += "<span class=\"boardButton a" + a + " z" + z + " y0 x2\">______</span><br>";
				
				for (var o = 0; o < 3; o++) {
					for (var i = 0; i < 3; i++) {
						board.innerHTML += "|";
						for (var n = 0; n < 3; n++) {
							board.innerHTML += "<span class=\"boardButton a" + a + " z" + z + " y" + o + " x" + n + "\">      </span>|";
						}
						board.innerHTML += "<br>";
					}
					board.innerHTML += "|";
					for (var n = 0; n < 3; n++) {
						board.innerHTML += "<span class=\"boardButton a" + a + " z" + z + " y" + o + " x" + n + "\">______</span>|";
					}
					board.innerHTML += "<br>";
				}
			}
			document.getElementById("board").innerHTML += "<br>";
		}
		
		// Load eventListener
		var buttons = Array.from(document.getElementsByClassName("boardButton"));
		for (var i in buttons) buttons[i].addEventListener("click", (e) => buttonOnClick(e.target));
		
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


String.prototype.parseClassName = function (v) { return parseInt(new RegExp("\\s" + v + "(\\d+)\\s").exec(" " + this + " ")[1]); };

/*
 * void buttonOnClick(e)
 * e - The span element this is executed from
 */
function buttonOnClick(e) {
	var z = e.className.parseClassName("z"),
			a = e.className.parseClassName("a"),
			x = e.className.parseClassName("x"),
			y = e.className.parseClassName("y");


	// Active board test
	if (game.active.board.length)
		if (z !== game.active.board[0] || a !== game.active.board[1])
			return false;

	// Overwriting test
	if (game.board[z][a].cell[x][y] !== undefined)
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
	var buttons = Array.from(document.getElementsByClassName("boardButton a" + a + " z" + z + " y" + y + " x" + x));
	for (var i = 0; i < 3; i++) {
		buttons[y ? i : i + 1].innerHTML = game.players[playerID].counter.cell[i];
	}

	return true;
}

/*
 * void updateActive
 */
function updateActive(x, y) {
	game.active.board = game.board[x][y].winner == undefined ? [x, y] : [];
}

/*
 * void updateWinner(z, a)
 * z - The z location of the board
 * a - The a location of the board
 */
function updateWinner(z, a) {
	if (game.board[z][a].winner != undefined)
		return false;

	var board = game.board[z][a].cell, win = undefined;
	
	search: {
		//Vertical
		for (var i = 0; i < 3; i++) {
			var f = board[i][0];
			if (f == undefined) continue;

			if (board[i].every(v => v == f)) {
				win = f;
				break search;
			}
		}
		
		//Horizontal
		for (var i = 0; i < 3; i++) {
			var f = board[0][i];
			if (f == undefined) continue;

			if (board.every(v => v[i] == f)) {
				win = f;
				break search;
			}
		}
		
		//Diagonal
		var f = board[1][1];
		if (f == undefined) break search;

		if (board.every((v, i) => v[i] == f) || board.every((v, i) => v[2 - i] == f)) {
			win = f;
			break search;
		}
	}
	
	game.board[z][a].winner = win;

	// TODO - move to render board function
	if (win != undefined) {
		document.getElementsByClassName("board a" + a + " z" + z)[0].innerHTML = game.players[win].counter.board.join("<br>");	// : document.getElementById("board" + a + "_" + z).innerHTML);
		//alert("Player " + (win + 1) + " has won board " + (3 * parseInt(a) + parseInt(z)) + "!");
	}
}

/*
 * void updateWinnerEntire()
 */
function updateWinnerEntire() {
	if (game.winner != undefined)
		return false;
	
	var board = game.board, win = undefined;
	
	//Vertical
	if (board[0][0].winner == board[0][1].winner && board[0][0].winner == board[0][2].winner && board[0][0].winner != undefined)
		win = board[0][0].winner;
	else if (board[1][0].winner == board[1][1].winner && board[1][0].winner == board[1][2].winner && board[1][0].winner != undefined)
		win = board[1][0].winner;
	else if (board[2][0].winner == board[2][1].winner && board[2][0].winner == board[2][2].winner && board[2][0].winner != undefined)
		win = board[2][0].winner;
	
	//Horizontal
	else if (board[0][0].winner == board[1][0].winner && board[0][0].winner == board[2][0].winner && board[0][0].winner != undefined)
		win = board[0][0].winner;
	else if (board[0][1].winner == board[1][1].winner && board[0][1].winner == board[2][1].winner && board[0][1].winner != undefined)
		win = board[0][1].winner;
	else if (board[0][2].winner == board[1][2].winner && board[0][2].winner == board[2][2].winner && board[0][2].winner != undefined)
		win = board[0][2].winner;
	
	//Diagonal
	else if (board[0][0].winner == board[1][1].winner && board[0][0].winner == board[2][2].winner && board[0][0].winner != undefined)
		win = board[0][0].winner;
	else if (board[2][0].winner == board[1][1].winner && board[2][0].winner == board[0][2].winner && board[2][0].winner != undefined)
		win = board[2][0].winner;
	
	game.winner = win;
	if (win != undefined)
		alert("Player " + (win + 1) + " has won the game!");
}

/*
 * void updateColourEntire()
 */
function updateColourEntire() {
	var boards = document.getElementsByClassName("board")
	for (var i in Array.from(boards))
		boards[i].style.color = "#000000";

	for (var z = 0; z < 3; z++) {
		for (var a = 0; a < 3; a++) {
			if (game.board[z][a].winner != undefined || (game.active.board.length && (z != game.active.board[0] || a != game.active.board[1])))
				document.getElementsByClassName("a" + a + " z" + z)[0].style.color = "#B0B0B0";
			// else	// else if (!game.active.board.length || (z == game.active.board[0] && a == game.active.board[1]))
			// 	document.getElementsByClassName("a" + a + " z" + z)[0].style.color = "#000000";
		}
	}
}
