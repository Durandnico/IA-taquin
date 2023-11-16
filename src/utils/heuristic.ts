import Pair from "./Pair.ts";

export const manhanttan = (grid: Array<Array<number>>) => {
  let data : Array<Pair<number, number>> = [new Pair(grid.length - 1, grid[grid.length - 1].length - 1)];
  for(let i = 0; i < grid.length; ++i)
    for(let j = 0; j < grid[i].length; ++j)
      data.push(new Pair(i,j))
  
  let response : number = 0;
  for(let i = 0; i < grid.length; ++i)
    for(let j = 0; j < grid[i].length; ++j) 
      response += Math.abs(i - data[grid[i][j]].first) + Math.abs(j - data[grid[i][j]].second);
        

  return response;
}

export const hamming = (grid: Array<Array<number>>) => {
  let data : Array<Pair<number, number>> = [new Pair(grid.length - 1, grid[grid.length - 1].length - 1)];
  for(let i = 0; i < grid.length; ++i)
    for(let j = 0; j < grid[i].length; ++j)
      data.push(new Pair(i,j))
  
  let response : number = 0;
  for(let i = 0; i < grid.length; ++i)
    for(let j = 0; j < grid[i].length; ++j) 
        response += (i === data[grid[i][j]].first && j === data[grid[i][j]].second) ? 0 : 1;

  return response;
}