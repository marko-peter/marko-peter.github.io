/*
Second step to solve Sudoku.
Working with "comp.secondBoard" array -> it represents all the possibilities for empty cells.
We take each row and check if there is only one possibility, where the number can be.
We take each column and check if there is only one possibility, where the number can be.
*/

var secondWay = {

	// determines if "comp.doItAll" function should repeat or not
	repeat: false,

	// main function of the object
	doIt() {
		
		this.repeat = false;

		// iterate over 9 rows and columns
		for (let i = 0; i < 9; i++) {			
			
			this.checkRow(i);
			this.checkColumn(i);			
		}
	},

	// checks if we can solve a cell in a row
	checkRow(row) {

		// create just one array from the whole row (all the possibilities together)
		let array = this.concatArrays(comp.secondBoard[row]);
		
		// trying to find numbers 1 to 9 in "array"
		for (let i = 1; i < 10; i++) {		
			
			/*
			If condition is true:
				- number "i" has only one possibility where it can be in row "i".
				- another cell is solved and can be updated
			*/
			if(this.oneItem(array, i)) {

				// identifies which cell to update
				let column = this.whichCell(comp.secondBoard[row], i);			
				
				game.updateBoard(row, column, i);
				
				// we solved a cell => "comp.doItAll" function repeats
				this.repeat = true;
			}
		}
	},

	// checks if we can solve a cell in a column
	checkColumn(column) {
		
		let array = [];
				
		// create array of array
		comp.secondBoard.forEach( (item) => array.push(item[column]) );
		
		// "secondArray" is one big array containing all numbers
		let secondArray = this.concatArrays(array);		

		// trying to find numbers 1 to 9 in "secondArray"
		for (let i = 1; i < 10; i++) {			

			/*
			If condition is true:
				- number "i" has only one possibility where it can be in row "i".
				- another cell is solved and can be updated
			*/
			if(this.oneItem(secondArray, i)) {

				// we have to identify which cell to update
				let row = this.whichCell(array, i);				
								
				game.updateBoard(row, column, i);
				
				// we solved a cell => "comp.doItAll" function repeats
				this.repeat = true;
			}
		}
	},

	// concatenate array of arrays into one big array
	concatArrays(array) {
		
		let newArray = [];

		// iterate over all rows/columns
		for (let i = 0; i < 9; i++) {

			newArray = newArray.concat(array[i]);
		}
		// return concatenated and sorted array
		return newArray.sort();
	},

	// identify if a value is included only once in given array
	oneItem(array, value) {

		// all the values that do not match given value are deleted from the array
		let newArray = array.filter( v => v === value );

		// if the length of newArray is 1, it contains only one item and returns true
	    return newArray.length === 1;
	},

	/*
	It identifies in which array given value is included.
	"Array" parameter contains array of array.
	*/
	whichCell(array, value) {

		// iterate over all rows/columns
		for (let i = 0; i < 9; i++) {
		
			// if "array[i]" includes the "value", we have the result and "i" represents cell number
			if (array[i].includes(value)) {return i;}
		}
	}
};