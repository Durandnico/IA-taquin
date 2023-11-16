import Pair from "./utils/Pair.ts";

export default class Taquin {
  private _grid : Array<Array<number>>;
  private _indexOfBlank : Pair<number, number>;

  public constructor(grid? : Array<Array<number>>) {
    if(grid) {
      try {
        this._indexOfBlank = this.checkGrid(grid);
        this._grid = grid;
      } catch (error) {
        console.log(error);
        throw error;
      }
      this._grid = grid;
    }
      
    else {
      this._grid = [
        [0,1,3],
        [4,2,5],
        [7,8,6]
      ];
      this._indexOfBlank = new Pair<number, number>(0,0);
    }
  }

  /* ======================= PRIVATE METHOD ==========================================*/

  private checkGrid(grid : Array<Array<number>>) : Pair<number,number> {
    /* check if the grid is 3x3 */
    if(grid.length < 3)
      throw new Error("invalid grid : must be at least 3x3");

    const lengthRow = grid[0].length;
    /* check if the grid contains all the numbers from 0 to 8 */
    let index = new Pair<number, number>(0,0);    
    let verif = [];
    for(let i = 0; i < grid.length; ++i )
      for(let j = 0; j < grid[i].length; ++j)
        verif.push(i*grid.length + j);
    
    for(let i = 0; i < grid.length * lengthRow; ++i)
      verif.push(i);

    for(let i = 0; i < grid.length; i++) {
      
      /* check if the grid is 3x3 */
      if(grid[i].length != lengthRow)
        throw new Error("invalid grid : all row must be the same lenght");
      
      for(let j = 0; j < grid[i].length; j++) {

        if(grid[i][j] == 0) {
          index.first = i;
          index.second = j;
        }

        if(verif[grid[i][j]] < 0)
          throw new Error("invalid grid");
        else
          verif[grid[i][j]] = -1;
      }
    }

    return index;
  }

  /* ---------------------------------------------------------------------------------- */

  private canMove(value: number ) : Pair<boolean, Pair<number, number>> {
    if(value < 1 || value > 8)
      throw new Error("index out of range");


    /* get the index of the value to move */
    let index = new Pair<number, number>(-1,-1);
    for(let row = 0; row < this._grid.length; ++row)
    {
      if(this._grid[row].includes(value)) {
        index.first = row;
        index.second = this._grid[row].indexOf(value);
        row = 3;
      }
    }
    
    /* check if asolute distance between value and 0 == 1 */
    const dist = Math.abs(index.first - this._indexOfBlank.first) + Math.abs(index.second - this._indexOfBlank.second); 
    
    return new Pair(dist ===1, index);
  }

  /* ======================= PUBLIC METHOD ========================================== */
  
  public move(value : number) {
    try {

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
      
      this.render();
      return true
    } catch (error) {
      console.error("index out of range");
      return false
    }
  }

  /* ---------------------------------------------------------------------------------- */

  public render() {
    console.clear()
    for(let row of this._grid)
    {
      let str : string = "| ";
      for(let val of row)
        str += (val === 0 ? ' ' : val)  + ' | ';

      console.log(str);
      console.log("+---+---+---+")
    }
  }

  /* ---------------------------------------------------------------------------------- */

  public isWin() : boolean {
    const solution = [
      [1,2,3],
      [4,5,6],
      [7,8,0]
    ];

    for(let i = 0; i < 3; ++i)
      for(let j = 0; j < 3; ++j)
        if(this._grid[i][j] != solution[i][j])
          return false;

    return true;
  }


  /* ======================= GETTERS ========================================== */

  get grid(){
    return this._grid;
  }

}