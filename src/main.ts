import Taquin from "./Taquin.ts"
import { manhanttan, hamming } from "./utils/heuristic.ts";
import inquirer from "inquirer";

const menu = await inquirer.prompt([
  {
    type: 'list',
    name: 'choice',
    message: 'Mode de jeu ?',
    choices : ['IA', 'Manuel']
  }
]);


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
    
    } catch (error){}
  }
}

if(menu.choice === "Manuel")
  setup();
else {
  const functionChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'fctH',
      message: 'Quelle fonction heuristique utiliser ?',
      choices: ['Hamming', 'Manhanttan']
    }
  ]);

  let fctH : Function | null = null;
  switch(functionChoice.fctH)
  {
    case 'Hamming':
      fctH = hamming;
      break;
    
    case 'Manhanttan':
      fctH = manhanttan;
      break;
    
    default:
      console.error("Error lors du choix de la fonction");
  }

  console.log(fctH)
  //if(fctH !== null);
    //solver(fctH);
}