{
  const app = document.querySelector('#app');
  const btnRunIter = document.querySelector('.run-iteration-btn');
  const inputIterSpeed = document.querySelector('.iter-speed');
  const btnSetIterSpeed= document.querySelector('.set-speed-btn');
  const tachometer= document.querySelector('.cur-speed span');
  const btnRunLife = document.querySelector('.run-life-btn');
  const btnBreakLife = document.querySelector('.break-life-btn');
  const btnInitField = document.querySelector('.init-field-btn');
  const btnSetRows = document.querySelector('.set-rows-btn');
  const btnSetCols = document.querySelector('.set-cols-btn');
  const inputSetRows = document.querySelector('.rows-count');
  const inputSetCols = document.querySelector('.cols-count');
  const rowsAmount = document.querySelector('.rows-amount');
  const colsAmount = document.querySelector('.cols-amount');
  
  let cols = 30;
  let rows = 30;
  let gameId = null;
  let iterSpeed = 500;
  

  //Create field
  initField(rows, cols);


  //Initial alive cells
  document.querySelector('[data-table-id = "5-4"]').classList.add('alive');
  document.querySelector('[data-table-id = "5-5"]').classList.add('alive');
  document.querySelector('[data-table-id = "5-6"]').classList.add('alive');


  function initField(rows, cols) {
    for (let i = 1; i <= rows; i++) {
      let row = document.createElement('tr'); 
      row.classList = "row";
      row.dataset.rowId = `${i}`;
      app.append(row);
  
      for (let j = 1; j <= cols; j++) {
        let el = document.createElement('td');
        el.className = "cell";
        el.dataset.tableId = `${i}-${j}`;
  
        row.append(el);
      }
    }
  }

  function resetField(){
    app.innerHTML = '';
  }

  function checkCellNextState(row, col, prevState) {
    let cellState = prevState[row][col];
    let neighbors = countAliveNeighbors(row, col, prevState);

    //animate the cell
    if (cellState) {  
      if ((neighbors < 4) && (neighbors > 1)) {
        return 1; 
      }
    } else {
      if (neighbors == 3) { return 1; }
    }

    //kill the cell
    return 0; 
  }

  function runIter() {
    let prevState = createPrevStateModel();
    let nextState = createNextStateModel(prevState);

    updateState(nextState);
  }

  function createNextStateModel(modelPrev) {
    let modelNext = new Array(rows); 
    for (let i = 1; i <= rows; i++) {
      let cells = Array.from(document.querySelectorAll(`[data-row-id="${i}"] .cell`));
      modelNext[i - 1] = new Array(cells.length);
      for (let j = 1; j <= cells.length; j++) {
        modelNext[i - 1][j - 1] = checkCellNextState(i - 1, j - 1, modelPrev);
      }
    }
    return modelNext;
  }

  function createPrevStateModel() {
    let modelPrev = new Array(rows);
    for (let i = 1; i <= rows; i++) {
      let cells = Array.from(document.querySelectorAll(`[data-row-id="${i}"] .cell`));
      modelPrev[i - 1] = new Array(cells.length);
      for (let j = 1; j <= cells.length; j++) {
        modelPrev[i - 1][j - 1] = cells[j - 1].classList.contains('alive') ? 1 : 0;
      }
    }
    return modelPrev;
  }

  function countAliveNeighbors(row, col, prevState) {
    let neighbors = 0;
    for (let i = row - 1; i <= row + 1; i++) {  //count alive neighbors in square 3x3
      for (let j = col - 1; j <= col + 1; j++) {
        if (  //Except non-existent indexes and current cell
          i >= 0 &&
          j >= 0 &&
          i < rows &&
          j < cols &&
          !(i === row && j === col)
        )
        { 
          if (prevState[i][j] == 1) {
            neighbors++;
          }
        }
      }
    }
    return neighbors;
  }

  function updateState(nextState) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < rows; j++) {
        let cell = document.querySelector(`[data-table-id="${i+1}-${j+1}"]`);
        if (nextState[i][j] === 1) {
          cell.classList.add('alive');
        } else{
          cell.classList.remove('alive');
        }
      }
    }
  }


  //Click handler - toggle cell state
  app.addEventListener('click', e => {
    if (e.target.classList.contains('alive')) {
      e.target.classList.remove('alive');
    } else {
      e.target.classList.add('alive');
    }
  });

  //Button handlers
  btnRunIter.addEventListener('click', e => {
    e.preventDefault();
    runIter();
  });

  btnSetIterSpeed.addEventListener('click', e => {
    e.preventDefault();

    if (+inputIterSpeed.value < 0) {
      inputIterSpeed.value = -inputIterSpeed.value;
    }

    iterSpeed = +inputIterSpeed.value;
    tachometer.innerHTML = iterSpeed;

    clearInterval(gameId);
    gameId = setInterval(runIter, iterSpeed);

    inputIterSpeed.value = '';
  });

  btnRunLife.addEventListener('click', e => {
    e.preventDefault();
    gameId = setInterval(runIter, iterSpeed);

    btnRunLife.disabled = true;
    btnBreakLife.disabled = false;
  });

  btnBreakLife.addEventListener('click', e => {
    e.preventDefault();
    clearInterval(gameId);

    btnRunLife.disabled = false;
    btnBreakLife.disabled = true;
  });

  btnSetRows.addEventListener('click', e => {
    e.preventDefault();

    if (+inputSetRows.value < 0) {
      inputSetRows.value = -inputSetRows.value;
    }

    rowsAmount.innerHTML = inputSetRows.value;
    rows = +inputSetRows.value;
    inputSetRows.value = '';
  });

  btnSetCols.addEventListener('click', e => {
    e.preventDefault();

    if (+inputSetCols.value < 0) {
      inputSetCols.value = -inputSetCols.value;
    }

    colsAmount.innerHTML = inputSetCols.value;
    cols = +inputSetCols.value;
    inputSetCols.value = '';
  });

  btnInitField.addEventListener('click', e => {
    e.preventDefault();

    clearInterval(gameId);
    resetField();

    initField(rows, cols);
  });
}