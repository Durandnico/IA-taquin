import Pair from "./Pair.ts";

export const manhanttan = (grid: Array<Array<number>>) => {
  const data : Array<Pair<number, number>> = solutionGird(grid.length, grid[grid.length - 1].length);
  
  let response : number = 0;
  for(let i = 0; i < grid.length; ++i)
    for(let j = 0; j < grid[i].length; ++j) 
      response += Math.abs(i - data[grid[i][j]].first) + Math.abs(j - data[grid[i][j]].second);
        

  return response;
}

export const hamming = (grid: Array<Array<number>>) => {
  const data : Array<Pair<number, number>> = solutionGird(grid.length, grid[grid.length - 1].length);

  let response : number = 0;
  for(let i = 0; i < grid.length; ++i)
    for(let j = 0; j < grid[i].length; ++j) 
          response += (i == data[grid[i][j]].first && j == data[grid[i][j]].second) ? 0 : 1;
        
  return response;
}

function solutionGird(width : number, height : number) : Array<Pair<number, number>> {
  let response : Array<Pair<number, number>> = [new Pair(height - 1, width - 1)];
  for(let i = 0; i < height; ++i)
    for(let j = 0; j < width; ++j)
      response.push(new Pair(i,j))

    return response;
}