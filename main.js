/*
 * MAIN.JS
 * 
 * Javascript functions and executable code for 'Ultimate Tic Tac Toe'.
 * See www.github.com/met4000/TicTacToe for development of this.
 * 
 */

/*
 * Contains all data for the game
 */
game = {};
game.version = "1.2.1";
game.winner = "";
game.board = {};
game.board.z = 3;
game.board.a = 3;
for (var z = 0; z < game.board.z; z++) {
	game.board[z] = {};
	for (var a = 0; a < game.board.a; a++) {
		game.board[z][a] = {};
		game.board[z][a].data = {};
		game.board[z][a].data.locations = {};
		for (var x = 0; x < 3; x++) {
			game.board[z][a].data.locations[x] = {};
			for (var y = 0; y < 3; y++) {
				game.board[z][a].data.locations[x][y] = "";
			}
		}
		game.board[z][a].data.winner = "";
	}
}
game.active = {};
game.active.symbol = 'x';
game.active.board = Math.floor(game.board.a / 2) * game.board.z + Math.floor(game.board.z / 2);
game.active.toggle = function () {
	if (this.symbol.toLowerCase() == 'x')
		this.symbol = 'o';
	else if (this.symbol.toLowerCase() == 'o')
		this.symbol = 'x';
};

// Contains a table of the X and O ascii values
valueArr = {};
valueArr.x = ["______", "      ", "  \\\/  ", "  \/\\  ", "______"];
valueArr.o = ["______", "  __  ", " |  | ", " |__| ", "______"];

onload = function () {
	//Document Load Trigger
	
	//Create Board
	for (var a = 0; a < game.board.a; a++) {
		for (var z = 0; z < game.board.z; z++) {
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
	for (var a = 0; a < game.board.a; a++) {
		for (var z = 0; z < game.board.z; z++) {
			for (var y = 0; y < 3; y++) {
				for (var x = 0; x < 3; x++) {
					for (var i = 1, buttons = document.getElementsByClassName("boardButton" + a + "_" + z + "_" + y + "_" + x); i < 4; i++) {
						buttons[i].addEventListener("click", function(){buttonOnClick(this);});
					}
				}
			}
		}
	}
	
	//Update active board colour
	updateColourEntire();
	
	//Add version tag
	document.getElementById("version").innerHTML = "v" + game.version;
};

/*
 * void updateInner(x, y, z, a, value)
 * x - The x location of the box
 * y - The y location of the box
 * z - The z location of the box
 * a - The a location of the box
 * value - The value to change the box to: 'x', 'X', 'o', 'O'
 */
function updateInner(x, y, z, a, value) {
	if (!!game.board[z][a].data.winner)
		return false;
	if (game.board.z * parseInt(a) + parseInt(z) != game.active.board && game.active.board != '*')
		return false;
	if (!(value.toLowerCase() == 'x' || value.toLowerCase() == 'o'))
		return false;
	if (game.board[z][a].data.locations[x][y] != '')
			return false;
	
	game.board[z][a].data.locations[x][y] = value.toLowerCase();
	for (var i = 1, buttons = document.getElementsByClassName("boardButton" + a + "_" + z + "_" + y + "_" + x); i < 4; i++) {
		buttons[i].innerHTML = valueArr[value.toLowerCase()][i];
	}
	updateActive(x, y);
}

/*
 * void updateActive
 */
function updateActive(x, y) {
	game.active.board = 3 * parseInt(y) + parseInt(x);
	if (!!game.board[x][y].data.winner)
		game.active.board = '*';
}

/*
 * bool same(a, b, ...)
 * a - First value to compare
 * b - Second value to compare
 * ... - ...
 * return - If all the values are identical
 * 
 * NB: Values are converted to lowercase before being compared
 */
function same(a, b) {
	if (arguments.length < 2)
		return arguments.length == 1;
	for (var i = 1; i < arguments.length; i++)
		if (arguments[0].toLowerCase() != arguments[i].toLowerCase() || !arguments[i])
			return false;
	return true;
}

/*
 * void updateWinner(z, a)
 * z - The z location of the board
 * a - The a location of the board
 */
function updateWinner(z, a) {
	if (!!game.board[z][a].data.winner)
		return false;
	var board = game.board[z][a].data.locations, win = '';
	
	//Vertical
	if (same(board[0][0], board[0][1], board[0][2]))
		win = board[0][0].toLowerCase();
	else if (same(board[1][0], board[1][1], board[1][2]))
		win = board[1][0].toLowerCase();
	else if (same(board[2][0], board[2][1], board[2][2]))
		win = board[2][0].toLowerCase();
	
	//Horizontal
	else if (same(board[0][0], board[1][0], board[2][0]))
		win = board[0][0].toLowerCase();
	else if (same(board[0][1], board[1][1], board[2][1]))
		win = board[0][1].toLowerCase();
	else if (same(board[0][2], board[1][2], board[2][2]))
		win = board[0][2].toLowerCase();
	
	//Diagonal
	else if (same(board[0][0], board[1][1], board[2][2]))
		win = board[0][0].toLowerCase();
	else if (same(board[2][0], board[1][1], board[0][2]))
		win = board[2][0].toLowerCase();
	
	game.board[z][a].data.winner = win;
	if (!!win) {
		document.getElementById("board" + a + "_" + z).innerHTML = win == 'x' ? "____________________<br>|                    |<br>|     \\        /     |<br>|      \\      /      |<br>|       \\    /       |<br>|        \\  /        |<br>|         \\/         |<br>|         /\\         |<br>|        /  \\        |<br>|       /    \\       |<br>|      /      \\      |<br>|     /        \\     |<br>|____________________|" : (win == 'o' ? "____________________<br>|    ____________    |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |            |   |<br>|   |____________|   |<br>|____________________|" : document.getElementById("board" + a + "_" + z).innerHTML);
		//alert("Player " + (win == 'x' ? 1 : (win == 'o' ? 2 : 'ERR')) + " has won board " + (game.board.z * parseInt(a) + parseInt(z)) + "!");
	}
}

/*
 * void updateWinnerEntire()
 */
function updateWinnerEntire() {
	if (!!game.winner)
		return false;
	var board = game.board, win = '';
	
	//Vertical
	if (same(board[0][0].data.winner, board[0][1].data.winner, board[0][2].data.winner))
		win = board[0][0].data.winner;
	else if (same(board[1][0].data.winner, board[1][1].data.winner, board[1][2].data.winner))
		win = board[1][0].data.winner;
	else if (same(board[2][0].data.winner, board[2][1].data.winner, board[2][2].data.winner))
		win = board[2][0].data.winner;
	
	//Horizontal
	else if (same(board[0][0].data.winner, board[1][0].data.winner, board[2][0].data.winner))
		win = board[0][0].data.winner;
	else if (same(board[0][1].data.winner, board[1][1].data.winner, board[2][1].data.winner))
		win = board[0][1].data.winner;
	else if (same(board[0][2].data.winner, board[1][2].data.winner, board[2][2].data.winner))
		win = board[0][2].data.winner;
	
	//Diagonal
	else if (same(board[0][0].data.winner, board[1][1].data.winner, board[2][2].data.winner))
		win = board[0][0].data.winner;
	else if (same(board[2][0].data.winner, board[1][1].data.winner, board[0][2].data.winner))
		win = board[2][0].data.winner;
	
	win = win.toLowerCase();
	game.winner = win;
	if (!!win)
		alert("Player " + (win == 'x' ? 1 : (win == 'o' ? 2 : 'ERR')) + " has won the game!");
}

/*
 * void updateColourEntire()
 */
function updateColourEntire() {
	for (var z = 0; z < game.board.z; z++) {
		for (var a = 0; a < game.board.a; a++) {
			if ((game.board.z * parseInt(a) + parseInt(z) != game.active.board && game.active.board != '*') || (game.active.board == '*' && !!game.board[z][a].data.winner))
				document.getElementById("board" + a + "_" + z).style.color = "#B0B0B0";
			else if (game.board.z * parseInt(a) + parseInt(z) == game.active.board || game.active.board == '*')
				document.getElementById("board" + a + "_" + z).style.color = "#000000";
		}
	}
}

/*
 * void buttonOnClick(e)
 * e - The span element this is executed from ('this')
 */
function buttonOnClick(e) {
	if (game.board.z * parseInt(e.className.charAt(11)) + parseInt(e.className.charAt(13)) != game.active.board && game.active.board != '*')
		return false;
	updateInner(e.className.charAt(17), e.className.charAt(15), e.className.charAt(13), e.className.charAt(11), game.active.symbol);
	game.active.toggle();
	updateWinner(e.className.charAt(13), e.className.charAt(11));
	updateWinnerEntire();
	if (!((!!game.board[e.className.charAt(13)][e.className.charAt(11)].data.winner) && (game.board.z * parseInt(e.className.charAt(11)) + parseInt(e.className.charAt(13)) != game.active.board && game.active.board != '*') && (game.board[e.className.charAt(13)][e.className.charAt(11)].data.locations[e.className.charAt(17)][e.className.charAt(15)] != '')))
		updateActive(e.className.charAt(17), e.className.charAt(15));
	updateColourEntire();
}
