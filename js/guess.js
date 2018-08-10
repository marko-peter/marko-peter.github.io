/*
Third step to solve Sudoku.
We are guessing the numbers.
*/

var guess = {
				
	try() {			
		let origBoard = [[],[],[],[],[],[],[],[],[]];
		
		// this means we want to find an array with length 2
		let arrLength = 2;
		let position = this.findPosition(arrLength);		

		// if there is no array with length 2, we try to find 3 or 4 or ...		
		while (!position) {
			arrLength++;
			position = this.findPosition(arrLength);			
			if(arrLength > 9) {return;}			
		}
		
		// "cell" represents array of possibilities from comp.secondBoard
		let cell = comp.secondBoard[position[0]][position[1]];	

		// save the board, so we can step backwards, if we do not guess the number at first time
		comp.saveBoard(origBoard);
		
		for (let i = 0; i < arrLength; i++) {

			// try number "cell[i]" and check if we can solve other cells
			game.updateBoard(position[0], position[1], cell[i]);
			comp.doItAll();			

			// if game is not solved and blanks were found => "cell[i]" is not correct 
			if (!game.isSolved() && this.checkForBlanks()) {

				// get back and try another number, continue with next iteration 				
				comp.getBack(origBoard);				
			}
			
			// if game is not solved and blanks were not found => we do not know, if "cell[i]" is correct 
			else if (!game.isSolved())  {
				
				// we suppose that "cell[i]" is correct and call next "guess.try" function
				this.try();

				// if guess.try() function returns and the game is not solved, it means, "cell[i]" is not correct
				if (!game.isSolved()) {
									
					// get back and try another number, continue with next iteration 				
					comp.getBack(origBoard);													
				}
				// if game is solved, iteration can stop (the whole function can stop)
				else {return;}
			}

			// if game seems to be solved, but "finalCheck" finds a mistake
			else if(!game.finalCheck()){

				// get back and try another number, continue with next iteration
				comp.getBack(origBoard);				
			}
			
			// if game is solved, iteration can stop (the whole function can stop)
			else {return;}				 
		}		
	},	

	// find first cell of secondBoard with given array length
	findPosition(arrLength) {		
		for (let i = 0; i < 9; i++) {						
			for (let j = 0; j < 9; j++) {

				// return coordinates of found cell [row, column]
				if(comp.secondBoard[i][j].length === arrLength) {return [i,j];}
			}
		}
		// if no such cell is found, return false
		return false;
	},

	// check if there is a mistake
	checkForBlanks() {
		for (let i = 0; i < 9; i++) {			
			for (let j = 0; j < 9; j++) {

				// if this condition is true, guessed number was not correct.
				if( (game.board[i][j] === 0) && (comp.secondBoard[i][j].length === 0) ) {
					return true;
				}
			}
		}
		return false;
	}
};