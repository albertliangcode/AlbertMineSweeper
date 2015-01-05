
/* Called after a WIN or a LOSS.
 * Intended to disconnect the user interface from the game state, 
 * freezing the html and preventing the user from playing the game
 * any further.
 * User would be forced to either quit or refresh the page for
 * a new game.
 * 
 * Current plan: Overlay a Div in front of the board, displaying message. Later, will also provide button to refresh.
 */

var stopGame = function () {
	// $("script:eq(1)").remove();	//#1

	//$("#USER_INTERFACE").remove();	//#2

	//$(document).replace("script", "NOT_A_SCRIPT");	//#3

	// var replaceLoc = $(document.head);	//#4
	// var regExMatch = "script";
	// var replaceWith = "NOT_A_SCRIPT";
	// var result = replaceLoc.replace(regExMatch, replaceWith);
	// $("head").html(result);
};


$(document).ready(function() {
	//Must bind contextmenu event handler to each cell
	//document.oncontextmenu = function() {return false;};
	var grid = new Grid(7,7,5);
	var report = grid.print();
	
	$('.cell').mousedown(function(event) {
		var row = $(this).data('row');
		var col = $(this).data('col');
		//right-click event for flags
		if(event.which === 3) {
			if(grid.setFlag(row,col)) {
				$(this).toggleClass('flagged');
				$(this).html("F");
			}
		}
		//normal-click
		if(event.which === 1) {
			if(grid.stomp(row,col)) {
				$('.cell').each(function() {
					var row = $(this).data('row');
					var col = $(this).data('col');
					if(grid.cells[row][col].mine) {
						grid.cells[row][col].visited = true;
						$(this).addClass('red');
						$(this).html(report[row][col]);
					}
				});
				alert("Loss\nPlease refresh page for a new game.");
				stopGame();
			} else {
				$('.cell').each(function() {
					var row = $(this).data('row');
					var col = $(this).data('col');
					if(grid.cells[row][col].visited) {
						$(this).addClass('green');
						$(this).html(report[row][col]);
					}
				});
			}
		}
		if(grid.winCheck()) {
			alert("Win.\nPlease refresh page for a new game.");
			stopGame();
		}
	});
});
