/*
First step to solve Sudoku.
We take each cell and compare the numbers in particular row, column and 3x3 grid.
It applies basic Sudoku rules to find the solution (numbers 1 to 9 can be only once
in each row, column and 3x3 grid).
*/

var firstWay = {
	
	// determines if "doIt" function should repeat or not
	repeat: false,

	// manage how many times "checkAllCells" function repeats
	doIt() {		
		do {			
			firstWay.checkAllCells();
		} while (this.repeat);	
	},

	// look at each cell and check, if we know the solution for it
	checkAllCells() {		
		this.repeat = false;			
		comp.cleanSecondBoard();

		// iterate over all rows
		for (let i = 0; i < 9; i++) {			
			let row = game.board[i];

			/*
			Find missing numbers in row "i" (the same for each empty cell in one row)
			Missing numbers are possible solutions for empty cells.
			"firstArray" represents array of possible solutions.
			*/
			let firstArray = this.searchRow(row);
			
			// iterate over all columns (cells) in the row
			for (let j = 0; j < 9; j++) {
				// we take the value of cell "j" of the row "i"
				let cell = game.board[i][j];
				
				// search for the possibiliies only if the cell contains "0" ( = not solved)
				if(cell === 0) {					
					// compares firstArray with column "j"
					let secondArray = this.searchColumn(j, firstArray);

					// compares secondArray with each 3x3 grid
					let thirdArray = this.searchGrid(i, j, secondArray);				

					// if there is only one number in "thirdArray", it is the solution for the cell
					if (thirdArray.length === 1) {												
						game.updateBoard(i, j, thirdArray[0]);				
						
						// we solved a cell => it is needed to check all cells again
						this.repeat = true;					
					} else {
						// update the array of possible solutions
						comp.secondBoard[i][j] = thirdArray;
					}
				}
			}
		}		
	},
	
	// return array of possible numbers for the row
	searchRow(array) {
		let tempArray = [];

		// searching numbers 1 to 9 in the array
		for (let i = 1; i < 10; i++) {			
			// if "array" does not include number "i", number "i" is pushed to "tempArray"
			if (!array.includes(i)) { tempArray.push(i); }	
		}
		return tempArray;
	},

	// filter out numbers already used in the column
	searchColumn(column, array) {
		// iterate over all rows(cells) of one column
		for (let i = 0; i < 9; i++) {			
			// values of solved cells are filtered out of array
			array = this.filterArray(i, column, array);
		}			
		return array;
	},

	// filter out numbers already used in 3x3 grid
	searchGrid(row, column, array) {		
		// we need to find out starting cell of the grid
		let startRow = this.findStart(row);
		let startColumn = this.findStart(column);

		// iterate over 3 rows
		for (let i = startRow; i < startRow + 3; i++) {			
			// iterate over 3 columns
			for (let j = startColumn; j < startColumn + 3; j++) {				
				// values of solved cells are filtered out of array
				array = this.filterArray(i, j, array);				
			}
		}
		return array;
	},

	// filter out given array
	filterArray(row, column, array) {
		// "num" represents cell value
		let num = game.board[row][column];
	
		// if "array" includes "num", "num" is excluded from "array"
		if(array.includes(num)) {
			array = array.filter( item => item !== num);
		}
		return array;
	},

	/*
	There are three 3x3 grids in each row and each column.
	This function returns cell, where the grid begins.
	*/
	findStart(item) {
		let start;

		if (item < 3) {start = 0;}
		else if (item < 6) {start = 3;}
		else if (item < 9) {start = 6;}

		return start;
	}
};