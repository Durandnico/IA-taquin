import Taquin from "./Taquin.ts"
import inquirer from "inquirer";

async function setup() {
  let game : Taquin = new Taquin();

  game.render();

  while(!game.isWin())
  {
    const answer = await inquirer.prompt([
      {
        type: 'number',
        name: 'move',
        message: 'What move would you like to play ? '
      }
    ]);
    try {
      if(!game.move(answer.move))
        console.warn("Impossible move");
    } catch (error) {
    }
  }
}

setup();