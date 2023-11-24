import Pair from "./utils/Pair.ts";
import inquirer from "inquirer";

export default class Taquin {
  private _grid : Array<Array<number>>;
  private _indexOfBlank : Pair<number, number>;
  private _rows: number;
  private _cols: number;

  public constructor(grid? : Array<Array<number>>) {
    if(grid) {
      try {
        this._indexOfBlank = this.checkGrid(grid);
        this._grid = grid;
        this._rows = grid.length;
        this._cols = grid[0].length;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
      
    else {
      this._grid = [
        [1,2,3,4],
        [5,6,7,8],
        [9,10,11,12],
        [13,14,15,0]
      ];
      this._indexOfBlank = new Pair<number, number>(3,3);
      this._cols = 4;
      this._rows = 4;
      this.scramble();
    }
  }

  /* ======================= PRIVATE METHOD ==========================================*/

  private checkGrid(grid : Array<Array<number>>) : Pair<number,number> {
    /* check if the grid is, at least, 3x3 */
    if(grid.length < 3)
      throw new Error("invalid grid : must be at least 3x3");

    const lengthRow = grid[0].length; // lenght of all the row (guest)
    if(lengthRow < 3)
      throw new Error("invalid grid : must be at least 3x3");

    /* create and tmp array with all the digit that the grid must contains */
    const index = new Pair<number, number>(0,0); // save the index of the blank case
    const maxValue = grid.length * lengthRow - 1; // the biggest number possible in the grid    
    let verif = []; // use to verif if all number are present */
    let tmp = 0; // tmp var
    for(let i = 0; i < grid.length; ++i ) {

      /* check if  all rows are : all the same lenght */
      if(grid[i].length != lengthRow)
        throw new Error("invalid grid : all row must be the same lenght");
      
    
      for(let j = 0; j < lengthRow; ++j)
        verif.push(tmp++);
    }
      
    /* verif is it contains all of them */
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < lengthRow; j++) {

        /* if we find the 0, we save it coord */
        if(grid[i][j] == 0) {
          index.first = i;
          index.second = j;
        }

        /* check if the value is possible and not in double */
        if(grid[i][j] < 0 || grid[i][j] > maxValue || verif[grid[i][j]] < 0)
          throw new Error("invalid grid");

        
        verif[grid[i][j]] = -1;
      }
    }

    return index;
  }

  /* ---------------------------------------------------------------------------------- */

  private canMove(value: number ) : Pair<boolean, Pair<number, number>> {
    if(value < 1 || value > this._cols * this._rows - 1)
      throw new Error("index out of range");

    /* get all the possible moves */
    const canBePlayed: Pair<number,number>[] = this.possibleMoves();

    /* check if the move is in the playable list */
    const response = canBePlayed.find(v => this._grid[v.first][v.second] === value)
      
    return new Pair(response === undefined, response ?? this._indexOfBlank);
  }

  /* ---------------------------------------------------------------------------------- */

  private possibleMoves(): Pair<number, number>[] {
      let response : Pair<number, number>[] = [];  
      
      if(this._indexOfBlank.first > 0)
        response.push(new Pair(this._indexOfBlank.first - 1,this._indexOfBlank.second));
    
      if(this._indexOfBlank.first < this._rows - 1)
        response.push(new Pair(this._indexOfBlank.first + 1,this._indexOfBlank.second));
        
      if(this._indexOfBlank.second > 0)
        response.push(new Pair(this._indexOfBlank.first,this._indexOfBlank.second - 1));
      
      if(this._indexOfBlank.second < this._cols - 1)
        response.push(new Pair(this._indexOfBlank.first, this._indexOfBlank.second + 1));
    
      return response;
    }

  /* ======================= PUBLIC METHOD ========================================== */
  
  public userInputMove(value : number) : boolean {
    try {
      /* check if the move is possible first (I never trust user's input :D) */
      const checkMove = this.canMove(value);
      if(!checkMove.first)
      {
        console.log("Illegal move, cannot move piece number : " + value);
        return false;
      }

      /* move the piece */
      this._grid[this._indexOfBlank.first][this._indexOfBlank.second] = value;
      this._grid[checkMove.second.first][checkMove.second.second] = 0;
      Pair.swap(this._indexOfBlank, checkMove.second);
      
      return true
    } catch (error) {
      console.error("index out of range");
      return false
    }
  }

  /* ---------------------------------------------------------------------------------- */

  public async promptMove(): Promise<void> {
    const nextMoves:  Pair<number, number>[] = this.possibleMoves();
    let digits: number[] = [];

    nextMoves.forEach(p => digits.push(this._grid[p.first][p.second]));
    const menu = await inquirer.prompt([
      {
        type: 'list',
        name: 'response',
        message: 'Prochain coup ?',
        choices : digits.sort((a,b) => a - b)
      }
    ]);

    const nextMove: Pair<number, number> = nextMoves.find(p => menu.response === this._grid[p.first][p.second])!;
    this._grid[this._indexOfBlank.first][this._indexOfBlank.second] = menu.response;
    this._grid[nextMove.first][nextMove.second] = 0;
    Pair.swap(this._indexOfBlank, nextMove);    
  }

  /* ---------------------------------------------------------------------------------- */

  public render() {
    console.clear();
    this.draw();
  }

  /* ---------------------------------------------------------------------------------- */

  public draw() {
    const largest: number = Math.floor(Math.log10(this._cols * this._rows - 1)); // the number of digits of the biggest number (ex 100 : 3 || 25 : 2 )
    let top: string = '┌─' // tmp variable to display the grid between numbers
    let del: string = "─┬─" // tmp variable to specify which separator use
    let end: string = "─┐" // tmp variable to specify which end of line use
    for(const row of this._grid)
    {
      let str : string = "│ "; // tmp var to display the line with the numbers
      for(const val of row)
      {
        /* concat the correct number of '-' for the top bar */
        for(let i: number = -1; i < largest; ++i) 
          top += '─';
        
        /* concat the missing number of space in front of a number 
          (ex if the biggest number is 105, it takes 3 char so :
            - we have to put 2 ' ' if front a 9 
            - 1 ' ' in front of 10 
          to make them 3char long) */
        for(let i: number = Math.floor(Math.log10(val == 0 ? 1 : val)); i < largest; ++i)
          str += ' ';

        str += (val === 0 ? ' ' : val)  + ' │ ';
        if(val !== row[this._cols - 1])
          top += del;
      }
      console.log(top + end);
      console.log(str);
      top = "├─";
      del = "─┼─";
      end = "─┤";
    }

    /* print last row */
    top = "└─";
    del = "─┴─";
    end = "─┘";
    for(let i = 0; i < this._cols; ++i) {
      for(let j = -1; j < largest; ++j)
        top += '─';

      if(i !== this._cols - 1)
        top += del;
        
    }
    console.log(top + end);
  }

  /* ---------------------------------------------------------------------------------- */

  public isWin() : boolean {
    if(this._grid[this._rows - 1][this._cols - 1] === 0)
      return false;

    /* check if all the number are increasing */
    let check: number = 1;
    for(let i = 0; i < this._rows; ++i)
      for(let j = 0; j < this._cols; ++j)
        if(this._grid[i][j] != check++ && this._grid[i][j] !=0 ) 
          return false;

    return true;
  }


  /* ---------------------------------------------------------------------------------- */

  public scramble(moves: number = 10000): void {
    /* play 10 000 a random possible move to make sur the grid is*/
    for(;moves > 0; --moves)
    {
      const nextMoves: Pair<number,number>[] = this.possibleMoves();
      const rnd = Math.round(Math.random() * nextMoves.length - 0.5);
      const nextMove: Pair<number, number> = nextMoves[rnd];

      this._grid[this._indexOfBlank.first][this._indexOfBlank.second] = this._grid[nextMove.first][nextMove.second]; 
      this._grid[nextMove.first][nextMove.second] = 0;
      Pair.swap(this._indexOfBlank, nextMove); 
    }
  }

  /* ======================= GETTERS ========================================== */

  get grid(){
    return this._grid;
  }

}