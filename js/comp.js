/*
Manage Sudoku solving.
*/

var comp = {

	// represents all the possibilities for unsolved cells
	secondBoard: [[],[],[],[],[],[],[],[],[]],

	// clear the array
	cleanSecondBoard() {

		for (let i = 0; i < 9; i++) {		
			for (let j = 0; j < 9; j++) {
			
				this.secondBoard[i][j] = [];
			}	
		}
	},

	// main function - manages solving the Sudoku
	solve() {

		// prevent user from input
		view.stopInput();
		view.deleteMessage();

		// save the board, so we can get back, if there is a mistake
		let savedBoard = [[],[],[],[],[],[],[],[],[]];
		this.saveBoard(savedBoard);

		// at first, apply basic Sudoku rules to find the solution
		this.doItAll();

		// if game is still not solved, try to guess the numbers		
		if(!game.isSolved()) {guess.try();}
		
		// if the game is solved, display the result on the screen		
		if(game.finalCheck()) {view.updateAll();}

		// otherwise player filled in the numbers incorrectly
		else {			
			view.showMessage('red', 'WRONG NUMBERS FILLED IN !!!');
			
			// retrieve saved board
			this.getBack(savedBoard);			
			
			// user can continue playing
			view.waitForClick();
		}			
	},

	/*
	Manages how many times below functions should repeat.	
	It applies basic Sudoku rules to find the solution.
	*/ 
	doItAll() {

		do {
			firstWay.doIt();		
			secondWay.doIt();		
		} while (secondWay.repeat);
	},

	// "board" passed by reference => do not need to return "board"
	saveBoard(board) {

		// iterate over all cells
		for (let i = 0; i < 9; i++) {			
			for (let j = 0; j < 9; j++) {
				
				// value of each cell is saved
				board[i][j] = game.board[i][j];
			}
		}		
	},

	// if a mistake was found, we can get back our saved board
	getBack(board) {

		// iterate over all cells
		for (let i = 0; i < 9; i++) {			
			for (let j = 0; j < 9; j++) {				

				game.updateBoard(i, j, board[i][j]);
			}
		}	
	},
};