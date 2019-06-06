# React Sudoku XV
A minimalistic Sudoku XV board written in React.js which generates regular Sudoku puzzles with [sudoku.js](https://github.com/robatron/sudoku.js) and converts them into Sudoku XV puzzles. The puzzles *are not guaranteed to be well-formed*, meaning it's possible for them to have more than one unique solution.

### Screenshot

![Screenshot](https://github.com/keerifox/react-sudoku-xv/raw/master/static/screenshot.png)

### What does XV mean?

Adjacent squares which add up to a total of 5 or 10 are *always* marked with a symbol between them – V or X respectively. For example, digits 6 and 4 can only be placed next to each other if there is an X symbol between the squares.

### Installation

    git clone https://github.com/keerifox/react-sudoku-xv.git
    cd react-sudoku-xv
    npm install
    npm run dev
    
You will also need the REST API server which generates puzzles. Navigate to the `api-server` folder, and run:

    npm install
    node api-server.js
    
That should be all, visit http://localhost:3000 to access the board.

### Controls

Squares can be selected with mouse or arrow keys, both numpad and regular digit keys may be used to input the digits, Backspace and Delete keys will clear the selected square.

To get a new puzzle, simply refresh the page.

### Adjusting Difficulty

The number of givens is 20 by default, you may change it in the `api-server.js` on the following line:

    const cellsDisclosedCount = 20
    
Remember to restart the API server afterwards.

### License

MIT
