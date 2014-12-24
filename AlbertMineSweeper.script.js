/* AlbertMineSweeper.script.js
 * Date: 2014-12-23
 * Author: Albert Liang
 * Mentor: Adam Yee
 * 
 * Description:
 * Runs a browser-based Minesweeper game.
 */

/* General Rules:
 * Game takes place on a two-dimensional array (grid), where the dimensions and number of mines are selected by the user. 
 *	- If the number of mines the user chooses is greater than or equal to the number of cells, the game defaults to distributing one mine less than the number of cells,
 *	- leaving only a single safe cell.
 * Each cell holds a Cell obj ect, with properties "mine", "visited", and "risk".
 * When a player clicks on a cell with...
 * 	- mine=true, the game ends.
 * 	- risk!=0, set cell's visited=true;
 * 	- risk==0, the function recursively visits all neighbors with risk==0, stopping when it visits a cell with risk!=0.
 * Game ends when the only unvisited cells are cells where mine==true.
 */


/***Cell Class***/
function Cell() {
	this.mine = false;
	this.visited = false;
	this.risk = 0;
};


/***Initialize Grid***/
var initialize = function() {
	// Prompt user until valid input is recieved
	while(true) {
		var numRow = prompt("How many rows? (Minimum 5)");
		var numCol = prompt("How many columns? (Minimum 5)");
		var numMines = prompt("How many mines? (Minimum 1)");
		if (numRow==NaN || numRow<5 || numCol==NaN || numCol<5 || numMines==NaN || numMines<1) {
			alert("Please enter valid numbers for rows, columns, and mines.");
		} else if (numMines>=numRow*numCol-1) {
			alert("You are in MINESWEEPER'S ROULETTE mode.");
			numMines=numRow*numCol-1;	//Just for humor.
		} else {
			break;
		}
	}

	// Generate grid of empty Cell Objects
	var grid = [];					// !!! Is this correct? !!!
	for(var i = 0; i < numRow; i++) {
		grid[i] = [];
		for(var j = 0; j < numCol; j++) {
			grid[i][j] = new Cell();
		}
	} 

	// Seed mines randomly in grid and calculate each cell's risk
	for(var c = 0; c < numMines; c++) {
		var a = Math.floor(numRow*Math.random());
		var b = Math.floor(numCol*Math.random());
		if (grid[a][b].mine == true) {
			c--;
			continue;
		}
		grid[a][b].mine = true;
		for(var i = -1; i <= 1; i++) {
			for(var j = -1; j <=1; j++) {
				if((a-1>=0 && b-1>=0 && a+1<=numRow && b+1<=numCol) && !(i==0&&j==0)) {
					grid[a+i][b+j].risk+=1;
				}
			}
		}
	}
};


