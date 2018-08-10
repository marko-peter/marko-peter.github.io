/*
Handle DOM manipulation.
*/

var view = {

	// get HTML elements
	placeForTable: document.getElementById('place'),
	table: document.getElementById('table'),
	difficulty: document.getElementById('difficulty'),
	message: document.getElementById('message'),
	paragraf: document.getElementById('paragraf'),	

	// assign event listener to the table
	waitForClick() {		
		this.table.addEventListener('click', player.click);
	},

	// remove event listener assigned to the table
	disableClick() {
		this.table.removeEventListener('click', player.click);
	},

	// assign event listeners to temporary input element
	waitForKey() {
		player.tempInput.addEventListener('blur', player.blur);
		player.tempInput.addEventListener('input', player.input);
	},

	// remove event listeners assigned to temporary input element
	disableKey() {
		player.tempInput.removeEventListener('blur', player.blur);
		player.tempInput.removeEventListener('input', player.input);
	},	

	// upadte textContent of the table cell in the browser
	updateCell(row, column, newValue) {
		let targetCell = this.table.rows[row].cells[column];

		/*
		If "newValue" is set to "0", it deletes the content.
		Otherwise new value is filled in.
		*/
		targetCell.textContent = (newValue === 0 ? ' ' : newValue );
	},

	// fill in all cells of the table with values of "game.board"
	updateAll() {
		for (let i = 0; i < 9; i++) {		
			for (let j = 0; j < 9; j++) {				
				this.updateCell(i, j, game.board[i][j]);		
			}	
		}		
	},

	// draw HTML table (Sudoku board) on the screen
	drawTable() {
		// at first we need to remove old table and create new one
		this.table.remove();
		this.table = document.createElement('table')
		this.placeForTable.appendChild(this.table);
		
		// then we can create rows and columns(cells)
		for (let i = 0; i < 9; i++) {			
			let row = document.createElement('tr');
			
			// each row has unique id (from 0 to 8)
			row.setAttribute('id', i);
				
			for (let j = 0; j < 9; j++) {
				let cell = document.createElement('td');
				
				// each cell has a class (from 0 to 8)
				cell.setAttribute('class', j);
								
				let num = game.board[i][j];
				
				// zero in "game.board" means "blank space"
				if (num !== 0) {
					cell.textContent = num;

					// "solved-cell" differs the cells by color
					cell.classList.add('solved-cell', 'unchangeable');
				}

				row.appendChild(cell);
			}

			this.table.appendChild(row);
		}		
	},	

	// update board(screen) with up-to-date data
	updateView(difficulty) {
		// if there is a message, remove it
		this.deleteMessage();
		
		this.difficulty.textContent = difficulty;
		this.drawTable();
		this.waitForClick();		
	},

	// show success or error message and hides "paragraf"
	showMessage(color, message) {		
		this.message.style.color = color;
		this.paragraf.style.display = 'none';
		this.message.textContent = message;
	},

	// delete message and "paragraf" is visible again
	deleteMessage() {
		this.message.textContent = '';
		this.paragraf.style.display = 'block';
	}
};