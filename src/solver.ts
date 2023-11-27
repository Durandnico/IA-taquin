import Taquin from "./Taquin.ts";
import Pair from "./utils/Pair.ts";

function movePossible (grid : Array<Array<number>>, zero :Pair<number,number>) : Pair<number, number>[] {
  let response : Pair<number, number>[] = [];  
  
  if(zero.first > 0)
    response.push(new Pair(zero.first - 1,zero.second));

  if(zero.first < grid.length - 1)
    response.push(new Pair(zero.first + 1,zero.second));
    
  if(zero.second > 0)
    response.push(new Pair(zero.first,zero.second - 1));
  
  if(zero.second < grid[zero.first].length - 1)
    response.push(new Pair(zero.first, zero.second + 1));

  return response;
}

/* ----------------------------------------------------------------------------------------- */

function findEmptyCase(grid : Array<Array<number>>) : Pair<number, number> {
  for(let i = 0; i < grid.length; ++i)
    for(let j = 0; j < grid[i].length; ++j)
      if(0 === grid[i][j])
        return new Pair(i,j);

    return new Pair(-1,-1);
}

/* ----------------------------------------------------------------------------------------- */

function nextMoves(grid: Array<Array<number>>) : Pair<number, Array<Array<number>>>[] {
  const zero = findEmptyCase(grid);
  const moves = movePossible(grid, zero);
  let response : Pair<number, Array<Array<number>>>[] = [];

  for(let move of moves)
  {
    /* copy the grid */
    let newGrid : Array<Array<number>> = [];
    grid.forEach(row => newGrid.push( Object.assign([], row)))
    
    /* do the next move */
    newGrid[zero.first][zero.second] = grid[move.first][move.second];
    newGrid[move.first][move.second] = 0;

    response.push(new Pair(grid[move.first][move.second], newGrid));
  }

  return response;
}

/* ----------------------------------------------------------------------------------------- */

function hash(grid: Array<Array<number>>) : string {
  let response : string = "";

  for(let row of grid)
    for(let val of row)
      response += '_' + val;

  return response;
}

/* ----------------------------------------------------------------------------------------- */

type Node =  {
  parent: Node | null, 
  move: number,
  heuristic_g: number, 
  depth_h: number,
  grid: Array<Array<number>>,
  f_cost: number
};


export default function Astar (heuristicFct : Function , game : Taquin) : Pair<number,number[]> {
  let save : Map<string, Node> = new Map(); // map of all the moves already played
  let toCheck : Map<string,Node> = new Map(); // map of all the moves to play
  let find : string | null = null; // response variable
  let numberOfChecks: number = 0; // counter of moves

  toCheck.set(hash(game.grid), {parent: null, move:0, heuristic_g: heuristicFct(game.grid), depth_h: 0, grid: game.grid, f_cost: heuristicFct(game.grid)})
  while(find === null && toCheck.size) {
    console.log(++numberOfChecks);

    /* find the smallest f_cost of the array (TODO : and smallest g_cost) */
    let target : Node = Array.from(toCheck.values())[0];
    for(let node of toCheck.values()) 
      if(node.f_cost < target.f_cost || (node.f_cost === target.f_cost && node.depth_h < target.depth_h)) 
        target = node;
    

    /* remove from toCheck and add to save */
    const id = hash(target.grid); 
    toCheck.delete(id);
    save.set(id, target);

    for(let move of nextMoves(target.grid)) {
      const move_id: string = hash(move.second);
      const g_cost: number = heuristicFct(move.second);
      
      /* if the move is the solution (ie g_cost = 0) */
      if(g_cost === 0) {
        let response: number[] = [move.first]
        let backtrack:  Node | null = target;
        while(backtrack?.parent !== null) {
          response.unshift(backtrack.move)
          backtrack = backtrack!.parent;
        }

        return new Pair<number, number[]>(numberOfChecks, response);
      } 

      /* if move has already been test, dump and go next */
      if(save.has(move_id))
        continue;


      const node_move : Node = {
        parent: target,
        move: move.first,
        heuristic_g: g_cost,
        depth_h: target.depth_h + 1,
        grid: move.second,
        f_cost: target.depth_h + 1 + g_cost
      };

      /* if move is already waiting to be check and this move is worst (f_cost higher) => dump and go brrrr*/
      if(toCheck.has(move_id) && toCheck.get(move_id)!.f_cost < (g_cost + target.depth_h + 1))
        continue
      
      /* finally we add it to the move to check */
      toCheck.set(move_id, node_move)
    }
  }

  return new Pair<number,number[]>(numberOfChecks,[]);
}