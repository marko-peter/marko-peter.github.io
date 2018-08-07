/*
Manage all about Sudoku boards, AJAX loading.
*/

var game = {

	// Sudoku board which is being played
	board: [
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0]	
	],

	// array of all Sudoku boards loaded with AJAX
	loadedBoards:[],

	// copy of Sudoku board which is being played
	presentBoard:[
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0]	
	],

	// difficulty of present board
	presentDifficulty: '',

	// called when index.html is loading
	start() {

		// load sudoku boards with AJAX
		this.loadBoards();
		
		// draw empty sudoku board (HTML table) on the screen
		view.drawTable();
		
		// player is suppossed to click on a table cell (select a cell)
		view.waitForClick();
	},
	
	/*
	Function returns random integer.
	The maximum is exclusive and the minimum is inclusive.
	*/
	getRandomInt(min, max) {

		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	},

	// load Sudoku boards with AJAX
	loadBoards() {	

		let xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://marko-peter.github.io/json-data/boards.json', true);

		xhr.onload = function() {

			if(this.status == 200) {				
				game.loadedBoards = JSON.parse(this.responseText);				
			} else {
				view.showMessage('red', 'BOARDS NOT LOADED!!!');
			}		
		}

		xhr.onerror = function() {

			view.showMessage('red', 'BOARDS NOT LOADED!!!');
		}

		xhr.send();	
	},

	// prepare "game.board" for the play
	loadRandomBoard(level) {

		// check if boards have been loaded
		if(this.loadedBoards.length === 0) {
			this.loadBoards();
		} else {			
			
			// filter boards according to "level of difficulty"
			let filteredBoards = this.loadedBoards.find( item => item.difficulty === level )

			// choose random board and save a copy ("presentBoard")
			let randomNum = this.getRandomInt(0, filteredBoards.boards.length);					
			this.presentBoard = filteredBoards.boards[randomNum];
			this.presentDifficulty = level;

			// iterate over all cells and update them with numbers
			for (let i = 0; i < 9; i++) {
				for (let j = 0; j < 9; j++) {					
										
					this.updateBoard(i, j, this.presentBoard[i][j]);
				}
			}
		}
	},

	// update "game.board" with new value
	updateBoard(row, column, newValue) {

		this.board[row][column] = newValue;		
	},

	/*
	If there are no zeros in "game.board", it means sudoku shoul be solved.
	However there is another "finalCheck" function to make a deep check.
	*/
	isSolved() {

		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {

				if( (this.board[i][j] === 0) )  {return false;}
			}
		}				
		return true;
	},

	/*
	Check if Sudoku is really solved.
	Check if all rows, columns and 3x3 grids contains all numbers 1 to 9.
	*/
	finalCheck() {

		// coordinates of the first cell of each 3x3 grid on Sudoku board
		let gridRow = [0,0,0,3,3,3,6,6,6];
		let gridColumn = [0,3,6,0,3,6,0,3,6];

		// iterate over all 9 rows/columns/grids
		for (let i = 0; i < 9; i++) {

			// get "i" row of "game.board"
			let rowArray = this.board[i];
			
			// get "i" column of "game.board"
			let columnArray = this.getColumnArray(i);
			
			// get "i" grid of "game.board"
			let gridArray = this.getGridArray(gridRow[i], gridColumn[i]);		

			// searching for numbers 1 to 9 in each row/column/grid
			for (let j = 1; j < 10; j++) {
				
				if(!rowArray.includes(j)) {return false;}
				if(!columnArray.includes(j)) {return false;}
				if(!gridArray.includes(j)) {return false;}
			}			
		}				
		return true;
	},

	// creates array from given column of "game.board"
	getColumnArray(col) {

		let tempArray = [];

		// iterate over all 9 rows
		for (let i = 0; i < 9; i++) {

			tempArray.push(this.board[i][col]);
		}
		return tempArray;
	},

	// creates array from given 3x3 grid of "game.board"
	getGridArray(startRow, startColumn) {

		let tempArray = [];

		// iterate over 3 rows
		for (let i = startRow; i < startRow + 3; i++) {
			
			// iterate over 3 columns
			for (let j = startColumn; j < startColumn + 3; j++) {
				
				tempArray.push(this.board[i][j]);				
			}
		}
		return tempArray;
	}	
};