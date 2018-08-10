/*
Handle user input.
*/

var player = {

	tempInput: '',	

	/*
	Callback function for event listener(click).
	"this" refers to event handler element(in this case "table").
	*/
	click(event) {
		let target = event.target;		
		
		// if there is a message, remove it
		view.deleteMessage();

		// check if the user click on a table cell and it is not unchangeable
		if (target.nodeName === 'TD' && !target.classList.contains('unchangeable')) {			
			
			// save present value of the cell and clear textContent of the cell
			let cellValue;
			if(target.textContent !== '') {
				cellValue = target.textContent;
				target.textContent = '';
			}

			// create temporary input element in the cell
			let tempInput = document.createElement('input');
			tempInput.setAttribute('type', 'number');
			tempInput.setAttribute('min', '1');
			tempInput.setAttribute('max', '9');
			target.appendChild(tempInput);

			// set the value of "tempInput" and give it a focus
			if(cellValue !== undefined) {
				tempInput.value = cellValue;
			}			
			tempInput.focus();

			// save "tempInput", so it can be used also in other functions
			player.tempInput = tempInput;			

			// assign blur and input listeners to "tempInput" element
			view.waitForKey();										
		}
	},

	/*
	Callback function for event listener(blur).
	Handle (also validate) input from user.
	"this" refers to event handler element(in this case "input").
	*/
	blur() {		
		let value = player.tempInput.value;
		
		/*
		Validation - if input contains more than one digit or characters 
		other then numbers 1 to 9, it will find first valid number.
		It is needed in case mobile device does not suport input event,
		which does similar check.
		*/
		if(value.length > 1 || !(value > 0 && value < 10)) {
			let newValue = 0;
			for( digit of value ) {
				if(digit > 0 && digit < 10) {newValue = digit; break;}
			}
			value = newValue;
		}

		// parrentNode of "tempInput" is TD element
		let cell = player.tempInput.parentNode;
		
		// "solved-cell" class is used to differ solved cells by color
		if(value > 0 && value < 10) {
			cell.classList.add('solved-cell');
		} else {
			cell.classList.remove('solved-cell');
		}

		/*
		Coordinates of active cell.
		Each parentNode "TR" element has ID from 0 to 8.
		Each "TD" element has the first className from 0 to 8.
		*/			
		let row = cell.parentNode.id;
		let column = cell.className[0];

		// ensure that the value is integer
		value = parseInt(value, 10);		

		// update view (textContent of the cell) 
		view.updateCell(row, column, value);

		// save entered number to Sudoku board
		game.updateBoard(row, column, value);		

		// remove input element and assigned event listeners from DOM
		view.disableKey();
		player.tempInput.remove();
	},

	/*
	Callback function for event listener(input).
	Validate input from the user.
	May not work on mobile devices => additional validation needed in "blur" event
	"this" refers to event handler element(in this case "input").
	*/
	input(event) {
		// entered value (pressed key)
		let key = event.data;		
		
		/*
		Validation - input element should always contain only one digit(1 to 9) 
		*/
		if(key >= 1 && key <= 9) {
			player.tempInput.value = key;			
		} else if(key === ','){
			player.tempInput.value = '';
		} else {
			let newValue = '';
			for( digit of player.tempInput.value ) {				
				if(digit != 0) {newValue = digit;}
			}
			player.tempInput.value = newValue;		
		}
	},	

	// prepare board with chosen difficulty for the play
	chooseBoard(difficulty) {
		game.loadRandomBoard(difficulty);
		view.updateView(difficulty);
	},

	// draw last chosen board from the beginning
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