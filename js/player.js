/*
Manage user input.
*/

var player = {	

	/*
	Callback function for event listener.
	"this" refers to event handler element(in this case "table").
	*/
	click(event) {

		let target = event.target;		
		
		// if there is a message, remove it
		view.deleteMessage();

		// check if the user click on a table cell and it is not unchangeable
		if (target.nodeName === 'TD' && !target.classList.contains('unchangeable')) {
			
			let input = document.createElement('input');
			target.appendChild(input);
			input.focus();
			
			// set the active cell and highlight it
			view.activeCell = target;			
			view.activeCell.classList.add('active');

			// remove click listener and wait for keyboard input
			view.disableClick();
			view.waitForKeyUp();						
		}
	},

	/*
	Callback function for event listener.
	"this" refers to event handler element(in this case "document").
	*/
	keyUp(event) {

		// user input 
		let keyPressed = event.key;
		let intKey = parseInt(keyPressed, 10);
		let cell = view.activeCell;

		// "Delete" and "0" means the same (delete the number in the cell)
		if(keyPressed === 'Delete') {intKey = 0;}

		// if user input is integer, we can update view and board array
		if(Number.isInteger(intKey)) {
			
			/*
			"solved-cell" class is used to differ solved cells.
			Number "0" means, the cell is not solved.
			Numbers "1 - 9" means, the cell is solved.
			*/
			if(intKey !== 0) {
				view.activeCell.classList.add('solved-cell');
			} else {
				view.activeCell.classList.remove('solved-cell');
			}

			/*
			Coordinates of active cell.
			Each parentNode "TR" element has ID from 0 to 8.
			Each "TD" element has the first className from 0 to 8.
			*/
			let row = cell.parentNode.id;
			let column = cell.className[0];
			
			// update view (textContent of the cell)
			view.updateCell(row, column, intKey);

			// save entered number to Sudoku board
			game.updateBoard(row, column, intKey);
		}

		// if user pressed Esc or an integer, we start listening for another click input 
		if(keyPressed === 'Escape' || Number.isInteger(intKey)) {
			
			cell.classList.remove('active');
			view.disableKeyUp();
			view.waitForClick();
		}
	},

	// prepare board with chosen difficulty for the play
	chooseBoard(difficulty) {

		game.loadRandomBoard(difficulty);
		view.updateView(difficulty);
	},

	// prepare last chosen board from the beginning
	startAgain() {
		
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {				
								
				game.updateBoard(i, j, game.presentBoard[i][j]);
			}
		}
		view.updateView(game.presentDifficulty);
	},	

	// create empty Sudoku board, so user can fill in own numbers
	emptySudoku() {
			
		for (let i = 0; i < 9; i++) {			
			for (let j = 0; j < 9; j++) {				
				
				game.updateBoard(i, j, 0);
			}
		}
		view.updateView('');
	},

	// check if the solution is correct
	checkResult() {

		if(game.finalCheck()) {
			view.showMessage('#4CAF50', 'CORRECT');
		} else {
			view.showMessage('red', 'NOT CORRECT');
		}
	}
};