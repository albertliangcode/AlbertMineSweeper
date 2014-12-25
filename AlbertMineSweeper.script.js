/* AlbertMineSweeper.script.js
 * Date: 2014-12-25
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
}


/***Initialize Grid***/
var initialize = function() {
  var numRow;
  var numCol;
  var numMines;
  var isInsideGrid;
  var grid;
  var a;
  var b;
  
	// Prompt user until valid input is recieved
	while(true) {
		numRow = prompt("How many rows? (Minimum 5)");
		numCol = prompt("How many columns? (Minimum 5)");
		numMines = prompt("How many mines? (Minimum 1)");
		if (isNaN(numRow) || numRow < 5 || isNaN(numCol) || numCol < 5 || isNaN(numMines) || numMines < 1) {
			alert("Please enter valid numbers for rows, columns, and mines.");
		} else if (numMines >= numRow * numCol - 1) {
			alert("You are in MINESWEEPER'S ROULETTE mode.");
			numMines = numRow * numCol - 1;	//Just for humor.
		} else {
			break;
		}
	}

	// Generate grid of empty Cell Objects
	grid = [];	 		//!!!Should I just create a Grid class to handle isInsideGrid, numRow, numCol, and unvisited Cells? Would need to find some way of overloading '[]'.!!!
	for(var i = 0; i < numRow; i++) {
		grid[i] = [];
		for(var j = 0; j < numCol; j++) {
			grid[i][j] = new Cell();
		}
	} 

	// Seed mines randomly in grid, adds them to minedCells[] and calculate each cell's risk
	for(var c = 0; c < numMines; c++) {
		a = Math.floor(numRow * Math.random());
		b = Math.floor(numCol * Math.random());
		if (grid[a][b].mine === true) {
			c--;
			continue;
		}
		grid[a][b].mine = true;
		for(var i = -1; i <= 1; i++) {
			for(var j = -1; j <= 1; j++) {
				isInsideGrid = (a + i >= 0 && b + j >= 0 && a + i < numRow && b + j < numCol);
				if(isInsideGrid && !(i === 0 && j === 0)) {
					grid[a + i][b + j].risk += 1;
				}
			}
		}
	}
	return grid;
};


/***Game Response Each Time User Clicks a Cell***/
var stomp = function(grid, row, col, numRow, numCol) {
	var isInsideGrid;
	grid[row][col].visited = true;
	//!----->DISPLAY SQUARE<-----!
	if (grid[row][col].mine === true) {
		//!----->GAME OVER<-----!
	} else if (grid[row][col].risk === 0) {
		for(var i = -1; i <= 1; i++) {
			for(var j = -1; j <= 1; j++) {
				isInsideGrid = (a + i >= 0 && b + j >= 0 && a + i < numRow && b + j < numCol);
				if(isInsideGrid && !(i === 0 && j === 0)) {
					stomp(grid, row + i, col + j, numRow, numCol);
				} 
			}
		}
	}
};


/***Check for User Win***/
var winCheck = function(grid) {
	for(var i = 0; i < grid.length; i++) {
		for(var j = 0; j < grid[i].length; j++) {
			if(!grid[i][j].visited && !grid[i][j].mine) {
				return false;
			}
		}
	}
	return true;
};


/***Print Grid***/


var grid = initialize();