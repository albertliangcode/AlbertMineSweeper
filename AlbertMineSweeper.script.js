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
 * Game ends when the only unvisited cells are cells where mine==true AND all mines are unvisited and flagged.
 */


/***Cell Class***/
function Cell() {
	this.mine = false;
	this.flag = false;
	this.visited = false;
	this.risk = 0;
}


function Grid(numRow, numCol, numMines) {
	this.numRow = numRow;
	this.numCol = numCol;
	this.numMines = numMines;
	
	this.cells = [];
	for(var i = 0; i < this.numRow; i++) {
		this.cells[i] = [];
		for(var j = 0; j < this.numCol; j++) {
			this.cells[i][j] = new Cell();
		}
	} 

	// Seed mines randomly in grid, adds them to minedCells[] and calculate each cell's risk
	for(var c = 0; c < numMines; c++) {
		var a = Math.floor(this.numRow * Math.random());
		var b = Math.floor(this.numCol * Math.random());
		if (this.cells[a][b].mine === true) {
			c--;
			continue;
		}
		this.cells[a][b].mine = true;
		for(var i = -1; i <= 1; i++) {
			for(var j = -1; j <= 1; j++) {
				var isInsideGrid = (a + i >= 0 && b + j >= 0 && a + i < this.numRow && b + j < this.numCol);
				if(isInsideGrid && !(i === 0 && j === 0)) {
					this.cells[a + i][b + j].risk += 1;
				}
			}
		}
	}

	this.print = function() {
		var report = [];
		for(var i = 0; i < this.numRow; i++) {
			report[i] = [];
			for(var j = 0; j < this.numCol; j++) {
				// You can modify to check .visited first, if unvisited, display '#'.  This "hides" the grid, like in normal play.
				if(this.cells[i][j].mine) {
					report[i][j] = "!!!";
				} else if(this.cells[i][j].visited) {
					report[i][j] = '**' + this.cells[i][j].risk.toString() + '**';
				} else {
					report[i][j] = this.cells[i][j].risk.toString();
				}
				// Flags handled separately, as they display independent of .visited, .mine, or .risk.
				if(this.cells[i][j].flag) {
					report[i][j] = '@' + report[i][j] + '@';
				}
			}
		} 

		// DEBUG ONLY
		console.table(report);

		return report;
	};

	this.stomp = function(row, col) {
		if(row >= 0 && col >= 0 && row < this.numRow && col < this.numCol && !this.cells[row][col].visited && !this.cells[row][col].flag) {
			this.cells[row][col].visited = true;
			if (this.cells[row][col].mine === true) {
				return true;
			} else if (this.cells[row][col].risk === 0) {
				for(var i = -1; i <= 1; i++) {
					for(var j = -1; j <= 1; j++) {
						if(!(i === 0 && j === 0)) {
							this.stomp(row + i, col + j);
						} 
					}
				}
			}
		}
		return false;
	};

	// Returns true if cell is flaggable and has been flagged
	// Returns false if cell cannot be flagged
	this.setFlag = function(row, col) {
		if(!this.cells[row][col].visited) {
			this.cells[row][col].flag = !this.cells[row][col].flag;
			return true;
		} else {
			return false;
		}
	};

	this.winCheck = function() {
		var cell;
		for(var i = 0; i < this.numRow; i++) {
			for(var j = 0; j < this.numCol; j++) {
				cell = this.cells[i][j];
				if(!cell.visited && !cell.mine) {
					return false;
				}
				if(cell.mine && !cell.flag) {
					return false;
				}
			}
		}
		return true;
	};
}


/**
    * A curry helper method that captures the target cell location
    * in a closure to be used later by the callback(row, column).
    * The curried method will invoke the callback for each surrounding cell
    * that is inside the grid.
    * @param  {number}  row    -
    * @param  {number}  col    - 
    * @param  {number}  maxRow - 
    * @param  {number}  maxCol - 
    * @return {Boolean}        - 
    */
   function forEachSurroudingCell (row, col, maxRow, maxCol) {
     /**
      * Performs the callback for each cell that is inside the grid
      * @param  {Function} callback - takes optional (row, column) arguments
      */
     return function (callback) {
       var isInsideGrid = false;
       for(var i = -1; i <= 1; i++) {
         for(var j = -1; j <= 1; j++) {
           isInsideGrid = (row + i >= 0 && col + j >= 0 && row + i < maxRow && col + j < maxCol);
           if(isInsideGrid && !(i === 0 && j === 0)) {
             callback(row + i, col + j);
           }
         }
       }
     }
   }

