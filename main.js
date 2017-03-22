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
game.version = "1.0.1";
game.board = {};
for (var z = 0; z < 1; z++) {
	game.board[z] = {};
	for (var a = 0; a < 1; a++) {
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
	for (var a = 0; a < 1; a++) {
		for (var z = 0; z < 1; z++) {
			for (var y = 0; y < 3; y++) {
				for (var x = 0; x < 3; x++) {
					for (var i = 1, buttons = document.getElementsByClassName("boardButton" + a + "_" + z + "_" + y + "_" + x); i < 4; i++) {
						buttons[i].addEventListener("click", function(){updateInner(this.className.charAt(17), this.className.charAt(15), this.className.charAt(13), this.className.charAt(11), game.active.symbol); game.active.toggle(); updateWinner(this.className.charAt(13), this.className.charAt(11));});
					}
				}
			}
		}
	}
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
	if (!(value.toLowerCase() == 'x' || value.toLowerCase() == 'o'))
		return false;
	for (var i = 1, buttons = document.getElementsByClassName("boardButton" + a + "_" + z + "_" + y + "_" + x); i < 4; i++) {
		buttons[i].innerHTML = valueArr[value.toLowerCase()][i];
		game.board[z][a].data.locations[x][y] = value.toLowerCase();
	}
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
}